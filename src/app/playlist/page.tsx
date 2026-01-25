"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { GradientOrb } from "@/components/GradientOrb";
import { CosmicStars } from "@/components/CosmicStars";
import { MilkyWay } from "@/components/MilkyWay";
import { CurrentlyStrip } from "@/components/CurrentlyStrip";
import { useAudio } from "@/components/AudioContext";

export default function ImmersiveMusicPage() {
    const { isPlaying, togglePlay } = useAudio();

    // Auto-play on mount if not already playing
    useEffect(() => {
        if (!isPlaying) {
            const timer = setTimeout(() => {
                togglePlay();
            }, 800); // Slight delay for smooth entrance
            return () => clearTimeout(timer);
        }
    }, [isPlaying, togglePlay]);

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        header, footer, .zen-toggle-floating { display: none !important; }
        #main-content { padding-top: 0 !important; }
        html, body { overflow: hidden !important; overscroll-behavior: none; }
      `}} />



            {/* Ambient Background */}
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

            <main style={{
                position: "relative",
                zIndex: 10,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center", // Center the player
                padding: "2rem"
            }}>
                {/* The Immersive Player (CurrentlyStrip) */}
                {/* We scale it up slightly since it's the main focus here */}
                <div style={{
                    width: "100%",
                    maxWidth: "500px",
                    transform: "scale(1.1)", // Slightly larger for immersive feel
                }}>
                    <CurrentlyStrip />
                </div>
            </main>
        </>
    );
}
