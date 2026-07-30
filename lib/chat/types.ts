export type HelperMode =
  | "textToImage"
  | "ImageEditing"
  | "textToVideo"
  | "imageToVideo";

export type ChatRole = "user" | "assistant";

export type ConversationStatus = "ready" | "generating";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  helper: HelperMode;
  messages: ChatMessage[];
  status: ConversationStatus;
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: string;
}

export interface CreateConversationInput {
  prompt: string;
  helper: HelperMode;
}
