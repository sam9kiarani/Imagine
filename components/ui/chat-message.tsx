"use client";

import { type KeyboardEvent, useEffect, useRef } from "react";

import { Icon } from "@/helpers/icon";

export type ChatMessageData = {
  role: "user" | "assistant";
  content: string;
};

type ChatMessageProps = {
  message: ChatMessageData;
  isEditing: boolean;
  editDraft: string;
  copied: boolean;
  onCopy: () => void;
  onDelete: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditDraftChange: (value: string) => void;
};

function MessageAction({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`chat-message-action${danger ? " chat-message-action-danger" : ""}`}
      aria-label={label}
      onClick={onClick}
    >
      {children}
      <span className="chat-message-action-label">{label}</span>
    </button>
  );
}

export function ChatMessage({
  message,
  isEditing,
  editDraft,
  copied,
  onCopy,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditDraftChange,
}: ChatMessageProps) {
  const editRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const textarea = editRef.current;
    if (!textarea) {
      return;
    }

    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }, [isEditing]);

  function handleEditKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSaveEdit();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onCancelEdit();
    }
  }

  return (
    <article className={`chat-message chat-message-${message.role}`}>
      {isEditing ? (
        <div className="chat-message-edit">
          <label className="sr-only" htmlFor="edit-message">Edit message</label>
          <textarea
            ref={editRef}
            id="edit-message"
            className="chat-message-edit-input"
            value={editDraft}
            onChange={(event) => onEditDraftChange(event.target.value)}
            onKeyDown={handleEditKeyDown}
            rows={3}
          />
          <div className="chat-message-edit-actions">
            <button type="button" className="chat-message-action" onClick={onSaveEdit}>
              Save
            </button>
            <button type="button" className="chat-message-action" onClick={onCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p>{message.content}</p>
      )}

      {!isEditing && (
        <div className="chat-message-actions" aria-label={`Actions for ${message.role} message`}>
          {message.role === "assistant" ? (
            <>
              <MessageAction label={copied ? "Copied" : "Copy"} onClick={onCopy}>
                <Icon>
                  {copied ? (
                    <path d="M20 6 9 17l-5-5" />
                  ) : (
                    <>
                      <rect x="9" y="9" width="10" height="10" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </>
                  )}
                </Icon>
              </MessageAction>
              <MessageAction label="Delete" onClick={onDelete} danger>
                <Icon>
                  <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" />
                </Icon>
              </MessageAction>
            </>
          ) : (
            <>
              <MessageAction label="Edit" onClick={onStartEdit}>
                <Icon>
                  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </Icon>
              </MessageAction>
              <MessageAction label="Delete" onClick={onDelete} danger>
                <Icon>
                  <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" />
                </Icon>
              </MessageAction>
            </>
          )}
        </div>
      )}
    </article>
  );
}
