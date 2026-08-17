import type { Corner } from "@/types/meeting";

/** Nearest corner of `container` to `point`, used to snap the PiP tile on drop. */
export function getNearestCorner(container: DOMRect, point: { x: number; y: number }): Corner {
  const isTop = point.y < container.top + container.height / 2;
  const isLeft = point.x < container.left + container.width / 2;
  return `${isTop ? "top" : "bottom"}-${isLeft ? "left" : "right"}`;
}
