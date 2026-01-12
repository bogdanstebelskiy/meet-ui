"use client";

import { Button } from "@/components/ui/button";
import { Video, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CreateMeetingDialog from "@/components/landing/create-meeting-dialog";
import { useState } from "react";
import { redirect } from "next/navigation";
import { config } from "@/config";

export default function Meets() {
  const [joinCode, setJoinCode] = useState("");

  const handleJoinRoom = () => {
    if (joinCode.includes(config.BASE_URL)) {
      redirect(`/${joinCode.split("/").pop()}`);
    }

    redirect(`/${joinCode}`);
  };

  return (
    <section className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8">
      <div className="w-full max-w-3xl space-y-8 animate-in fade-in duration-1500 ease-out">
        <div className="space-y-4 text-center">
          <h1 className="text-balance text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
            Video calls and meet for all
          </h1>
          <p className="text-pretty text-base text-muted-foreground md:text-lg">
            Meeting Application provides video calling for collaboration and fun — no matter where you are.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Popover>
            <PopoverTrigger asChild aria-controls="popover">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Video className="mr-2 h-5 w-5" />
                New meet
              </Button>
            </PopoverTrigger>

            <PopoverContent className="px-0 py-2">
              <CreateMeetingDialog />

              <Button variant="ghost" size="lg" className="flex justify-start w-full rounded-none">
                <Plus className="h-5 w-5" />
                Start instant meeting
              </Button>
            </PopoverContent>
          </Popover>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Input
              onChange={(e) => setJoinCode(e.target.value)}
              value={joinCode}
              placeholder="Enter meet code or link"
              className="w-full sm:w-64"
            />
            <Button onClick={handleJoinRoom} variant="ghost" className="hidden sm:inline-flex">
              Join
            </Button>
          </div>
        </div>
        <Button variant="ghost" className="w-full sm:hidden">
          Join
        </Button>

        <div className="text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            About Meeting Application
          </a>
        </div>
      </div>
    </section>
  );
}
