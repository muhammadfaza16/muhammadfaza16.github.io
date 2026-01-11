"use client";

import { useZen } from "./ZenContext";

export function ZenHidden({ children, className }: { children: React.ReactNode, className?: string }) {
    const { isZen } = useZen();

    return (
        <div
            className={`${className || ""} transition-opacity duration-500`}
            style={{
                opacity: isZen ? 0 : 1,
                pointerEvents: isZen ? "none" : "auto",
                display: "contents" // Try to minimize layout impact, but opacity needs an element
            }}
        >
            <div style={{ opacity: isZen ? 0 : 1, transition: "opacity 0.5s ease" }}>
                {children}
            </div>
        </div>
    );
}
