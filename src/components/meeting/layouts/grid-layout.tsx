"use client";

import type { ReactNode } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { SortableTile } from "@/components/meeting/tiles/sortable-tile";
import { computeRowSizes, getTileStyle, rowOfEachIndex } from "@/helpers/tile-layout";
import { useElementSize } from "@/hooks/use-element-size";
import type { DragEndEvent } from "@/types/meeting";

interface GridLayoutProps {
  order: string[];
  tilesById: Map<string, ReactNode>;
  onReorder: (event: DragEndEvent) => void;
}

export function GridLayout({ order, tilesById, onReorder }: GridLayoutProps) {
  const { ref: gridRef, size: gridSize } = useElementSize<HTMLDivElement>();
  const rowSizes = computeRowSizes(order.length, gridSize.width, gridSize.height);
  const rowOfIndex = rowOfEachIndex(rowSizes);

  return (
    <div ref={gridRef} className="flex flex-1 flex-wrap content-start gap-4 overflow-hidden p-4">
      <DragDropProvider onDragEnd={onReorder}>
        {order.map((id, index) => {
          const tile = tilesById.get(id);
          if (!tile) {
            return null;
          }
          const rowCount = rowSizes[rowOfIndex[index]] ?? 1;
          const totalRows = rowSizes.length || 1;
          return (
            <SortableTile key={id} id={id} index={index} style={getTileStyle(rowCount, totalRows)}>
              {tile}
            </SortableTile>
          );
        })}
      </DragDropProvider>
    </div>
  );
}
