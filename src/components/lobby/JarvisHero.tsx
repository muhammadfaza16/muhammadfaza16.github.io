"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { useAudio } from "@/components/AudioContext";
import { Disc } from "lucide-react";

export function JarvisHero() {
    const { isPlaying, currentSong, currentLyricText } = useAudio();
    const [greeting, setGreeting] = useState("");
    const [subtext, setSubtext] = useState("");
    const [mounted, setMounted] = useState(false);

    // Time-aware logic
    useEffect(() => {
        setMounted(true);
        const hour = new Date().getHours();

        let timeGreeting = "Greetings.";
        let timeSubtext = "System active.";

        if (isPlaying && currentSong) {
            // "Sabotase" Mode: Override with Song Info
            if (currentLyricText) {
                setGreeting(currentLyricText);
                // Show "Song - Artist" in subtext when lyric is active
                setSubtext(`${currentSong.title.split("—")[1]?.trim() || currentSong.title}`);
            } else {
                setGreeting(currentSong.title.split("—")[1]?.trim() || currentSong.title);
                setSubtext(currentSong.title.split("—")[0]?.trim() || "Unknown Artist");
            }
        } else {
            // Standard Time Logic
            if (hour >= 5 && hour < 12) {
                timeGreeting = "Selamat pagi, Faza.";
                timeSubtext = "Solar systems charging. Ready for the day.";
            } else if (hour >= 12 && hour < 17) {
                timeGreeting = "Selamat siang, Faza.";
                timeSubtext = "Optimal productivity levels detected.";
            } else if (hour >= 17 && hour < 21) {
                timeGreeting = "Selamat sore, Faza.";
                timeSubtext = "The sun is setting. Time to reflect.";
            } else {
                timeGreeting = "Selamat malam, Faza.";
                timeSubtext = "Starlight mode engaged. Peace and quiet.";
            }
            setGreeting(timeGreeting);
            setSubtext(timeSubtext);
        }
    }, [isPlaying, currentSong, currentLyricText]); // Re-run when music state changes

    if (!mounted) return null;

    return (
        <section style={{
            padding: "0 1.5rem",
            marginBottom: "2rem",
            width: "100%",
            display: "flex",
            justifyContent: "center"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "480px", // Match iPhone width
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
            }}>
                {/* JARVIS WIDGET - iOS Style */}
                <div
                    style={{
                        background: "rgba(255, 255, 255, 0.1)", // Light glass
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        borderRadius: "26px", // Super elliptical
                        padding: "1.5rem",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        minHeight: "160px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontFamily: "-apple-system, sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.6)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                    }}>
                        <div style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: isPlaying ? "#32D74B" : "#007AFF", // Green for Music, Blue for System
                            boxShadow: isPlaying ? "0 0 8px #32D74B" : "0 0 8px #007AFF"
                        }} />
                        {isPlaying ? "NOW PLAYING" : "SYSTEM"}
                    </div>

                    {/* Content */}
                    <div style={{ position: "relative", zIndex: 2 }}>
                        <h3 style={{
                            fontFamily: "-apple-system, sans-serif",
                            fontSize: "1.5rem",
                            fontWeight: 500,
                            lineHeight: 1.2,
                            color: "white",
                            marginBottom: "0.5rem"
                        }}>
                            {greeting}
                        </h3>
                        <p style={{
                            fontSize: "0.9rem",
                            color: "rgba(255,255,255,0.7)",
                            lineHeight: 1.4,
                        }}>
                            {subtext}
                        </p>
                    </div>

                    {/* Glossy Reflection */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "150px",
                        height: "150px",
                        background: "radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent 70%)",
                        pointerEvents: "none",
                        borderTopRightRadius: "26px"
                    }} />
                </div>
            </div>
        </section>
    );
}
