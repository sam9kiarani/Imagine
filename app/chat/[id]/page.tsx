"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatMessage, type ChatMessageData } from "../../../components/ui/chat-message";
import { PromptCard } from "../../../components/ui/prompt-card";
import { Icon } from "@/helpers/icon";

const conversations: Record<string, { title: string; messages: ChatMessageData[] }> = {
  "1": {
    title: "Sunset over lavender fields",
    messages: [
      { role: "user", content: "Create a dreamy image of a glass greenhouse floating above a lavender field at sunset." },
      { role: "assistant", content: "Here is a concept with warm golden light, soft purple rows below, and a translucent greenhouse catching the last rays of sun." },
    ],
  },
  "2": {
    title: "Glass greenhouse concept",
    messages: [
      { role: "user", content: "Design a minimalist glass greenhouse with hanging plants and misty morning light." },
      { role: "assistant", content: "I imagined a slender steel frame, dew on the glass panels, and ferns suspended at different heights inside." },
    ],
  },
};

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const conversation = conversations[params.id] ?? {
    title: "Conversation",
    messages: [],
  };

  const [messages, setMessages] = useState<ChatMessageData[]>(conversation.messages);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    setMessages(conversation.messages);
    setEditingIndex(null);
    setEditDraft("");
    setCopiedIndex(null);
  }, [params.id]);

  useEffect(() => {
    if (copiedIndex === null) {
      return;
    }

    const timeout = window.setTimeout(() => setCopiedIndex(null), 1500);
    return () => window.clearTimeout(timeout);
  }, [copiedIndex]);

  async function copyMessage(index: number, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedIndex(index);
    }
  }

  function deleteMessage(index: number) {
    setMessages((current) => current.filter((_, messageIndex) => messageIndex !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditDraft("");
    }
  }

  function startEdit(index: number, content: string) {
    setEditingIndex(index);
    setEditDraft(content);
  }

  function saveEdit() {
    if (editingIndex === null) {
      return;
    }

    const trimmed = editDraft.trim();
    if (!trimmed) {
      return;
    }

    setMessages((current) =>
      current.map((message, index) =>
        index === editingIndex ? { ...message, content: trimmed } : message,
      ),
    );
    setEditingIndex(null);
    setEditDraft("");
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditDraft("");
  }

  return (
    <>
      <section className="chat-conversation" aria-label="Conversation">
        <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions">
          {messages.length === 0 ? (
            <p className="chat-messages-empty">No messages in this conversation yet.</p>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                message={message}
                isEditing={editingIndex === index}
                editDraft={editDraft}
                copied={copiedIndex === index}
                onCopy={() => copyMessage(index, message.content)}
                onDelete={() => deleteMessage(index)}
                onStartEdit={() => startEdit(index, message.content)}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onEditDraftChange={setEditDraft}
              />
            ))
          )}
        </div>
      </section>

      <PromptCard
        inputId="conversation-message"
        label="Message"
        attachmentLabel="Add Photos & Files"
        submitAriaLabel="Send message"
        submitContent={
          <Icon>
            <path d="m4 4 16 8-16 8 3-8-3-8Z" />
          </Icon>
        }
      />
    </>
  );
}
