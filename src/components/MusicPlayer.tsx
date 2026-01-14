"use client";

import { useState, useEffect } from "react";
import { Headphones } from "lucide-react";

const PLAYLIST = [
    {
        title: "Bintang di Surga",
        artist: "Noah",
        url: "https://www.youtube.com/watch?v=B1ynHmn0XZ4"
    },
    {
        title: "Yang Terdalam",
        artist: "Noah",
        url: "https://www.youtube.com/watch?v=FfK5i79L5TE"
    },
    {
        title: "Andaikan Kau Datang",
        artist: "Noah",
        url: "https://www.youtube.com/watch?v=M5G8G_kM_2U"
    },
    {
        title: "Kukatakan Dengan Indah",
        artist: "Noah",
        url: "https://www.youtube.com/watch?v=mD0gZqR-z6A"
    },
    {
        title: "Pemilik Hati",
        artist: "Armada",
        url: "https://www.youtube.com/watch?v=D-j0cK5A2bQ"
    },
    {
        title: "Kau Masih Kekasihku",
        artist: "Naff",
        url: "https://www.youtube.com/watch?v=333M7tS4B4Y"
    }
];

export function MusicPlayer() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Calculate initial index based on time to sync roughly across devices (optional but cool)
        // Using 5 minute windows
        const minutes = Math.floor(Date.now() / 1000 / 60);
        const windowIndex = Math.floor(minutes / 5);
        setCurrentIndex(windowIndex % PLAYLIST.length);

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, []);

    const currentSong = PLAYLIST[currentIndex];

    // During SSR/hydration mismatch, show the first song or a loading state
    // We'll just default to 0 in state but useEffect updates it immediately on mount

    return (
        <a
            href={currentSong.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(1rem, 3vw, 1.25rem)",
                padding: "clamp(1rem, 3vw, 1.25rem)",
                backgroundColor: "var(--card-bg)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.3s ease"
            }}
            className="hover:border-[var(--border-strong)]"
        >
            {/* Album art placeholder with gradient */}
            <div style={{
                width: "clamp(56px, 15vw, 72px)",
                height: "clamp(56px, 15vw, 72px)",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Animated equalizer bars */}
                <div style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "3px",
                    height: "24px"
                }}>
                    {[0.6, 1, 0.4, 0.8, 0.5].map((h, i) => (
                        <div key={i} style={{
                            width: "4px",
                            height: `${h * 100}%`,
                            backgroundColor: "rgba(255,255,255,0.8)",
                            borderRadius: "2px",
                            animation: `pulse 1.${i + 2}s ease-in-out infinite`
                        }} />
                    ))}
                </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontSize: "clamp(0.75rem, 2vw, 0.8rem)",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontFamily: "var(--font-mono)",
                    marginBottom: "0.25rem"
                }}>
                    On Repeat
                </p>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0"
                }}>
                    <span style={{
                        fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                        fontWeight: 500,
                        marginBottom: "0.25rem",
                        fontFamily: "'Source Serif 4', serif",
                        // Simple animation for text change
                        animation: mounted ? "fade-in 0.5s ease" : "none"
                    }} key={currentSong.title}>
                        {currentSong.title}
                    </span>
                    <span style={{
                        color: "var(--text-secondary)",
                        fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                        margin: 0
                    }}>
                        {currentSong.artist}
                    </span>
                </div>
            </div>
            <Headphones className="w-5 h-5" style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        </a>
    );
}
