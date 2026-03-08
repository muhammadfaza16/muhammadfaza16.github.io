"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    Play,
    Music2,
    Radio,
    Heart,
    Disc3,
    LayoutGrid,
    Search as SearchIcon
} from "lucide-react";
import Link from "next/link";

export default function MusicV2Page() {
    return (
        <div style={{
            minHeight: "100dvh",
            background: "#0a0a0a",
            color: "white",
            fontFamily: "var(--font-geist-sans), sans-serif",
            padding: "calc(env(safe-area-inset-top) + 1rem) 1.25rem 100px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
        }}>
            {/* Header */}
            <header style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0"
            }}>
                <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
                    <motion.div whileTap={{ scale: 0.9 }}>
                        <ChevronLeft size={24} />
                    </motion.div>
                </Link>
                <h1 style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Lab v2.0</h1>
                <div style={{ width: 24 }} />
            </header>

            {/* Greeting */}
            <section>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>Selamat Malam, Faza</h2>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>
                    "Syncing your vibe..."
                </p>
            </section>

            {/* Now Playing Hero (Clean Bento Card) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    background: "#121212",
                    borderRadius: "24px",
                    padding: "1.5rem",
                    border: "1px solid rgba(255,255,255,0.06)",
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "16/9",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end"
                }}
            >
                <div style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                }}>
                    <Music2 size={20} color="#FFD60A" />
                </div>

                <div>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Currently Playing
                    </span>
                    <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginTop: "0.25rem" }}>Starlight Serenity</h3>
                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>Aethereal Drift</p>
                </div>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    style={{
                        position: "absolute",
                        bottom: "1.5rem",
                        right: "1.5rem",
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        background: "white",
                        border: "none",
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Play size={22} fill="black" />
                </motion.button>
            </motion.div>

            {/* Quick Actions (Minimalist Bento Grid) */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem"
            }}>
                {[
                    { title: "Library", icon: Music2, color: "#BF5AF2" },
                    { title: "Radio", icon: Radio, color: "#32D74B" },
                    { title: "Favorites", icon: Heart, color: "#FF375F" },
                    { title: "Discovery", icon: LayoutGrid, color: "#0A84FF" }
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: "#121212",
                            borderRadius: "22px",
                            padding: "1.25rem",
                            border: "1px solid rgba(255,255,255,0.05)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem"
                        }}
                    >
                        <item.icon size={22} color={item.color} />
                        <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>{item.title}</span>
                    </motion.div>
                ))}
            </div>

            {/* Recently Played (Clean Vinyl Strip) */}
            <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: 800 }}>Recently Spinning</h4>
                    <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>Explore</span>
                </div>
                <div style={{
                    display: "flex",
                    gap: "1.5rem",
                    overflowX: "auto",
                    padding: "0 0 1rem",
                    scrollbarWidth: "none",
                    margin: "0 -1.25rem",
                    paddingLeft: "1.25rem"
                }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ flexShrink: 0, position: "relative" }}>
                            <div style={{
                                width: "110px",
                                height: "110px",
                                borderRadius: "16px",
                                background: "#1a1a1a",
                                position: "relative",
                                zIndex: 2,
                                border: "1px solid rgba(255,255,255,0.05)"
                            }} />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                style={{
                                    position: "absolute",
                                    top: "5px",
                                    left: "30px",
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    background: "radial-gradient(circle, #222 20%, #000 70%)",
                                    zIndex: 1,
                                    border: "1px solid #111",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Disc3 size={16} color="rgba(255,255,255,0.05)" />
                            </motion.div>
                        </div>
                    ))}
                </div>
            </section>

            {/* High-Fidelity Bottom Nav - Restored as requested */}
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
                    { icon: Music2, href: "/music-v2", active: true },
                    { icon: SearchIcon, href: "/curation", active: false },
                    { icon: Radio, href: "/music-v2/radio", active: false },
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
