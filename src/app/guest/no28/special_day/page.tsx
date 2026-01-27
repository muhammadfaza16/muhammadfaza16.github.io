"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Sparkles, Clock, Calendar, Heart, Gift, Activity, Wind, Star, BookOpen, Map, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";

// --- Components ---

const WashiTape = ({ color, rotate = "0deg", width = "70px", height = "18px" }: { color: string, rotate?: string, width?: string, height?: string }) => (
    <div style={{
        position: "absolute",
        top: "-10px",
        left: "50%",
        transform: `translateX(-50%) rotate(${rotate})`,
        width: width,
        height: height,
        backgroundColor: color,
        opacity: 0.7,
        zIndex: 10,
        boxShadow: "1px 1px 3px rgba(0,0,0,0.05)",
        maskImage: "linear-gradient(90deg, transparent 2px, #000 2px, #000 calc(100% - 2px), transparent calc(100% - 2px))",
        mixBlendMode: "multiply"
    }}>
        <div style={{ width: "100%", height: "100%", opacity: 0.1, background: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }} />
    </div>
);

const HandwrittenNote = ({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <span style={{
        fontFamily: "'Caveat', cursive, 'Brush Script MT'",
        color: "#a0907d",
        fontSize: "1.2rem",
        display: "inline-block",
        lineHeight: 1.1,
        ...style
    }}>
        {children}
    </span>
);

const BentoCard = ({ children, style = {}, rotate = "0deg", delay = 0, tapeColor }: { children: React.ReactNode, style?: React.CSSProperties, rotate?: string, delay?: number, tapeColor?: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.98, rotate: parseFloat(rotate) - 0.5 }}
        whileInView={{ opacity: 1, scale: 1, rotate: rotate }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        style={{
            background: "#fff",
            borderRadius: "4px 8px 4px 10px / 12px 4px 15px 4px",
            border: "1px solid #e8e2d9",
            boxShadow: "2px 5px 15px rgba(160, 144, 125, 0.08)",
            padding: "1.5rem",
            position: "relative",
            ...style
        }}
    >
        {tapeColor && <WashiTape color={tapeColor} rotate={parseFloat(rotate) > 0 ? "-2deg" : "2deg"} />}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none", backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </motion.div>
);

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.2rem" }}>
        {Icon && <Icon size={14} color="#a0907d" style={{ opacity: 0.8 }} />}
        <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a0907d", textTransform: "uppercase", letterSpacing: "2.5px" }}>{children}</h3>
    </div>
);

const DotGrid = ({ total, filled, columns = 20, color = "#b07d62", size = "6px" }: { total: number, filled: number, columns?: number, color?: string, size?: string }) => (
    <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "4px",
        marginTop: "10px"
    }}>
        {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
                width: size,
                height: size,
                borderRadius: "2px",
                background: i < filled ? color : "#f5f2ee",
                opacity: i < filled ? 1 : 0.5,
                transition: "all 0.4s ease",
                transform: `rotate(${Math.random() * 6 - 3}deg)` // Hand-stamped effect
            }} />
        ))}
    </div>
);

// --- Page ---

export default function SpecialDayBentoPage() {
    const [mounted, setMounted] = useState(false);
    const [now, setNow] = useState(new Date());
    const [isMobile, setIsMobile] = useState(false);
    const [wisdom, setWisdom] = useState("");

    // Birth Date: 28 November 2000
    const birthDate = new Date(2000, 10, 28);
    const lifeExpectancyYears = 80;
    const totalLifeMonths = lifeExpectancyYears * 12;

    useEffect(() => {
        setMounted(true);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);

        const timer = setInterval(() => setNow(new Date()), 1000);

        const dailyWisdoms = [
            "Kamu adalah alasan di balik senyuman yang merekah hari ini, meski terkadang kau tak menyadarinya. Keberadaanmu bukan sekadar angka di kalender, melainkan anugerah terindah bagi semesta yang seringkali lupa cara bersyukur.",
            "Setiap langkah yang kau tapaki adalah guratan berharga dalam kanvas waktu yang abadi. Jangan pernah ragu pada dirimu sendiri, karena setiap hela nafasmu adalah bukti nyata bahwa dunia masih membutuhkan cahayamu.",
            "Hari ini adalah selembar kertas kosong yang menanti sentuhan cintamu yang paling jujur. Lukislah setiap detiknya dengan kebaikan dan keberanian, sebab kau jauh lebih kuat dari rintangan mana pun.",
            "Tetaplah bersinar dengan caramu yang paling tenang. Dunia ini mungkin riuh dengan suara-suara yang asing, tapi ingatlah selalu bahwa di antara milyaran melodi, kaulah simfoni paling damai.",
            "Kebahagiaanmu bukanlah sebuah tujuan jauh di ufuk sana, melainkan prioritas utama yang harus kau jaga di sini, saat ini. Cintailah dirimu sendiri seakan-akan kau adalah permata paling langka.",
            "Terimalah dirimu apa adanya, dekaplah setiap detik yang kau miliki dengan rasa syukur yang mendalam. Sebab di antara riuh rendah bisingnya dunia, kaulah melodi paling tenang yang pernah semesta ciptakan.",
            "Jangan pernah biarkan cahayamu redup hanya karena dunia belum siap menerima benderangnya. Kamu adalah kepingan teka-teki paling indah yang membuat gambaran tentang hidup ini menjadi sempurna."
        ];
        const dayOfMonth = new Date().getDate();
        setWisdom(dailyWisdoms[dayOfMonth % dailyWisdoms.length]);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(timer);
        };
    }, []);

    if (!mounted) return null;

    // --- Calculations ---
    const totalMsLived = now.getTime() - birthDate.getTime();
    const monthsLived = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());

    // Exact Age
    let age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--;
    }

    // --- Personal Year Loop (Birthday-to-Birthday Progress) ---
    let startOfPersonalYear = new Date(now.getFullYear(), 10, 28);
    if (now < startOfPersonalYear) startOfPersonalYear = new Date(now.getFullYear() - 1, 10, 28);

    let endOfPersonalYear = new Date(startOfPersonalYear.getFullYear() + 1, 10, 28);
    const totalDaysInPersonalYear = Math.round((endOfPersonalYear.getTime() - startOfPersonalYear.getTime()) / (1000 * 60 * 60 * 24));
    const currentDayInPersonalYear = Math.floor((now.getTime() - startOfPersonalYear.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeftInPersonalYear = totalDaysInPersonalYear - currentDayInPersonalYear;

    return (
        <div style={{
            background: "#fdf8f4",
            backgroundImage: "radial-gradient(#e5e0d8 0.7px, transparent 0)",
            backgroundSize: "32px 32px",
            minHeight: "100svh",
            color: "#4e4439",
            fontFamily: "'Crimson Pro', serif, -apple-system",
            position: "relative",
            overflowX: "hidden",
            paddingBottom: "5rem"
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />

            {/* Watercolor & Artistic Overlays */}
            <div style={{ position: "fixed", top: "5%", right: "-3%", width: "250px", height: "250px", opacity: 0.1, pointerEvents: "none", zIndex: 0 }}>
                <Image src="/detail_lavender.png" alt="" fill style={{ objectFit: 'contain' }} />
            </div>

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "1.5rem 0" : "3rem 0" }}>
                <Container>
                    {/* Header: Dedicated to 28 */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isMobile ? "2.5rem" : "4.5rem" }}>
                        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                            <Link href="/guest/no28" style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "44px", height: "44px", background: "#fff", border: "1.2px solid #a0907d",
                                borderRadius: "12px", color: "#a0907d", boxShadow: "0 2px 10px rgba(160,144,125,0.12)"
                            }}>
                                <Home size={22} />
                            </Link>
                            <div style={{ transform: "rotate(-1deg)" }}>
                                <div style={{ fontSize: "0.65rem", color: "#a0907d", textTransform: "uppercase", letterSpacing: "2.5px", fontWeight: 700, marginBottom: "-2px" }}>Narasi Hidup</div>
                                <HandwrittenNote style={{ fontSize: "1.3rem", fontWeight: 400, color: "#b07d62" }}>
                                    Untukmu, Sang Pemilik Angka 28...
                                </HandwrittenNote>
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <HandwrittenNote style={{ fontSize: "1rem", opacity: 0.7 }}>Bait Hari Ini</HandwrittenNote>
                            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#a0907d", letterSpacing: "1px" }}>
                                {now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* 100% PERSONALIZED GRID */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(12, 1fr)",
                        gap: isMobile ? "1.5rem" : "2.2rem",
                    }}>

                        {/* 1. Seasons of Her Life (The Timeline Widget) */}
                        <BentoCard style={{ gridColumn: isMobile ? "span 1" : "span 12" }} rotate="0.2deg" tapeColor="#e2ece9">
                            <SectionTitle icon={BookOpen}>Musim-Musim Kehidupanmu</SectionTitle>
                            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "2rem", marginTop: "1rem" }}>
                                {[
                                    { year: "2000 - 2007", title: "Awal Keajaiban", desc: "Dunia mulai mengenal benderang cahayamu.", icon: Sparkles },
                                    { year: "2007 - 2018", title: "Mekar & Belajar", desc: "Masa di mana mimpi-mimpimu mulai berhamburan.", icon: Star },
                                    { year: "2018 - Kini", title: "Menemukan Jati Diri", desc: "Menjadi melodi paling tenang di tengah riuh dunia.", icon: Heart }
                                ].map((chapter, i) => (
                                    <div key={i} style={{ flex: 1, position: "relative", paddingLeft: isMobile ? "1.5rem" : "0", borderLeft: isMobile ? "1px dashed #e5e0d8" : "none" }}>
                                        {!isMobile && i > 0 && <div style={{ position: "absolute", left: "-1rem", top: "1.5rem", width: "1rem", borderTop: "1px dashed #e5e0d8" }} />}
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#fdf8f4", border: "1px solid #e8e2d9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <chapter.icon size={14} color="#b07d62" />
                                            </div>
                                            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#aaa" }}>{chapter.year}</span>
                                        </div>
                                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#4e4439" }}>{chapter.title}</h4>
                                        <HandwrittenNote style={{ fontSize: "1rem", marginTop: "4px" }}>{chapter.desc}</HandwrittenNote>
                                    </div>
                                ))}
                            </div>
                        </BentoCard>

                        {/* 2. Personal Year Loop (Instead of Calendar) */}
                        <BentoCard style={{ gridColumn: isMobile ? "span 1" : "span 7" }} rotate="-0.4deg" tapeColor="#fde2e4">
                            <SectionTitle icon={Map}>Lingkaran Usia Ke-{age + 1}</SectionTitle>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
                                <div>
                                    <div style={{ fontSize: "0.8rem", color: "#a0907d", letterSpacing: "1px", fontWeight: 700 }}>PROGRES TAHUN INI</div>
                                    <div style={{ fontSize: "3.5rem", fontWeight: 900, color: "#b07d62", lineHeight: 1, fontFamily: "'Crimson Pro', serif" }}>
                                        {currentDayInPersonalYear} <span style={{ fontSize: "1.2rem", fontWeight: 300, color: "#4e4439", fontStyle: "italic" }}>Hari</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <HandwrittenNote style={{ fontSize: "1.2rem" }}>{daysLeftInPersonalYear} hari lagi...</HandwrittenNote>
                                    <div style={{ fontSize: "0.7rem", color: "#aaa", textTransform: "uppercase" }}>MENUJU 28 NOV</div>
                                </div>
                            </div>
                            <div style={{ position: "relative", padding: "10px 0" }}>
                                <DotGrid total={isMobile ? 120 : 220} filled={Math.round((currentDayInPersonalYear / totalDaysInPersonalYear) * (isMobile ? 120 : 220))} columns={isMobile ? 12 : 22} size="8px" color="#b07d62" />
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.7rem", fontWeight: 700, color: "#aaa" }}>
                                    <span>28 NOV {startOfPersonalYear.getFullYear()}</span>
                                    <span>28 NOV {endOfPersonalYear.getFullYear()}</span>
                                </div>
                                <HandwrittenNote style={{ position: "absolute", top: "0", right: "20%", transform: "rotate(5deg)", fontSize: "0.9rem" }}>
                                    "Terus bersemi ya..."
                                </HandwrittenNote>
                            </div>
                        </BentoCard>

                        {/* 3. Kamus Angka 28 (Dedicated Widget) */}
                        <BentoCard style={{ gridColumn: isMobile ? "span 1" : "span 5", background: "linear-gradient(to bottom, #fff, #fdfbf7)" }} rotate="0.6deg" tapeColor="#dfccf1">
                            <SectionTitle icon={Sparkles}>Kamus Angka 28</SectionTitle>
                            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                                <div style={{ fontSize: "6rem", fontWeight: 900, color: "#b07d62", lineHeight: 0.8, fontFamily: "'Crimson Pro', serif", position: "relative", display: "inline-block" }}>
                                    28
                                    <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: "absolute", top: "-10px", right: "-20px" }}>
                                        <Sparkles size={24} color="#d2691e" opacity={0.4} />
                                    </motion.div>
                                </div>
                                <div style={{ marginTop: "2rem", textAlign: "left" }}>
                                    <div style={{ marginBottom: "1rem", borderBottom: "1px dashed #e8e2d9", pb: "5px" }}>
                                        <HandwrittenNote style={{ color: "#4e4439", fontSize: "1.1rem" }}>"Angka yang membawa tenang ke bumi."</HandwrittenNote>
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: "#a0907d", fontStyle: "italic", lineHeight: 1.5 }}>
                                        Bukan sekadar tanggal, melainkan awal dari bait-bait puisi yang sedang semesta tuliskan bersamamu.
                                    </div>
                                </div>
                            </div>
                        </BentoCard>

                        {/* 4. Bisikan Sanubari (Consolidated Wisdom) */}
                        <BentoCard style={{ gridColumn: isMobile ? "span 1" : "span 12", padding: isMobile ? "2.5rem 1.5rem" : "4.5rem", background: "#fefbfc" }} rotate="0deg" tapeColor="#fad2e1">
                            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
                                <Wind size={24} color="#b07d62" style={{ margin: "0 auto 1.5rem", opacity: 0.3 }} />
                                <p style={{ fontSize: isMobile ? "1.25rem" : "1.7rem", color: "#4e4439", fontStyle: "italic", lineHeight: 1.7, fontWeight: 300 }}>
                                    "{wisdom}"
                                </p>
                                <div style={{ marginTop: "3rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                    <div style={{ width: "20px", height: "1px", background: "#b07d62", opacity: 0.2 }} />
                                    <HandwrittenNote style={{ fontSize: "1.4rem" }}>Bait Untukmu</HandwrittenNote>
                                    <div style={{ width: "20px", height: "1px", background: "#b07d62", opacity: 0.2 }} />
                                </div>
                            </div>
                        </BentoCard>

                    </div>

                    <div style={{ marginTop: "5rem", textAlign: "center", opacity: 0.4 }}>
                        <HandwrittenNote style={{ fontSize: "1rem" }}>Keajaibanmu abadi dalam setiap detik perjalanan ini.</HandwrittenNote>
                    </div>
                </Container>
            </main>
        </div>
    );
}
