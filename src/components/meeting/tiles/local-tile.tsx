"use client";

import { useEffect, useRef } from "react";
import { useUserSettingsContext } from "@/context/settings-context";
import { cn } from "@/lib/utils";

interface LocalTileProps {
  stream: MediaStream | null;
  isCamOn: boolean;
  showLabel?: boolean;
}

export function LocalTile({ stream, isCamOn, showLabel = true }: LocalTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { videoSettings } = useUserSettingsContext();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-muted">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={cn("h-full w-full object-cover", videoSettings.mirrorCamera && "-scale-x-100")}
      />
      {!isCamOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-sm text-muted-foreground">
          Camera off
        </div>
      )}
      {showLabel && (
        <span className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 text-xs">You</span>
      )}
    </div>
  );
}
