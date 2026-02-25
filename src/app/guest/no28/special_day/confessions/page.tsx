"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Moon } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { useTheme } from "@/components/guest/no28/ThemeContext";
import { ThemeToggle } from "@/components/guest/no28/ThemeToggle";
import "../../../../globals.css";

// --- Shared UI ---

const HandwrittenNote = ({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <span style={{ fontFamily: "'Caveat', cursive, 'Brush Script MT'", color: "#c8b8a4", fontSize: "1.2rem", display: "inline-block", lineHeight: 1.2, ...style }}>{children}</span>
);

// --- Handmade Primitives ---

const TinyObject = ({ emoji, size = 16, top, left, right, bottom, rotate = 0, delay = 0 }: {
    emoji: string; size?: number;
    top?: string; left?: string; right?: string; bottom?: string;
    rotate?: number; delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6, ease: "backOut" }}
        style={{
            position: "absolute", top, left, right, bottom,
            fontSize: size, lineHeight: 1, zIndex: 3,
            transform: `rotate(${rotate}deg)`, pointerEvents: "none",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
        }}
    >
        {emoji}
    </motion.div>
);

const WashiTape = ({ color = "#2a2a4a", rotate = -1, width = "90px" }: { color?: string; rotate?: number; width?: string }) => (
    <div style={{
        position: "absolute", top: "-1px", left: "50%",
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        width, height: "22px",
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}bb 100%)`,
        opacity: 0.85, borderRadius: "1px", zIndex: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    }} />
);

// --- Page ---

export default function ConfessionsPage() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { tokens: T } = useTheme();

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!mounted) return null;

    // Placeholder poems — user will provide full drafts
    const poems = [
        {
            title: "Malam Pertama",
            excerpt: "Aku tak tahu kapan persisnya kamu mulai tinggal di pikiranku. Mungkin di antara senja yang tak sempat kupandang, atau di malam yang terlalu sunyi untuk ditanggung sendiri.",
            date: "Malam ke-1"
        },
        {
            title: "Bayangan di Air",
            excerpt: "Kamu seperti pantulan bulan di permukaan air — terlihat begitu dekat, namun setiap kali kutanggapkan tangan, kamu beriak dan menghilang.",
            date: "Malam ke-2"
        },
        {
            title: "Yang Tak Terucap",
            excerpt: "Ada banyak hal yang ingin kukatakan padamu. Tapi kata-kata selalu datang terlambat, seperti hujan yang baru turun setelah bumi kehausan.",
            date: "Malam ke-3"
        }
    ];

    return (
        <div style={{
            background: "linear-gradient(180deg, #0d1117 0%, #161b22 30%, #1a1f2e 60%, #0d1117 100%)",
            minHeight: "100svh",
            color: "#c8b8a4",
            fontFamily: "'Crimson Pro', serif, -apple-system",
            position: "relative",
            overflowX: "hidden",
            paddingBottom: "5rem"
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />

            {/* Stars */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
                {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i}
                        style={{
                            position: "absolute", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                            width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`,
                            borderRadius: "50%", background: "#fff",
                            animation: `twinkleStar ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`
                        }}
                    />
                ))}
            </div>

            {/* Moon */}
            <motion.div
                animate={{ y: [0, -10, 0], opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const }}
                style={{ position: "fixed", top: isMobile ? "5%" : "8%", right: isMobile ? "10%" : "15%", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #ffecd2 0%, #e8d5b7 30%, #c4a67d 60%, transparent 70%)", boxShadow: "0 0 60px rgba(255, 236, 210, 0.15), 0 0 120px rgba(255, 236, 210, 0.05)", zIndex: 1, pointerEvents: "none" }}
            />

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "1.5rem 0" : "6rem 0" }}>
                <Container>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", marginBottom: isMobile ? "2.5rem" : "6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <Link href="/guest/no28/special_day" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#c8b8a4" }}>
                                <ArrowLeft size={22} strokeWidth={2} />
                            </Link>
                            <div>
                                <div style={{ fontSize: "0.65rem", color: "rgba(200,184,164,0.5)", textTransform: "uppercase", letterSpacing: "2.5px", fontWeight: 700 }}>Confessions to the Moon</div>
                                <HandwrittenNote style={{ fontSize: "1.1rem", color: "#e8d5b7" }}>Bisikan malam yang tak terucap</HandwrittenNote>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>

                    {/* Intro */}
                    <div style={{ textAlign: "center", marginBottom: isMobile ? "2.5rem" : "6rem", maxWidth: "600px", margin: "0 auto" }}>
                        <Moon size={28} color="#e8d5b7" style={{ margin: "0 auto 1.5rem", opacity: 0.4 }} />
                        <p style={{ fontSize: isMobile ? "1.1rem" : "1.3rem", fontStyle: "italic", color: "rgba(200,184,164,0.7)", lineHeight: 1.8, fontFamily: "'Crimson Pro', serif" }}>
                            &ldquo;But what is strange — and what would need a whole book to explain — is that in none of these confessions would there be any real truth.&rdquo;
                        </p>
                        <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "rgba(200,184,164,0.4)" }}>
                            — Fyodor Dostoevsky, <em>White Nights</em>
                        </div>
                    </div>

                    {/* Poems Series */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "3rem", maxWidth: "700px", margin: "4rem auto 0" }}>
                        {poems.map((poem, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 1, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                            >
                                <div style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    borderRadius: "4px",
                                    padding: isMobile ? "2rem 1.5rem" : "3rem 2.5rem",
                                    position: "relative"
                                }}>
                                    <WashiTape color={i % 2 === 0 ? "#2a2a4a" : "#302b40"} rotate={i % 2 === 0 ? -1.5 : 2} width="80px" />
                                    <TinyObject emoji="✨" size={14} top="15px" left="20px" rotate={15} delay={0.2} />

                                    <div style={{ fontSize: "0.6rem", color: "rgba(200,184,164,0.3)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "1rem", fontFamily: "'Crimson Pro', serif", fontWeight: 700 }}>
                                        {poem.date}
                                    </div>
                                    <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: "1.8rem", fontWeight: 700, color: "#e8d5b7", marginBottom: "0.5rem" }}>
                                        {poem.title}
                                    </h3>
                                    <p style={{ fontSize: "1rem", color: "rgba(200,184,164,0.7)", lineHeight: 1.8, fontFamily: "'Crimson Pro', serif", fontStyle: "italic" }}>
                                        &ldquo;{poem.excerpt}&rdquo;
                                    </p>

                                    {/* Bottom Ornament */}
                                    <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div style={{ width: "30px", height: "1px", background: "rgba(200,184,164,0.15)" }} />
                                        <HandwrittenNote style={{ fontSize: "1rem", opacity: 0.6 }}>★</HandwrittenNote>
                                        <div style={{ width: "30px", height: "1px", background: "rgba(200,184,164,0.15)" }} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Coming soon hint */}
                    <div style={{ textAlign: "center", marginTop: "4rem" }}>
                        <HandwrittenNote style={{ fontSize: "1.2rem", color: "rgba(200,184,164,0.3)" }}>
                            ...masih ada malam-malam lain yang menunggu untuk diceritakan.
                        </HandwrittenNote>
                    </div>

                </Container>
            </main>
        </div>
    );
}
