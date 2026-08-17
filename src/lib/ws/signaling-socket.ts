import { io, Socket } from "socket.io-client";
import type { EventsMap } from "@socket.io/component-emitter";

const REQUEST_TIMEOUT_MS = 10_000;

export class SignalingSocket<ServerToClientEvents extends EventsMap, ClientToServerEvents extends EventsMap> {
  readonly raw: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor(url: string) {
    this.raw = io(url, { autoConnect: false, transports: ["websocket"] });
  }

  connect(): Promise<void> {
    if (this.raw.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.raw.once("connect", resolve);
      this.raw.once("connect_error", reject);
      this.raw.connect();
    });
  }

  request<T>(event: string, payload?: unknown): Promise<T> {
    // emitWithAck can't type-check a generic dispatcher - call sites keep it honest instead.
    return (this.raw.timeout(REQUEST_TIMEOUT_MS).emitWithAck as (...args: unknown[]) => Promise<T>)(event, payload);
  }
}
