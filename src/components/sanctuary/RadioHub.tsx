"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRadio } from "../RadioContext";

export function RadioHub({ onSelect }: { onSelect: (id: string) => void }) {
    const { stations, activeStationId, isRadioPaused, stationsState } = useRadio();

    return (
        <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
        }}>
            {stations.map((station, idx) => {
                const isThisStation = activeStationId === station.id;
                const isPlaying = isThisStation && !isRadioPaused;
                const state = stationsState[station.id];
                const isLive = state !== null;
                const color = station.themeColor || "#888";

                return (
                    <motion.div
                        key={station.id}
                        layoutId={`station-card-${station.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06, type: "spring", stiffness: 300, damping: 22 }}
                        onClick={() => onSelect(station.id)}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        style={{
                            background: "#1e1e1e",
                            border: `1.5px solid ${isPlaying ? color + "40" : "#2a2a2a"}`,
                            borderRadius: "12px",
                            padding: "0.85rem 1rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.85rem",
                            boxShadow: isPlaying
                                ? `inset 0 0 20px ${color}08, 0 0 15px ${color}10`
                                : "inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.02)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Frequency Dial Icon */}
                        <div style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            background: "#151515",
                            border: `2px solid ${isPlaying ? color : "#333"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: `inset 0 2px 4px rgba(0,0,0,0.5)${isPlaying ? `, 0 0 8px ${color}30` : ""}`,
                            position: "relative",
                        }}>
                            {/* Center dot */}
                            <div style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: isPlaying ? color : "#444",
                                boxShadow: isPlaying ? `0 0 6px ${color}` : "none",
                            }} />

                            {/* Animated ring only when actually playing */}
                            {isPlaying && (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                    style={{
                                        position: "absolute",
                                        inset: "-1px",
                                        borderRadius: "50%",
                                        border: `1px solid transparent`,
                                        borderTopColor: color,
                                        opacity: 0.5,
                                    }}
                                />
                            )}
                        </div>

                        {/* Station Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                                <motion.h3
                                    layoutId={`station-title-${station.id}`}
                                    style={{
                                        margin: 0,
                                        color: isPlaying ? color : "#aaa",
                                        fontSize: "0.85rem",
                                        fontWeight: 800,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    {station.name}
                                </motion.h3>

                                {isLive && (
                                    <span style={{
                                        fontSize: "0.5rem",
                                        background: isPlaying ? color + "20" : "#222",
                                        color: isPlaying ? color : "#666",
                                        padding: "1px 5px",
                                        borderRadius: "3px",
                                        fontWeight: 800,
                                        letterSpacing: "0.5px",
                                        border: `1px solid ${isPlaying ? color + "30" : "#333"}`,
                                    }}>
                                        {isPlaying ? "ON AIR" : "LIVE"}
                                    </span>
                                )}
                            </div>
                            <p style={{
                                margin: 0,
                                color: "#555",
                                fontSize: "0.6rem",
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>
                                {isPlaying && state ? state.song.title : station.description}
                            </p>
                        </div>

                        {/* Playing Bars — only when actually playing */}
                        {isPlaying && (
                            <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "16px", flexShrink: 0 }}>
                                {[1, 2, 3].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, 14, 4] }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                                        style={{ width: "2.5px", background: color, borderRadius: "1px", opacity: 0.7 }}
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
