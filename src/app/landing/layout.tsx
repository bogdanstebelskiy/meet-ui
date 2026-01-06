"use client";

import React, { useState } from "react";
import { MeetHeader } from "@/components/landing/layout/header/header";
import { MeetSidebar } from "@/components/landing/layout/sidebar";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen flex-col bg-background">
      <MeetHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <MeetSidebar isOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
