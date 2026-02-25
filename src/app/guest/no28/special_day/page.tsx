"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Moon, Sparkles, Music, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { useTheme } from "@/components/guest/no28/ThemeContext";
import { ThemeToggle } from "@/components/guest/no28/ThemeToggle";

// ═══════════════════════════════════════════
// TINY DECORATIVE OBJECTS — scattered flowers, stars, hearts
// ═══════════════════════════════════════════

const TinyObject = ({ emoji, size = 16, top, left, right, bottom, rotate = 0, delay = 0 }: {
    emoji: string; size?: number;
    top?: string; left?: string; right?: string; bottom?: string;
    rotate?: number; delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.6, ease: "backOut" }}
        style={{
            position: "absolute", top, left, right, bottom,
            fontSize: size, lineHeight: 1, zIndex: 3,
            transform: `rotate(${rotate}deg)`, pointerEvents: "none",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
        }}
    >
        {emoji}
    </motion.div>
);

const FloatingDeco = ({ emoji, size = 14, left, delay = 0 }: {
    emoji: string; size?: number; left: string; delay?: number;
}) => (
    <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 8, -5, 0] }}
        transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut", delay }}
        style={{
            position: "absolute", left, top: `${20 + Math.random() * 60}%`,
            fontSize: size, lineHeight: 1, zIndex: 2, pointerEvents: "none",
            opacity: 0.5, filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.08))"
        }}
    >
        {emoji}
    </motion.div>
);

// Scattered small flowers as ambient decoration
const ScatteredFlowers = () => (
    <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
        <FloatingDeco emoji="🌸" size={12} left="8%" delay={0} />
        <FloatingDeco emoji="🌿" size={10} left="22%" delay={1.5} />
        <FloatingDeco emoji="💮" size={11} left="45%" delay={3} />
        <FloatingDeco emoji="🍃" size={10} left="68%" delay={0.8} />
        <FloatingDeco emoji="🌷" size={11} left="85%" delay={2.2} />
        <FloatingDeco emoji="✿" size={9} left="55%" delay={4} />
        <FloatingDeco emoji="🌼" size={10} left="35%" delay={1.2} />
    </div>
);

const FallingPetals = ({ gradient }: { gradient: string }) => (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}
                style={{
                    position: "absolute", left: `${10 + Math.random() * 80}%`,
                    width: 7 + Math.random() * 5, height: 7 + Math.random() * 5,
                    borderRadius: "50% 0 50% 50%", background: gradient, opacity: 0.4,
                    willChange: "transform, opacity",
                    animation: `fallPetal ${16 + Math.random() * 8}s linear ${Math.random() * 12}s infinite`
                }}
            />
        ))}
    </div>
);

const TwinklingStars = ({ count = 12, color = "#c8b8a4" }: { count?: number; color?: string }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i}
                style={{
                    position: "absolute", left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`,
                    width: Math.random() * 2 + 1.5, height: Math.random() * 2 + 1.5, borderRadius: "50%",
                    background: color, boxShadow: `0 0 6px ${color}`, zIndex: 1,
                    animation: `twinkleStar ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 4}s infinite`
                }}
            />
        ))}
    </>
);

const MiniEqualizer = ({ color = "#87b0a5", bars = 5 }: { color?: string; bars?: number }) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "28px" }}>
        {Array.from({ length: bars }).map((_, i) => (
            <motion.div key={i}
                animate={{ height: [4, 12 + Math.random() * 16, 6, (12 + Math.random() * 16) * 0.6, 4] }}
                transition={{ duration: 0.7 + Math.random() * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
                style={{ width: "3px", borderRadius: "2px", backgroundColor: color, opacity: 0.6 }}
            />
        ))}
    </div>
);

// ═══════════════════════════════════════════
// HANDMADE COMPONENTS
// ═══════════════════════════════════════════

// Washi tape — colorful and cute
const WashiTape = ({ color = "#f5c6d0", rotate = -1, width = "90px" }: { color?: string; rotate?: number; width?: string }) => (
    <div style={{
        position: "absolute", top: "-1px", left: "50%",
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        width, height: "22px",
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}bb 100%)`,
        opacity: 0.85, borderRadius: "1px", zIndex: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
    }} />
);

// Handwritten note component
const Note = ({ children, style = {}, color }: { children: React.ReactNode; style?: React.CSSProperties; color?: string }) => (
    <span style={{
        fontFamily: "'Caveat', cursive", color: color || "inherit",
        fontSize: "1.25rem", display: "inline-block", lineHeight: 1.35,
        ...style
    }}>{children}</span>
);

// Small label in handwriting
const HandLabel = ({ children, color }: { children: React.ReactNode; color?: string }) => (
    <div style={{
        fontFamily: "'Caveat', cursive", fontSize: "0.95rem",
        fontWeight: 700, color: color || "inherit",
        letterSpacing: "0.5px", transition: "color 0.5s ease"
    }}>{children}</div>
);

// Serif label
const SerifLabel = ({ children, color }: { children: React.ReactNode; color?: string }) => (
    <div style={{
        fontSize: "0.6rem", fontWeight: 700, color: color || "inherit",
        textTransform: "uppercase", letterSpacing: "3px",
        fontFamily: "'Crimson Pro', serif",
        transition: "color 0.5s ease"
    }}>{children}</div>
);

// Line doodle divider
const DoodleDivider = ({ accent }: { accent: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0.5rem 0" }}>
        <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, transparent, ${accent}40)` }} />
        <span style={{ fontSize: "10px", opacity: 0.4 }}>🌸</span>
        <div style={{ height: "3px", width: "3px", borderRadius: "50%", background: accent, opacity: 0.3 }} />
        <span style={{ fontSize: "8px", opacity: 0.35 }}>✿</span>
        <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left, transparent, ${accent}40)` }} />
    </div>
);

// ═══════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════

export default function SpecialDayHub() {
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

    const yearProgress = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31);
        return Math.round(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100);
    }, []);

    if (!mounted) return null;

    // Color palette for cards — soft, cute, colorful
    const palette = {
        pink: "#f5c6d0",
        lavender: "#c8b8e8",
        sage: "#b8d4c8",
        peach: "#f5d5c0",
        sky: "#b8d4e8",
        butter: "#f5e6b8",
    };

    return (
        <div style={{
            backgroundColor: T.pageBg,
            backgroundImage: T.pageBgDots, backgroundSize: T.pageBgSize,
            minHeight: "100svh", color: T.textPrimary,
            fontFamily: "'Crimson Pro', serif, -apple-system",
            position: "relative", overflowX: "hidden",
            transition: "background-color 0.5s ease, color 0.5s ease"
        }}>
            {/* Ambient Layers */}
            <ScatteredFlowers />
            <FallingPetals gradient={T.petalGradient} />

            {/* Soft colored gradient mists */}
            <div style={{ position: "fixed", top: "5%", right: "-8%", width: "400px", height: "400px", background: `radial-gradient(circle, ${palette.pink}30 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", bottom: "10%", left: "-5%", width: "350px", height: "350px", background: `radial-gradient(circle, ${palette.lavender}25 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", top: "50%", left: "30%", width: "300px", height: "300px", background: `radial-gradient(circle, ${palette.sage}20 0%, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />

            {/* Paper texture */}
            <div style={{ position: "fixed", inset: 0, opacity: 0.25, pointerEvents: "none", backgroundImage: T.paperTexture, zIndex: 4 }} />

            <main style={{ position: "relative", zIndex: 10 }}>

                {/* ═══════════════════════════════════════════ */}
                {/* HERO SECTION                               */}
                {/* ═══════════════════════════════════════════ */}
                <section>
                    <Container>
                        {/* Top bar */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "1.5rem 0 0" : "2.5rem 0 0" }}>
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
                            alignItems: "center", justifyContent: "center",
                            gap: isMobile ? "2rem" : "4rem",
                            minHeight: isMobile ? "70svh" : "82svh",
                            paddingBottom: isMobile ? "2rem" : "4rem",
                            position: "relative"
                        }}>
                            {/* Tiny decorative objects around hero */}
                            <TinyObject emoji="🌸" size={16} top="10%" left="5%" rotate={-15} delay={0.8} />
                            <TinyObject emoji="🌿" size={13} top="25%" right="8%" rotate={20} delay={1.2} />
                            <TinyObject emoji="💛" size={10} bottom="20%" left="12%" rotate={-10} delay={1.5} />
                            <TinyObject emoji="🌷" size={14} bottom="30%" right="5%" rotate={12} delay={1.8} />
                            {!isMobile && <TinyObject emoji="✿" size={11} top="15%" left="48%" rotate={-8} delay={2} />}
                            {!isMobile && <TinyObject emoji="🍃" size={12} bottom="40%" left="42%" rotate={25} delay={2.3} />}

                            {/* Illustration — scrapbook style */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                                style={{ position: "relative", flexShrink: 0 }}
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ position: "relative" }}
                                >
                                    {/* Photo with craft-style frame */}
                                    <div style={{
                                        width: isMobile ? "180px" : "260px",
                                        height: isMobile ? "230px" : "330px",
                                        position: "relative", overflow: "hidden",
                                        borderRadius: "6px",
                                        padding: "8px 8px 28px", backgroundColor: "#fff",
                                        boxShadow: "0 8px 30px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.06)",
                                        transform: "rotate(-2.5deg)",
                                        border: "1px solid #eee"
                                    }}>
                                        <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", borderRadius: "3px" }}>
                                            <Image src="/special_hijabi_main.webp" alt="" fill style={{ objectFit: "cover" }} />
                                        </div>
                                        {/* Handwritten caption on the white bottom */}
                                        <div style={{ position: "absolute", bottom: "4px", left: 0, right: 0, textAlign: "center" }}>
                                            <Note color="#a0907d" style={{ fontSize: "0.75rem", opacity: 0.7 }}>untuk kamu ♡</Note>
                                        </div>
                                    </div>

                                    {/* Tiny washi tape on corner */}
                                    <div style={{
                                        position: "absolute", top: "-8px", left: "15px",
                                        width: "50px", height: "16px",
                                        background: `linear-gradient(135deg, ${palette.pink}, ${palette.peach})`,
                                        transform: "rotate(-8deg)", opacity: 0.8, borderRadius: "1px",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", zIndex: 5
                                    }} />
                                    <div style={{
                                        position: "absolute", top: "-6px", right: "20px",
                                        width: "45px", height: "16px",
                                        background: `linear-gradient(135deg, ${palette.lavender}, ${palette.sky})`,
                                        transform: "rotate(5deg)", opacity: 0.75, borderRadius: "1px",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", zIndex: 5
                                    }} />

                                    {/* Peony accent */}
                                    <motion.div
                                        animate={{ rotate: [0, 5, -3, 0], scale: [1, 1.06, 1] }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                        style={{
                                            position: "absolute", bottom: "-30px", right: "-40px",
                                            width: isMobile ? "100px" : "130px", height: isMobile ? "100px" : "130px",
                                            opacity: 0.8, mixBlendMode: mode === "default" ? "multiply" : "screen", zIndex: 2
                                        }}
                                    >
                                        <Image src="/special_peony.webp" alt="" fill style={{ objectFit: "contain" }} />
                                    </motion.div>

                                    {/* Wildflower accent */}
                                    <div style={{
                                        position: "absolute", top: "-25px", left: "-35px",
                                        width: isMobile ? "80px" : "100px", height: isMobile ? "80px" : "100px",
                                        opacity: 0.6, transform: "rotate(15deg) scaleX(-1)",
                                        mixBlendMode: mode === "default" ? "multiply" : "screen", zIndex: 2
                                    }}>
                                        <Image src="/special_wildflowers.webp" alt="" fill style={{ objectFit: "contain" }} />
                                    </div>

                                    {/* Tiny flowers asset behind the photo */}
                                    <div style={{
                                        position: "absolute", bottom: "-15px", left: "-25px",
                                        width: "80px", height: "80px", opacity: 0.5, zIndex: 1,
                                        transform: "rotate(10deg)",
                                        mixBlendMode: mode === "default" ? "multiply" : "screen"
                                    }}>
                                        <Image src="/tiny_flowers_1.png" alt="" fill style={{ objectFit: "contain" }} />
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Hero Text */}
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                style={{ textAlign: isMobile ? "center" : "left", maxWidth: "440px" }}
                            >
                                <HandLabel color={T.textSecondary}>~ bingkisan kecil untukmu ~</HandLabel>

                                <h1 style={{
                                    fontFamily: "'Caveat', cursive",
                                    fontSize: isMobile ? "2.2rem" : "3.5rem",
                                    fontWeight: 700, color: T.textAccent,
                                    lineHeight: 1.1, marginTop: "0.5rem", marginBottom: "1.2rem",
                                    transition: "color 0.5s ease"
                                }}>
                                    Selamat Datang{!isMobile && <br />} di Ruang Kecilmu
                                </h1>

                                <p style={{
                                    fontSize: "1.05rem", color: T.textSecondary,
                                    lineHeight: 1.7, fontWeight: 300,
                                    maxWidth: "380px", marginInline: isMobile ? "auto" : undefined,
                                    transition: "color 0.5s ease"
                                }}>
                                    Sebuah tempat yang tercipta khusus untukmu — untuk merayakan
                                    setiap jejak langkah, setiap cerita, dan setiap melodi yang menggambarkan siapa dirimu.
                                </p>

                                <div style={{ marginTop: "1.5rem" }}>
                                    <Note color={T.textAccent} style={{ fontSize: "1.15rem", opacity: 0.7 }}>
                                        ...sebagai bukti bahwa kamu selalu terlihat. ♡
                                    </Note>
                                </div>

                                <div style={{ marginTop: "0.8rem", display: "flex", alignItems: "center", gap: "6px", justifyContent: isMobile ? "center" : "flex-start" }}>
                                    <span style={{ fontSize: "10px" }}>📅</span>
                                    <Note color={T.textSecondary} style={{ fontSize: "0.85rem", opacity: 0.5 }}>
                                        {new Date().toLocaleDateString('id-ID', { weekday: "long", day: 'numeric', month: 'long', year: 'numeric' })}
                                    </Note>
                                </div>
                            </motion.div>
                        </div>

                        {/* Scroll hint — handwritten */}
                        <motion.div
                            animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            style={{ textAlign: "center", paddingBottom: "2rem" }}
                        >
                            <Note color={T.textSecondary} style={{ fontSize: "0.9rem", opacity: 0.5, display: "block" }}>
                                ↓ jelajahi ruang ini ↓
                            </Note>
                        </motion.div>
                    </Container>
                </section>


                {/* ═══════════════════════════════════════════ */}
                {/* GATEWAY CARDS                              */}
                {/* ═══════════════════════════════════════════ */}
                <section style={{ padding: isMobile ? "0 0 4rem" : "1rem 0 5rem" }}>
                    <Container>
                        <motion.div
                            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
                            variants={{ show: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } } }}
                            style={{ display: "flex", flexDirection: "column", gap: isMobile ? "1.5rem" : "2.5rem" }}
                        >

                            {/* ──────────────────────────────────── */}
                            {/* CARD 1: HISTORY — Full Width         */}
                            {/* ──────────────────────────────────── */}
                            <motion.div variants={{ hidden: { opacity: 0, y: 35 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 45, damping: 16 } } }}>
                                <Link href="/guest/no28/special_day/history" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                    <div className="card-lift" style={{
                                        position: "relative", backgroundColor: T.cardBg,
                                        backgroundImage: T.paperTexture,
                                        borderRadius: "8px", border: `1px solid ${T.cardBorder}`,
                                        boxShadow: T.cardShadow,
                                        padding: isMobile ? "2.5rem 2rem" : "3rem 2.5rem",
                                        overflow: "hidden", cursor: "pointer",
                                        transform: "rotate(-0.4deg)",
                                        transition: "box-shadow 0.4s ease, background-color 0.5s ease"
                                    }}>
                                        {/* Washi tape */}
                                        <WashiTape color={palette.peach} rotate={-1.5} width="95px" />

                                        {/* Tiny flower deco */}
                                        <TinyObject emoji="🌸" size={13} top="15px" right="20px" rotate={-10} delay={0.3} />
                                        <TinyObject emoji="🌿" size={11} bottom="15px" right="60px" rotate={15} delay={0.5} />

                                        {/* Botanical watermark */}
                                        <div style={{
                                            position: "absolute", bottom: "-10px", right: "-5px",
                                            width: isMobile ? "120px" : "180px", height: isMobile ? "120px" : "180px",
                                            opacity: 0.08, transform: "rotate(-20deg)",
                                            mixBlendMode: mode === "default" ? "multiply" : "screen", pointerEvents: "none"
                                        }}>
                                            <Image src="/special_wildflowers.webp" alt="" fill style={{ objectFit: "contain" }} />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "2rem" : "2.5rem", alignItems: isMobile ? "flex-start" : "center" }}>
                                            {/* Polaroid Stack */}
                                            <div style={{ position: "relative", width: isMobile ? "150px" : "190px", height: isMobile ? "115px" : "135px", flexShrink: 0 }}>
                                                {[
                                                    { src: "/portrait_4.webp", rotate: -8, left: 0, zIndex: 1 },
                                                    { src: "/portrait_1.webp", rotate: 5, left: isMobile ? 48 : 60, zIndex: 2 },
                                                    { src: "/portrait_2.webp", rotate: -3, left: isMobile ? 90 : 115, zIndex: 3 },
                                                ].map((photo, i) => (
                                                    <div key={i} style={{
                                                        position: "absolute", top: 0, left: photo.left,
                                                        width: isMobile ? "58px" : "70px", height: isMobile ? "72px" : "88px",
                                                        backgroundColor: "#fff", padding: "3px 3px 15px",
                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                        borderRadius: "3px",
                                                        transform: `rotate(${photo.rotate}deg)`, zIndex: photo.zIndex,
                                                        transition: "transform 0.3s ease"
                                                    }}>
                                                        <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "#f5f0eb", borderRadius: "2px" }}>
                                                            <Image src={photo.src} alt="" fill style={{ objectFit: "cover", objectPosition: "center top" }} />
                                                        </div>
                                                    </div>
                                                ))}
                                                {/* Tiny washi on middle polaroid */}
                                                <div style={{
                                                    position: "absolute", top: "-5px", left: isMobile ? "55px" : "68px",
                                                    width: "30px", height: "10px",
                                                    background: palette.pink, opacity: 0.7,
                                                    transform: "rotate(3deg)", borderRadius: "1px", zIndex: 5
                                                }} />
                                            </div>

                                            {/* Text */}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.6rem" }}>
                                                    <BookOpen size={17} color={T.accent} />
                                                    <SerifLabel color={T.textSecondary}>Brief History of You</SerifLabel>
                                                </div>
                                                <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: isMobile ? "1.6rem" : "1.9rem", fontWeight: 700, color: T.textPrimary, lineHeight: 1.25, marginBottom: "0.5rem", transition: "color 0.5s ease" }}>
                                                    Jejak-jejak yang membentuk dirimu
                                                </h3>
                                                <Note color={T.handwrittenColor} style={{ fontSize: "1rem", opacity: 0.65 }}>
                                                    Polaroid, timeline, bulan di hari lahirmu... 📸
                                                </Note>
                                            </div>

                                            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ alignSelf: "center" }}>
                                                <ChevronRight size={22} color={T.accent} style={{ opacity: 0.3 }} />
                                            </motion.div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>


                            {/* ──────────── Doodle Divider ──────────── */}
                            <DoodleDivider accent={T.accent} />


                            {/* ──────────────────────────────────── */}
                            {/* CARDS 2 & 3: Side by Side            */}
                            {/* ──────────────────────────────────── */}
                            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "1.5rem" : "2rem" }}>

                                {/* CARD 2: CONFESSIONS — Dark/Moonlit */}
                                <motion.div variants={{ hidden: { opacity: 0, y: 35 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 45, damping: 16 } } }}>
                                    <Link href="/guest/no28/special_day/confessions" style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
                                        <div className="card-lift" style={{
                                            position: "relative",
                                            background: "linear-gradient(155deg, #0f0e1a 0%, #161630 40%, #16213e 100%)",
                                            borderRadius: "8px", border: "1px solid rgba(100,120,180,0.12)",
                                            boxShadow: "0 10px 35px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)",
                                            padding: isMobile ? "2.5rem 2rem" : "2.5rem 2rem",
                                            overflow: "hidden", cursor: "pointer",
                                            transform: "rotate(0.3deg)",
                                            minHeight: isMobile ? "240px" : "280px",
                                            display: "flex", flexDirection: "column", justifyContent: "space-between",
                                            height: "100%"
                                        }}>
                                            {/* Dark washi tape */}
                                            <div style={{
                                                position: "absolute", top: "-1px", left: "50%",
                                                transform: "translateX(-50%) rotate(1.5deg)",
                                                width: "80px", height: "22px",
                                                background: "linear-gradient(135deg, #2a2a4a, #3a3a5a)",
                                                opacity: 0.85, borderRadius: "1px", zIndex: 10,
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.25)"
                                            }} />

                                            {/* Stars */}
                                            <TwinklingStars count={isMobile ? 8 : 14} color="rgba(200,200,255,0.5)" />

                                            {/* Moon glow */}
                                            <div style={{
                                                position: "absolute", top: "18px", right: "22px",
                                                width: "45px", height: "45px", borderRadius: "50%",
                                                background: "radial-gradient(circle, rgba(255,248,220,0.12) 0%, transparent 70%)",
                                                boxShadow: "0 0 40px rgba(255,248,220,0.05)"
                                            }} />

                                            {/* Tiny star decorations */}
                                            <TinyObject emoji="⭐" size={9} top="20px" left="25px" rotate={15} delay={0.5} />
                                            <TinyObject emoji="✨" size={10} bottom="50px" right="30px" rotate={-8} delay={0.8} />

                                            <div style={{ position: "relative", zIndex: 2 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                                                    <Moon size={17} color="#8fa0c4" />
                                                    <SerifLabel color="rgba(200,184,164,0.45)">Confessions to the Moon</SerifLabel>
                                                </div>
                                                <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: isMobile ? "1.5rem" : "1.7rem", fontWeight: 700, color: "#e0dbd4", lineHeight: 1.25, marginBottom: "0.8rem" }}>
                                                    Bisikan malam yang tak terucap
                                                </h3>
                                                <Note color="#c8b8a4" style={{ fontSize: "1rem", opacity: 0.5, fontStyle: "italic" }}>
                                                    &ldquo;Malam ini bulan bercerita tentangmu...&rdquo; 🌙
                                                </Note>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "flex-end", position: "relative", zIndex: 2, marginTop: "1rem" }}>
                                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                                                    <ChevronRight size={20} color="#8fa0c4" style={{ opacity: 0.3 }} />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>


                                {/* CARD 3: YEAR — Colorful Progress */}
                                <motion.div variants={{ hidden: { opacity: 0, y: 35 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 45, damping: 16 } } }}>
                                    <Link href="/guest/no28/special_day/year" style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
                                        <div className="card-lift" style={{
                                            position: "relative", backgroundColor: T.cardBg,
                                            backgroundImage: T.paperTexture,
                                            borderRadius: "8px", border: `1px solid ${T.cardBorder}`,
                                            boxShadow: T.cardShadow,
                                            padding: isMobile ? "2.5rem 2rem" : "2.5rem 2rem",
                                            overflow: "hidden", cursor: "pointer",
                                            transform: "rotate(0.3deg)",
                                            minHeight: isMobile ? "240px" : "280px",
                                            display: "flex", flexDirection: "column", justifyContent: "space-between",
                                            height: "100%",
                                            transition: "box-shadow 0.4s ease, background-color 0.5s ease"
                                        }}>
                                            {/* Washi tape */}
                                            <WashiTape color={palette.sage} rotate={-0.5} width="80px" />

                                            {/* Tiny flower decos */}
                                            <TinyObject emoji="🌼" size={12} top="18px" right="18px" rotate={-12} delay={0.4} />
                                            <TinyObject emoji="🌱" size={10} bottom="25px" left="20px" rotate={8} delay={0.7} />

                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.8rem" }}>
                                                    <Sparkles size={17} color={T.accentLight} />
                                                    <SerifLabel color={T.textSecondary}>Tahun Istimewanya</SerifLabel>
                                                </div>
                                                <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: isMobile ? "1.5rem" : "1.7rem", fontWeight: 700, color: T.textPrimary, lineHeight: 1.25, marginBottom: "1rem", transition: "color 0.5s ease" }}>
                                                    365 hari perjalanan tahun ini
                                                </h3>

                                                {/* Colorful progress bar */}
                                                <div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                                        <Note color={T.textSecondary} style={{ fontSize: "0.8rem" }}>perjalanan tahun ini</Note>
                                                        <Note color={T.accent} style={{ fontSize: "0.85rem", fontWeight: 700 }}>{yearProgress}%</Note>
                                                    </div>
                                                    <div style={{ width: "100%", height: "6px", background: T.dividerColor, borderRadius: "3px", overflow: "hidden" }}>
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${yearProgress}%` }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 1.5, ease: [0.2, 1, 0.2, 1] }}
                                                            style={{
                                                                height: "100%",
                                                                background: `linear-gradient(90deg, ${palette.pink}, ${palette.lavender}, ${palette.sage})`,
                                                                borderRadius: "3px"
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <Note color={T.handwrittenColor} style={{ fontSize: "0.9rem", marginTop: "10px", opacity: 0.6 }}>
                                                    Diary, countdown & detak jantungmu... 💕
                                                </Note>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                                                    <ChevronRight size={20} color={T.accentLight} style={{ opacity: 0.3 }} />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </div>


                            {/* ──────────── Doodle Divider ──────────── */}
                            <DoodleDivider accent={T.accent} />


                            {/* ──────────────────────────────────── */}
                            {/* CARD 4: MELODY — Full Width          */}
                            {/* ──────────────────────────────────── */}
                            <motion.div variants={{ hidden: { opacity: 0, y: 35 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 45, damping: 16 } } }}>
                                <Link href="/guest/no28/special_day/melody" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                    <div className="card-lift" style={{
                                        position: "relative", backgroundColor: T.cardBg,
                                        backgroundImage: T.paperTexture,
                                        borderRadius: "8px", border: `1px solid ${T.cardBorder}`,
                                        boxShadow: T.cardShadow,
                                        padding: isMobile ? "2.5rem 2rem" : "3rem 2.5rem",
                                        overflow: "hidden", cursor: "pointer",
                                        transform: "rotate(-0.2deg)",
                                        transition: "box-shadow 0.4s ease, background-color 0.5s ease"
                                    }}>
                                        {/* Washi tape */}
                                        <WashiTape color={palette.lavender} rotate={0.5} width="85px" />

                                        {/* Tiny music decos */}
                                        <TinyObject emoji="🎵" size={11} top="18px" right="25px" rotate={10} delay={0.3} />
                                        <TinyObject emoji="🌸" size={12} bottom="18px" left="30px" rotate={-15} delay={0.6} />

                                        {/* Peony watermark */}
                                        <div style={{
                                            position: "absolute", bottom: "-15px", left: "-10px",
                                            width: isMobile ? "100px" : "130px", height: isMobile ? "100px" : "130px",
                                            opacity: 0.07, transform: "rotate(25deg)",
                                            mixBlendMode: mode === "default" ? "multiply" : "screen", pointerEvents: "none"
                                        }}>
                                            <Image src="/special_peony.webp" alt="" fill style={{ objectFit: "contain" }} />
                                        </div>

                                        {/* Tiny flowers asset */}
                                        <div style={{
                                            position: "absolute", top: "-5px", right: "50px",
                                            width: "50px", height: "50px", opacity: 0.35, zIndex: 1,
                                            transform: "rotate(-10deg)",
                                            mixBlendMode: mode === "default" ? "multiply" : "screen"
                                        }}>
                                            <Image src="/tiny_flowers_2.png" alt="" fill style={{ objectFit: "contain" }} />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "1.5rem" : "2.5rem", alignItems: isMobile ? "flex-start" : "center" }}>
                                            {/* Equalizer */}
                                            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
                                                <div style={{
                                                    width: "48px", height: "48px", borderRadius: "50%",
                                                    background: `${palette.sage}20`, border: `1px solid ${palette.sage}40`,
                                                    display: "flex", alignItems: "center", justifyContent: "center"
                                                }}>
                                                    <Music size={20} color="#87b0a5" />
                                                </div>
                                                <MiniEqualizer color="#87b0a5" bars={6} />
                                            </div>

                                            {/* Text */}
                                            <div style={{ flex: 1 }}>
                                                <SerifLabel color={T.textSecondary}>Melody for You</SerifLabel>
                                                <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: isMobile ? "1.6rem" : "1.9rem", fontWeight: 700, color: T.textPrimary, lineHeight: 1.25, marginTop: "0.3rem", marginBottom: "0.5rem", transition: "color 0.5s ease" }}>
                                                    Lagu-lagu yang menggambarkan dirimu
                                                </h3>
                                                <Note color={T.handwrittenColor} style={{ fontSize: "1rem", opacity: 0.65 }}>
                                                    Setiap nada punya cerita tentangmu... 🎶
                                                </Note>
                                            </div>

                                            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ alignSelf: "center" }}>
                                                <ChevronRight size={22} color="#87b0a5" style={{ opacity: 0.3 }} />
                                            </motion.div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </motion.div>


                        {/* ═══════════════════════════════════════════ */}
                        {/* CLOSING — Handmade sign-off                */}
                        {/* ═══════════════════════════════════════════ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            style={{ marginTop: isMobile ? "3rem" : "4.5rem", paddingBottom: "3.5rem", textAlign: "center", position: "relative" }}
                        >
                            {/* Tiny cute objects around closing */}
                            <TinyObject emoji="🌸" size={13} top="-10px" left="20%" rotate={-12} delay={0.3} />
                            <TinyObject emoji="🌷" size={12} top="10px" right="25%" rotate={15} delay={0.5} />
                            <TinyObject emoji="💛" size={10} bottom="40px" left="30%" rotate={-5} delay={0.7} />

                            {/* Decorative line with flowers */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", justifyContent: "center", marginBottom: "2.5rem" }}>
                                <div style={{ width: "40px", height: "1px", background: `linear-gradient(to right, transparent, ${T.accent})`, opacity: 0.3 }} />
                                <span style={{ fontSize: "12px", opacity: 0.4 }}>🌸</span>
                                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                                    <Heart size={13} color={T.accent} fill={T.accent} style={{ opacity: 0.35 }} />
                                </motion.div>
                                <span style={{ fontSize: "12px", opacity: 0.4 }}>🌸</span>
                                <div style={{ width: "40px", height: "1px", background: `linear-gradient(to left, transparent, ${T.accent})`, opacity: 0.3 }} />
                            </div>

                            {/* Sign-off illustration */}
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                style={{ width: "65px", height: "65px", position: "relative", margin: "0 auto 1.5rem", opacity: 0.65, mixBlendMode: mode === "default" ? "multiply" : "screen" }}
                            >
                                <Image src="/special_wildflowers.webp" alt="" fill style={{ objectFit: "contain" }} />
                            </motion.div>

                            <Note color={T.textAccent} style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.5rem" }}>
                                Ruang ini tercipta untuk merayakan
                            </Note>
                            <Note color={T.textAccent} style={{ fontSize: "1.5rem", display: "block", marginBottom: "2rem" }}>
                                setiap jejak langkah kecilmu. ♡
                            </Note>
                            <Note color={T.textSecondary} style={{ fontSize: "0.9rem", opacity: 0.4 }}>
                                ~ dengan sepenuh hati ~
                            </Note>
                        </motion.div>

                    </Container>
                </section>
            </main>
        </div>
    );
}
