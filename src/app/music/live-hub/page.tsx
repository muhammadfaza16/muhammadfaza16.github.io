"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import { ChevronLeft, Radio, Headphones, Play, Heart, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLiveMusic } from "@/components/live/LiveMusicContext";
import { parseSongTitle } from "@/utils/songUtils";

// Mock data for the UI exploration phase
const HERO_SESSION = {
    id: "sanctuary-radio-alpha",
    title: "Sanctuary Radio",
    host: "System",
    listeners: 142,
    currentSong: "Midnight City",
    currentArtist: "M83",
    coverUrl: "(https://images.unsplash.com/photo-1614113489855-66422ad300a4?q=80&w=642&auto=format&fit=crop)", // Unsplash deep space/abstract placeholder
    tags: ["Chill", "Indie"]
};

// Will fetch authentic placeholders for the design
const ACTIVE_STATIONS = [
    { id: "s1", title: "Morning Vibes", host: "Alice", listeners: 45, coverUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f462?q=80&w=600&auto=format&fit=crop" },
    { id: "s2", title: "Workout Mix", host: "Bob", listeners: 89, coverUrl: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=600&auto=format&fit=crop" },
    { id: "s3", title: "Focus Deep", host: "Charlie", listeners: 210, coverUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=600&auto=format&fit=crop" },
    { id: "s4", title: "Late Night Lofi", host: "Diana", listeners: 12, coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop" },
];

export default function LiveHubPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";

    const { isLive, currentSong, playlistTitle, playlistCover, listenersCount } = useLiveMusic();

    let heroTitle = HERO_SESSION.title;
    let heroHost = HERO_SESSION.host;
    let heroListeners = HERO_SESSION.listeners;
    let heroCover = HERO_SESSION.coverUrl;
    let heroSong = HERO_SESSION.currentSong;
    let heroArtist = HERO_SESSION.currentArtist;
    let heroIsLive = false;

    if (isLive && currentSong) {
        const { cleanTitle, artist } = parseSongTitle(currentSong.title);
        heroTitle = playlistTitle || "Live Radio";
        heroHost = "Admin";
        heroListeners = listenersCount || 1;
        heroCover = playlistCover || HERO_SESSION.coverUrl;
        heroSong = cleanTitle;
        heroArtist = artist || "Unknown Artist";
        heroIsLive = true;
    }

    return (
        <main style={{
            minHeight: "100svh",
            backgroundColor: isDark ? "#0A0A0A" : "#F8F5F2",
            backgroundImage: isDark 
                ? "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.1) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.08) 0, transparent 50%)"
                : "radial-gradient(at 0% 0%, rgba(255, 255, 255, 0.5) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 255, 255, 0.3) 0, transparent 50%)",
            color: isDark ? "#FFF" : "#1A1A1A",
            transition: "all 0.5s ease",
            paddingBottom: "80px"
        }}>
            <div style={{ width: "100%", maxWidth: "440px", margin: "0 auto", display: "flex", flexDirection: "column" }}>
                {/* Header / Nav */}
                <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "32px", marginTop: "24px", paddingTop: "env(safe-area-inset-top)" }}>
                    <h1 style={{ 
                        fontFamily: headerFont, 
                        fontWeight: 900, 
                        fontSize: "1.4rem", 
                        textTransform: "uppercase", 
                        letterSpacing: "-0.04em",
                        margin: 0,
                        color: isDark ? "#FFF" : "#000",
                        lineHeight: 1
                    }}>
                        Live Hub
                    </h1>
                </div>

                {/* Hero Section */}
                <div style={{ padding: "0 20px", marginBottom: "48px" }}>
                    <Link href={`/music/live`} passHref style={{ textDecoration: "none" }}>
                        <motion.div
                            whileHover={{ scale: 0.98 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                position: "relative",
                                width: "100%",
                                aspectRatio: "1/1",
                                borderRadius: "32px",
                                overflow: "hidden",
                                background: isDark ? "#111" : "#E5E5E5",
                                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
                                boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.1)",
                                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                                cursor: "pointer"
                            }}
                        >
                            {/* Background Blurred Cover */}
                            <div style={{
                                position: "absolute", inset: 0,
                                backgroundImage: `url(${heroCover})`,
                                backgroundSize: "cover", backgroundPosition: "center",
                                filter: heroIsLive ? "blur(20px) saturate(120%)" : "blur(20px) grayscale(80%)",
                                transform: "scale(1.2)", zIndex: 0
                            }} />
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.4) 100%)", zIndex: 1 }} />

                            {/* Top Info */}
                            <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 2, display: "flex", gap: "8px" }}>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    background: heroIsLive ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.15)", 
                                    backdropFilter: "blur(20px)",
                                    border: heroIsLive ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255, 255, 255, 0.2)",
                                    padding: "6px 12px", borderRadius: "100px",
                                }}>
                                    {heroIsLive && (
                                        <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFECEC", boxShadow: "0 0 10px #FF3333" }} />
                                    )}
                                    <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#FFF" }}>
                                        {heroIsLive ? "Live" : "Offline"}
                                    </span>
                                </div>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(20px)",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    padding: "6px 12px", borderRadius: "100px",
                                }}>
                                    <Users size={12} color="#FFF" />
                                    <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.6rem", color: "#FFF" }}>{heroListeners}</span>
                                </div>
                            </div>

                            {/* Minimal Content */}
                            <div style={{ position: "relative", zIndex: 2, padding: "24px" }}>
                                <h2 style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "1.75rem", color: "#FFF", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                                    {heroTitle}
                                </h2>
                                <p style={{ margin: "0 0 20px", color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", fontWeight: 600 }}>
                                    Hosted by {heroHost}
                                </p>
                                
                                {/* Listening Now Mini-Bar */}
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.08)", padding: "10px 16px", borderRadius: "20px", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <motion.div whileTap={{ scale: 0.9 }} style={{ width: "36px", height: "36px", borderRadius: "100px", background: heroIsLive ? "#FFF" : "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Play size={16} color="#000" fill="#000" style={{ marginLeft: "2px", opacity: heroIsLive ? 1 : 0.5 }} />
                                    </motion.div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ margin: 0, fontFamily: headerFont, fontWeight: 800, fontSize: "0.8rem", color: "#FFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: heroIsLive ? 1 : 0.7 }}>{heroSong}</p>
                                        <p style={{ margin: 0, fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{heroArtist}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* Active Stations Grid / Carousel */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", justifyContent: "space-between", paddingLeft: "24px", paddingRight: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "6px",
                                background: "linear-gradient(135deg, #EC4899, #8B5CF6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 10px rgba(236, 72, 153, 0.2)"
                            }}>
                                <Radio size={12} color="#fff" />
                            </div>
                            <span style={{ 
                                fontFamily: headerFont, 
                                fontWeight: 800, 
                                fontSize: "0.7rem", 
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"
                            }}>Active Stations</span>
                        </div>
                    </div>
                    
                    <div style={{ 
                        display: "flex", gap: "16px", overflowX: "auto", 
                        padding: "0 24px 32px", scrollbarWidth: "none", msOverflowStyle: "none",
                        WebkitOverflowScrolling: "touch"
                    }}>
                        {ACTIVE_STATIONS.map((station) => (
                            <div key={station.id} style={{ flexShrink: 0, width: "135px", opacity: 0.4, filter: "grayscale(100%)", pointerEvents: "none" }}>
                                <div style={{ 
                                    position: "relative", width: "135px", aspectRatio: "1/1", borderRadius: "24px", 
                                    overflow: "hidden", background: isDark ? "#111" : "#E5E5E5", marginBottom: "12px",
                                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
                                    boxShadow: isDark ? "0 10px 20px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.05)"
                                }}>
                                    <div style={{
                                        position: "absolute", inset: 0,
                                        backgroundImage: `url(${station.coverUrl})`,
                                        backgroundSize: "cover", backgroundPosition: "center",
                                        filter: "brightness(0.7) blur(2px)", zIndex: 0
                                    }} />
                                    <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1, display: "flex", alignItems: "center", gap: "4px", background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: "100px", backdropFilter: "blur(10px)" }}>
                                        <Heart size={10} color="#FFF" fill="#FFF" />
                                        <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.55rem", color: "#FFF" }}>{station.listeners}</span>
                                    </div>
                                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                                        <div style={{ width: "36px", height: "36px", borderRadius: "100px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.4)" }}>
                                            <Play size={14} color="#FFF" fill="#FFF" style={{ marginLeft: "2px" }} />
                                        </div>
                                    </div>
                                </div>
                                <h4 style={{ fontFamily: headerFont, fontWeight: 800, fontSize: "0.85rem", margin: "0 0 2px" }}>{station.title}</h4>
                                <p style={{ margin: 0, fontSize: "0.7rem", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontWeight: 600 }}>{station.host}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </main>
    );
}
