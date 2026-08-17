"use client";

import type { CSSProperties, ReactNode } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { cn } from "@/lib/utils";

export function SortableTile({
  id,
  index,
  style,
  children,
}: {
  id: string;
  index: number;
  style: CSSProperties;
  children: ReactNode;
}) {
  const { ref, isDragging } = useSortable({ id, index, transition: { duration: 750, idle: true } });

  return (
    <div ref={ref} style={style} className={cn("min-w-0 cursor-grab", isDragging && "opacity-50")}>
      {children}
    </div>
  );
}
