"use client";

import { useEffect, useRef } from "react";
import { useAudio } from "./AudioContext";
import { useZen } from "./ZenContext";

interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
    baseOpacity: number;
    speedX: number;
    speedY: number;
    color: string;
    twinkleSpeed: number;
    twinklePhase: number;
}

export function CosmicStars() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { isPlaying } = useAudio();
    const { isZen } = useZen();
    const isPlayingRef = useRef(isPlaying);
    const isZenRef = useRef(isZen);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
        isZenRef.current = isZen;
    }, [isPlaying, isZen]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        let stars: Star[] = [];
        let animationId: number;

        const starColors = [
            "#FFFFFF", // Pure white
            "#F8F8FF", // Ghost white (cool)
            "#FFFACD", // Lemon chiffon (warm)
            "#E0FFFF", // Light cyan (cool)
            "#FFE4E1", // Misty rose (warm)
        ];

        const createStars = () => {
            const area = width * height;
            // Mobile-focused optimization: Cap stars at 100 to prevent battery drain on high-DPI screens
            const count = Math.min(Math.floor(area / 4000), 100);
            const newStars: Star[] = [];

            for (let i = 0; i < count; i++) {
                newStars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() < 0.9 ? Math.random() * 0.8 + 0.4 : Math.random() * 1.2 + 0.8, // Slightly smaller
                    baseOpacity: Math.random() * 0.4 + 0.05, // Range 0.05 to 0.45
                    opacity: 0, // Initial value
                    // INCREASED SPEED: Base speed doubled from 0.05 to 0.1
                    speedX: (Math.random() - 0.5) * 0.1,
                    speedY: (Math.random() - 0.5) * 0.1,
                    color: starColors[Math.floor(Math.random() * starColors.length)],
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    twinklePhase: Math.random() * Math.PI * 2,
                });
            }
            return newStars;
        };

        stars = createStars();

        // Store previous width to detect horizontal resize
        let prevWidth = width;

        const resize = () => {
            const newWidth = canvas.offsetWidth;
            const newHeight = canvas.offsetHeight;

            // Update canvas dimensions
            width = canvas.width = newWidth;
            height = canvas.height = newHeight;

            // Only regenerate stars if WIDTH changes (e.g. device rotation, window resize)
            // If only height changes (mobile address bar), keep existing stars to prevent jarring jumps
            if (newWidth !== prevWidth) {
                stars = createStars();
                prevWidth = newWidth;
            }
        };

        window.addEventListener("resize", resize);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Re-check playing status inside the loop
            const playing = isPlayingRef.current;
            const zenActive = isZenRef.current;

            // Zen mode: even faster and brighter
            const speedMultiplier = zenActive ? 5.0 : (playing ? 3.5 : 1.0);
            const twinkleMultiplier = zenActive ? 3.0 : (playing ? 2.0 : 1.0);
            const opacityBoost = zenActive ? 0.3 : 0;

            stars.forEach((star) => {
                // Update position with multiplier
                star.x += star.speedX * speedMultiplier;
                star.y += star.speedY * speedMultiplier;

                // Wrap around screen
                if (star.x < 0) star.x = width;
                if (star.x > width) star.x = 0;
                if (star.y < 0) star.y = height;
                if (star.y > height) star.y = 0;

                // Update twinkle
                star.twinklePhase += star.twinkleSpeed * twinkleMultiplier;
                star.opacity = star.baseOpacity + opacityBoost + Math.sin(star.twinklePhase) * 0.15;

                // Clamp opacity
                if (star.opacity < 0) star.opacity = 0;
                if (star.opacity > 1) star.opacity = 1;

                // Draw
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.globalAlpha = star.opacity;
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0, // Behind content, but verify vs GradientOrb
                // mixBlendMode removed for mobile performance (reduces compositor load)
            }}
            aria-hidden="true"
        />
    );
}
