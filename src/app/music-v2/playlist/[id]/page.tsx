"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    Play,
    Shuffle,
    MoreVertical,
    Music2
} from "lucide-react";
import Link from "next/link";

export default function PlaylistDetailPageV2() {
    return (
        <div style={{
            minHeight: "100dvh",
            background: "#0a0a0a",
            color: "white",
            fontFamily: "var(--font-geist-sans), sans-serif",
            padding: "calc(env(safe-area-inset-top) + 1rem) 0 120px",
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden"
        }}>
            {/* Nav Header */}
            <div style={{ padding: "0 1.25rem", zIndex: 10 }}>
                <Link href="/music-v2/library" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <motion.div whileTap={{ scale: 0.9 }}>
                        <ChevronLeft size={26} strokeWidth={2} />
                    </motion.div>
                </Link>
            </div>

            {/* Hero Cover Section */}
            <section style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "2rem 1.25rem",
                textAlign: "center"
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "24px",
                        background: "#121212",
                        border: "1px solid rgba(255,255,255,0.06)",
                        marginBottom: "1.5rem",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Music2 size={64} color="rgba(255,255,255,0.05)" />
                </motion.div>

                <h2 style={{ fontSize: "1.75rem", fontWeight: 850, letterSpacing: "-0.02em" }}>Midnight EP</h2>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem", fontStyle: "italic" }}>
                    "A curated collection of late-night vibrations."
                </p>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem", fontWeight: 700, textTransform: "uppercase" }}>
                    12 Tracks • 48 Minutes
                </div>
            </section>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem", padding: "0 1.25rem", marginBottom: "2rem" }}>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    style={{
                        flex: 1,
                        height: "54px",
                        borderRadius: "27px",
                        background: "white",
                        color: "black",
                        border: "none",
                        fontSize: "0.95rem",
                        fontWeight: 750,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                    }}
                >
                    <Play size={18} fill="black" /> Listen
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    style={{
                        width: "54px",
                        height: "54px",
                        borderRadius: "27px",
                        background: "#121212",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Shuffle size={18} />
                </motion.button>
            </div>

            {/* Tracklist */}
            <section style={{ display: "flex", flexDirection: "column", padding: "0 1.25rem" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <motion.div
                        key={i}
                        whileTap={{ background: "rgba(255,255,255,0.03)" }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.85rem 0",
                            borderBottom: "1px solid rgba(255,255,255,0.03)"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.2)", width: "20px", fontWeight: 700 }}>{i}</span>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>Midnight Drift</span>
                                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem" }}>Aethereal Artist</span>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>3:45</span>
                            <MoreVertical size={16} color="rgba(255,255,255,0.2)" />
                        </div>
                    </motion.div>
                ))}
            </section>
        </div>
    );
}
