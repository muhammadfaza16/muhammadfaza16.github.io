"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    const [showPercentage, setShowPercentage] = useState(false);

    useEffect(() => {
        const updateProgress = () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (scrollHeight) {
                setProgress(Number((currentScroll / scrollHeight).toFixed(2)) * 100);
            }
        };

        window.addEventListener("scroll", updateProgress);

        return () => {
            window.removeEventListener("scroll", updateProgress);
        };
    }, []);

    return (
        <div
            onMouseEnter={() => setShowPercentage(true)}
            onMouseLeave={() => setShowPercentage(false)}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "5px",
                backgroundColor: "var(--border)",
                zIndex: 100,
            }}
        >
            {/* Progress bar */}
            <div
                style={{
                    width: `${progress}%`,
                    height: "100%",
                    backgroundColor: "var(--foreground)",
                    transition: "width 0.1s ease-out"
                }}
            />

            {/* Percentage indicator */}
            <div
                style={{
                    position: "absolute",
                    top: "100%",
                    right: "1rem",
                    marginTop: "0.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--foreground)",
                    backgroundColor: "var(--card-bg)",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px var(--glow)",
                    opacity: showPercentage ? 1 : 0,
                    transform: showPercentage ? "translateY(0)" : "translateY(-4px)",
                    transition: "all 0.2s ease",
                    pointerEvents: "none"
                }}
            >
                {Math.round(progress)}% read
            </div>
        </div>
    );
}
