"use client";

import { Button } from "@/components/ui/button";
import { Video, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CreateMeetingDialog from "@/components/landing/create-meeting-dialog";
import { useState } from "react";
import { redirect } from "next/navigation";
import { clientConfig } from "@/config/client";
import { z } from "zod";

const joinCodeSchema = z
  .string()
  .min(1, "Meeting code cannot be empty")
  .refine((value) => {
    const code = value.replace(clientConfig.NEXT_PUBLIC_BASE_URL, "").replace(/^\/+/, "");
    return /^[a-zA-Z0-9-]+$/.test(code);
  }, "Can't use this symbol here.");

export default function Meets() {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  const extractCode = (value: string) => {
    return value.replace(clientConfig.NEXT_PUBLIC_BASE_URL, "").replace(/^\/+/, "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJoinCode(value);

    if (!value) {
      setError("");
      return;
    }

    const result = joinCodeSchema.safeParse(value);
    setError(result.success ? "" : result.error.issues[0].message);
  };

  const handleJoinRoom = async () => {
    const result = joinCodeSchema.safeParse(joinCode);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    const code = extractCode(joinCode);

    redirect(`/room/${code}`);
  };

  const isJoinDisabled = !joinCode || !!error;

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
          <div className="flex w-full flex-col gap-1 sm:w-auto">
            <div className="flex flex-col md:flex-row items-center gap-2 md:items-start">
              <Popover>
                <PopoverTrigger asChild aria-controls="popover">
                  <Button size="lg" className="h-[36px] bg-blue-600 hover:bg-blue-700 mb-2">
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
              <div className="flex flex-col items-center">
                <Input
                  onChange={handleInputChange}
                  value={joinCode}
                  placeholder="Enter meet code or link"
                  className={`w-full sm:w-64 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {error && <p className="text-xs text-red-500 px-1 pt-2">{error}</p>}
              </div>
              <Button disabled={isJoinDisabled} onClick={handleJoinRoom} variant="ghost" className="w-full sm:w-auto">
                Join
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            About Meeting Application
          </a>
        </div>
      </div>
    </section>
  );
}
