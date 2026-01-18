"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

export function NativeBrowserGuard() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Simple check for common in-app browsers
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isInApp = /Instagram|FBAN|FBAV|Line|Twitter|Tik|Snapchat/.test(ua);

        // Only show if in-app and not previously dismissed
        if (isInApp) {
            const hasDismissed = sessionStorage.getItem("native-browser-guard-dismissed");
            if (!hasDismissed) {
                // Small delay to not overwhelm on load
                const timer = setTimeout(() => setIsVisible(true), 2000);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem("native-browser-guard-dismissed", "true");
    };

    // Auto disappear after 8 seconds
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in-up"
            style={{
                maxWidth: "500px",
                margin: "0 auto",
            }}
        >
            <div
                style={{
                    backgroundColor: "rgba(var(--background-rgb), 0.85)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "1rem",
                    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "start",
                    gap: "1rem"
                }}
            >
                <div
                    style={{
                        backgroundColor: "var(--hover-bg)",
                        padding: "0.5rem",
                        borderRadius: "50%",
                        color: "var(--accent)"
                    }}
                >
                    <ExternalLink size={20} />
                </div>

                <div style={{ flex: 1 }}>
                    <p style={{
                        fontFamily: "var(--font-serif)",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        marginBottom: "0.25rem",
                        lineHeight: 1.2
                    }}>
                        Open in System Browser?
                    </p>
                    <p style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.4
                    }}>
                        For the full experience. <br />
                        <span style={{ opacity: 0.8, fontStyle: "italic" }}>
                            Buka di browser bawaan (Chrome/Safari) biar experience-nya maksimal. ✨
                        </span>
                    </p>
                </div>

                <button
                    onClick={handleDismiss}
                    style={{
                        all: "unset",
                        cursor: "pointer",
                        padding: "0.25rem",
                        color: "var(--text-muted)",
                        transition: "color 0.2s ease"
                    }}
                    className="hover:text-foreground"
                    aria-label="Dismiss"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
