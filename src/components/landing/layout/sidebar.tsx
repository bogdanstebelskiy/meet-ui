"use client";

import { Video, Phone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface MeetSidebarProps {
  isOpen: boolean;
}

export function MeetSidebar({ isOpen }: MeetSidebarProps) {
  const pathname = usePathname();

  const isMeets = pathname.startsWith("/landing/meets");
  const isCalls = pathname.startsWith("/landing/calls");

  return (
    <aside
      className={cn(
        "bg-background transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "md:w-64 opacity-100" : "w-0 opacity-0",
      )}
    >
      <nav
        className={cn("space-y-1 p-2 transition-opacity duration-300", isOpen ? "opacity-100 delay-150" : "opacity-0")}
      >
        <Link
          href="/landing/meets"
          className={cn(
            "flex items-center gap-3 rounded-lg px-4 py-3 font-medium whitespace-nowrap transition-colors",
            isMeets
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <Video className="h-5 w-5 flex-shrink-0" />
          <span className="hidden sm:inline">Meets</span>
        </Link>

        <Link
          href="/landing/calls"
          className={cn(
            "flex items-center gap-3 rounded-lg px-4 py-3 font-medium whitespace-nowrap transition-colors",
            isCalls
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <Phone className="h-5 w-5 flex-shrink-0" />
          <span className="hidden sm:inline">Calls</span>
        </Link>
      </nav>
    </aside>
  );
}
