import type { ComponentProps } from "react";
import { DragDropProvider } from "@dnd-kit/react";

export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type DragEndEvent = Parameters<NonNullable<ComponentProps<typeof DragDropProvider>["onDragEnd"]>>[0];
