"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMeetingRoom } from "@/providers/meeting-room-provider";
import Loader from "@/components/loader";

interface MeetingSetupProps {
  onSetupComplete: () => void;
}

export default function MeetingSetup({ onSetupComplete }: MeetingSetupProps) {
  const { status, error, localStream, isMicOn, isCamOn, toggleMic, toggleCam, join } = useMeetingRoom();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (status === "connected") {
      onSetupComplete();
    }
  }, [status, onSetupComplete]);

  const startMutedChecked = !isMicOn || !isCamOn;

  const handleStartMutedChange = (checked: boolean) => {
    const wantOn = !checked;
    if (isMicOn !== wantOn) {
      toggleMic();
    }
    if (isCamOn !== wantOn) {
      toggleCam();
    }
  };

  if (!localStream && !error) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-bold">Setup</h1>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full max-w-xl rounded-lg border border-border bg-muted"
      />

      <div className="flex h-16 items-center justify-center gap-3">
        <Label className="cursor-pointer">
          <Switch checked={startMutedChecked} onCheckedChange={handleStartMutedChange} />
          Join with microphone and camera off
        </Label>
      </div>

      <Button onClick={() => void join()} disabled={status === "connecting" || !localStream} className="rounded-md px-4 py-2.5">
        {status === "connecting" ? "Joining..." : "Join"}
      </Button>
    </div>
  );
}
