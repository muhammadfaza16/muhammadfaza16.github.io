"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Search, Shuffle, ChevronLeft, Disc } from "lucide-react";
import { Virtuoso } from 'react-virtuoso';
import { useAudio } from "@/components/AudioContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { parseSongTitle } from "@/utils/songUtils";
import { useTheme } from "@/components/ThemeProvider";

const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
};

// INDO_ARTISTS moved to database categories


function TrackRow({ song, index, isActive, isPlaying, onPlay }: {
    song: { title: string; audioUrl: string; originalIndex: number };
    index: number;
    isActive: boolean;
    isPlaying: boolean;
    onPlay: () => void;
}) {
    const { theme } = useTheme();
    const monoFont = "var(--font-mono), monospace";
    const headerFont = "var(--font-display), system-ui, sans-serif";

    return (
        <motion.div
            whileHover={{ 
                x: 2, 
                backgroundColor: isActive 
                    ? (theme === "dark" ? "#1A1A1A" : "#000") 
                    : (theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)") 
            }}
            whileTap={{ 
                scale: 0.99, 
                backgroundColor: isActive 
                    ? (theme === "dark" ? "#1A1A1A" : "#000") 
                    : (theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)") 
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={onPlay}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                backgroundColor: isActive 
                    ? (theme === "dark" ? "#1A1A1A" : "#000") 
                    : "transparent",
                color: isActive ? "#fff" : (theme === "dark" ? "#FFF" : "#000"),
                cursor: "pointer",
                borderBottom: theme === "dark" ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.03)",
                transition: "all 0.2s ease"
            }}
        >
            {(() => {
                const { cleanTitle, artist, labels } = parseSongTitle(song.title);
                return (
                    <>
                        <div style={{ width: "20px", textAlign: "center", fontWeight: 700, fontFamily: monoFont, fontSize: "0.65rem", color: isActive ? "#fff" : (theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"), fontVariantNumeric: "tabular-nums" }}>
                            {isActive && isPlaying ? (
                                <div style={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: theme === "dark" ? "0 0 15px rgba(99, 102, 241, 0.4)" : "0 0 10px rgba(99, 102, 241, 0.5)"
                                }}>
                                    <Disc className="animate-spin-slow" size={12} color="#fff" />
                                </div>
                            ) : (index + 1).toString().padStart(2, '0')}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
                                <div style={{ fontWeight: 600, fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: headerFont, letterSpacing: "-0.015em", lineHeight: 1.2 }}>
                                    {cleanTitle}
                                </div>
                                {labels.map(label => (
                                    <span key={label} style={{
                                        fontSize: "0.55rem",
                                        fontFamily: headerFont,
                                        fontWeight: 700,
                                        backgroundColor: isActive ? "rgba(255,255,255,0.15)" : (theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"),
                                        color: isActive ? "#fff" : (theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"),
                                        padding: "1.5px 7px",
                                        borderRadius: "100px",
                                        letterSpacing: "0.04em",
                                        textTransform: "uppercase",
                                        border: isActive ? "1px solid rgba(255,255,255,0.2)" : (theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.06)"),
                                        flexShrink: 0
                                    }}>
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <div style={{ color: isActive ? "rgba(255,255,255,0.7)" : (theme === "dark" ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)"), fontSize: "0.75rem", fontFamily: headerFont, fontWeight: 500, marginTop: "2px", letterSpacing: "0.01em" }}>
                                {artist}
                            </div>
                        </div>
                    </>
                );
            })()}
        </motion.div>
    );
}

export default function PlaylistClient({ 
    playlistId, 
    initialSongs = [], 
    initialPlaylist = null 
}: { 
    playlistId: string, 
    initialSongs?: any[], 
    initialPlaylist?: any 
}) {
    const { playQueue, queue, currentSong, isPlaying, togglePlay, activePlaylistId, setIsPlayerExpanded } = useAudio();
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const [dbSongs, setDbSongs] = useState<{ title: string; audioUrl: string; duration?: number; id?: string; category?: string }[]>(initialSongs);
    const [activePlaylist, setActivePlaylist] = useState<any>(initialPlaylist);

    useEffect(() => {
        setMounted(true);
    }, []);

    // No longer need client-side fetch as data is provided by RSC streaming

    const CACHE_KEY = `playlist_detail_scroll_${playlistId}_v1`;

    // Restore scroll position
    useEffect(() => {
        if (!mounted) return;
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
    }, [mounted, playlistId]);

    // Save scroll position on unmount
    useEffect(() => {
        return () => {
            try {
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({ scrollY: scrollYRef.current }));
            } catch (e) { }
        };
    }, [playlistId]);

    const basePlaylist = useMemo(() => {
        return dbSongs.map((song, index) => ({ ...song, originalIndex: index }));
    }, [dbSongs]);

    const filteredPlaylist = useMemo(() => {
        if (!searchQuery) return basePlaylist;
        const query = searchQuery.toLowerCase();
        return basePlaylist.filter(song =>
            song.title.toLowerCase().includes(query)
        );
    }, [basePlaylist, searchQuery]);

    const isThisPlaylistInQueue = activePlaylistId === playlistId || (playlistId === "all" && activePlaylistId === null);
    const isThisPlaylistPlaying = isPlaying && isThisPlaylistInQueue;

    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";

    if (!mounted) return null;

    return (
        <main style={{
            height: "100svh",
            backgroundColor: theme === "dark" ? "#0A0A0A" : "#F8F5F2",
            backgroundImage: theme === "dark" 
                ? "radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.15) 0, transparent 60%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.08) 0, transparent 50%)"
                : "radial-gradient(at 50% 0%, rgba(255, 255, 255, 0.6) 0, transparent 60%), radial-gradient(at 100% 100%, rgba(255, 255, 255, 0.3) 0, transparent 50%)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            color: theme === "dark" ? "#FFF" : "#000",
            transition: "all 0.5s ease"
        }}>

            <div 
                id="playlist-detail-scroll-container"
                ref={scrollContainerRef}
                onScroll={(e) => (scrollYRef.current = e.currentTarget.scrollTop)}
                style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "40px 16px 120px 16px",
                    WebkitOverflowScrolling: "touch",
                    scrollbarGutter: "stable"
                }}
            >
                <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "24px", paddingTop: "0px" }}>

                    {/* Entrance Navigation */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "-8px", padding: "0 4px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <Link href="/music" style={{ textDecoration: "none" }}>
                                <motion.div 
                                    whileHover={{ x: -4 }}
                                    style={{ 
                                        display: "inline-flex", alignItems: "center", gap: "8px", 
                                        color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
                                        fontFamily: headerFont, fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em"
                                    }}
                                >
                                    <ChevronLeft size={16} /> Back
                                </motion.div>
                            </Link>
                        </div>
                    </div>


            {/* Loading state is now handled by server-side loading.tsx */}


            {activePlaylist && (
                <div style={{
                    backgroundColor: activePlaylist.coverColor || "#fff",
                    border: "1px solid rgba(0,0,0,0.05)",
                    borderRadius: "24px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "16/9"
                }}>
                    <img 
                        src={activePlaylist.coverImage} 
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: 0.85 }} 
                        className="mix-blend-multiply"
                        alt="" 
                    />
                    {/* Premium Masking Overlays */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.2) 100%)",
                        zIndex: 1
                    }} />
                    <div style={{ 
                        position: "absolute", 
                        inset: 0, 
                        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)", 
                        zIndex: 1 
                    }} />
                    <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px", zIndex: 2 }}>
                        <h2 style={{
                            fontSize: "1.4rem",
                            fontWeight: 900,
                            fontFamily: headerFont,
                            textTransform: "uppercase",
                            margin: "0 0 4px 0",
                            lineHeight: 1,
                            letterSpacing: "-0.01em",
                            color: "#fff"
                        }}>
                            {activePlaylist.title}
                        </h2>
                        <div style={{ fontFamily: headerFont, fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", lineHeight: 1.2 }}>
                            {activePlaylist.philosophy}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        if (isThisPlaylistInQueue) togglePlay();
                        else playQueue(basePlaylist, 0, playlistId);
                    }}
                    style={{
                        flex: 1,
                        background: isThisPlaylistPlaying 
                            ? (theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)") 
                            : (theme === "dark" ? "#6366F1" : "#000"),
                        color: isThisPlaylistPlaying ? (theme === "dark" ? "#FFF" : "#000") : "#fff",
                        border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
                        borderRadius: "12px",
                        padding: "12px",
                        fontSize: "0.85rem",
                        fontWeight: 900,
                        fontFamily: headerFont,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                    }}
                >
                    {isThisPlaylistPlaying 
                        ? <><Pause size={18} fill="currentColor" color="currentColor" /> PAUSE</> 
                        : <><Play size={18} fill="currentColor" color="currentColor" style={{ marginLeft: "2px" }} /> PLAY MIX</>
                    }
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        playQueue(basePlaylist, 0, playlistId, true);
                    }}
                    style={{
                        background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.8)",
                        color: theme === "dark" ? "#FFF" : "#000",
                        border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
                        borderRadius: "12px",
                        padding: "0 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: theme === "dark" ? "0 4px 12px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.02)"
                    }}
                >
                    <Shuffle size={18} color="currentColor" />
                </motion.button>
            </div>

            <div style={{
                position: "sticky",
                top: "12px",
                zIndex: 40,
                width: "calc(100% - 4px)",
                height: "46px",
                backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                border: theme === "dark" ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.08)",
                borderRadius: "16px",
                boxShadow: theme === "dark" ? "0 10px 40px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.03)",
                margin: "4px auto 8px auto"
            }}>
                <Search size={18} color="#888" />
                <input
                    type="text"
                    placeholder="Search tracks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: theme === "dark" ? "#FFF" : "#000",
                        fontSize: "0.9rem",
                        marginLeft: "10px",
                        fontFamily: monoFont,
                        fontWeight: 600
                    }}
                />
            </div>

            <div style={{
                display: "flex",
                flexDirection: "column",
                background: theme === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.45)",
                border: theme === "dark" ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
                borderRadius: "20px",
                boxShadow: theme === "dark" ? "0 15px 50px rgba(0,0,0,0.4)" : "0 8px 30px rgba(0,0,0,0.02)",
                overflow: "hidden"
            }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: 900, fontFamily: headerFont, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em", color: theme === "dark" ? "#FFF" : "#000" }}>
                        TRACKLIST
                    </h3>
                    <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: "0.7rem", color: "#888" }}>{filteredPlaylist.length} ITEMS</span>
                </div>

                {filteredPlaylist.length <= 50 ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {filteredPlaylist.map((song: any, i: number) => (
                            <TrackRow
                                key={song.originalIndex}
                                song={song}
                                index={i}
                                isActive={currentSong?.audioUrl === song.audioUrl}
                                isPlaying={isPlaying}
                                onPlay={() => {
                                    playQueue(basePlaylist, song.originalIndex, playlistId);
                                    setIsPlayerExpanded(true);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <Virtuoso
                        key={activePlaylist?.id || "playlist-list"}
                        customScrollParent={scrollContainerRef.current || undefined}
                        data={filteredPlaylist}
                        itemContent={(index, song: any) => (
                            <TrackRow
                                key={song.originalIndex}
                                index={index}
                                isActive={currentSong?.audioUrl === song.audioUrl}
                                isPlaying={isPlaying}
                                song={song}
                                onPlay={() => {
                                    playQueue(basePlaylist, song.originalIndex, playlistId);
                                    setIsPlayerExpanded(true);
                                }}
                            />
                        )}
                    />
                )}
            </div>
            </div>
            </div>
        </main>
    );
}
