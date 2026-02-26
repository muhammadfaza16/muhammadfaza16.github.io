"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useRadio, TIME_PER_SONG } from "@/components/RadioContext";
import { PLAYLIST } from "@/components/AudioContext";


export function StarlightRadio() {
    const {
        isTunedIn,
        isSyncing,
        isBuffering,
        radioState,
        handleTuneIn
    } = useRadio();

    if (!radioState) return null;

    return (
        <div style={{
            width: "100%",
            maxWidth: "440px",
            margin: "0 auto 2rem",
            position: "relative",
            perspective: "1000px",
            touchAction: "none",
            userSelect: "none",
            padding: "0 1rem"
        }}>
            {/* Retro Radio Body */}
            <motion.div
                initial={{ rotateX: 10, y: 20, opacity: 0 }}
                animate={{ rotateX: 0, y: 0, opacity: 1 }}
                style={{
                    background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
                    borderRadius: "24px",
                    padding: "1.25rem",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6), inset 0 2px 2px rgba(255,255,255,0.05)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Vintage Texture Overlay */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    opacity: 0.04,
                    pointerEvents: "none",
                    mixBlendMode: "overlay",
                }} />

                {/* Top Section: Display & Tuner */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    {/* The "Nixie" Display Area */}
                    <div style={{
                        flex: 1,
                        background: "#080808",
                        borderRadius: "14px",
                        padding: "1rem",
                        border: "1px solid #2a2a2a",
                        boxShadow: "inset 0 4px 20px rgba(0,0,0,0.9)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minHeight: "85px",
                        overflow: "hidden", // CRITICAL FIX
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "auto" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <motion.div
                                    animate={{ opacity: isTunedIn ? [0.4, 1, 0.4] : 0.2 }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        background: isTunedIn ? "#FF3B30" : "#333",
                                        boxShadow: isTunedIn ? "0 0 10px #FF3B30" : "none"
                                    }}
                                />
                                <span style={{
                                    fontFamily: "monospace",
                                    fontSize: "0.7rem",
                                    color: isTunedIn ? "#FF3B30" : "#444",
                                    fontWeight: "900",
                                    letterSpacing: "1px",
                                    textShadow: isTunedIn ? "0 0 8px rgba(255, 59, 48, 0.4)" : "none"
                                }}>ON AIR</span>
                            </div>
                            <span style={{
                                fontFamily: "monospace",
                                fontSize: "0.8rem",
                                color: "#FFB000",
                                fontWeight: "bold",
                                opacity: 0.9,
                                letterSpacing: "1px"
                            }}>98.5 MHZ</span>
                        </div>

                        {/* Song Marquee Section */}
                        <div style={{
                            position: "relative",
                            width: "100%",
                            height: "24px",
                            marginTop: "0.75rem",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center"
                        }}>
                            <motion.div
                                key={radioState.song.title}
                                animate={{ x: isTunedIn ? ["0%", "-100%"] : "0%" }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                style={{
                                    fontFamily: "'Courier New', Courier, monospace",
                                    fontSize: "0.85rem",
                                    color: "#FFB000",
                                    whiteSpace: "nowrap",
                                    textShadow: "0 0 10px rgba(255, 176, 0, 0.4)",
                                    display: "flex",
                                    gap: "3rem",
                                    position: "absolute",
                                    left: 0
                                }}
                            >
                                <span style={{ flexShrink: 0 }}>{radioState.song.title}</span>
                                <span style={{ flexShrink: 0 }}>{radioState.song.title}</span>
                                <span style={{ flexShrink: 0 }}>{radioState.song.title}</span>
                            </motion.div>
                        </div>

                        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace", fontWeight: "bold", letterSpacing: "1px" }}>
                                {isTunedIn ? "SINYAL STABIL" : "STANDBY"}
                            </span>
                            <span style={{ fontSize: "0.65rem", color: "#FFB000", fontFamily: "monospace", opacity: 0.8 }}>
                                {radioState.formattedTime}
                            </span>
                        </div>
                    </div>

                    {/* Analog Level Meter */}
                    <div style={{
                        width: "55px",
                        background: "#080808",
                        borderRadius: "14px",
                        border: "1px solid #2a2a2a",
                        boxShadow: "inset 0 4px 20px rgba(0,0,0,0.5)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                        justifyContent: "center",
                        padding: "6px"
                    }}>
                        {[...Array(10)].map((_, i) => {
                            const threshold = (10 - i) * 20;
                            // Predefined active baseline for each bar when tuned in
                            const isActiveBaseline = isTunedIn && (10 - i) <= 6; // 60% baseline
                            const color = i < 2 ? "#FF3B30" : i < 5 ? "#FFCC00" : "#4CD964";

                            return (
                                <motion.div
                                    key={i}
                                    animate={isTunedIn ? {
                                        opacity: [isActiveBaseline ? 1 : 0.15, 1, 0.15],
                                        backgroundColor: color,
                                        boxShadow: [
                                            isActiveBaseline ? `0 0 10px ${color}` : "none",
                                            `0 0 15px ${color}`,
                                            "none"
                                        ]
                                    } : {
                                        opacity: 0.15,
                                        backgroundColor: color,
                                        boxShadow: "none"
                                    }}
                                    transition={isTunedIn ? {
                                        duration: 0.3 + Math.random() * 0.5,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: Math.random() * 0.5
                                    } : { duration: 0.1 }}
                                    style={{ height: "4px", borderRadius: "1.5px" }}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Frequency Tuning Dial */}
                <div style={{
                    position: "relative",
                    height: "44px",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "12px",
                    marginBottom: "1.5rem",
                    border: "1px solid rgba(255,255,255,0.05)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 10px",
                        gap: "8px",
                        opacity: 0.3
                    }}>
                        {[...Array(30)].map((_, i) => (
                            <div key={i} style={{
                                width: "1px",
                                height: i % 5 === 0 ? "20px" : "10px",
                                background: "#fff",
                                flexShrink: 0
                            }} />
                        ))}
                    </div>
                    {/* The Tuning Needle */}
                    <motion.div
                        animate={{ left: `${(radioState.index / PLAYLIST.length) * 100}%` }}
                        transition={{ type: "spring", stiffness: 60, damping: 15 }}
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            width: "3px",
                            background: "#FF3B30",
                            boxShadow: "0 0 15px #FF3B30",
                            zIndex: 2,
                            borderRadius: "1px"
                        }}
                    />
                </div>

                {/* Bottom Section: Controls */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem"
                }}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <div style={{ textAlign: "center", width: "40px" }}>
                            <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", marginBottom: "6px", fontWeight: "900" }}>VOL</div>
                            <div style={{
                                height: "30px",
                                background: "#080808",
                                borderRadius: "6px",
                                border: "1px solid #333",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "flex-end",
                                padding: "2px"
                            }}>
                                <motion.div
                                    animate={isTunedIn ? {
                                        height: ["40%", "85%", "35%", "70%", "50%"]
                                    } : {
                                        height: "15%"
                                    }}
                                    transition={isTunedIn ? {
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeInOut"
                                    } : { duration: 0.5 }}
                                    style={{
                                        width: "100%",
                                        background: "linear-gradient(to top, #FFB000, #FFD000)",
                                        borderRadius: "2px",
                                        boxShadow: "0 0 10px rgba(255, 176, 0, 0.4)"
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ textAlign: "center", width: "40px" }}>
                            <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", marginBottom: "6px", fontWeight: "900" }}>SYNC</div>
                            <motion.div
                                animate={{ rotate: isSyncing ? 360 : radioState.index * 60 }}
                                transition={isSyncing ? { duration: 1.5, repeat: Infinity, ease: "linear" } : { type: "spring" }}
                                style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    border: "2px solid #333",
                                    background: "#151515",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto"
                                }}
                            >
                                <div style={{ width: "2px", height: "8px", background: "#FFB000", borderRadius: "1px", position: "relative", top: "-2px" }} />
                            </motion.div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98, y: 0 }}
                        onClick={handleTuneIn}
                        style={{
                            flex: 1,
                            background: isTunedIn ?
                                "linear-gradient(180deg, #4CD964 0%, #2ecc71 100%)" :
                                "linear-gradient(180deg, #FFB000 0%, #CC8C00 100%)",
                            color: "#000",
                            borderRadius: "18px",
                            padding: "0.75rem",
                            height: "50px",
                            fontSize: "0.85rem",
                            fontWeight: 900,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            boxShadow: isTunedIn ?
                                "0 10px 25px rgba(76, 217, 100, 0.3)" :
                                "0 10px 20px rgba(255, 176, 0, 0.3)",
                            cursor: "pointer",
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                            border: "1px solid rgba(255,255,255,0.15)",
                            fontFamily: "ui-sans-serif, system-ui, sans-serif"
                        }}
                    >
                        {isSyncing || isBuffering ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                    style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2.5px solid #000", borderTopColor: "transparent" }}
                                />
                                SYNCING
                            </>
                        ) : isTunedIn ? (
                            <>
                                <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                                    {[1, 2, 3].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [6, 16, 6] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                            style={{ width: "2.5px", background: "#000", borderRadius: "1px" }}
                                        />
                                    ))}
                                </div>
                                SEDANG LIVE
                            </>
                        ) : (
                            <>
                                <Play size={18} fill="currentColor" strokeWidth={0} />
                                DENGARKAN
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
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                }} />
            </motion.div>

            {/* Ghosting Shadow for depth */}
            <div style={{
                position: "absolute",
                bottom: "-15px",
                left: "10%",
                right: "10%",
                height: "25px",
                background: "rgba(0,0,0,0.5)",
                filter: "blur(20px)",
                zIndex: -1
            }} />
        </div>
    );
}
