"use client";

import { useEffect, useRef, useMemo } from "react";
import { useAudio } from "./AudioContext";
import { useZen } from "./ZenContext";
import { SONG_THEMES, DEFAULT_THEME } from "../data/songThemes";

export function GradientOrb() {
    const primaryRef = useRef<HTMLDivElement>(null);
    const secondaryRef = useRef<HTMLDivElement>(null);
    const tertiaryRef = useRef<HTMLDivElement>(null);
    const bottomLeftRef = useRef<HTMLDivElement>(null);
    const bottomRightRef = useRef<HTMLDivElement>(null);

    const { isPlaying, currentSong, analyser } = useAudio();
    const { isZen } = useZen();
    const isPlayingRef = useRef(isPlaying);
    const isZenRef = useRef(isZen);
    const analyserRef = useRef(analyser); // Ref for loop access

    // Get current theme based on song title
    const theme = useMemo(() => {
        if (!currentSong) return DEFAULT_THEME;
        return SONG_THEMES[currentSong.title] || DEFAULT_THEME;
    }, [currentSong]);

    // Keep refs in sync without restarting effect
    useEffect(() => {
        isPlayingRef.current = isPlaying;
        isZenRef.current = isZen;
        analyserRef.current = analyser;
    }, [isPlaying, isZen, analyser]);

    useEffect(() => {
        let animationId: number;
        let time = 0;

        // Data buffer for audio analysis
        // We assume fftSize=64 (set in AudioContext), so frequencyBinCount is 32.
        const dataArray = new Uint8Array(32);
        let bassSmoothed = 0; // Smoothed value for scale interpolation

        const animate = () => {
            // Dynamic speed control
            const zenActive = isZenRef.current;
            const playing = isPlayingRef.current;

            const speed = zenActive ? 0.03 : (playing ? 0.025 : 0.015);
            time += speed;

            // Amplitude multiplier
            const amp = zenActive ? 1.8 : (playing ? 1.4 : 1.0);

            // Audio Reactive Scaling Calculation
            let currentScaleBoost = 0;

            if (playing && analyserRef.current) {
                // Get real-time frequency data
                analyserRef.current.getByteFrequencyData(dataArray);

                // Bass is usually in the lowest bins. With fftSize=64, bin 0 covers ~0-600Hz.
                // We'll trust bin 0 for the "Kick/Thump" factor.
                const bassEnergy = dataArray[0];

                // Normalize 0-255 to 0.0-1.0
                const targetBoost = (bassEnergy / 255);

                // Smooth interpolation (Attack fast, release slow-ish)
                bassSmoothed += (targetBoost - bassSmoothed) * 0.2;

                // Max scale impact: +30% size on max bass
                currentScaleBoost = bassSmoothed * 0.3;
            } else {
                // Simulated breathing when not playing/no analyzer
                // Keeping it subtle
                const breathFreq = playing ? 0.4 : 0.4;
                const breathAmp = playing ? 0.15 : 0.1;
                // Since 'playing' implies we SHOULD have analyzer, this fallback is mostly for paused state
                currentScaleBoost = Math.sin(time * breathFreq) * breathAmp;

                // Reset smoother so it doesn't jump when song starts
                if (!playing) bassSmoothed = 0;
            }

            // Apply transforms
            if (primaryRef.current) {
                const x = (Math.sin(time * 0.5) * 40 + Math.cos(time * 0.3) * 30 + Math.sin(time * 0.7) * 20) * amp;
                const y = (Math.cos(time * 0.4) * 40 + Math.sin(time * 0.2) * 30) * amp;

                const scale = 1 + currentScaleBoost;
                const rotate = time * 20;
                primaryRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
            }

            if (secondaryRef.current) {
                const x = (Math.cos(time * 0.3) * 50 + Math.sin(time * 0.5) * 40) * amp;
                const y = (Math.sin(time * 0.4) * 50 + Math.cos(time * 0.2) * 30 + Math.sin(time * 0.6) * 10) * amp;

                // Secondary slightly offset or different reaction? For now sync is cleaner.
                const scale = 1 + (currentScaleBoost * 0.8); // Slightly less reactive
                const rotate = Math.sin(time * 0.2) * 30 - time * 10;
                secondaryRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
            }

            if (tertiaryRef.current) {
                const x = (Math.sin(time * 0.4) * 60 + Math.cos(time * 0.6) * 20) * amp;
                const y = (Math.cos(time * 0.3) * 60 + Math.sin(time * 0.5) * 50) * amp;

                const scale = 1 + (currentScaleBoost * 1.1); // More reactive
                const rotate = Math.cos(time * 0.1) * 40 + time * 15;
                tertiaryRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
            }

            // Bottom left orb
            if (bottomLeftRef.current) {
                const x = (Math.sin(time * 0.35) * 50 + Math.cos(time * 0.25) * 30) * amp;
                const y = (Math.cos(time * 0.45) * 40 + Math.sin(time * 0.35) * 20) * amp;

                const scale = 1 + (currentScaleBoost * 0.9);
                const rotate = -time * 8;
                bottomLeftRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
            }

            // Bottom right orb
            if (bottomRightRef.current) {
                const x = (Math.cos(time * 0.4) * 45 + Math.sin(time * 0.55) * 25) * amp;
                const y = (Math.sin(time * 0.35) * 35 + Math.cos(time * 0.45) * 25) * amp;

                const scale = 1 + currentScaleBoost;
                const rotate = time * 12;
                bottomRightRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationId);
    }, []); // Empty deps because we use refs for latest values

    return (
        <>
            {/* Primary Orb - Large fluid blob */}
            <div
                ref={primaryRef}
                aria-hidden="true"
                className="gradient-orb-primary"
                style={{
                    position: "absolute",
                    top: "10%",
                    left: "20%",
                    width: "clamp(300px, 70vw, 600px)",
                    height: "clamp(300px, 70vw, 600px)",
                    background: `radial-gradient(ellipse at 30% 30%, ${theme.primary} 0%, rgba(139,92,246,0.2) 40%, rgba(168,85,247,0.08) 70%, transparent 100%)`, // Mixing dynamic primary with static base for depth
                    filter: "blur(45px)",
                    opacity: 0.7,
                    animation: "blobMorph 10s ease-in-out infinite",
                    pointerEvents: "none",
                    zIndex: 0,
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    willChange: "transform",
                    transition: "background 1s ease-in-out"
                }}
            />

            {/* Secondary Orb - Warm accent */}
            <div
                ref={secondaryRef}
                aria-hidden="true"
                className="gradient-orb-secondary"
                style={{
                    position: "absolute",
                    top: "30%",
                    right: "10%",
                    width: "clamp(200px, 50vw, 400px)",
                    height: "clamp(200px, 50vw, 400px)",
                    background: `radial-gradient(ellipse at 60% 40%, ${theme.secondary} 0%, rgba(251,146,60,0.15) 45%, rgba(234,179,8,0.05) 80%, transparent 100%)`,
                    filter: "blur(50px)",
                    opacity: 0.65,
                    animation: "blobMorph 14s ease-in-out infinite reverse",
                    pointerEvents: "none",
                    zIndex: 0,
                    borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%",
                    willChange: "transform",
                    transition: "background 1s ease-in-out"
                }}
            />

            {/* Tertiary Orb - Subtle cyan accent */}
            <div
                ref={tertiaryRef}
                aria-hidden="true"
                className="gradient-orb-tertiary"
                style={{
                    position: "absolute",
                    top: "20%",
                    right: "25%",
                    width: "clamp(150px, 35vw, 280px)",
                    height: "clamp(150px, 35vw, 280px)",
                    background: `radial-gradient(ellipse at 50% 50%, ${theme.tertiary} 0%, rgba(56,189,248,0.12) 50%, transparent 100%)`,
                    filter: "blur(40px)",
                    opacity: 0.6,
                    animation: "blobMorph 18s ease-in-out infinite",
                    pointerEvents: "none",
                    zIndex: 0,
                    borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%",
                    willChange: "transform",
                    transition: "background 1s ease-in-out"
                }}
            />

            {/* Bottom Left Orb - Warm pink/magenta */}
            <div
                ref={bottomLeftRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    bottom: "10%",
                    left: "5%",
                    width: "clamp(180px, 40vw, 350px)",
                    height: "clamp(180px, 40vw, 350px)",
                    background: `radial-gradient(ellipse at 40% 60%, ${theme.secondary} 0%, rgba(219,39,119,0.15) 45%, rgba(190,24,93,0.05) 80%, transparent 100%)`,
                    filter: "blur(45px)",
                    opacity: 0.55,
                    animation: "blobMorph 16s ease-in-out infinite",
                    pointerEvents: "none",
                    zIndex: 0,
                    borderRadius: "55% 45% 60% 40% / 45% 55% 45% 55%",
                    willChange: "transform",
                    transition: "background 1s ease-in-out"
                }}
            />

            {/* Bottom Right Orb - Teal/emerald */}
            <div
                ref={bottomRightRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    bottom: "15%",
                    right: "10%",
                    width: "clamp(150px, 35vw, 300px)",
                    height: "clamp(150px, 35vw, 300px)",
                    background: `radial-gradient(ellipse at 50% 50%, ${theme.primary} 0%, rgba(16,185,129,0.15) 50%, transparent 100%)`,
                    filter: "blur(40px)",
                    opacity: 0.5,
                    animation: "blobMorph 20s ease-in-out infinite reverse",
                    pointerEvents: "none",
                    zIndex: 0,
                    borderRadius: "45% 55% 50% 50% / 55% 45% 55% 45%",
                    willChange: "transform",
                    transition: "background 1s ease-in-out"
                }}
            />
        </>
    );
}
