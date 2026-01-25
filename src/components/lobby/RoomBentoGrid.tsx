"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface RoomCardProps {
    title: string;
    description: string;
    href: string;
    className?: string;
    icon?: React.ReactNode;
    themeColor: string;
    imageSrc: string;
    delay?: number;
}

const RoomCard = ({ title, description, href, className = "", icon, themeColor, imageSrc, delay = 0 }: RoomCardProps) => {
    return (
        <Link href={href} className={`group relative block h-full ${className}`} style={{ textDecoration: 'none' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                style={{
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "2.5rem",
                    border: "1px solid var(--border)",
                    background: "var(--card-bg)",
                    boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="transform-gpu card-hover"
            >
                {/* Background Image Container */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={90}
                        priority={delay === 0}
                    />

                    {/* Dynamic Overlays: Adjust based on theme for maximum legibility */}
                    {/* Dark scrim for dark mode / general readability */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 100%)",
                            zIndex: 1,
                            transition: "opacity 0.4s ease",
                        }}
                        className="opacity-70 group-hover:opacity-90 dark:opacity-80 dark:group-hover:opacity-100"
                    />

                    {/* Theme Tint */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: themeColor,
                            mixBlendMode: "overlay",
                            opacity: 0.25,
                            zIndex: 2,
                            transition: "opacity 0.4s ease",
                        }}
                        className="group-hover:opacity-40"
                    />
                </div>

                {/* Content Container */}
                <div style={{ position: "relative", zIndex: 10, padding: "2.5rem", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                        <div
                            style={{
                                marginBottom: "2rem",
                                width: "4rem",
                                height: "4rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "1.25rem",
                                fontSize: "2rem",
                                background: "rgba(255, 255, 255, 0.15)",
                                border: "1px solid rgba(255, 255, 255, 0.3)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                boxShadow: `0 10px 20px -5px ${themeColor}40`,
                                transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                color: "white",
                            }}
                            className="group-hover:scale-110 group-hover:rotate-6 group-hover:background-white/20"
                        >
                            {icon}
                        </div>

                        <h3
                            style={{
                                fontSize: "1.75rem",
                                fontWeight: 700,
                                color: "white", // Keep white for impact on images
                                marginBottom: "1rem",
                                letterSpacing: "-0.04em",
                                textShadow: "0 2px 15px rgba(0,0,0,0.5)",
                                lineHeight: 1.1,
                                fontFamily: "var(--font-serif)",
                            }}
                        >
                            {title}
                        </h3>

                        <p
                            style={{
                                fontSize: "1rem",
                                lineHeight: 1.6,
                                color: "rgba(255, 255, 255, 0.9)", // High contrast white
                                margin: 0,
                                textShadow: "0 1px 10px rgba(0,0,0,0.8)",
                                fontFamily: "var(--font-sans)",
                                maxWidth: "28ch",
                            }}
                        >
                            {description}
                        </p>
                    </div>

                    <div
                        style={{
                            marginTop: "auto",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.2em",
                            color: "rgba(255, 255, 255, 0.7)",
                            transition: "all 0.3s ease",
                        }}
                        className="group-hover:text-white"
                    >
                        <span style={{ borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "2px" }}>Explore Room</span>
                        <svg
                            style={{ marginLeft: "1rem", width: "1.25rem", height: "1.25rem" }}
                            className="transition-transform duration-500 group-hover:translate-x-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
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
        </Link>
    );
};

export function RoomBentoGrid() {
    const rooms = [
        {
            title: "Starlight",
            description: "Atmospheric haven for deep reflection and cosmic tranquility.",
            href: "/starlight",
            className: "col-span-1 md:col-span-2 md:row-span-2",
            icon: "✨",
            themeColor: "#8B5CF6", // Violet
            imageSrc: "/images/starlight.png",
        },
        {
            title: "Workspace",
            description: "Digital forge for high-performance productivity and craftsmanship.",
            href: "/workspace",
            className: "col-span-1 md:col-span-1 md:row-span-1",
            icon: "🛠️",
            themeColor: "#3B82F6", // Blue
            imageSrc: "/images/workspace.png",
        },
        {
            title: "Guest Room",
            description: "Where conversations find a home. A space for connection.",
            href: "/guest",
            className: "col-span-1 md:col-span-1 md:row-span-1",
            icon: "🤝",
            themeColor: "#EC4899", // Pink
            imageSrc: "/images/guest.png",
        },
        {
            title: "Gudang",
            description: "Archive of curiosities and artifacts of personal history.",
            href: "/gudang",
            className: "col-span-1 md:col-span-3 md:row-span-1",
            icon: "📦",
            themeColor: "#10B981", // Emerald
            imageSrc: "/images/gudang.png",
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
                padding: "8rem 2rem",
            }}
        >
            {/* Dynamic Header */}
            <div style={{ marginBottom: '4rem', padding: '0 1rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 style={{
                        color: 'var(--foreground)', // Theme aware title
                        fontSize: 'var(--spacing-10, 3rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.04em',
                        marginBottom: '1rem',
                        fontFamily: 'var(--font-serif)',
                    }}>
                        The Sanctuary Rooms
                    </h2>
                    <div style={{
                        width: '4rem',
                        height: '6px',
                        background: 'var(--accent)',
                        borderRadius: '3px'
                    }} />
                </motion.div>
            </div>

            <div
                className="grid grid-cols-1 gap-8 md:grid-cols-3 md:grid-rows-3"
                style={{
                    display: "grid",
                }}
            >
                {rooms.map((room, idx) => (
                    <RoomCard
                        key={idx}
                        {...room}
                        delay={idx * 0.1}
                        className={`${room.className} ${idx % 2 === 0 ? 'min-h-[300px]' : 'min-h-[250px]'} md:min-h-0`}
                    />
                ))}
            </div>
        </section>
    );
}
