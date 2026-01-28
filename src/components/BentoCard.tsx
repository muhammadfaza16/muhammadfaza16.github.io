"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// --- Enhanced Design System ---
export const theme = {
    colors: {
        bg: "#000000",
        // Deeper, richer glass background
        cardBg: "rgba(30, 30, 35, 0.70)",
        cardBorder: "rgba(255, 255, 255, 0.08)",
        cardBorderTop: "rgba(255, 255, 255, 0.25)", // Highlight source from top
        primary: "#FFD60A",
        secondary: "#32D74B",
        accent: "#0A84FF",
        danger: "#FF453A",
        textMain: "rgba(255, 255, 255, 0.98)",
        textMuted: "rgba(255, 255, 255, 0.55)",
        textDim: "rgba(255, 255, 255, 0.22)",
    },
    radii: {
        card: "32px", // Slightly more curvature for that 'Squircle' feel
        pill: "999px",
        sm: "10px",
    },
    shadows: {
        // Multi-layered shadow for depth
        card: `
            0 20px 40px -10px rgba(0,0,0,0.5),
            0 0 0 1px rgba(0,0,0,0.8),
            inset 0 1px 0 rgba(255,255,255,0.15)
        `,
        glow: "0 0 20px -5px",
    }
};

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    colSpanMobile?: number;
    colSpanDesktop?: number;
    delay?: number;
    height?: string; // Added for flexibility
}

export const BentoCard = ({
    children,
    className = "",
    colSpanMobile = 1,
    colSpanDesktop = 1,
    delay = 0,
    height
}: BentoCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 60, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 60, damping: 30 });

    // Spotlight/Shine follow effect
    const spotX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 40 });
    const spotY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 40 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const x = (e.clientX - rect.left) / width - 0.5;
        const y = (e.clientY - rect.top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <div style={{ perspective: "1500px", gridColumn: `span ${colSpanMobile}`, height: height ? height : "auto" }} className={`mobile-span-${colSpanMobile} desktop-span-${colSpanDesktop}`}>
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{
                    scale: 1.02,
                    boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)"
                }}
                style={{
                    rotateX,
                    rotateY,
                    background: theme.colors.cardBg,
                    backdropFilter: "blur(40px) saturate(210%) brightness(1.2)",
                    WebkitBackdropFilter: "blur(40px) saturate(210%) brightness(1.2)",
                    borderTop: `1px solid ${theme.colors.cardBorderTop}`,
                    borderBottom: `1px solid rgba(0,0,0,0.5)`,
                    borderLeft: `1px solid ${theme.colors.cardBorder}`,
                    borderRight: `1px solid ${theme.colors.cardBorder}`,
                    borderRadius: theme.radii.card,
                    padding: "1.75rem",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: theme.shadows.card,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transformStyle: "preserve-3d",
                    cursor: "pointer",
                    height: "100%"
                }}
                className={className}
                transition={{ delay: delay, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
                {/* Dynamic Spotlight Shine */}
                <motion.div
                    style={{
                        position: "absolute",
                        inset: "-20%",
                        background: useTransform(
                            [spotX, spotY],
                            ([x, y]: any[]) => `radial-gradient(circle at ${(x as number) + 20}% ${(y as number) + 20}%, rgba(255,255,255,0.08), transparent 60%)`
                        ),
                        pointerEvents: "none",
                        zIndex: 0
                    }}
                />

                <motion.div style={{
                    position: "relative",
                    zIndex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transform: "translateZ(60px)", // Deeper depth
                    transformStyle: "preserve-3d"
                }}>
                    {children}
                </motion.div>
            </motion.div>
        </div>
    );
};
