"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface AppIconProps {
    title: string;
    href: string;
    iconPath: string;
    delay?: number;
}

const AppIcon = ({ title, href, iconPath, delay = 0 }: AppIconProps) => {
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
                    gap: "0.5rem",
                }}
            >
                {/* The App Icon */}
                <div style={{
                    position: "relative",
                    width: "clamp(60px, 18vw, 84px)", // Typical iPhone icon size scaling
                    height: "clamp(60px, 18vw, 84px)",
                    borderRadius: "22%", // The "Squircle" radius
                    overflow: "hidden",
                    boxShadow: "0 10px 20px -5px rgba(0,0,0,0.4)",
                    transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                }} className="group-hover:scale-110 group-active:scale-95">
                    <Image
                        src={iconPath}
                        alt={title}
                        fill
                        sizes="120px"
                        style={{
                            objectFit: "cover",
                            transform: "scale(1.05)", // Slight zoom to fill the squircle nicely
                        }}
                    />
                    {/* Glossy Overlay */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)",
                        pointerEvents: "none",
                        zIndex: 1,
                    }} />
                </div>

                {/* App Label */}
                <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "rgba(255, 255, 255, 0.9)",
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
        { title: "Writing", href: "/blog", iconPath: "/images/icons/writing.png" },
        { title: "Notes", href: "/notes", iconPath: "/images/icons/notes.png" },
        { title: "TIL", href: "/til", iconPath: "/images/icons/til.png" },
        { title: "Journey", href: "/journey", iconPath: "/images/icons/journey.png" },
        { title: "Ideas", href: "/ideas", iconPath: "/images/icons/ideas.png" },
        { title: "Bookshelf", href: "/bookshelf", iconPath: "/images/icons/bookshelf.png" },
        { title: "Links", href: "/links", iconPath: "/images/icons/links.png" },
        { title: "Movie", href: "/movies", iconPath: "/images/icons/movie.png" },
        { title: "Wishlist", href: "/wishlist", iconPath: "/images/icons/wishlist.png" },
    ];

    return (
        <section style={{
            padding: "2rem 1.5rem 10rem",
            maxWidth: "500px", // iPhone-width centered section
            margin: "0 auto",
            position: "relative",
            zIndex: 10,
        }}>
            {/* Home Screen Header Container */}
            <div style={{ marginBottom: "3rem", textAlign: "center" }}>
                <h2 style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.25rem",
                    color: "rgba(255,255,255,0.6)",
                    fontWeight: 400,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                }}>
                    Memory Deck
                </h2>
            </div>

            {/* App Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)", // 4-column iPhone layout
                    gap: "1.5rem 1rem",
                    padding: "0 0.5rem",
                }}
            >
                {apps.map((app, idx) => (
                    <AppIcon key={idx} {...app} delay={idx * 0.05} />
                ))}
            </div>

        </section>
    );
}
