"use client";

import { LocalTile } from "@/components/meeting/tiles/local-tile";

export function SoloLayout({ stream, isCamOn }: { stream: MediaStream | null; isCamOn: boolean }) {
  return (
    <div className="flex flex-1 overflow-hidden p-4">
      <LocalTile stream={stream} isCamOn={isCamOn} />
    </div>
  );
}
