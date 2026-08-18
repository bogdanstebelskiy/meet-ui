"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useMeetingRoom } from "@/providers/meeting-room-provider";
import { useTileOrder } from "@/hooks/use-tile-order";
import { LocalTile } from "@/components/meeting/tiles/local-tile";
import { PeerTile } from "@/components/meeting/tiles/peer-tile";
import { SoloLayout } from "@/components/meeting/layouts/solo-layout";
import { DuoLayout } from "@/components/meeting/layouts/duo-layout";
import { GridLayout } from "@/components/meeting/layouts/grid-layout";
import { CallControls } from "@/components/meeting/call-controls";
import { ChatPanel } from "@/components/meeting/chat-panel";
import { LOCAL_TILE_ID } from "@/constants/meeting";

export default function MeetingRoom() {
  const router = useRouter();
  const { localStream, peers, isMicOn, isCamOn, toggleMic, toggleCam, leave } = useMeetingRoom();
  const { order, reorder } = useTileOrder(peers);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const localTile = <LocalTile key={LOCAL_TILE_ID} stream={localStream} isCamOn={isCamOn} />;

  const tilesById = new Map<string, ReactNode>();

  tilesById.set(LOCAL_TILE_ID, localTile);
  peers.forEach((peer) => {
    tilesById.set(
      peer.peerId,
      <PeerTile
        key={peer.peerId}
        displayName={peer.displayName}
        videoTrack={peer.videoTrack}
        audioTrack={peer.audioTrack}
        videoMuted={peer.videoMuted}
      />,
    );
  });

  const handleLeave = () => {
    leave();
    router.push("/landing/meets");
  };

  const totalTiles = 1 + peers.length;

  return (
    <section className="relative flex h-screen w-full overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        {totalTiles === 1 && <SoloLayout localTile={localTile} />}
        {totalTiles === 2 && <DuoLayout localTile={localTile} peerTile={tilesById.get(peers[0].peerId)} />}
        {totalTiles > 2 && <GridLayout order={order} onReorder={reorder} tilesById={tilesById} />}

        <CallControls
          isMicOn={isMicOn}
          isCamOn={isCamOn}
          isChatOpen={isChatOpen}
          onToggleMic={toggleMic}
          onToggleCam={toggleCam}
          onToggleChat={() => setIsChatOpen((open) => !open)}
          onLeave={handleLeave}
        />
      </div>

      <ChatPanel open={isChatOpen} onOpenChange={setIsChatOpen} />
    </section>
  );
}
