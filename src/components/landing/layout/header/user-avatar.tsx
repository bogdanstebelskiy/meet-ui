"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AvatarFallback } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";

export default function UserAvatar() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-controls="popover">
          <Avatar className="h-8 w-8 bg-purple-600">
            <AvatarFallback className="bg-purple-600 text-white text-lg font-semibold">
              <span className="text-lg font-semibold">B</span>
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 md:w-60 my-1 mx-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Profile</h4>
            <p className="hidden md:inline text-muted-foreground text-sm">User settings go here</p>
            <p className="inline md:hidden text-muted-foreground text-sm">Settings icons</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
