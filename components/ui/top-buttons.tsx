"use client";

import { useState } from "react";

//This funtion accpets callback function as a prop
export function TopButtons({ onSelectionChange }: { onSelectionChange?: (selectedId: string) => void }) {
    const [activeId, setActiveId] = useState("textToImage"); //track the active button ID (defaults to first button or null)

    const buttons = [{ id: "textToImage", label: "Text-Image", className: "text-image" }, { id: "ImageEditing", label: "Edit Image", className: "image-editing" }, { id: "textToVideo", label: "Text-Video", className: "text-video" }, { id: "imageToVideo", label: "Image-Video", className: "image-video" }];
    return (
        <>
        <section>
            <div className="top-buttons">
                {buttons.map((button) => {
                    //Check if this specific button is the active one
                    const isActive = button.id === activeId;

                    return (
                        <button
                            key={button.id}
                            //Dynamically append 'active' class if isActive is true
                            className={`top-button ${button.className} ${isActive ? "active" : ""}`}
                            onClick={() => {
                                setActiveId(button.id) //Update state on click
                                // Pass the active ID back up to the parent component
                                if (onSelectionChange) {
                                    onSelectionChange(button.id);
                                }
                                }}
                        >
                            {button.label}
                        </button>
                    );
                })}
            </div>
        </section>
        </>
    )}