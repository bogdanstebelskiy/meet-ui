"use client";

import { useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useMeetingRoom } from "@/providers/meeting-room-provider";
import { LocalTile } from "@/components/meeting/tiles/local-tile";
import { PeerTile } from "@/components/meeting/tiles/peer-tile";
import { DraggablePip } from "@/components/meeting/tiles/draggable-pip";
import { getNearestCorner } from "@/helpers/pip-corner";
import type { Corner } from "@/types/meeting";

interface DuoLayoutProps {
  localStream: MediaStream | null;
  isCamOn: boolean;
  peer: ReturnType<typeof useMeetingRoom>["peers"][number];
}

export function DuoLayout({ localStream, isCamOn, peer }: DuoLayoutProps) {
  const [pipCorner, setPipCorner] = useState<Corner>("bottom-right");
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative flex flex-1 overflow-hidden p-4">
      <PeerTile
        displayName={peer.displayName}
        videoTrack={peer.videoTrack}
        audioTrack={peer.audioTrack}
        videoMuted={peer.videoMuted}
      />
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled || !containerRef.current) {
            return;
          }
          const rect = containerRef.current.getBoundingClientRect();
          setPipCorner(getNearestCorner(rect, event.operation.position.current));
        }}
      >
        <DraggablePip corner={pipCorner}>
          <LocalTile stream={localStream} isCamOn={isCamOn} />
        </DraggablePip>
      </DragDropProvider>
    </div>
  );
}
