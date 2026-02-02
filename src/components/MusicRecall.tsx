"use client";

import { useAudio } from "@/components/AudioContext";
import { useZen } from "@/components/ZenContext";
import { motion, AnimatePresence } from "framer-motion";
import { Music2 } from "lucide-react";

export function MusicRecall() {
    const { isPlaying, hasInteracted, isMiniPlayerDismissed, setMiniPlayerDismissed } = useAudio();
    const { isZen } = useZen();

    // Only show if:
    // 1. User has interacted (music started)
    // 2. Music is actively playing
    // 3. Mini Player is DISMISSED
    // 4. Not in Zen mode (Zen has its own controls)
    const shouldShow = hasInteracted && isPlaying && isMiniPlayerDismissed && !isZen;

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMiniPlayerDismissed(false)}
                    style={{
                        padding: "8px 12px",
                        background: "rgba(255, 214, 10, 0.15)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 214, 10, 0.3)",
                        borderRadius: "100px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        pointerEvents: "auto",
                        color: "#FFD60A",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(255, 214, 10, 0.15)"
                    }}
                >
                    <Music2 size={14} className="animate-pulse" />
                    <span>Now Playing</span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
