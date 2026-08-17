"use client";

import type { ReactNode } from "react";
import { useDraggable } from "@dnd-kit/react";
import { cn } from "@/lib/utils";
import { CORNER_CLASSES } from "@/constants/meeting";
import type { Corner } from "@/types/meeting";

export function DraggablePip({ corner, children }: { corner: Corner; children: ReactNode }) {
  const { ref, isDragging } = useDraggable({ id: "local-pip" });

  return (
    <div
      ref={ref}
      className={cn(
        "absolute aspect-video w-40 cursor-grab shadow-lg sm:w-52 lg:w-60",
        CORNER_CLASSES[corner],
        isDragging && "opacity-70",
      )}
    >
      {children}
    </div>
  );
}
