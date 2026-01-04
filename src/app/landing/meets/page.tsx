"use client";

import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Meets() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-balance text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
            Video calls and meets for all
          </h1>
          <p className="text-pretty text-base text-muted-foreground md:text-lg">
            This provides video communications for sleeping work and
            entertainment – no matter where you were.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" className="w-full sm:w-auto">
            <Video className="mr-2 h-5 w-5" />
            New meet
          </Button>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Input
              placeholder="Enter meet code or link"
              className="w-full sm:w-64"
            />
            <Button variant="ghost" className="hidden sm:inline-flex">
              Join
            </Button>
          </div>
        </div>

        <Button variant="ghost" className="w-full sm:hidden">
          Join
        </Button>

        <div className="text-center">
          <a href="#" className="text-sm text-primary hover:underline">
            About this app
          </a>
        </div>
      </div>
    </section>
  );
}
