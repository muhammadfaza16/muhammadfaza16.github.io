"use client";

import React from "react";

interface AtmosphericBackgroundProps {
    /** Subtle accent hue shift per page (e.g., "white", "sage", "olive", "warm", "cool") */
    variant?: "white" | "sage" | "olive" | "warm" | "cool";
    children: React.ReactNode;
}

/**
 * AtmosphericBackground — replaces dark cosmic backgrounds (GradientOrb, CosmicStars, MilkyWay)
 * with a soft, tonal atmospheric gradient matching the new Clean White / Sage / Olive design language.
 * 
 * Performance: Pure CSS gradients, no particles, no canvas, no external textures.
 * Mobile-first: Minimal repaints, static background.
 */
export function AtmosphericBackground({ variant = "white", children }: AtmosphericBackgroundProps) {
    const palettes = {
        white: {
            bg: "#ffffff",
            top: "rgba(255, 255, 255, 1)",
            mid: "rgba(248, 249, 250, 1)",
            bottom: "rgba(239, 241, 245, 1)",
            accent: "rgba(0, 122, 255, 0.03)", // Subtle blue tint
            light: "rgba(255, 255, 255, 0.8)",
        },
        sage: {
            bg: "#c2c4b4",
            top: "rgba(195, 200, 180, 0.9)",
            mid: "rgba(175, 178, 158, 0.7)",
            bottom: "rgba(138, 133, 112, 0.85)",
            accent: "rgba(168, 191, 154, 0.12)",
            light: "rgba(220, 225, 210, 0.25)",
        },
        olive: {
            bg: "#b5b8a0",
            top: "rgba(185, 190, 165, 0.9)",
            mid: "rgba(165, 168, 145, 0.7)",
            bottom: "rgba(125, 120, 100, 0.85)",
            accent: "rgba(155, 175, 135, 0.12)",
            light: "rgba(210, 215, 195, 0.25)",
        },
        warm: {
            bg: "#c8c0b0",
            top: "rgba(205, 195, 178, 0.9)",
            mid: "rgba(185, 175, 158, 0.7)",
            bottom: "rgba(145, 135, 118, 0.85)",
            accent: "rgba(201, 185, 144, 0.12)",
            light: "rgba(225, 218, 205, 0.25)",
        },
        cool: {
            bg: "#b8c0b8",
            top: "rgba(188, 198, 188, 0.9)",
            mid: "rgba(168, 178, 170, 0.7)",
            bottom: "rgba(128, 138, 130, 0.85)",
            accent: "rgba(154, 176, 168, 0.12)",
            light: "rgba(215, 222, 215, 0.25)",
        },
    };

    const p = palettes[variant] || palettes.white;

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: p.bg,
            color: "var(--ink-primary, #2d3328)", // Use variable or fallback
            position: "relative",
            overflowX: "hidden",
        }}>
            {/* Atmospheric gradient layer */}
            <div style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                background: `
                    radial-gradient(ellipse at 25% 15%, ${p.light} 0%, transparent 55%),
                    radial-gradient(ellipse at 75% 75%, ${p.accent} 0%, transparent 50%),
                    linear-gradient(180deg, ${p.top} 0%, ${p.mid} 50%, ${p.bottom} 100%)
                `,
            }} />

            {/* Subtle noise grain - reduced opacity for white theme */}
            <div style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
                opacity: variant === 'white' ? 0.2 : 0.4,
            }} />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 1 }}>
                {children}
            </div>
        </div>
    );
}
