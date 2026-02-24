"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Music, Play, ExternalLink, Headphones } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { useTheme } from "@/components/guest/no28/ThemeContext";

// --- Watercolor Components ---

const HandwrittenText = ({ children, style = {}, className = "" }: { children: React.ReactNode, style?: React.CSSProperties, className?: string }) => (
    <span className={`font-handwriting ${className}`} style={{ fontSize: "1.25rem", display: "inline-block", lineHeight: 1.2, ...style }}>
        {children}
    </span>
);

const WashStripe = ({ type = "blue" as "blue" | "sage" | "rose" | "ochre" | "lavender" }) => (
    <div className={`wc-wash-stripe wc-wash-stripe--${type}`} />
);

const AmbientPaintDrops = () => {
    const drops = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 15,
        duration: 15 + Math.random() * 10,
        size: 8 + Math.random() * 12,
        color: ["var(--wc-wash-blue-light)", "var(--wc-wash-sage-light)", "var(--wc-wash-rose-light)", "var(--wc-wash-ochre-light)"][Math.floor(Math.random() * 4)],
        blur: 1 + Math.random() * 3
    })), []);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
            {drops.map(drop => (
                <div
                    key={drop.id}
                    style={{
                        position: "absolute", left: drop.left, top: "-20px", width: drop.size, height: drop.size,
                        borderRadius: "50%", background: drop.color, filter: `blur(${drop.blur}px)`, opacity: 0.35,
                        animation: `wc-paint-drop ${drop.duration}s linear ${drop.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
};

// --- Types ---
interface Song {
    title: string;
    artist: string;
    note: string;
    lyricHighlight?: string;
    type: "blue" | "sage" | "rose" | "ochre" | "lavender";
    emoji: string;
}

export default function MelodyPage() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [expandedSong, setExpandedSong] = useState<number | null>(null);
    const { tokens: T, mode } = useTheme();

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!mounted) return null;

    const songs: Song[] = [
        {
            title: "Here Comes the Sun",
            artist: "The Beatles",
            note: "Karena setiap kali kamu datang, rasanya seperti matahari yang muncul setelah musim dingin panjang.",
            lyricHighlight: "Little darling, it's been a long cold lonely winter...",
            type: "ochre",
            emoji: "☀️"
        },
        {
            title: "Fly Me to the Moon",
            artist: "Frank Sinatra",
            note: "Seorang yang bermimpi tinggi, yang cahayanya menerangi kegelapan yang paling pekat.",
            lyricHighlight: "In other words, hold my hand...",
            type: "blue",
            emoji: "🌙"
        },
        {
            title: "Put Your Head on My Shoulder",
            artist: "Paul Anka",
            note: "Dunia boleh riuh, tapi kehadiranmu adalah kedamaian itu sendiri.",
            lyricHighlight: "Put your head on my shoulder, whisper in my ear, baby...",
            type: "rose",
            emoji: "💫"
        },
        {
            title: "Can't Help Falling in Love",
            artist: "Elvis Presley",
            note: "Ada hal-hal yang tak bisa dijelaskan, cukup dirasakan.",
            lyricHighlight: "Take my hand, take my whole life too...",
            type: "lavender",
            emoji: "🌹"
        }
    ];

    return (
        <div className="bg-wc-canvas wc-scrollbar" style={{
            minHeight: "100svh", color: T.textPrimary, position: "relative", overflowX: "hidden", paddingBottom: "10rem",
            backgroundImage: T.pageBgDots, backgroundSize: T.pageBgSize, transition: "background-color 0.5s ease"
        }}>
            <AmbientPaintDrops />

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "2rem 0" : "4rem 0" }}>
                <Container>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                            <Link href="/guest/no28/special_day" className="wc-card hover-ink-bleed" style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "48px", height: "48px", backgroundColor: T.cardBg,
                                borderRadius: "14px", color: T.textPrimary, border: `1px solid ${T.cardBorder}`
                            }}>
                                <ArrowLeft size={24} />
                            </Link>
                            <div style={{ textAlign: "left" }}>
                                <div className="font-serif-display" style={{ fontSize: "0.7rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "3px", fontWeight: 700, opacity: 0.8 }}>Melody for You</div>
                                <HandwrittenText style={{ fontSize: "1rem", color: T.textAccent }}>Lagu-lagu yang menggambarkan dirimu</HandwrittenText>
                            </div>
                        </div>
                    </div>

                    {/* Intro Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "6rem", maxWidth: "560px", marginInline: "auto" }}>
                        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--wc-wash-lavender-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", opacity: 0.6 }}>
                            <Headphones size={28} color={T.accent} />
                        </div>
                        <p className="font-serif" style={{ fontSize: "1.2rem", color: T.textSecondary, fontStyle: "italic", lineHeight: 1.8, opacity: 0.9 }}>
                            "Setiap lagu di sini dipilih bukan karena kebetulan, tapi karena ada sesuatu di dalamnya yang mengingatkan aku padamu."
                        </p>
                    </motion.div>

                    {/* Song List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "720px", marginInline: "auto" }}>
                        {songs.map((song, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <div
                                    onClick={() => setExpandedSong(expandedSong === i ? null : i)}
                                    className="wc-card hover-ink-bleed"
                                    style={{
                                        padding: isMobile ? "2rem" : "2.5rem 3rem",
                                        cursor: "pointer",
                                        position: "relative",
                                        border: `1px solid ${T.cardBorder}`,
                                        transition: "all 0.4s var(--wc-ease)"
                                    }}
                                >
                                    <WashStripe type={song.type} />

                                    <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                                        <div className="font-serif-display" style={{ fontSize: "2.2rem", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", background: `var(--wc-wash-${song.type}-light)`, borderRadius: "16px", flexShrink: 0, opacity: 0.8 }}>
                                            {song.emoji}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 className="font-serif-display" style={{ fontSize: "1.4rem", fontWeight: 400, color: T.textPrimary, fontStyle: "italic", marginBottom: "4px" }}>{song.title}</h3>
                                            <div style={{ fontSize: "0.85rem", color: T.textMuted, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, opacity: 0.6 }}>{song.artist}</div>
                                        </div>
                                        <motion.div animate={{ rotate: expandedSong === i ? 90 : 0, scale: expandedSong === i ? 1.2 : 1 }} transition={{ duration: 0.3 }}>
                                            <Play size={20} color={T.accent} style={{ opacity: 0.4 }} />
                                        </motion.div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedSong === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                                style={{ overflow: "hidden" }}
                                            >
                                                <div style={{ marginTop: "2.5rem", borderTop: `1px dashed ${T.dividerColor}`, paddingTop: "2.5rem" }}>
                                                    {song.lyricHighlight && (
                                                        <div className="font-serif" style={{ fontSize: "1.1rem", fontStyle: "italic", color: T.textAccent, marginBottom: "1.5rem", lineHeight: 1.7, opacity: 0.85 }}>
                                                            &ldquo;{song.lyricHighlight}&rdquo;
                                                        </div>
                                                    )}
                                                    <p className="font-handwriting" style={{ fontSize: "1.2rem", lineHeight: 1.6, color: T.textSecondary, opacity: 0.9 }}>
                                                        {song.note}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer Progress */}
                    <div style={{ marginTop: "8rem", textAlign: "center" }}>
                        <HandwrittenText style={{ fontSize: "1.2rem", color: T.textMuted, opacity: 0.6 }}>
                            ...masih banyak melodi yang belum diceritakan.
                        </HandwrittenText>
                    </div>
                </Container>
            </main>
        </div>
    );
}
