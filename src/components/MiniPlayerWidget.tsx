"use client";

import { useState, useRef, useEffect } from "react";
import { useAudio } from "@/components/AudioContext";
import { useZen } from "@/components/ZenContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Disc, SkipBack, SkipForward } from "lucide-react";

interface MiniPlayerProps {
    style?: React.CSSProperties;
}

export function MiniPlayerWidget({ style: customStyle }: MiniPlayerProps) {
    const { isPlaying, togglePlay, currentSong, hasInteracted, nextSong, prevSong } = useAudio();
    const { isZen, setZen } = useZen();
    const router = useRouter();

    const [isDismissed, setIsDismissed] = useState(false);
    const prevSongTitle = useRef(currentSong.title);

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
                        zIndex: 20, // Above standard content
                        position: "relative",
                        ...customStyle
                    }}
                >
                    {/* Background Dismiss Icon */}
                    <div style={{
                        position: "absolute",
                        inset: "0 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 2rem",
                        zIndex: 0,
                        opacity: 0.5,
                        color: "white"
                    }}>
                        <SkipBack size={24} opacity={0.3} />
                        <SkipForward size={24} opacity={0.3} />
                    </div>

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
                            maxWidth: "420px", // Match Grid width
                            background: "rgba(25, 25, 25, 0.6)", // Darker glass
                            backdropFilter: "blur(16px) saturate(180%)",
                            WebkitBackdropFilter: "blur(16px) saturate(180%)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "20px",
                            padding: "0.75rem 1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                            cursor: "grab",
                            zIndex: 1,
                            touchAction: "none"
                        }}
                        whileTap={{ cursor: "grabbing" }}
                        onClick={() => {
                            setZen(true);
                            router.push("/playlist");
                        }} // Go to Zen Mode AND Playlist Page
                    >
                        {/* Rotating Disk / Icon */}
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #FFD60A, #FF9F0A)", // Gold Theme
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative"
                        }}>
                            {/* ... same internal content ... */}
                            <motion.div
                                animate={{ rotate: isPlaying ? 360 : 0 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                <Disc size={20} color="rgba(255,255,255,0.8)" />
                            </motion.div>
                        </div>

                        {/* Text Info */}
                        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{
                                fontFamily: "-apple-system, sans-serif",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                color: "white",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                {song}
                            </span>
                            <span style={{
                                fontSize: "0.75rem",
                                color: "rgba(255,255,255,0.5)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                {artist}
                            </span>
                        </div>

                        {/* Controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                            {/* Prev */}
                            <div
                                onClick={(e) => { e.stopPropagation(); prevSong(); }}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90 cursor-pointer"
                                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                <SkipBack size={20} fill="white" className="text-white/80" />
                            </div>

                            {/* Play/Pause */}
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePlay();
                                }}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    transition: "background 0.2s"
                                }}
                                className="hover:bg-white/20 active:scale-90"
                            >
                                {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-1" />}
                            </div>

                            {/* Next */}
                            <div
                                onClick={(e) => { e.stopPropagation(); nextSong(); }}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90 cursor-pointer"
                                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                <SkipForward size={20} fill="white" className="text-white/80" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
