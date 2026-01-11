"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

const funnyMessages = [
    "Udah kali, rusak saklarnya nanti! 😅",
    "Kamu lagi stress ya? Mau curhat? 🤗",
    "Ini bukan lampu disko lho... 🕺",
    "Hemat listrik dong, kasian PLN 💡",
    "Calm down, bestie. Take a deep breath 🧘",
    "Jari kamu baik-baik aja kan? 👆",
    "Kamu tau ini bukan mainan kan? 🎮",
    "Theme toggle abuse detected! 🚨",
    "Aku capek ganti baju terus... 😩",
    "Okay okay, aku surrender! 🏳️",
];

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [clickCount, setClickCount] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [message, setMessage] = useState("");
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleClick = () => {
        toggleTheme();

        // Track rapid clicks
        setClickCount(prev => prev + 1);

        // Reset timer on each click
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Reset click count after 4 seconds of no clicking
        timerRef.current = setTimeout(() => {
            setClickCount(0);
        }, 4000);
    };

    // Show dialog when click count reaches threshold
    useEffect(() => {
        if (clickCount >= 5) {
            const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
            setMessage(randomMessage);
            setShowDialog(true);
            setClickCount(0);
        }
    }, [clickCount]);

    // Auto-hide dialog after 3 seconds
    useEffect(() => {
        if (showDialog) {
            const hideTimer = setTimeout(() => {
                setShowDialog(false);
            }, 3000);
            return () => clearTimeout(hideTimer);
        }
    }, [showDialog]);

    return (
        <>
            <button
                onClick={handleClick}
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--border)] transition-all duration-300"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
                {/* Sun Icon */}
                <svg
                    className={`absolute w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${theme === "light"
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-90 scale-0"
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
                    <path
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                    />
                </svg>

                {/* Moon Icon */}
                <svg
                    className={`absolute w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${theme === "dark"
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-90 scale-0"
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    />
                </svg>
            </button>

            {/* Easter Egg Dialog */}
            {showDialog && (
                <div
                    className="animate-fade-in"
                    style={{
                        position: "fixed",
                        top: "6rem",
                        right: "1rem",
                        maxWidth: "280px",
                        padding: "1rem 1.25rem",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                        borderRadius: "16px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
                        zIndex: 1000,
                        color: "#1a1a1a",
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                        fontWeight: 500,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                        <span style={{ fontSize: "1.5rem" }}>💬</span>
                        <p style={{ margin: 0 }}>{message}</p>
                    </div>
                    <button
                        onClick={() => setShowDialog(false)}
                        style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            opacity: 0.5,
                            fontSize: "1rem",
                            padding: "4px",
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}
        </>
    );
}
