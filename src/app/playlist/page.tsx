"use client";

import React, { useState, useMemo } from "react";
import { Search, Disc, Shuffle } from "lucide-react";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { useAudio, PLAYLIST } from "@/components/AudioContext";
import { motion } from "framer-motion";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LibraryIndexPage() {
    const { isPlaying, queue } = useAudio();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    // Haptic Helper
    const triggerHaptic = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
        }
    };

    // Detect which playlist is currently IN THE QUEUE
    const currentQueuePlaylistId = useMemo(() => {
        if (queue.length === 0) return null;

        for (const playlist of PLAYLIST_CATEGORIES) {
            const playlistSongs = PLAYLIST.filter(song =>
                playlist.songTitles.some((title: string) =>
                    song.title.toLowerCase().includes(title.toLowerCase()) ||
                    title.toLowerCase().includes(song.title.toLowerCase())
                )
            );

            if (queue.length === playlistSongs.length) {
                const playlistUrls = new Set(playlistSongs.map(s => s.audioUrl));
                const allMatch = queue.every(qSong => playlistUrls.has(qSong.audioUrl));
                if (allMatch) return playlist.id;
            }
        }
        return null;
    }, [queue]);

    const filteredCategories = useMemo(() => {
        return PLAYLIST_CATEGORIES.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.vibes.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        header, footer { display: none !important; }
        #main-content { padding-top: 0 !important; }
        html, body { 
            overflow: auto !important; 
            overscroll-behavior: none; 
            touch-action: pan-y; 
            background: #000;
        }
        @keyframes eq-bar1 { 0%,100%{height:4px} 50%{height:14px} }
        @keyframes eq-bar2 { 0%,100%{height:8px} 50%{height:4px} }
        @keyframes eq-bar3 { 0%,100%{height:6px} 50%{height:12px} }
        .eq-bar { width:2px; background:#FFD60A; border-radius:999px; }
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

            <main style={{
                position: "relative",
                zIndex: 10,
                minHeight: "100svh",
                padding: "4rem 1.5rem 8rem 1.5rem",
                maxWidth: "540px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "2rem"
            }}>
                {/* Header */}
                {/* Header */}
                <StandardBackButton href="/" />
                <div> {/* Wrapper to maintain vertical spacing if needed, or just H1 directly */}
                    <h1 style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                        fontSize: "2.8rem",
                        fontWeight: 800,
                        color: "white",
                        letterSpacing: "-0.04em",
                        margin: 0
                    }}>
                        Library
                    </h1>
                </div>

                {/* Search Bar */}
                <div style={{
                    width: "100%",
                    height: "54px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "18px",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 20px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)"
                }}>
                    <Search size={20} color="rgba(255,255,255,0.3)" />
                    <input
                        type="text"
                        placeholder="Search playlists or vibes..."
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

                {/* PLAYLISTS GRID */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px"
                }}>
                    {filteredCategories.map((playlist) => {
                        const isNowPlaying = currentQueuePlaylistId === playlist.id;

                        return (
                            <Link
                                key={playlist.id}
                                href={`/playlist/${playlist.id}`}
                                onClick={triggerHaptic}
                                style={{ textDecoration: "none" }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.96 }}
                                    style={{
                                        position: "relative",
                                        aspectRatio: "1/1",
                                        borderRadius: "28px",
                                        overflow: "hidden",
                                        boxShadow: isNowPlaying
                                            ? `0 0 40px -5px ${playlist.coverColor}60, 0 15px 30px rgba(0,0,0,0.5)`
                                            : "0 10px 30px rgba(0,0,0,0.3)",
                                        border: isNowPlaying ? `2px solid ${playlist.coverColor}` : "1px solid rgba(255,255,255,0.1)"
                                    }}
                                >
                                    <img
                                        src={playlist.coverImage}
                                        alt={playlist.title}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <div style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "flex-end",
                                        padding: "16px"
                                    }}>
                                        <div style={{ color: "white", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}>{playlist.title}</div>
                                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", marginTop: "2px", fontWeight: 500 }}>
                                            {playlist.songTitles.length} tracks
                                        </div>
                                    </div>

                                    {isNowPlaying && isPlaying && (
                                        <div style={{
                                            position: "absolute",
                                            top: "14px",
                                            right: "14px",
                                            background: "rgba(0,0,0,0.5)",
                                            backdropFilter: "blur(4px)",
                                            borderRadius: "50%",
                                            padding: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "1px solid rgba(255,255,255,0.1)"
                                        }}>
                                            <div className="flex gap-[2px] items-end h-[10px]">
                                                <div className="eq-bar" style={{ animation: 'eq-bar1 0.5s ease infinite', background: playlist.coverColor }} />
                                                <div className="eq-bar" style={{ animation: 'eq-bar2 0.5s ease infinite 0.1s', background: playlist.coverColor }} />
                                                <div className="eq-bar" style={{ animation: 'eq-bar3 0.5s ease infinite 0.2s', background: playlist.coverColor }} />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}

                    {/* ALL SONGS CARD */}
                    <Link
                        href="/playlist/all"
                        onClick={triggerHaptic}
                        style={{ textDecoration: "none" }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            style={{
                                position: "relative",
                                aspectRatio: "1/1",
                                borderRadius: "28px",
                                overflow: "hidden",
                                background: "linear-gradient(135deg, #1a1a1a, #000)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                padding: "20px",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                            }}
                        >
                            <Shuffle size={32} color="white" style={{ opacity: 0.4, marginBottom: "8px" }} />
                            <div style={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}>All Songs</div>
                            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", fontWeight: 500 }}>{PLAYLIST.length} Tracks</div>
                        </motion.div>
                    </Link>
                </div>
            </main>
        </>
    );
}
