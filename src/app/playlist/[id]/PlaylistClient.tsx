"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Play, Pause, Search, Shuffle, ChevronLeft, Disc } from "lucide-react";
import { Virtuoso } from 'react-virtuoso';
import { useAudio } from "@/components/AudioContext";
import { motion, AnimatePresence } from "framer-motion";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";
import Link from "next/link";

const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
};

function TrackRow({ song, index, isActive, isPlaying, onPlay }: {
    song: { title: string; audioUrl: string; originalIndex: number };
    index: number;
    isActive: boolean;
    isPlaying: boolean;
    onPlay: () => void;
}) {
    return (
        <motion.div
            whileHover={{ x: 4, backgroundColor: isActive ? "#000" : "rgba(0,0,0,0.02)" }}
            whileTap={{ scale: 0.98, backgroundColor: isActive ? "#000" : "rgba(0,0,0,0.05)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={onPlay}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 10px",
                backgroundColor: isActive ? "#000" : "transparent",
                color: isActive ? "#fff" : "#000",
                cursor: "pointer",
                borderBottom: "2px solid #000",
                transition: "color 0.2s ease"
            }}
        >
            <div style={{ width: "24px", textAlign: "center", fontWeight: 900, fontFamily: "monospace" }}>
                {isActive && isPlaying ? (
                    <Disc className="animate-spin" size={16} color="#fff" />
                ) : (index + 1)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 900, fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "-0.04em", lineHeight: 1.2 }}>
                    {song.title.split("—")[1]?.trim() || song.title}
                </div>
                <div style={{ color: isActive ? "#ccc" : "#666", fontSize: "0.8rem", fontFamily: "monospace", fontWeight: 700, marginTop: "2px" }}>
                    {song.title.split("—")[0]?.trim() || "Unknown Artist"}
                </div>
            </div>
        </motion.div>
    );
}

export default function PlaylistClient({ playlistId, initialSongs = [] }: { playlistId: string, initialSongs?: any[] }) {
    const { playQueue, queue, currentSong, isPlaying, togglePlay, activePlaylistId, setIsPlayerExpanded } = useAudio();
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Explicitly fallback initialSongs if none provided.
    const [dbSongs, setDbSongs] = useState<{ title: string; audioUrl: string; duration?: number; id?: string }[]>(initialSongs || []);

    // useMemo for activePlaylist is below

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
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

    const activePlaylist = useMemo(() => {
        if (playlistId === "all") return null;
        return PLAYLIST_CATEGORIES.find(p => p.id === playlistId);
    }, [playlistId]);

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
                song.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [activePlaylist, searchQuery, dbSongs]);

    const isThisPlaylistInQueue = activePlaylistId === playlistId || (playlistId === "all" && activePlaylistId === null);
    const isThisPlaylistPlaying = isPlaying && isThisPlaylistInQueue;

    const borderStyle = "2px solid #000";
    const shadowStyle = "4px 4px 0 #000";

    if (!mounted) return null;

    return (
        <main style={{
            position: "relative",
            minHeight: "100svh",
            padding: "16px 16px 120px 16px",
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            backgroundColor: "#F5F0EB",
            color: "#000"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", marginBottom: "8px" }}>
                <Link href="/playlist" style={{ textDecoration: "none" }}>
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
                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>
                    {activePlaylist ? "Playlist" : "Library"}
                </span>
                <div style={{ width: "44px" }} />
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
                            backgroundColor: "#F5F0EB",
                            zIndex: 100,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "24px"
                        }}
                    >
                        <div style={{
                            width: "120px",
                            height: "120px",
                            backgroundColor: "#fff",
                            border: borderStyle,
                            boxShadow: shadowStyle,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "16px"
                        }}>
                            <Disc size={64} color="#000" className="animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                fontFamily: "system-ui, -apple-system, sans-serif",
                                fontWeight: 900,
                                fontSize: "1.2rem",
                                textTransform: "uppercase",
                                letterSpacing: "-0.04em",
                                color: "#000"
                            }}>
                                Tuning the Cosmos
                            </div>
                            <div style={{
                                fontFamily: "monospace",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                color: "#666",
                                marginTop: "4px"
                            }}>
                                Loading collection...
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {activePlaylist && (
                <div style={{
                    backgroundColor: activePlaylist.coverColor || "#fff",
                    border: borderStyle,
                    borderRadius: "16px",
                    boxShadow: shadowStyle,
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <img 
                        src={activePlaylist.coverImage} 
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: 0.5 }} 
                        className="mix-blend-multiply" 
                        alt="" 
                    />
                    <div style={{ position: "relative", zIndex: 1, textAlign: "center", backgroundColor: "rgba(255,255,255,0.9)", padding: "12px", border: borderStyle, borderRadius: "12px", width: "100%" }}>
                        <h2 style={{
                            fontSize: "1.75rem",
                            fontWeight: 900,
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            textTransform: "uppercase",
                            margin: "0 0 4px 0",
                            lineHeight: 1,
                            letterSpacing: "-0.04em",
                            color: "#000"
                        }}>
                            {activePlaylist.title}
                        </h2>
                        <div style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700, color: "#333", lineHeight: 1.2 }}>
                            "{activePlaylist.philosophy}"
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <motion.button
                    whileHover={{ scale: 1.02, y: -2, boxShadow: "6px 6px 0 #000" }}
                    whileTap={{ scale: 0.98, y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    onClick={() => {
                        if (isThisPlaylistInQueue) togglePlay();
                        else playQueue(filteredPlaylist, 0, playlistId);
                        setIsPlayerExpanded(true);
                    }}
                    style={{
                        flex: 1,
                        background: isThisPlaylistPlaying ? "#fff" : "#000",
                        color: isThisPlaylistPlaying ? "#000" : "#fff",
                        border: borderStyle,
                        borderRadius: "12px",
                        boxShadow: shadowStyle,
                        padding: "10px",
                        fontSize: "0.95rem",
                        fontWeight: 900,
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        letterSpacing: "-0.04em",
                        transition: "background 0.2s ease, color 0.2s ease"
                    }}
                >
                    {isThisPlaylistPlaying ? <><Pause size={20} fill="#000" color="#000" /> PAUSE</> : <><Play size={20} fill={isThisPlaylistPlaying ? "#000" : "#fff"} color={isThisPlaylistPlaying ? "#000" : "#fff"} /> PLAY QUEUE</>}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "6px 6px 0 #000" }}
                    whileTap={{ scale: 0.95, y: 2, x: 2, boxShadow: "0px 0px 0 #000" }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    onClick={() => {
                        playQueue(filteredPlaylist, 0, playlistId, true);
                        setIsPlayerExpanded(true);
                    }}
                    style={{
                        background: "#fff",
                        color: "#000",
                        border: borderStyle,
                        borderRadius: "12px",
                        boxShadow: shadowStyle,
                        padding: "0 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "background 0.2s ease"
                    }}
                >
                    <Shuffle size={20} color="#000" />
                </motion.button>
            </div>

            <div style={{
                position: "sticky",
                top: "96px",
                zIndex: 40,
                width: "100%",
                height: "50px",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                border: borderStyle,
                borderRadius: "12px",
                boxShadow: shadowStyle
            }}>
                <Search size={20} color="#000" />
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
                        color: "#000",
                        fontSize: "1rem",
                        marginLeft: "12px",
                        fontFamily: "monospace",
                        fontWeight: 700
                    }}
                />
            </div>

            <div style={{
                display: "flex",
                flexDirection: "column",
                background: "#fff",
                border: borderStyle,
                borderRadius: "16px",
                boxShadow: shadowStyle,
                overflow: "hidden"
            }}>
                <div style={{ padding: "12px 16px", borderBottom: "2px solid #000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 900, fontFamily: "system-ui, -apple-system, sans-serif", margin: 0, textTransform: "uppercase", letterSpacing: "-0.04em", color: "#000" }}>
                        Tracks
                    </h3>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.85rem", color: "#000" }}>{filteredPlaylist.length}</span>
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
                                    playQueue(filteredPlaylist, i, playlistId);
                                    setIsPlayerExpanded(true);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <Virtuoso
                        key={activePlaylist?.id || "playlist-list"}
                        useWindowScroll
                        data={filteredPlaylist}
                        itemContent={(i: number, song: any) => (
                            <TrackRow
                                key={song.originalIndex}
                                song={song}
                                index={i}
                                isActive={currentSong?.audioUrl === song.audioUrl}
                                isPlaying={isPlaying}
                                onPlay={() => {
                                    playQueue(filteredPlaylist, i, playlistId);
                                    setIsPlayerExpanded(true);
                                }}
                            />
                        )}
                    />
                )}
            </div>
        </main>
    );
}
