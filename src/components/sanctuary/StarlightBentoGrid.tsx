"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    PenTool, Book, Compass, Briefcase, Gift, Library,
    ChevronLeft, ChevronRight,
    Terminal, Cpu, Megaphone, Lightbulb, Monitor, FileText,
    Film, Music, Zap, Lock, Backpack, BookOpen
} from "lucide-react";

interface AppIconProps {
    title: string;
    href: string;
    icon: React.ReactNode;
    iconColor: string;
    delay?: number;
}



interface StarlightBentoGridProps {
    activeDock: number;
    setActiveDock: React.Dispatch<React.SetStateAction<number>>;
}

const AppIcon = ({ title, href, icon, iconColor, delay = 0, isMobile = false }: AppIconProps & { isMobile?: boolean }) => {
    return (
        <Link href={href} prefetch={true} style={{ textDecoration: 'none' }} className="group">
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
                    width: isMobile ? "clamp(50px, 14vw, 62px)" : "clamp(58px, 16vw, 72px)",
                    height: isMobile ? "clamp(50px, 14vw, 62px)" : "clamp(58px, 16vw, 72px)",
                    borderRadius: "26%",
                    background: "rgba(0, 0, 0, 0.35)", // Significantly more solid
                    backdropFilter: "blur(20px) saturate(160%)", // Higher blur
                    WebkitBackdropFilter: "blur(20px) saturate(160%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.25), inset 0 1px 0.5px rgba(255,255,255,0.25)",
                    transition: "transform 0.15s ease",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
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

                    {/* Specular highlight — top edge shine (Match Home) */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: "15%",
                        right: "15%",
                        height: "1px",
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 30%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.45) 70%, transparent 100%)",
                        pointerEvents: "none",
                        zIndex: 4,
                        filter: "blur(0.3px)",
                    }} />

                    {/* Glossy sheen (Match Home) */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "50%",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 60%, transparent 100%)", // Brighter gloss
                        zIndex: 3,
                        pointerEvents: "none",
                        borderRadius: "26% 26% 0 0",
                    }} />


                </div>

                {/* Label */}
                <span style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: isMobile ? "0.65rem" : "0.7rem",
                    fontWeight: 600,
                    color: "rgba(255, 255, 255, 0.9)",
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

export function StarlightBentoGrid({ activeDock, setActiveDock }: StarlightBentoGridProps) {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

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
        { title: "Master", href: "/master", icon: <BookOpen />, iconColor: "#BF5AF2" }, // Purple
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


            <section style={{
                padding: "0 1.5rem",
                width: "100%",
                maxWidth: isMobile ? "340px" : "380px", // Reduced from 420px for closer clustering
                paddingBottom: "3rem"
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeDock}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.4}
                        onDragEnd={(_, info) => {
                            const threshold = 50;
                            if (info.offset.x < -threshold) {
                                handleNext();
                            } else if (info.offset.x > threshold) {
                                handlePrev();
                            }
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 25 }}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: isMobile ? "1.5rem 0.5rem" : "2rem 1rem",
                            cursor: "grab",
                            touchAction: "none"
                        }}
                        whileDrag={{ cursor: "grabbing" }}
                    >
                        {allDocks[activeDock].map((app, idx) => (
                            <AppIcon key={idx} {...app} delay={0.02 + idx * 0.02} isMobile={isMobile} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* iOS Page Indicators */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "2.5rem"
                }}>
                    {allDocks.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setActiveDock(i);
                                sessionStorage.setItem("starlight_active_dock", i.toString());
                            }}
                            style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "white",
                                opacity: activeDock === i ? 1 : 0.3,
                                transition: "all 0.3s ease",
                                cursor: "pointer"
                            }}
                        />
                    ))}
                </div>
            </section>


        </div>
    );
}
