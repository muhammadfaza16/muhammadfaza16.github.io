"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface BentoItemProps {
    title: string;
    description: string;
    href: string;
    icon: string;
    color: string;
    className?: string;
    delay?: number;
}

const BentoCard = ({ title, description, href, icon, color, className = "", delay = 0 }: BentoItemProps) => {
    return (
        <Link href={href} className={`group relative block h-full ${className}`} style={{ textDecoration: 'none' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "2rem",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 10px 30px -5px rgba(0,0,0,0.3)",
                    transition: "border-color 0.3s ease, background 0.3s ease",
                }}
                className="hover:border-white/20 hover:bg-white/5"
            >
                {/* Glow Effect */}
                <div
                    style={{
                        position: "absolute",
                        top: "-20%",
                        right: "-20%",
                        width: "60%",
                        height: "60%",
                        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                        zIndex: 0,
                        pointerEvents: "none",
                        transition: "opacity 0.5s ease",
                    }}
                    className="group-hover:opacity-100 opacity-50"
                />

                <div style={{ position: "relative", zIndex: 10 }}>
                    <div style={{
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "1rem",
                        background: `${color}15`,
                        border: `1px solid ${color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        marginBottom: "1.5rem",
                        boxShadow: `0 8px 20px -5px ${color}30`,
                        transition: "transform 0.4s ease",
                    }} className="group-hover:scale-110 group-hover:rotate-3">
                        {icon}
                    </div>

                    <h3 style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "white",
                        marginBottom: "0.5rem",
                        letterSpacing: "-0.02em",
                        fontFamily: "var(--font-serif)",
                    }}>
                        {title}
                    </h3>

                    <p style={{
                        fontSize: "0.85rem",
                        lineHeight: 1.5,
                        color: "rgba(255, 255, 255, 0.5)",
                        margin: 0,
                        fontFamily: "var(--font-sans)",
                        transition: "color 0.3s ease",
                    }} className="group-hover:text-white/80">
                        {description}
                    </p>
                </div>

                <div style={{
                    marginTop: "1.5rem",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "rgba(255, 255, 255, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    zIndex: 10,
                }} className="group-hover:text-white/60">
                    Open Archive
                    <span style={{ transition: "transform 0.3s ease" }} className="group-hover:translate-x-1">→</span>
                </div>
            </motion.div>
        </Link>
    );
};

export function StarlightBentoGrid() {
    const archives = [
        {
            title: "Writing",
            description: "Himpunan esai, opini, dan narasi panjang yang mengalir.",
            href: "/blog",
            icon: "✍️",
            color: "#8B5CF6", // Violet
            className: "md:col-span-2 md:row-span-2 min-h-[280px]",
        },
        {
            title: "Notes",
            description: "Quick snippets and fragmented thoughts.",
            href: "/notes",
            icon: "📝",
            color: "#3B82F6", // Blue
            className: "md:col-span-1 md:row-span-1 min-h-[180px]",
        },
        {
            title: "TIL",
            description: "Today I Learned. Small wins in knowledge.",
            href: "/til",
            icon: "💡",
            color: "#10B981", // Emerald
            className: "md:col-span-1 md:row-span-1 min-h-[180px]",
        },
        {
            title: "Journey",
            description: "The chronological path of a broken wanderer.",
            href: "/journey",
            icon: "🗺️",
            color: "#F59E0B", // Amber
            className: "md:col-span-1 md:row-span-2 min-h-[220px]",
        },
        {
            title: "Ideas",
            description: "Setengah matang, tapi punya potensi meledak.",
            href: "/ideas",
            icon: "🧠",
            color: "#EC4899", // Pink
            className: "md:col-span-1 md:row-span-1 min-h-[180px]",
        },
        {
            title: "Bookshelf",
            description: "Apa yang saya baca (dan belum selesai dibaca).",
            href: "/bookshelf",
            icon: "📚",
            color: "#6366F1", // Indigo
            className: "md:col-span-1 md:row-span-1 min-h-[180px]",
        },
        {
            title: "Links",
            description: "The rabbit holes I've found on the internet.",
            href: "/links",
            icon: "🔗",
            color: "#06B6D4", // Cyan
            className: "md:col-span-1 md:row-span-1 min-h-[180px]",
        },
        {
            title: "Movie",
            description: "Watchlist and thoughts on cinematic magic.",
            href: "/movies",
            icon: "🎬",
            color: "#EF4444", // Red
            className: "md:col-span-1 md:row-span-1 min-h-[180px]",
        },
        {
            title: "Wishlist",
            description: "Hal-hal yang sedang saya dambakan.",
            href: "/wishlist",
            icon: "🎁",
            color: "#A855F7", // Purple
            className: "md:col-span-1 md:row-span-1 min-h-[180px]",
        },
    ];

    return (
        <section style={{
            padding: "4rem 1.5rem",
            maxWidth: "1280px",
            margin: "0 auto",
            position: "relative",
            zIndex: 10,
        }}>
            <div style={{ marginBottom: "3rem" }}>
                <h2 style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2.5rem",
                    color: "white",
                    marginBottom: "1rem",
                    letterSpacing: "-0.03em",
                }}>
                    Arsip Memori
                </h2>
                <div style={{ width: "3rem", height: "4px", background: "var(--accent)", borderRadius: "2px" }} />
            </div>

            <div
                className="grid grid-cols-1 gap-5 md:grid-cols-4 md:grid-rows-4"
                style={{
                    display: "grid",
                }}
            >
                {archives.map((item, idx) => (
                    <BentoCard key={idx} {...item} delay={idx * 0.05} />
                ))}
            </div>
        </section>
    );
}
