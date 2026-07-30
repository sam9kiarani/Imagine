import type { HelperMode } from "./types";

const HELPER_LABELS: Record<HelperMode, string> = {
  textToImage: "Text to Image",
  ImageEditing: "Image Editing",
  textToVideo: "Text to Video",
  imageToVideo: "Image to Video",
};

function summarizePrompt(prompt: string): string {
  const trimmed = prompt.trim();
  if (trimmed.length <= 80) {
    return trimmed;
  }

  return `${trimmed.slice(0, 77)}...`;
}

export function getHelperLabel(helper: HelperMode): string {
  return HELPER_LABELS[helper];
}

export function getMockResponse(helper: HelperMode, prompt: string): string {
  const excerpt = summarizePrompt(prompt);

  const responses: Record<HelperMode, string> = {
    textToImage: `Here is a concept for "${excerpt}": warm directional light, layered depth, and a polished cinematic palette with soft atmospheric haze.`,
    ImageEditing: `Edits applied to "${excerpt}": refined contrast, cleaner edges, and balanced color grading while preserving the original composition.`,
    textToVideo: `Storyboard for "${excerpt}": a slow dolly-in over 6 seconds, gentle parallax in the mid-ground, and a subtle lens flare at the end.`,
    imageToVideo: `Motion pass for "${excerpt}": natural camera drift, ambient particle movement, and smooth easing on subject highlights.`,
  };

  return responses[helper];
}

export function createTitleFromPrompt(prompt: string): string {
  const trimmed = prompt.trim();
  if (trimmed.length <= 48) {
    return trimmed;
  }

  return `${trimmed.slice(0, 45)}...`;
}
