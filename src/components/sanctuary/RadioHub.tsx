"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRadio } from "../RadioContext";

export function RadioHub({ onSelect }: { onSelect: (id: string) => void }) {
    const { stations, activeStationId, stationsState } = useRadio();

    return (
        <div style={{
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem"
        }}>
            <h2 style={{
                color: "#555",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: "0.15rem",
                paddingLeft: "4px"
            }}>Select Frequency</h2>

            {stations.map(station => {
                const isActive = activeStationId === station.id;
                const state = stationsState[station.id];
                const isLive = state !== null;

                return (
                    <motion.div
                        key={station.id}
                        layoutId={`station-card-${station.id}`}
                        onClick={() => onSelect(station.id)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        style={{
                            background: isActive ? "#252525" : "#1e1e1e",
                            border: "1.5px solid " + (isActive ? "#3a3a3a" : "#2a2a2a"),
                            borderRadius: "10px",
                            padding: "0.85rem 1rem",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.02)",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {/* Content */}
                        <div style={{ zIndex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "6px" }}>
                                <motion.h3
                                    layoutId={`station-title-${station.id}`}
                                    style={{ margin: 0, color: "#aaa", fontSize: "0.9rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}
                                >
                                    {station.name}
                                </motion.h3>

                                {isLive && (
                                    <span style={{
                                        fontSize: "0.6rem",
                                        fontFamily: "sans-serif",
                                        background: isActive ? "#18181b" : "#3f3f46",
                                        color: isActive ? "#d4d4d8" : "#a1a1aa",
                                        padding: "2px 6px",
                                        borderRadius: "4px",
                                        fontWeight: 800,
                                        letterSpacing: "0.5px",
                                        border: "1px solid #18181b"
                                    }}>
                                        {isActive ? "ON AIR" : "LIVE"}
                                    </span>
                                )}
                            </div>
                            <p style={{ margin: 0, color: isActive ? "#888" : "#666", fontSize: "0.68rem", maxWidth: "220px", lineHeight: 1.4, fontWeight: 500 }}>
                                {station.description}
                            </p>
                        </div>

                        {/* Playing Status Animator */}
                        {isActive && (
                            <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "16px" }}>
                                {[1, 2, 3, 4].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, 16, 4] }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                        style={{ width: "3px", background: "#aaa", borderRadius: "1px" }}
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
