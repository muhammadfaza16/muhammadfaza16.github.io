"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Square, Radio as RadioIcon } from "lucide-react";
import { useRadio } from "../RadioContext";

const METER_BARS = Array.from({ length: 16 }).map(() => ({
    dur: 0.15 + Math.random() * 0.35,
    del: Math.random() * 0.25
}));

export function RadioTuner({ stationId, onBack }: { stationId: string; onBack: () => void }) {
    const { stations, activeStationId, isSyncing, isBuffering, stationsState, handleTuneIn, pauseRadio, resumeRadio, isRadioPaused } = useRadio();

    const station = stations.find(s => s.id === stationId);
    if (!station) return null;

    const isThisStation = activeStationId === station.id;
    const isPlaying = isThisStation && !isRadioPaused;
    const currentState = stationsState[station.id];
    const isLive = currentState !== null;
    const color = station.themeColor || "#888";

    const displayTime = currentState ? currentState.formattedTime : "0:00";
    const displaySong = currentState ? currentState.song.title : "STANDBY";

    return (
        <div style={{ width: "100%", userSelect: "none", touchAction: "none" }}>

            {/* Nav */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.85rem", gap: "0.6rem" }}>
                <motion.button
                    onClick={onBack}
                    whileTap={{ scale: 0.9, y: 1 }}
                    style={{
                        background: "#1e1e1e", border: "1.5px solid #2a2a2a",
                        borderRadius: "8px", width: "32px", height: "32px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#777",
                        boxShadow: "inset 0 2px 3px rgba(0,0,0,0.4)",
                    }}
                >
                    <ArrowLeft size={16} strokeWidth={2.5} />
                </motion.button>
                <span style={{ fontSize: "0.6rem", color: "#555", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    Tuner
                </span>
            </div>

            {/* Tuner Panel */}
            <motion.div
                layoutId={`station-card-${station.id}`}
                style={{
                    background: "#1e1e1e",
                    borderRadius: "16px",
                    padding: "1.25rem",
                    border: `1.5px solid ${isPlaying ? color + "30" : "#2a2a2a"}`,
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: isPlaying
                        ? `inset 0 0 30px ${color}06, 0 0 20px ${color}08`
                        : "inset 0 2px 6px rgba(0,0,0,0.4)",
                }}
            >
                {/* Subtle glow overlay — only when playing */}
                {isPlaying && (
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "60%",
                        height: "2px",
                        background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
                        borderRadius: "1px",
                    }} />
                )}

                {/* Station Name + LED */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <motion.div
                            animate={isPlaying ? { opacity: [0.5, 1, 0.5] } : {}}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            style={{
                                width: "5px", height: "5px", borderRadius: "50%",
                                background: isPlaying ? color : (isLive ? color + "88" : "#333"),
                                boxShadow: isPlaying ? `0 0 6px ${color}` : (isLive ? `0 0 4px ${color}40` : "none"),
                            }}
                        />
                        <motion.h2
                            layoutId={`station-title-${station.id}`}
                            style={{
                                margin: 0,
                                color: isPlaying ? color : "#888",
                                fontSize: "1rem",
                                fontWeight: 800,
                                letterSpacing: "0.5px",
                                textTransform: "uppercase",
                            }}
                        >
                            {station.name}
                        </motion.h2>
                    </div>
                    <span style={{
                        fontFamily: "monospace",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        color: isPlaying ? color : (isLive ? color + "aa" : "#444"),
                        letterSpacing: "1px",
                    }}>
                        {isPlaying ? "ON AIR" : (isLive ? "LIVE" : "OFF")}
                    </span>
                </div>

                {/* LCD Screen */}
                <div style={{
                    background: "#111",
                    borderRadius: "8px",
                    padding: "0.75rem 0.85rem",
                    border: "1.5px solid #222",
                    boxShadow: "inset 0 4px 8px rgba(0,0,0,0.6)",
                    marginBottom: "0.85rem",
                    minHeight: "60px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "0.6rem",
                            color: isPlaying ? color + "aa" : "#555",
                            fontWeight: 700,
                            letterSpacing: "1px",
                        }}>
                            {isPlaying ? "▶ PLAYING" : "■ STANDBY"}
                        </span>
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "0.6rem",
                            color: isPlaying ? color + "cc" : "#666",
                            fontWeight: 800,
                        }}>
                            {displayTime}
                        </span>
                    </div>

                    {/* Track name with marquee */}
                    <div style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                        position: "relative",
                        minHeight: "22px",
                    }}>
                        <motion.div
                            animate={isPlaying ? { x: ["0%", "-50%"] } : { x: "0%" }}
                            transition={isPlaying ? {
                                duration: Math.max(8, displaySong.length * 0.28),
                                repeat: Infinity,
                                ease: "linear"
                            } : {}}
                            style={{
                                fontFamily: "monospace",
                                fontSize: "0.85rem",
                                color: isPlaying ? color : "#666",
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                                display: "flex",
                                gap: "3rem",
                                position: "absolute",
                                left: 0,
                            }}
                        >
                            <span>{displaySong}</span>
                            {isPlaying && <span>{displaySong}</span>}
                        </motion.div>
                    </div>
                </div>

                {/* VU Meter + Action Button Row */}
                <div style={{ display: "flex", gap: "0.65rem", alignItems: "stretch" }}>

                    {/* VU Meter */}
                    <div style={{
                        flex: 1,
                        background: "#111",
                        borderRadius: "8px",
                        padding: "0.4rem 0.5rem",
                        border: "1.5px solid #222",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: "2px",
                        height: "42px"
                    }}>
                        {METER_BARS.map((bar, i) => {
                            const ratio = i / METER_BARS.length;
                            // Normal playing color: Green/Red
                            // Dimmed live color: dark green/grey
                            const playingColor = ratio > 0.75 ? "#ef4444" : ratio > 0.5 ? color : color + "88";
                            const liveDimmedColor = ratio > 0.75 ? "#ef444460" : color + "40";
                            const barColor = isPlaying ? playingColor : (isLive ? liveDimmedColor : "#222");

                            return (
                                <motion.div
                                    key={i}
                                    animate={isPlaying ? {
                                        height: [`12%`, `${30 + Math.random() * 65}%`, `12%`],
                                    } : isLive ? {
                                        height: [`8%`, `${15 + Math.random() * 30}%`, `8%`],
                                    } : {
                                        height: "8%",
                                    }}
                                    transition={(isPlaying || isLive) ? {
                                        duration: bar.dur,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: bar.del
                                    } : { duration: 0.3 }}
                                    style={{
                                        flex: 1,
                                        background: barColor,
                                        borderRadius: "1px",
                                        opacity: isPlaying ? 0.85 : (isLive ? 0.4 : 0.2),
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Play/Stop Button */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.93, y: 2 }}
                        onClick={() => {
                            if (isPlaying) {
                                pauseRadio();
                            } else if (isThisStation && isRadioPaused) {
                                resumeRadio(); // Lightweight resume
                            } else {
                                handleTuneIn(station.id); // Fresh tune-in
                            }
                        }}
                        style={{
                            width: "60px",
                            background: isPlaying ? "#111" : "#1e1e1e",
                            color: isPlaying ? color : "#888",
                            border: `1.5px solid ${isPlaying ? color + "30" : "#2a2a2a"}`,
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            cursor: "pointer",
                            fontSize: "0.5rem",
                            fontWeight: 800,
                            letterSpacing: "1px",
                            boxShadow: isPlaying
                                ? `inset 0 2px 4px rgba(0,0,0,0.5), 0 0 8px ${color}15`
                                : "inset 0 2px 4px rgba(0,0,0,0.3)",
                        }}
                    >
                        {isPlaying && (
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                style={{
                                    width: "4px", height: "4px", borderRadius: "50%",
                                    background: color,
                                    boxShadow: `0 0 4px ${color}`,
                                }}
                            />
                        )}
                        {isSyncing || isBuffering ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                style={{
                                    width: "14px", height: "14px", borderRadius: "50%",
                                    border: "2px solid currentColor", borderTopColor: "transparent",
                                }}
                            />
                        ) : isPlaying ? (
                            <Square size={14} fill="currentColor" />
                        ) : (
                            <RadioIcon size={14} />
                        )}
                        <span>{isPlaying ? "MUTE" : "LISTEN"}</span>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
