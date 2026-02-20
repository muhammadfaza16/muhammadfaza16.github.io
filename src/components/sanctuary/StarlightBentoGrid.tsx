"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    PenTool,
    Book,
    Compass,
    Briefcase,
    Gift,
    Library
} from "lucide-react";

interface AppIconProps {
    title: string;
    href: string;
    icon: React.ReactNode;
    iconColor: string;
    delay?: number;
}

const AppIcon = ({ title, href, icon, iconColor, delay = 0 }: AppIconProps) => {
    return (
        <Link href={href} prefetch={false} style={{ textDecoration: 'none' }} className="group">
            <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 0.35,
                    delay,
                    type: "spring",
                    stiffness: 350,
                    damping: 22
                }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                }}
            >
                {/* iOS Dark Mode Icon Style (Matches Home) */}
                <div style={{
                    position: "relative",
                    width: "clamp(58px, 16vw, 72px)",
                    height: "clamp(58px, 16vw, 72px)",
                    borderRadius: "22.5%",
                    background: "rgba(255, 255, 255, 0.04)", // Ultra-thin light glass to pop on Sage background
                    backdropFilter: "blur(24px) saturate(150%)",
                    WebkitBackdropFilter: "blur(24px) saturate(150%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px -4px rgba(0,0,0,0.1), inset 0 1px 0.5px rgba(255,255,255,0.4)", // Strong specular highlight
                    transition: "transform 0.15s ease",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.15)", // Brighter border for crisp edge
                }} className="hover:scale-105 active:scale-95">

                    {/* Icon symbol */}
                    <div style={{
                        color: iconColor,
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                    }}>
                        {React.cloneElement(icon as any, { size: "42%", strokeWidth: 2.5 })}
                    </div>

                    {/* Gloss top */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "50%",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)",
                        zIndex: 3,
                        pointerEvents: "none",
                    }} />
                </div>

                {/* Label */}
                <span style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: "0.74rem",
                    fontWeight: 500,
                    color: "var(--ink-primary)",
                    textAlign: "center",
                    letterSpacing: "0.02em",
                }}>
                    {title}
                </span>
            </motion.div>
        </Link>
    );
};

export function StarlightBentoGrid() {
    // Dark icons with vivid glyphs for Starlight
    const apps = [
        { title: "Bookshelf", href: "/bookshelf", icon: <Book />, iconColor: "#FF9F0A" }, // Orange
        { title: "Writing", href: "/blog", icon: <PenTool />, iconColor: "#FFD60A" }, // Gold
        { title: "Curation", href: "/curation", icon: <Library />, iconColor: "#64D2FF" }, // Teal/Blue
        { title: "Life Compass", href: "/life-compass", icon: <Compass />, iconColor: "#32D74B" }, // Green
        { title: "Portfolio", href: "/portfolio", icon: <Briefcase />, iconColor: "#5E5CE6" }, // Indigo
        { title: "Wishlist", href: "/wishlist", icon: <Gift />, iconColor: "#FF375F" }, // Pink
    ];

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
        }}>
            <section style={{
                padding: "0 1.5rem",
                width: "100%",
                maxWidth: "380px", // Reduced from 420px for closer clustering
                paddingBottom: "3rem"
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1.5rem 0.5rem", // Reduced gap to match Home Screen dock clustered feel
                }}>
                    {apps.map((app, idx) => (
                        <AppIcon key={idx} {...app} delay={0.1 + idx * 0.06} />
                    ))}
                </div>
            </section>
        </div>
    );
}
