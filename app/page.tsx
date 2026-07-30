"use client";

import { useState } from "react";

import { useButtonSelection } from "@/hooks/useButtonSelection";

import { PromptCard } from "../components/ui/prompt-card";
import { Icon } from "@/helpers/icon";
import { TopButtons } from "@/components/ui/top-buttons";

export default function HomePage() {
  const { currentButton, handleButtonChange } = useButtonSelection("textToImage")

  return (
    <div className="page-wrap">
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">Your creative studio</p>
        <h1 className="hero-title" id="hero-title">
          <span>Imagine</span>
        </h1>
      </section>
      <TopButtons onSelectionChange={handleButtonChange}/>
      <PromptCard inputId="image-prompt" label="Image prompt" placeholder="A glass greenhouse floating above a lavender field at sunset..." submitContent={
        <Icon>
          <path d="m4 4 16 8-16 8 3-8-3-8Z" />
        </Icon>
      } />

      <section className="feature-row" aria-label="Image generation benefits">
        <article className="feature-card">
          <div className="feature-icon">⌁</div>
          <h2>Expressive prompts</h2>
          <p>Use natural language to describe the scene you have in mind.</p>
        </article>
        <article className="feature-card">
          <div className="feature-icon">◈</div>
          <h2>Polished results</h2>
          <p>Compose detailed concepts with a look that feels intentional.</p>
        </article>
        <article className="feature-card">
          <div className="feature-icon">↗</div>
          <h2>Keep exploring</h2>
          <p>Your recent generations are ready whenever inspiration strikes.</p>
        </article>
      </section>
    </div>
  );
}
