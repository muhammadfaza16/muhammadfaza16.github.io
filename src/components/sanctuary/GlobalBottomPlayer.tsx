"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "../AudioContext";
import { useRadio } from "../RadioContext";
import { Play, Square, SkipBack, SkipForward, Radio as RadioIcon, X } from "lucide-react";

export function GlobalBottomPlayer() {
    const {
        activePlaybackMode, setActivePlaybackMode, isPlaying: musicPlaying,
        togglePlay, currentSong, currentTime, duration, nextSong, prevSong
    } = useAudio();

    // We cannot destructure directly at hook level because RadioContext is optional depending on where it's mounted,
    // but here we know it runs inside the app wrapper which has both.
    const { activeStationId, stations, turnOff, stationsState, isSyncing } = useRadio();

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounted) return null;

    if (activePlaybackMode === 'none') return null;

    const isRadio = activePlaybackMode === 'radio';
    const isMusic = activePlaybackMode === 'music';

    // Format time helper
    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Derived Radio Data
    const activeStation = isRadio ? stations.find(s => s.id === activeStationId) : null;
    const currentState = activeStation ? stationsState[activeStation.id] : null;

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
                    width: "calc(100% - 2rem)",
                    maxWidth: "600px",
                    zIndex: 9999,
                    userSelect: "none"
                }}
            >
                <div style={{
                    background: "#3f3f46", // Elevated hardware tier
                    border: "1px solid #18181b",
                    borderBottom: "4px solid #18181b", // Physical chassis ridge
                    borderRadius: "12px",
                    padding: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    boxShadow: "0 10px 30px -5px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)"
                }}>

                    {/* Left: Info LCD Screen */}
                    <div style={{
                        flex: 1,
                        background: "#c1c1c1", // Classic LCD
                        borderRadius: "4px",
                        padding: "0.4rem 0.75rem",
                        border: "2px solid #18181b",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        overflow: "hidden"
                    }}>
                        {isRadio && activeStation ? (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#39ff14", boxShadow: "0 0 4px rgba(57,255,20,0.5)" }} />
                                        <span style={{ fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 900, color: "#111", letterSpacing: "1px" }}>LIVE ON AIR</span>
                                    </div>
                                    <span style={{ fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 900, color: "#111" }}>
                                        {currentState ? currentState.formattedTime : "0:00"}
                                    </span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {activeStation.name}
                                    </span>
                                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px" }}>
                                        {currentState ? currentState.song.title : "SYNCING..."}
                                    </span>
                                </div>
                            </>
                        ) : isMusic && currentSong ? (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 900, color: "#111", letterSpacing: "1px" }}>PROTOCOL</span>
                                    <span style={{ fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 900, color: "#111" }}>
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {currentSong.title.split("—")[1]?.trim() || currentSong.title}
                                    </span>
                                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {currentSong.title.split("—")[0]?.trim() || "Local File"}
                                    </span>
                                </div>
                                {/* Progress Bar Mini */}
                                <div style={{ width: "100%", height: "2px", background: "rgba(0,0,0,0.1)", borderRadius: "1px", marginTop: "4px" }}>
                                    <div style={{ width: `${(currentTime / (duration || 1)) * 100}%`, height: "100%", background: "#111", borderRadius: "1px" }} />
                                </div>
                            </>
                        ) : null}
                    </div>

                    {/* Right: Hardware Tactile Controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {isMusic && (
                            <motion.button
                                whileTap={{ scale: 0.9, y: 1 }}
                                onClick={() => prevSong()}
                                style={{
                                    background: "#282828", border: "1px solid #18181b", borderBottom: "2px solid #18181b",
                                    borderRadius: "4px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1aa", cursor: "pointer"
                                }}
                            >
                                <SkipBack size={14} fill="currentColor" />
                            </motion.button>
                        )}

                        <motion.button
                            whileTap={{ scale: 0.9, y: 2 }}
                            onClick={isRadio ? turnOff : togglePlay}
                            style={{
                                background: isRadio ? "#18181b" : "#282828",
                                border: "1px solid #18181b",
                                borderBottom: isRadio ? "1px solid #18181b" : "3px solid #18181b",
                                borderRadius: "6px", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center",
                                color: isRadio ? "#a1a1aa" : "#e4e4e7", cursor: "pointer"
                            }}
                        >
                            {isRadio ? (
                                <Square size={16} fill="currentColor" />
                            ) : musicPlaying ? (
                                <div style={{ display: "flex", gap: "3px" }}>
                                    <div style={{ width: "4px", height: "14px", background: "currentColor", borderRadius: "1px" }} />
                                    <div style={{ width: "4px", height: "14px", background: "currentColor", borderRadius: "1px" }} />
                                </div>
                            ) : (
                                <div style={{ width: "0", height: "0", borderTop: "6px solid transparent", borderLeft: "10px solid currentColor", borderBottom: "6px solid transparent", marginLeft: "2px" }} />
                            )}
                        </motion.button>

                        {isMusic && (
                            <motion.button
                                whileTap={{ scale: 0.9, y: 1 }}
                                onClick={() => nextSong()}
                                style={{
                                    background: "#282828", border: "1px solid #18181b", borderBottom: "2px solid #18181b",
                                    borderRadius: "4px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1aa", cursor: "pointer"
                                }}
                            >
                                <SkipForward size={14} fill="currentColor" />
                            </motion.button>
                        )}

                        {/* Global Close to entirely dismiss the module */}
                        <motion.button
                            whileTap={{ scale: 0.9, y: 1 }}
                            onClick={() => {
                                if (isRadio) turnOff();
                                else if (musicPlaying) togglePlay();
                                setActivePlaybackMode('none');
                            }}
                            style={{
                                background: "transparent", border: "none", color: "#71717a", cursor: "pointer", padding: "4px", marginLeft: "4px"
                            }}
                        >
                            <X size={16} strokeWidth={3} />
                        </motion.button>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
}
