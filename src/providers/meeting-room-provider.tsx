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
      clientRef.current?.close();
      clientRef.current = null;
      chatClientRef.current = null;
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
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
      onMessage: (message) => setMessages((prev) => [...prev, message]),
    });
    chatClientRef.current = chatClient;

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
    });
    clientRef.current = client;

    try {
      const existingPeers = await client.join({
        audio: localStreamRef.current.getAudioTracks()[0],
        video: localStreamRef.current.getVideoTracks()[0],
      });

      if (!isMicOn) {
        await client.pauseProducer("audio");
      }
      if (!isCamOn) {
        await client.pauseProducer("video");
      }

      existingPeers.forEach((peer) => upsertPeer(peer.id, { displayName: peer.displayName }));

      const history = await chatClient.loadHistory();
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
    clientRef.current?.close();
    clientRef.current = null;
    chatClientRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setMessages([]);
    setPeersById({});
    setStatus("idle");
  };

  const toggleMic = () => {
    const next = !isMicOn;
    setIsMicOn(next);

    if (clientRef.current) {
      void (next ? clientRef.current.resumeProducer("audio") : clientRef.current.pauseProducer("audio"));
    } else {
      localStreamRef.current?.getAudioTracks().forEach((track) => (track.enabled = next));
    }
  };

  const toggleCam = () => {
    const next = !isCamOn;
    setIsCamOn(next);

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
