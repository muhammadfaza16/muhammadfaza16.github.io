"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, BookOpen, Moon, Sparkles, Music, ChevronRight, ChevronDown, Star, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { useTheme } from "@/components/guest/no28/ThemeContext";
import { ThemeToggle } from "@/components/guest/no28/ThemeToggle";

// ═══════════════════════════════════════════
// AMBIENT COMPONENTS (CSS GPU ACCELERATED)
// ═══════════════════════════════════════════

const FloatingParticles = ({ color }: { color: string }) => {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            {Array.from({ length: 14 }).map((_, i) => (
                <div key={i}
                    style={{
                        position: "absolute", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                        width: Math.random() * 3 + 2, height: Math.random() * 3 + 2, borderRadius: "50%",
                        background: color, filter: "blur(1px)",
                        animation: `floatParticle ${Math.random() * 20 + 12}s linear ${Math.random() * 5}s infinite`
                    }}
                />
            ))}
        </div>
    );
};

const FallingPetals = ({ gradient }: { gradient: string }) => {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}
                    style={{
                        position: "absolute", left: `${Math.random() * 100}%`,
                        width: 8 + Math.random() * 6, height: 8 + Math.random() * 6,
                        borderRadius: "50% 0 50% 50%", background: gradient,
                        willChange: "transform, opacity",
                        animation: `fallPetal ${14 + Math.random() * 6}s linear ${Math.random() * 10}s infinite`
                    }}
                />
            ))}
        </div>
    );
};

const TwinklingStars = ({ count = 12, color = "#c8b8a4" }: { count?: number; color?: string }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i}
                    style={{
                        position: "absolute", left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`,
                        width: Math.random() * 2 + 1.5, height: Math.random() * 2 + 1.5, borderRadius: "50%",
                        background: color, boxShadow: `0 0 4px ${color}`, zIndex: 1,
                        animation: `twinkleStar ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 4}s infinite`
                    }}
                />
            ))}
        </>
    );
};

const MiniEqualizer = ({ color = "#87b0a5", bars = 5 }: { color?: string; bars?: number }) => {
    return (
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
};

// ═══════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════

const staggerContainer = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { staggerChildren: 0.25, delayChildren: 0.1 } }
};

const fadeUp = {
    hidden: { opacity: 1, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 40, damping: 16 } }
};

const fadeIn = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { duration: 0.8 } }
};


// ═══════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════

export default function SpecialDayHub() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { tokens: T } = useTheme();
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

    const Note = ({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) => (
        <span style={{
            fontFamily: "'Caveat', cursive, 'Brush Script MT'",
            color: T.handwrittenColor, fontSize: "1.2rem", display: "inline-block", lineHeight: 1.2,
            transition: "color 0.5s ease", ...style
        }}>{children}</span>
    );

    return (
        <div style={{
            backgroundColor: T.pageBg, backgroundImage: T.pageBgDots, backgroundSize: T.pageBgSize,
            minHeight: "100svh", color: T.textPrimary, fontFamily: "'Crimson Pro', serif, -apple-system",
            position: "relative", overflowX: "hidden",
            transition: "background-color 0.5s ease, color 0.5s ease"
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />

            {/* Ambient Layers */}
            <FloatingParticles color={T.particleColor} />
            <FallingPetals gradient={T.petalGradient} />
            <div style={{
                position: "fixed", top: "10%", right: "-10%", width: "500px", height: "500px",
                background: `radial-gradient(circle, ${T.accentGlow} 0%, transparent 70%)`, filter: "blur(60px)",
                pointerEvents: "none", zIndex: 0, animation: "glowPulse 15s ease-in-out infinite"
            }} />
            <div style={{
                position: "fixed", bottom: "5%", left: "-5%", width: "450px", height: "450px",
                background: `radial-gradient(circle, ${T.accentGlow} 0%, transparent 70%)`, filter: "blur(60px)",
                pointerEvents: "none", zIndex: 0, animation: "glowPulse 18s ease-in-out infinite 3s"
            }} />
            <div style={{ position: "fixed", inset: 0, opacity: 0.35, pointerEvents: "none", backgroundImage: T.paperTexture, zIndex: 5 }} />

            <main style={{ position: "relative", zIndex: 10 }}>

                {/* ═══════════════════════════════════════════ */}
                {/* HERO SECTION                               */}
                {/* ═══════════════════════════════════════════ */}
                <motion.section style={{ opacity: heroOpacity, scale: heroScale }}>
                    <Container>
                        {/* Top bar */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "2rem 0 0" : "3rem 0 0" }}>
                            <Link href="/guest/no28" style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "44px", height: "44px", backgroundColor: T.buttonBg,
                                border: `2px solid ${T.buttonBorder}`, borderRadius: "12px",
                                color: T.buttonText, boxShadow: T.buttonShadow, transition: "all 0.3s ease"
                            }}>
                                <ArrowLeft size={22} strokeWidth={2} />
                            </Link>
                            <ThemeToggle />
                        </div>

                        {/* Hero Content */}
                        <div style={{
                            display: "flex", flexDirection: isMobile ? "column" : "row",
                            alignItems: "center", justifyContent: "center", gap: isMobile ? "1.5rem" : "4rem",
                            minHeight: isMobile ? "65svh" : "80svh",
                            paddingBottom: isMobile ? "1rem" : "4rem"
                        }}>
                            {/* Illustration */}
                            <motion.div
                                initial={{ opacity: 1, scale: 0.9, rotate: -3 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut" as const, delay: 0.3 }}
                                style={{ position: "relative", flexShrink: 0 }}
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
                                    style={{ position: "relative" }}
                                >
                                    {/* Main illustration */}
                                    <div style={{
                                        width: isMobile ? "140px" : "240px", height: isMobile ? "175px" : "300px",
                                        position: "relative", borderRadius: "8px", overflow: "hidden",
                                        boxShadow: `0 20px 60px ${T.accentGlow}`,
                                        border: `3px solid ${T.cardBorder}`,
                                        transform: "rotate(-2deg)"
                                    }}>
                                        <Image src="/special_hijabi_main.webp" alt="" fill style={{ objectFit: "cover" }} />
                                    </div>
                                    {/* Decorative peony */}
                                    <motion.div
                                        animate={{ rotate: [0, 5, -3, 0], scale: [1, 1.05, 1] }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const }}
                                        style={{
                                            position: "absolute", bottom: "-30px", right: "-40px",
                                            width: "100px", height: "100px", opacity: 0.85,
                                            mixBlendMode: "multiply" as const, zIndex: 2
                                        }}
                                    >
                                        <Image src="/special_peony.webp" alt="" fill style={{ objectFit: "contain" }} />
                                    </motion.div>
                                    {/* Wildflower accent top-left */}
                                    <div style={{
                                        position: "absolute", top: "-25px", left: "-35px",
                                        width: "80px", height: "80px", opacity: 0.6,
                                        transform: "rotate(15deg) scaleX(-1)",
                                        mixBlendMode: "multiply" as const, zIndex: 2
                                    }}>
                                        <Image src="/special_wildflowers.webp" alt="" fill style={{ objectFit: "contain" }} />
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Text */}
                            <motion.div
                                initial={{ opacity: 1, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                style={{ textAlign: isMobile ? "center" : "left", maxWidth: "420px" }}
                            >
                                <div style={{ fontSize: "0.65rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "3px", fontWeight: 700, marginBottom: "0.5rem", transition: "color 0.5s ease" }}>
                                    Bingkisan Kecil Untukmu
                                </div>
                                <h1 style={{
                                    fontFamily: "'Caveat', cursive", fontSize: isMobile ? "2.2rem" : "3rem",
                                    fontWeight: 700, color: T.textAccent, lineHeight: 1.15,
                                    marginBottom: "1rem", transition: "color 0.5s ease"
                                }}>
                                    Selamat Datang<br />di Ruang Kecilmu
                                </h1>
                                <p style={{ fontSize: "1.05rem", color: T.textSecondary, lineHeight: 1.7, fontWeight: 300, transition: "color 0.5s ease" }}>
                                    Sebuah tempat yang tercipta khusus untukmu — untuk merayakan
                                    setiap jejak langkah, setiap cerita, dan setiap melodi yang menggambarkan siapa dirimu.
                                </p>
                                <div style={{ marginTop: "1.5rem" }}>
                                    <Note style={{ fontSize: "1.1rem", fontWeight: 400, opacity: 0.7 }}>
                                        ...sebagai bukti bahwa kamu selalu terlihat.
                                    </Note>
                                </div>
                                <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", fontWeight: 700, color: T.textSecondary, letterSpacing: "1px", transition: "color 0.5s ease" }}>
                                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </motion.div>
                        </div>

                        {/* Scroll indicator */}
                        <motion.div
                            animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" as const }}
                            style={{ textAlign: "center", paddingBottom: "2rem" }}
                        >
                            <Note style={{ fontSize: "0.9rem", opacity: 0.5, display: "block", marginBottom: "4px" }}>
                                jelajahi ruang ini
                            </Note>
                            <ChevronDown size={20} color={T.textSecondary} style={{ opacity: 0.4 }} />
                        </motion.div>
                    </Container>
                </motion.section>


                {/* ═══════════════════════════════════════════ */}
                {/* GATEWAY CARDS                              */}
                {/* ═══════════════════════════════════════════ */}
                <section style={{ padding: isMobile ? "2rem 0 5rem" : "3rem 0 6rem" }}>
                    <Container>
                        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}>

                            {/* ──────────────────────────────────── */}
                            {/* CARD 1: HISTORY — Full Width Hero    */}
                            {/* ──────────────────────────────────── */}
                            <motion.div variants={fadeUp}>
                                <Link href="/guest/no28/special_day/history" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                    <motion.div
                                        className="hover:scale-[1.015] hover:-translate-y-1.5 active:scale-[0.99] transition-transform duration-300"
                                        style={{
                                            position: "relative", backgroundColor: T.cardBg,
                                            backgroundImage: T.paperTexture, borderRadius: "8px",
                                            border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow,
                                            padding: isMobile ? "2rem 1.5rem" : "2.5rem 2.5rem",
                                            overflow: "hidden", cursor: "pointer",
                                            transform: "rotate(-0.3deg)",
                                            transition: "box-shadow 0.3s ease, background-color 0.5s ease, border-color 0.5s ease"
                                        }}
                                    >
                                        {/* Washi tape */}
                                        <div style={{
                                            position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%) rotate(-1deg)",
                                            width: "100px", height: "24px", backgroundColor: T.tapeDefault, opacity: 0.9,
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.18)", borderRadius: "2px", zIndex: 10,
                                            transition: "background-color 0.5s ease"
                                        }} />

                                        {/* Botanical watermark */}
                                        <div style={{
                                            position: "absolute", bottom: "-15px", right: "-10px",
                                            width: isMobile ? "120px" : "180px", height: isMobile ? "120px" : "180px",
                                            opacity: 0.12, transform: "rotate(-20deg)",
                                            mixBlendMode: "multiply" as const, pointerEvents: "none"
                                        }}>
                                            <Image src="/special_wildflowers.webp" alt="" fill style={{ objectFit: "contain" }} />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "1.5rem" : "2.5rem", alignItems: isMobile ? "flex-start" : "center" }}>
                                            {/* Stacked Polaroids */}
                                            <div style={{ position: "relative", width: isMobile ? "140px" : "180px", height: isMobile ? "110px" : "130px", flexShrink: 0 }}>
                                                {[
                                                    { src: "/portrait_4.webp", rotate: -8, left: 0, zIndex: 1 },
                                                    { src: "/portrait_1.webp", rotate: 4, left: isMobile ? 45 : 55, zIndex: 2 },
                                                    { src: "/portrait_2.webp", rotate: -3, left: isMobile ? 85 : 105, zIndex: 3 },
                                                ].map((photo, i) => (
                                                    <motion.div key={i}
                                                        className="hover:-translate-y-2 hover:rotate-0 hover:scale-105 transition-all duration-300"
                                                        style={{
                                                            position: "absolute", top: 0, left: photo.left,
                                                            width: isMobile ? "55px" : "70px", height: isMobile ? "70px" : "85px",
                                                            backgroundColor: T.cardBg, padding: "3px 3px 14px",
                                                            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                                            transform: `rotate(${photo.rotate}deg)`, zIndex: photo.zIndex,
                                                            transition: "transform 0.3s ease, box-shadow 0.3s ease"
                                                        }}
                                                    >
                                                        <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "#f5f0eb" }}>
                                                            <Image src={photo.src} alt="" fill style={{ objectFit: "cover", objectPosition: "center top" }} />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Text */}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.6rem" }}>
                                                    <div style={{
                                                        width: "36px", height: "36px", borderRadius: "50%",
                                                        background: `${T.accent}15`, border: `1px solid ${T.accent}30`,
                                                        display: "flex", alignItems: "center", justifyContent: "center"
                                                    }}>
                                                        <BookOpen size={18} color={T.accent} />
                                                    </div>
                                                    <div style={{ fontSize: "0.65rem", fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "2.5px", transition: "color 0.5s ease" }}>
                                                        Brief History of You
                                                    </div>
                                                </div>
                                                <h3 style={{ fontSize: isMobile ? "1.4rem" : "1.7rem", fontWeight: 400, color: T.textPrimary, fontFamily: "'Crimson Pro', serif", lineHeight: 1.3, marginBottom: "0.5rem", transition: "color 0.5s ease" }}>
                                                    Jejak-jejak yang membentuk dirimu
                                                </h3>
                                                <Note style={{ fontSize: "0.95rem", opacity: 0.7 }}>
                                                    Polaroid, timeline, bulan di hari lahirmu, dan banyak lagi...
                                                </Note>
                                            </div>

                                            {/* Arrow */}
                                            <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
                                                style={{ alignSelf: "center" }}>
                                                <ChevronRight size={22} color={T.accent} style={{ opacity: 0.5 }} />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>


                            {/* ──────────────────── Botanical Divider ──────────────────── */}
                            <motion.div variants={fadeIn} style={{ display: "flex", alignItems: "center", gap: "1rem", margin: isMobile ? "2.5rem 0" : "3rem 0" }}>
                                <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, transparent, ${T.dividerColor})` }} />
                                <motion.div animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.05, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
                                    style={{ width: "32px", height: "32px", position: "relative", opacity: 0.5 }}>
                                    <Image src="/special_peony.webp" alt="" fill style={{ objectFit: "contain" }} />
                                </motion.div>
                                <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left, transparent, ${T.dividerColor})` }} />
                            </motion.div>


                            {/* ──────────────────────────────────── */}
                            {/* CARDS 2 & 3: Side by Side            */}
                            {/* ──────────────────────────────────── */}
                            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "2.5rem" : "2rem" }}>

                                {/* CARD 2: CONFESSIONS — Dark/Moonlit */}
                                <motion.div variants={fadeUp}>
                                    <Link href="/guest/no28/special_day/confessions" style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
                                        <motion.div
                                            className="hover:scale-[1.02] hover:-translate-y-1.5 active:scale-[0.98] transition-transform duration-300"
                                            style={{
                                                position: "relative",
                                                background: "linear-gradient(145deg, #0f0e1a 0%, #1a1a2e 40%, #16213e 100%)",
                                                borderRadius: "8px", border: "1px solid rgba(100,120,180,0.15)",
                                                boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)",
                                                padding: isMobile ? "2rem 1.5rem" : "2.5rem 2rem",
                                                overflow: "hidden", cursor: "pointer", transform: "rotate(0.4deg)",
                                                minHeight: isMobile ? "220px" : "280px",
                                                display: "flex", flexDirection: "column", justifyContent: "space-between"
                                            }}
                                        >
                                            {/* Washi tape */}
                                            <div style={{
                                                position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%) rotate(1deg)",
                                                width: "80px", height: "24px", backgroundColor: "#2a2a4a", opacity: 0.9,
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.3)", borderRadius: "2px", zIndex: 10
                                            }} />

                                            {/* Stars */}
                                            <TwinklingStars count={isMobile ? 8 : 14} color="rgba(200,200,255,0.6)" />

                                            {/* Moon glow */}
                                            <div style={{
                                                position: "absolute", top: "15px", right: "20px",
                                                width: "60px", height: "60px", borderRadius: "50%",
                                                background: "radial-gradient(circle, rgba(255,248,220,0.15) 0%, transparent 70%)",
                                                boxShadow: "0 0 40px rgba(255,248,220,0.08)"
                                            }} />

                                            <div style={{ position: "relative", zIndex: 2 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.8rem" }}>
                                                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(123,143,178,0.15)", border: "1px solid rgba(123,143,178,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <Moon size={18} color="#8fa0c4" />
                                                    </div>
                                                    <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(200,184,164,0.5)", textTransform: "uppercase", letterSpacing: "2.5px" }}>
                                                        Confessions to the Moon
                                                    </div>
                                                </div>
                                                <h3 style={{ fontSize: isMobile ? "1.3rem" : "1.5rem", fontWeight: 400, color: "#e0dbd4", fontFamily: "'Crimson Pro', serif", lineHeight: 1.3, marginBottom: "0.8rem" }}>
                                                    Bisikan malam yang tak terucap
                                                </h3>
                                                <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", fontStyle: "italic", color: "#c8b8a4", opacity: 0.6, lineHeight: 1.5 }}>
                                                    &ldquo;Malam ini bulan bercerita tentangmu...&rdquo;
                                                </span>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem", position: "relative", zIndex: 2 }}>
                                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}>
                                                    <ChevronRight size={20} color="#8fa0c4" style={{ opacity: 0.5 }} />
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>


                                {/* CARD 3: YEAR — Live Stats */}
                                <motion.div variants={fadeUp}>
                                    <Link href="/guest/no28/special_day/year" style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
                                        <motion.div
                                            className="hover:scale-[1.02] hover:-translate-y-1.5 active:scale-[0.98] transition-transform duration-300"
                                            style={{
                                                position: "relative", backgroundColor: T.cardBg,
                                                backgroundImage: T.paperTexture, borderRadius: "8px",
                                                border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow,
                                                padding: isMobile ? "2rem 1.5rem" : "2.5rem 2rem",
                                                overflow: "hidden", cursor: "pointer", transform: "rotate(0.3deg)",
                                                minHeight: isMobile ? "220px" : "280px",
                                                display: "flex", flexDirection: "column", justifyContent: "space-between",
                                                transition: "box-shadow 0.3s ease, background-color 0.5s ease, border-color 0.5s ease"
                                            }}
                                        >
                                            {/* Washi tape */}
                                            <div style={{
                                                position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%) rotate(-0.5deg)",
                                                width: "80px", height: "24px", backgroundColor: T.tapeDefault, opacity: 0.9,
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.18)", borderRadius: "2px", zIndex: 10,
                                                transition: "background-color 0.5s ease"
                                            }} />

                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.8rem" }}>
                                                    <div style={{
                                                        width: "36px", height: "36px", borderRadius: "50%",
                                                        background: `${T.accentLight}15`, border: `1px solid ${T.accentLight}30`,
                                                        display: "flex", alignItems: "center", justifyContent: "center"
                                                    }}>
                                                        <Sparkles size={18} color={T.accentLight} />
                                                    </div>
                                                    <div style={{ fontSize: "0.65rem", fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "2.5px", transition: "color 0.5s ease" }}>
                                                        Tahun Istimewanya
                                                    </div>
                                                </div>
                                                <h3 style={{ fontSize: isMobile ? "1.3rem" : "1.5rem", fontWeight: 400, color: T.textPrimary, fontFamily: "'Crimson Pro', serif", lineHeight: 1.3, marginBottom: "0.8rem", transition: "color 0.5s ease" }}>
                                                    365 hari perjalanan tahun ini
                                                </h3>

                                                {/* Mini dot grid preview */}
                                                <div style={{ display: "flex", gap: "3px", flexWrap: "wrap", marginTop: "0.5rem" }}>
                                                    {Array.from({ length: 35 }).map((_, i) => {
                                                        const filled = i < 24;
                                                        const isToday = i === 23;
                                                        return (
                                                            <motion.div key={i}
                                                                animate={isToday ? { scale: [1, 1.5, 1], opacity: [1, 0.7, 1] } : {}}
                                                                transition={isToday ? { duration: 2, repeat: Infinity, ease: "easeInOut" as const } : {}}
                                                                style={{
                                                                    width: "6px", height: "6px", borderRadius: "2px",
                                                                    backgroundColor: filled ? T.accent : T.dividerColor,
                                                                    opacity: filled ? (isToday ? 1 : 0.7) : 0.35,
                                                                    boxShadow: isToday ? `0 0 4px ${T.accent}` : "none",
                                                                    transition: "background-color 0.5s ease"
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                                <Note style={{ fontSize: "0.85rem", marginTop: "8px", opacity: 0.6 }}>
                                                    Diary, countdown & detak jantungmu...
                                                </Note>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}>
                                                    <ChevronRight size={20} color={T.accentLight} style={{ opacity: 0.5 }} />
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            </div>


                            {/* ──────────────────── Botanical Divider ──────────────────── */}
                            <motion.div variants={fadeIn} style={{ display: "flex", alignItems: "center", gap: "1rem", margin: isMobile ? "2.5rem 0" : "3rem 0" }}>
                                <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, transparent, ${T.dividerColor})` }} />
                                <Note style={{ fontSize: "0.9rem", opacity: 0.4 }}>♪</Note>
                                <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left, transparent, ${T.dividerColor})` }} />
                            </motion.div>


                            {/* ──────────────────────────────────── */}
                            {/* CARD 4: MELODY — Full Width Bottom   */}
                            {/* ──────────────────────────────────── */}
                            <motion.div variants={fadeUp}>
                                <Link href="/guest/no28/special_day/melody" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                    <motion.div
                                        className="hover:scale-[1.015] hover:-translate-y-1.5 active:scale-[0.99] transition-transform duration-300"
                                        style={{
                                            position: "relative", backgroundColor: T.cardBg,
                                            backgroundImage: T.paperTexture, borderRadius: "8px",
                                            border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow,
                                            padding: isMobile ? "2rem 1.5rem" : "2.5rem 2.5rem",
                                            overflow: "hidden", cursor: "pointer", transform: "rotate(-0.2deg)",
                                            transition: "box-shadow 0.3s ease, background-color 0.5s ease, border-color 0.5s ease"
                                        }}
                                    >
                                        {/* Washi tape */}
                                        <div style={{
                                            position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%) rotate(0.5deg)",
                                            width: "90px", height: "24px", backgroundColor: T.tapeDefault, opacity: 0.9,
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.18)", borderRadius: "2px", zIndex: 10,
                                            transition: "background-color 0.5s ease"
                                        }} />

                                        {/* Peony decoration */}
                                        <div style={{
                                            position: "absolute", bottom: "-20px", left: "-15px",
                                            width: isMobile ? "90px" : "130px", height: isMobile ? "90px" : "130px",
                                            opacity: 0.1, transform: "rotate(25deg)",
                                            mixBlendMode: "multiply" as const, pointerEvents: "none"
                                        }}>
                                            <Image src="/special_peony.webp" alt="" fill style={{ objectFit: "contain" }} />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "1.5rem" : "2.5rem", alignItems: isMobile ? "flex-start" : "center" }}>
                                            {/* Equalizer + Icon */}
                                            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
                                                <div style={{
                                                    width: "50px", height: "50px", borderRadius: "50%",
                                                    background: "rgba(135,176,165,0.12)", border: "1px solid rgba(135,176,165,0.2)",
                                                    display: "flex", alignItems: "center", justifyContent: "center"
                                                }}>
                                                    <Music size={22} color="#87b0a5" />
                                                </div>
                                                <MiniEqualizer color="#87b0a5" bars={6} />
                                            </div>

                                            {/* Text */}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: "0.4rem", transition: "color 0.5s ease" }}>
                                                    Melody for You
                                                </div>
                                                <h3 style={{ fontSize: isMobile ? "1.4rem" : "1.7rem", fontWeight: 400, color: T.textPrimary, fontFamily: "'Crimson Pro', serif", lineHeight: 1.3, marginBottom: "0.5rem", transition: "color 0.5s ease" }}>
                                                    Lagu-lagu yang menggambarkan dirimu
                                                </h3>
                                                <Note style={{ fontSize: "0.95rem", opacity: 0.7 }}>
                                                    🎵 Setiap nada punya cerita tentangmu...
                                                </Note>
                                            </div>

                                            {/* Arrow */}
                                            <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
                                                style={{ alignSelf: "center" }}>
                                                <ChevronRight size={22} color="#87b0a5" style={{ opacity: 0.5 }} />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        </motion.div>


                        {/* ═══════════════════════════════════════════ */}
                        {/* CLOSING / LETTER ENDING                    */}
                        {/* ═══════════════════════════════════════════ */}
                        <motion.div
                            initial={{ opacity: 1, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            style={{ marginTop: isMobile ? "5rem" : "7rem", paddingBottom: "5rem", textAlign: "center" }}
                        >
                            {/* Decorative line */}
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center", marginBottom: "2.5rem" }}>
                                <div style={{ width: "60px", height: "1px", background: `linear-gradient(to right, transparent, ${T.accent})`, opacity: 0.3 }} />
                                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}>
                                    <Heart size={16} color={T.accent} fill={T.accent} style={{ opacity: 0.4 }} />
                                </motion.div>
                                <div style={{ width: "60px", height: "1px", background: `linear-gradient(to left, transparent, ${T.accent})`, opacity: 0.3 }} />
                            </div>

                            {/* Sign-off illustration */}
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const }}
                                style={{ width: "70px", height: "70px", position: "relative", margin: "0 auto 1.5rem", opacity: 0.7, mixBlendMode: "multiply" as const }}
                            >
                                <Image src="/special_wildflowers.webp" alt="" fill style={{ objectFit: "contain" }} />
                            </motion.div>

                            <Note style={{ fontSize: "1.4rem", color: T.textAccent, display: "block", marginBottom: "0.8rem" }}>
                                Ruang ini tercipta untuk merayakan
                            </Note>
                            <Note style={{ fontSize: "1.4rem", color: T.textAccent, display: "block", marginBottom: "1.5rem" }}>
                                setiap jejak langkah kecilmu.
                            </Note>
                            <p style={{ fontSize: "0.8rem", color: T.textSecondary, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, opacity: 0.5, transition: "color 0.5s ease" }}>
                                Dengan sepenuh hati
                            </p>
                        </motion.div>

                    </Container>
                </section>
            </main>
        </div>
    );
}
