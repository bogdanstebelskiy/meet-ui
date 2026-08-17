import { SignalingSocket } from "../signaling-socket";
import type { ChatClientHandlers, ChatClientToServerEvents, ChatMessage, ChatServerToClientEvents } from "./types";

export class ChatClient {
  constructor(
    private readonly signalingSocket: SignalingSocket<ChatServerToClientEvents, ChatClientToServerEvents>,
    private readonly roomId: string,
    private readonly handlers: ChatClientHandlers,
  ) {
    this.signalingSocket.raw.on("chatMessage", (message) => this.handlers.onMessage(message));
  }

  async loadHistory(afterId?: string): Promise<ChatMessage[]> {
    const { messages } = await this.signalingSocket.request<{ messages: ChatMessage[] }>("getChatHistory", {
      roomId: this.roomId,
      afterId,
    });
    return messages;
  }

  async send(body: string): Promise<void> {
    await this.signalingSocket.request("sendChatMessage", { roomId: this.roomId, body });
  }
}
