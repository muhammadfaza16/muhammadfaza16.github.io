"use client";

import { X, Play, BarChart2, Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { PLAYLIST } from "./AudioContext";

interface PlaylistDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentSongTitle: string;
    onPlaySong: (index: number) => void;
    isPlaying: boolean;
}

export function PlaylistDrawer({
    isOpen,
    onClose,
    currentSongTitle,
    onPlaySong,
    isPlaying
}: PlaylistDrawerProps) {
    const [isRendered, setIsRendered] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            setTimeout(() => {
                const activeItem = document.getElementById("active-song-item");
                if (activeItem && scrollRef.current) {
                    activeItem.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);
            document.body.style.overflow = 'hidden';
            setSearchQuery(""); // clear search on open
        } else {
            const timer = setTimeout(() => setIsRendered(false), 400);
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Filter Logic
    const filteredPlaylist = PLAYLIST
        .map((song, index) => ({ ...song, originalIndex: index }))
        .filter(song =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

    if (!isRendered) return null;

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(2px)",
                    zIndex: 9998,
                    opacity: isOpen ? 1 : 0,
                    transition: "opacity 0.4s ease",
                    pointerEvents: isOpen ? "auto" : "none",
                    cursor: "pointer"
                }}
            />

            {/* Floating Glass Drawer (Full Screen Mode) */}
            <div
                style={{
                    position: "fixed",
                    inset: 0, // Top/Bottom/Left/Right 0
                    height: "100%", // Full height
                    maxHeight: "100%",
                    backgroundColor: "rgba(10, 10, 12, 0.95)", // More opaque for full focus
                    backdropFilter: "blur(60px) saturate(200%)",
                    WebkitBackdropFilter: "blur(60px) saturate(200%)",
                    borderRadius: "0", // No radius for full screen
                    // border: "1px solid rgba(255,255,255,0.08)", // No border needed
                    boxShadow: "none",
                    transform: isOpen ? "translateY(0)" : "translateY(100%)", // Slide from bottom
                    opacity: 1,
                    transition: "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)", // Snappy slide
                    zIndex: 9999,
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    paddingTop: "2rem" // More padding top
                }}
            >


                {/* Header */}
                <div style={{
                    padding: "1.5rem 1.5rem 1rem 1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexShrink: 0,
                    width: "100%",
                    maxWidth: "640px",
                    margin: "0 auto"
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: "2rem", // Larger title
                        fontWeight: 700,
                        fontFamily: "var(--font-serif)",
                        color: "white",
                        letterSpacing: "-0.02em"
                    }}>
                        Library
                    </h3>

                    <div
                        onClick={onClose}
                        style={{
                            padding: "8px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            cursor: "pointer",
                            display: "flex",
                            transition: "background 0.2s"
                        }}
                    >
                        <X size={20} color="white" />
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{
                    padding: "0 1.5rem 1rem 1.5rem",
                    width: "100%",
                    maxWidth: "640px",
                    margin: "0 auto",
                    flexShrink: 0
                }}>
                    <div style={{
                        position: "relative",
                        width: "100%",
                        height: "44px",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 12px",
                        border: "1px solid rgba(255,255,255,0.05)"
                    }}>
                        <Search size={18} color="rgba(255,255,255,0.4)" />
                        <input
                            type="text"
                            placeholder="Find a song..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1,
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                color: "white",
                                fontSize: "1rem",
                                marginLeft: "10px",
                                fontFamily: "var(--font-sans)",
                                fontWeight: 400
                            }}
                            autoFocus={false}
                        />
                        {searchQuery && (
                            <div onClick={() => setSearchQuery("")} style={{ cursor: "pointer", padding: "4px" }}>
                                <X size={14} color="rgba(255,255,255,0.4)" />
                            </div>
                        )}
                    </div>
                </div>

                {/* List */}
                <div
                    ref={scrollRef}
                    className="no-scrollbar"
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "0 1rem 4rem 1rem", // Tighter padding, bottom padding for safe area
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px", // Minimal gap
                        width: "100%",
                        maxWidth: "640px",
                        margin: "0 auto"
                    }}
                >
                    {filteredPlaylist.length === 0 ? (
                        <div style={{ padding: "4rem 0", textAlign: "center", color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
                            No songs found.
                        </div>
                    ) : (
                        filteredPlaylist.map((song) => {
                            const isActive = song.title === currentSongTitle;
                            const originalIndex = song.originalIndex;

                            return (
                                <div
                                    key={originalIndex}
                                    id={isActive ? "active-song-item" : undefined}
                                    onClick={() => onPlaySong(originalIndex)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                        padding: "8px 10px", // Compact padding
                                        borderRadius: "12px",
                                        backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                    className="group"
                                >
                                    <div style={{
                                        width: "20px",
                                        textAlign: "center",
                                        fontSize: "0.75rem",
                                        color: isActive ? "var(--accent)" : "rgba(255,255,255,0.2)",
                                        fontFamily: "var(--font-mono)",
                                        flexShrink: 0,
                                        fontWeight: 500
                                    }}>
                                        {isActive && isPlaying ? (
                                            <BarChart2 size={12} style={{ animation: "pulse 2s infinite" }} />
                                        ) : (
                                            String(originalIndex + 1).padStart(2, '0')
                                        )}
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            color: isActive ? "#fff" : "rgba(255,255,255,0.8)",
                                            fontSize: "0.9rem",
                                            fontWeight: isActive ? 600 : 400,
                                            fontFamily: "var(--font-sans)",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 1, // Single line typically cleaner for compact, but 2 if needed
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            letterSpacing: "-0.01em"
                                        }}>
                                            {song.title.split("—")[1]?.trim() || song.title}
                                        </div>
                                        <div style={{
                                            fontSize: "0.7rem",
                                            color: "rgba(255,255,255,0.4)",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            marginTop: "0px"
                                        }}>
                                            {song.title.split("—")[0]?.trim() || "Unknown Artist"}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <style>{`
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </>,
        document.body
    );
}
