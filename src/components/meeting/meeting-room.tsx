"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useMeetingRoom } from "@/providers/meeting-room-provider";
import { useTileOrder } from "@/hooks/use-tile-order";
import { LocalTile } from "@/components/meeting/tiles/local-tile";
import { PeerTile } from "@/components/meeting/tiles/peer-tile";
import { SoloLayout } from "@/components/meeting/layouts/solo-layout";
import { DuoLayout } from "@/components/meeting/layouts/duo-layout";
import { GridLayout } from "@/components/meeting/layouts/grid-layout";
import { CallControls } from "@/components/meeting/call-controls";
import { LOCAL_TILE_ID } from "@/constants/meeting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ChatPanel() {
  const { messages, sendMessage } = useMeetingRoom();
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const handleSend = () => {
    const body = draft.trim();
    if (!body) {
      return;
    }
    setDraft("");
    void sendMessage(body);
  };

  return (
    <aside className="flex w-72 flex-col border-l border-border bg-background/95">
      <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((message) => (
          <div key={message.id} className="text-sm">
            <span className="font-medium">{message.displayName}: </span>
            <span className="text-muted-foreground">{message.body}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-border p-3">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Message"
        />
        <Button size="sm" onClick={handleSend}>
          Send
        </Button>
      </div>
    </aside>
  );
}

export default function MeetingRoom() {
  const router = useRouter();
  const { localStream, peers, isMicOn, isCamOn, toggleMic, toggleCam, leave } = useMeetingRoom();
  const { order, reorder } = useTileOrder(peers);

  const tilesById = new Map<string, ReactNode>([
    [LOCAL_TILE_ID, <LocalTile key={LOCAL_TILE_ID} stream={localStream} isCamOn={isCamOn} />],
    ...peers.map(
      (peer) =>
        [
          peer.peerId,
          <PeerTile
            key={peer.peerId}
            displayName={peer.displayName}
            videoTrack={peer.videoTrack}
            audioTrack={peer.audioTrack}
            videoMuted={peer.videoMuted}
          />,
        ] as const,
    ),
  ]);

  const handleLeave = () => {
    leave();
    router.push("/landing/meets");
  };

  const totalTiles = 1 + peers.length;

  return (
    <section className="relative flex h-screen w-full overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        {totalTiles === 1 && <SoloLayout stream={localStream} isCamOn={isCamOn} />}
        {totalTiles === 2 && <DuoLayout localStream={localStream} isCamOn={isCamOn} peer={peers[0]} />}
        {totalTiles > 2 && <GridLayout order={order} tilesById={tilesById} onReorder={reorder} />}

        <CallControls
          isMicOn={isMicOn}
          isCamOn={isCamOn}
          onToggleMic={toggleMic}
          onToggleCam={toggleCam}
          onLeave={handleLeave}
        />
      </div>

      {/*<ChatPanel />*/}
    </section>
  );
}
