"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Moon, Star, Sparkles, Quote } from "lucide-react";
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
    const drops = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 15,
        duration: 20 + Math.random() * 10,
        size: 5 + Math.random() * 10,
        color: ["rgba(143, 160, 196, 0.4)", "rgba(167, 139, 250, 0.3)", "rgba(129, 140, 248, 0.3)"][Math.floor(Math.random() * 3)],
        blur: 2 + Math.random() * 4
    })), []);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
            {drops.map(drop => (
                <div
                    key={drop.id}
                    style={{
                        position: "absolute", left: drop.left, top: "-20px", width: drop.size, height: drop.size,
                        borderRadius: "50%", background: drop.color, filter: `blur(${drop.blur}px)`,
                        animation: `wc-paint-drop ${drop.duration}s linear ${drop.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
};

export default function ConfessionsPage() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { tokens: T, mode } = useTheme();

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!mounted) return null;

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
        <div className="bg-wc-canvas wc-scrollbar" style={{
            minHeight: "100svh", color: T.textPrimary, position: "relative", overflowX: "hidden", paddingBottom: "10rem",
            // For confessions, we force a slightly moonlit feel if it's default mode
            background: mode === "default" ? "linear-gradient(180deg, #fdf8f4 0%, #e8e2d9 100%)" : T.pageBg,
            transition: "background 0.5s ease"
        }}>
            {/* Stars & Night Overlay (Specific to this page's celestial theme) */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: mode === "default" ? 0.3 : 0.8 }}>
                {Array.from({ length: 80 }).map((_, i) => (
                    <motion.div key={i}
                        animate={{ opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
                        style={{
                            position: "absolute", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                            width: "2px", height: "2px", background: mode === "default" ? T.accent : "#fff", borderRadius: "50%"
                        }}
                    />
                ))}
            </div>

            <AmbientPaintDrops />

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "2rem 0" : "4rem 0" }}>
                <Container>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                            <Link href="/guest/no28/special_day" className="wc-card hover-ink-bleed" style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "48px", height: "48px", backgroundColor: T.cardBg,
                                borderRadius: "14px", color: T.textPrimary, border: `1px solid ${T.cardBorder}`
                            }}>
                                <ArrowLeft size={24} />
                            </Link>
                            <div style={{ textAlign: "left" }}>
                                <div className="font-serif-display" style={{ fontSize: "0.7rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "3px", fontWeight: 700, opacity: 0.8 }}>Confessions to the Moon</div>
                                <HandwrittenText style={{ fontSize: "1rem", color: T.textAccent }}>Bisikan malam yang tak terucap</HandwrittenText>
                            </div>
                        </div>
                    </div>

                    {/* Moon Illustration */}
                    <div style={{ textAlign: "center", marginBottom: "8rem", position: "relative" }}>
                        <motion.div
                            animate={{ y: [-15, 0, -15], filter: ["blur(0px)", "blur(2px)", "blur(0px)"] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            style={{ width: "140px", height: "140px", margin: "0 auto", borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fffef0 0%, #fadded 40%, transparent 80%)", boxShadow: "0 0 60px rgba(253, 221, 221, 0.2)", position: "relative" }}
                        >
                            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px dashed rgba(0,0,0,0.05)", opacity: 0.2 }} />
                        </motion.div>

                        <div style={{ marginTop: "4rem", maxWidth: "600px", marginInline: "auto" }}>
                            <Quote size={28} color={T.accent} style={{ margin: "0 auto 2.5rem", opacity: 0.3 }} />
                            <p className="font-serif" style={{ fontSize: isMobile ? "1.2rem" : "1.5rem", fontStyle: "italic", color: T.textSecondary, lineHeight: 1.8, opacity: 0.9 }}>
                                &ldquo;But what is strange — and what would need a whole book to explain — is that in none of these confessions would there be any real truth.&rdquo;
                            </p>
                            <div className="font-serif-display" style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: T.textMuted, opacity: 0.6, letterSpacing: "2px" }}>
                                — FYODOR DOSTOEVSKY, WHITE NIGHTS
                            </div>
                        </div>
                    </div>

                    {/* Poems Collection */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4rem", maxWidth: "760px", marginInline: "auto" }}>
                        {poems.map((poem, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                                <div className="wc-card hover-ink-bleed" style={{ padding: isMobile ? "2.5rem 1.8rem" : "4rem 4rem", position: "relative", border: `1px solid ${T.cardBorder}` }}>
                                    <WashStripe type="lavender" />

                                    <div className="font-serif-display" style={{ fontSize: "0.7rem", color: T.textAccent, textTransform: "uppercase", letterSpacing: "3px", marginBottom: "1.5rem", opacity: 0.7 }}>
                                        {poem.date}
                                    </div>

                                    <h3 className="font-serif-display" style={{ fontSize: "1.8rem", fontWeight: 400, color: T.textPrimary, fontStyle: "italic", marginBottom: "2rem" }}>
                                        {poem.title}
                                    </h3>

                                    <p className="font-serif" style={{ fontSize: "1.15rem", color: T.textSecondary, lineHeight: 1.9, fontWeight: 300, opacity: 0.95 }}>
                                        {poem.excerpt}
                                    </p>

                                    {/* Bottom Ornament */}
                                    <div style={{ marginTop: "3rem", display: "flex", alignItems: "center", gap: "10px", opacity: 0.4 }}>
                                        <div style={{ width: "30px", height: "1px", background: T.dividerColor }} />
                                        <Sparkles size={14} color={T.accent} />
                                        <div style={{ width: "30px", height: "1px", background: T.dividerColor }} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: "center", marginTop: "10rem" }}>
                        <HandwrittenText style={{ fontSize: "1.3rem", color: T.textMuted, opacity: 0.6 }}>
                            ...masih ada malam-malam lain yang menunggu untuk diceritakan.
                        </HandwrittenText>
                    </div>

                </Container>
            </main>
        </div>
    );
}
