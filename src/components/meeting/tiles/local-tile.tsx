"use client";

import { useEffect, useRef } from "react";

interface LocalTileProps {
  stream: MediaStream | null;
  isCamOn: boolean;
}

export function LocalTile({ stream, isCamOn }: LocalTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-muted">
      <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
      {!isCamOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-sm text-muted-foreground">
          Camera off
        </div>
      )}
      <span className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 text-xs">You</span>
    </div>
  );
}
