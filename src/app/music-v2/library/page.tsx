"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    Search as SearchIcon,
    Music2,
    Radio as RadioIcon,
    LayoutGrid,
    Plus,
    Filter
} from "lucide-react";
import Link from "next/link";

export default function LibraryPageV2() {
    const [activeTab, setActiveTab] = useState("playlists");

    return (
        <div style={{
            minHeight: "100dvh",
            background: "#0a0a0a",
            color: "white",
            fontFamily: "var(--font-geist-sans), sans-serif",
            padding: "calc(env(safe-area-inset-top) + 1rem) 1.25rem 120px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
        }}>
            {/* Header */}
            <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Link href="/music-v2" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <motion.div whileTap={{ scale: 0.9 }}>
                            <ChevronLeft size={26} strokeWidth={2} />
                        </motion.div>
                    </Link>
                    <h1 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.01em" }}>Library</h1>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    style={{
                        width: "36px", height: "36px", borderRadius: "50%", background: "#121212",
                        border: "1px solid rgba(255,255,255,0.06)", color: "white", display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                >
                    <Plus size={20} />
                </motion.button>
            </header>

            {/* Custom Tab Switcher */}
            <div style={{
                display: "flex",
                background: "#121212",
                borderRadius: "16px",
                padding: "4px",
                border: "1px solid rgba(255,255,255,0.05)"
            }}>
                {["playlists", "songs", "radios"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1,
                            background: activeTab === tab ? "rgba(255,255,255,0.06)" : "transparent",
                            border: "none",
                            padding: "10px 0",
                            borderRadius: "12px",
                            color: activeTab === tab ? "white" : "rgba(255,255,255,0.3)",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            textTransform: "capitalize",
                            transition: "all 0.2s ease"
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search & Filter */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "#121212",
                    borderRadius: "16px",
                    padding: "0 1.25rem",
                    border: "1px solid rgba(255,255,255,0.05)",
                    height: "48px"
                }}>
                    <SearchIcon size={18} color="rgba(255,255,255,0.2)" />
                    <input
                        type="text"
                        placeholder={`Search in ${activeTab}...`}
                        style={{ background: "transparent", border: "none", color: "white", fontSize: "0.9rem", width: "100%", outline: "none" }}
                    />
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    style={{
                        width: "48px", height: "48px", borderRadius: "16px", background: "#121212",
                        border: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                >
                    <Filter size={18} />
                </motion.button>
            </div>

            {/* Content Grid */}
            <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <motion.div
                        key={i}
                        whileTap={{ scale: 0.96 }}
                        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
                    >
                        <div style={{
                            aspectRatio: "1/1",
                            background: "#121212",
                            borderRadius: "20px",
                            border: "1px solid rgba(255,255,255,0.06)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Music2 size={32} color="rgba(255,255,255,0.05)" strokeWidth={1.5} />
                        </div>
                        <div style={{ padding: "0 4px" }}>
                            <h5 style={{ fontSize: "0.9rem", fontWeight: 750, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {activeTab === "playlists" ? `My Awesome Mix ${i}` : activeTab === "songs" ? `Song Title ${i}` : `Radio Station ${i}`}
                            </h5>
                            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem" }}>
                                {activeTab === "playlists" ? "128 tracks" : activeTab === "songs" ? "Artist Name" : "LIVE - World FM"}
                            </p>
                        </div>
                    </motion.div>
                ))}
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
                    { icon: RadioIcon, href: "/music-v2/radio", active: false },
                    { icon: LayoutGrid, href: "/music-v2/library", active: true }
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
