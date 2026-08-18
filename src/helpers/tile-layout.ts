import type { CSSProperties } from "react";
import { GRID_GAP_PX } from "@/constants/meeting";

/**
 * Splits tiles into rows using the fewest rows that keep the widest row
 * above the minimum tile aspect ratio.
 */
export function computeRowSizes(tileCount: number, width: number, height: number, minAspect = 0.5): number[] {
  if (tileCount <= 0 || width <= 0 || height <= 0) {
    return tileCount > 0 ? [tileCount] : [];
  }

  const rowCount = findRowCount(tileCount, width, height, minAspect);

  return distributeTiles(tileCount, rowCount);
}

function findRowCount(tileCount: number, width: number, height: number, minAspect: number): number {
  for (let rowCount = 1; rowCount <= tileCount; rowCount++) {
    const columnCount = Math.ceil(tileCount / rowCount);
    const tileAspect = width / columnCount / (height / rowCount);

    if (tileAspect >= minAspect) {
      return rowCount;
    }
  }

  return tileCount;
}

function distributeTiles(tileCount: number, rowCount: number): number[] {
  const baseSize = Math.floor(tileCount / rowCount);
  const remainder = tileCount % rowCount;

  return Array.from({ length: rowCount }, (_, index) => baseSize + (index >= rowCount - remainder ? 1 : 0));
}

export function rowOfEachIndex(rowSizes: number[]): number[] {
  return rowSizes.flatMap((size, row) => Array(size).fill(row));
}

export function getTileStyle(columnCount: number, rowCount: number): CSSProperties {
  return {
    width: getTrackSize(columnCount),
    height: getTrackSize(rowCount),
  };
}

const getTrackSize = (count: number) => `calc((100% - ${(count - 1) * GRID_GAP_PX}px) / ${count})`;
