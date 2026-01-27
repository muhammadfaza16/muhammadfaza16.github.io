"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Sparkles, Clock, Calendar, Heart, Gift, Activity, Wind, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";

// --- Components ---

const WashiTape = ({ color, rotate = "0deg", width = "70px", height = "18px" }: { color: string, rotate?: string, width?: string, height?: string }) => (
    <div style={{
        position: "absolute",
        top: "-8px",
        left: "50%",
        transform: `translateX(-50%) rotate(${rotate})`,
        width: width,
        height: height,
        backgroundColor: color,
        opacity: 0.7,
        zIndex: 10,
        boxShadow: "1px 1px 2px rgba(0,0,0,0.05)",
        // Jagged edges mask
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
        lineHeight: 1,
        ...style
    }}>
        {children}
    </span>
);

const BentoCard = ({ children, style = {}, rotate = "0deg", delay = 0, tapeColor }: { children: React.ReactNode, style?: React.CSSProperties, rotate?: string, delay?: number, tapeColor?: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.98, rotate: parseFloat(rotate) - 0.5 }}
        animate={{ opacity: 1, scale: 1, rotate: rotate }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        style={{
            background: "#fff",
            borderRadius: "4px 8px 4px 10px / 12px 4px 15px 4px", // Organic, slightly irregular
            border: "1px solid #e8e2d9",
            boxShadow: "2px 5px 15px rgba(160, 144, 125, 0.1)",
            padding: "1.5rem",
            position: "relative",
            ...style
        }}
    >
        {tapeColor && <WashiTape color={tapeColor} rotate={parseFloat(rotate) > 0 ? "-2deg" : "2deg"} />}
        {/* Subtle Paper Texture */}
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

const DotGrid = ({ total, filled, columns = 20, color = "#d2691e", size = "6px" }: { total: number, filled: number, columns?: number, color?: string, size?: string }) => (
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
                borderRadius: "20%", // Slightly rounded square for 'stamped' look
                background: i < filled ? color : "#f2efeb",
                opacity: i < filled ? 0.9 : 0.4,
                transition: "all 0.4s ease",
                transform: `rotate(${Math.random() * 5 - 2.5}deg)` // Random jitter for hand-stamped feel
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
    const daysLived = Math.floor(totalMsLived / (1000 * 60 * 60 * 24));

    // Exact Age
    let age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--;
    }

    // Year Progress (Days)
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const totalDaysInYear = (new Date(now.getFullYear(), 11, 31).getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
    const daysGoneInYear = Math.floor((now.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeftInYear = Math.ceil(totalDaysInYear - daysGoneInYear);

    // Birthday Cycle
    let lastBirthday = new Date(now.getFullYear(), 10, 28);
    if (now < lastBirthday) lastBirthday = new Date(now.getFullYear() - 1, 10, 28);

    let nextBirthday = new Date(lastBirthday.getFullYear() + 1, 10, 28);
    const totalDaysInBirthCycle = Math.round((nextBirthday.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassedInCycle = Math.floor((now.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24));
    const daysToBirthday = Math.ceil(totalDaysInBirthCycle - daysPassedInCycle);

    return (
        <div style={{
            background: "#fdf8f4", // Warmer cream
            backgroundImage: "radial-gradient(#e5e0d8 0.6px, transparent 0)",
            backgroundSize: "28px 28px",
            minHeight: "100svh",
            color: "#4e4439", // Muted brown ink
            fontFamily: "'Crimson Pro', serif, -apple-system",
            position: "relative",
            overflowX: "hidden",
            paddingBottom: "5rem"
        }}>
            {/* Handwriting Link */}
            <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />

            {/* Watercolor stains / Overlays */}
            <div style={{ position: "fixed", top: "-5%", left: "-5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(210, 105, 30, 0.03) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", bottom: "10%", right: "2%", width: "150px", height: "150px", opacity: 0.1, pointerEvents: "none", zIndex: 1, transform: "rotate(15deg)" }}>
                <Image src="/detail_rose.png" alt="" fill style={{ objectFit: 'contain' }} />
            </div>

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "1.5rem 0" : "3rem 0" }}>
                <Container>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isMobile ? "2.5rem" : "4.5rem" }}>
                        <Link href="/guest/no28" style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: "42px", height: "42px", background: "#fff", border: "1.2px solid #a0907d",
                            borderRadius: "12px", color: "#a0907d", boxShadow: "0 2px 8px rgba(160,144,125,0.15)"
                        }}>
                            <Home size={20} />
                        </Link>
                        <div style={{ textAlign: "right" }}>
                            <HandwrittenNote style={{ fontSize: "1rem", opacity: 0.7 }}>{now.toLocaleDateString('id-ID', { weekday: 'long' })}</HandwrittenNote>
                            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#a0907d", letterSpacing: "1px" }}>
                                {now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* WARM SCRAPBOOK GRID */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(12, 1fr)",
                        gap: isMobile ? "1.5rem" : "2rem",
                    }}>

                        {/* 1. Rangkuman Perjalanan */}
                        <BentoCard style={{ gridColumn: isMobile ? "span 1" : "span 6" }} rotate="-0.5deg" tapeColor="#fde2e4">
                            <SectionTitle icon={Heart}>Rangkuman Perjalanan</SectionTitle>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <div>
                                    <div style={{ fontSize: "4.8rem", fontWeight: 800, color: "#b07d62", lineHeight: 0.85, fontFamily: "'Crimson Pro', serif" }}>
                                        {monthsLived}
                                    </div>
                                    <HandwrittenNote style={{ marginTop: "10px", fontSize: "1.1rem" }}>Bulan yang penuh warna...</HandwrittenNote>
                                </div>
                                <div style={{ textAlign: "right", color: "#a0907d" }}>
                                    <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>{totalLifeMonths - monthsLived} BULAN MENUJU 80</div>
                                </div>
                            </div>
                            <div style={{ marginTop: "2rem", position: "relative" }}>
                                <DotGrid total={isMobile ? 120 : 220} filled={Math.round((monthsLived / totalLifeMonths) * (isMobile ? 120 : 220))} columns={isMobile ? 12 : 22} size="8px" color="#b07d62" />
                                <HandwrittenNote style={{ position: "absolute", bottom: "-25px", right: "0", fontSize: "0.9rem", transform: "rotate(-2deg)" }}>
                                    "Kamu di sini ✨"
                                </HandwrittenNote>
                            </div>
                        </BentoCard>

                        {/* 2. Tapestri Tahun */}
                        <BentoCard style={{ gridColumn: isMobile ? "span 1" : "span 6" }} rotate="1deg" tapeColor="#e2ece9">
                            <SectionTitle icon={Calendar}>Tapestri Tahun {now.getFullYear()}</SectionTitle>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                                <div style={{ fontSize: "2.8rem", fontWeight: 800, color: "#4e4439", fontFamily: "'Crimson Pro', serif" }}>{daysGoneInYear} Hari</div>
                                <HandwrittenNote style={{ fontSize: "1.3rem", transform: "rotate(5deg)" }}>{daysLeftInYear} hari lagi menanti!</HandwrittenNote>
                            </div>
                            <DotGrid total={isMobile ? 140 : 280} filled={Math.round((daysGoneInYear / totalDaysInYear) * (isMobile ? 140 : 280))} columns={isMobile ? 14 : 28} size="4px" color="#a0907d" />
                            <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#a0907d", fontStyle: "italic", textAlign: "right" }}>
                                * {Math.round((daysGoneInYear / totalDaysInYear) * 100)}% dari tahun ini telah jadi kenangan.
                            </p>
                        </BentoCard>

                        {/* 3. Menuju Perayaan Dirimu */}
                        <BentoCard style={{ gridColumn: isMobile ? "span 1" : "span 12" }} rotate="-0.2deg" tapeColor="#dfccf1">
                            <WashiTape color="#fff1e6" rotate="5deg" width="40px" height="15px" />
                            <SectionTitle icon={Gift}>Menuju Perayaan Dirimu ke-{age + 1}</SectionTitle>
                            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "auto 1fr", gap: isMobile ? "1.5rem" : "3rem", alignItems: "center" }}>
                                <div style={{ textAlign: "center", borderRight: isMobile ? "none" : "1px dashed #e5e0d8", paddingRight: isMobile ? "0" : "2rem" }}>
                                    <div style={{ fontSize: "5.5rem", fontWeight: 900, color: "#b07d62", lineHeight: 1, fontFamily: "'Crimson Pro', serif" }}>{daysToBirthday}</div>
                                    <HandwrittenNote style={{ fontSize: "1.2rem" }}>Matahari Terbit Lagi</HandwrittenNote>
                                </div>

                                <div style={{ position: "relative" }}>
                                    {/* Circle annotation around current progress */}
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(15, 1fr)", gap: "6px" }}>
                                        {Array.from({ length: isMobile ? 60 : 120 }).map((_, i) => {
                                            const progress = daysPassedInCycle / totalDaysInBirthCycle;
                                            const isFilled = i < (progress * (isMobile ? 60 : 120));
                                            const isTarget = i === (isMobile ? 59 : 119);
                                            return (
                                                <div key={i} style={{
                                                    aspectRatio: "1",
                                                    borderRadius: "2px",
                                                    background: isFilled ? "#b07d62" : "#f5f2ee",
                                                    opacity: isFilled ? 1 : 0.5,
                                                    border: isTarget ? "1px solid #b07d62" : "none",
                                                    position: "relative"
                                                }}>
                                                    {isTarget && <Sparkles size={10} color="#b07d62" style={{ position: "absolute", top: "-10px", right: "-10px" }} />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <HandwrittenNote style={{ marginTop: "1rem", fontSize: "1rem", display: "block", textAlign: isMobile ? "center" : "left" }}>
                                        "Setiap kotak adalah nafas yang membawa kita pulang."
                                    </HandwrittenNote>
                                </div>
                            </div>
                        </BentoCard>

                        {/* 4. Bisikan Sanubari */}
                        <BentoCard style={{ gridColumn: isMobile ? "span 1" : "span 12", padding: isMobile ? "2.5rem 1.5rem" : "4rem", background: "#fffaf5" }} rotate="0deg" tapeColor="#fad2e1">
                            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
                                <Wind size={22} color="#b07d62" style={{ margin: "0 auto 1.5rem", opacity: 0.4 }} />
                                <p style={{ fontSize: isMobile ? "1.2rem" : "1.6rem", color: "#4e4439", fontStyle: "italic", lineHeight: 1.7, fontWeight: 300 }}>
                                    "{wisdom}"
                                </p>
                                <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
                                    <HandwrittenNote style={{ fontSize: "1.3rem" }}>— Catatan Sanubari</HandwrittenNote>
                                </div>
                            </div>
                        </BentoCard>

                    </div>

                    {/* Footer Scribble */}
                    <div style={{ marginTop: "4rem", textAlign: "center", opacity: 0.5 }}>
                        <HandwrittenNote style={{ fontSize: "0.9rem" }}>Dibuat dengan segenap doa untuk Kamu.</HandwrittenNote>
                    </div>
                </Container>
            </main>
        </div>
    );
}
