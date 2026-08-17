import type { Corner } from "@/types/meeting";

export const LOCAL_TILE_ID = "local";

export const CORNER_CLASSES: Record<Corner, string> = {
  "top-left": "top-8 left-8",
  "top-right": "top-8 right-8",
  "bottom-left": "bottom-8 left-8",
  "bottom-right": "bottom-8 right-8",
};
