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

            {/* Bottom Sheet Drawer */}
            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "65vh",
                    maxHeight: "65vh",
                    backgroundColor: "rgba(22, 22, 24, 0.95)",
                    backdropFilter: "blur(40px) saturate(180%)",
                    WebkitBackdropFilter: "blur(40px) saturate(180%)",
                    borderTopLeftRadius: "28px",
                    borderTopRightRadius: "28px",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
                    transform: isOpen ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)",
                    zIndex: 9999,
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    paddingTop: "0.5rem"
                }}
            >
                {/* Drag Handle */}
                <div
                    onClick={onClose}
                    style={{
                        width: "36px",
                        height: "4px",
                        backgroundColor: "rgba(255,255,255,0.25)",
                        borderRadius: "100px",
                        alignSelf: "center",
                        marginTop: "12px",
                        marginBottom: "4px",
                        cursor: "pointer",
                        flexShrink: 0
                    }}
                />

                {/* Header */}
                <div style={{
                    padding: "1rem 1.5rem 0.5rem 1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexShrink: 0
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: "1.75rem",
                        fontWeight: 600,
                        fontFamily: "var(--font-serif)",
                        color: "#fff"
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
                            display: "flex"
                        }}
                    >
                        <X size={18} color="rgba(255,255,255,0.8)" />
                    </div>
                </div>

                {/* List */}
                <div
                    ref={scrollRef}
                    className="no-scrollbar"
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "0 1rem 3rem 1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px"
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
                                    padding: "10px 12px",
                                    borderRadius: "12px",
                                    backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                                    cursor: "pointer",
                                    transition: "background 0.2s"
                                }}
                            >
                                <div style={{
                                    width: "24px",
                                    textAlign: "center",
                                    fontSize: "0.8rem",
                                    color: isActive ? "var(--accent)" : "rgba(255,255,255,0.3)",
                                    fontFamily: "var(--font-mono)"
                                }}>
                                    {isActive && isPlaying ? (
                                        <BarChart2 size={14} style={{ animation: "pulse 2s infinite" }} />
                                    ) : (
                                        String(index + 1).padStart(2, '0')
                                    )}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        color: isActive ? "#fff" : "rgba(255,255,255,0.9)",
                                        fontSize: "0.95rem",
                                        fontWeight: isActive ? 600 : 400,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        fontFamily: "var(--font-sans)"
                                    }}>
                                        {song.title.split("—")[1]?.trim() || song.title}
                                    </div>
                                    <div style={{
                                        fontSize: "0.75rem",
                                        color: "rgba(255,255,255,0.5)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
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
