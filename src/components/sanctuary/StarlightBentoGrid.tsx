"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    PenTool, Book, Compass, Briefcase, Gift, Library,
    ChevronLeft, ChevronRight,
    Terminal, Cpu, Megaphone, Lightbulb, Monitor, FileText,
    Film, Music, Zap, Lock, Backpack
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
                {/* Ultra-Thin Premium Glass */}
                <div style={{
                    position: "relative",
                    width: "clamp(58px, 16vw, 72px)",
                    height: "clamp(58px, 16vw, 72px)",
                    borderRadius: "22.5%",
                    background: "rgba(0, 0, 0, 0.15)", // Lighter built-in dark opacity
                    backdropFilter: "blur(32px) saturate(180%) brightness(110%)",
                    WebkitBackdropFilter: "blur(32px) saturate(180%) brightness(110%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 16px -4px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.6)", // Delicate lift
                    transition: "transform 0.15s ease",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle rim highlight
                }} className="hover:scale-105 active:scale-95">

                    {/* Icon symbol (Restored Brand Colors) */}
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

                    {/* Gloss top (Subtle glass reflection) */}
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
                    color: "#ffffff", // Pure white for perfect contrast against dark dock
                    textShadow: "0 1px 4px rgba(0,0,0,0.5)", // Strong shadow to separate from background
                    textAlign: "center",
                    letterSpacing: "0.02em",
                }}>
                    {title}
                </span>
            </motion.div>
        </Link>
    );
};

interface StarlightBentoGridProps {
    activeDock: number;
    setActiveDock: React.Dispatch<React.SetStateAction<number>>;
}

export function StarlightBentoGrid({ activeDock, setActiveDock }: StarlightBentoGridProps) {

    const dock1Apps = [
        { title: "Bookshelf", href: "/bookshelf", icon: <Book />, iconColor: "#FF9F0A" }, // Orange
        { title: "Curation", href: "/curation", icon: <Library />, iconColor: "#64D2FF" }, // Teal/Blue
        { title: "Life Compass", href: "/life-compass", icon: <Compass />, iconColor: "#32D74B" }, // Green
        { title: "Portfolio", href: "/portfolio", icon: <Briefcase />, iconColor: "#5E5CE6" }, // Indigo
        { title: "Wishlist", href: "/wishlist", icon: <Gift />, iconColor: "#FF375F" }, // Pink
    ];

    const dock2Apps = [
        { title: "AI Agents", href: "/journey/ai-agent", icon: <Cpu />, iconColor: "#BF5AF2" }, // Purple
        { title: "Brand", href: "/journey/brand-building", icon: <Megaphone />, iconColor: "#FF453A" }, // Red
        { title: "Insights", href: "/insights", icon: <Lightbulb />, iconColor: "#FFD60A" }, // Gold
        { title: "Workspace", href: "/workspace", icon: <Monitor />, iconColor: "#8E8E93" }, // Gray
        { title: "Uses", href: "/uses", icon: <Backpack />, iconColor: "#5E5CE6" }, // Indigo
    ];

    const dock3Apps = [
        { title: "Movies", href: "/movies", icon: <Film />, iconColor: "#FF453A" }, // Red
        { title: "Playlist", href: "/playlist", icon: <Music />, iconColor: "#FF2D55" }, // Pink-Red
        { title: "Now", href: "/now", icon: <Zap />, iconColor: "#FF9F0A" }, // Orange
        { title: "Secrets", href: "/secrets", icon: <Lock />, iconColor: "#8E8E93" }, // Gray
    ];

    const allDocks = [dock1Apps, dock2Apps, dock3Apps];

    const handlePrev = () => {
        setActiveDock((prev) => {
            const next = prev > 0 ? prev - 1 : allDocks.length - 1;
            sessionStorage.setItem("starlight_active_dock", next.toString());
            return next;
        });
    };

    const handleNext = () => {
        setActiveDock((prev) => {
            const next = prev < allDocks.length - 1 ? prev + 1 : 0;
            sessionStorage.setItem("starlight_active_dock", next.toString());
            return next;
        });
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            position: "relative", // For absolute positioning the chevrons
        }}>
            {/* Left Chevron */}
            <div
                onClick={handlePrev}
                style={{
                    position: "absolute",
                    left: "-1rem",
                    top: "calc(50% - 1.5rem)", // Offset by half of the container's paddingBottom
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255, 255, 255, 0.4)", // Softer transparent white
                    pointerEvents: "auto",
                    cursor: "pointer",
                    zIndex: 10,
                }}>
                <ChevronLeft size={28} strokeWidth={1.5} className="hover:scale-110 active:scale-95 transition-transform" />
            </div>

            <section style={{
                padding: "0 1.5rem",
                width: "100%",
                maxWidth: "380px", // Reduced from 420px for closer clustering
                paddingBottom: "3rem"
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeDock}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 25 }}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "1.5rem 0.5rem", // Reduced gap to match Home Screen dock clustered feel
                        }}
                    >
                        {allDocks[activeDock].map((app, idx) => (
                            <AppIcon key={idx} {...app} delay={0.05 + idx * 0.04} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* Right Chevron */}
            <div
                onClick={handleNext}
                style={{
                    position: "absolute",
                    right: "-1rem",
                    top: "calc(50% - 1.5rem)", // Offset by half of the container's paddingBottom
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255, 255, 255, 0.4)", // Softer transparent white
                    pointerEvents: "auto",
                    cursor: "pointer",
                    zIndex: 10,
                }}>
                <ChevronRight size={28} strokeWidth={1.5} className="hover:scale-110 active:scale-95 transition-transform" />
            </div>
        </div>
    );
}
