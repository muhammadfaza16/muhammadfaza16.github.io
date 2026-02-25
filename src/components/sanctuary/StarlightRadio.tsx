"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Music2, Share2, Play } from "lucide-react";
import { useAudio, PLAYLIST } from "@/components/AudioContext";

const TIME_PER_SONG = 210; // 3.5 minutes per rotation

export function StarlightRadio() {
    const { playQueue, isPlaying, currentSong, seekTo } = useAudio();
    const [currentTime, setCurrentTime] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setCurrentTime(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const radioState = useMemo(() => {
        if (!mounted) return null;
        const totalDuration = PLAYLIST.length * TIME_PER_SONG;
        const globalProgress = currentTime % totalDuration;
        const songIndex = Math.floor(globalProgress / TIME_PER_SONG);
        const songProgress = globalProgress % TIME_PER_SONG;

        return {
            song: PLAYLIST[songIndex],
            index: songIndex,
            progress: songProgress,
            formattedTime: `${Math.floor(songProgress / 60)}:${(songProgress % 60).toString().padStart(2, '0')}`
        };
    }, [currentTime, mounted]);

    const handleTuneIn = () => {
        if (!radioState) return;
        playQueue(PLAYLIST, radioState.index);
        // We need a slight delay to ensure the song starts before seeking
        setTimeout(() => {
            seekTo(radioState.progress);
        }, 300);
    };

    const isTunedIn = isPlaying && currentSong?.audioUrl === radioState?.song?.audioUrl;

    if (!mounted || !radioState) return null;

    return (
        <div style={{
            width: "100%",
            maxWidth: "420px",
            margin: "0 auto 2rem",
            position: "relative",
            perspective: "1000px"
        }}>
            {/* Retro Radio Body */}
            <motion.div
                initial={{ rotateX: 10, y: 20, opacity: 0 }}
                animate={{ rotateX: 0, y: 0, opacity: 1 }}
                style={{
                    background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
                    borderRadius: "24px",
                    padding: "1.5rem",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.05)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Vintage Texture Overlay */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "url('/textures/noise.png')",
                    opacity: 0.03,
                    pointerEvents: "none",
                }} />

                {/* Top Section: Display & Tuner */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                    {/* The "Nixie" Display Area */}
                    <div style={{
                        flex: 1,
                        background: "#080808",
                        borderRadius: "12px",
                        padding: "1rem",
                        border: "1px solid #333",
                        boxShadow: "inset 0 4px 12px rgba(0,0,0,0.8)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minHeight: "80px",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF3B30", boxShadow: "0 0 8px #FF3B30" }}
                                />
                                <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#FF3B30", fontWeight: "bold", letterSpacing: "1px" }}>ON AIR</span>
                            </div>
                            <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#FFB000", opacity: 0.8 }}>98.5 MHZ</span>
                        </div>

                        <div style={{ marginTop: "0.5rem", overflow: "hidden" }}>
                            <motion.div
                                animate={{ x: isTunedIn ? [0, -200] : 0 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                style={{
                                    fontFamily: "'Courier New', Courier, monospace",
                                    fontSize: "0.9rem",
                                    color: "#FFB000",
                                    whiteSpace: "nowrap",
                                    textShadow: "0 0 10px rgba(255, 176, 0, 0.4)"
                                }}
                            >
                                {radioState.song.title}
                            </motion.div>
                        </div>
                    </div>

                    {/* Analog Level Meter */}
                    <div style={{
                        width: "60px",
                        background: "#080808",
                        borderRadius: "12px",
                        padding: "0.5rem",
                        border: "1px solid #333",
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                        justifyContent: "flex-end"
                    }}>
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    opacity: isTunedIn ? (Math.random() > 0.3 ? 1 : 0.4) : 0.2,
                                    backgroundColor: i < 3 ? "#FF3B30" : i < 6 ? "#FFCC00" : "#4CD964"
                                }}
                                style={{ height: "4px", borderRadius: "1px" }}
                            />
                        ))}
                    </div>
                </div>

                {/* Frequency Tuning Dial */}
                <div style={{
                    position: "relative",
                    height: "40px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                    border: "1px solid rgba(255,255,255,0.05)",
                    overflow: "hidden"
                }}>
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 10px",
                        gap: "10px"
                    }}>
                        {[...Array(40)].map((_, i) => (
                            <div key={i} style={{
                                width: "1px",
                                height: i % 5 === 0 ? "15px" : "8px",
                                background: "rgba(255,255,255,0.2)"
                            }} />
                        ))}
                    </div>
                    {/* The Tuning Needle */}
                    <motion.div
                        animate={{ left: `${(radioState.index / PLAYLIST.length) * 100}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            width: "2px",
                            background: "#FF3B30",
                            boxShadow: "0 0 10px #FF3B30",
                            zIndex: 2
                        }}
                    />
                </div>

                {/* Bottom Section: Controls */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px", fontWeight: "bold" }}>VOLUME</div>
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #333", background: "conic-gradient(#FFB000 70%, #1a1a1a 0)" }} />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px", fontWeight: "bold" }}>TUNE</div>
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #333", background: "conic-gradient(#FFB000 40%, #1a1a1a 0)" }} />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleTuneIn}
                        style={{
                            background: isTunedIn ? "#4CD964" : "linear-gradient(180deg, #FFB000 0%, #CC8C00 100%)",
                            color: "#000",
                            border: "none",
                            borderRadius: "12px",
                            padding: "0.8rem 1.5rem",
                            fontSize: "0.85rem",
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            boxShadow: "0 4px 15px rgba(255, 176, 0, 0.3)",
                            cursor: "pointer",
                            fontFamily: "sans-serif",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}
                    >
                        {isTunedIn ? (
                            <>
                                <div style={{ display: "flex", gap: "2px" }}>
                                    {[1, 2, 3].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [4, 12, 4] }}
                                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                            style={{ width: "2px", background: "#000", borderRadius: "1px" }}
                                        />
                                    ))}
                                </div>
                                TUNED IN
                            </>
                        ) : (
                            <>
                                <Play size={16} fill="currentColor" />
                                TUNE IN
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Chrome Trim */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: "2%",
                    right: "2%",
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                }} />
            </motion.div>

            {/* Ghosting Shadow for depth */}
            <div style={{
                position: "absolute",
                bottom: "-10px",
                left: "5%",
                right: "5%",
                height: "20px",
                background: "rgba(0,0,0,0.4)",
                filter: "blur(15px)",
                zIndex: -1
            }} />
        </div>
    );
}
