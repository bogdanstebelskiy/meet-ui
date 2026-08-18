import type { Corner } from "@/types/meeting";

/** Returns the corner of `container` closest to `point`. */
export function getNearestCorner(container: DOMRect, point: { x: number; y: number }): Corner {
  const centerX = container.left + container.width / 2;
  const centerY = container.top + container.height / 2;

  const vertical = point.y < centerY ? "top" : "bottom";
  const horizontal = point.x < centerX ? "left" : "right";

  return `${vertical}-${horizontal}`;
}
