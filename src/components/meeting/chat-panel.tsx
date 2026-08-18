"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMeetingRoom } from "@/providers/meeting-room-provider";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatPanel({ open, onOpenChange }: ChatPanelProps) {
  const { messages, sendMessage } = useMeetingRoom();
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const sendDraft = () => {
    const body = draft.trim();

    if (!body) return;

    setDraft("");
    void sendMessage(body);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendDraft();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0 p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Chat</SheetTitle>
        </SheetHeader>
        <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id} className="text-sm">
              <span className="font-medium">{message.displayName}: </span>
              <span className="text-muted-foreground">{message.body}</span>
            </div>
          ))}
        </div>
        <SheetFooter className="flex-row items-center border-t border-border p-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message"
          />
          <Button size="sm" onClick={sendDraft}>
            Send
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
