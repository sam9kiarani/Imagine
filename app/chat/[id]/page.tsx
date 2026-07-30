// image-gen/app/chat/[id]/page.tsx
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
  const [isGenerating, setIsGenerating] = useState(false); // Track server processing states

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

  // Combined callback handler to tie your data stream back into the conversation view
  async function handleSendMessage(formData: FormData) {
    const promptText = formData.get("prompt") as string;
    if (!promptText) return;

    setIsGenerating(true);

    // 1. Immediately inject user message into UI state for an instant response feel
    const newUserMessage: ChatMessageData = {
      role: "user",
      content: promptText,
    };
    
    setMessages((current) => [...current, newUserMessage]);

    // 2. Append route parameters if your backend needs to know which context thread this belongs to
    formData.append("chatId", params.id);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData, // Automatically transmits binary attachments & parameters
      });

      if (!response.ok) throw new Error("Generation error");

      const result = await response.json();

      // 3. Inject the server's reply directly into the message logs array 
      if (result.success && result.reply) {
        setMessages((current) => [
          ...current,
          { role: "assistant", content: result.reply },
        ]);
      }
    } catch (error) {
      console.error("Message generation pipeline failed:", error);
      // Append an error message notice layout chunk so the user knows it failed
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "Sorry, I ran into an error processing that generation request." },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }

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
          {/* Visual indicator loop when waiting for an backend engine reply */}
          {isGenerating && (
            <div className="chat-message assistant generating-indicator">
              <p className="text-gray-400 italic">Thinking and processing asset generation request...</p>
            </div>
          )}
        </div>
      </section>

      <PromptCard
        inputId="conversation-message"
        label="Message"
        attachmentLabel="Add Photos & Files"
        submitAriaLabel="Send message"
        disabled={isGenerating} // Block double requests while a stream processes
        onSubmit={handleSendMessage} // Mount pipeline handler
        submitContent={
          <Icon>
            <path d="m4 4 16 8-16 8 3-8-3-8Z" />
          </Icon>
        }
      />
    </>
  );
}
