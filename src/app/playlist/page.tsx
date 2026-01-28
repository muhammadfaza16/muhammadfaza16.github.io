"use client";

import React, { useState, useMemo } from "react";
import { BarChart2, Play, Pause, Search, Heart, Disc, Music2, ChevronLeft, Home } from "lucide-react";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { CurrentlyStrip } from "@/components/CurrentlyStrip";
import { useAudio, PLAYLIST } from "@/components/AudioContext";
import { useZen } from "@/components/ZenContext";
import { motion, PanInfo, AnimatePresence } from "framer-motion";
import { MiniPlayerWidget } from "@/components/MiniPlayerWidget";
import { PLAYLIST_CATEGORIES } from "@/data/playlists"; // NEW
import { useRouter } from "next/navigation";

export default function ImmersiveMusicPage() {
    const { isPlaying, currentSong, jumpToSong, playQueue, queue, currentIndex, togglePlay } = useAudio();
    const { isZen, setZen } = useZen();
    const router = useRouter();
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Static header (removed useScroll for performance)

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
    // 1. Determine which songs to show based on selection
    const activePlaylist = useMemo(() => {
        return selectedPlaylistId
            ? PLAYLIST_CATEGORIES.find(p => p.id === selectedPlaylistId)
            : null;
    }, [selectedPlaylistId]);

    const filteredPlaylist = useMemo(() => {
        // Step A: Filter by Category/Playlist
        let baseSongs = PLAYLIST;
        if (activePlaylist) {
            baseSongs = PLAYLIST.filter(song =>
                activePlaylist.songTitles.some((title: string) =>
                    // Optimization: Check includes both ways for safety, but consider caching activePlaylist.songTitles set if needed
                    song.title.toLowerCase().includes(title.toLowerCase()) ||
                    title.toLowerCase().includes(song.title.toLowerCase())
                )
            );
        }

        // Step B: Map & Filter by Search
        // We map FIRST to get original index, then filter by search query
        return baseSongs
            .map((song) => {
                const originalIndex = PLAYLIST.findIndex(p => p.audioUrl === song.audioUrl);
                return { ...song, originalIndex };
            })
            .filter(song =>
                song.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [activePlaylist, searchQuery]);

    // Detect which playlist is currently playing (if any)
    const currentlyPlayingPlaylistId = useMemo(() => {
        if (!isPlaying || queue.length <= 1) return null;

        // Check each playlist to see if its songs match the current queue
        for (const playlist of PLAYLIST_CATEGORIES) {
            const playlistSongs = PLAYLIST.filter(song =>
                playlist.songTitles.some((title: string) =>
                    song.title.toLowerCase().includes(title.toLowerCase()) ||
                    title.toLowerCase().includes(song.title.toLowerCase())
                )
            );

            // If queue length matches and first song matches, it's likely this playlist
            if (queue.length === playlistSongs.length && queue[0]?.audioUrl === playlistSongs[0]?.audioUrl) {
                return playlist.id;
            }
        }
        return null;
    }, [isPlaying, queue]);

    // Check if the currently selected playlist is playing
    const isSelectedPlaylistPlaying = isPlaying && selectedPlaylistId && currentlyPlayingPlaylistId === selectedPlaylistId;

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
        /* Pulse glow animation for currently playing playlist */
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 30px 5px currentColor, 0 20px 50px -12px currentColor; }
            50% { box-shadow: 0 0 40px 10px currentColor, 0 25px 60px -10px currentColor; }
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
                    gap: "1.5rem" // Tighter gap (was 2.5rem)
                }}>
                    {/* Header & Grid */}
                    <div style={{ marginBottom: "2rem" }}> {/* Explicit margin below entire header section */}
                        <motion.div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingLeft: "0.5rem",
                                paddingRight: "0.5rem",
                                paddingBottom: "2.5rem", /* Explicit large gap between Library and cards */
                                height: "40px"
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
                            marginBottom: "0rem" // Removed - let parent gap handle it
                        }}>
                            {PLAYLIST_CATEGORIES.map((playlist) => {
                                const isSelected = selectedPlaylistId === playlist.id;
                                const isDimmed = selectedPlaylistId && !isSelected;
                                const isNowPlaying = currentlyPlayingPlaylistId === playlist.id;

                                return (
                                    <div
                                        key={playlist.id}
                                        onClick={() => setSelectedPlaylistId(isSelected ? null : playlist.id)}
                                        style={{
                                            position: "relative",
                                            aspectRatio: "1/1",
                                            borderRadius: "20px",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            opacity: isDimmed ? 0.3 : 1,
                                            transform: isDimmed ? "scale(0.92)" : (isSelected ? "scale(1.03)" : "scale(1)"),
                                            transition: "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
                                            boxShadow: isNowPlaying
                                                ? `0 0 30px 5px ${playlist.coverColor}90, 0 20px 50px -12px ${playlist.coverColor}80` // Shining glow when playing
                                                : isSelected
                                                    ? `0 20px 50px -12px ${playlist.coverColor}80`
                                                    : "0 4px 20px rgba(0,0,0,0.4)",
                                            animation: isNowPlaying ? "pulse-glow 2s ease-in-out infinite" : "none"
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

                        {/* Now Playing Playlist Widget (Shows when any playlist is playing) */}
                        <AnimatePresence>
                            {currentlyPlayingPlaylistId && !selectedPlaylistId && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => setSelectedPlaylistId(currentlyPlayingPlaylistId)}
                                    style={{
                                        marginTop: "1rem",
                                        padding: "12px 16px",
                                        background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                                        borderRadius: "16px",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                                    }}
                                >
                                    {/* Animated Playing Indicator */}
                                    <div style={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "10px",
                                        background: PLAYLIST_CATEGORIES.find(p => p.id === currentlyPlayingPlaylistId)?.coverColor || "#FFD60A",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0
                                    }}>
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        >
                                            <Music2 size={18} color="rgba(0,0,0,0.7)" />
                                        </motion.div>
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: "0.7rem",
                                            color: "rgba(255,255,255,0.5)",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                            marginBottom: "2px"
                                        }}>
                                            Now Playing
                                        </div>
                                        <div style={{
                                            fontSize: "0.95rem",
                                            fontWeight: 600,
                                            color: "white",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>
                                            {PLAYLIST_CATEGORIES.find(p => p.id === currentlyPlayingPlaylistId)?.title}
                                        </div>
                                    </div>

                                    {/* Track Progress */}
                                    <div style={{
                                        padding: "6px 12px",
                                        background: "rgba(255,255,255,0.1)",
                                        borderRadius: "20px",
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "white"
                                    }}>
                                        {currentIndex + 1}/{queue.length}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Rich Header Info (Visible when Playlist Selected) */}
                    <AnimatePresence mode="wait">
                        {activePlaylist && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{ marginTop: "0.5rem", marginBottom: "0.5rem", overflow: "hidden" }} // Adjusted spacing
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

                                {/* Action Buttons (Play Batch) */}
                                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            triggerHaptic();
                                            if (isSelectedPlaylistPlaying) {
                                                togglePlay(); // Pause if already playing this playlist
                                            } else {
                                                playQueue(filteredPlaylist, 0); // Play from start
                                            }
                                        }}
                                        style={{
                                            flex: 1,
                                            background: "white",
                                            color: "black",
                                            border: "none",
                                            borderRadius: "12px",
                                            padding: "14px",
                                            fontSize: "1rem",
                                            fontWeight: 700,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            cursor: "pointer",
                                            boxShadow: "0 4px 12px rgba(255,255,255,0.2)"
                                        }}
                                    >
                                        {isSelectedPlaylistPlaying ? (
                                            <><Pause size={20} fill="black" /> Pause</>
                                        ) : (
                                            <><Play size={20} fill="black" /> Play</>
                                        )}
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            triggerHaptic();
                                            // Simple Shuffle: Sort random then play
                                            const shuffled = [...filteredPlaylist].sort(() => Math.random() - 0.5);
                                            playQueue(shuffled, 0);
                                        }}
                                        style={{
                                            background: "rgba(255,255,255,0.1)",
                                            color: "white",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "12px",
                                            padding: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <Music2 size={20} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Search Bar - Sticky & Glass */}
                    <div style={{
                        position: "sticky",
                        top: "1.5rem",
                        zIndex: 40,
                        marginBottom: "-0.5rem" // Reduce gap to song list below
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

                    {/* Song List - Premium Obsidian Glass Style */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.05 // Cascade effect
                                }
                            }
                        }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0px",
                            background: "rgba(10, 10, 12, 0.6)", // Deeper, more expansive dark
                            backdropFilter: "blur(20px) saturate(180%)", // High-end blur
                            borderRadius: "24px",
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" // Floating depth
                        }}
                    >
                        <div style={{
                            padding: "20px 24px",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "linear-gradient(to right, rgba(255,255,255,0.03), transparent)"
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{
                                    fontSize: "1.1rem",
                                    fontWeight: 700,
                                    color: "white",
                                    letterSpacing: "-0.02em",
                                    margin: 0,
                                    textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                                }}>
                                    {activePlaylist ? activePlaylist.title : "All Tracks"}
                                </h3>
                                <span style={{
                                    fontSize: "0.8rem",
                                    color: "rgba(255,255,255,0.4)",
                                    marginTop: "4px",
                                    fontWeight: 500
                                }}>
                                    {filteredPlaylist.length} Songs • Premium Audio
                                </span>
                            </div>

                            {/* Play Button Indicator (Decorative) */}
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.15)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    border: "1px solid rgba(255,255,255,0.1)"
                                }}
                                onClick={triggerHaptic}
                            >
                                <Play size={16} fill="white" color="white" style={{ marginLeft: "2px" }} />
                            </motion.div>
                        </div>

                        {filteredPlaylist.map((song, i) => {
                            const isActive = currentSong?.title === song.title;
                            const originalIndex = song.originalIndex;
                            const isLast = i === filteredPlaylist.length - 1;

                            return (
                                <div
                                    key={originalIndex}
                                    onClick={() => playQueue(filteredPlaylist, i)}
                                    className="group/item"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "18px",
                                        padding: "18px 24px",
                                        backgroundColor: isActive
                                            ? "rgba(255,255,255,0.15)"
                                            : "transparent",
                                        cursor: "pointer",
                                        position: "relative",
                                        transition: "background 0.2s ease" // CSS Transition instead of Motion
                                    }}
                                >
                                    {/* Separator Line (Inset) */}
                                    {!isLast && !isActive && (
                                        <div style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: "60px", // Inset past the index/icon
                                            right: 0,
                                            height: "1px",
                                            background: "rgba(255,255,255,0.04)"
                                        }} />
                                    )}

                                    {/* Leading Index / Active Graph */}
                                    <div style={{
                                        width: "24px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: isActive ? "#3b82f6" : "rgba(255,255,255,0.25)",
                                        fontSize: "0.9rem",
                                        fontWeight: isActive ? 700 : 500,
                                        fontFamily: "var(--font-mono)"
                                    }}>
                                        {isActive && isPlaying ? (
                                            <div className="flex gap-[3px] items-end h-[14px]">
                                                <motion.div
                                                    animate={{ height: [4, 14, 6, 14] }}
                                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                                    className="w-[3px] bg-[#3b82f6] rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ height: [8, 4, 14, 6] }}
                                                    transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                                                    className="w-[3px] bg-[#3b82f6] rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ height: [6, 12, 4, 12] }}
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
                                            fontSize: "1rem", // Slightly larger premium feel
                                            fontWeight: isActive ? 700 : 500,
                                            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                                            marginBottom: "3px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            letterSpacing: "-0.01em"
                                        }}>
                                            {song.title.split("—")[1]?.trim() || song.title}
                                        </div>
                                        <div style={{
                                            color: "rgba(255,255,255,0.5)",
                                            fontSize: "0.85rem",
                                            fontWeight: 400,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                                            letterSpacing: "0.01em"
                                        }}>
                                            {song.title.split("—")[0]?.trim() || "Unknown Artist"}
                                        </div>
                                    </div>

                                    {/* Trailing Action */}
                                    {isActive ? (
                                        <div style={{ opacity: 1 }}>
                                            <Disc className="animate-spin-slow" size={18} color="#3b82f6" />
                                        </div>
                                    ) : (
                                        <div style={{ opacity: 0 }} className="group-hover:opacity-100 transition-opacity">
                                            <Play size={16} fill="white" color="white" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>


                    {/* Floating Mini Player (self-positioned) */}
                    <MiniPlayerWidget />
                </main>
            )}
        </>
    );
}
