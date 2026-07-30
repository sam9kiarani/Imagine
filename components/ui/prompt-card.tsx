"use client";

import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";

type ImageAttachment = {
  id: string;
  name: string;
  previewUrl: string;
};

type PromptCardProps = {
  inputId: string;
  label: string;
  placeholder?: string;
  submitContent: string | ReactNode;
  submitAriaLabel?: string;
  attachmentLabel?: string;
  disabled?: boolean;
  onSubmit?: (data: { prompt: string }) => void;
};

export function PromptCard({
  inputId,
  label,
  placeholder,
  submitContent,
  submitAriaLabel,
  attachmentLabel = "Attach files",
  disabled = false,
  onSubmit,
}: PromptCardProps) {
  const [prompt, setPrompt] = useState("");
  const [attachments, setAttachments] = useState<ImageAttachment[]>([]);
  const attachmentsRef = useRef<ImageAttachment[]>([]);
  const attachmentInputId = `${inputId}-attachments`;

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => () => attachmentsRef.current.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl)), []);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedImages = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    const newAttachments = selectedImages.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }));

    setAttachments((current) => [...current, ...newAttachments]);
    event.target.value = "";
  }

  function removeAttachment(id: string) {
    setAttachments((current) => {
      const attachment = current.find((item) => item.id === id);
      if (attachment) URL.revokeObjectURL(attachment.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = prompt.trim();
    if (!trimmed || disabled) {
      return;
    }

    onSubmit?.({ prompt: trimmed });
    setPrompt("");
  }

  return (
    <form
      className={`prompt-card${attachments.length ? " has-attachments" : ""}`}
      method="post"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      {attachments.length > 0 && (
        <div className="attachment-previews" aria-label={`${attachments.length} attached image${attachments.length === 1 ? "" : "s"}`}>
          {attachments.map((attachment) => (
            <div className="image-preview" key={attachment.id}>
              <img src={attachment.previewUrl} alt={attachment.name} />
              <button type="button" className="remove-image" onClick={() => removeAttachment(attachment.id)} aria-label={`Remove ${attachment.name}`}>×</button>
            </div>
          ))}
        </div>
      )}
      <label className="sr-only" htmlFor={inputId}>{label}</label>
      <textarea
        className="prompt-input"
        id={inputId}
        name="prompt"
        placeholder={placeholder}
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        disabled={disabled}
      />
      <div className="action-btns">
        <label className="image-upload" htmlFor={attachmentInputId} title={attachmentLabel} aria-label={attachmentLabel}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </label>
        <input type="file" id={attachmentInputId} className="file-input" accept="image/*" multiple onChange={handleFileChange} />
        <button
          className="generate-button"
          type="submit"
          aria-label={submitAriaLabel}
          disabled={disabled || !prompt.trim()}
        >
          {submitContent}
        </button>
      </div>
    </form>
  );
}
