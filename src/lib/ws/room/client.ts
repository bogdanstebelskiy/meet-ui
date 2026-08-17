import { Device, types as mediasoupTypes } from "mediasoup-client";
import { SignalingSocket } from "../signaling-socket";
import type {
  ConsumerKind,
  ExistingProducerPayload,
  PeerInfo,
  RoomClientHandlers,
  RoomClientToServerEvents,
  RoomServerToClientEvents,
} from "./types";

export class RoomClient {
  private readonly device = new Device();
  private sendTransport?: mediasoupTypes.Transport;
  private recvTransport?: mediasoupTypes.Transport;
  private readonly producers = new Map<ConsumerKind, mediasoupTypes.Producer>();
  private readonly consumers = new Map<
    string /* producerId */,
    { consumer: mediasoupTypes.Consumer; peerId: string }
  >();
  private readonly pendingProducers: ExistingProducerPayload[] = [];
  private closed = false;
  private hasJoinedOnce = false;
  private rejoining = false;
  private tracks: { audio?: MediaStreamTrack; video?: MediaStreamTrack } = {};

  constructor(
    private readonly signalingSocket: SignalingSocket<RoomServerToClientEvents, RoomClientToServerEvents>,
    private readonly roomId: string,
    private readonly displayName: string,
    private readonly handlers: RoomClientHandlers,
  ) {
    const socket = this.signalingSocket.raw;

    socket.on("newPeer", (peer) => this.handlers.onPeerJoined(peer));
    socket.on("peerClosed", ({ peerId }) => this.handlePeerClosed(peerId));
    socket.on("newProducer", (payload) => void this.handleNewProducer(payload));

    socket.on("producerPaused", ({ peerId, producerId }) => {
      const kind = this.consumers.get(producerId)?.consumer.kind as ConsumerKind | undefined;

      if (kind) {
        this.handlers.onRemoteProducerPaused(peerId, kind);
      }
    });

    socket.on("producerResumed", ({ peerId, producerId }) => {
      const kind = this.consumers.get(producerId)?.consumer.kind as ConsumerKind | undefined;

      if (kind) {
        this.handlers.onRemoteProducerResumed(peerId, kind);
      }
    });

    socket.on("disconnect", () => {
      if (!this.closed) {
        this.handlers.onConnectionStateChange("disconnected");
      }
    });

    socket.on("connect_error", () => this.handlers.onConnectionStateChange("error"));

    socket.on("connect", () => {
      if (this.hasJoinedOnce && !this.closed && !this.rejoining) {
        void this.rejoin();
      }
    });
  }

  async join(tracks: { audio?: MediaStreamTrack; video?: MediaStreamTrack }): Promise<PeerInfo[]> {
    this.tracks = tracks;
    this.handlers.onConnectionStateChange("connecting");

    await this.signalingSocket.connect();
    const existingPeers = await this.performHandshake();

    this.hasJoinedOnce = true;
    this.handlers.onConnectionStateChange("connected");
    return existingPeers;
  }

  private async rejoin(): Promise<void> {
    this.rejoining = true;
    this.handlers.onConnectionStateChange("connecting");

    // Old transports/producers/consumers are already dead server-side; drop them locally too.
    this.closeMediaResources();

    try {
      const existingPeers = await this.performHandshake();
      this.handlers.onConnectionStateChange("connected");
      this.handlers.onRejoined(existingPeers);
    } catch (error) {
      console.error("Failed to rejoin room:", error);
      this.handlers.onConnectionStateChange("error");
    } finally {
      this.rejoining = false;
    }
  }

  private async performHandshake(): Promise<PeerInfo[]> {
    // Must run first - later calls rely on roomId/peerId this sets server-side.
    const { existingPeers } = await this.signalingSocket.request<{ peerId: string; existingPeers: PeerInfo[] }>(
      "join",
      { roomId: this.roomId, displayName: this.displayName },
    );

    if (!this.device.loaded) {
      const routerRtpCapabilities =
        await this.signalingSocket.request<mediasoupTypes.RtpCapabilities>("getRouterRtpCapabilities");
      await this.device.load({ routerRtpCapabilities });
    }

    await this.createSendTransport();
    await this.createRecvTransport();

    if (this.tracks.audio) {
      await this.produce("audio", this.tracks.audio);
    }

    if (this.tracks.video) {
      await this.produce("video", this.tracks.video);
    }

    // Drain newProducer events that raced ahead of recvTransport creation.
    const queued = this.pendingProducers.splice(0);
    for (const payload of queued) {
      await this.handleNewProducer(payload);
    }

    return existingPeers;
  }

  async pauseProducer(kind: ConsumerKind): Promise<void> {
    const producer = this.producers.get(kind);
    if (!producer) {
      return;
    }

    producer.pause();
    await this.signalingSocket.request("pauseProducer", { producerId: producer.id });
  }

  async resumeProducer(kind: ConsumerKind): Promise<void> {
    const producer = this.producers.get(kind);
    if (!producer) {
      return;
    }

    producer.resume();
    await this.signalingSocket.request("resumeProducer", { producerId: producer.id });
  }

  close(): void {
    if (this.closed) {
      return;
    }
    this.closed = true;

    this.closeMediaResources();
    this.signalingSocket.raw.disconnect();
  }

  private closeMediaResources(): void {
    this.producers.forEach((producer) => this.safeClose(producer, `producer ${producer.id}`));
    this.producers.clear();
    this.consumers.forEach(({ consumer }) => this.safeClose(consumer, `consumer ${consumer.id}`));
    this.consumers.clear();
    this.safeClose(this.sendTransport, "sendTransport");
    this.safeClose(this.recvTransport, "recvTransport");
    this.sendTransport = undefined;
    this.recvTransport = undefined;
  }

  private safeClose(closeable: { close(): void } | undefined, label: string): void {
    if (!closeable) {
      return;
    }

    try {
      closeable.close();
    } catch (error) {
      console.error(`Failed to close ${label}:`, error);
    }
  }

  private async createSendTransport() {
    const params = await this.signalingSocket.request<mediasoupTypes.TransportOptions>("createWebRtcTransport", {
      direction: "send",
    });
    const transport = this.device.createSendTransport({
      ...params,
      dtlsParameters: { ...params.dtlsParameters, role: "auto" },
      iceServers: [],
    });

    transport.on("connect", ({ dtlsParameters }, callback, errback) => {
      this.signalingSocket
        .request("connectWebRtcTransport", { transportId: transport.id, dtlsParameters })
        .then(() => callback())
        .catch(errback);
    });

    transport.on("produce", ({ kind, rtpParameters }, callback, errback) => {
      this.signalingSocket
        .request<{ id: string }>("produce", { transportId: transport.id, kind, rtpParameters })
        .then(({ id }) => callback({ id }))
        .catch(errback);
    });

    this.sendTransport = transport;
  }

  private async createRecvTransport() {
    const params = await this.signalingSocket.request<mediasoupTypes.TransportOptions>("createWebRtcTransport", {
      direction: "recv",
    });
    const transport = this.device.createRecvTransport({
      ...params,
      dtlsParameters: { ...params.dtlsParameters, role: "auto" },
      iceServers: [],
    });

    transport.on("connect", ({ dtlsParameters }, callback, errback) => {
      this.signalingSocket
        .request("connectWebRtcTransport", { transportId: transport.id, dtlsParameters })
        .then(() => callback())
        .catch(errback);
    });

    this.recvTransport = transport;
  }

  private async produce(kind: ConsumerKind, track: MediaStreamTrack) {
    if (!this.sendTransport) {
      throw new Error("sendTransport not ready");
    }

    // stopTracks: false - closing the producer on rejoin must not kill the
    // underlying track, since join() also reuses it for the local preview.
    const producer = await this.sendTransport.produce({ track, stopTracks: false });
    this.producers.set(kind, producer);
  }

  private async handleNewProducer(payload: ExistingProducerPayload) {
    if (!this.recvTransport || !this.device.loaded) {
      this.pendingProducers.push(payload);
      return;
    }

    try {
      const data = await this.signalingSocket.request<{
        id: string;
        producerId: string;
        kind: ConsumerKind;
        rtpParameters: mediasoupTypes.RtpParameters;
        producerPaused: boolean;
      }>("consume", { producerId: payload.producerId, rtpCapabilities: this.device.recvRtpCapabilities });

      const consumer = await this.recvTransport.consume({
        id: data.id,
        producerId: data.producerId,
        kind: data.kind,
        rtpParameters: data.rtpParameters,
      });
      this.consumers.set(payload.producerId, { consumer, peerId: payload.peerId });

      await this.signalingSocket.request("resumeConsumer", { consumerId: consumer.id });

      this.handlers.onRemoteTrack({ peerId: payload.peerId, kind: payload.kind, track: consumer.track });

      if (data.producerPaused) {
        this.handlers.onRemoteProducerPaused(payload.peerId, payload.kind);
      }
    } catch (error) {
      // Usually the peer already left mid-consume; peerClosed cleans up the
      // tile regardless, so this is logged, not surfaced as a user error.
      console.error(`Failed to consume producer ${payload.producerId} from peer ${payload.peerId}:`, error);
    }
  }

  private handlePeerClosed(peerId: string) {
    for (const [producerId, entry] of this.consumers) {
      if (entry.peerId !== peerId) {
        continue;
      }

      this.safeClose(entry.consumer, `consumer ${entry.consumer.id}`);
      this.consumers.delete(producerId);
    }

    this.handlers.onPeerLeft(peerId);
  }
}
