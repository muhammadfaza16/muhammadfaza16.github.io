"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const pathname = usePathname();

    // Song toggle handler
    const toggleSong = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Ensure audio pauses if user leaves the guest section entirely (optional safety)
    useEffect(() => {
        if (!pathname.startsWith("/guest/no28")) {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.pause();
        }
    }, [pathname]);

    return (
        <>
            {children}

            {/* Hidden Audio Element - Persistent across sub-pages */}
            <audio
                ref={audioRef}
                src="/audio/The 1975 - About You (Official).mp3"
                loop
                onEnded={() => setIsPlaying(false)}
            />

            {/* Floating Music Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: "spring" }}
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
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem"
                }}
            >
                {isPlaying ? "🎵" : "🎶"}
            </motion.button>

            {/* Floating Notes Animation - Polished & Smoother */}
            <AnimatePresence>
                {isPlaying && (
                    <div style={{ position: "fixed", bottom: "160px", right: "25px", zIndex: 999, pointerEvents: "none" }}>
                        {[0, 1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    y: -100 - (Math.random() * 50), // Travel further up
                                    x: [0, (i % 2 === 0 ? 20 : -20), (i % 2 === 0 ? -10 : 10)], // Sine wave motion
                                    scale: [0.5, 1, 0.8],
                                    rotate: [0, (i % 2 === 0 ? 10 : -10), (i % 2 === 0 ? -5 : 5)]
                                }}
                                transition={{
                                    duration: 2.5 + (Math.random()), // Varied duration
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
