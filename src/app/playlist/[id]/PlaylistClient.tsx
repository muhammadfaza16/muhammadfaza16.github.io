"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Play, Pause, Search, Disc, Shuffle, SkipBack, SkipForward, Sparkles, Loader2 } from "lucide-react";
import { Virtuoso } from 'react-virtuoso';
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { CurrentlyStrip } from "@/components/CurrentlyStrip";

import { useAudio } from "@/components/AudioContext";
import { useZen } from "@/components/ZenContext";
import { motion, PanInfo, AnimatePresence } from "framer-motion";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import { useRouter } from "next/navigation";

// Phase 6: Extracted shared TrackRow component
const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
};

function TrackRow({ song, index, isActive, isPlaying, isBuffering, onPlay }: {
    song: { title: string; audioUrl: string; originalIndex: number };
    index: number;
    isActive: boolean;
    isPlaying: boolean;
    isBuffering?: boolean;
    onPlay: () => void;
}) {
    return (
        <div
            onClick={onPlay}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px 12px",
                backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                cursor: "pointer",
                borderBottom: "1px solid rgba(255,255,255,0.03)"
            }}
        >
            <div style={{ width: "24px", textAlign: "center", color: isActive ? "#3b82f6" : "rgba(255,255,255,0.2)", fontWeight: 700 }}>
                {isActive && isBuffering ? (
                    <Loader2 size={14} className="animate-spin" color="#3b82f6" />
                ) : isActive && isPlaying ? (
                    <div className="flex gap-[3px] items-end h-[14px]">
                        <div className="eq-bar" style={{ animation: 'eq-bar1 0.5s ease infinite' }} />
                        <div className="eq-bar" style={{ animation: 'eq-bar2 0.5s ease infinite 0.1s' }} />
                        <div className="eq-bar" style={{ animation: 'eq-bar3 0.5s ease infinite 0.2s' }} />
                    </div>
                ) : (index + 1)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: isActive ? "white" : "rgba(255,255,255,0.9)", fontWeight: 600, fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {song.title.split("\u2014")[1]?.trim() || song.title}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
                    {song.title.split("\u2014")[0]?.trim() || "Unknown Artist"}
                </div>
            </div>
            {isActive && <Disc className="animate-spin-slow" size={18} color="#3b82f6" />}
        </div>
    );
}

export default function PlaylistClient({ playlistId, initialSongs = [] }: { playlistId: string, initialSongs?: any[] }) {
    const { isPlaying, currentSong, jumpToSong, playQueue, queue, currentIndex, togglePlay, nextSong, prevSong, hasInteracted, currentTime, duration, seekTo, activePlaylistId, isBuffering } = useAudio();
    const { isZen, setZen } = useZen();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const [dbSongs, setDbSongs] = useState<{ title: string; audioUrl: string; source?: string; duration?: number; id?: string }[]>(initialSongs);

    useEffect(() => {
        setMounted(true);

        // UX-7: Inject styles via body class instead of dangerouslySetInnerHTML
        document.body.classList.add("fullscreen-music-page");
        if (!document.getElementById("fullscreen-playlist-styles")) {
            const style = document.createElement("style");
            style.id = "fullscreen-playlist-styles";
            style.textContent = `
                .fullscreen-music-page header, .fullscreen-music-page footer, .fullscreen-music-page .zen-toggle-floating { display: none !important; }
                .fullscreen-music-page #main-content { padding-top: 0 !important; }
                .fullscreen-music-page { overscroll-behavior: none; touch-action: pan-y; background: #000; }
                @keyframes eq-bar1 { 0%,100%{height:4px} 50%{height:14px} }
                @keyframes eq-bar2 { 0%,100%{height:8px} 50%{height:4px} }
                @keyframes eq-bar3 { 0%,100%{height:6px} 50%{height:12px} }
                .eq-bar { width:3px; background:#FFD60A; border-radius:9999px; will-change:height; }
            `;
            document.head.appendChild(style);
        }

        return () => {
            document.body.classList.remove("fullscreen-music-page");
        };
    }, []);

    // Fetch all songs from database
    useEffect(() => {
        fetch("/api/music/songs")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.songs) {
                    setDbSongs(data.songs);
                }
            })
            .catch(() => { });
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
        let baseSongs = dbSongs;

        if (activePlaylist) {
            baseSongs = dbSongs.filter(song =>
                activePlaylist.songTitles.some((title: string) =>
                    song.title.toLowerCase().includes(title.toLowerCase()) ||
                    title.toLowerCase().includes(song.title.toLowerCase())
                )
            );
        }

        return baseSongs
            .map((song, index) => ({ ...song, originalIndex: index }))
            .filter(song =>
                song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                song.title.toLowerCase().split("—")[0]?.trim().includes(searchQuery.toLowerCase()) ||
                song.title.toLowerCase().split("—")[1]?.trim().includes(searchQuery.toLowerCase())
            );
    }, [activePlaylist, searchQuery, dbSongs]);

    // Scroll to active song on mount
    const activeItemIndex = useMemo(() => {
        return filteredPlaylist.findIndex(s => s.audioUrl === currentSong.audioUrl);
    }, [filteredPlaylist, currentSong]);

    // Phase 4: Use activePlaylistId directly instead of fragile heuristic
    const isThisPlaylistInQueue = activePlaylistId === playlistId ||
        (playlistId === "all" && activePlaylistId === null);

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
            {/* UX-7: Styles injected via useEffect in body-class pattern above */}

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
                    initial={{ opacity: 1, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 0.5 }}
                    onDragEnd={(e: any, info: PanInfo) => {
                        if (info.offset.y > 80) setZen(false); // UX-2: Lowered from 150 to 80
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
                    {/* UX-2: Tap backdrop to close */}
                    <div
                        onClick={() => setZen(false)}
                        style={{ position: "absolute", inset: 0, zIndex: -1 }}
                    />
                    <div style={{ width: "40px", height: "4px", backgroundColor: "rgba(255,255,255,0.3)", borderRadius: "2px", position: "absolute", top: "16px" }} />
                    {/* UX-2: Hint text */}
                    <div style={{ position: "absolute", top: "28px", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "1px" }}>
                        SWIPE DOWN TO CLOSE
                    </div>
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
                    {/* UX-9: StandardBackButton already uses router.back() internally, href is fallback */}
                    <StandardBackButton href={playlistId === "all" ? "/music" : "/playlist"} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
                        <h2 style={{
                            color: "white",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            opacity: 0.8
                        }}>
                            {activePlaylist?.title || "All Tracks"}
                        </h2>
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
                                position: "relative",
                                width: "100%",
                                aspectRatio: "1/1",
                                zIndex: 1,
                            }}>
                                {/* Sliding Vinyl Record */}
                                <motion.div
                                    initial={{ x: 0, rotate: 0 }}
                                    animate={{
                                        x: isThisPlaylistPlaying ? "25%" : 0,
                                        rotate: isThisPlaylistPlaying ? 360 : 0
                                    }}
                                    transition={{
                                        x: { type: "spring", stiffness: 100, damping: 20 },
                                        rotate: { repeat: Infinity, duration: 4, ease: "linear" }
                                    }}
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        top: "5%",
                                        height: "90%",
                                        aspectRatio: "1/1",
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #111 0%, #1a1a1a 50%, #0a0a0a 100%)",
                                        boxShadow: "inset 0 0 0 4px #222, 0 8px 32px rgba(0,0,0,0.5)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        zIndex: -1,
                                        border: "1px solid #333",
                                    }}
                                >
                                    {/* Vinyl Grooves */}
                                    <div style={{ position: "absolute", inset: "12%", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />
                                    <div style={{ position: "absolute", inset: "25%", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)" }} />
                                    <div style={{ position: "absolute", inset: "38%", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />

                                    {/* Vinyl Label */}
                                    <div style={{
                                        width: "35%",
                                        aspectRatio: "1/1",
                                        borderRadius: "50%",
                                        background: activePlaylist.coverColor || "#FFD60A",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)"
                                    }}>
                                        {/* Center hole */}
                                        <div style={{ width: "15%", aspectRatio: "1/1", borderRadius: "50%", background: "#111" }} />
                                    </div>
                                </motion.div>

                                {/* Cover Art */}
                                <div style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    boxShadow: `0 20px 40px -10px ${activePlaylist.coverColor}40`,
                                    position: "relative",
                                    zIndex: 2,
                                    background: "#111"
                                }}>
                                    <img src={activePlaylist.coverImage} alt={activePlaylist.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
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

                        {/* UX-1: Seek Bar */}
                        {activePlaylistId === playlistId && (
                            <div style={{ padding: "0 24px 16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontFamily: "monospace", fontWeight: 600, marginBottom: "6px" }}>
                                    <span>{fmtTime(currentTime)}</span>
                                    <span>{fmtTime(duration)}</span>
                                </div>
                                <div
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                                        seekTo(pct * duration);
                                    }}
                                    style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", cursor: "pointer", position: "relative", overflow: "hidden" }}
                                >
                                    <div style={{
                                        width: `${(currentTime / (duration || 1)) * 100}%`,
                                        height: "100%",
                                        background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                                        borderRadius: "3px",
                                        transition: "width 0.3s linear",
                                        boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)"
                                    }} />
                                </div>
                            </div>
                        )}

                        {/* Phase 6: Use shared TrackRow for both small and large lists */}
                        {filteredPlaylist.length <= 50 ? (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {filteredPlaylist.map((song, i) => (
                                    <TrackRow
                                        key={song.originalIndex}
                                        song={song}
                                        index={i}
                                        isActive={currentSong?.audioUrl === song.audioUrl}
                                        isPlaying={isPlaying}
                                        isBuffering={isBuffering}
                                        onPlay={() => playQueue(filteredPlaylist, i, playlistId)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Virtuoso
                                key={activePlaylist?.id || "playlist-list"}
                                useWindowScroll
                                initialTopMostItemIndex={activeItemIndex !== -1 ? activeItemIndex : 0}
                                data={filteredPlaylist}
                                itemContent={(i, song) => (
                                    <TrackRow
                                        key={song.originalIndex}
                                        song={song}
                                        index={i}
                                        isActive={currentSong?.audioUrl === song.audioUrl}
                                        isPlaying={isPlaying}
                                        isBuffering={isBuffering}
                                        onPlay={() => playQueue(filteredPlaylist, i, playlistId)}
                                    />
                                )}
                            />
                        )}
                    </div>
                </main>
            )}
        </>
    );
}
