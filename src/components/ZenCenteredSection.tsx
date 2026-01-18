"use client";

import { useZen } from "@/components/ZenContext";
import { ReactNode } from "react";

interface ZenCenteredSectionProps {
    children: ReactNode;
}

/**
 * Section wrapper that expands and centers content when Zen mode is active.
 * Uses fixed positioning to prevent scroll. Transparent to show orbs/stars behind.
 */
export function ZenCenteredSection({ children }: ZenCenteredSectionProps) {
    const { isZen } = useZen();

    if (isZen) {
        return (
            <section
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100vw",
                    height: "100svh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 100,
                    backgroundColor: "transparent", // Let orbs/stars show through
                    transition: "all 0.5s ease-in-out"
                }}
            >
                {children}
            </section>
        );
    }

    return (
        <section style={{ marginBottom: "4rem" }}>
            {children}
        </section>
    );
}
