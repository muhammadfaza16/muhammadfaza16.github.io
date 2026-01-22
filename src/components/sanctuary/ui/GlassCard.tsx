"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    accentColor?: string; // e.g., "#10b981" or "var(--accent)"
    className?: string;
    style?: React.CSSProperties;
}

export function GlassCard({ children, accentColor = "var(--accent)", className = "", style, ...props }: GlassCardProps) {
    return (
        <motion.div
            className={`group relative overflow-hidden rounded-[1.5rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-md transition-all duration-500 hover:bg-[rgba(255,255,255,0.04)] ${className}`}
            style={{
                boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                "--widget-accent": accentColor,
                ...style
            } as React.CSSProperties}
            {...props}
        >
            {/* Dynamic Bloom Effect */}
            <div
                className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 opacity-10 group-hover:opacity-20"
                style={{
                    background: `radial-gradient(circle at 50% 0%, ${accentColor}, transparent 70%)`
                }}
            />

            {/* Content Wrapper */}
            <div className="relative z-10 h-full" style={{ padding: "clamp(1.5rem, 4vw, 2rem)" }}>
                {children}
            </div>
        </motion.div>
    );
}
