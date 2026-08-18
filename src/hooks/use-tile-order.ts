import { useState } from "react";
import { move } from "@dnd-kit/helpers";
import { LOCAL_TILE_ID } from "@/constants/meeting";
import { reconcileOrder } from "@/helpers/tile-order";
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
    setReconciledKey(idsKey);
    setOrder(reconcileOrder(order, currentIds));
  }

  const reorder = (event: DragEndEvent) => setOrder((items) => move(items, event));

  return { order, reorder };
}
