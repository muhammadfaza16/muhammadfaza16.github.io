"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useAudio } from "@/components/AudioContext";
import { useRadio } from "@/components/RadioContext";

interface AtmosphericBackgroundProps {
    children?: React.ReactNode;
    variant?: string;
}

export function AtmosphericBackground({ children, variant }: AtmosphericBackgroundProps) {
    const { isPlaying: musicPlaying, activePlaybackMode } = useAudio();
    const { isRadioPaused, activeStationId, stations } = useRadio();

    // Determine current color vibe based on what's playing
    const activeVibe = useMemo(() => {
        // Fallback to variant color or a chill deep blue/purple if nothing playing
        let baseColor = "rgba(40, 45, 60, 0.4)";
        if (variant === "sage") baseColor = "rgba(45, 60, 50, 0.4)";
        else if (variant === "warm") baseColor = "rgba(65, 45, 40, 0.4)";
        else if (variant === "slate") baseColor = "rgba(40, 40, 45, 0.4)";

        if (activePlaybackMode === "music" && musicPlaying) {
            // A warm golden/peach vibe for general music
            return "rgba(180, 110, 60, 0.5)";
        }

        if (activePlaybackMode === "radio" && activeStationId && !isRadioPaused) {
            // Radio station specific aura
            const activeStation = stations.find(s => s.id === activeStationId);
            if (activeStation) {
                // Convert #RRGGBB to rgba to soften it
                return activeStation.themeColor;
            }
        }

        return baseColor; // default ambient
    }, [musicPlaying, activePlaybackMode, isRadioPaused, activeStationId, stations, variant]);

    return (
        <>
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: -1,
                background: "#0a0a0c", // Deep premium dark base
                overflow: "hidden",
                pointerEvents: "none"
            }}>
                {/* Primary soft gradient wash */}
                <motion.div
                    animate={{
                        background: `radial-gradient(circle at 50% 40%, ${activeVibe} 0%, transparent 70%)`,
                        opacity: (musicPlaying || (!isRadioPaused && activePlaybackMode === "radio")) ? 0.8 : 0.4
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    style={{
                        position: "absolute",
                        inset: "-20%",
                        filter: "blur(60px) saturate(150%)",
                    }}
                />

                {/* Ambient drifting orb 1 */}
                <motion.div
                    animate={{
                        x: ["0%", "10%", "-10%", "0%"],
                        y: ["0%", "-15%", "5%", "0%"],
                        scale: [1, 1.1, 0.9, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: "absolute",
                        top: "10%",
                        left: "20%",
                        width: "40vw",
                        height: "40vw",
                        borderRadius: "50%",
                        background: `radial-gradient(ellipse at center, ${activeVibe}40 0%, transparent 60%)`,
                        filter: "blur(80px)",
                    }}
                />

                {/* Ambient drifting orb 2 */}
                <motion.div
                    animate={{
                        x: ["0%", "-15%", "10%", "0%"],
                        y: ["0%", "10%", "-10%", "0%"],
                        scale: [0.9, 1.2, 0.8, 0.9],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
                    style={{
                        position: "absolute",
                        bottom: "-10%",
                        right: "10%",
                        width: "50vw",
                        height: "30vw",
                        borderRadius: "50%",
                        background: `radial-gradient(ellipse at center, ${activeVibe}30 0%, transparent 60%)`,
                        filter: "blur(90px)",
                    }}
                />

                {/* The noise layer for texture */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.04,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    mixBlendMode: "overlay"
                }} />
            </div>
            {/* Render children normally without squashing them into the fixed z-index -1 container */}
            {children}
        </>
    );
}
