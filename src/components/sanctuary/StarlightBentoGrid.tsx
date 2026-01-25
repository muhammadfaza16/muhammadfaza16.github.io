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
    Clock
} from "lucide-react";

interface AppIconProps {
    title: string;
    href: string;
    icon: React.ReactNode;
    gradient: string;
    delay?: number;
}

const AppIcon = ({ title, href, icon, gradient, delay = 0 }: AppIconProps) => {
    return (
        <Link href={href} style={{ textDecoration: 'none' }} className="group">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay, type: "spring", stiffness: 200 }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.65rem",
                }}
            >
                {/* The App Icon (Pure CSS iPhone Style) */}
                <div style={{
                    position: "relative",
                    width: "clamp(58px, 15vw, 64px)", // Closer to actual iPhone icon feel
                    height: "clamp(58px, 15vw, 64px)",
                    borderRadius: "22.5%", // Exact Apple Squircle approximation
                    background: gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 20px -5px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)",
                    transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    overflow: "hidden",
                }} className="group-hover:scale-110 group-active:scale-95">

                    {/* Symbol Wrapper - Centered */}
                    <div style={{
                        color: "white",
                        zIndex: 2,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                    }}>
                        {React.cloneElement(icon as any, { size: "40%", strokeWidth: 2.5 })}
                    </div>

                    {/* Glossy Top Reflection (iPhone 6 Style) */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "50%",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)",
                        borderTopLeftRadius: "22.5% 45%",
                        borderTopRightRadius: "22.5% 45%",
                        zIndex: 3,
                        pointerEvents: "none",
                    }} />

                    {/* Modern Glassmorphic Grain/Texture */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.05,
                        backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
                        filter: "contrast(150%) brightness(100%)",
                        zIndex: 1,
                        pointerEvents: "none",
                    }} />
                </div>

                {/* App Label */}
                <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "rgba(255, 255, 255, 0.8)",
                    textAlign: "center",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.01em",
                }}>
                    {title}
                </span>
            </motion.div>
        </Link>
    );
};

export function StarlightBentoGrid() {
    const apps = [
        { title: "Writing", href: "/blog", icon: <PenTool />, gradient: "linear-gradient(135deg, #a855f7, #6366f1)" },
        { title: "Notes", href: "/notes", icon: <FileText />, gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)" },
        { title: "TIL", href: "/til", icon: <Lightbulb />, gradient: "linear-gradient(135deg, #10b981, #34d399)" },
        { title: "Journey", href: "/journey", icon: <Map />, gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
        { title: "Ideas", href: "/ideas", icon: <Zap />, gradient: "linear-gradient(135deg, #ec4899, #be185d)" },
        { title: "Bookshelf", href: "/bookshelf", icon: <Book />, gradient: "linear-gradient(135deg, #6366f1, #4f46e5)" },
        { title: "Links", href: "/links", icon: <LinkIcon />, gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)" },
        { title: "Movie", href: "/movies", icon: <Film />, gradient: "linear-gradient(135deg, #ef4444, #b91c1c)" },
        { title: "Wishlist", href: "/wishlist", icon: <Gift />, gradient: "linear-gradient(135deg, #9333ea, #7e22ce)" },
        { title: "Playlist", href: "/playlist", icon: <Music />, gradient: "linear-gradient(135deg, #ec4899, #db2777)" }, // Apple Music style pink
        { title: "Clock", href: "/chronosphere", icon: <Clock />, gradient: "linear-gradient(135deg, #334155, #0f172a)" }, // Sleek dark clock
    ];

    return (
        <section style={{
            padding: "2rem 1.5rem 10rem",
            maxWidth: "390px", // iPhone standard width range for authentic feel
            margin: "0 auto",
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            {/* App Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    columnGap: "1.25rem", // Tighter iPhone-like gap
                    rowGap: "2rem",
                    padding: "0",
                    width: "100%",
                    justifyItems: "center",
                }}
            >
                {apps.map((app, idx) => (
                    <AppIcon key={idx} {...app} delay={idx * 0.04} />
                ))}
            </div>
        </section>
    );
}
