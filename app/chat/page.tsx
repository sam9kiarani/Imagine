"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 

import { useButtonSelection } from "@/hooks/useButtonSelection";

import { Icon } from "@/helpers/icon";

import { PromptCard } from "@/components/ui/prompt-card";
import { TopButtons } from "@/components/ui/top-buttons";


export default function ChatPage() {
  const router = useRouter(); // Instantiate the router hook instance
  const { currentButton, handleButtonChange } = useButtonSelection("textToImage");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePromptSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    //Append the active button selection to the form data payload
    formData.append("activeButton", currentButton);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const result = await response.json();
      console.log("Image generation result:", result);

      //If the server returns a valid chat ID, redirect the user
      if (result.success && result.chatId) {
        router.push(`/chat/${result.chatId}`); // Redirect to the new chat page
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setIsSubmitting(false); // Reset the submitting state on error
    }
  }
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
          onSubmit={handlePromptSubmit}
          submitContent={
            isSubmitting? "Generating..." :
            <Icon>
              <path d="m4 4 16 8-16 8 3-8-3-8Z" />
            </Icon>
          }
          disabled={isSubmitting} //Lock UI input changes during execution
        />
      </div>
    </>
  );
}
