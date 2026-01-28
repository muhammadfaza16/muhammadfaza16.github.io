"use client";

import React, { useState } from "react";
import { BarChart2, Play, Search, Heart, Disc, Music2, ChevronLeft, Home } from "lucide-react";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { CurrentlyStrip } from "@/components/CurrentlyStrip";
import { useAudio, PLAYLIST } from "@/components/AudioContext";
import { useZen } from "@/components/ZenContext";
import { motion, PanInfo, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MiniPlayerWidget } from "@/components/MiniPlayerWidget";
import { PLAYLIST_CATEGORIES } from "@/data/playlists"; // NEW
import { useRouter } from "next/navigation";

export default function ImmersiveMusicPage() {
    const { isPlaying, currentSong, jumpToSong } = useAudio();
    const { isZen, setZen } = useZen();
    const router = useRouter();
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Scroll & Motion Hooks
    const { scrollY } = useScroll();
    const headerScale = useTransform(scrollY, [0, 100], [1, 0.9]);
    const headerOpacity = useTransform(scrollY, [0, 50], [1, 0]);
    const searchBarTop = useTransform(scrollY, [0, 100], ["1rem", "0.5rem"]); // Revised top sticking

    // Haptic Helper
    const triggerHaptic = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10); // Subtle tick
        }
    };

    const handleSongClick = (index: number) => {
        triggerHaptic();
        jumpToSong(index);
        setZen(true); // Enter Zen Mode immediately
    };

    const handlePlaylistSelect = (id: string | null) => {
        triggerHaptic();
        setSelectedPlaylistId(id);
    }

    // 1. Determine which songs to show based on selection
    //    If selectedPlaylistId is null => Show ALL songs (default)
    //    Else => Show only songs in that playlist
    const activePlaylist = selectedPlaylistId
        ? PLAYLIST_CATEGORIES.find(p => p.id === selectedPlaylistId)
        : null;

    const songsToFilter = activePlaylist
        ? PLAYLIST.filter(song =>
            activePlaylist.songTitles.some((title: string) =>
                // Fuzzy match or exact match depending on data quality
                song.title.toLowerCase().includes(title.toLowerCase()) ||
                title.toLowerCase().includes(song.title.toLowerCase())
            )
        )
        : PLAYLIST;


    const filteredPlaylist = songsToFilter
        .map((song) => {
            // We need to find the ORIGINAL index in the master PLAYLIST 
            // so that AudioContext jumps to the right track.
            const originalIndex = PLAYLIST.findIndex(p => p.audioUrl === song.audioUrl);
            return { ...song, originalIndex };
        })
        .filter(song =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <>
            {/* Global Styles for this page */}
            <style dangerouslySetInnerHTML={{
                __html: `
        header, footer, .zen-toggle-floating { display: none !important; }
        #main-content { padding-top: 0 !important; }
        /* Lock viewport but allow vertical scroll if in library mode */
        html, body { 
            overflow: ${isZen ? 'hidden' : 'auto'} !important; 
            overscroll-behavior: none; 
            touch-action: pan-y; 
            height: 100svh !important; 
            background: #000;
        }
      `}} />

            {/* Ambient Background (Always present) */}
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

            {/* VIEW SWITCHER */}
            {isZen ? (
                // --- ZEN MODE (IMMERSIVE PLAYER) ---
                <motion.main
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 0.5 }} // Allow pull down feel
                    onDragEnd={(e: any, info: PanInfo) => {
                        if (info.offset.y > 150) { // Threshold to dismiss
                            setZen(false);
                        }
                    }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100svh",
                        zIndex: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                        background: "rgba(0,0,0,0.4)", // Slight dim
                        backdropFilter: "blur(20px)"
                    }}
                >
                    {/* Handle Bar to indicate swipeability */}
                    <div style={{
                        width: "40px",
                        height: "4px",
                        backgroundColor: "rgba(255,255,255,0.3)",
                        borderRadius: "2px",
                        position: "absolute",
                        top: "16px",
                        left: "50%",
                        transform: "translateX(-50%)"
                    }} />

                    <div style={{
                        width: "100%",
                        maxWidth: "500px",
                        transform: "scale(1.1)",
                    }}>
                        <CurrentlyStrip />
                    </div>
                </motion.main>
            ) : (
                // --- LIBRARY MODE (PLAYLIST SELECTION) ---
                <main style={{
                    position: "relative",
                    zIndex: 10,
                    minHeight: "100svh",
                    padding: "5rem 1.25rem 8rem 1.25rem", // Balanced padding
                    maxWidth: "540px", // Tighter max-width for phone-like focus
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem"
                }}>
                    {/* Header & Grid */}
                    <div>
                        <motion.div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center", // Center align for cleaner look
                                marginBottom: "1.25rem",
                                padding: "0 0.5rem",
                                opacity: headerOpacity,
                                scale: headerScale,
                                transformOrigin: "left bottom",
                                height: "40px" // Fixed height for alignment
                            }}
                        >
                            {selectedPlaylistId ? (
                                <motion.button
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => handlePlaylistSelect(null)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "white",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        fontSize: "1.1rem",
                                        fontWeight: 600,
                                        padding: 0,
                                        cursor: "pointer",
                                        fontFamily: "var(--font-sans)",
                                    }}
                                >
                                    <ChevronLeft size={24} className="text-[#3b82f6]" />
                                    <span style={{ color: "#3b82f6" }}>Library</span>
                                </motion.button>
                            ) : (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => router.push("/")}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px" // Space between icon and title
                                    }}
                                >
                                    <div style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(255,255,255,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <ChevronLeft size={20} color="white" />
                                    </div>
                                    <h1 style={{
                                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                                        fontSize: "2.5rem",
                                        fontWeight: 800,
                                        color: "white",
                                        letterSpacing: "-0.04em",
                                        margin: 0,
                                    }}>
                                        Library
                                    </h1>
                                </motion.button>
                            )}
                        </motion.div>

                        {/* PLAYLISTS GRID */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)", // 2 Columns for bigger art (iOS standard)
                            gap: "16px",
                            marginBottom: "1rem"
                        }}>
                            {PLAYLIST_CATEGORIES.map((playlist) => {
                                const isSelected = selectedPlaylistId === playlist.id;
                                const isDimmed = selectedPlaylistId && !isSelected;

                                return (
                                    <div
                                        key={playlist.id}
                                        onClick={() => setSelectedPlaylistId(isSelected ? null : playlist.id)}
                                        style={{
                                            position: "relative",
                                            aspectRatio: "1/1",
                                            borderRadius: "20px", // Smooth continuous corners
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            opacity: isDimmed ? 0.3 : 1,
                                            transform: isDimmed ? "scale(0.92)" : (isSelected ? "scale(1.03)" : "scale(1)"),
                                            transition: "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
                                            boxShadow: isSelected
                                                ? `0 20px 50px -12px ${playlist.coverColor}80` // Glow when selected
                                                : "0 4px 20px rgba(0,0,0,0.4)"
                                        }}
                                        className="group"
                                    >
                                        {/* Image */}
                                        <img
                                            src={playlist.coverImage}
                                            alt={playlist.title}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                transition: "transform 0.7s cubic-bezier(0.19, 1, 0.22, 1)"
                                            }}
                                            className="group-hover:scale-110"
                                        />

                                        {/* Gradient Overlay */}
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%)",
                                            display: "flex", // Keep flex to push title down
                                            flexDirection: "column",
                                            justifyContent: "flex-end",
                                            padding: "12px",
                                            opacity: isSelected ? 0 : 1, // Hide title when selected to focus on art
                                            transition: "opacity 0.3s"
                                        }}>
                                            <span style={{
                                                color: "white",
                                                fontWeight: 600,
                                                fontSize: "0.9rem", // Readable size
                                                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                                                letterSpacing: "-0.01em",
                                                lineHeight: 1.1
                                            }}>
                                                {playlist.title}
                                            </span>
                                        </div>

                                        {/* Active Border Ring (Inner) */}
                                        {isSelected && (
                                            <div style={{
                                                position: "absolute",
                                                inset: "0px",
                                                border: `3px solid ${playlist.coverColor}`,
                                                borderRadius: "20px",
                                                pointerEvents: "none"
                                            }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Rich Header Info (Visible when Playlist Selected) */}
                    <AnimatePresence>
                        {activePlaylist && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ marginBottom: "2rem", overflow: "hidden" }}
                            >
                                <div style={{
                                    padding: "20px",
                                    background: "rgba(255,255,255,0.03)",
                                    borderRadius: "20px",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px"
                                }}>
                                    {/* Philosophy */}
                                    <div style={{
                                        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                                        fontWeight: 300,
                                        fontStyle: "italic",
                                        fontSize: "1.15rem",
                                        color: "rgba(255,255,255,0.95)",
                                        lineHeight: "1.6",
                                        letterSpacing: "0.01em",
                                        textShadow: "0 2px 10px rgba(0,0,0,0.5)"
                                    }}>
                                        "{activePlaylist.philosophy}"
                                    </div>

                                    {/* Meta Tags */}
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                                        {/* Time Badge */}
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "6px 12px",
                                            background: "rgba(59, 130, 246, 0.2)",
                                            borderRadius: "100px",
                                            fontSize: "0.8rem",
                                            color: "#93c5fd",
                                            fontWeight: 600
                                        }}>
                                            <span style={{ fontSize: "1.2em" }}>🕒</span> {activePlaylist.schedule}
                                        </div>

                                        {/* Vibes */}
                                        {activePlaylist.vibes.map(vibe => (
                                            <span key={vibe} style={{
                                                padding: "6px 12px",
                                                borderRadius: "100px",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                fontSize: "0.8rem",
                                                color: "rgba(255,255,255,0.6)"
                                            }}>
                                                {vibe}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Search Bar - Sticky & Glass */}
                    <div style={{
                        position: "sticky",
                        top: "1.5rem",
                        zIndex: 40,
                    }}>
                        <div style={{
                            width: "100%",
                            height: "50px",
                            backgroundColor: "rgba(20, 20, 20, 0.65)", // Deep aesthetic dark
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            padding: "0 16px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            backdropFilter: "blur(25px) saturate(180%)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                            transition: "all 0.3s ease"
                        }}>
                            <Search size={18} color="rgba(255,255,255,0.5)" />
                            <input
                                type="text"
                                placeholder={activePlaylist ? `Search ${activePlaylist.title}` : "Songs, Artists, Lyrics"}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    color: "white",
                                    fontSize: "1rem",
                                    marginLeft: "12px",
                                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                                    fontWeight: 400,
                                    letterSpacing: "-0.01em"
                                }}
                            />
                        </div>
                    </div>

                    {/* Song List - iOS Inset Grouped Style */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0px",
                        background: "rgba(28, 28, 30, 0.5)", // System gray 6-ish
                        backdropFilter: "blur(10px)",
                        borderRadius: "22px",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.06)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                    }}>
                        <div style={{
                            padding: "16px 20px",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "rgba(255,255,255,0.02)"
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{
                                    fontSize: "0.95rem",
                                    fontWeight: 700,
                                    color: "white",
                                    letterSpacing: "-0.02em",
                                    margin: 0,
                                }}>
                                    {activePlaylist ? activePlaylist.title : "All Tracks"}
                                </h3>
                                <span style={{
                                    fontSize: "0.75rem",
                                    color: "rgba(255,255,255,0.5)",
                                    marginTop: "2px"
                                }}>
                                    {filteredPlaylist.length} Songs
                                </span>
                            </div>

                            {/* Play Button Indicator (Decorative) */}
                            <div style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Play size={14} fill="white" color="white" style={{ marginLeft: "2px" }} />
                            </div>
                        </div>

                        {filteredPlaylist.map((song, i) => {
                            const isActive = currentSong?.title === song.title;
                            const originalIndex = song.originalIndex;
                            const isLast = i === filteredPlaylist.length - 1;

                            return (
                                <div
                                    key={originalIndex}
                                    onClick={() => handleSongClick(originalIndex)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                        padding: "16px 20px",
                                        backgroundColor: isActive
                                            ? "rgba(255,255,255,0.12)"
                                            : "transparent",
                                        cursor: "pointer",
                                        position: "relative",
                                        transition: "background 0.2s"
                                    }}
                                    className="hover:bg-white/5 active:bg-white/10"
                                >
                                    {/* Separator Line (Inset) */}
                                    {!isLast && !isActive && (
                                        <div style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: "56px", // Inset past the index/icon
                                            right: 0,
                                            height: "1px",
                                            background: "rgba(255,255,255,0.06)"
                                        }} />
                                    )}

                                    {/* Leading Index / Active Graph */}
                                    <div style={{
                                        width: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: isActive ? "var(--accent)" : "rgba(255,255,255,0.3)",
                                        fontSize: "0.85rem",
                                        fontFamily: "var(--font-mono)"
                                    }}>
                                        {isActive && isPlaying ? (
                                            <div className="flex gap-[2px] items-end h-[12px]">
                                                <motion.div
                                                    animate={{ height: [4, 12, 6, 12] }}
                                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                                    className="w-[3px] bg-[#3b82f6] rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ height: [8, 4, 12, 6] }}
                                                    transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                                                    className="w-[3px] bg-[#3b82f6] rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ height: [6, 10, 4, 10] }}
                                                    transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                                                    className="w-[3px] bg-[#3b82f6] rounded-full"
                                                />
                                            </div>
                                        ) : (
                                            <span style={{ fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
                                        )}
                                    </div>

                                    {/* Song Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            color: isActive ? "white" : "rgba(255,255,255,0.95)",
                                            fontSize: "0.95rem",
                                            fontWeight: isActive ? 600 : 500,
                                            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                                            marginBottom: "2px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            letterSpacing: "-0.01em"
                                        }}>
                                            {song.title.split("—")[1]?.trim() || song.title}
                                        </div>
                                        <div style={{
                                            color: "rgba(255,255,255,0.5)",
                                            fontSize: "0.8rem",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                                            letterSpacing: "0.005em"
                                        }}>
                                            {song.title.split("—")[0]?.trim() || "Unknown Artist"}
                                        </div>
                                    </div>

                                    {/* Trailing Action (Heart/Menu - passive for now) */}
                                    <div style={{ opacity: 0 }} className="group-hover:opacity-50 transition-opacity">
                                        <Heart size={16} color="white" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>


                    {/* Floating Mini Player */}
                    <div style={{
                        position: "fixed",
                        bottom: "2rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "100%",
                        maxWidth: "600px",
                        zIndex: 50,
                        pointerEvents: "none"
                    }}>
                        <div style={{ pointerEvents: "auto" }}>
                            <MiniPlayerWidget />
                        </div>
                    </div>
                </main >
            )
            }
        </>
    );
}
