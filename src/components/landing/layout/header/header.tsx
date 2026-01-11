"use client";

import { Menu, HelpCircle, MessageSquare, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as formatters from "@/lib/formatters";
import Link from "next/link";
import UserAvatar from "@/components/landing/layout/header/user-avatar";
import SettingsDialog from "@/components/landing/layout/header/settings-dialog";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface MeetHeaderProps {
  onMenuClick: () => void;
}

export function MeetHeader({ onMenuClick }: MeetHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:inline-flex">
          <Menu className="size-5" />
        </Button>
        <Link href="/landing">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-600" />
            <span className="hidden md:block text-2xl font-medium text-muted-foreground">Meeting Application</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-8">
        <div>
          <span className="hidden text-md font-semibold text-muted-foreground md:inline">
            {formatters.formatDate(new Date())}
          </span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <HelpCircle className="size-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="size-6" />
          </Button>
          <SettingsDialog />
          <Button variant="ghost" size="icon">
            <Grid3x3 className="size-6" />
          </Button>
          <ThemeToggle />
        </div>
        <div>
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
