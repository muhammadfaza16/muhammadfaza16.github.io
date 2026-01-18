"use client";

import { useZen } from "@/components/ZenContext";
import { ReactNode } from "react";

interface ZenHideableProps {
    children: ReactNode;
    /** If true, this element hides when Zen mode is active */
    hideInZen?: boolean;
    /** If true, this element shows ONLY when Zen mode is active */
    showOnlyInZen?: boolean;
}

/**
 * Wrapper component that conditionally hides/shows content based on Zen mode.
 * Uses CSS transitions for smooth animation.
 */
export function ZenHideable({ children, hideInZen = false, showOnlyInZen = false }: ZenHideableProps) {
    const { isZen } = useZen();

    // Determine visibility
    const shouldHide = (hideInZen && isZen) || (showOnlyInZen && !isZen);

    return (
        <div
            style={{
                opacity: shouldHide ? 0 : 1,
                pointerEvents: shouldHide ? "none" : "auto",
                maxHeight: shouldHide ? 0 : "none",
                overflow: shouldHide ? "hidden" : "visible",
                transition: "opacity 0.5s ease-in-out, max-height 0.5s ease-in-out"
            }}
            aria-hidden={shouldHide}
        >
            {children}
        </div>
    );
}
