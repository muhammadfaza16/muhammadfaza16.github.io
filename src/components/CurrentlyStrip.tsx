"use client";

import { useState, useEffect } from "react";
import { useAudio } from "./AudioContext";

// Derived values from context now
// const playlist removed as it is handled by context for the active song

function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function getMood(hour: number): string {
    if (hour >= 5 && hour < 8) return "sedang mengumpulkan nyawa";
    if (hour >= 8 && hour < 11) return "pura-pura produktif";
    if (hour >= 11 && hour < 13) return "butuh asupan kafein";
    if (hour >= 13 && hour < 15) return "melawan kantuk pasca-makan";
    if (hour >= 15 && hour < 18) return "mengejar deadline (atau senja)";
    if (hour >= 18 && hour < 21) return "rebahan is my passion";
    if (hour >= 21 && hour < 23) return "overthinking mode: on";
    if (hour >= 23 || hour < 2) return "tersesat di YouTube";
    return "zombie mode activated";
}

// Helper for the continuous marquee
function ContinuousMarquee({ items }: { items: { icon: React.ReactNode; label: string; text: string; onClick?: () => void; className?: string }[] }) {
    return (
        <div style={{
            display: "flex",
            overflow: "hidden",
            width: "100%",
            maskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)"
        }}>
            <div style={{
                display: "flex",
                gap: "3rem",
                animation: "marquee 25s linear infinite",
                paddingRight: "3rem",
                flexShrink: 0
            }}>
                {items.map((item, i) => (
                    <div
                        key={`o-${i}`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            cursor: item.onClick ? "pointer" : "default",
                            ... (item.onClick ? { userSelect: "none" } : {})
                        }}
                        onClick={item.onClick}
                        className={item.className}
                    >
                        <span style={{ color: "var(--accent)" }}>{item.icon}</span>
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            opacity: 0.7
                        }}>
                            {item.label}:
                        </span>
                        <span style={{ whiteSpace: "nowrap", fontWeight: 500 }}>{item.text}</span>
                    </div>
                ))}
            </div>
            {/* Duplicate for infinite loop */}
            <div style={{
                display: "flex",
                gap: "3rem",
                animation: "marquee 25s linear infinite",
                paddingRight: "3rem",
                flexShrink: 0
            }}>
                {items.map((item, i) => (
                    <div
                        key={`d-${i}`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            cursor: item.onClick ? "pointer" : "default",
                            ... (item.onClick ? { userSelect: "none" } : {})
                        }}
                        onClick={item.onClick}
                        className={item.className}
                    >
                        <span style={{ color: "var(--accent)" }}>{item.icon}</span>
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            opacity: 0.7
                        }}>
                            {item.label}:
                        </span>
                        <span style={{ whiteSpace: "nowrap", fontWeight: 500 }}>{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CurrentlyStrip() {
    const [currentTime, setCurrentTime] = useState("");
    const [mood, setMood] = useState("");
    const [isHydrated, setIsHydrated] = useState(false);

    // Global Audio Context
    const { isPlaying, togglePlay, currentSong } = useAudio();

    // Derived values
    // const currentSong = playlist[songIndex % playlist.length] || playlist[0];

    // Status items for the marquee
    const statusItems = [
        {
            icon: isPlaying ? "⏸" : "▶",
            label: isPlaying ? "Playing" : "Paused",
            text: currentSong.title,
            onClick: togglePlay,
            className: "hover:opacity-80 transition-opacity"
        },
        { icon: "◎", label: "Time", text: currentTime },
        { icon: "⚡", label: "Mood", text: mood },
        { icon: "💌", label: "Checking in", text: "Gimana harinya? Lancar kan?" },
    ];

    useEffect(() => {
        setIsHydrated(true);

        const updateTime = () => {
            const now = new Date();
            setCurrentTime(formatTime(now));
            setMood(getMood(now.getHours()));
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 1000);

        return () => {
            clearInterval(timeInterval);
        };
    }, []);

    if (!isHydrated) return null;

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            gap: "1rem"
        }}>

            {/* Top: Marquee Pill */}
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "99px",
                    backgroundColor: "rgba(var(--background-rgb), 0.5)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    letterSpacing: "0.02em",
                    width: "clamp(300px, 90vw, 600px)",
                    overflow: "hidden"
                }}
                className="pause-on-hover"
            >
                <ContinuousMarquee items={statusItems} />
            </div>

            {/* Bottom: Play Control */}
            <div
                style={{
                    height: "2rem", // Fixed height to prevent layout shift
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <div
                    onClick={togglePlay}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        userSelect: "none"
                    }}
                    className="group"
                >
                    <p
                        key={isPlaying ? "playing" : "idle"}
                        className="animate-fade-in group-hover:opacity-80 transition-opacity"
                        style={{
                            fontFamily: "var(--font-serif)",
                            fontStyle: "italic",
                            fontSize: "0.95rem",
                            color: "var(--text-muted)",
                            margin: 0
                        }}
                    >
                        {isPlaying ? "selamat menikmati, nona 🌹" : "Mainkan"}
                    </p>
                    <button
                        style={{
                            all: "unset",
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            transition: "opacity 0.2s ease",
                            opacity: 0.7,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        className="group-hover:opacity-100"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? "⏸" : "▶"}
                    </button>
                </div>
            </div>
        </div>
    );
}
