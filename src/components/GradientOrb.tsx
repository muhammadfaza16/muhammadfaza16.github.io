"use client";

import { useEffect, useRef } from "react";

export function GradientOrb() {
    const primaryRef = useRef<HTMLDivElement>(null);
    const secondaryRef = useRef<HTMLDivElement>(null);
    const tertiaryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationId: number;
        let time = 0;

        const animate = () => {
            time += 0.003; // Slower, more fluid movement

            if (primaryRef.current) {
                // Large slow movements
                const x = Math.sin(time * 0.5) * 40 + Math.cos(time * 0.3) * 30 + Math.sin(time * 0.7) * 20;
                const y = Math.cos(time * 0.4) * 40 + Math.sin(time * 0.2) * 30;
                // Subtle scale pulsing
                const scale = 1 + Math.sin(time * 0.4) * 0.1;
                // Slow rotation
                const rotate = time * 20;
                primaryRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
            }

            if (secondaryRef.current) {
                const x = Math.cos(time * 0.3) * 50 + Math.sin(time * 0.5) * 40;
                const y = Math.sin(time * 0.4) * 50 + Math.cos(time * 0.2) * 30 + Math.sin(time * 0.6) * 10;
                const scale = 1 + Math.cos(time * 0.3) * 0.1;
                const rotate = Math.sin(time * 0.2) * 30 - time * 10;
                secondaryRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
            }

            if (tertiaryRef.current) {
                const x = Math.sin(time * 0.4) * 60 + Math.cos(time * 0.6) * 20;
                const y = Math.cos(time * 0.3) * 60 + Math.sin(time * 0.5) * 50;
                const scale = 1 + Math.sin(time * 0.5) * 0.15;
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
            {/* Primary Orb - Large fluid blob */}
            <div
                ref={primaryRef}
                aria-hidden="true"
                className="gradient-orb-primary"
                style={{
                    position: "absolute",
                    top: "30%",
                    left: "20%",
                    width: "clamp(300px, 70vw, 600px)",
                    height: "clamp(300px, 70vw, 600px)",
                    background: "radial-gradient(ellipse at 30% 30%, rgba(99,102,241,0.35) 0%, rgba(139,92,246,0.2) 40%, rgba(168,85,247,0.08) 70%, transparent 100%)",
                    filter: "blur(50px)",
                    opacity: 0.45,
                    animation: "blobMorph 10s ease-in-out infinite",
                    pointerEvents: "none",
                    zIndex: 0,
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    willChange: "transform"
                }}
            />

            {/* Secondary Orb - Warm accent */}
            <div
                ref={secondaryRef}
                aria-hidden="true"
                className="gradient-orb-secondary"
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "10%",
                    width: "clamp(200px, 50vw, 400px)",
                    height: "clamp(200px, 50vw, 400px)",
                    background: "radial-gradient(ellipse at 60% 40%, rgba(244,114,182,0.3) 0%, rgba(251,146,60,0.15) 45%, rgba(234,179,8,0.05) 80%, transparent 100%)",
                    filter: "blur(55px)",
                    opacity: 0.4,
                    animation: "blobMorph 14s ease-in-out infinite reverse",
                    pointerEvents: "none",
                    zIndex: 0,
                    borderRadius: "40% 60% 70% 30% / 40% 70% 30% 60%",
                    willChange: "transform"
                }}
            />

            {/* Tertiary Orb - Subtle cyan accent */}
            <div
                ref={tertiaryRef}
                aria-hidden="true"
                className="gradient-orb-tertiary"
                style={{
                    position: "absolute",
                    top: "15%",
                    right: "25%",
                    width: "clamp(150px, 35vw, 280px)",
                    height: "clamp(150px, 35vw, 280px)",
                    background: "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.25) 0%, rgba(56,189,248,0.12) 50%, transparent 100%)",
                    filter: "blur(45px)",
                    opacity: 0.3,
                    animation: "blobMorph 18s ease-in-out infinite",
                    pointerEvents: "none",
                    zIndex: 0,
                    borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%",
                    willChange: "transform"
                }}
            />
        </>
    );
}
