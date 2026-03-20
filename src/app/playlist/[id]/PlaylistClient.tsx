"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Play, Pause, Search, Shuffle, ChevronLeft, Disc } from "lucide-react";
import { Virtuoso } from 'react-virtuoso';
import { useAudio } from "@/components/AudioContext";
import { motion, AnimatePresence } from "framer-motion";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";
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
                        <div style={{ width: "20px", textAlign: "center", fontWeight: 700, fontFamily: monoFont, fontSize: "0.65rem", color: isActive ? "#fff" : (theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)") }}>
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
                                <div style={{ fontWeight: 800, fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: headerFont, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                                    {cleanTitle}
                                </div>
                                {labels.map(label => (
                                    <span key={label} style={{
                                        fontSize: "0.38rem",
                                        fontFamily: headerFont,
                                        fontWeight: 800,
                                        backgroundColor: isActive ? "rgba(255,255,255,0.15)" : (theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"),
                                        color: isActive ? "#fff" : (theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"),
                                        padding: "1.5px 6px",
                                        borderRadius: "100px",
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        border: isActive ? "1px solid rgba(255,255,255,0.2)" : (theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.06)"),
                                        flexShrink: 0
                                    }}>
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <div style={{ color: isActive ? "rgba(255,255,255,0.6)" : (theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)"), fontSize: "0.65rem", fontFamily: monoFont, fontWeight: 700, marginTop: "1px", textTransform: "uppercase" }}>
                                {artist}
                            </div>
                        </div>
                    </>
                );
            })()}
        </motion.div>
    );
}

export default function PlaylistClient({ playlistId, initialSongs = [] }: { playlistId: string, initialSongs?: any[] }) {
    const { playQueue, queue, currentSong, isPlaying, togglePlay, activePlaylistId, setIsPlayerExpanded } = useAudio();
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    
    // Explicitly fallback initialSongs if none provided.
    const [dbSongs, setDbSongs] = useState<{ title: string; audioUrl: string; duration?: number; id?: string; category?: string }[]>(initialSongs || []);


    // useMemo for activePlaylist is below

    useEffect(() => {
        setMounted(true);
        setIsLoading(true);
        fetch("/api/music/songs")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.songs) {
                    setDbSongs(data.songs);
                }
            })
            .catch(() => { })
            .finally(() => {
                // Gentle delay for the premium feel
                setTimeout(() => setIsLoading(false), 800);
            });
    }, []);

    // Restore scroll position
    useEffect(() => {
        if (!isLoading && mounted && scrollContainerRef.current && scrollYRef.current > 0) {
            scrollContainerRef.current.scrollTop = scrollYRef.current;
        }
    }, [isLoading, mounted]);

    const activePlaylist = useMemo(() => {
        if (playlistId === "all") return null;
        return PLAYLIST_CATEGORIES.find(p => p.id === playlistId);
    }, [playlistId]);

    const basePlaylist = useMemo(() => {
        let songs = dbSongs;
        if (activePlaylist) {
            if (activePlaylist.id === 'indo-hits') {
                songs = dbSongs.filter((song: any) => song.category === 'Indo');
            } else if (activePlaylist.id === 'international-favorites') {
                songs = dbSongs.filter((song: any) => song.category === 'Luar');
            } else {
                songs = dbSongs.filter(song =>
                    activePlaylist.songTitles.some((title: string) =>
                        song.title.toLowerCase().includes(title.toLowerCase()) ||
                        title.toLowerCase().includes(song.title.toLowerCase())
                    )
                );
            }
        }

        return songs.map((song, index) => ({ ...song, originalIndex: index }));
    }, [activePlaylist, dbSongs]);

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
            position: "relative",
            height: "100%",
            width: "100%",
            overflow: "hidden",
            padding: "16px 16px 120px 16px",
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            backgroundColor: theme === "dark" ? "#0A0A0A" : "#f9f9f9",
            color: theme === "dark" ? "#FFF" : "#000",
            transition: "all 0.5s ease"
        }}>
            <div 
                ref={scrollContainerRef}
                onScroll={() => {
                  if (scrollContainerRef.current) {
                    scrollYRef.current = scrollContainerRef.current.scrollTop;
                  }
                }}
                className="flex-1 overflow-y-auto overflow-x-hidden w-full h-full flex flex-col items-center pt-4 pb-[200px] px-4"
                style={{
                    WebkitOverflowScrolling: "touch",
                    overscrollBehaviorY: "none",
                    overflowAnchor: "auto",
                    scrollbarGutter: "stable",
                } as React.CSSProperties}
            >
                <div style={{ width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "16px", marginBottom: "8px" }}>
                <div style={{ position: "absolute", left: 0 }}>
                    <Link href="/playlist" style={{ textDecoration: "none" }}>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            style={{ 
                                display: "flex", alignItems: "center", gap: "6px", 
                                background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.8)", 
                                border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0,0,0,0.05)",
                                padding: "6px 12px", cursor: "pointer", 
                                fontFamily: headerFont, fontWeight: 800, color: theme === "dark" ? "#FFF" : "#000",
                                fontSize: "0.7rem",
                                borderRadius: "100px",
                                boxShadow: theme === "dark" ? "0 4px 12px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.02)"
                            }}
                        >
                            <ChevronLeft size={14} /> Back
                        </motion.button>
                    </Link>
                </div>
                <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)" }}>
                    {activePlaylist ? "Playlist" : "Library"}
                </span>
            </div>

            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: theme === "dark" ? "#0A0A0A" : "#f9f9f9",
                            zIndex: 100,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "24px"
                        }}
                    >
                        <div style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "24px",
                            position: "relative",
                            overflow: "hidden"
                        }}>
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "radial-gradient(circle at 0% 100%, #6366F1, transparent 70%)",
                                opacity: 0.4
                            }} />
                            <Disc size={32} color="#fff" className="animate-spin-slow" style={{ position: "relative", zIndex: 1 }} />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                fontFamily: headerFont,
                                fontWeight: 900,
                                fontSize: "1rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: theme === "dark" ? "#FFF" : "#000"
                            }}>
                                PREPARING LIBRARY
                            </div>
                            <div style={{
                                fontFamily: monoFont,
                                fontWeight: 700,
                                fontSize: "0.65rem",
                                color: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                                marginTop: "6px"
                            }}>
                                SYNCHRONIZING WITH SERVER
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


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
                top: "16px",
                zIndex: 40,
                width: "100%",
                height: "44px",
                backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                border: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
                borderRadius: "14px",
                boxShadow: theme === "dark" ? "0 10px 40px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.02)"
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
                        useWindowScroll={false}
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
