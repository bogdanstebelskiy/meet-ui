import { LOCAL_TILE_ID, PIN_LOCAL_TILE_THRESHOLD } from "@/constants/meeting";

export function reconcileOrder(order: string[], currentIds: Set<string>): string[] {
  const kept = order.filter((id) => currentIds.has(id));
  const known = new Set(kept);
  const added = [...currentIds].filter((id) => !known.has(id));
  const next = [...kept, ...added];

  if (currentIds.size < PIN_LOCAL_TILE_THRESHOLD) {
    return next;
  }

  return [...next.filter((id) => id !== LOCAL_TILE_ID), LOCAL_TILE_ID];
}
