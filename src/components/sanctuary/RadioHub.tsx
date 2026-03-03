"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRadio } from "../RadioContext";

export function RadioHub({ onSelect }: { onSelect: (id: string) => void }) {
    const { stations, activeStationId, isRadioPaused, stationsState, isSyncing, isBuffering } = useRadio();

    return (
        <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
        }}>
            {stations.map((station, idx) => {
                const isThisStation = activeStationId === station.id;
                const isPlaying = isThisStation && !isRadioPaused && !isSyncing && !isBuffering;
                const state = stationsState[station.id];
                const isLive = state !== null;
                const color = station.themeColor || "#888";

                return (
                    <motion.div
                        key={station.id}
                        layoutId={`station-card-${station.id}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06, type: "spring", stiffness: 300, damping: 22 }}
                        onClick={() => onSelect(station.id)}
                        whileHover={{ scale: 1.02, backgroundColor: isPlaying ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)" }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            background: isPlaying
                                ? "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)"
                                : "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                            backdropFilter: "blur(16px) saturate(120%)",
                            border: `1px solid ${isPlaying ? color + "40" : "rgba(255,255,255,0.08)"}`,
                            borderTop: `1px solid ${isPlaying ? color + "60" : "rgba(255,255,255,0.15)"}`,
                            borderLeft: `1px solid ${isPlaying ? color + "40" : "rgba(255,255,255,0.1)"}`,
                            borderRadius: "16px",
                            padding: "1rem 1.25rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            boxShadow: isPlaying
                                ? `0 8px 32px ${color}15, inset 0 0 20px ${color}05`
                                : "0 4px 16px rgba(0,0,0,0.1)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Ambient Glow Behind Card for LIVE */}
                        {isPlaying && (
                            <motion.div
                                animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.9, 1.05, 0.9] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: `radial-gradient(circle at 30% 50%, ${color}30 0%, transparent 60%)`,
                                    filter: "blur(20px)",
                                    pointerEvents: "none",
                                    zIndex: 0
                                }}
                            />
                        )}

                        {/* Radio Waves Watermark */}
                        <div style={{
                            position: "absolute",
                            right: "0",
                            top: "0",
                            bottom: "0",
                            width: "70%",
                            opacity: isPlaying ? 0.25 : 0.04,
                            pointerEvents: "none",
                            zIndex: 0,
                            backgroundImage: `repeating-radial-gradient(circle at 100% 50%, transparent 0, transparent 12px, ${color} 12px, ${color} 13px)`,
                            maskImage: "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
                            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
                            transition: "opacity 0.6s ease"
                        }} />

                        {/* Frequency Dial Icon */}
                        <div style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            background: "rgba(0,0,0,0.2)",
                            backdropFilter: "blur(8px)",
                            border: `2px solid ${isPlaying ? color : "rgba(255,255,255,0.15)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3)${isPlaying ? `, 0 0 12px ${color}40` : ""}`,
                            position: "relative",
                            zIndex: 1
                        }}>
                            {/* Center dot */}
                            <div style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: isPlaying ? color : (isLive ? color + "aa" : "rgba(255,255,255,0.3)"),
                                boxShadow: isPlaying ? `0 0 8px ${color}` : (isLive ? `0 0 6px ${color}60` : "none"),
                            }} />

                            {/* Animated ring only when actually playing */}
                            {isPlaying && (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                    style={{
                                        position: "absolute",
                                        inset: "-2px",
                                        borderRadius: "50%",
                                        border: `1.5px solid transparent`,
                                        borderTopColor: color,
                                        opacity: 0.8,
                                    }}
                                />
                            )}
                        </div>

                        {/* Station Info */}
                        <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                <motion.h3
                                    layoutId={`station-title-${station.id}`}
                                    style={{
                                        margin: 0,
                                        color: isPlaying ? "#fff" : "rgba(255,255,255,0.8)",
                                        fontSize: "0.9rem",
                                        fontWeight: 800,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        textShadow: isPlaying ? `0 0 10px ${color}60` : "none"
                                    }}
                                >
                                    {station.name}
                                </motion.h3>

                                {isLive && (
                                    <span style={{
                                        fontSize: "0.55rem",
                                        background: isPlaying ? color + "30" : "rgba(0,0,0,0.3)",
                                        color: isPlaying ? "#fff" : "rgba(255,255,255,0.6)",
                                        padding: "2px 6px",
                                        borderRadius: "4px",
                                        fontWeight: 800,
                                        letterSpacing: "0.5px",
                                        border: `1px solid ${isPlaying ? color + "50" : "rgba(255,255,255,0.1)"}`,
                                        backdropFilter: "blur(4px)"
                                    }}>
                                        {isPlaying ? "ON AIR" : "LIVE"}
                                    </span>
                                )}
                            </div>
                            <p style={{
                                margin: 0,
                                color: isPlaying ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)",
                                fontSize: "0.65rem",
                                fontWeight: 500,
                                fontStyle: isLive ? "italic" : "normal",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>
                                {isLive && state ? `♪ ${state.song.title}` : station.description}
                            </p>
                        </div>

                        {/* Playing Bars — only when actually playing */}
                        {isPlaying && (
                            <div style={{ display: "flex", alignItems: "flex-end", gap: "2.5px", height: "18px", flexShrink: 0, zIndex: 1 }}>
                                {[1, 2, 3].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, 16, 4] }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                                        style={{ width: "3px", background: color, borderRadius: "2px", opacity: 0.9, boxShadow: `0 0 8px ${color}` }}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
