"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMeetingRoom } from "@/providers/meeting-room-provider";

function LocalTile({ stream, isCamOn }: { stream: MediaStream | null; isCamOn: boolean }) {
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

interface PeerTileProps {
  displayName: string;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
  videoMuted?: boolean;
}

function PeerTile({ displayName, videoTrack, audioTrack, videoMuted }: PeerTileProps) {
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

export default function MeetingRoom() {
  const router = useRouter();
  const { localStream, peers, isMicOn, isCamOn, toggleMic, toggleCam, leave } = useMeetingRoom();

  const handleLeave = () => {
    leave();
    router.push("/landing/meets");
  };

  return (
    <section className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="grid flex-1 auto-rows-[minmax(220px,1fr)] grid-cols-1 gap-4 overflow-y-auto p-4 sm:grid-cols-2 lg:grid-cols-3">
        <LocalTile stream={localStream} isCamOn={isCamOn} />
        {peers.map((peer) => (
          <PeerTile
            key={peer.peerId}
            displayName={peer.displayName}
            videoTrack={peer.videoTrack}
            audioTrack={peer.audioTrack}
            videoMuted={peer.videoMuted}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 border-t border-border bg-background/95 py-4">
        <Button variant={isMicOn ? "outline" : "destructive"} size="icon" onClick={toggleMic}>
          {isMicOn ? <Mic /> : <MicOff />}
        </Button>
        <Button variant={isCamOn ? "outline" : "destructive"} size="icon" onClick={toggleCam}>
          {isCamOn ? <Video /> : <VideoOff />}
        </Button>
        <Button variant="destructive" size="icon" onClick={handleLeave}>
          <PhoneOff />
        </Button>
      </div>
    </section>
  );
}
