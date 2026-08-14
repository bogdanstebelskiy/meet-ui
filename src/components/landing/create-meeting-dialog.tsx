"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Link } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { toast } from "sonner";
import { generateMeetCode } from "@/lib/generators";
import { clientConfig } from "@/config/client";
import { useMeeting } from "@/hooks/use-meeting";

export default function CreateMeetingDialog() {
  const [code] = useState(generateMeetCode());
  const link = `${clientConfig.NEXT_PUBLIC_BASE_URL}/meeting/${code}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(link);

    toast("Copied to clipboard", {
      position: "bottom-left",
      id: "clipboard-toast",
    });
  };

  const { createMeeting } = useMeeting();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => createMeeting(code)}
          variant="ghost"
          size="lg"
          className="flex justify-start w-full rounded-none"
        >
          <Link className="h-5 w-5" />
          Create meeting
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-[400px]">
        <VisuallyHidden>
          <DialogTitle>MeetingDialog</DialogTitle>
        </VisuallyHidden>

        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Meeting connection information</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          <p className="py-4 text-sm text-muted-foreground">
            Send this information to participants you want to invite. Copy if you are planning meeting later.
          </p>

          <div className="flex items-center justify-between rounded-lg bg-muted/50 border text-lg font-medium py-2 px-3">
            <span>{link}</span>
            <Button variant="ghost" onClick={copyToClipboard}>
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
