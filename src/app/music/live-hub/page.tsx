"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Radio, Play, Users, Headphones, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLiveMusic } from "@/components/live/LiveMusicContext";
import { parseSongTitle } from "@/utils/songUtils";

interface StationData {
    id: string;
    title: string;
    description: string | null;
    playlistTitle: string;
    coverImage: string | null;
    coverColor: string | null;
    currentSong: { title: string; category?: string } | null;
    totalSongs: number;
    songIndex: number;
    startedAt: string;
}

export default function LiveHubPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);

    const { isLive, currentSong, playlistTitle, playlistCover, listenersCount, activeSessionId } = useLiveMusic();

    // Fetch all active sessions for the station cards
    const [stations, setStations] = useState<StationData[]>([]);
    const [loadingStations, setLoadingStations] = useState(true);

    useEffect(() => {
        fetch("/api/live-music/sessions", { cache: "no-store" })
            .then(res => res.json())
            .then(data => {
                setStations(data.sessions || []);
                setLoadingStations(false);
            })
            .catch(() => setLoadingStations(false));
    }, []);

    const CACHE_KEY = "live_hub_scroll_v1";

    // Restore scroll position
    useEffect(() => {
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed.scrollY) {
                    setTimeout(() => {
                        if (scrollContainerRef.current) {
                            scrollContainerRef.current.scrollTop = parsed.scrollY;
                            scrollYRef.current = parsed.scrollY;
                        }
                    }, 100);
                }
            }
        } catch (e) {
            console.error("Failed to restore scroll position", e);
        }
    }, []);

    // Save scroll position on unmount
    useEffect(() => {
        return () => {
            try {
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({ scrollY: scrollYRef.current }));
            } catch (e) { }
        };
    }, []);

    // Hero card — uses primary live context (first/default session or active session)
    const fallbackCover = "https://images.unsplash.com/photo-1614113489855-66422ad300a4?q=80&w=642&auto=format&fit=crop";
    let heroTitle = "Live Music";
    let heroDescription = "No active sessions";
    let heroListeners = 0;
    let heroCover = fallbackCover;
    let heroSong = "Waiting for broadcast...";
    let heroArtist = "";
    let heroIsLive = false;
    let heroSessionId = "";

    // Determine Hero Session ID: Active session from context OR the first station
    if (activeSessionId) {
        heroSessionId = activeSessionId;
    } else if (stations.length > 0) {
        heroSessionId = stations[0].id;
    }

    if (isLive && currentSong) {
        const { cleanTitle, artist } = parseSongTitle(currentSong.title);
        heroTitle = playlistTitle || "Live Music";
        heroListeners = listenersCount || 1;
        heroCover = playlistCover || fallbackCover;
        heroSong = cleanTitle;
        heroArtist = artist || "Unknown Artist";
        heroIsLive = true;
    } else if (stations.length > 0) {
        // Fallback: if context isn't live yet, use data from the default hero station
        const heroStation = stations.find(s => s.id === heroSessionId);
        if (heroStation) {
            heroTitle = heroStation.playlistTitle;
            heroCover = heroStation.coverImage || fallbackCover;
            if (heroStation.currentSong) {
                const { cleanTitle, artist } = parseSongTitle(heroStation.currentSong.title);
                heroSong = cleanTitle;
                heroArtist = artist || "Unknown Artist";
                heroIsLive = true;
            }
        }
    }

    // Secondary stations = all stations except the hero
    const secondaryStations = stations.filter(s => s.id !== heroSessionId);

    return (
        <main style={{
            height: "100svh",
            backgroundColor: isDark ? "#0A0A0A" : "#F8F5F2",
            backgroundImage: isDark 
                ? "radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.15) 0, transparent 60%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.08) 0, transparent 50%)"
                : "radial-gradient(at 50% 0%, rgba(255, 255, 255, 0.6) 0, transparent 60%), radial-gradient(at 100% 100%, rgba(255, 255, 255, 0.3) 0, transparent 50%)",
            color: isDark ? "#FFF" : "#1A1A1A",
            transition: "all 0.5s ease",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
        }}>


            <div 
                id="live-hub-scroll-container"
                ref={scrollContainerRef}
                onScroll={(e) => (scrollYRef.current = e.currentTarget.scrollTop)}
                style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingBottom: "80px",
                    WebkitOverflowScrolling: "touch",
                    overscrollBehaviorY: "none",
                    scrollbarGutter: "stable"
                }}
            >
                <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "24px", paddingTop: "40px" }}>
                    {/* Immersive Inline Header */}
                    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "24px", padding: "0 16px" }}>
                        <h1 style={{ 
                            fontFamily: headerFont, 
                            fontWeight: 700, 
                            fontSize: "1.35rem", 
                            letterSpacing: "-0.015em",
                            margin: 0,
                            color: isDark ? "#FFF" : "#000",
                            lineHeight: 1
                        }}>
                            Live Music
                        </h1>
                    </div>

                {/* Hero Section — Primary Session */}
                <div style={{ padding: "0 20px", marginBottom: "48px" }}>
                    <Link href={heroSessionId ? `/music/live?session=${heroSessionId}` : `/music/live`} passHref style={{ textDecoration: "none" }}>
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

                            {/* Top Badges */}
                            <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 2, display: "flex", gap: "8px" }}>
                                    <div style={{
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                                        background: heroIsLive ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.15)", 
                                        backdropFilter: "blur(20px)",
                                        border: heroIsLive ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255, 255, 255, 0.2)",
                                        padding: "0 12px", height: "24px", borderRadius: "100px",
                                    }}>
                                        {heroIsLive && (
                                            <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFECEC", boxShadow: "0 0 10px #FF3333" }} />
                                        )}
                                        <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#FFF", lineHeight: 1 }}>
                                            {heroIsLive ? "Live" : "Offline"}
                                        </span>
                                    </div>
                                {heroIsLive && (
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: "6px",
                                        background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(20px)",
                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                        padding: "6px 12px", borderRadius: "100px",
                                    }}>
                                        <Users size={12} color="#FFF" />
                                        <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.6rem", color: "#FFF" }}>{heroListeners}</span>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Content */}
                            <div style={{ position: "relative", zIndex: 2, padding: "24px" }}>
                                <h2 style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "1.75rem", color: "#FFF", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                                    {heroTitle}
                                </h2>
                                {heroIsLive && heroArtist && (
                                    <p style={{ margin: "0 0 20px", color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", fontWeight: 600 }}>
                                        {heroArtist}
                                    </p>
                                )}
                                
                                {/* Now Playing Mini-Bar */}
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.08)", padding: "10px 16px", borderRadius: "20px", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <motion.div whileTap={{ scale: 0.9 }} style={{ width: "36px", height: "36px", borderRadius: "100px", background: heroIsLive ? "#FFF" : "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Headphones size={16} color="#000" style={{ opacity: heroIsLive ? 1 : 0.5 }} />
                                    </motion.div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ margin: 0, fontFamily: headerFont, fontWeight: 800, fontSize: "0.8rem", color: "#FFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: heroIsLive ? 1 : 0.7 }}>{heroSong}</p>
                                        {heroArtist && <p style={{ margin: 0, fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{heroArtist}</p>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* Active Stations — Real Data */}
                {(secondaryStations.length > 0 || loadingStations) && (
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingLeft: "24px", paddingRight: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{
                                    width: "24px", height: "24px", borderRadius: "6px",
                                    background: "linear-gradient(135deg, #EC4899, #8B5CF6)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 4px 10px rgba(236, 72, 153, 0.2)"
                                }}>
                                    <Radio size={12} color="#fff" />
                                </div>
                                <span style={{ 
                                    fontFamily: headerFont, fontWeight: 800, fontSize: "0.7rem", 
                                    textTransform: "uppercase", letterSpacing: "0.1em",
                                    color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"
                                }}>Active Stations</span>
                            </div>
                        </div>
                        
                        <div style={{ 
                            display: "flex", gap: "16px", overflowX: "auto", 
                            padding: "0 24px 32px", scrollbarWidth: "none", msOverflowStyle: "none",
                            WebkitOverflowScrolling: "touch"
                        }}>
                            {loadingStations ? (
                                // Loading skeleton cards
                                [...Array(3)].map((_, i) => (
                                    <div key={i} style={{ flexShrink: 0, width: "135px", opacity: 0.3 }}>
                                        <div style={{ 
                                            width: "135px", aspectRatio: "1/1", borderRadius: "24px", 
                                            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                            marginBottom: "12px"
                                        }} />
                                        <div style={{ width: "80%", height: "12px", borderRadius: "6px", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", marginBottom: "6px" }} />
                                        <div style={{ width: "50%", height: "10px", borderRadius: "6px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }} />
                                    </div>
                                ))
                            ) : (
                                secondaryStations.map((station) => {
                                    const songInfo = station.currentSong ? parseSongTitle(station.currentSong.title) : null;
                                    return (
                                        <Link key={station.id} href={`/music/live?session=${station.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <motion.div 
                                                whileHover={{ scale: 0.97 }}
                                                whileTap={{ scale: 0.93 }}
                                                style={{ flexShrink: 0, width: "135px", cursor: "pointer" }}
                                            >
                                                <div style={{ 
                                                    position: "relative", width: "135px", aspectRatio: "1/1", borderRadius: "24px", 
                                                    overflow: "hidden", background: station.coverColor || (isDark ? "#111" : "#E5E5E5"), marginBottom: "12px",
                                                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
                                                    boxShadow: isDark ? "0 10px 20px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.05)"
                                                }}>
                                                    {station.coverImage && (
                                                        <div style={{
                                                            position: "absolute", inset: 0,
                                                            backgroundImage: `url(${station.coverImage})`,
                                                            backgroundSize: "cover", backgroundPosition: "center",
                                                            filter: "brightness(0.7) blur(2px)", zIndex: 0
                                                        }} />
                                                    )}
                                                    {/* Live badge */}
                                                    <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", background: "rgba(239, 68, 68, 0.5)", padding: "0 8px", height: "18px", borderRadius: "100px", backdropFilter: "blur(10px)" }}>
                                                        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 5, height: 5, borderRadius: "50%", background: "#FFF" }} />
                                                        <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "0.5rem", color: "#FFF", textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: 1 }}>Live</span>
                                                    </div>
                                                    {/* Play button overlay */}
                                                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                                                        <div style={{ width: "36px", height: "36px", borderRadius: "100px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.4)" }}>
                                                            <Headphones size={14} color="#FFF" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <h4 style={{ fontFamily: headerFont, fontWeight: 800, fontSize: "0.85rem", margin: "0 0 2px", color: isDark ? "#FFF" : "#1A1A1A" }}>{station.title}</h4>
                                                <p style={{ margin: 0, fontSize: "0.7rem", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {songInfo ? `${songInfo.cleanTitle}` : `${station.totalSongs} tracks`}
                                                </p>
                                            </motion.div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* Intro Text */}
                <div style={{ padding: "0 24px", marginBottom: "24px" }}>
                    <p style={{ 
                        fontFamily: headerFont, fontWeight: 600, fontSize: "0.8rem", 
                        color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                        textAlign: "center", lineHeight: 1.6, margin: 0
                    }}>
                        Tune in to live music stations. Everyone hears the same song at once — a shared listening experience.
                    </p>
                </div>
            </div>
            </div>
        </main>
    );
}
