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
    const { isPlaying, togglePlay, currentSong, hasInteracted, queue, currentIndex, nextSong, prevSong } = useAudio();
    const { isZen, setZen } = useZen();
    const router = useRouter();
    const pathname = usePathname();

    const [isDismissed, setIsDismissed] = useState(false);
    const prevSongTitle = useRef(currentSong.title);

    // Check if on home page for full-width version
    const isHomePage = pathname === "/";

    // Reset dismissal if song changes
    useEffect(() => {
        if (prevSongTitle.current !== currentSong.title) {
            setIsDismissed(false);
            prevSongTitle.current = currentSong.title;
        }
    }, [currentSong.title]);

    // Only show if user has started playing something or interacted
    if (!hasInteracted || isDismissed) return null;

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
                                    setIsDismissed(true);
                                }
                            }}
                            style={{
                                width: "100%",
                                maxWidth: "420px",
                                background: "rgba(18, 18, 20, 0.9)",
                                backdropFilter: "blur(20px) saturate(180%)",
                                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: "20px",
                                padding: "12px 16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                                cursor: "grab",
                                touchAction: "none"
                            }}
                            whileTap={{ cursor: "grabbing" }}
                            onClick={() => {
                                setZen(true);
                                router.push("/playlist");
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
                                boxShadow: isPlaying ? "0 0 16px rgba(255, 214, 10, 0.5)" : "none"
                            }}>
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
                                    fontSize: "0.9rem",
                                    fontWeight: 600,
                                    color: "white",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    marginBottom: "2px"
                                }}>
                                    {song}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{
                                        fontSize: "0.75rem",
                                        color: "rgba(255,255,255,0.5)",
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
                                    <SkipBack size={18} fill="white" className="text-white/80" />
                                </div>

                                {/* Play/Pause */}
                                <div
                                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "50%",
                                        background: "rgba(255,255,255,0.12)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white"
                                    }}
                                    className="hover:bg-white/20 active:scale-90"
                                >
                                    {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" style={{ marginLeft: "2px" }} />}
                                </div>

                                {/* Next */}
                                <div
                                    onClick={(e) => { e.stopPropagation(); nextSong(); }}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90 cursor-pointer"
                                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    <SkipForward size={18} fill="white" className="text-white/80" />
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
                        bottom: "24px",
                        right: "24px",
                        zIndex: 50,
                        ...customStyle
                    }}
                >
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.5}
                        onDragEnd={(e, info) => {
                            if (info.offset.x > 80) {
                                setIsDismissed(true);
                            }
                        }}
                        style={{
                            background: "rgba(18, 18, 20, 0.92)",
                            backdropFilter: "blur(20px) saturate(180%)",
                            WebkitBackdropFilter: "blur(20px) saturate(180%)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "16px",
                            padding: "10px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                            cursor: "pointer",
                            minWidth: "200px",
                            maxWidth: "280px"
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setZen(true);
                            router.push("/playlist");
                        }}
                    >
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
                            boxShadow: isPlaying ? "0 0 12px rgba(255, 214, 10, 0.4)" : "none"
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
                        <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
                            <div style={{
                                fontFamily: "-apple-system, sans-serif",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: "white",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                marginBottom: "2px"
                            }}>
                                {song}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{
                                    fontSize: "0.7rem",
                                    color: "rgba(255,255,255,0.5)",
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
                                        fontWeight: 500,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "3px",
                                        flexShrink: 0
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
                                background: "rgba(255,255,255,0.12)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                flexShrink: 0
                            }}
                            className="hover:bg-white/20 active:scale-90"
                        >
                            {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" style={{ marginLeft: "2px" }} />}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
