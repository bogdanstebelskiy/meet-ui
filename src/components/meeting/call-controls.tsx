"use client";

import { MessageSquare, Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CallControlsProps {
  isMicOn: boolean;
  isCamOn: boolean;
  isChatOpen: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleChat: () => void;
  onLeave: () => void;
}

export function CallControls({
  isMicOn,
  isCamOn,
  isChatOpen,
  onToggleMic,
  onToggleCam,
  onToggleChat,
  onLeave,
}: CallControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3 border-t border-border bg-background/95 py-4">
      <Button variant={isMicOn ? "outline" : "destructive"} size="icon" onClick={onToggleMic}>
        {isMicOn ? <Mic /> : <MicOff />}
      </Button>
      <Button variant={isCamOn ? "outline" : "destructive"} size="icon" onClick={onToggleCam}>
        {isCamOn ? <Video /> : <VideoOff />}
      </Button>
      <Button variant={isChatOpen ? "secondary" : "outline"} size="icon" onClick={onToggleChat}>
        <MessageSquare />
      </Button>
      <Button variant="destructive" size="icon" onClick={onLeave}>
        <PhoneOff />
      </Button>
    </div>
  );
}
