"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    Radio as RadioIcon,
    Music2,
    Search as SearchIcon,
    LayoutGrid,
    SignalMedium
} from "lucide-react";
import Link from "next/link";

export default function RadioPageV2() {
    return (
        <div style={{
            minHeight: "100dvh",
            background: "#0a0a0a",
            color: "white",
            fontFamily: "var(--font-geist-sans), sans-serif",
            padding: "calc(env(safe-area-inset-top) + 1rem) 1.25rem 120px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem"
        }}>
            {/* Header */}
            <header style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Link href="/music-v2" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <motion.div whileTap={{ scale: 0.9 }}>
                        <ChevronLeft size={26} strokeWidth={2} />
                    </motion.div>
                </Link>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.01em" }}>Radio Station</h1>
            </header>

            {/* Featured Section */}
            <section>
                <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Featured Tubes</h4>
                <div style={{ display: "flex", gap: "1rem", overflowX: "auto", scrollbarWidth: "none", margin: "0 -1.25rem", padding: "0 1.25rem 0.5rem" }}>
                    {["LOFI GIRL", "CHILLHOP", "SYNTHWAVE"].map((name, idx) => (
                        <motion.div
                            key={idx}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                flexShrink: 0,
                                width: "240px",
                                height: "130px",
                                background: "#121212",
                                borderRadius: "24px",
                                padding: "1.5rem",
                                border: "1px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "0.5rem"
                            }}
                        >
                            <SignalMedium size={24} color="#32D74B" />
                            <span style={{ fontSize: "0.95rem", fontWeight: 800 }}>{name}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Station List */}
            <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>On Air Now</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {[
                        { name: "Tokyo Chill", live: "After Hours - Night Drive", listeners: "1.2k" },
                        { name: "Lofi Jazz Hub", live: "Gentle Rain - Relaxing Beats", listeners: "850" },
                        { name: "Neon Phonk", live: "Aggressive Drift - Underground", listeners: "2.4k" },
                        { name: "Coffee Ambient", live: "Sunday Morning - Soft Piano", listeners: "150" },
                    ].map((station, idx) => (
                        <motion.div
                            key={idx}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                background: "#121212",
                                borderRadius: "20px",
                                padding: "1.15rem",
                                border: "1px solid rgba(255,255,255,0.05)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <RadioIcon size={20} color="rgba(255,255,255,0.2)" />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontSize: "0.95rem", fontWeight: 750 }}>{station.name}</span>
                                    <span style={{ fontSize: "0.75rem", color: "#32D74B", marginTop: "0.15rem", opacity: 0.8 }}>LIVE: {station.live}</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <div style={{ width: "5px", height: "5px", background: "#FF3B30", borderRadius: "50%" }} />
                                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.2)" }}>{station.listeners}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* High-Fidelity Bottom Nav */}
            <nav style={{
                position: "fixed",
                bottom: "1.5rem",
                left: "1.25rem",
                right: "1.25rem",
                height: "72px",
                background: "rgba(15,15,15,0.75)",
                backdropFilter: "blur(25px) saturate(180%)",
                borderRadius: "36px",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 2rem",
                zIndex: 100,
                boxShadow: "0 20px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1)"
            }}>
                {[
                    { icon: Music2, href: "/music-v2", active: false },
                    { icon: SearchIcon, href: "/curation", active: false },
                    { icon: RadioIcon, href: "/music-v2/radio", active: true },
                    { icon: LayoutGrid, href: "/music-v2/library", active: false }
                ].map((item, idx) => (
                    <Link key={idx} href={item.href} style={{ textDecoration: "none" }}>
                        <motion.div
                            whileTap={{ scale: 0.8 }}
                            style={{
                                color: item.active ? "white" : "rgba(255,255,255,0.3)",
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                        >
                            <item.icon size={26} strokeWidth={item.active ? 2.5 : 2} />
                            {item.active && (
                                <motion.div
                                    layoutId="nav-dot"
                                    style={{
                                        position: "absolute",
                                        bottom: "-10px",
                                        width: "4px",
                                        height: "4px",
                                        background: "#BF5AF2",
                                        borderRadius: "50%"
                                    }}
                                />
                            )}
                        </motion.div>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
