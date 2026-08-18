"use client";

import type { ReactNode } from "react";

interface SoloLayoutProps {
  localTile: ReactNode;
}

export function SoloLayout({ localTile }: SoloLayoutProps) {
  return <div className="flex flex-1 overflow-hidden p-4">{localTile}</div>;
}
