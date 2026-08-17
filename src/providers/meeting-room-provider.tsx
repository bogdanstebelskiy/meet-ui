"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { RoomClient } from "@/lib/ws/room/client";
import { ChatClient } from "@/lib/ws/chat/client";
import { SignalingSocket } from "@/lib/ws/signaling-socket";
import type {
  ConnectionState,
  ConsumerKind,
  PeerInfo,
  RoomClientToServerEvents,
  RoomServerToClientEvents,
} from "@/lib/ws/room/types";
import type { ChatClientToServerEvents, ChatMessage, ChatServerToClientEvents } from "@/lib/ws/chat/types";
import { clientConfig } from "@/config/client";

interface PeerState {
  peerId: string;
  displayName: string;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
  videoMuted?: boolean;
  audioMuted?: boolean;
}

type MeetingRoomStatus = ConnectionState | "idle";

interface MeetingRoomContextValue {
  status: MeetingRoomStatus;
  error: string | null;
  localStream: MediaStream | null;
  isMicOn: boolean;
  isCamOn: boolean;
  peers: PeerState[];
  messages: ChatMessage[];
  join: () => Promise<void>;
  leave: () => void;
  toggleMic: () => void;
  toggleCam: () => void;
  sendMessage: (body: string) => Promise<void>;
}

const MeetingRoomContext = createContext<MeetingRoomContextValue | undefined>(undefined);

export function useMeetingRoom() {
  const context = useContext(MeetingRoomContext);

  if (!context) {
    throw new Error("useMeetingRoom must be used within MeetingRoomProvider");
  }

  return context;
}

interface MeetingRoomProviderProps {
  roomId: string;
  displayName: string;
  children: ReactNode;
}

export function MeetingRoomProvider({ roomId, displayName, children }: MeetingRoomProviderProps) {
  const [status, setStatus] = useState<MeetingRoomStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [peersById, setPeersById] = useState<Record<string, PeerState>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const clientRef = useRef<RoomClient | null>(null);
  const chatClientRef = useRef<ChatClient | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const isMicOnRef = useRef(true);
  const isCamOnRef = useRef(true);
  const lastMessageIdRef = useRef<string | undefined>(undefined);

  const teardownConnection = () => {
    clientRef.current?.close();
    clientRef.current = null;
    chatClientRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    lastMessageIdRef.current = undefined;
  };

  useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        localStreamRef.current = stream;
        setLocalStream(stream);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Camera/microphone access denied"));

    return () => {
      cancelled = true;
      teardownConnection();
    };
  }, []);

  const upsertPeer = (peerId: string, patch: Partial<PeerState>) => {
    setPeersById((prev) => ({
      ...prev,
      [peerId]: {
        ...prev[peerId],
        peerId,
        displayName: prev[peerId]?.displayName ?? peerId,
        ...patch,
      },
    }));
  };

  // Replaces the whole peer list - used on rejoin, since old peer state (tracks,
  // mute flags) is no longer valid once transports/consumers were torn down.
  const resetPeers = (peers: PeerInfo[]) => {
    const next: Record<string, PeerState> = {};
    peers.forEach((peer) => {
      next[peer.id] = { peerId: peer.id, displayName: peer.displayName };
    });
    setPeersById(next);
  };

  const applyMuteState = async (client: RoomClient) => {
    if (!isMicOnRef.current) {
      await client.pauseProducer("audio");
    }
    if (!isCamOnRef.current) {
      await client.pauseProducer("video");
    }
  };

  const join = async () => {
    if (clientRef.current || !localStreamRef.current) {
      return;
    }

    setError(null);

    const signalingSocket = new SignalingSocket<
      RoomServerToClientEvents & ChatServerToClientEvents,
      RoomClientToServerEvents & ChatClientToServerEvents
    >(clientConfig.NEXT_PUBLIC_SIGNALING_URL);

    const chatClient = new ChatClient(signalingSocket, roomId, {
      onMessage: (message) => {
        lastMessageIdRef.current = message.id;
        setMessages((prev) => [...prev, message]);
      },
    });
    chatClientRef.current = chatClient;

    // Fetches only messages sent while disconnected and merges them in - full
    // history was already loaded once below, right after the initial join.
    const resumeChatHistory = async () => {
      const missed = await chatClient.loadHistory(lastMessageIdRef.current);
      if (missed.length === 0) {
        return;
      }

      lastMessageIdRef.current = missed[missed.length - 1].id;
      setMessages((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        const fresh = missed.filter((m) => !seen.has(m.id));
        return fresh.length > 0 ? [...prev, ...fresh] : prev;
      });
    };

    const handleRejoined = (existingPeers: PeerInfo[]) => {
      resetPeers(existingPeers);
      void applyMuteState(client);
      void resumeChatHistory().catch((err) => console.error("Failed to refresh chat history after rejoin:", err));
    };

    const client = new RoomClient(signalingSocket, roomId, displayName, {
      onPeerJoined: (peer: PeerInfo) => upsertPeer(peer.id, { displayName: peer.displayName }),
      onPeerLeft: (peerId) => {
        setPeersById((prev) => {
          const next = { ...prev };
          delete next[peerId];
          return next;
        });
      },
      onRemoteTrack: ({ peerId, kind, track }) => {
        upsertPeer(peerId, kind === "video" ? { videoTrack: track } : { audioTrack: track });
      },
      onRemoteProducerPaused: (peerId, kind: ConsumerKind) => {
        upsertPeer(peerId, kind === "video" ? { videoMuted: true } : { audioMuted: true });
      },
      onRemoteProducerResumed: (peerId, kind: ConsumerKind) => {
        upsertPeer(peerId, kind === "video" ? { videoMuted: false } : { audioMuted: false });
      },
      onConnectionStateChange: setStatus,
      onRejoined: handleRejoined,
    });
    clientRef.current = client;

    try {
      const existingPeers = await client.join({
        audio: localStreamRef.current.getAudioTracks()[0],
        video: localStreamRef.current.getVideoTracks()[0],
      });

      await applyMuteState(client);
      existingPeers.forEach((peer) => upsertPeer(peer.id, { displayName: peer.displayName }));

      const history = await chatClient.loadHistory();
      if (history.length > 0) {
        lastMessageIdRef.current = history[history.length - 1].id;
      }
      setMessages(history);
    } catch (err) {
      clientRef.current = null;
      chatClientRef.current = null;
      setError(err instanceof Error ? err.message : "Failed to join meeting");
    }
  };

  const sendMessage = async (body: string) => {
    await chatClientRef.current?.send(body);
  };

  const leave = () => {
    teardownConnection();
    setLocalStream(null);
    setMessages([]);
    setPeersById({});
    setStatus("idle");
  };

  const toggleMic = () => {
    const next = !isMicOn;
    setIsMicOn(next);
    isMicOnRef.current = next;

    if (clientRef.current) {
      void (next ? clientRef.current.resumeProducer("audio") : clientRef.current.pauseProducer("audio"));
    } else {
      localStreamRef.current?.getAudioTracks().forEach((track) => (track.enabled = next));
    }
  };

  const toggleCam = () => {
    const next = !isCamOn;
    setIsCamOn(next);
    isCamOnRef.current = next;

    if (clientRef.current) {
      void (next ? clientRef.current.resumeProducer("video") : clientRef.current.pauseProducer("video"));
    } else {
      localStreamRef.current?.getVideoTracks().forEach((track) => (track.enabled = next));
    }
  };

  return (
    <MeetingRoomContext.Provider
      value={{
        status,
        error,
        localStream,
        isMicOn,
        isCamOn,
        peers: Object.values(peersById),
        messages,
        join,
        leave,
        toggleMic,
        toggleCam,
        sendMessage,
      }}
    >
      {children}
    </MeetingRoomContext.Provider>
  );
}
