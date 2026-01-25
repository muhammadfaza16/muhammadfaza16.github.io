"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Hammer, Users, Archive, Wifi, ArrowUpRight, Github, Linkedin, Twitter } from "lucide-react";

interface RoomCardProps {
    title: string;
    description: string;
    href: string;
    className?: string;
    icon?: React.ReactNode;
    themeColor: string;
    imageSrc: string;
    delay?: number;
    isSocial?: boolean;
}

const RoomCard = ({ title, description, href, className = "", icon, themeColor, imageSrc, delay = 0, isSocial }: RoomCardProps) => {
    const ContentWrapper = isSocial ? "div" : Link;

    const cardStyle: React.CSSProperties = {
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "rgba(30, 30, 35, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        borderRadius: "2rem",
        cursor: isSocial ? "default" : "pointer",
        userSelect: "none",
    };

    const iconContainerStyle: React.CSSProperties = {
        width: "3rem",
        height: "3rem",
        borderRadius: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: `0 8px 16px -4px ${themeColor}40`,
        marginBottom: "1rem",
    };

    return (
        // @ts-ignore
        <ContentWrapper href={!isSocial ? href : undefined} className={`block h-full ${className}`} style={{ textDecoration: 'none' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                    duration: 0.5,
                    delay,
                    ease: [0.2, 0.8, 0.2, 1]
                }}
                whileHover={!isSocial ? { scale: 1.02, y: -2 } : {}}
                whileTap={{ scale: 0.96 }}
                style={cardStyle}
                className="transform-gpu group"
            >
                {/* Background Image Container with Cinematic Fade */}
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    {imageSrc && !imageSrc.endsWith('.png') && !imageSrc.endsWith('.jpg') ? (
                        <div style={{ width: "100%", height: "100%", background: "linear-gradient(to bottom right, #1a1a1a, black)" }} />
                    ) : (
                        <Image
                            src={imageSrc}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            quality={90}
                        />
                    )}

                    {/* Gradient Overlay */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                        zIndex: 10
                    }} />

                    {/* Theme Glow */}
                    <div
                        className="opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 10,
                            background: `radial-gradient(circle at top right, ${themeColor}, transparent 70%)`
                        }}
                    />
                </div>

                {/* Content Container */}
                <div style={{
                    position: "relative",
                    zIndex: 20,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "1.5rem 2rem",
                }}>
                    {/* Header Section */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={iconContainerStyle}>
                            {icon}
                        </div>

                        {!isSocial && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transform: "translateX(0)" }}>
                                <ArrowUpRight style={{ width: "1.25rem", height: "1.25rem", color: "rgba(255,255,255,0.7)" }} />
                            </div>
                        )}
                    </div>

                    {/* Bottom Text Section */}
                    <div style={{ fontFamily: "var(--font-sans, sans-serif)" }}>
                        <h3 style={{
                            margin: "0 0 0.25rem 0",
                            fontWeight: 600,
                            color: "rgba(255, 255, 255, 0.95)",
                            fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                            letterSpacing: "-0.025em",
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                        }}>
                            {title}
                        </h3>

                        <p style={{
                            margin: 0,
                            fontSize: "clamp(0.8rem, 1.5vw, 0.95rem)",
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: 500,
                            lineHeight: 1.4,
                            maxWidth: "100%",
                            textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                        }}>
                            {description}
                        </p>

                        {isSocial && (
                            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                                {[
                                    { name: "Twitter", href: "https://x.com/scienfilix", icon: <Twitter size={18} /> },
                                    { name: "GitHub", href: "https://github.com/mfazans23", icon: <Github size={18} /> },
                                    { name: "LinkedIn", href: "https://linkedin.com", icon: <Linkedin size={18} /> }
                                ].map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: "0.75rem",
                                            background: "rgba(255, 255, 255, 0.1)",
                                            backdropFilter: "blur(10px)",
                                            WebkitBackdropFilter: "blur(10px)",
                                            border: "1px solid rgba(255, 255, 255, 0.1)",
                                            borderRadius: "0.75rem",
                                            color: "rgba(255, 255, 255, 0.8)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.3s ease"
                                        }}
                                        className="hover:bg-white/20 hover:text-white hover:scale-110"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Refined Glass Highlight */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "100%",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
                        pointerEvents: "none",
                        zIndex: 5,
                    }}
                />
            </motion.div>
        </ContentWrapper>
    );
};

export function RoomBentoGrid() {
    const rooms = [
        {
            title: "Starlight",
            description: "Deep reflection & cosmic tranquility.",
            href: "/starlight",
            className: "col-span-2 md:col-span-2 md:row-span-2",
            icon: <Sparkles size={24} />,
            themeColor: "#8B5CF6", // Violet
            imageSrc: "/images/starlight.png",
        },
        {
            title: "Workspace",
            description: "High-performance craftsmanship.",
            href: "/workspace",
            className: "col-span-1 md:col-span-1 md:row-span-1",
            icon: <Hammer size={24} />,
            themeColor: "#3B82F6", // Blue
            imageSrc: "/images/workspace.png",
        },
        {
            title: "Guest Room",
            description: "Human connection.",
            href: "/guest",
            className: "col-span-1 md:col-span-1 md:row-span-1",
            icon: <Users size={24} />,
            themeColor: "#EC4899", // Pink
            imageSrc: "/images/guest.png",
        },
        {
            title: "Gudang",
            description: "Archive of artifacts.",
            href: "/gudang",
            className: "col-span-2 md:col-span-2 md:row-span-1",
            icon: <Archive size={24} />,
            themeColor: "#10B981", // Emerald
            imageSrc: "/images/gudang.png",
        },
        {
            title: "Connect",
            description: "Network signals.",
            href: "#connect",
            className: "col-span-1 md:col-span-1 md:row-span-1",
            icon: <Wifi size={24} />,
            themeColor: "#F59E0B", // Amber
            imageSrc: "/images/connect_bg.png",
            isSocial: true,
        },
    ];

    return (
        <section
            style={{
                position: "relative",
                zIndex: 10,
                width: "100%",
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "2.5rem 1.25rem",
            }}
            className="md:py-32 md:px-8"
        >
            <style>{`
                .bento-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
                @media (min-width: 768px) {
                    .bento-grid {
                        grid-template-columns: repeat(3, 1fr);
                        grid-auto-rows: minmax(280px, auto);
                        gap: 24px;
                    }
                }
            `}</style>

            {/* Header */}
            <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }} className="md:mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 style={{
                        fontSize: "clamp(1.875rem, 5vw, 3rem)",
                        fontWeight: 700,
                        fontFamily: "var(--font-sans, sans-serif)",
                        letterSpacing: "-0.04em",
                        color: "var(--foreground)",
                        marginBottom: "0.75rem"
                    }}>
                        Sanctuary Rooms
                    </h2>
                    <div style={{
                        width: "4rem",
                        height: "0.375rem",
                        background: "var(--accent)",
                        borderRadius: "9999px",
                        opacity: 0.8
                    }} className="md:w-16" />
                </motion.div>
            </div>

            <div className="bento-grid">
                {rooms.map((room, idx) => (
                    <RoomCard
                        key={idx}
                        {...room}
                        delay={idx * 0.05}
                        className={room.className}
                    />
                ))}
            </div>
        </section>
    );
}
