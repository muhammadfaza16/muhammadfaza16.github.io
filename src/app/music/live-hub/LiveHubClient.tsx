"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
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
    isDummy?: boolean;
    isLive?: boolean;
}

export default function LiveHubClient({ 
    initialSessions = [], 
    initialPlaylists = [] 
}: { 
    initialSessions?: StationData[], 
    initialPlaylists?: any[] 
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);

    const { isLive, currentSong, playlistTitle, playlistCover, listenersCount, activeSessionId } = useLiveMusic();

    // Use initial data from server
    const [stations, setStations] = useState<StationData[]>(initialSessions);
    const [allPlaylists, setAllPlaylists] = useState<any[]>(initialPlaylists);
    const [loadingStations, setLoadingStations] = useState(false);

    useEffect(() => {
        // Refresh when initial props change
        if (initialSessions.length > 0) setStations(initialSessions);
        if (initialPlaylists.length > 0) setAllPlaylists(initialPlaylists);
    }, [initialSessions, initialPlaylists]);

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

    // Hero card logic
    const fallbackCover = "https://images.unsplash.com/photo-1614113489855-66422ad300a4?q=80&w=642&auto=format&fit=crop";
    let heroTitle = "Live Music";
    let heroListeners = 0;
    let heroCover = fallbackCover;
    let heroSong = "Waiting for broadcast...";
    let heroArtist = "";
    let heroIsLive = false;
    let heroSessionId = "";

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
    }

    const heroPlaylistInfo = allPlaylists.find(p => p.title === heroTitle || p.slug === heroSessionId || p.id === heroSessionId);
    const heroPhilosophy = heroPlaylistInfo?.philosophy;

    // Combined Stations logic
    const combinedStations = useMemo(() => {
        return [
            ...stations,
            ...allPlaylists
                .filter(pc => !stations.some(s => s.playlistTitle === pc.title || s.id === pc.slug || s.id === pc.id))
                .map(pc => ({
                    id: pc.slug || pc.id,
                    title: pc.title,
                    description: pc.description,
                    playlistTitle: pc.title,
                    coverImage: pc.coverImage,
                    coverColor: pc.coverColor,
                    currentSong: null,
                    totalSongs: pc._count?.songs || 0,
                    songIndex: 0,
                    startedAt: new Date().toISOString(),
                    isDummy: true
                }))
        ];
    }, [stations, allPlaylists]);

    const secondaryStations = combinedStations;

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

                    {/* Entrance Text */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 20px", marginBottom: "-8px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <Link href="/music" style={{ textDecoration: "none" }}>
                                <motion.div 
                                    whileHover={{ x: -4 }}
                                    style={{ 
                                        display: "inline-flex", alignItems: "center", gap: "8px", 
                                        color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
                                        fontFamily: headerFont, fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em"
                                    }}
                                >
                                    <ChevronLeft size={16} /> Back
                                </motion.div>
                            </Link>
                            <h1 style={{ 
                                fontFamily: headerFont, fontWeight: 900, fontSize: "2.5rem", lineHeight: 1, margin: 0,
                                letterSpacing: "-0.05em", color: isDark ? "#FFF" : "#000"
                            }}>
                                Live<br />Music.
                            </h1>
                        </div>
                    </div>

                {/* Hero Section */}
                <div style={{ padding: "0 20px", marginBottom: "20px" }}>
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
                            <div style={{
                                position: "absolute", inset: "-10%",
                                backgroundImage: `url(${heroCover})`,
                                backgroundSize: "cover", backgroundPosition: "center",
                                filter: heroIsLive ? "blur(30px) saturate(150%) brightness(0.8)" : "blur(20px) grayscale(80%) brightness(0.5)",
                                transform: "scale(1.1)", zIndex: 0,
                                transition: "all 1s ease"
                            }} />
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.2) 100%)", zIndex: 1 }} />

                            <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", zIndex: 2, display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                    background: heroIsLive ? "rgba(220, 38, 38, 0.85)" : "rgba(30, 41, 59, 0.8)", 
                                    backdropFilter: "blur(20px)",
                                    border: heroIsLive ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                                    padding: "6px 14px", borderRadius: "100px",
                                    boxShadow: heroIsLive ? "0 0 20px rgba(220, 38, 38, 0.4)" : "none"
                                }}>
                                    {heroIsLive && (
                                        <div style={{ display: "flex", gap: "2px", alignItems: "center", height: "10px" }}>
                                            {[1, 2, 3].map(i => (
                                                <motion.div key={i} animate={{ height: ["4px", "10px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }} style={{ width: "3px", background: "#FFF", borderRadius: "2px" }} />
                                            ))}
                                        </div>
                                    )}
                                    <span style={{ fontFamily: headerFont, fontWeight: 800, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#FFF", lineHeight: 1 }}>
                                        {heroIsLive ? "ON AIR" : "OFFLINE"}
                                    </span>
                                </div>
                                {heroIsLive && (
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: "6px",
                                        background: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(20px)",
                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                        padding: "6px 14px", borderRadius: "100px",
                                    }}>
                                        <Users size={12} color="#E2E8F0" />
                                        <span style={{ fontFamily: headerFont, fontWeight: 700, fontSize: "0.65rem", color: "#E2E8F0" }}>{heroListeners} listening together</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ position: "relative", zIndex: 2, padding: "28px 24px" }}>
                                {heroPhilosophy && (
                                    <p style={{ fontFamily: headerFont, fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", fontStyle: "italic", marginBottom: "16px", lineHeight: 1.4, maxWidth: "95%", letterSpacing: "-0.01em", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                                        "{heroPhilosophy}"
                                    </p>
                                )}
                                <h2 style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "2.2rem", color: "#FFF", margin: "0 0 24px", letterSpacing: "-0.03em", lineHeight: 1.1, textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                                    {heroTitle}
                                </h2>
                                
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(0,0,0,0.4)", padding: "12px 16px", borderRadius: "20px", backdropFilter: "blur(30px)", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
                                    <motion.div whileTap={{ scale: 0.9 }} style={{ width: "40px", height: "40px", borderRadius: "100px", background: heroIsLive ? "#FFF" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Headphones size={18} color={heroIsLive ? "#000" : "#FFF"} style={{ opacity: heroIsLive ? 1 : 0.8 }} />
                                    </motion.div>
                                    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
                                        {heroIsLive && (
                                            <span style={{ 
                                                fontFamily: monoFont, fontSize: "0.6rem", fontWeight: 800, 
                                                color: "rgba(255,255,255,0.45)", textTransform: "uppercase", 
                                                letterSpacing: "0.1em", marginBottom: "2px" 
                                            }}>Currently Playing</span>
                                        )}
                                        <p style={{ margin: 0, fontFamily: headerFont, fontWeight: 800, fontSize: "0.85rem", color: "#FFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: heroIsLive ? 1 : 0.7 }}>
                                            {heroSong}
                                            {heroIsLive && heroArtist && <span style={{ opacity: 0.6, fontWeight: 500, fontSize: "0.75rem" }}> • {heroArtist}</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* Active Stations */}
                {(secondaryStations.length > 0 || loadingStations) && (
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingLeft: "24px", paddingRight: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Radio size={16} color={isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)"} />
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
                                [...Array(3)].map((_, i) => (
                                    <div key={i} style={{ flexShrink: 0, width: "135px", opacity: 0.3 }}>
                                        <div style={{ 
                                            width: "135px", aspectRatio: "1/1", borderRadius: "24px", 
                                            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                            marginBottom: "12px"
                                        }} />
                                    </div>
                                ))
                            ) : (
                                secondaryStations.map((station) => {
                                    const songInfo = station.currentSong ? parseSongTitle(station.currentSong.title) : null;
                                    const isDummy = station.isDummy;

                                    const StationCard = (
                                        <motion.div 
                                            whileHover={isDummy ? {} : { scale: 0.97 }}
                                            whileTap={isDummy ? {} : { scale: 0.93 }}
                                            style={{ 
                                                flexShrink: 0, width: "135px", 
                                                cursor: isDummy ? "default" : "pointer",
                                                opacity: isDummy ? 0.45 : 1,
                                                filter: isDummy ? "grayscale(0.6)" : "none",
                                                transition: "all 0.4s ease"
                                            }}
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
                                                        zIndex: 0
                                                    }} />
                                                )}
                                                
                                                <div style={{ 
                                                    position: "absolute", top: "10px", left: "10px", zIndex: 2, 
                                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", 
                                                    background: isDummy ? "rgba(0,0,0,0.45)" : "rgba(239, 68, 68, 0.75)", 
                                                    padding: "0 8px", height: "18px", borderRadius: "100px", backdropFilter: "blur(10px)"
                                                }}>
                                                    {!isDummy && <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 5, height: 5, borderRadius: "50%", background: "#FFF" }} />}
                                                    <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "0.5rem", color: "#FFF", textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: 1 }}>
                                                        {isDummy ? "Offline" : "Live"}
                                                    </span>
                                                </div>

                                                {!isDummy && (
                                                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                                                        <div style={{ width: "36px", height: "36px", borderRadius: "100px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.4)" }}>
                                                            <Headphones size={14} color="#FFF" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <h4 style={{ fontFamily: headerFont, fontWeight: 800, fontSize: "0.85rem", margin: "0 0 2px", color: isDark ? "#FFF" : "#1A1A1A" }}>{station.title}</h4>
                                            <p style={{ margin: 0, fontSize: "0.7rem", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {isDummy ? "Offline" : (songInfo ? `${songInfo.cleanTitle}` : `${station.totalSongs} tracks`)}
                                            </p>
                                        </motion.div>
                                    );

                                    return isDummy ? (
                                        <div key={station.id}>{StationCard}</div>
                                    ) : (
                                        <Link key={station.id} href={`/music/live?session=${station.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            {StationCard}
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* Intro Text */}
                <div style={{ padding: "0 24px", marginBottom: "32px", marginTop: "16px" }}>
                    <p style={{ 
                        fontFamily: headerFont, fontWeight: 600, fontSize: "0.8rem", 
                        color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                        textAlign: "center", lineHeight: 1.6, margin: 0
                    }}>
                        Everyone on the same channel hears the exact same track at the exact same second. No skips.
                    </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
