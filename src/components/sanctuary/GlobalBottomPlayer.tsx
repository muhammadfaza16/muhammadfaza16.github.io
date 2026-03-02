"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAudio } from "../AudioContext";
import { useRadio } from "../RadioContext";
import { Square, SkipBack, SkipForward, X } from "lucide-react";

export function GlobalBottomPlayer() {
    const {
        activePlaybackMode, setActivePlaybackMode, isPlaying: musicPlaying,
        togglePlay, currentSong, currentTime, duration, nextSong, prevSong
    } = useAudio();

    const { activeStationId, stations, turnOff, pauseRadio, resumeRadio, isRadioPaused, stationsState, handleTuneIn } = useRadio();

    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounted) return null;

    if (activePlaybackMode === 'none') return null;

    // Hide on radio page when radio is playing (RadioTuner has its own controls)
    if (pathname?.startsWith('/music/radio') && activePlaybackMode === 'radio') return null;

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
                    bottom: "0.75rem",
                    left: "50%",
                    width: "calc(100% - 1.5rem)",
                    maxWidth: "320px",
                    zIndex: 9999,
                    userSelect: "none",
                }}
            >
                <div style={{
                    background: "linear-gradient(180deg, #2a2a2a 0%, #222 100%)",
                    border: "2px solid #111",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 12px 40px -8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}>
                    {/* Now Playing Info Row */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.6rem 0.65rem 0.45rem",
                    }}>
                        {/* Album Art Placeholder / Waveform Indicator */}
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            background: "#111",
                            border: `1.5px solid ${accent}20`,
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                            gap: "2px",
                            padding: "6px 5px",
                            flexShrink: 0,
                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
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
                                        borderRadius: "1px",
                                        opacity: isPlaying ? 0.7 : 0.2,
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
                            gap: "1px",
                        }}>
                            <span style={{
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                color: "#ccc",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>
                                {songTitle}
                            </span>
                            <span style={{
                                fontSize: "0.6rem",
                                fontWeight: 600,
                                color: isRadio ? accent + "99" : "#666",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>
                                {songArtist}
                            </span>
                        </div>

                        {/* Time */}
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            color: "#555",
                            flexShrink: 0,
                        }}>
                            {isRadio
                                ? (currentState?.formattedTime || "0:00")
                                : formatTime(currentTime)
                            }
                        </span>
                    </div>

                    {/* Progress Bar (music only) */}
                    {isMusic && (
                        <div style={{ width: "100%", height: "2px", background: "#1a1a1a" }}>
                            <div style={{
                                width: `${(currentTime / (duration || 1)) * 100}%`,
                                height: "100%",
                                background: "#555",
                                transition: "width 0.3s linear",
                            }} />
                        </div>
                    )}

                    {/* Controls Row */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.6rem",
                        padding: "0.4rem 0.65rem 0.55rem",
                        borderTop: "1px solid #1a1a1a",
                    }}>
                        {isMusic && (
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => prevSong()}
                                style={{
                                    background: "none", border: "none",
                                    color: "#666", cursor: "pointer", padding: "4px",
                                }}
                            >
                                <SkipBack size={16} fill="currentColor" />
                            </motion.button>
                        )}

                        <motion.button
                            whileTap={{ scale: 0.85, y: 1 }}
                            onClick={() => {
                                if (isRadio) {
                                    if (isRadioPaused && activeStationId) {
                                        resumeRadio(); // Lightweight resume
                                    } else {
                                        pauseRadio(); // Soft stop
                                    }
                                } else {
                                    togglePlay();
                                }
                            }}
                            style={{
                                background: "#151515",
                                border: `1.5px solid ${isRadio ? accent + "30" : "#2a2a2a"}`,
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: isRadio ? accent : "#aaa",
                                cursor: "pointer",
                                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
                            }}
                        >
                            {isRadio ? (
                                isRadioPaused ? (
                                    <div style={{
                                        width: "0", height: "0",
                                        borderTop: "6px solid transparent",
                                        borderLeft: "10px solid currentColor",
                                        borderBottom: "6px solid transparent",
                                        marginLeft: "2px",
                                    }} />
                                ) : (
                                    <Square size={12} fill="currentColor" />
                                )
                            ) : musicPlaying ? (
                                <div style={{ display: "flex", gap: "2.5px" }}>
                                    <div style={{ width: "3px", height: "12px", background: "currentColor", borderRadius: "1px" }} />
                                    <div style={{ width: "3px", height: "12px", background: "currentColor", borderRadius: "1px" }} />
                                </div>
                            ) : (
                                <div style={{
                                    width: "0", height: "0",
                                    borderTop: "6px solid transparent",
                                    borderLeft: "10px solid currentColor",
                                    borderBottom: "6px solid transparent",
                                    marginLeft: "2px",
                                }} />
                            )}
                        </motion.button>

                        {isMusic && (
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => nextSong()}
                                style={{
                                    background: "none", border: "none",
                                    color: "#666", cursor: "pointer", padding: "4px",
                                }}
                            >
                                <SkipForward size={16} fill="currentColor" />
                            </motion.button>
                        )}

                        {/* Dismiss */}
                        <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => {
                                if (isRadio) turnOff();
                                else if (musicPlaying) togglePlay();
                                setActivePlaybackMode('none');
                            }}
                            style={{
                                background: "none", border: "none",
                                color: "#333", cursor: "pointer", padding: "4px",
                                position: "absolute",
                                right: "0.65rem",
                                top: "0.5rem",
                            }}
                        >
                            <X size={12} strokeWidth={3} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
