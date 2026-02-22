"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Music, Play, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { useTheme } from "@/components/guest/no28/ThemeContext";
import { ThemeToggle } from "@/components/guest/no28/ThemeToggle";

// --- Shared UI ---

const HandwrittenNote = ({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <span style={{ fontFamily: "'Caveat', cursive, 'Brush Script MT'", color: "#a0907d", fontSize: "1.2rem", display: "inline-block", lineHeight: 1.2, ...style }}>{children}</span>
);

const NoiseOverlay = () => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, opacity: 0.07, background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, mixBlendMode: "overlay" as const }} />
);

// --- Types ---
interface Song {
    title: string;
    artist: string;
    note: string;
    lyricHighlight?: string;
    color: string;
    emoji: string;
}

// --- Page ---

export default function MelodyPage() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [expandedSong, setExpandedSong] = useState<number | null>(null);
    const { tokens: T } = useTheme();

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!mounted) return null;

    // Placeholder songs — user will finalize
    const songs: Song[] = [
        {
            title: "Here Comes the Sun",
            artist: "The Beatles",
            note: "Karena setiap kali kamu datang, rasanya seperti matahari yang muncul setelah musim dingin panjang.",
            lyricHighlight: "Little darling, it's been a long cold lonely winter...",
            color: "#e6a23c",
            emoji: "☀️"
        },
        {
            title: "Fly Me to the Moon",
            artist: "Frank Sinatra",
            note: "Seorang yang bermimpi tinggi, yang cahayanya menerangi kegelapan yang paling pekat.",
            lyricHighlight: "In other words, hold my hand...",
            color: "#7b8fb2",
            emoji: "🌙"
        },
        {
            title: "Put Your Head on My Shoulder",
            artist: "Paul Anka",
            note: "Dunia boleh riuh, tapi kehadiranmu adalah kedamaian itu sendiri.",
            lyricHighlight: "Put your head on my shoulder, whisper in my ear, baby...",
            color: "#d4a5a5",
            emoji: "💫"
        },
        {
            title: "Can't Help Falling in Love",
            artist: "Elvis Presley",
            note: "Ada hal-hal yang tak bisa dijelaskan, cukup dirasakan.",
            lyricHighlight: "Take my hand, take my whole life too...",
            color: "#b07d62",
            emoji: "🌹"
        }
    ];

    return (
        <div style={{ backgroundColor: T.pageBg, backgroundImage: T.pageBgDots, backgroundSize: T.pageBgSize, minHeight: "100svh", color: T.textPrimary, fontFamily: "'Crimson Pro', serif, -apple-system", position: "relative", overflowX: "hidden", paddingBottom: "5rem", transition: "background-color 0.5s ease, color 0.5s ease" }}>
            <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
            <NoiseOverlay />
            <div style={{ position: "fixed", inset: 0, opacity: 0.4, pointerEvents: "none", backgroundImage: T.paperTexture, zIndex: 5 }} />

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "4rem 0" : "6rem 0" }}>
                <Container>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <Link href="/guest/no28/special_day" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", background: T.buttonBg, border: `2px solid ${T.buttonBorder}`, borderRadius: "12px", color: T.buttonText, boxShadow: T.buttonShadow, transition: "all 0.3s ease" }}>
                                <ArrowLeft size={22} strokeWidth={2} />
                            </Link>
                            <div>
                                <div style={{ fontSize: "0.65rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "2.5px", fontWeight: 700 }}>Melody for You</div>
                                <HandwrittenNote style={{ fontSize: "1.1rem", color: T.textAccent }}>Lagu-lagu yang menggambarkan dirimu</HandwrittenNote>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>

                    {/* Intro */}
                    <div style={{ textAlign: "center", marginBottom: "3rem", maxWidth: "500px", margin: "0 auto 3rem" }}>
                        <Music size={28} color="#b07d62" style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
                        <p style={{ fontSize: "1.1rem", color: "#a0907d", fontStyle: "italic", lineHeight: 1.7 }}>
                            Setiap lagu di sini dipilih bukan karena kebetulan, tapi karena ada sesuatu di dalamnya yang mengingatkan aku padamu.
                        </p>
                    </div>

                    {/* Song List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "700px", margin: "0 auto" }}>
                        {songs.map((song, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 1, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                            >
                                <div
                                    onClick={() => setExpandedSong(expandedSong === i ? null : i)}
                                    style={{
                                        background: "#fff",
                                        backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
                                        borderRadius: "6px",
                                        border: "1px solid #e8e2d9",
                                        boxShadow: expandedSong === i ? "0 12px 32px rgba(0,0,0,0.1)" : "0 4px 12px rgba(0,0,0,0.05)",
                                        padding: isMobile ? "1.5rem" : "2rem",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        position: "relative",
                                        overflow: "hidden"
                                    }}
                                >
                                    {/* Color Accent Bar */}
                                    <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: song.color, opacity: 0.6 }} />

                                    {/* Main Row */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "1rem" }}>
                                        <div style={{ fontSize: "2rem", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", background: `${song.color}10`, borderRadius: "12px" }}>
                                            {song.emoji}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#4e4439", marginBottom: "2px" }}>{song.title}</h3>
                                            <div style={{ fontSize: "0.85rem", color: "#a0907d" }}>{song.artist}</div>
                                        </div>
                                        <motion.div animate={{ rotate: expandedSong === i ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                            <Play size={18} color={song.color} fill={song.color} fillOpacity={0.2} />
                                        </motion.div>
                                    </div>

                                    {/* Expanded Content */}
                                    {expandedSong === i && (
                                        <motion.div
                                            initial={{ opacity: 1, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            transition={{ duration: 0.3 }}
                                            style={{ paddingLeft: "1rem", marginTop: "1.5rem", borderTop: "1px dashed #e8e2d9", paddingTop: "1.5rem" }}
                                        >
                                            {song.lyricHighlight && (
                                                <div style={{ fontSize: "1rem", fontStyle: "italic", color: song.color, marginBottom: "1rem", lineHeight: 1.6, opacity: 0.8 }}>
                                                    &ldquo;{song.lyricHighlight}&rdquo;
                                                </div>
                                            )}
                                            <HandwrittenNote style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "#4e4439" }}>
                                                {song.note}
                                            </HandwrittenNote>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: "5rem", textAlign: "center" }}>
                        <div style={{ width: "40px", height: "1px", background: "#b07d62", margin: "0 auto 1.5rem", opacity: 0.3 }} />
                        <HandwrittenNote style={{ fontSize: "1.2rem", color: "#b07d62" }}>
                            ...masih banyak melodi yang belum diceritakan.
                        </HandwrittenNote>
                    </div>
                </Container>
            </main>
        </div>
    );
}
