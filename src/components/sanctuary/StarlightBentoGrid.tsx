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
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay }}
                style={{
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "1.5rem", // Softer, iPhone-like corners
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    padding: "1.25rem", // Compact padding
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="hover:border-white/10 hover:bg-white/5"
            >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "0.75rem",
                        background: `${color}10`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        transition: "transform 0.3s ease",
                    }} className="group-hover:scale-110">
                        {icon}
                    </div>

                    <div style={{
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        color: "rgba(255,255,255,0.4)",
                    }} className="group-hover:opacity-100">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                    </div>
                </div>

                <div style={{ marginTop: "auto" }}>
                    <h3 style={{
                        fontSize: "1rem", // Smaller, cleaner font
                        fontWeight: 600,
                        color: "white",
                        marginBottom: "0.25rem",
                        letterSpacing: "-0.01em",
                        fontFamily: "var(--font-serif)",
                    }}>
                        {title}
                    </h3>

                    <p style={{
                        fontSize: "0.75rem", // Tiny but clear
                        lineHeight: 1.3,
                        color: "rgba(255, 255, 255, 0.4)",
                        margin: 0,
                        fontFamily: "var(--font-sans)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}>
                        {description}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
};

export function StarlightBentoGrid() {
    const archives = [
        {
            title: "Writing",
            description: "Himpunan esai, opini, dan narasi panjang.",
            href: "/blog",
            icon: "✍️",
            color: "#8B5CF6",
            className: "col-span-1 row-span-1",
        },
        {
            title: "Notes",
            description: "Quick snippets and thoughts.",
            href: "/notes",
            icon: "📝",
            color: "#3B82F6",
            className: "col-span-1 row-span-1",
        },
        {
            title: "TIL",
            description: "Small wins in knowledge.",
            href: "/til",
            icon: "💡",
            color: "#10B981",
            className: "col-span-1 row-span-1",
        },
        {
            title: "Journey",
            description: "Path of a broken wanderer.",
            href: "/journey",
            icon: "🗺️",
            color: "#F59E0B",
            className: "col-span-1 row-span-1",
        },
        {
            title: "Ideas",
            description: "Potensi yang meledak.",
            href: "/ideas",
            icon: "🧠",
            color: "#EC4899",
            className: "col-span-1 row-span-1",
        },
        {
            title: "Bookshelf",
            description: "Apa yang saya baca.",
            href: "/bookshelf",
            icon: "📚",
            color: "#6366F1",
            className: "col-span-1 row-span-1",
        },
        {
            title: "Links",
            description: "Digital rabbit holes.",
            href: "/links",
            icon: "🔗",
            color: "#06B6D4",
            className: "col-span-1 row-span-1",
        },
        {
            title: "Movie",
            description: "Cinematic magic logs.",
            href: "/movies",
            icon: "🎬",
            color: "#EF4444",
            className: "col-span-1 row-span-1",
        },
        {
            title: "Wishlist",
            description: "Dambaan personal.",
            href: "/wishlist",
            icon: "🎁",
            color: "#A855F7",
            className: "col-span-1 row-span-1",
        },
    ];

    return (
        <section style={{
            padding: "2rem 1rem 8rem",
            maxWidth: "1000px", // More compact
            margin: "0 auto",
            position: "relative",
            zIndex: 10,
        }}>
            <div style={{ marginBottom: "2rem", paddingLeft: "0.25rem" }}>
                <h2 style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.75rem",
                    color: "white",
                    marginBottom: "0.5rem",
                    letterSpacing: "-0.02em",
                }}>
                    Arsip Memori
                </h2>
                <div style={{ width: "2rem", height: "3px", background: "var(--accent)", borderRadius: "2px" }} />
            </div>

            <div
                className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5"
                style={{
                    display: "grid",
                }}
            >
                {archives.map((item, idx) => (
                    <BentoCard
                        key={idx}
                        {...item}
                        delay={idx * 0.04}
                        className="aspect-square" // Make it look like app icons
                    />
                ))}
            </div>
        </section>
    );
}
