import { useState } from "react";

import type { HelperMode } from "@/lib/chat/types";

export function useButtonSelection(initialButton: HelperMode = "textToImage") {
    const [currentButton, setCurrentButton] = useState<HelperMode>(initialButton);

    const handleButtonChange = (selectedId: string) => {
        setCurrentButton(selectedId as HelperMode);
    };

    return { currentButton, handleButtonChange };
}
