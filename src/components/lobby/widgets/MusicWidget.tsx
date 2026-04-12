"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Disc, Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface MusicWidgetProps {
    swipeDirection: number;
    isPlaying: boolean;
    currentSong: any;
    song: string;
    artist: string;
    currentTime: number;
    duration: number;
    togglePlay: () => void;
    prevSong: () => void;
    nextSong: () => void;
    seekTo: (time: number) => void;
}

export function MusicWidget({
    swipeDirection,
    isPlaying,
    currentSong,
    song,
    artist,
    currentTime,
    duration,
    togglePlay,
    prevSong,
    nextSong,
    seekTo
}: MusicWidgetProps) {
    const router = useRouter();

    return (
        <motion.div
            key="now-playing"
            custom={swipeDirection}
            variants={{
                initial: (d: number) => ({ opacity: 0, x: d * 15 }),
                animate: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -15 })
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ 
                position: "relative", zIndex: 1, padding: "1.25rem", 
                background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.08)",
                borderRadius: "28px",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px) saturate(120%)",
                WebkitBackdropFilter: "blur(16px) saturate(120%)",
            }}
        >
            {/* Now Playing Header Row (Disc + Info) */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    sessionStorage.setItem("autoExpandPlayer", "true");
                    router.push('/music');
                }}
                style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.25rem", cursor: "pointer" }}
            >
                {/* Rotating Disc */}
                <div style={{
                    width: "52px", height: "52px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.05) 50%, transparent)",
                        animation: isPlaying ? "spin 3s linear infinite" : "none"
                    }} />
                    <div style={{
                        width: "44px", height: "44px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative",
                        zIndex: 1,
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.3)"
                    }}>
                        <Disc size={20} color="#FFF" />
                    </div>
                </div>

                {/* Song Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontSize: "0.95rem", fontWeight: 800,
                        color: "#FFF",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        marginBottom: "1px",
                        textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                    }}>{song}</div>
                    <div style={{
                        fontSize: "0.78rem", fontWeight: 600,
                        color: "rgba(255,255,255,0.45)",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        display: "flex", alignItems: "center", gap: "8px",
                        fontFamily: "var(--font-display), system-ui, sans-serif",
                        letterSpacing: "0.02em"
                    }}>
                        {artist}
                        {isPlaying && (
                            <span style={{ display: "flex", alignItems: "center", gap: "2px", height: "10px", marginLeft: "2px" }}>
                                {[0, 1, 2].map(b => (
                                    <motion.span
                                        key={b}
                                        style={{ width: "2px", borderRadius: "1px", background: "#6366F1" }}
                                        animate={{ height: ["4px", `${10 + b * 2}px`, "5px", `${12 - b}px`, "4px"] }}
                                        transition={{ duration: 0.6 + b * 0.1, repeat: Infinity, ease: "easeInOut", delay: b * 0.1 }}
                                    />
                                ))}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls Row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", width: "100%", padding: "0 0.5rem" }}>
                <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); prevSong(); }} 
                    style={{ padding: "10px", cursor: "pointer", display: "flex", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}
                >
                    <SkipBack size={20} fill="rgba(255,255,255,0.95)" color="rgba(255,255,255,0.95)" />
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    style={{
                        width: "52px", height: "52px", borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                        border: "1px solid rgba(255,255,255,0.15)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
                    }}>
                    {isPlaying
                        ? <Pause size={24} fill="#FFF" color="#FFF" />
                        : <Play size={24} fill="#FFF" color="#FFF" style={{ marginLeft: "3px" }} />
                    }
                </motion.div>
                <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); nextSong(); }} 
                    style={{ padding: "10px", cursor: "pointer", display: "flex", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }}
                >
                    <SkipForward size={20} fill="rgba(255,255,255,0.95)" color="rgba(255,255,255,0.95)" />
                </motion.div>
            </div>

            {/* Progress Bar Row */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    if (duration > 0) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                        seekTo(pct * duration);
                    }
                }}
                style={{
                    width: "100%", height: "6px", borderRadius: "100px",
                    background: "rgba(255,255,255,0.1)",
                    position: "relative", cursor: "pointer",
                    overflow: "visible",
                    marginBottom: "0.25rem",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)"
                }}
            >
                <motion.div
                    initial={false}
                    animate={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                        position: "absolute", left: 0, top: 0, bottom: 0,
                        borderRadius: "100px",
                        background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
                        boxShadow: "0 0 12px rgba(99, 102, 241, 0.4)",
                    }}
                />
                <motion.div
                    initial={false}
                    animate={{ left: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                        position: "absolute", top: "50%",
                        width: "12px", height: "12px",
                        backgroundColor: "#FFF", borderRadius: "50%",
                        transform: "translate(-50%, -50%)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.5), 0 0 0 3px rgba(255,255,255,0.15)",
                        zIndex: 2
                    }}
                />
            </div>
        </motion.div>
    );
}
