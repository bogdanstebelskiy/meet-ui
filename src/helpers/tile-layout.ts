import type { CSSProperties } from "react";

export const GRID_GAP_PX = 16;

/**
 * Splits `n` tiles into rows the way Meet's tile view does: pick the fewest rows
 * whose worst-case (widest) row keeps tiles from getting narrower than `minAspect`,
 * then hand any remainder items to the later rows so the last row is the fullest.
 */
export function computeRowSizes(n: number, width: number, height: number, minAspect = 0.5): number[] {
  if (n <= 0 || width <= 0 || height <= 0) {
    return n > 0 ? [n] : [];
  }

  let rows = 1;
  for (; rows < n; rows++) {
    const cols = Math.ceil(n / rows);
    const tileWidth = width / cols;
    const tileHeight = height / rows;
    if (tileWidth / tileHeight >= minAspect) {
      break;
    }
  }

  const base = Math.floor(n / rows);
  const remainder = n % rows;
  return Array.from({ length: rows }, (_, i) => base + (i >= rows - remainder ? 1 : 0));
}

/** Maps each flat tile index to the row it falls into, given a row-size distribution. */
export function rowOfEachIndex(rowSizes: number[]): number[] {
  return rowSizes.flatMap((count, rowIndex) => Array(count).fill(rowIndex) as number[]);
}

/** Width/height for a tile in a row of `rowCount` items, within a grid of `totalRows` rows. */
export function getTileStyle(rowCount: number, totalRows: number): CSSProperties {
  return {
    width: `calc((100% - ${(rowCount - 1) * GRID_GAP_PX}px) / ${rowCount})`,
    height: `calc((100% - ${(totalRows - 1) * GRID_GAP_PX}px) / ${totalRows})`,
  };
}
