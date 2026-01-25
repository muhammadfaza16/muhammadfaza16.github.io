"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Music, Heart, Globe, Mic2, Shuffle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ZenHideable } from "@/components/ZenHideable";

// --- Components ---

interface PlaylistCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    size?: "small" | "medium" | "large";
    delay?: number;
    imageSrc?: string;
}

const ShimmerEffect = () => (
    <div
        style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
            transform: "skewX(-20deg) translateX(-150%)",
            transition: "transform 0.5s",
            pointerEvents: "none",
            zIndex: 30,
        }}
        className="shimmer"
    />
);

const NowPlayingBar = () => (
    <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 25 }}
        style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(300px, 90%, 40rem)",
            height: "5rem",
            background: "rgba(20, 20, 20, 0.6)",
            backdropFilter: "blur(25px) saturate(180%)", // High quality Apple blur
            borderRadius: "1.25rem",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            padding: "0.75rem",
            gap: "1rem",
            overflow: "hidden"
        }}
    >
        {/* Album Art */}
        <div style={{
            width: "3.5rem",
            height: "3.5rem",
            borderRadius: "0.75rem",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            position: "relative",
            flexShrink: 0
        }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/images/playlist/all_songs.png"
                alt="Now Playing"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
        </div>

        {/* Track Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Saudade FM
            </span>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Starlight Vibes
            </span>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", paddingRight: "0.5rem" }}>
            <Music size={20} style={{ color: "rgba(255,255,255,0.5)", cursor: "pointer" }} />
            <Play fill="white" size={24} style={{ cursor: "pointer" }} />
        </div>

        {/* Progress Bar (Bottom Line) */}
        <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "2px",
            background: "rgba(255,255,255,0.1)"
        }}>
            <div style={{
                width: "33%",
                height: "100%",
                background: "white",
                borderRadius: "0 2px 2px 0"
            }} />
        </div>
    </motion.div>
);

const cardVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02 }
};

const imageVariants = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }
    }
};

const playButtonVariants = {
    rest: { opacity: 0, y: 10, scale: 0.9 },
    hover: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, ease: "easeOut" }
    }
};

const PlaylistCard = ({ title, subtitle, icon, color, size = "small", delay = 0, imageSrc }: PlaylistCardProps) => {
    const isLarge = size === "large";
    const isMedium = size === "medium";

    // Grid Column/Row Span Logic
    const gridStyle = isLarge
        ? { gridColumn: "span 2", gridRow: "span 2" }
        : isMedium
            ? { gridColumn: "span 2", gridRow: "span 1" }
            : { gridColumn: "span 1", gridRow: "span 1" };

    return (
        <motion.div
            initial="rest"
            whileHover="hover"
            whileTap="rest"
            variants={cardVariants}
            animate="rest"
            className="playlist-card"
            style={{
                ...gridStyle,
                position: "relative",
                overflow: "hidden",
                borderRadius: "1.75rem", // Slightly tighter radius for modern Apple feel
                padding: "1.5rem",
                cursor: "pointer",
                background: color, // Fallback
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)", // Deeper shadow
                border: "1px solid rgba(255, 255, 255, 0.08)",
                minHeight: isLarge ? "320px" : "150px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "white"
            }}
        >
            {/* Glossy Sheen Overlay */}
            <style jsx global>{`
                .playlist-card:hover .shimmer {
                    transform: skewX(-20deg) translateX(200%) !important;
                    transition: transform 1s ease-in-out;
                }
            `}</style>
            <ShimmerEffect />

            {/* Background Image */}
            {imageSrc && (
                <div style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0
                }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <motion.img
                        variants={imageVariants}
                        src={imageSrc}
                        alt={title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            inset: 0
                        }}
                    />
                    {/* Gradient Overlay for legibility */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)"
                    }} />
                    {/* Inner Border Highlight (Apple Glass Detail) */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "1.75rem",
                        border: "1px solid rgba(255,255,255,0.1)",
                        pointerEvents: "none"
                    }} />
                </div>
            )}


            {/* Content Flex */}
            <div style={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{
                        padding: "0",
                        width: isLarge ? "3.5rem" : "2.5rem",
                        height: isLarge ? "3.5rem" : "2.5rem",
                        borderRadius: "50%",
                        // Glass icon background
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px) saturate(150%)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        {icon}
                    </div>
                </div>

                <div>
                    <h3 style={{
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        fontSize: isLarge ? "2rem" : "1.25rem",
                        marginBottom: isLarge ? "0.25rem" : "0.1rem",
                        lineHeight: 1.1,
                        textShadow: "0 4px 12px rgba(0,0,0,0.5)"
                    }}>
                        {title}
                    </h3>
                    <p style={{
                        fontWeight: 500,
                        opacity: 0.85,
                        fontSize: isLarge ? "1.125rem" : "0.8rem",
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                    }}>
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Hover Play Button for small cards */}
            {!isLarge && (
                <motion.div
                    variants={playButtonVariants}
                    style={{
                        position: "absolute",
                        bottom: "1rem",
                        right: "1rem",
                        zIndex: 20
                    }}
                >
                    <div style={{
                        padding: "0.6rem",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.9)",
                        color: "black",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Play fill="currentColor" size={16} />
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default function PlaylistPage() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "#000", // True black
            color: "white",
            position: "relative",
            overflow: "hidden",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
        }}>
            {/* Animations Style */}
            <style>{`
                @keyframes breathe {
                    0% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.1); opacity: 0.4; }
                    100% { transform: scale(1); opacity: 0.3; }
                }
                @keyframes float {
                    0% { transform: translate(0, 0); }
                    33% { transform: translate(30px, 50px); }
                    66% { transform: translate(-20px, 20px); }
                    100% { transform: translate(0, 0); }
                }
            `}</style>

            {/* Ambient Background with Animation */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <div style={{
                    position: "absolute",
                    top: "-20%",
                    left: "-10%",
                    width: "60%",
                    height: "60%",
                    background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.3), transparent 70%)",
                    filter: "blur(100px)",
                    animation: "breathe 8s infinite ease-in-out, float 20s infinite ease-in-out alternate"
                }} />
                <div style={{
                    position: "absolute",
                    bottom: "-20%",
                    right: "-10%",
                    width: "60%",
                    height: "60%",
                    background: "radial-gradient(circle at center, rgba(236, 72, 153, 0.3), transparent 70%)",
                    filter: "blur(100px)",
                    animation: "breathe 10s infinite ease-in-out reverse, float 25s infinite ease-in-out alternate-reverse"
                }} />
            </div>

            <ZenHideable hideInZen>
                {/* Header */}
                <header style={{
                    position: "fixed",
                    top: "5rem", // Below global header
                    left: 0,
                    right: 0,
                    zIndex: 40, // Below global header z-index
                    padding: "1rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    background: "rgba(0,0,0,0.6)", // Slightly darker
                    backdropFilter: "blur(20px) saturate(180%)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)"
                }}>
                    <Link href="/starlight">
                        <div style={{
                            padding: "0.6rem",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(12px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}>
                            <ArrowLeft size={20} color="white" />
                        </div>
                    </Link>
                    <h1 style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.01em", opacity: 0.9 }}>Library</h1>
                </header>

                <main style={{
                    position: "relative",
                    zIndex: 10,
                    paddingTop: "10rem", // Account for Global Header (5rem) + Playlist Header (~4rem) + Spacer
                    paddingBottom: "10rem", // Extra space for Now Playing
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    maxWidth: "56rem", // Wider max-width
                    marginLeft: "auto",
                    marginRight: "auto"
                }}>
                    {/* Hero Section / Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginBottom: "2.5rem", paddingLeft: "0.5rem" }}
                    >
                        <h2 style={{
                            fontSize: "3.5rem",
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            marginBottom: "0.25rem",
                            background: "linear-gradient(to bottom, #ffffff 40%, rgba(255,255,255,0.5))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            lineHeight: 1
                        }}>
                            Playlists
                        </h2>
                        <div style={{ width: "4rem", height: "4px", background: "#fff", marginTop: "1rem", borderRadius: "2px", opacity: 0.8 }}></div>
                    </motion.div>

                    {/* Bento Grid layout */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1.25rem" // Slightly bigger gap
                    }}>

                        {/* 1. All Songs - The 'Master' Playlist - Large Card */}
                        <PlaylistCard
                            title="All Songs"
                            subtitle="1,240 Tracks"
                            icon={<Music size={28} />}
                            color="linear-gradient(145deg, #FF6B6B, #EE5253)"
                            size="large"
                            delay={0.1}
                            imageSrc="/images/playlist/all_songs.png"
                        />

                        {/* 2. Cemungud Cayank - Special - Medium Card */}
                        <PlaylistCard
                            title="Cemungud Cayank"
                            subtitle="Daily Boost"
                            icon={<Heart fill="white" size={20} />} // Filled heart for love
                            color="linear-gradient(145deg, #FF9F43, #FECA57)"
                            delay={0.2}
                            imageSrc="/images/playlist/mood.png"
                        />

                        {/* 3. Indo Hits */}
                        <PlaylistCard
                            title="Indo Punya"
                            subtitle="Lokal Pride"
                            icon={<Mic2 size={20} />}
                            color="linear-gradient(145deg, #54a0ff, #2e86de)"
                            delay={0.3}
                            imageSrc="/images/playlist/indo.png"
                        />

                        {/* 4. English Hits */}
                        <PlaylistCard
                            title="English"
                            subtitle="Global Top 50"
                            icon={<Globe size={20} />}
                            color="linear-gradient(145deg, #1dd1a1, #10ac84)"
                            delay={0.4}
                            imageSrc="/images/playlist/english.png"
                        />

                        {/* 5. Shuffle Mockup */}
                        <PlaylistCard
                            title="On Repeat"
                            subtitle="Your Obsessions"
                            icon={<Shuffle size={20} />}
                            color="linear-gradient(145deg, #5f27cd, #341f97)"
                            delay={0.5}
                            imageSrc="/images/playlist/repeat.png"
                        />

                    </div>
                </main>

                {/* Floating Now Playing Bar */}
                <NowPlayingBar />

            </ZenHideable>
        </div>
    );
}
