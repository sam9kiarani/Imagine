import { createTitleFromPrompt, getMockResponse } from "./mock-responses";
import type {
  Conversation,
  ConversationSummary,
  CreateConversationInput,
  HelperMode,
} from "./types";

const STORAGE_KEY = "image-gen:conversations";

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    title: "Sunset over lavender fields",
    helper: "textToImage",
    status: "ready",
    createdAt: "2026-07-28T10:00:00.000Z",
    messages: [
      {
        id: "1-user",
        role: "user",
        content:
          "Create a dreamy image of a glass greenhouse floating above a lavender field at sunset.",
        createdAt: "2026-07-28T10:00:00.000Z",
      },
      {
        id: "1-assistant",
        role: "assistant",
        content:
          "Here is a concept with warm golden light, soft purple rows below, and a translucent greenhouse catching the last rays of sun.",
        createdAt: "2026-07-28T10:00:05.000Z",
      },
    ],
  },
  {
    id: "2",
    title: "Glass greenhouse concept",
    helper: "textToImage",
    status: "ready",
    createdAt: "2026-07-27T16:30:00.000Z",
    messages: [
      {
        id: "2-user",
        role: "user",
        content:
          "Design a minimalist glass greenhouse with hanging plants and misty morning light.",
        createdAt: "2026-07-27T16:30:00.000Z",
      },
      {
        id: "2-assistant",
        role: "assistant",
        content:
          "I imagined a slender steel frame, dew on the glass panels, and ferns suspended at different heights inside.",
        createdAt: "2026-07-27T16:30:04.000Z",
      },
    ],
  },
];

function isHelperMode(value: string): value is HelperMode {
  return (
    value === "textToImage" ||
    value === "ImageEditing" ||
    value === "textToVideo" ||
    value === "imageToVideo"
  );
}

function createMessage(role: Conversation["messages"][number]["role"], content: string) {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function readStore(): Conversation[] {
  if (typeof window === "undefined") {
    return SEED_CONVERSATIONS;
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CONVERSATIONS));
    return SEED_CONVERSATIONS;
  }

  try {
    const parsed = JSON.parse(raw) as Conversation[];
    return Array.isArray(parsed) ? parsed : SEED_CONVERSATIONS;
  } catch {
    return SEED_CONVERSATIONS;
  }
}

function writeStore(conversations: Conversation[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function listConversationSummaries(): ConversationSummary[] {
  return readStore()
    .map(({ id, title, createdAt }) => ({ id, title, createdAt }))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function getConversation(id: string): Conversation | undefined {
  return readStore().find((conversation) => conversation.id === id);
}

export function createConversation(input: CreateConversationInput): Conversation {
  const prompt = input.prompt.trim();
  const conversation: Conversation = {
    id: crypto.randomUUID(),
    title: createTitleFromPrompt(prompt),
    helper: input.helper,
    status: "generating",
    createdAt: new Date().toISOString(),
    messages: [createMessage("user", prompt)],
  };

  const conversations = [conversation, ...readStore()];
  writeStore(conversations);
  return conversation;
}

export function completeConversationGeneration(id: string): Conversation | undefined {
  const conversations = readStore();
  const index = conversations.findIndex((conversation) => conversation.id === id);

  if (index === -1) {
    return undefined;
  }

  const conversation = conversations[index];
  if (conversation.status === "ready") {
    return conversation;
  }

  const userMessage = conversation.messages.find((message) => message.role === "user");
  if (!userMessage) {
    return conversation;
  }

  const updatedConversation: Conversation = {
    ...conversation,
    status: "ready",
    messages: [
      ...conversation.messages,
      createMessage(
        "assistant",
        getMockResponse(conversation.helper, userMessage.content),
      ),
    ],
  };

  conversations[index] = updatedConversation;
  writeStore(conversations);
  return updatedConversation;
}

export function appendMessage(
  id: string,
  role: Conversation["messages"][number]["role"],
  content: string,
): Conversation | undefined {
  const conversations = readStore();
  const index = conversations.findIndex((conversation) => conversation.id === id);

  if (index === -1) {
    return undefined;
  }

  const updatedConversation: Conversation = {
    ...conversations[index],
    messages: [...conversations[index].messages, createMessage(role, content)],
  };

  conversations[index] = updatedConversation;
  writeStore(conversations);
  return updatedConversation;
}

export function parseHelperMode(value: string): HelperMode {
  return isHelperMode(value) ? value : "textToImage";
}
