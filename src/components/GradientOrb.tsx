"use client";

import { useEffect, useRef } from "react";
import { useAudio } from "./AudioContext";

export function GradientOrb() {
    const primaryRef = useRef<HTMLDivElement>(null);
    const secondaryRef = useRef<HTMLDivElement>(null);
    const tertiaryRef = useRef<HTMLDivElement>(null);

    const { isPlaying } = useAudio();
    const isPlayingRef = useRef(isPlaying);

    // Keep ref in sync without restarting effect
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        let animationId: number;
        let time = 0;

        const animate = () => {
            // Dynamic speed control
            // default: 0.015 (was 0.008) -> faster base movement
            // playing: 0.025 -> energetic but smooth
            const speed = isPlayingRef.current ? 0.025 : 0.015;
            time += speed;

            // Amplitude multiplier
            const amp = isPlayingRef.current ? 1.4 : 1.0;

            if (primaryRef.current) {
                // Large slow movements
                const x = (Math.sin(time * 0.5) * 40 + Math.cos(time * 0.3) * 30 + Math.sin(time * 0.7) * 20) * amp;
                const y = (Math.cos(time * 0.4) * 40 + Math.sin(time * 0.2) * 30) * amp;
                // Subtle scale pulsing - deeper breathe when playing
                const scaleAmp = isPlayingRef.current ? 0.15 : 0.1;
                const scale = 1 + Math.sin(time * 0.4) * scaleAmp;
                // Slow rotation
                const rotate = time * 20;
                primaryRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
            }

            if (secondaryRef.current) {
                const x = (Math.cos(time * 0.3) * 50 + Math.sin(time * 0.5) * 40) * amp;
                const y = (Math.sin(time * 0.4) * 50 + Math.cos(time * 0.2) * 30 + Math.sin(time * 0.6) * 10) * amp;
                const scaleAmp = isPlayingRef.current ? 0.15 : 0.1;
                const scale = 1 + Math.cos(time * 0.3) * scaleAmp;
                const rotate = Math.sin(time * 0.2) * 30 - time * 10;
                secondaryRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
            }

            if (tertiaryRef.current) {
                const x = (Math.sin(time * 0.4) * 60 + Math.cos(time * 0.6) * 20) * amp;
                const y = (Math.cos(time * 0.3) * 60 + Math.sin(time * 0.5) * 50) * amp;
                const scaleAmp = isPlayingRef.current ? 0.2 : 0.15;
                const scale = 1 + Math.sin(time * 0.5) * scaleAmp;
                const rotate = Math.cos(time * 0.1) * 40 + time * 15;
                tertiaryRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <>
            {/* Primary Orb - The Void/Deep Space (Deep Violet/Blue) */}
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
                    // New Galaxy Gradient: Deep Purple -> Midnight -> Transparent
                    background: "radial-gradient(ellipse at 30% 30%, rgba(124, 58, 237, 0.45) 0%, rgba(76, 29, 149, 0.35) 40%, rgba(15, 23, 42, 0.2) 70%, transparent 100%)",
                    filter: "blur(60px)", // Increased blur for gas effect
                    opacity: 0.8,
                    animation: "blobMorph 10s ease-in-out infinite",
                    pointerEvents: "none",
                    zIndex: 0,
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    willChange: "transform",
                    mixBlendMode: "screen" // Better blending for galaxy look
                }}
            />

            {/* Secondary Orb - Nebula Gas (Electric Cyan/Blue) */}
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
                    // New Galaxy Gradient: Cyan -> Blue -> Transparent
                    background: "radial-gradient(ellipse at 60% 40%, rgba(6, 182, 212, 0.35) 0%, rgba(59, 130, 246, 0.25) 45%, rgba(30, 64, 175, 0.1) 80%, transparent 100%)",
                    filter: "blur(65px)",
                    opacity: 0.7,
                    animation: "blobMorph 14s ease-in-out infinite reverse",
                    pointerEvents: "none",
                    zIndex: 0,
                    borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%",
                    willChange: "transform",
                    mixBlendMode: "screen"
                }}
            />

            {/* Tertiary Orb - Star Dust (Magenta/Pink) */}
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
                    // New Galaxy Gradient: Pink -> Purple -> Transparent
                    background: "radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.3) 0%, rgba(192, 38, 211, 0.2) 50%, transparent 100%)",
                    filter: "blur(55px)",
                    opacity: 0.65,
                    animation: "blobMorph 18s ease-in-out infinite",
                    pointerEvents: "none",
                    zIndex: 0,
                    borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%",
                    willChange: "transform",
                    mixBlendMode: "screen"
                }}
            />
        </>
    );
}
