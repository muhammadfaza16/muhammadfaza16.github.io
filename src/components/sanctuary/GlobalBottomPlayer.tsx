"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAudio } from "../AudioContext";
import { useRadio } from "../RadioContext";
import { Square, SkipBack, SkipForward, X, Play, Pause } from "lucide-react";

export function GlobalBottomPlayer() {
    const {
        activePlaybackMode, setActivePlaybackMode, isPlaying: musicPlaying,
        togglePlay, currentSong, currentTime, duration, nextSong, prevSong, stopMusic
    } = useAudio();

    const { activeStationId, stations, turnOff, pauseRadio, resumeRadio, isRadioPaused, stationsState, handleTuneIn } = useRadio();

    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounted) return null;

    if (activePlaybackMode === 'none') return null;

    // Hide on all music-related pages as they have their own dedicated UI
    if (pathname?.startsWith('/music') || pathname?.startsWith('/playlist')) return null;

    const isRadio = activePlaybackMode === 'radio';
    const isMusic = activePlaybackMode === 'music';

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const activeStation = isRadio ? stations.find(s => s.id === activeStationId) : null;
    const currentState = activeStation ? stationsState[activeStation.id] : null;
    const themeColor = activeStation?.themeColor || "#888";
    const isRadioPlaying = isRadio && activeStationId && !isRadioPaused;
    const accent = isRadio ? themeColor : "#aaa";
    const isPlaying = isRadio ? !!isRadioPlaying : musicPlaying;

    // Parse song title into artist / track
    const songTitle = isMusic && currentSong
        ? (currentSong.title.split("—")[1]?.trim() || currentSong.title)
        : (currentState?.song.title || "SYNCING...");
    const songArtist = isMusic && currentSong
        ? (currentSong.title.split("—")[0]?.trim() || "")
        : (activeStation?.name || "");

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, x: "-50%", opacity: 0 }}
                animate={{ y: 0, x: "-50%", opacity: 1 }}
                exit={{ y: 100, x: "-50%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                    position: "fixed",
                    bottom: "1rem",
                    left: "50%",
                    width: "calc(100% - 1.5rem)",
                    maxWidth: "340px",
                    zIndex: 9999,
                    userSelect: "none",
                }}
            >
                {/* Subtle outer glow matched to accent */}
                {isPlaying && (
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: `radial-gradient(ellipse at bottom, ${accent}30 0%, transparent 70%)`,
                            filter: "blur(20px)",
                            zIndex: -1,
                            pointerEvents: "none"
                        }}
                    />
                )}

                <div style={{
                    background: isPlaying ? "rgba(15, 15, 18, 0.65)" : "rgba(20, 20, 25, 0.45)",
                    backdropFilter: "blur(32px) saturate(180%)",
                    WebkitBackdropFilter: "blur(32px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderTop: "1px solid rgba(255,255,255,0.15)",
                    borderLeft: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: isPlaying
                        ? "0 16px 40px rgba(0,0,0,0.4), inset 0 2px 10px rgba(255,255,255,0.05)"
                        : "0 12px 30px rgba(0,0,0,0.3), inset 0 1px 4px rgba(255,255,255,0.05)",
                }}>
                    {/* Now Playing Info Row */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                        padding: "0.75rem 0.85rem 0.6rem",
                    }}>
                        {/* Album Art Placeholder / Waveform Indicator */}
                        <div style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "rgba(0,0,0,0.3)",
                            border: `1px solid ${accent}40`,
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                            gap: "3px",
                            padding: "6px",
                            flexShrink: 0,
                            boxShadow: `inset 0 2px 10px rgba(0,0,0,0.5)${isPlaying ? `, 0 0 15px ${accent}30` : ""}`,
                        }}>
                            {/* Animated playing bars */}
                            {[1, 2, 3, 4].map(i => (
                                <motion.div
                                    key={i}
                                    animate={isPlaying ? {
                                        height: ["30%", `${40 + Math.random() * 55}%`, "30%"],
                                    } : { height: "20%" }}
                                    transition={isPlaying ? {
                                        duration: 0.3 + i * 0.08,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: i * 0.06,
                                    } : { duration: 0.2 }}
                                    style={{
                                        flex: 1,
                                        background: accent,
                                        borderRadius: "2px",
                                        opacity: isPlaying ? 0.9 : 0.3,
                                        boxShadow: isPlaying ? `0 0 6px ${accent}` : "none"
                                    }}
                                />
                            ))}
                        </div>

                        {/* Track info — fixed width, truncated */}
                        <div style={{
                            flex: 1,
                            minWidth: 0, // allow truncation
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                        }}>
                            <span style={{
                                fontSize: "0.85rem",
                                fontWeight: 800,
                                color: "rgba(255,255,255,0.9)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                textShadow: isPlaying ? "0 0 10px rgba(255,255,255,0.15)" : "none"
                            }}>
                                {songTitle}
                            </span>
                            <span style={{
                                fontSize: "0.65rem",
                                fontWeight: 600,
                                color: isRadio ? accent : "rgba(255,255,255,0.5)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                opacity: 0.9
                            }}>
                                {songArtist}
                            </span>
                        </div>

                        {/* Time */}
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            color: isPlaying ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)",
                            flexShrink: 0,
                            marginRight: "0.2rem"
                        }}>
                            {isRadio
                                ? (currentState?.formattedTime || "0:00")
                                : formatTime(currentTime)
                            }
                        </span>
                    </div>

                    {/* Progress Bar (music only) */}
                    {isMusic && (
                        <div style={{ width: "100%", height: "2px", background: "rgba(255,255,255,0.08)" }}>
                            <div style={{
                                width: `${(currentTime / (duration || 1)) * 100}%`,
                                height: "100%",
                                background: "rgba(255,255,255,0.8)",
                                boxShadow: "0 0 8px rgba(255,255,255,0.5)",
                                transition: "width 0.3s linear",
                            }} />
                        </div>
                    )}
                    {isRadio && (
                        <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.05)" }} />
                    )}

                    {/* Controls Row */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        padding: "0.5rem 0.65rem 0.75rem",
                        position: "relative"
                    }}>
                        {isMusic && (
                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => prevSong()}
                                style={{
                                    background: "transparent", border: "none",
                                    color: "rgba(255,255,255,0.6)", cursor: "pointer",
                                    padding: "6px", borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                }}
                            >
                                <SkipBack size={18} fill="currentColor" />
                            </motion.button>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: isPlaying ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.15)" }}
                            whileTap={{ scale: 0.9, y: 1 }}
                            onClick={() => {
                                if (isRadio) {
                                    if (isRadioPaused && activeStationId) {
                                        resumeRadio(); // Lightweight resume
                                    } else {
                                        pauseRadio(); // Soft stop
                                    }
                                } else {
                                    setActivePlaybackMode('music'); // B5 Fix: Ensure mode is music
                                    togglePlay();
                                }
                            }}
                            style={{
                                background: isPlaying ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.3)",
                                border: `1px solid ${isPlaying ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}`,
                                borderRadius: "50%",
                                width: "42px",
                                height: "42px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: isRadio ? accent : "#fff",
                                cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                transition: "all 0.2s"
                            }}
                        >
                            {isRadio ? (
                                isRadioPaused ? (
                                    <Play size={16} fill="currentColor" style={{ marginLeft: "2px" }} />
                                ) : (
                                    <Square size={14} fill="currentColor" />
                                )
                            ) : musicPlaying ? (
                                <Pause size={16} fill="currentColor" />
                            ) : (
                                <Play size={16} fill="currentColor" style={{ marginLeft: "2px" }} />
                            )}
                        </motion.button>

                        {isMusic && (
                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => nextSong()}
                                style={{
                                    background: "transparent", border: "none",
                                    color: "rgba(255,255,255,0.6)", cursor: "pointer",
                                    padding: "6px", borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                }}
                            >
                                <SkipForward size={18} fill="currentColor" />
                            </motion.button>
                        )}

                        {/* Dismiss */}
                        <motion.button
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => {
                                if (isRadio) turnOff();
                                else stopMusic(); // B2 Fix: Use stopMusic instead of togglePlay
                                setActivePlaybackMode('none');
                            }}
                            style={{
                                background: "rgba(0,0,0,0.2)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "50%",
                                color: "rgba(255,255,255,0.5)",
                                cursor: "pointer",
                                padding: "6px",
                                position: "absolute",
                                right: "0.85rem",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}
                        >
                            <X size={14} strokeWidth={2.5} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
