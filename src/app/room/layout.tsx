import React from "react";
import StreamClientProvider from "@/providers/StreamClientProvider";

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return <StreamClientProvider>{children}</StreamClientProvider>;
}
