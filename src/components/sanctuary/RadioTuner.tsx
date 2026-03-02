"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Square } from "lucide-react";
import { useRadio } from "../RadioContext";

const METER_RANDOMS = Array.from({ length: 12 }).map(() => ({
    duration: 0.2 + Math.random() * 0.4,
    delay: Math.random() * 0.3
}));

export function RadioTuner({ stationId, onBack }: { stationId: string; onBack: () => void }) {
    const { stations, activeStationId, isSyncing, isBuffering, stationsState, handleTuneIn, turnOff } = useRadio();

    const station = stations.find(s => s.id === stationId);
    if (!station) return null;

    const isActive = activeStationId === station.id;
    const currentState = stationsState[station.id];

    // Fallback if timeline hasn't computed yet
    const displayTime = currentState ? currentState.formattedTime : "0:00";
    const displaySong = currentState ? currentState.song.title : "SYNCING TIMELINES...";

    return (
        <div style={{
            width: "100%",
            maxWidth: "440px",
            margin: "0 auto",
            userSelect: "none",
            touchAction: "none"
        }}>
            {/* Navigation Header */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem", gap: "1rem" }}>
                <button
                    onClick={onBack}
                    style={{
                        background: "#3f3f46",
                        border: "1px solid #18181b",
                        borderBottom: "3px solid #18181b",
                        borderRadius: "8px",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#d4d4d8"
                    }}
                >
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <div style={{ fontSize: "0.75rem", color: "#a1a1aa", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>
                    Tuner Mode
                </div>
            </div>

            {/* Hardware Chassis */}
            <motion.div
                layoutId={`station-card-${station.id}`}
                style={{
                    background: "#282828",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    border: "1px solid #18181b",
                    borderBottom: "6px solid #18181b", // heavy embedded hardware panel
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* Station Identification with LED indicator */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: isActive ? "#39ff14" : "#ff0000",
                            opacity: isActive ? 0.9 : 0.4,
                            boxShadow: isActive ? "0 0 6px rgba(57, 255, 20, 0.4)" : "none",
                            border: "1px solid rgba(0,0,0,0.5)"
                        }} />
                        <motion.h2
                            layoutId={`station-title-${station.id}`}
                            style={{ margin: 0, color: "#e4e4e7", fontSize: "1.25rem", fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase" }}
                        >
                            {station.name}
                        </motion.h2>
                    </div>
                    <div style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "2px",
                        background: isActive ? "#d4d4d8" : "#18181b",
                        border: "1px solid #18181b"
                    }} />
                </div>

                {/* Digital Display Panel (Retro LCD Base) */}
                <div style={{
                    background: "#c1c1c1", // Classic LCD physical background tint
                    borderRadius: "4px",
                    padding: "0.75rem",
                    border: "2px solid #18181b",
                    boxShadow: "inset 0 6px 10px rgba(0,0,0,0.4), inset 0 2px 4px rgba(0,0,0,0.6)", // Deeper physically recessed shadow
                    marginBottom: "1.5rem",
                    minHeight: "80px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                            color: isActive ? "#111" : "#777", // Dark LCD digits
                            fontWeight: 900,
                            letterSpacing: "1px",
                        }}>
                            {isActive ? "ON AIR" : "STANDBY"}
                        </span>
                        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#111", fontWeight: 800 }}>
                            {displayTime}
                        </span>
                    </div>

                    {/* Marquee Track Title */}
                    <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden", position: "relative" }}>
                        <motion.div
                            animate={{ x: isActive ? ["0%", "-100%"] : "0%" }}
                            transition={{ duration: Math.max(10, displaySong.length * 0.3), repeat: Infinity, ease: "linear" }}
                            style={{
                                fontFamily: "'Courier New', Courier, monospace",
                                fontSize: "1rem",
                                color: isActive ? "#111" : "#777",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                                display: "flex",
                                gap: "4rem",
                                position: "absolute",
                                left: 0
                            }}
                        >
                            <span>{displaySong}</span>
                            <span>{displaySong}</span>
                        </motion.div>
                    </div>
                </div>

                {/* Functional Hardware Modules */}
                <div style={{ display: "flex", gap: "1rem", alignItems: "stretch" }}>

                    {/* Module 1: Level Meter Panel */}
                    <div style={{
                        flex: 1,
                        background: "#18181b", // Inset physical panel
                        borderRadius: "6px",
                        padding: "0.5rem",
                        border: "1px solid #3f3f46",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: "2px",
                        height: "50px"
                    }}>
                        {METER_RANDOMS.map((random, i) => {
                            const isPeak = i > 3 && i < 9;
                            const isActiveBaseline = isActive && isPeak;

                            return (
                                <motion.div
                                    key={i}
                                    animate={isActive ? {
                                        height: ["15%", `${50 + Math.random() * 50}%`, "15%"],
                                    } : {
                                        height: "15%",
                                    }}
                                    transition={isActive ? {
                                        duration: random.duration,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: random.delay
                                    } : { duration: 0.1 }}
                                    style={{
                                        flex: 1,
                                        background: isActiveBaseline ? "#d4d4d8" : "#71717a",
                                        borderRadius: "1px",
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Module 2: The Physical Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => isActive ? turnOff() : handleTuneIn(station.id)}
                        style={{
                            width: "80px",
                            background: isActive ? "#18181b" : "#3f3f46",
                            color: isActive ? "#a1a1aa" : "#e4e4e7",
                            border: "1px solid #18181b",
                            borderBottom: isActive ? "1px solid #18181b" : "3px solid #18181b", // Clicked in when active
                            borderRadius: "6px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            cursor: "pointer",
                            fontSize: "0.6rem",
                            fontWeight: 900,
                            letterSpacing: "1px"
                        }}
                    >
                        {isActive && (
                            <div style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: "#39ff14", // Dim green physical LED
                                opacity: 0.8,
                                boxShadow: "0 0 4px rgba(57, 255, 20, 0.3)",
                                marginBottom: "2px"
                            }} />
                        )}
                        {isSyncing || isBuffering ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid currentColor", borderTopColor: "transparent" }} />
                        ) : isActive ? (
                            <Square size={16} fill="currentColor" />
                        ) : (
                            <div style={{ width: "0", height: "0", borderTop: "6px solid transparent", borderLeft: "10px solid currentColor", borderBottom: "6px solid transparent" }} />
                        )}
                        <span style={{ marginTop: "2px" }}>{isActive ? "STOP" : "PLAY"}</span>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
