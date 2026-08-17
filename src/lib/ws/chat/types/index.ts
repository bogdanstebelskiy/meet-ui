export interface ChatMessage {
  id: string;
  peerId: string;
  displayName: string;
  body: string;
  ts: number;
}

export interface ChatClientHandlers {
  onMessage(message: ChatMessage): void;
}

export interface ChatServerToClientEvents {
  chatMessage: (msg: ChatMessage) => void;
}

export interface ChatClientToServerEvents {
  sendChatMessage: (p: { roomId: string; body: string }, ack: (r: { ok: true }) => void) => void;
  getChatHistory: (p: { roomId: string }, ack: (r: { messages: ChatMessage[] }) => void) => void;
}
