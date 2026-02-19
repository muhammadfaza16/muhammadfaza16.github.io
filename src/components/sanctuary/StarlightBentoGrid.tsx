"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    PenTool,
    FileText,
    Lightbulb,
    Map,
    Zap,
    Book,
    Link as LinkIcon,
    Film,
    Gift,
    Music,
    Clock,
    Compass,
    Target,
    Library
} from "lucide-react";

interface AppIconProps {
    title: string;
    href: string;
    icon: React.ReactNode;
    gradient: string;
    delay?: number;
    inDock?: boolean;
}

const AppIcon = ({ title, href, icon, gradient, delay = 0, inDock = false }: AppIconProps) => {
    return (
        <Link href={href} prefetch={false} style={{ textDecoration: 'none' }} className="group">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 0.35,
                    type: "spring",
                    stiffness: 350,
                    damping: 22
                }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: inDock ? "0" : "0.5rem", // No gap/label for Dock
                }}
            >
                {/* The App Icon (Premium Skeuomorphic) */}
                <div style={{
                    position: "relative",
                    width: "clamp(60px, 17vw, 72px)", // Slightly smaller optimal size
                    height: "clamp(60px, 17vw, 72px)",
                    borderRadius: "22.5%", // Superellipse
                    background: gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 20px -5px rgba(0,0,0,0.4), inset 0 -3px 6px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.5)",
                    transition: "transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    overflow: "hidden",
                    zIndex: 1
                }} className="hover:scale-102 active:scale-95">

                    {/* Symbol */}
                    <div style={{
                        color: "white",
                        zIndex: 10,
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                    }}>
                        {React.cloneElement(icon as any, { size: "45%", strokeWidth: 2.5 })}
                    </div>

                    {/* Glossy Top Shine (Hard Reflection) */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "55%",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 90%, rgba(255,255,255,0) 100%)",
                        borderTopLeftRadius: "22.5%",
                        borderTopRightRadius: "22.5%",
                        borderBottomLeftRadius: "80% 20%",
                        borderBottomRightRadius: "80% 20%",
                        zIndex: 5,
                        pointerEvents: "none",
                    }} />

                    {/* Bottom Glow */}
                    <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "40%",
                        background: "radial-gradient(ellipse at bottom, rgba(255,255,255,0.2) 0%, transparent 70%)",
                        zIndex: 4,
                        pointerEvents: "none"
                    }} />

                    {/* Noise Texture (inline SVG) */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.08,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        filter: "contrast(150%) brightness(100%)",
                        zIndex: 2,
                        pointerEvents: "none",
                    }} />
                </div>

                {/* App Label - Hidden in Dock */}
                {!inDock && (
                    <span style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "white",
                        textAlign: "center",
                        textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                        letterSpacing: "0.02em",
                        marginTop: "2px"
                    }}>
                        {title}
                    </span>
                )}
            </motion.div>
        </Link>
    );
};

export function StarlightBentoGrid() {
    // Merged Apps (No separation)
    const apps = [
        { title: "Bookshelf", href: "/bookshelf", icon: <Book />, gradient: "linear-gradient(135deg, #FF9500, #FF5E3A)" }, // Orange
        { title: "Writing", href: "/blog", icon: <PenTool />, gradient: "linear-gradient(135deg, #FFCC00, #FF9500)" }, // Yellow
        { title: "Curation", href: "/curation", icon: <Library />, gradient: "linear-gradient(135deg, #5AC8FA, #007AFF)" }, // Blue
        { title: "Life Compass", href: "/life-compass", icon: <Compass />, gradient: "linear-gradient(135deg, #34C759, #30B0C7)" }, // Green
        { title: "Journey", href: "/journey", icon: <Target />, gradient: "linear-gradient(135deg, #AF52DE, #5856D6)" }, // Purple
        { title: "Wishlist", href: "/wishlist", icon: <Gift />, gradient: "linear-gradient(135deg, #FF2D55, #FF375F)" }, // Pink Red
    ];

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
        }}>
            {/* Main Springboard Grid */}
            <section style={{
                padding: "0 1.5rem",
                width: "100%",
                maxWidth: "420px",
                paddingBottom: "4rem" // Bottom padding for scroll space
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // Changed to 3 columns for 2x3 look
                    gap: "2.5rem 1rem",
                }}>
                    {apps.map((app, idx) => (
                        <AppIcon key={idx} {...app} />
                    ))}
                </div>
            </section>
        </div>
    );
}
