"use client";

import type { ReactNode } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { SortableTile } from "@/components/meeting/tiles/sortable-tile";
import { computeRowSizes, getTileStyle, rowOfEachIndex } from "@/helpers/tile-layout";
import { useElementSize } from "@/hooks/use-element-size";
import type { DragEndEvent } from "@/types/meeting";

interface GridLayoutProps {
  order: string[];
  onReorder: (event: DragEndEvent) => void;
  tilesById: Map<string, ReactNode>;
}

export function GridLayout({ order, onReorder, tilesById }: GridLayoutProps) {
  const { ref: gridRef, size: gridSize } = useElementSize();
  const rowSizes = computeRowSizes(order.length, gridSize.width, gridSize.height);
  const rowOfIndex = rowOfEachIndex(rowSizes);
  const rowCount = rowSizes.length;

  return (
    <div ref={gridRef} className="flex flex-1 flex-wrap content-start gap-4 overflow-hidden p-4">
      <DragDropProvider onDragEnd={onReorder}>
        {order.map((id, i) => {
          const tile = tilesById.get(id);

          if (!tile) {
            return null;
          }

          const columnCount = rowSizes[rowOfIndex[i]];

          return (
            <SortableTile key={id} id={id} index={i} style={getTileStyle(columnCount, rowCount)}>
              {tile}
            </SortableTile>
          );
        })}
      </DragDropProvider>
    </div>
  );
}
