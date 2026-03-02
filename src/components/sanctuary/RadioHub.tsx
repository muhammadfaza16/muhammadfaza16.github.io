"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRadio } from "../RadioContext";

export function RadioHub({ onSelect }: { onSelect: (id: string) => void }) {
    const { stations, activeStationId, stationsState } = useRadio();

    return (
        <div style={{
            width: "100%",
            maxWidth: "440px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
        }}>
            <h2 style={{
                color: "#a1a1aa",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "0.25rem",
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
                            background: isActive ? "#3f3f46" : "#282828",
                            border: "1px solid #18181b",
                            borderBottom: isActive ? "1px solid #18181b" : "3px solid #18181b",
                            borderRadius: "8px",
                            padding: "1rem 1.25rem",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {/* Content */}
                        <div style={{ zIndex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "6px" }}>
                                <motion.h3
                                    layoutId={`station-title-${station.id}`}
                                    style={{ margin: 0, color: "#e4e4e7", fontSize: "1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}
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
                            <p style={{ margin: 0, color: isActive ? "#d4d4d8" : "#a1a1aa", fontSize: "0.75rem", maxWidth: "220px", lineHeight: 1.4, fontWeight: 500 }}>
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
                                        style={{ width: "4px", background: "#d4d4d8", borderRadius: "1px" }}
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
