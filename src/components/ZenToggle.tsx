"use client";

import { useZen } from "./ZenContext";
import { Eye, EyeOff } from "lucide-react";

export function ZenToggle() {
    const { isZen, toggleZen } = useZen();

    return (
        <button
            onClick={toggleZen}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: isZen ? "var(--accent)" : "var(--text-secondary)",
                background: isZen ? "var(--card-bg)" : "none",
                border: isZen ? "1px solid var(--border)" : "none",
                cursor: "pointer",
                padding: "0.5rem 1rem",
                opacity: 0.7,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                // Floating state when Zen is active
                position: isZen ? "fixed" : "static",
                bottom: isZen ? "2rem" : "auto",
                right: isZen ? "2rem" : "auto",
                zIndex: isZen ? 100 : 10,
                borderRadius: isZen ? "99px" : "0",
                boxShadow: isZen ? "0 4px 20px rgba(0,0,0,0.1)" : "none"
            }}
            className="hover:opacity-100 active:scale-95"
            title={isZen ? "Exit Read Mode (Esc)" : "Enter Read Mode"}
        >
            {isZen ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{isZen ? "Exit Read Mode" : "Read Mode"}</span>
        </button>
    );
}
