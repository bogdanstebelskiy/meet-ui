"use client";

import { useRef, useState, type ReactNode } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { DraggablePip } from "@/components/meeting/tiles/draggable-pip";
import { getNearestCorner } from "@/helpers/pip-corner";
import type { Corner } from "@/types/meeting";

interface DuoLayoutProps {
  localTile: ReactNode;
  peerTile: ReactNode;
}

export function DuoLayout({ localTile, peerTile }: DuoLayoutProps) {
  const [pipCorner, setPipCorner] = useState<Corner>("bottom-right");
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative flex flex-1 overflow-hidden p-4">
      {peerTile}
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled || !containerRef.current) {
            return;
          }

          const rect = containerRef.current.getBoundingClientRect();
          setPipCorner(getNearestCorner(rect, event.operation.position.current));
        }}
      >
        <DraggablePip corner={pipCorner}>{localTile}</DraggablePip>
      </DragDropProvider>
    </div>
  );
}
