"use client";

import { X, Play, BarChart2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
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
    const [isRendered, setIsRendered] = useState(isOpen);
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
        } else {
            const timer = setTimeout(() => setIsRendered(false), 400);
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isRendered) return null;

    return (
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

            {/* Floating Glass Drawer */}
            <div
                style={{
                    position: "fixed",
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    height: "60vh",
                    maxHeight: "60vh",
                    backgroundColor: "rgba(10, 10, 12, 0.65)", // High transparency
                    backdropFilter: "blur(60px) saturate(200%)",
                    WebkitBackdropFilter: "blur(60px) saturate(200%)",
                    borderRadius: "28px", // Fully rounded
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    transform: isOpen ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
                    opacity: isOpen ? 1 : 0,
                    transition: "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)",
                    zIndex: 9999,
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    paddingTop: "0.5rem"
                }}
            >
                {/* Drag Handle / Indicator */}
                <div
                    onClick={onClose}
                    style={{
                        width: "32px",
                        height: "3px",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        borderRadius: "100px",
                        alignSelf: "center",
                        marginTop: "8px",
                        marginBottom: "2px",
                        cursor: "pointer",
                        flexShrink: 0
                    }}
                />

                {/* Header */}
                <div style={{
                    padding: "0.75rem 1.25rem 0.5rem 1.25rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexShrink: 0
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        fontFamily: "var(--font-serif)",
                        color: "rgba(255,255,255,0.95)",
                        letterSpacing: "-0.02em"
                    }}>
                        Library
                    </h3>

                    <div
                        onClick={onClose}
                        style={{
                            padding: "6px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.08)",
                            cursor: "pointer",
                            display: "flex",
                            transition: "background 0.2s"
                        }}
                    >
                        <X size={16} color="rgba(255,255,255,0.7)" />
                    </div>
                </div>

                {/* List */}
                <div
                    ref={scrollRef}
                    className="no-scrollbar"
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "0 0.5rem 1rem 0.5rem", // Tighter padding
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px" // Minimal gap
                    }}
                >
                    {PLAYLIST.map((song, index) => {
                        const isActive = song.title === currentSongTitle;

                        return (
                            <div
                                key={index}
                                id={isActive ? "active-song-item" : undefined}
                                onClick={() => onPlaySong(index)}
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
                                        String(index + 1).padStart(2, '0')
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
                    })}
                </div>
            </div>
            <style>{`
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </>
    );
}
