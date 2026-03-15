"use client";

import Link from "next/link";
import { Music2, ListMusic, ChevronLeft, ArrowRight, Compass, Sparkles, Filter, LibraryBig } from "lucide-react";
import { motion } from "framer-motion";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";

const MENU_ITEMS = [
    { id: "songs", label: "All Songs", subtitle: "Full Library", icon: LibraryBig, href: "/playlist/all" },
    { id: "playlists", label: "Playlists", subtitle: "Curated Sets", icon: ListMusic, href: "/playlist" },
];

const VIBES = ["Melancholic", "Epic", "Morning", "Acoustic", "Space", "Pop", "Love"];

export default function AudioHubPage() {
    const borderStyle = "2px solid #000";
    const shadowStyle = "4px 4px 0 #000";

    return (
        <main style={{
            minHeight: "100svh",
            backgroundColor: "#F5F0EB",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px 16px 120px 16px",
            color: "#000"
        }}>
            <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", marginTop: "16px" }}>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95, y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            style={{ 
                                display: "flex", alignItems: "center", gap: "4px", 
                                background: "#fff", border: borderStyle, boxShadow: "2px 2px 0 #000",
                                padding: "4px 8px", cursor: "pointer", fontFamily: "monospace", fontWeight: 700, color: "#000",
                                fontSize: "0.75rem",
                                transition: "background 0.2s ease"
                            }}
                        >
                            <ChevronLeft size={14} /> Back
                        </motion.button>
                    </Link>
                    <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 900, fontSize: "1.25rem", textTransform: "uppercase", letterSpacing: "-0.04em" }}>
                        AUDIO
                    </span>
                    <div style={{ width: "44px" }} /> {/* Spacer to balance flex-between */}
                </div>


                {/* Home Dashboard */}
                <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "8px" }}>
                    
                    {/* Vibe Pills Filter (Visual only for Home) */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                            <Filter size={16} />
                            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Quick Vibes</span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" }}>
                            {VIBES.map(vibe => (
                                <Link key={vibe} href={`/playlist?vibe=${vibe}`} style={{ textDecoration: "none" }}>
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        style={{
                                            padding: "6px 16px",
                                            background: "#fff",
                                            border: borderStyle,
                                            boxShadow: "2px 2px 0 #000",
                                            fontFamily: "system-ui, -apple-system, sans-serif",
                                            fontWeight: 800,
                                            fontSize: "0.8rem",
                                            color: "#000",
                                            whiteSpace: "nowrap",
                                            cursor: "pointer",
                                            transition: "background 0.2s ease, color 0.2s ease"
                                        }}
                                    >
                                        {vibe}
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Featured Playlists */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Sparkles size={16} />
                                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Featured</span>
                            </div>
                            <Link href="/playlist" style={{ fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700, color: "#666", textDecoration: "none" }}>SEE ALL</Link>
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            {PLAYLIST_CATEGORIES.slice(0, 2).map((playlist) => (
                                <Link key={playlist.id} href={`/playlist/${playlist.id}`} style={{ textDecoration: "none" }}>
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -4, boxShadow: "6px 6px 0 #000" }}
                                        whileTap={{ scale: 0.98, y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        style={{
                                            backgroundColor: playlist.coverColor + '10',
                                            border: borderStyle,
                                            boxShadow: "4px 4px 0 #000",
                                            padding: "16px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "12px",
                                            cursor: "pointer",
                                            height: "100%",
                                            transition: "background-color 0.2s ease"
                                        }}
                                    >
                                        <div style={{ width: "32px", height: "32px", border: borderStyle, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: playlist.coverColor, color: "#fff" }}>
                                            <Compass size={16} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 900, fontSize: "1rem", color: "#000", lineHeight: 1.1 }}>{playlist.title}</span>
                                            <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#555", fontWeight: 700, marginTop: "6px", textTransform: "uppercase" }}>{playlist.vibes[0]}</span>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                            <LibraryBig size={16} />
                            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Library</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {MENU_ITEMS.map((item) => (
                                <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
                                    <motion.div
                                        whileHover={{ scale: 1.02, x: 4, boxShadow: "6px 6px 0 #000" }}
                                        whileTap={{ scale: 0.98, y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        style={{
                                            backgroundColor: "#fff",
                                            border: borderStyle,
                                            boxShadow: "4px 4px 0 #000",
                                            padding: "12px 16px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            cursor: "pointer",
                                            transition: "background-color 0.2s ease"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "36px", height: "36px", border: borderStyle, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#000", color: "#fff" }}>
                                                <item.icon size={18} />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 900, fontSize: "1rem", color: "#000", letterSpacing: "-0.04em", textTransform: "uppercase" }}>{item.label}</span>
                                                <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#666", fontWeight: 700, textTransform: "uppercase" }}>{item.subtitle}</span>
                                            </div>
                                        </div>
                                        <ArrowRight size={18} color="#000" />
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
