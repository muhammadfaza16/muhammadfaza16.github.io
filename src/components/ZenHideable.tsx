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
                display: "grid",
                gridTemplateRows: shouldHide ? "0fr" : "1fr",
                opacity: shouldHide ? 0 : 1,
                filter: shouldHide ? "blur(10px)" : "blur(0px)",
                transform: shouldHide ? "scale(0.98)" : "scale(1)", // Subtle scale for depth
                pointerEvents: shouldHide ? "none" : "auto",
                transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
            }}
            aria-hidden={shouldHide}
        >
            <div style={{ overflow: "hidden" }}>
                {children}
            </div>
        </div>
    );
}
