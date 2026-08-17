"use client";

import { useEffect, useRef } from "react";

interface PeerTileProps {
  displayName: string;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
  videoMuted?: boolean;
}

export function PeerTile({ displayName, videoTrack, audioTrack, videoMuted }: PeerTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = videoTrack ? new MediaStream([videoTrack]) : null;
    }
  }, [videoTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.srcObject = audioTrack ? new MediaStream([audioTrack]) : null;
    }
  }, [audioTrack]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-muted">
      <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
      <audio ref={audioRef} autoPlay />
      {(!videoTrack || videoMuted) && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-sm text-muted-foreground">
          {displayName}
        </div>
      )}
      <span className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 text-xs">{displayName}</span>
    </div>
  );
}
