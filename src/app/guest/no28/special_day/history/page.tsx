"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Sparkles, Star, Heart, BookOpen, Wind, Quote, Moon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { useTheme } from "@/components/guest/no28/ThemeContext";
import { ThemeToggle } from "@/components/guest/no28/ThemeToggle";

// --- Shared UI Primitives ---

const HandwrittenNote = ({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <span style={{
        fontFamily: "'Caveat', cursive, 'Brush Script MT'", color: "#a0907d",
        fontSize: "1.2rem", display: "inline-block", lineHeight: 1.2, ...style
    }}>{children}</span>
);

const SectionDivider = ({ label }: { label?: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "4rem 0 2rem" }}>
        <div style={{ flex: 1, height: "1px", background: "#e8e2d9" }} />
        {label && <HandwrittenNote style={{ fontSize: "1rem", opacity: 0.6 }}>{label}</HandwrittenNote>}
        <div style={{ flex: 1, height: "1px", background: "#e8e2d9" }} />
    </div>
);

const NoiseOverlay = () => (
    <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, opacity: 0.07,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        mixBlendMode: "overlay"
    }} />
);

// --- Animation Variants ---
const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

// --- Moon Phase Calculator ---
function getMoonPhaseOnDate(date: Date): { phase: string; emoji: string; illumination: number } {
    // Simplified synodic month calculation
    const known = new Date(2000, 0, 6, 18, 14); // Known new moon
    const msPerDay = 86400000;
    const synodicMonth = 29.53059;
    const daysSinceKnown = (date.getTime() - known.getTime()) / msPerDay;
    const lunation = daysSinceKnown / synodicMonth;
    const phaseDay = ((lunation % 1) + 1) % 1 * synodicMonth;

    if (phaseDay < 1.85) return { phase: "Bulan Baru", emoji: "🌑", illumination: 0 };
    if (phaseDay < 5.53) return { phase: "Sabit Awal", emoji: "🌒", illumination: 15 };
    if (phaseDay < 9.22) return { phase: "Kuartal Pertama", emoji: "🌓", illumination: 50 };
    if (phaseDay < 12.91) return { phase: "Cembung Awal", emoji: "🌔", illumination: 75 };
    if (phaseDay < 16.61) return { phase: "Purnama", emoji: "🌕", illumination: 100 };
    if (phaseDay < 20.30) return { phase: "Cembung Akhir", emoji: "🌖", illumination: 75 };
    if (phaseDay < 23.99) return { phase: "Kuartal Terakhir", emoji: "🌗", illumination: 50 };
    if (phaseDay < 27.68) return { phase: "Sabit Akhir", emoji: "🌘", illumination: 15 };
    return { phase: "Bulan Baru", emoji: "🌑", illumination: 0 };
}


// --- Page ---

export default function HistoryPage() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [portraitIndex, setPortraitIndex] = useState(0);
    const [selectedPortrait, setSelectedPortrait] = useState<{ src: string, label: string } | null>(null);
    const { tokens: T } = useTheme();

    const portraits = [
        { src: "/portrait_4.webp", label: "Ada banyak hal baik yang bermula dari keramahanmu" },
        { src: "/portrait_1.webp", label: "Semoga semangat itu tak pernah redup oleh ragu" },
        { src: "/portrait_2.webp", label: "Terima kasih telah menjadi bagian baik dari semesta" },
        { src: "/portrait_5.webp", label: "Hadirmu, pengingat bahwa kebaikan itu nyata" }
    ];

    const birthDate = useMemo(() => new Date(2000, 10, 28), []);
    const moonOnBirthday = useMemo(() => getMoonPhaseOnDate(birthDate), [birthDate]);

    const kamusMeanings = useMemo(() => [
        { title: "Ketenangan & Intuisi", desc: "Dalam numerologi, 28 adalah simbol kepemimpinan yang lembut. Ia membawa harmoni, intuisi tajam, dan keinginan untuk membangun sesuatu yang abadi." },
        { title: "Siklus Bulan", desc: "Butuh sekitar 28 hari bagi bulan untuk menyempurnakan ceritanya dari gelap gulita hingga purnama benderang. Seperti itulah cahayamu tumbuh." },
        { title: "Sebuah Awal", desc: "Bagi semesta, 28 hanyalah angka. Tapi bagi kami yang mengenalmu, ia adalah tanggal di mana dunia menjadi sedikit lebih indah." }
    ], []);

    const [kamusIndex, setKamusIndex] = useState(0);

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);

        const kamusTimer = setInterval(() => setKamusIndex(prev => (prev + 1) % kamusMeanings.length), 20000);
        const portraitTimer = setInterval(() => setPortraitIndex(prev => (prev + 1) % portraits.length), 12000);

        return () => {
            window.removeEventListener('resize', check);
            clearInterval(kamusTimer);
            clearInterval(portraitTimer);
        };
    }, []);

    if (!mounted) return null;

    return (
        <div style={{
            backgroundColor: T.pageBg,
            backgroundImage: T.pageBgDots,
            backgroundSize: T.pageBgSize,
            minHeight: "100svh",
            color: T.textPrimary,
            fontFamily: "'Crimson Pro', serif, -apple-system",
            position: "relative",
            overflowX: "hidden",
            paddingBottom: "5rem",
            transition: "background-color 0.5s ease, color 0.5s ease"
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
            <NoiseOverlay />
            <div style={{ position: "fixed", inset: 0, opacity: 0.4, pointerEvents: "none", backgroundImage: T.paperTexture, zIndex: 5 }} />

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "4rem 0" : "6rem 0" }}>
                <Container>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <Link href="/guest/no28/special_day" style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "44px", height: "44px", background: T.buttonBg, border: `2px solid ${T.buttonBorder}`,
                                borderRadius: "12px", color: T.buttonText, boxShadow: T.buttonShadow, transition: "all 0.3s ease"
                            }}>
                                <ArrowLeft size={22} strokeWidth={2} />
                            </Link>
                            <div>
                                <div style={{ fontSize: "0.65rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "2.5px", fontWeight: 700 }}>Brief History of You</div>
                                <HandwrittenNote style={{ fontSize: "1.1rem", color: T.textAccent }}>Jejak-jejak yang membentuk dirimu</HandwrittenNote>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>


                    {/* =============================== */}
                    {/* SECTION 1: Polaroid Portrait    */}
                    {/* =============================== */}
                    <motion.section variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
                        <div style={{
                            background: "#fff",
                            backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
                            borderRadius: "6px", border: "1px solid #e8e2d9",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                            padding: isMobile ? "2rem 1.5rem" : "3rem 2.5rem",
                        }}>
                            <div style={{
                                display: "flex", flexDirection: isMobile ? "column" : "row",
                                alignItems: "center", gap: isMobile ? "2rem" : "4rem",
                            }}>
                                {/* Stacked Polaroid Frame */}
                                <div style={{ position: "relative", width: isMobile ? "220px" : "280px", height: isMobile ? "280px" : "360px", cursor: "pointer" }}
                                    onClick={() => setPortraitIndex(prev => (prev + 1) % portraits.length)}>

                                    {/* Back Layer */}
                                    <div style={{ position: "absolute", top: "16px", left: "16px", width: "100%", height: "100%", background: "#fff", padding: "10px 10px 35px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", transform: "rotate(6deg)", zIndex: 1 }}>
                                        <div style={{ width: "100%", height: "calc(100% - 25px)", background: "#f5f3f0", position: "relative", overflow: "hidden" }}>
                                            <Image src={portraits[(portraitIndex + 2) % portraits.length].src} alt="" fill style={{ objectFit: "cover", objectPosition: "center top", opacity: 0.7 }} />
                                        </div>
                                    </div>

                                    {/* Middle Layer */}
                                    <div style={{ position: "absolute", top: "8px", left: "8px", width: "100%", height: "100%", background: "#fff", padding: "10px 10px 35px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", transform: "rotate(-4deg)", zIndex: 2 }}>
                                        <div style={{ width: "100%", height: "calc(100% - 25px)", background: "#f5f3f0", position: "relative", overflow: "hidden" }}>
                                            <Image src={portraits[portraitIndex].src} alt="" fill style={{ objectFit: "cover", objectPosition: "center top", opacity: 0.85 }} />
                                        </div>
                                    </div>

                                    {/* Top Layer */}
                                    <motion.div
                                        animate={{ rotate: [-2, 0, -2] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedPortrait(portraits[portraitIndex]); }}
                                        style={{
                                            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                                            background: "#fff", padding: "12px 12px 40px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)", zIndex: 3
                                        }}
                                    >
                                        <div style={{ width: "100%", height: "calc(100% - 28px)", position: "relative", overflow: "hidden", background: "#faf8f5" }}>
                                            <AnimatePresence mode="wait">
                                                <motion.div key={portraitIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ position: "absolute", inset: 0 }}>
                                                    <Image src={portraits[portraitIndex].src} alt={portraits[portraitIndex].label} fill style={{ objectFit: "cover", objectPosition: "center top" }} />
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                        <div style={{ position: "absolute", bottom: "10px", left: 0, right: 0, textAlign: "center" }}>
                                            <AnimatePresence mode="wait">
                                                <motion.div key={portraitIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.4 }}>
                                                    <HandwrittenNote style={{ color: "#8a7058", fontSize: "0.95rem", lineHeight: 1.1 }}>
                                                        {portraits[portraitIndex].label}
                                                    </HandwrittenNote>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Text Content */}
                                <div style={{ textAlign: isMobile ? "center" : "left", maxWidth: "400px" }}>
                                    <div style={{ fontSize: "0.7rem", color: "#a0907d", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "0.5rem" }}>Untukmu</div>
                                    <h3 style={{ fontSize: isMobile ? "1.8rem" : "2.2rem", fontWeight: 300, color: "#4e4439", fontFamily: "'Crimson Pro', serif", lineHeight: 1.3, marginBottom: "1rem" }}>
                                        Jiwa yang lahir di hari yang istimewa
                                    </h3>
                                    <HandwrittenNote style={{ fontSize: "1.1rem", lineHeight: 1.6, opacity: 0.8 }}>
                                        Setiap garis di sketsa ini adalah pengingat bahwa keberadaanmu layak untuk diabadikan.
                                    </HandwrittenNote>
                                </div>
                            </div>
                        </div>
                    </motion.section>


                    {/* =============================== */}
                    {/* SECTION 2: Moon on Her Birthday  */}
                    {/* =============================== */}
                    <SectionDivider label="Langit Malam Kelahiranmu" />

                    <motion.section variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
                        <div style={{
                            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                            borderRadius: "6px", border: "1px solid #2a2a4a",
                            boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                            padding: isMobile ? "3rem 1.5rem" : "4rem 3rem",
                            textAlign: "center", position: "relative", overflow: "hidden"
                        }}>
                            {/* Stars Background */}
                            {Array.from({ length: 30 }).map((_, i) => (
                                <motion.div key={i}
                                    animate={{ opacity: [0.2, 0.8, 0.2] }}
                                    transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                                    style={{
                                        position: "absolute",
                                        left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                                        width: "2px", height: "2px", borderRadius: "50%",
                                        background: "#fff"
                                    }}
                                />
                            ))}

                            <Moon size={20} color="rgba(255,255,255,0.3)" style={{ margin: "0 auto 1rem" }} />
                            <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "1.5rem" }}>
                                28 November 2000
                            </div>

                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                style={{ fontSize: "5rem", marginBottom: "1rem", filter: "drop-shadow(0 0 20px rgba(255,255,255,0.2))" }}
                            >
                                {moonOnBirthday.emoji}
                            </motion.div>

                            <h3 style={{ fontSize: "1.6rem", color: "#e8d5b7", fontFamily: "'Crimson Pro', serif", fontWeight: 300, marginBottom: "0.5rem" }}>
                                {moonOnBirthday.phase}
                            </h3>

                            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", fontStyle: "italic", maxWidth: "500px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
                                Di malam kamu lahir, cahaya bulan menerangi {moonOnBirthday.illumination}% langit — seolah semesta sedang bersiap menyambut kehadiranmu.
                            </p>

                            <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                                {["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"].map((emoji, i) => (
                                    <div key={i} style={{ fontSize: "1.2rem", opacity: emoji === moonOnBirthday.emoji ? 1 : 0.2, transition: "opacity 0.3s" }}>
                                        {emoji}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>


                    {/* =============================== */}
                    {/* SECTION 3: Musim Kehidupan       */}
                    {/* =============================== */}
                    <SectionDivider label="Musim-musim yang membentukmu" />

                    <motion.section variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
                        <div style={{
                            background: "#fff",
                            backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
                            borderRadius: "6px", border: "1px solid #e8e2d9",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                            padding: isMobile ? "2rem 1.5rem" : "3rem 2.5rem",
                            position: "relative", overflow: "hidden"
                        }}>
                            <div style={{ position: "absolute", bottom: isMobile ? "-30px" : "-50px", right: isMobile ? "-30px" : "-20px", width: isMobile ? "180px" : "320px", height: isMobile ? "180px" : "320px", opacity: 0.2, transform: "rotate(-3deg)", pointerEvents: "none", zIndex: 0 }}>
                                <Image src="/special_hijabi_main.webp" alt="" fill style={{ objectFit: "contain" }} />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
                                <BookOpen size={14} color="#a0907d" style={{ opacity: 0.8 }} />
                                <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a0907d", textTransform: "uppercase", letterSpacing: "2.5px" }}>Musim-Musim Kehidupanmu</h3>
                            </div>

                            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "1.5rem" : "3rem", position: "relative" }}>
                                {!isMobile && (
                                    <div style={{ position: "absolute", top: "24px", left: "1.5rem", right: "2rem", height: "2px", borderTop: "2px dashed #e8e2d9", zIndex: 0 }} />
                                )}
                                {[
                                    { year: "2000 - 2006", title: "Fajar yang Lembut", desc: "Awal dari segalanya. Waktu yang membentuk siapa kamu.", icon: Sparkles },
                                    { year: "2006 - 2018", title: "Musim Bertumbuh", desc: "Tahun-tahun penuh warna, belajar, dan menemukan diri.", icon: Star },
                                    { year: "2018 - Kini", title: "Langkah Mendewasa", desc: "Perjalanan menjadi versi terbaik dari diri sendiri.", icon: Heart }
                                ].map((chapter, i) => (
                                    <div key={i} style={{ flex: 1, position: "relative", paddingLeft: isMobile ? "1.5rem" : "0", borderLeft: isMobile ? "1px dashed #e5e0d8" : "none", zIndex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#fff", border: "1px solid #e8e2d9", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(176, 125, 98, 0.12)" }}>
                                                <chapter.icon size={14} color="#b07d62" />
                                            </div>
                                            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#aaa" }}>{chapter.year}</span>
                                        </div>
                                        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#4e4439" }}>{chapter.title}</h4>
                                        <HandwrittenNote style={{ fontSize: "0.9rem", marginTop: "4px" }}>{chapter.desc}</HandwrittenNote>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>


                    {/* =============================== */}
                    {/* SECTION 4: Quarter Life          */}
                    {/* =============================== */}
                    <SectionDivider label="Titik keseimbangan" />

                    <motion.section variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
                        <div style={{
                            background: "#fff",
                            backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
                            borderRadius: "6px", border: "1px solid #e8e2d9",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                            padding: isMobile ? "2rem 1.5rem" : "3rem 2.5rem",
                        }}>
                            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "2rem" : "4rem", alignItems: "center" }}>
                                {/* Animated Compass */}
                                <div style={{ flex: isMobile ? "none" : "0 0 35%", display: "flex", justifyContent: "center" }}>
                                    <div style={{ position: "relative", width: "180px", height: "180px" }}>
                                        {[0, 1, 2].map(i => (
                                            <motion.div key={i}
                                                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3], rotate: [0, 90, 180] }}
                                                transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                                                style={{ position: "absolute", inset: i * 20, border: "1px dashed #aebdca", borderRadius: "50%" }}
                                            />
                                        ))}
                                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", zIndex: 10 }}>
                                            <span style={{ fontSize: "5rem", fontFamily: "'Crimson Pro', serif", fontWeight: 400, color: "#4e4439", lineHeight: 0.8 }}>25</span>
                                            <HandwrittenNote style={{ fontSize: "1.2rem", marginTop: "5px" }}>Tahun</HandwrittenNote>
                                        </div>
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", inset: 0 }}>
                                            <div style={{ position: "absolute", top: -15, left: "50%", transform: "translateX(-50%)", background: "#fdf8f4", padding: "5px" }}>
                                                <Star size={16} color="#aebdca" fill="#aebdca" fillOpacity={0.5} />
                                            </div>
                                            <div style={{ position: "absolute", bottom: -15, left: "50%", transform: "translateX(-50%) rotate(180deg)", background: "#fdf8f4", padding: "5px" }}>
                                                <Wind size={16} color="#aebdca" />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Message */}
                                <div style={{ flex: 1, position: "relative" }}>
                                    <div style={{ position: "absolute", top: "-20px", left: "-20px", opacity: 0.1 }}>
                                        <Quote size={60} color="#aebdca" />
                                    </div>
                                    <h3 style={{ fontSize: "1.6rem", fontWeight: 400, color: "#b07d62", fontFamily: "'Crimson Pro', serif", marginBottom: "1rem", fontStyle: "italic" }}>
                                        &ldquo;Titik Keseimbangan Emas&rdquo;
                                    </h3>
                                    <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.1rem", lineHeight: 1.8, color: "#4e4439", marginBottom: "1.5rem" }}>
                                        Banyak yang bilang usia 25 adalah fase yang membingungkan. Seolah kamu harus memilih satu jalan pasti saat hatimu masih ingin menjelajah segalanya.
                                        <br /><br />
                                        Tapi percayalah, ini adalah <strong>usia terindah</strong>. Kakimu sudah cukup kuat untuk berdiri sendiri, tapi hatimu masih cukup lembut untuk memimpikan banyak hal. Kamu tidak terlambat. Kamu tidak tertinggal. Kamu sedang bertumbuh di waktu yang tepat.
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ height: "1px", width: "40px", background: "#aebdca" }} />
                                        <HandwrittenNote style={{ color: "#aebdca", fontSize: "1rem" }}>Quarter Century Bloom</HandwrittenNote>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>


                    {/* =============================== */}
                    {/* SECTION 5: Kamus Angka 28        */}
                    {/* =============================== */}
                    <SectionDivider label="Makna di balik angka" />

                    <motion.section variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
                        <div style={{
                            background: "linear-gradient(to bottom, #fff, #fdfbf7)",
                            backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
                            borderRadius: "6px", border: "1px solid #e8e2d9",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                            padding: isMobile ? "3rem 1.5rem" : "4rem 3rem",
                            textAlign: "center"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "2rem" }}>
                                <Sparkles size={14} color="#a0907d" />
                                <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a0907d", textTransform: "uppercase", letterSpacing: "2.5px" }}>Kamus Angka 28</h3>
                            </div>

                            <div style={{
                                fontSize: "6rem", fontWeight: 900, lineHeight: 0.8, fontFamily: "'Crimson Pro', serif",
                                position: "relative", display: "inline-block",
                                backgroundImage: "linear-gradient(45deg, #b07d62, #d2691e, #8b4513)",
                                backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
                                textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
                            }}>
                                28
                                <motion.div animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: "absolute", top: "-10px", right: "-20px" }}>
                                    <Sparkles size={24} color="#d2691e" opacity={0.6} />
                                </motion.div>
                            </div>

                            <div style={{ marginTop: "2rem", textAlign: "left", height: "140px", position: "relative" }}>
                                <AnimatePresence mode="wait">
                                    <motion.div key={kamusIndex}
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.5 }}
                                        style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
                                    >
                                        <div style={{ marginBottom: "0.5rem", borderBottom: "1px dashed #e8e2d9", paddingBottom: "5px" }}>
                                            <HandwrittenNote style={{ color: "#4e4439", fontSize: "1.1rem" }}>&ldquo;{kamusMeanings[kamusIndex].title}&rdquo;</HandwrittenNote>
                                        </div>
                                        <div style={{ fontSize: "0.85rem", color: "#a0907d", fontStyle: "italic", lineHeight: 1.6 }}>
                                            {kamusMeanings[kamusIndex].desc}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.section>

                    {/* Footer */}
                    <div style={{ marginTop: "5rem", textAlign: "center" }}>
                        <div style={{ width: "40px", height: "1px", background: "#b07d62", margin: "0 auto 1.5rem", opacity: 0.3 }} />
                        <HandwrittenNote style={{ fontSize: "1.2rem", color: "#b07d62" }}>
                            ...karena setiap detailmu layak untuk diceritakan.
                        </HandwrittenNote>
                    </div>

                </Container>
            </main>

            {/* Portrait Popup */}
            <AnimatePresence>
                {selectedPortrait && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedPortrait(null)}
                        style={{
                            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
                            backdropFilter: "blur(4px)", zIndex: 99999,
                            display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem"
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: "#fff", padding: "1.5rem", borderRadius: "2px", maxWidth: "400px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
                        >
                            <div style={{ width: "100%", height: "250px", position: "relative", marginBottom: "1.5rem", background: "#f0f0f0" }}>
                                <Image src={selectedPortrait.src} alt="" fill style={{ objectFit: "cover" }} />
                            </div>
                            <HandwrittenNote style={{ fontSize: "1.2rem", color: "#4e4439", marginBottom: "1rem", lineHeight: 1.6 }}>
                                &ldquo;Izin simpan foto ini sebagai kenang-kenangan.
                                <br /><br />
                                Sayang kalau momen sebagus ini terlewat begitu saja.
                                <br /><br />
                                Tetaplah bersinar, dengan caramu sendiri.&rdquo;
                            </HandwrittenNote>
                            <div style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "1.5rem", cursor: "pointer" }}>(ketuk di luar untuk menutup)</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
