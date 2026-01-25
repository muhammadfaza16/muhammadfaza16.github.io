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
                    border: "1px solid var(--border)",
                    background: "var(--card-bg)",
                    boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="transform-gpu card-hover rounded-2xl md:rounded-[2.5rem]"
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
                <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }} className="p-5 md:p-10">
                    <div>
                        <div
                            style={{
                                marginBottom: "1rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.5rem",
                                background: "rgba(255, 255, 255, 0.15)",
                                border: "1px solid rgba(255, 255, 255, 0.3)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                boxShadow: `0 10px 20px -5px ${themeColor}40`,
                                transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                color: "white",
                            }}
                            className="w-10 h-10 rounded-xl md:w-16 md:h-16 md:rounded-[1.25rem] md:mb-8 md:text-2xl group-hover:scale-110 group-hover:rotate-6 group-hover:background-white/20"
                        >
                            {icon}
                        </div>

                        <h3
                            style={{
                                fontWeight: 700,
                                color: "white", // Keep white for impact on images
                                letterSpacing: "-0.04em",
                                textShadow: "0 2px 15px rgba(0,0,0,0.5)",
                                lineHeight: 1.1,
                                fontFamily: "var(--font-serif)",
                            }}
                            className="text-lg md:text-[1.75rem] mb-2 md:mb-4"
                        >
                            {title}
                        </h3>

                        <p
                            style={{
                                lineHeight: 1.4,
                                color: "rgba(255, 255, 255, 0.9)", // High contrast white
                                margin: 0,
                                textShadow: "0 1px 10px rgba(0,0,0,0.8)",
                                fontFamily: "var(--font-sans)",
                                maxWidth: "28ch",
                            }}
                            className="text-xs md:text-base hidden sm:block"
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
                        className="group-hover:text-white hidden md:flex"
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
            }}
        >
            <style>{`
                .bento-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    padding: 20px;
                }
                @media (min-width: 768px) {
                    .bento-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 32px;
                        padding: 128px 32px;
                    }
                }
            `}</style>
            {/* Dynamic Header */}
            <div style={{ marginBottom: '1.5rem', padding: '0 20px' }} className="md:mb-16 md:px-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 style={{
                        color: 'var(--foreground)', // Theme aware title
                        fontWeight: 700,
                        letterSpacing: '-0.04em',
                        fontFamily: 'var(--font-serif)',
                    }} className="text-3xl md:text-5xl mb-2 md:mb-4">
                        The Sanctuary Rooms
                    </h2>
                    <div style={{
                        background: 'var(--accent)',
                        borderRadius: '3px'
                    }} className="w-12 h-1 md:w-16 md:h-1.5" />
                </motion.div>
            </div>

            <div className="bento-grid">
                {rooms.map((room, idx) => (
                    <RoomCard
                        key={idx}
                        {...room}
                        delay={idx * 0.1}
                        // Mobile: 2 columns.
                        // Desktop: Original spans.
                        className={`${room.className.replace('col-span-1', '').replace('md:', '')} ${idx === 3 ? 'col-span-2 md:col-span-3' : 'col-span-1'} md:${room.className} ${idx % 2 === 0 ? 'min-h-[160px] md:min-h-[300px]' : 'min-h-[160px] md:min-h-[250px]'} md:min-h-0`}
                    />
                ))}
            </div>
        </section>
    );
}
