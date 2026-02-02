"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Play, Pause, Search, Disc, Shuffle, ChevronLeft, SkipBack, SkipForward, Sparkles } from "lucide-react";
import { Virtuoso } from 'react-virtuoso';
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { CurrentlyStrip } from "@/components/CurrentlyStrip";
import { useAudio, PLAYLIST } from "@/components/AudioContext";
import { useZen } from "@/components/ZenContext";
import { motion, PanInfo, AnimatePresence } from "framer-motion";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";
import { useRouter } from "next/navigation";

export default function PlaylistClient({ playlistId }: { playlistId: string }) {
    const { isPlaying, currentSong, jumpToSong, playQueue, queue, currentIndex, togglePlay, nextSong, prevSong, hasInteracted, currentTime, duration, seekTo } = useAudio();
    const { isZen, setZen } = useZen();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Haptic Helper
    const triggerHaptic = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
        }
    };

    // 1. Determine which playlist we are viewing
    const activePlaylist = useMemo(() => {
        if (playlistId === "all") return null;
        return PLAYLIST_CATEGORIES.find(p => p.id === playlistId);
    }, [playlistId]);

    // 2. Filter songs for this playlist
    const filteredPlaylist = useMemo(() => {
        let baseSongs = PLAYLIST;
        if (activePlaylist) {
            baseSongs = PLAYLIST.filter(song =>
                activePlaylist.songTitles.some((title: string) =>
                    song.title.toLowerCase().includes(title.toLowerCase()) ||
                    title.toLowerCase().includes(song.title.toLowerCase())
                )
            );
        }

        return baseSongs
            .map((song) => {
                const originalIndex = PLAYLIST.findIndex(p => p.audioUrl === song.audioUrl);
                return { ...song, originalIndex };
            })
            .filter(song =>
                song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                song.title.toLowerCase().split("—")[0]?.trim().includes(searchQuery.toLowerCase()) ||
                song.title.toLowerCase().split("—")[1]?.trim().includes(searchQuery.toLowerCase())
            );
    }, [activePlaylist, searchQuery]);

    // Scroll to active song on mount
    const activeItemIndex = useMemo(() => {
        return filteredPlaylist.findIndex(s => s.audioUrl === currentSong.audioUrl);
    }, [filteredPlaylist, currentSong]);

    const isThisPlaylistInQueue = useMemo(() => {
        if (queue.length === 0) return false;
        // Logic for exact match, simplified for performance
        const currentUrls = new Set(queue.map(s => s.audioUrl));
        // Check if first few songs match (heuristic) or length matches
        if (filteredPlaylist.length > 0 && queue.length === filteredPlaylist.length) {
            return filteredPlaylist[0].audioUrl === queue[0].audioUrl;
        }
        return false;
    }, [queue, filteredPlaylist]);

    const isThisPlaylistPlaying = isPlaying && isThisPlaylistInQueue;

    const formatTime = (seconds: number): string => {
        if (!seconds || !isFinite(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        // Safe styling for window scrolling (Virtuoso)
        const originalOverflow = document.body.style.overflow;
        const originalHeight = document.body.style.height;
        const originalMinHeight = document.body.style.minHeight;

        // Apply overrides
        document.body.style.overflow = isZen ? 'hidden' : 'unset';
        document.body.style.height = 'auto';
        document.body.style.minHeight = '100svh';

        return () => {
            // Restore cleanup
            document.body.style.overflow = originalOverflow;
            document.body.style.height = originalHeight;
            document.body.style.minHeight = originalMinHeight;
        };
    }, [isZen]);

    if (!mounted) return null;

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        header, footer, .zen-toggle-floating { display: none !important; }
        #main-content { padding-top: 0 !important; }
        html { 
            overscroll-behavior: none; 
            touch-action: pan-y; 
            background: #000;
        }
        @keyframes eq-bar1 { 0%,100%{height:4px} 50%{height:14px} }
        @keyframes eq-bar2 { 0%,100%{height:8px} 50%{height:4px} }
        @keyframes eq-bar3 { 0%,100%{height:6px} 50%{height:12px} }
        .eq-bar { width:3px; background:#FFD60A; border-radius:9999px; will-change:height; }
      `}} />

            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "120vh",
                zIndex: 0,
                pointerEvents: "none",
                overflow: "hidden"
            }}>
                <MilkyWay />
                <GradientOrb />
                <CosmicStars />
            </div>

            {isZen ? (
                <motion.main
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 0.5 }}
                    onDragEnd={(e: any, info: PanInfo) => {
                        if (info.offset.y > 150) setZen(false);
                    }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100svh",
                        zIndex: 100,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(30px) saturate(150%)"
                    }}
                >
                    <div style={{ width: "40px", height: "4px", backgroundColor: "rgba(255,255,255,0.3)", borderRadius: "2px", position: "absolute", top: "16px" }} />
                    <div style={{ width: "100%", maxWidth: "500px", transform: "scale(1.1)" }}>
                        <CurrentlyStrip />
                    </div>
                </motion.main>
            ) : (
                <main style={{
                    position: "relative",
                    zIndex: 10,
                    minHeight: "100svh",
                    padding: "3rem 1.25rem 8rem 1.25rem",
                    maxWidth: "540px",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem"
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <button
                            onClick={() => router.push("/playlist")}
                            style={{
                                background: "rgba(255,255,255,0.08)",
                                border: "none",
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "white"
                            }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h2 style={{
                            color: "white",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            opacity: 0.8
                        }}>
                            {activePlaylist?.title || "All Tracks"}
                        </h2>
                        <div style={{ width: "40px" }} />
                    </div>

                    {activePlaylist && (
                        <div style={{
                            padding: "24px",
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: "24px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                            boxShadow: "0 20px 50px -10px rgba(0,0,0,0.4)"
                        }}>
                            <div style={{
                                width: "100%",
                                aspectRatio: "1/1",
                                borderRadius: "20px",
                                overflow: "hidden",
                                boxShadow: `0 20px 40px -10px ${activePlaylist.coverColor}40`
                            }}>
                                <img src={activePlaylist.coverImage} alt={activePlaylist.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>

                            <div style={{
                                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                                fontWeight: 300,
                                fontStyle: "italic",
                                fontSize: "1.2rem",
                                color: "rgba(255,255,255,0.9)",
                                lineHeight: "1.6",
                                textAlign: "center",
                                padding: "0 10px"
                            }}>
                                "{activePlaylist.philosophy}"
                            </div>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                                <div style={{ padding: "6px 14px", background: "rgba(255, 214, 10, 0.15)", borderRadius: "100px", fontSize: "0.8rem", color: "#FFD60A", fontWeight: 600 }}>
                                    🕒 {activePlaylist.schedule}
                                </div>
                                {activePlaylist.vibes.map(vibe => (
                                    <span key={vibe} style={{ padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                                        {vibe}
                                    </span>
                                ))}
                            </div>

                            <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        triggerHaptic();
                                        if (isThisPlaylistInQueue) togglePlay();
                                        else playQueue(filteredPlaylist, 0, playlistId);
                                    }}
                                    style={{
                                        flex: 2,
                                        background: "white",
                                        color: "black",
                                        border: "none",
                                        borderRadius: "14px",
                                        padding: "16px",
                                        fontSize: "1.1rem",
                                        fontWeight: 800,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 20px rgba(255,255,255,0.2)"
                                    }}
                                >
                                    {isThisPlaylistPlaying ? <><Pause size={24} fill="black" /> PAUSE</> : <><Play size={24} fill="black" /> PLAY</>}
                                </motion.button>

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        triggerHaptic();
                                        const shuffled = [...filteredPlaylist].sort(() => Math.random() - 0.5);
                                        playQueue(shuffled, 0, playlistId);
                                    }}
                                    style={{
                                        flex: 1,
                                        background: "rgba(255,255,255,0.1)",
                                        color: "white",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer"
                                    }}
                                >
                                    <Shuffle size={20} />
                                </motion.button>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { triggerHaptic(); setZen(true); }}
                                style={{
                                    width: "100%",
                                    background: "linear-gradient(135deg, rgba(255, 159, 10, 0.2), rgba(255, 214, 10, 0.2))",
                                    color: "#FFD60A",
                                    border: "1px solid rgba(255, 214, 10, 0.3)",
                                    borderRadius: "14px",
                                    padding: "14px",
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    cursor: "pointer"
                                }}
                            >
                                <Sparkles size={18} />
                                IMMERSIVE MODE
                            </motion.button>
                        </div>
                    )}

                    <div style={{ position: "sticky", top: "1rem", zIndex: 40 }}>
                        <div style={{
                            width: "100%",
                            height: "54px",
                            backgroundColor: "rgba(15, 15, 20, 0.75)",
                            borderRadius: "18px",
                            display: "flex",
                            alignItems: "center",
                            padding: "0 20px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            backdropFilter: "blur(20px)"
                        }}>
                            <Search size={20} color="rgba(255,255,255,0.4)" />
                            <input
                                type="text"
                                placeholder={`Search in ${activePlaylist?.title || "All Songs"}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    color: "white",
                                    fontSize: "1rem",
                                    marginLeft: "12px"
                                }}
                            />
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        background: "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "24px",
                        // overflow: "hidden", // REMOVED: Might conflict with Virtuoso measuring
                        border: "1px solid rgba(255,255,255,0.08)"
                    }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "white", margin: 0 }}>
                                {filteredPlaylist.length} Track{filteredPlaylist.length !== 1 ? 's' : ''}
                            </h3>
                        </div>

                        <Virtuoso
                            key={activePlaylist?.id || "playlist-list"} // Force remount on playlist change to ensure fresh measurement
                            useWindowScroll
                            initialTopMostItemIndex={activeItemIndex !== -1 ? activeItemIndex : undefined}
                            data={filteredPlaylist}
                            itemContent={(i, song) => {
                                const isActive = currentSong?.audioUrl === song.audioUrl;
                                return (
                                    <div
                                        key={song.originalIndex} // Virtuoso handles keys but we can keep it on the div
                                        onClick={() => playQueue(filteredPlaylist, i, playlistId)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "18px",
                                            padding: "18px 24px",
                                            backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                                            cursor: "pointer",
                                            borderBottom: "1px solid rgba(255,255,255,0.03)"
                                        }}
                                    >
                                        <div style={{ width: "24px", textAlign: "center", color: isActive ? "#3b82f6" : "rgba(255,255,255,0.2)", fontWeight: 700 }}>
                                            {isActive && isPlaying ? (
                                                <div className="flex gap-[3px] items-end h-[14px]">
                                                    <div className="eq-bar" style={{ animation: 'eq-bar1 0.5s ease infinite' }} />
                                                    <div className="eq-bar" style={{ animation: 'eq-bar2 0.5s ease infinite 0.1s' }} />
                                                    <div className="eq-bar" style={{ animation: 'eq-bar3 0.5s ease infinite 0.2s' }} />
                                                </div>
                                            ) : (i + 1)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ color: isActive ? "white" : "rgba(255,255,255,0.9)", fontWeight: 600, fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {song.title.split("—")[1]?.trim() || song.title}
                                            </div>
                                            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
                                                {song.title.split("—")[0]?.trim() || "Unknown Artist"}
                                            </div>
                                        </div>
                                        {isActive && <Disc className="animate-spin-slow" size={18} color="#3b82f6" />}
                                    </div>
                                );
                            }}
                        />
                    </div>
                </main>
            )}
        </>
    );
}
