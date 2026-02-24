"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Moon, Sparkles, Music, ChevronRight, ChevronDown, Star, Heart, Wind } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    const drops = useMemo(() => Array.from({ length: 14 }).map((_, i) => ({
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

const FloatingMist = () => (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.35, 0.25], x: [-15, 15, -15] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", top: "10%", right: "-5%", width: "500px", height: "500px", background: "radial-gradient(circle, var(--wc-wash-blue-light) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3], x: [15, -15, 15] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ position: "absolute", bottom: "5%", left: "-5%", width: "600px", height: "600px", background: "radial-gradient(circle, var(--wc-wash-rose-light) 0%, transparent 70%)", filter: "blur(90px)" }}
        />
    </div>
);

const MiniEqualizer = ({ color = "#87b0a5", bars = 5 }: { color?: string; bars?: number }) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "28px" }}>
        {Array.from({ length: bars }).map((_, i) => (
            <motion.div key={i}
                animate={{ height: [4, 12 + Math.random() * 16, 6, (12 + Math.random() * 16) * 0.7, 4] }}
                transition={{ duration: 0.6 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                style={{ width: "3px", borderRadius: "2px", backgroundColor: color, opacity: 0.7 }}
            />
        ))}
    </div>
);

export default function SpecialDayHub() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { tokens: T, mode } = useTheme();
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!mounted) return null;

    return (
        <div className="bg-wc-canvas wc-scrollbar" style={{
            minHeight: "100svh", color: T.textPrimary, position: "relative", overflowX: "hidden",
            backgroundImage: T.pageBgDots, backgroundSize: T.pageBgSize, transition: "background-color 0.5s ease"
        }}>
            <FloatingMist />
            <AmbientPaintDrops />

            <main style={{ position: "relative", zIndex: 10 }}>

                {/* HERO SECTION */}
                <motion.section style={{ opacity: heroOpacity, scale: heroScale }}>
                    <Container>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "2rem 0 0" : "3rem 0 0" }}>
                            <Link href="/guest/no28" className="wc-card hover-ink-bleed" style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "48px", height: "48px", backgroundColor: T.cardBg,
                                borderRadius: "14px", color: T.textPrimary, border: `1px solid ${T.cardBorder}`
                            }}>
                                <ArrowLeft size={24} strokeWidth={2} />
                            </Link>
                        </div>

                        <div style={{
                            display: "flex", flexDirection: isMobile ? "column" : "row",
                            alignItems: "center", justifyContent: "center", gap: isMobile ? "2.5rem" : "5rem",
                            minHeight: isMobile ? "70svh" : "85svh", paddingBottom: isMobile ? "2rem" : "4rem"
                        }}>
                            {/* Illustration with Watercolor Splash */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                                style={{ position: "relative", flexShrink: 0 }}
                            >
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ position: "relative" }}>
                                    {/* Main illustration with organic watercolor edge */}
                                    <div className="wc-card" style={{
                                        width: isMobile ? "220px" : "300px", height: isMobile ? "280px" : "380px",
                                        position: "relative", overflow: "hidden", border: `1px solid ${T.cardBorder}`,
                                        transform: "rotate(-1.5deg)", transition: "all 0.5s var(--wc-ease)"
                                    }}>
                                        <Image src="/special_hijabi_main.webp" alt="" fill style={{ objectFit: "cover", opacity: 0.95 }} />
                                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.05))" }} />
                                    </div>

                                    {/* Botanical Accents */}
                                    <motion.div
                                        animate={{ rotate: [0, 8, -4, 0], scale: [1, 1.08, 1] }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                        style={{ position: "absolute", bottom: "-35px", right: "-45px", width: "140px", height: "140px", opacity: 0.8, mixBlendMode: mode === "default" ? "multiply" : "screen", zIndex: 2 }}
                                    >
                                        <Image src="/special_peony.webp" alt="" fill style={{ objectFit: "contain" }} />
                                    </motion.div>
                                    <div style={{ position: "absolute", top: "-30px", left: "-40px", width: "100px", height: "100px", opacity: 0.5, transform: "rotate(20deg) scaleX(-1)", mixBlendMode: mode === "default" ? "multiply" : "screen", zIndex: 2 }}>
                                        <Image src="/special_wildflowers.webp" alt="" fill style={{ objectFit: "contain" }} />
                                    </div>

                                    {/* Background Splash */}
                                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "450px", height: "450px", opacity: 0.4, zIndex: -1, mixBlendMode: mode === "default" ? "multiply" : "screen" }}>
                                        <Image src="/watercolor_splash.webp" alt="" fill style={{ objectFit: "contain" }} />
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Hero Text */}
                            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.6 }} style={{ textAlign: isMobile ? "center" : "left", maxWidth: "460px" }}>
                                <div className="font-serif-display" style={{ fontSize: "0.75rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "4px", fontWeight: 700, marginBottom: "1.2rem", opacity: 0.8 }}>
                                    Bingkisan Kecil Untukmu
                                </div>
                                <h1 className="font-serif-display" style={{ fontSize: isMobile ? "2.6rem" : "3.8rem", fontWeight: 400, color: T.textPrimary, lineHeight: 1.1, marginBottom: "1.5rem", fontStyle: "italic" }}>
                                    Selamat Datang di Ruang Kecilmu
                                </h1>
                                <p className="font-serif" style={{ fontSize: "1.2rem", color: T.textSecondary, lineHeight: 1.7, fontWeight: 300, opacity: 0.9 }}>
                                    Sebuah tempat yang tercipta khusus untukmu — untuk merayakan setiap jejak langkah, setiap cerita, dan setiap melodi yang menggambarkan siapa dirimu.
                                </p>
                                <div style={{ marginTop: "2rem" }}>
                                    <HandwrittenText style={{ fontSize: "1.2rem", color: T.textAccent }}>
                                        ...sebagai bukti bahwa kamu selalu terlihat.
                                    </HandwrittenText>
                                </div>
                            </motion.div>
                        </div>

                        {/* Scroll hint */}
                        <motion.div animate={{ y: [0, 10, 0], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ textAlign: "center", paddingBottom: "3rem" }}>
                            <HandwrittenText style={{ fontSize: "0.95rem", opacity: 0.6, display: "block", marginBottom: "8px" }}>jelajahi halaman ini</HandwrittenText>
                            <ChevronDown size={22} color={T.textSecondary} style={{ opacity: 0.4 }} />
                        </motion.div>
                    </Container>
                </motion.section>

                {/* GATEWAY CARDS */}
                <section style={{ padding: "4rem 0 10rem" }}>
                    <Container>
                        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={{ show: { transition: { staggerChildren: 0.2 } } }} style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>

                            {/* CARD: HISTORY */}
                            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}>
                                <Link href="/guest/no28/special_day/history" style={{ textDecoration: "none", color: "inherit" }}>
                                    <div className="wc-card wc-border-left hover-ink-bleed" style={{ padding: isMobile ? "2.5rem 1.5rem" : "3.5rem 3rem", position: "relative", border: `1px solid ${T.cardBorder}` }}>
                                        <WashStripe type="ochre" />
                                        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "3rem", alignItems: "center" }}>
                                            {/* Stacked Photos Preview */}
                                            <div style={{ position: "relative", width: "200px", height: "140px", flexShrink: 0 }}>
                                                {[
                                                    { src: "/portrait_4.webp", rotate: -8, left: 10, zIndex: 1 },
                                                    { src: "/portrait_1.webp", rotate: 4, left: 70, zIndex: 2 },
                                                    { src: "/portrait_2.webp", rotate: -3, left: 130, zIndex: 3 },
                                                ].map((photo, i) => (
                                                    <div key={i} className="wc-card" style={{ position: "absolute", top: 0, left: photo.left, width: "80px", height: "100px", padding: "5px 5px 20px", background: "#fff", transform: `rotate(${photo.rotate}deg)`, zIndex: photo.zIndex, border: "none", boxShadow: "var(--wc-shadow-sm)" }}>
                                                        <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "#f0ece6" }}>
                                                            <Image src={photo.src} alt="" fill style={{ objectFit: "cover" }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
                                                <div className="font-serif-display" style={{ display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start", gap: "10px", marginBottom: "0.8rem" }}>
                                                    <BookOpen size={16} color={T.textAccent} />
                                                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "3px" }}>Brief History of You</span>
                                                </div>
                                                <h3 className="font-serif-display" style={{ fontSize: "1.8rem", color: T.textPrimary, marginBottom: "0.8rem", fontStyle: "italic" }}>Jejak-jejak yang membentuk dirimu</h3>
                                                <p className="font-serif" style={{ color: T.textSecondary, opacity: 0.8 }}>Polaroid, lini masa unik, hingga posisi bulan di hari lahirmu...</p>
                                            </div>
                                            <ChevronRight size={28} color={T.accent} style={{ opacity: 0.4 }} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>

                            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "3rem" }}>
                                {/* CARD: CONFESSIONS */}
                                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}>
                                    <Link href="/guest/no28/special_day/confessions" style={{ textDecoration: "none", color: "inherit" }}>
                                        <div className="wc-card" style={{ height: "100%", padding: "3rem 2rem", background: mode === "night" ? "rgba(20,26,36,0.95)" : "rgba(30,35,50,0.95)", border: mode === "night" ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,255,255,0.1)", minHeight: "320px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <WashStripe type="blue" />
                                            {/* Twinkly stars background inside card */}
                                            <div style={{ position: "absolute", inset: 0, opacity: 0.2, overflow: "hidden", pointerEvents: "none" }}>
                                                {Array.from({ length: 15 }).map((_, i) => (
                                                    <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: "2px", height: "2px", background: "#fff", borderRadius: "50%", animation: `twinkleStar ${2 + Math.random() * 3}s infinite` }} />
                                                ))}
                                            </div>

                                            <div style={{ position: "relative" }}>
                                                <div className="font-serif-display" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                                                    <Moon size={16} color="#8fa0c4" />
                                                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8fa0c4", textTransform: "uppercase", letterSpacing: "3px" }}>Confessions to the Moon</span>
                                                </div>
                                                <h3 className="font-serif-display" style={{ fontSize: "1.6rem", color: "#e0dbd4", marginBottom: "1rem", fontStyle: "italic" }}>Bisikan malam yang tak terucap</h3>
                                                <HandwrittenText style={{ color: "#c8b8a4", fontSize: "1.1rem", opacity: 0.8 }}>"Malam ini bulan bercerita tentangmu..."</HandwrittenText>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <ChevronRight size={24} color="#8fa0c4" style={{ opacity: 0.5 }} />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>

                                {/* CARD: YEAR */}
                                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}>
                                    <Link href="/guest/no28/special_day/year" style={{ textDecoration: "none", color: "inherit" }}>
                                        <div className="wc-card" style={{ height: "100%", padding: "3rem 2rem", border: `1px solid ${T.cardBorder}`, minHeight: "320px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <WashStripe type="sage" />
                                            <div>
                                                <div className="font-serif-display" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                                                    <Sparkles size={16} color={T.textAccent} />
                                                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "3px" }}>Tahun Istimewanya</span>
                                                </div>
                                                <h3 className="font-serif-display" style={{ fontSize: "1.6rem", color: T.textPrimary, marginBottom: "1rem", fontStyle: "italic" }}>365 hari perjalanan tahun ini</h3>
                                                {/* Mini dot grid preview */}
                                                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "1rem", opacity: 0.6 }}>
                                                    {Array.from({ length: 28 }).map((_, i) => (
                                                        <div key={i} style={{ width: "8px", height: "8px", borderRadius: "2px", backgroundColor: i < 18 ? T.accent : T.dividerColor, opacity: i === 17 ? 1 : 0.4 }} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <ChevronRight size={24} color={T.accent} style={{ opacity: 0.5 }} />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </div>

                            {/* CARD: MELODY */}
                            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}>
                                <Link href="/guest/no28/special_day/melody" style={{ textDecoration: "none", color: "inherit" }}>
                                    <div className="wc-card wc-border-left hover-ink-bleed" style={{ padding: "3rem", border: `1px solid ${T.cardBorder}` }}>
                                        <WashStripe type="lavender" />
                                        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "3rem", alignItems: "center" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: `${T.accentGlow}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Music size={24} color={T.accent} />
                                                </div>
                                                <MiniEqualizer color={T.accent} bars={8} />
                                            </div>
                                            <div style={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
                                                <div className="font-serif-display" style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "3px", marginBottom: "0.5rem" }}>Melody for You</div>
                                                <h3 className="font-serif-display" style={{ fontSize: "1.8rem", color: T.textPrimary, fontStyle: "italic" }}>Lagu-lagu yang menggambarkan dirimu</h3>
                                            </div>
                                            <ChevronRight size={28} color={T.accent} style={{ opacity: 0.4 }} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* CLOSING / FOOTER */}
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 1 }} style={{ marginTop: "10rem", textAlign: "center", position: "relative" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", justifyContent: "center", marginBottom: "3rem" }}>
                                <div style={{ width: "80px", height: "1px", background: `linear-gradient(to right, transparent, ${T.dividerColor})` }} />
                                <Heart size={18} color={T.accent} fill={T.accent} style={{ opacity: 0.4 }} />
                                <div style={{ width: "80px", height: "1px", background: `linear-gradient(to left, transparent, ${T.dividerColor})` }} />
                            </div>

                            <div style={{ width: "80px", height: "80px", position: "relative", margin: "0 auto 2rem", opacity: 0.6, mixBlendMode: mode === "default" ? "multiply" : "screen" }}>
                                <Image src="/special_wildflowers.webp" alt="" fill style={{ objectFit: "contain" }} />
                            </div>

                            <HandwrittenText style={{ fontSize: "1.6rem", color: T.textAccent, display: "block", marginBottom: "0.5rem" }}>Ruang ini tercipta untuk merayakan</HandwrittenText>
                            <HandwrittenText style={{ fontSize: "1.6rem", color: T.textAccent, display: "block", marginBottom: "2.5rem" }}>setiap jejak langkah kecilmu.</HandwrittenText>
                            <div className="font-serif-display" style={{ fontSize: "0.75rem", color: T.textSecondary, letterSpacing: "4px", textTransform: "uppercase", fontWeight: 700, opacity: 0.5 }}>Dengan sepenuh hati</div>
                        </motion.div>
                    </Container>
                </section>
            </main>
        </div>
    );
}
