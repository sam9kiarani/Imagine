"use client";

import { useButtonSelection } from "@/hooks/useButtonSelection";

import { PromptCard } from "@/components/ui/prompt-card";
import { TopButtons } from "@/components/ui/top-buttons";
import { Icon } from "@/helpers/icon";

export default function ChatPage() {
  const { currentButton, handleButtonChange } = useButtonSelection("textToImage");
  return (
    <>
      <section className="chat-welcome" aria-labelledby="chat-title">
        <p className="eyebrow">Your creative studio</p>
        <h1 id="chat-title">Imagine</h1>
        <p>Describe what you want to create, pick a helper, and send it off.</p>
      </section>

      <TopButtons onSelectionChange={handleButtonChange} />

      <div className="chat-bottom">
        <PromptCard
          inputId="chat-message"
          label="Message"
          placeholder="A glass greenhouse floating above a lavender field at sunset..."
          attachmentLabel="Add Photos & Files"
          submitAriaLabel="Send message"
          
          submitContent={
            <Icon>
              <path d="m4 4 16 8-16 8 3-8-3-8Z" />
            </Icon>
          }
        />
      </div>
    </>
  );
}
