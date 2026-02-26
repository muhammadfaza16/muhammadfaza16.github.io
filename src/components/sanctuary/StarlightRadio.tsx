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
        freqData,
        radioState,
        handleTuneIn
    } = useRadio();

    if (!radioState) return null;

    return (
        <div style={{
            width: "100%",
            maxWidth: "420px",
            margin: "0 auto 2rem",
            position: "relative",
            perspective: "1000px",
            touchAction: "none",
            userSelect: "none"
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
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    opacity: 0.04,
                    pointerEvents: "none",
                    mixBlendMode: "overlay",
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
                                <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#FF3B30", fontWeight: "900", letterSpacing: "1.5px", textShadow: "0 0 10px rgba(255, 59, 48, 0.5)" }}>ON AIR</span>
                            </div>
                            <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#FFB000", fontWeight: "bold", opacity: 0.9 }}>98.5 MHZ</span>
                        </div>

                        <div style={{ marginTop: "0.4rem", marginBottom: "0.2rem" }}>
                            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontWeight: "bold" }}>SINYAL STABIL</span>
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
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "inset 0 4px 12px rgba(0,0,0,0.5)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        justifyContent: "center",
                        padding: "4px"
                    }}>
                        {[...Array(12)].map((_, i) => {
                            const binIndex = Math.floor((i / 12) * 60);
                            const value = freqData ? freqData[binIndex] : 0;
                            const threshold = (12 - i) * (200 / 12);
                            const isActive = isTunedIn && value > threshold;

                            return (
                                <motion.div
                                    key={i}
                                    animate={{
                                        opacity: isActive ? 1 : 0.2,
                                        backgroundColor: i < 3 ? "#FF3B30" : i < 6 ? "#FFCC00" : "#4CD964",
                                        boxShadow: isActive ? `0 0 10px ${i < 3 ? "#FF3B30" : i < 6 ? "#FFCC00" : "#4CD964"}` : "none"
                                    }}
                                    transition={{ duration: 0.1 }}
                                    style={{ height: "4px", borderRadius: "1px" }}
                                />
                            );
                        })}
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
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem" }}>
                    <div style={{ display: "flex", gap: "1.2rem", alignItems: "flex-end", paddingBottom: "4px" }}>
                        <div style={{ textAlign: "center", width: "44px" }}>
                            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", marginBottom: "8px", fontWeight: "bold", letterSpacing: "0.5px" }}>VOL</div>
                            <div style={{
                                height: "24px",
                                background: "#080808",
                                borderRadius: "4px",
                                border: "1px solid #333",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "flex-end",
                                padding: "2px"
                            }}>
                                <motion.div
                                    animate={{
                                        height: isTunedIn ? `${(freqData ? freqData[10] / 2.5 : 0) + 20}%` : "10%"
                                    }}
                                    style={{
                                        width: "100%",
                                        background: "#FFB000",
                                        borderRadius: "1px",
                                        boxShadow: "0 0 5px #FFB000"
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ textAlign: "center", width: "44px" }}>
                            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", marginBottom: "8px", fontWeight: "bold", letterSpacing: "0.5px" }}>TUNE</div>
                            <motion.div
                                animate={{ rotate: radioState.index * 45 }}
                                whileTap={{ scale: 0.9, rotate: radioState.index * 45 + 90 }}
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    border: "2px solid #333",
                                    background: `conic-gradient(#FFB000 ${(radioState.progress / TIME_PER_SONG) * 100}%, #1a1a1a 0)`,
                                    cursor: "pointer",
                                    position: "relative"
                                }}
                            >
                                <div style={{ position: "absolute", top: "2px", left: "50%", transform: "translateX(-50%)", width: "2px", height: "6px", background: "rgba(255,255,255,0.4)", borderRadius: "1px" }} />
                            </motion.div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleTuneIn}
                        style={{
                            background: isTunedIn ? "#4CD964" : "linear-gradient(180deg, #FFB000 0%, #CC8C00 100%)",
                            color: "#000",
                            borderRadius: "16px",
                            padding: "0.7rem 1.4rem",
                            height: "48px",
                            minWidth: "150px",
                            fontSize: "0.9rem",
                            fontWeight: 900,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            boxShadow: isTunedIn ? "0 8px 20px rgba(76, 217, 100, 0.25)" : "0 8px 10px rgba(255, 176, 0, 0.25)",
                            cursor: "pointer",
                            fontFamily: "sans-serif",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            border: "1px solid rgba(255,255,255,0.1)"
                        }}
                    >
                        {isSyncing || isBuffering ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #000", borderTopColor: "transparent" }}
                                />
                                SYNCING...
                            </>
                        ) : isTunedIn ? (
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
                                SEDANG LIVE
                            </>
                        ) : (
                            <>
                                <Play size={16} fill="currentColor" />
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
