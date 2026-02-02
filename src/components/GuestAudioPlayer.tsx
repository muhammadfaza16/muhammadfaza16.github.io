"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function GuestAudioPlayer() {
    const pathname = usePathname();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const intentionallyPausedRef = useRef(false);

    // Check if we are in the guest/no28 section (for audio persistence)
    const isGuestSection = pathname?.includes("/guest/no28") ?? false;
    // Visibility Logic: Button only on Home (/guest/no28)
    const isHome = pathname === "/guest/no28" || pathname === "/guest/no28/";

    // Manage Playback
    // REMOVED: Auto-stop on navigation to allow persistence per user request
    // useEffect(() => {
    //     if (!isGuestSection) { ... }
    // }, [isGuestSection]);

    // Handle toggle
    const toggleSong = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            intentionallyPausedRef.current = true;
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            intentionallyPausedRef.current = false;
            setIsPlaying(true);
        }
    };

    // Render logic:
    // 1. Audio element always stays mounted to persist playback
    // 2. Visuals (Button/Notes) only appear in Guest Section (or if playing?)
    //    User asked strictly for persistence, so we keep controls local to avoid cluttering Home.

    const showControls = isHome; // Only show controls on the dashboard itself

    return (
        <>
            <audio
                ref={audioRef}
                src="/audio/The 1975 - About You (Official).mp3"
                loop
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Floating Music Button - visible ONLY on Guest Home */}
            {showControls && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleSong}
                    style={{
                        position: "fixed",
                        bottom: "100px",
                        right: "20px",
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        background: isPlaying
                            ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)"
                            : "linear-gradient(135deg, #b07d62 0%, #d2a679 100%)",
                        border: "none",
                        boxShadow: isPlaying
                            ? "0 4px 20px rgba(255,107,107,0.4)"
                            : "0 4px 15px rgba(176,125,98,0.3)",
                        cursor: "pointer",
                        zIndex: 9999, // Ensure it's on top of everything
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem"
                    }}
                >
                    {isPlaying ? "🎵" : "🎶"}
                </motion.button>
            )}

            {/* Floating Notes Animation - Polished & Smoother */}
            <AnimatePresence>
                {isPlaying && showControls && (
                    <div style={{ position: "fixed", bottom: "160px", right: "25px", zIndex: 9998, pointerEvents: "none" }}>
                        {[0, 1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    y: -100 - (Math.random() * 50),
                                    x: [0, (i % 2 === 0 ? 20 : -20), (i % 2 === 0 ? -10 : 10)],
                                    scale: [0.5, 1, 0.8],
                                    rotate: [0, (i % 2 === 0 ? 10 : -10), (i % 2 === 0 ? -5 : 5)]
                                }}
                                transition={{
                                    duration: 2.5 + (Math.random()),
                                    repeat: Infinity,
                                    delay: i * 0.8,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    position: "absolute",
                                    fontSize: `${1 + Math.random() * 0.5}rem`,
                                    color: "#b07d62",
                                    left: 0,
                                    bottom: 0
                                }}
                            >
                                ♪
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
