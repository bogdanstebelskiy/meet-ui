import { types as mediasoupTypes } from "mediasoup-client";

export type ConsumerKind = mediasoupTypes.MediaKind;

export type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

export type TransportDirection = "send" | "recv";

export interface PeerInfo {
  id: string;
  displayName: string;
}

export interface RemoteTrackInfo {
  peerId: string;
  kind: ConsumerKind;
  track: MediaStreamTrack;
}

export interface RoomClientHandlers {
  onPeerJoined(peer: PeerInfo): void;
  onPeerLeft(peerId: string): void;
  onRemoteTrack(info: RemoteTrackInfo): void;
  onRemoteProducerPaused(peerId: string, kind: ConsumerKind): void;
  onRemoteProducerResumed(peerId: string, kind: ConsumerKind): void;
  onConnectionStateChange(state: ConnectionState): void;
}

export interface ProducerRef {
  peerId: string;
  producerId: string;
}

export interface ExistingProducerPayload extends ProducerRef {
  kind: ConsumerKind;
}

export interface ServerToClientEvents {
  newPeer: (peer: PeerInfo) => void;
  newProducer: (payload: ExistingProducerPayload) => void;
  peerClosed: (payload: { peerId: string }) => void;
  producerPaused: (payload: ProducerRef) => void;
  producerResumed: (payload: ProducerRef) => void;
}

export interface ClientToServerEvents {
  join: (
    p: { roomId: string; displayName: string },
    ack: (r: { peerId: string; existingPeers: PeerInfo[] }) => void,
  ) => void;
  getRouterRtpCapabilities: (ack: (r: mediasoupTypes.RtpCapabilities) => void) => void;
  createWebRtcTransport: (
    p: { direction: TransportDirection },
    ack: (r: mediasoupTypes.TransportOptions) => void,
  ) => void;
  connectWebRtcTransport: (
    p: { transportId: string; dtlsParameters: mediasoupTypes.DtlsParameters },
    ack: (r: { connected: true }) => void,
  ) => void;
  produce: (
    p: { transportId: string; kind: ConsumerKind; rtpParameters: mediasoupTypes.RtpParameters },
    ack: (r: { id: string }) => void,
  ) => void;
  consume: (
    p: { producerId: string; rtpCapabilities: mediasoupTypes.RtpCapabilities },
    ack: (r: {
      id: string;
      producerId: string;
      kind: ConsumerKind;
      rtpParameters: mediasoupTypes.RtpParameters;
    }) => void,
  ) => void;
  resumeConsumer: (p: { consumerId: string }, ack: (r: { resumed: true }) => void) => void;
  pauseProducer: (p: { producerId: string }, ack: (r: { paused: true }) => void) => void;
  resumeProducer: (p: { producerId: string }, ack: (r: { resumed: true }) => void) => void;
}
