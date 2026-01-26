"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Sparkles,
    Hammer,
    Users,
    Wifi,
    Globe,
    Music,
    Clock,
    Lightbulb
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
        <Link href={href} style={{ textDecoration: 'none' }} className="group">
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                    duration: 0.5,
                    delay,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: inDock ? "0" : "0.5rem",
                }}
            >
                {/* The App Icon (Premium Skeuomorphic) */}
                <div style={{
                    position: "relative",
                    width: "clamp(60px, 17vw, 72px)",
                    height: "clamp(60px, 17vw, 72px)",
                    borderRadius: "22.5%", // Superellipse
                    background: gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 12px 24px -6px rgba(0,0,0,0.6), inset 0 -3px 6px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.5)",
                    transition: "transform 0.1s ease",
                    overflow: "hidden",
                    zIndex: 1
                }} className="hover:scale-105 active:scale-90">

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

                    {/* Glossy Top Shine */}
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

                    {/* Noise Texture */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.08,
                        backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
                        filter: "contrast(150%) brightness(100%)",
                        zIndex: 2,
                        pointerEvents: "none",
                    }} />
                </div>

                {/* App Label - Always Visible */}
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
            </motion.div>
        </Link>
    );
};

export function RoomBentoGrid() {
    // Merged Apps (All standard Grid)
    const apps = [
        { title: "Guest", href: "/guest", icon: <Users />, gradient: "linear-gradient(135deg, #FF2D55, #FF375F)" }, // Pink Red
        { title: "Insights", href: "/insights", icon: <Lightbulb />, gradient: "linear-gradient(135deg, #34C759, #30B0C7)" }, // Green
        { title: "Time", href: "/time", icon: <Clock />, gradient: "linear-gradient(135deg, #8E8E93, #636366)" }, // Gray
        { title: "Web", href: "https://muhammadfaza16.github.io", icon: <Globe />, gradient: "linear-gradient(135deg, #8E8E93, #636366)" }, // Safari-ish
        // Former Dock Apps
        { title: "My Space", href: "/starlight", icon: <Sparkles />, gradient: "linear-gradient(135deg, #AF52DE, #5856D6)" }, // Purple
        { title: "Workspace", href: "/workspace", icon: <Hammer />, gradient: "linear-gradient(135deg, #007AFF, #00C7BE)" }, // Blue/Teal
        { title: "Music", href: "/playlist", icon: <Music />, gradient: "linear-gradient(135deg, #FF9500, #FF5E3A)" }, // Orange
        { title: "Connect", href: "#connect", icon: <Wifi />, gradient: "linear-gradient(135deg, #FF9500, #FF5E3A)" }, // Orange
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
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "2rem 1rem",
                }}>
                    {apps.map((app, idx) => (
                        <AppIcon key={idx} {...app} delay={idx * 0.05} />
                    ))}
                </div>
            </section>
        </div>
    );
}
