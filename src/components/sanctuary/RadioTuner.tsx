"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Square, Radio as RadioIcon } from "lucide-react";
import { useRadio } from "../RadioContext";

const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
    }
};

const METER_BARS = Array.from({ length: 16 }).map(() => ({
    dur: 0.15 + Math.random() * 0.35,
    del: Math.random() * 0.25
}));

export function RadioTuner({ stationId, onBack }: { stationId: string; onBack: () => void }) {
    const { stations, activeStationId, isSyncing, isBuffering, stationsState, handleTuneIn, pauseRadio, resumeRadio, isRadioPaused } = useRadio();

    const station = stations.find(s => s.id === stationId);
    if (!station) return null;

    const isThisStation = activeStationId === station.id;
    const isPlaying = isThisStation && !isRadioPaused && !isSyncing && !isBuffering;
    const currentState = stationsState[station.id];
    const isLive = currentState !== null;
    const color = station.themeColor || "#888";

    const displayTime = currentState ? currentState.formattedTime : "0:00";
    const displaySong = currentState ? currentState.song.title : "STANDBY";

    return (
        <div style={{ width: "100%", userSelect: "none", touchAction: "none" }}>

            {/* Nav */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem", gap: "0.8rem" }}>
                <motion.button
                    onClick={() => { triggerHaptic(); onBack(); }}
                    whileTap={{ scale: 0.9, y: 1 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px", width: "36px", height: "36px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "rgba(255,255,255,0.7)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        transition: "all 0.2s"
                    }}
                >
                    <ArrowLeft size={16} strokeWidth={2.5} />
                </motion.button>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase" }}>
                    Tuner
                </span>
            </div>

            {/* Tuner Panel container */}
            <motion.div
                layoutId={`station-card-${station.id}`}
                style={{
                    background: isPlaying ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "20px",
                    padding: "1.5rem",
                    border: `1px solid ${isPlaying ? color + "40" : "rgba(255,255,255,0.05)"}`,
                    borderTop: `1px solid ${isPlaying ? color + "60" : "rgba(255,255,255,0.1)"}`,
                    position: "relative",
                    overflow: "hidden",
                    opacity: isPlaying ? 1 : 0.85, // Dim when standby
                    filter: isPlaying ? "none" : "saturate(0.8) brightness(0.9)",
                    boxShadow: isPlaying
                        ? `0 10px 40px rgba(0,0,0,0.3), inset 0 0 30px ${color}10, 0 0 20px ${color}15`
                        : "0 10px 30px rgba(0,0,0,0.2), inset 0 2px 6px rgba(0,0,0,0.2)",
                }}
            >
                {/* Subtle glow overlay — only when playing */}
                {isPlaying && (
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "80%",
                            height: "2px",
                            background: `linear-gradient(90deg, transparent, ${color}90, transparent)`,
                            borderRadius: "1px",
                            boxShadow: `0 0 15px ${color}`
                        }}
                    />
                )}

                {/* Station Name + LED */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <motion.div
                            animate={isPlaying ? { opacity: [0.5, 1, 0.5] } : {}}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            style={{
                                width: "6px", height: "6px", borderRadius: "50%",
                                background: isPlaying ? color : (isLive ? color + "aa" : "rgba(255,255,255,0.3)"),
                                boxShadow: isPlaying ? `0 0 10px ${color}` : (isLive ? `0 0 6px ${color}60` : "none"),
                            }}
                        />
                        <motion.h2
                            layoutId={`station-title-${station.id}`}
                            style={{
                                margin: 0,
                                color: isPlaying ? "#fff" : "rgba(255,255,255,0.8)",
                                fontSize: "1.1rem",
                                fontWeight: 800,
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                                textShadow: isPlaying ? `0 0 15px ${color}80` : "none"
                            }}
                        >
                            {station.name}
                        </motion.h2>
                    </div>
                    <span style={{
                        fontFamily: "monospace",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        color: isPlaying ? "#fff" : (isLive ? color + "cc" : "rgba(255,255,255,0.5)"),
                        letterSpacing: "1.5px",
                        background: isPlaying ? color + "40" : "transparent",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        border: isPlaying ? `1px solid ${color}60` : "none"
                    }}>
                        {isPlaying ? "ON AIR" : (isLive ? "LIVE" : "OFF")}
                    </span>
                </div>

                {/* LCD Screen Container */}
                <div style={{
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "12px",
                    padding: "1rem",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.02)",
                    boxShadow: "inset 0 4px 12px rgba(0,0,0,0.8)",
                    marginBottom: "1.25rem",
                    minHeight: "75px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "0.65rem",
                            color: isPlaying ? color : "rgba(255,255,255,0.4)",
                            fontWeight: 800,
                            letterSpacing: "1px",
                            textShadow: isPlaying ? `0 0 8px ${color}60` : "none"
                        }}>
                            {isPlaying ? "▶ PLAYING" : "■ STANDBY"}
                        </span>
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "0.65rem",
                            color: isPlaying ? "#fff" : "rgba(255,255,255,0.5)",
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
                        minHeight: "26px",
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
                                fontSize: "1rem",
                                color: isPlaying ? "#fff" : "rgba(255,255,255,0.6)",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                display: "flex",
                                gap: "4rem",
                                position: "absolute",
                                left: 0,
                                textShadow: isPlaying ? `0 0 10px rgba(255,255,255,0.3)` : "none"
                            }}
                        >
                            <span>{displaySong}</span>
                            {isPlaying && <span>{displaySong}</span>}
                        </motion.div>
                    </div>
                </div>

                {/* VU Meter + Action Button Row */}
                <div style={{ display: "flex", gap: "0.8rem", alignItems: "stretch" }}>

                    {/* Glowing VU Meter View */}
                    <div style={{
                        flex: 1,
                        background: "rgba(0,0,0,0.4)",
                        borderRadius: "12px",
                        padding: "0.5rem 0.6rem",
                        border: "1px solid rgba(255,255,255,0.03)",
                        boxShadow: "inset 0 4px 10px rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: "3px",
                        height: "48px"
                    }}>
                        {METER_BARS.map((bar, i) => {
                            const ratio = i / METER_BARS.length;
                            // Make rightmost bars red, others station color
                            const playingColor = ratio > 0.8 ? "#ff3333" : ratio > 0.6 ? color : color;
                            const liveDimmedColor = ratio > 0.8 ? "rgba(255,50,50,0.4)" : color + "50";
                            const barColor = isPlaying ? playingColor : (isLive ? liveDimmedColor : "rgba(255,255,255,0.1)");

                            return (
                                <motion.div
                                    key={i}
                                    animate={isPlaying ? {
                                        height: [`15%`, `${35 + Math.random() * 65}%`, `15%`],
                                    } : isLive ? {
                                        height: [`10%`, `${15 + Math.random() * 30}%`, `10%`],
                                    } : {
                                        height: "10%",
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
                                        borderRadius: "2px",
                                        opacity: isPlaying ? 0.95 : (isLive ? 0.6 : 0.3),
                                        boxShadow: isPlaying ? `0 0 10px ${barColor}80` : "none"
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Premium Play/Stop Button Glass */}
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: isPlaying ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.1)" }}
                        whileTap={{ scale: 0.95, y: 1 }}
                        onClick={() => {
                            triggerHaptic();
                            if (isPlaying) {
                                pauseRadio();
                            } else if (isThisStation && isRadioPaused) {
                                resumeRadio(); // Lightweight resume
                            } else {
                                handleTuneIn(station.id); // Fresh tune-in
                            }
                        }}
                        style={{
                            width: "68px",
                            background: isPlaying ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.05)",
                            backdropFilter: "blur(12px)",
                            color: isPlaying ? color : "rgba(255,255,255,0.7)",
                            border: `1px solid ${isPlaying ? color + "50" : "rgba(255,255,255,0.1)"}`,
                            borderTop: `1px solid ${isPlaying ? color + "80" : "rgba(255,255,255,0.2)"}`,
                            borderRadius: "12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            cursor: "pointer",
                            fontSize: "0.55rem",
                            fontWeight: 800,
                            letterSpacing: "1.5px",
                            boxShadow: isPlaying
                                ? `0 8px 24px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1), 0 0 15px ${color}30`
                                : "0 4px 12px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.05)",
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
