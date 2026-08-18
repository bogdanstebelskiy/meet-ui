import { useState } from "react";
import { move } from "@dnd-kit/helpers";
import { LOCAL_TILE_ID } from "@/constants/meeting";
import type { DragEndEvent } from "@/types/meeting";

interface PeerLike {
  peerId: string;
}

export function useTileOrder(peers: PeerLike[]) {
  const currentIds = new Set([LOCAL_TILE_ID, ...peers.map((peer) => peer.peerId)]);
  const idsKey = [...currentIds].sort().join(",");

  const [order, setOrder] = useState<string[]>([LOCAL_TILE_ID]);
  const [reconciledKey, setReconciledKey] = useState<string | null>(null);

  if (idsKey !== reconciledKey) {
    const kept = order.filter((id) => currentIds.has(id));
    const known = new Set(kept);
    const added = [...currentIds].filter((id) => !known.has(id));
    let next = [...kept, ...added];
    if (currentIds.size >= 5) {
      next = [...next.filter((id) => id !== LOCAL_TILE_ID), LOCAL_TILE_ID];
    }
    setReconciledKey(idsKey);
    setOrder(next);
  }

  const reorder = (event: DragEndEvent) => setOrder((items) => move(items, event));

  return { order, reorder };
}
