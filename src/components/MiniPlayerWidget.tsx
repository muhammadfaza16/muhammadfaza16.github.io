"use client";

import { useState, useRef, useEffect } from "react";
import { useAudio } from "@/components/AudioContext";
import { useZen } from "@/components/ZenContext";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Disc, Music2, SkipBack, SkipForward } from "lucide-react";

interface MiniPlayerProps {
    style?: React.CSSProperties;
}

export function MiniPlayerWidget({ style: customStyle }: MiniPlayerProps) {
    const { isPlaying, togglePlay, currentSong, hasInteracted, queue, currentIndex, nextSong, prevSong, activePlaylistId, isMiniPlayerDismissed, setMiniPlayerDismissed, isBuffering, activePlaybackMode } = useAudio();
    const { isZen, setZen } = useZen();
    const router = useRouter();
    const pathname = usePathname();

    const prevSongTitle = useRef(currentSong.title);

    // Check if on home page for full-width version
    const isHomePage = pathname === "/";

    // Reset dismissal if song changes
    useEffect(() => {
        if (prevSongTitle.current !== currentSong.title) {
            setMiniPlayerDismissed(false);
            prevSongTitle.current = currentSong.title;
        }
    }, [currentSong.title]);

    // Only show if user has started playing something or interacted
    // HIDE on Radio page to maintain isolation
    // UX-4: Hide when CurrentlyStrip is visible on home, when radio active, or on radio page
    if (!hasInteracted || isMiniPlayerDismissed || activePlaybackMode === 'radio' || pathname === "/starlight/radio" || pathname === "/") return null;

    // Split title for artist/song
    const parts = currentSong.title.split("—");
    const artist = parts[0]?.trim() || "Unknown Artist";
    const song = parts[1]?.trim() || currentSong.title;

    // Check if playing from a playlist (more than 1 song in queue)
    const isPlaylistMode = queue.length > 1;
    const playlistProgress = isPlaylistMode ? `${currentIndex + 1}/${queue.length}` : null;

    // ========== HOME PAGE: Full Width with All Controls ==========
    if (isHomePage) {
        return (
            <AnimatePresence>
                {!isZen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.4, type: "spring" }}
                        style={{
                            padding: "0 1.5rem",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            zIndex: 20,
                            position: "relative",
                            ...customStyle
                        }}
                    >
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.7}
                            onDragEnd={(e, info) => {
                                if (Math.abs(info.offset.x) > 120) {
                                    setMiniPlayerDismissed(true);
                                }
                            }}
                            style={{
                                width: "100%",
                                maxWidth: "420px",
                                background: "transparent",
                                backdropFilter: "none",
                                WebkitBackdropFilter: "none",
                                border: "none",
                                borderRadius: "16px",
                                padding: "8px 12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                boxShadow: "none",
                                cursor: "grab",
                                touchAction: "none"
                            }}
                            whileTap={{ cursor: "grabbing" }}
                            onClick={() => {
                                if (activePlaylistId) {
                                    router.push(`/playlist/${activePlaylistId}`);
                                } else {
                                    router.push("/playlist/all");
                                }
                            }}
                        >
                            {/* Rotating Disk */}
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #FFD60A, #FF9F0A)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                boxShadow: isPlaying ? "0 0 16px rgba(255, 214, 10, 0.5)" : "none",
                                animation: isBuffering ? "pulse-buffering 1.2s ease-in-out infinite" : "none"
                            }}>
                                <style dangerouslySetInnerHTML={{ __html: `@keyframes pulse-buffering { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }` }} />
                                <motion.div
                                    animate={{ rotate: isPlaying ? 360 : 0 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    <Disc size={20} color="rgba(0,0,0,0.7)" />
                                </motion.div>
                            </div>

                            {/* Text Info */}
                            <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
                                <div style={{
                                    fontFamily: "-apple-system, sans-serif",
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    color: "var(--ink-primary, #1c211a)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    marginBottom: "2px"
                                }}>
                                    {song}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{
                                        fontSize: "0.72rem",
                                        color: "var(--ink-muted, #5e6b5a)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }}>
                                        {artist}
                                    </span>
                                    {isPlaylistMode && (
                                        <span style={{
                                            fontSize: "0.7rem",
                                            color: "#FFD60A",
                                            fontWeight: 500,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            flexShrink: 0
                                        }}>
                                            <Music2 size={11} />
                                            {playlistProgress}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Full Controls */}
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }} onClick={(e) => e.stopPropagation()}>
                                {/* Prev */}
                                <div
                                    onClick={(e) => { e.stopPropagation(); prevSong(); }}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90 cursor-pointer"
                                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    <SkipBack size={16} fill="var(--ink-primary, #1c211a)" color="var(--ink-primary, #1c211a)" />
                                </div>

                                {/* Play/Pause */}
                                <div
                                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                    style={{
                                        width: "34px",
                                        height: "34px",
                                        borderRadius: "50%",
                                        background: "rgba(0,0,0,0.08)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "var(--ink-primary, #1c211a)"
                                    }}
                                    className="hover:bg-black/15 active:scale-90"
                                >
                                    {isPlaying ? <Pause size={15} fill="var(--ink-primary, #1c211a)" /> : <Play size={15} fill="var(--ink-primary, #1c211a)" style={{ marginLeft: "2px" }} />}
                                </div>

                                {/* Next */}
                                <div
                                    onClick={(e) => { e.stopPropagation(); nextSong(); }}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90 cursor-pointer"
                                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    <SkipForward size={16} fill="var(--ink-primary, #1c211a)" color="var(--ink-primary, #1c211a)" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // ========== OTHER PAGES: Compact Bottom-Right ==========
    return (
        <AnimatePresence>
            {!isZen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 30 }}
                    style={{
                        position: "fixed",
                        bottom: "min(24px, env(safe-area-inset-bottom, 24px))",
                        left: "0",
                        right: "0",
                        zIndex: 50,
                        display: "flex",
                        justifyContent: "center",
                        padding: "0 24px",
                        boxSizing: "border-box",
                        pointerEvents: "none",
                        ...customStyle
                    }}
                >
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.5}
                        onDragEnd={(e, info) => {
                            if (info.offset.x > 80) {
                                setMiniPlayerDismissed(true);
                            }
                        }}
                        style={{
                            pointerEvents: "auto",
                            background: isPlaying ? "rgba(10, 10, 12, 0.65)" : "rgba(20, 20, 22, 0.5)",
                            backdropFilter: "blur(24px) saturate(180%)",
                            WebkitBackdropFilter: "blur(24px) saturate(180%)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
                            borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
                            borderRadius: "24px",
                            padding: "10px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            boxShadow: isPlaying
                                ? "0 12px 32px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 214, 10, 0.05)"
                                : "0 8px 32px rgba(0, 0, 0, 0.3)",
                            cursor: "pointer",
                            width: "100%",
                            maxWidth: "400px",
                            position: "relative",
                            overflow: "hidden"
                        }}
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(20, 20, 22, 0.75)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            if (activePlaylistId) {
                                router.push(`/playlist/${activePlaylistId}`);
                            } else {
                                router.push("/playlist/all");
                            }
                        }}
                    >
                        {/* Subtle Glow Background */}
                        {isPlaying && (
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "40%",
                                height: "100%",
                                background: "radial-gradient(circle at left, rgba(255, 214, 10, 0.15) 0%, transparent 80%)",
                                pointerEvents: "none"
                            }} />
                        )}

                        {/* Rotating Disk */}
                        <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #FFD60A, #FF9F0A)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: isPlaying ? "0 0 16px rgba(255, 214, 10, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)" : "inset 0 2px 4px rgba(255,255,255,0.3)",
                            animation: isBuffering ? "pulse-buffering 1.2s ease-in-out infinite" : "none",
                            zIndex: 1
                        }}>
                            <motion.div
                                animate={{ rotate: isPlaying ? 360 : 0 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                <Disc size={18} color="rgba(0,0,0,0.7)" />
                            </motion.div>
                        </div>

                        {/* Text Info */}
                        <div style={{ flex: 1, overflow: "hidden", minWidth: 0, zIndex: 1 }}>
                            <div style={{
                                fontFamily: "-apple-system, sans-serif",
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                color: "rgba(255,255,255,0.9)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                marginBottom: "2px",
                                textShadow: isPlaying ? "0 0 8px rgba(255,255,255,0.2)" : "none"
                            }}>
                                {song}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{
                                    fontSize: "0.7rem",
                                    color: isPlaying ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.5)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}>
                                    {artist}
                                </span>
                                {isPlaylistMode && (
                                    <span style={{
                                        fontSize: "0.65rem",
                                        color: "#FFD60A",
                                        fontWeight: 600,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "3px",
                                        flexShrink: 0,
                                        textShadow: "0 0 6px rgba(255,214,10,0.4)"
                                    }}>
                                        <Music2 size={10} />
                                        {playlistProgress}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Play/Pause */}
                        <div
                            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: isPlaying ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                flexShrink: 0,
                                zIndex: 1,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                            }}
                            className="hover:bg-white/25 active:scale-90 transition-colors"
                        >
                            {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" style={{ marginLeft: "2px" }} />}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
