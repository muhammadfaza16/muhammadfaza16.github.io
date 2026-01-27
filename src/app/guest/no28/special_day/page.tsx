"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Sparkles, Clock, Calendar, Heart, Gift, Activity, Wind, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";

// --- Components ---

const BentoCard = ({ children, style = {}, rotate = "0deg", delay = 0 }: { children: React.ReactNode, style?: React.CSSProperties, rotate?: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 15, rotate: parseFloat(rotate) - 1 }}
        animate={{ opacity: 1, y: 0, rotate: rotate }}
        transition={{ duration: 0.6, delay }}
        style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #e5e0d8",
            boxShadow: "0 4px 20px rgba(0,0,0,0.02), 0 0 0 1px rgba(0,0,0,0.01)",
            padding: "1.5rem",
            position: "relative",
            overflow: "hidden",
            ...style
        }}
    >
        {/* Subtle Paper Texture Overlay for Card */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </motion.div>
);

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.2rem" }}>
        {Icon && <Icon size={16} color="#d2691e" style={{ opacity: 0.7 }} />}
        <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a0907d", textTransform: "uppercase", letterSpacing: "2px" }}>{children}</h3>
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
                borderRadius: "50%",
                background: i < filled ? color : "#f0ede8",
                opacity: i < filled ? 0.8 : 0.3,
                transition: "all 0.3s ease"
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

    // Birthday Cycle (Days since last birth, days to next birth)
    let lastBirthday = new Date(now.getFullYear(), 10, 28);
    if (now < lastBirthday) lastBirthday = new Date(now.getFullYear() - 1, 10, 28);

    let nextBirthday = new Date(lastBirthday.getFullYear() + 1, 10, 28);
    const totalDaysInBirthCycle = Math.round((nextBirthday.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassedInCycle = Math.floor((now.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24));
    const daysToBirthday = Math.ceil(totalDaysInBirthCycle - daysPassedInCycle);

    return (
        <div style={{
            background: "#fdf8f1",
            backgroundImage: "radial-gradient(#e5e0d8 0.5px, transparent 0)",
            backgroundSize: "24px 24px",
            minHeight: "100svh",
            color: "#444",
            fontFamily: "'Crimson Pro', serif, -apple-system",
            position: "relative",
            overflowX: "hidden",
            paddingBottom: "5rem"
        }}>
            {/* Ink Splatters / Organic Details */}
            <div style={{ position: "fixed", top: "10%", right: "-5%", width: "300px", height: "300px", opacity: 0.1, pointerEvents: "none", zIndex: 1 }}>
                <Image src="/detail_lavender.png" alt="" fill style={{ objectFit: 'contain' }} />
            </div>

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "1.5rem 0" : "3rem 0" }}>
                <Container>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isMobile ? "2rem" : "3.5rem" }}>
                        <Link href="/guest/no28" style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: "44px", height: "44px", background: "#fff", border: "1.5px solid #5a5a5a",
                            boxShadow: "2px 2px 0px #5a5a5a", borderRadius: "10px", color: "#5a5a5a"
                        }}>
                            <Home size={22} />
                        </Link>
                        <div style={{ textAlign: "right", color: "#a0907d", fontSize: "0.85rem", fontStyle: "italic", fontWeight: 500 }}>
                            {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>

                    {/* OVERHAULED DATA BENTO GRID */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(12, 1fr)",
                        gridAutoRows: "auto",
                        gap: isMobile ? "1.2rem" : "1.8rem",
                    }}>

                        {/* 1. Life Progress (2 columns on Desktop) */}
                        <BentoCard style={{ gridColumn: isMobile ? "span 1" : "span 6" }}>
                            <SectionTitle icon={Heart}>Rangkuman Perjalanan</SectionTitle>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                <div>
                                    <div style={{ fontSize: "4.5rem", fontWeight: 800, color: "#d2691e", lineHeight: 1, fontFamily: "'Crimson Pro', serif" }}>
                                        {monthsLived}
                                    </div>
                                    <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#444", marginTop: "4px" }}>Bulan Terlewati</div>
                                </div>
                                <div style={{ textAlign: "right", color: "#a0907d" }}>
                                    <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{totalLifeMonths - monthsLived} BULAN LAGI</div>
                                    <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>BERDASARKAN USIA 80 TAHUN</div>
                                </div>
                            </div>
                            <div style={{ marginTop: "2rem" }}>
                                <DotGrid total={isMobile ? 100 : 200} filled={Math.round((monthsLived / totalLifeMonths) * (isMobile ? 100 : 200))} columns={isMobile ? 10 : 20} size="8px" />
                                <p style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "12px", fontStyle: "italic" }}>
                                    * Setiap titik adalah saksi bisu setiap musim yang telah kau menangkan.
                                </p>
                            </div>
                        </BentoCard>

                        {/* 2. Year Progress (Grid of Days) */}
                        <BentoCard style={{ gridColumn: isMobile ? "span 1" : "span 6" }}>
                            <SectionTitle icon={Calendar}>Tapestri Tahun {now.getFullYear()}</SectionTitle>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
                                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#5a5a5a", fontFamily: "'Crimson Pro', serif" }}>{daysGoneInYear} Hari</div>
                                <div style={{ textAlign: "right", color: "#d2691e" }}>
                                    <div style={{ fontSize: "1rem", fontWeight: 700 }}>{daysLeftInYear} HARI LAGI</div>
                                </div>
                            </div>
                            {/* Smaller dots to fit 365 days visually or summary for mobile */}
                            <DotGrid total={isMobile ? 120 : 365} filled={Math.round((daysGoneInYear / totalDaysInYear) * (isMobile ? 120 : 365))} columns={isMobile ? 15 : 30} size="4px" />
                            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                                <div style={{ flex: 1, height: "4px", background: "#f0ede8", borderRadius: "2px", overflow: "hidden" }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(daysGoneInYear / totalDaysInYear) * 100}%` }} style={{ height: "100%", background: "#d2691e" }} />
                                </div>
                                <span style={{ fontSize: "0.7rem", color: "#aaa", fontWeight: 700 }}>{Math.round((daysGoneInYear / totalDaysInYear) * 100)}%</span>
                            </div>
                        </BentoCard>

                        {/* 3. Birthday Cycle (New Detailed Visualization) */}
                        <BentoCard style={{ gridColumn: isMobile ? "span 1" : "span 12", background: "linear-gradient(to right, #fff, #fdfbf7)" }}>
                            <SectionTitle icon={Gift}>Menuju Perayaan Dirimu ke-{age + 1}</SectionTitle>
                            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: "2rem", alignItems: "center" }}>
                                <div style={{ textAlign: isMobile ? "center" : "left" }}>
                                    <div style={{ fontSize: "0.8rem", color: "#a0907d", letterSpacing: "2px", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>H-Minus</div>
                                    <div style={{ fontSize: "5rem", fontWeight: 900, color: "#d2691e", lineHeight: 0.9, fontFamily: "'Crimson Pro', serif" }}>{daysToBirthday}</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: 300, color: "#444", fontStyle: "italic", marginTop: "4px" }}>Matahari Terbit</div>
                                </div>

                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#aaa", fontWeight: 700, marginBottom: "8px" }}>
                                        <span>DARIMU YANG {age} TAHUN</span>
                                        <span>MENUJU {age + 1} TAHUN</span>
                                    </div>
                                    {/* Detailed Cycle Grid */}
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(15, 1fr)", gap: "6px" }}>
                                        {Array.from({ length: isMobile ? 45 : 90 }).map((_, i) => {
                                            const progress = daysPassedInCycle / totalDaysInBirthCycle;
                                            const isFilled = i < (progress * (isMobile ? 45 : 90));
                                            return (
                                                <div key={i} style={{
                                                    aspectRatio: "1",
                                                    borderRadius: "3px",
                                                    background: isFilled ? "#d2691e" : "#f0ede8",
                                                    opacity: isFilled ? 0.9 : 0.2,
                                                    boxShadow: isFilled ? "0 0 8px rgba(210, 105, 30, 0.2)" : "none"
                                                }} />
                                            );
                                        })}
                                    </div>
                                    <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#444", fontWeight: 500, fontStyle: "italic" }}>
                                        "Setiap titik adalah hembusan nafas yang membawamu pulang ke hari spesialmu."
                                    </p>
                                </div>
                            </div>
                        </BentoCard>

                        {/* 4. Poetic Wisdom (Rotating) */}
                        <BentoCard style={{ gridColumn: isMobile ? "span 1" : "span 12", padding: isMobile ? "2rem 1.5rem" : "3.5rem" }} rotate="-0.2deg">
                            <div style={{ maxWidth: "850px", margin: "0 auto", textAlign: "center" }}>
                                <Wind size={24} color="#d2691e" style={{ margin: "0 auto 1.5rem", opacity: 0.4 }} />
                                <p style={{ fontSize: isMobile ? "1.2rem" : "1.65rem", color: "#2d2d2d", fontStyle: "italic", lineHeight: 1.7, fontWeight: 300 }}>
                                    "{wisdom}"
                                </p>
                                <div style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                                    <div style={{ width: "30px", height: "1.5px", background: "#d2691e", opacity: 0.15 }} />
                                    <span style={{ fontSize: "0.8rem", fontWeight: 800, letterSpacing: "4px", textTransform: "uppercase", color: "#a0907d" }}>Bisikan Sanubari</span>
                                    <div style={{ width: "30px", height: "1.5px", background: "#d2691e", opacity: 0.15 }} />
                                </div>
                            </div>
                        </BentoCard>

                    </div>
                </Container>
            </main>
        </div>
    );
}
