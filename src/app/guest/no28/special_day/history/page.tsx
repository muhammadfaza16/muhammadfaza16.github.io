"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Star, Heart, BookOpen, Wind, Quote, Moon } from "lucide-react";
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
                        borderRadius: "50%", background: drop.color, filter: `blur(${drop.blur}px)`, opacity: 0.3,
                        animation: `wc-paint-drop ${drop.duration}s linear ${drop.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
};

// --- Moon Phase Logic ---
function getMoonPhaseOnDate(date: Date) {
    const known = new Date(2000, 0, 6, 18, 14);
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

export default function HistoryPage() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [portraitIndex, setPortraitIndex] = useState(0);
    const [selectedPortrait, setSelectedPortrait] = useState<{ src: string, label: string } | null>(null);
    const { tokens: T, mode } = useTheme();

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

        const kamusTimer = setInterval(() => setKamusIndex(prev => (prev + 1) % kamusMeanings.length), 15000);
        const portraitTimer = setInterval(() => setPortraitIndex(prev => (prev + 1) % portraits.length), 10000);

        return () => {
            window.removeEventListener('resize', check);
            clearInterval(kamusTimer);
            clearInterval(portraitTimer);
        };
    }, []);

    if (!mounted) return null;

    return (
        <div className="bg-wc-canvas wc-scrollbar" style={{
            minHeight: "100svh", color: T.textPrimary, position: "relative", overflowX: "hidden", paddingBottom: "8rem",
            backgroundImage: T.pageBgDots, backgroundSize: T.pageBgSize, transition: "background-color 0.5s ease"
        }}>
            {/* Ambient Background */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", top: "5%", right: "-5%", width: "500px", height: "500px", background: "radial-gradient(circle, var(--wc-wash-blue-light) 0%, transparent 70%)", filter: "blur(80px)" }}
                />
            </div>
            <AmbientPaintDrops />

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "2rem 0" : "4rem 0" }}>
                <Container>
                    {/* Top Navigation */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                            <Link href="/guest/no28/special_day" className="wc-card hover-ink-bleed" style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "48px", height: "48px", backgroundColor: T.cardBg,
                                borderRadius: "14px", color: T.textPrimary, border: `1px solid ${T.cardBorder}`
                            }}>
                                <ArrowLeft size={24} />
                            </Link>
                            <div style={{ textAlign: "left" }}>
                                <div className="font-serif-display" style={{ fontSize: "0.7rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "3px", fontWeight: 700, opacity: 0.8 }}>Brief History of You</div>
                                <HandwrittenText style={{ fontSize: "1rem", color: T.textAccent }}>Jejak-jejak yang membentuk dirimu</HandwrittenText>
                            </div>
                        </div>
                    </div>

                    {/* PORTRAIT SECTION */}
                    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="wc-card" style={{ padding: isMobile ? "2.5rem 1.5rem" : "4rem 3.5rem", border: `1px solid ${T.cardBorder}` }}>
                            <WashStripe type="blue" />
                            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: isMobile ? "3rem" : "5rem" }}>

                                {/* Photo Stack Interactivity */}
                                <div style={{ position: "relative", width: isMobile ? "200px" : "280px", height: isMobile ? "260px" : "360px", cursor: "pointer", flexShrink: 0 }}
                                    onClick={() => setPortraitIndex(prev => (prev + 1) % portraits.length)}>

                                    {/* Layers for realistic stack effect */}
                                    <div className="wc-card" style={{ position: "absolute", top: "12px", left: "12px", width: "100%", height: "100%", background: "#fff", padding: "8px 8px 30px", border: "none", transform: "rotate(5deg)", zIndex: 1, opacity: 0.4 }}>
                                        <div style={{ width: "100%", height: "calc(100% - 25px)", background: "#f5f3f0", position: "relative", overflow: "hidden" }}>
                                            <Image src={portraits[(portraitIndex + 1) % portraits.length].src} alt="" fill style={{ objectFit: "cover", opacity: 0.5 }} />
                                        </div>
                                    </div>

                                    <motion.div
                                        animate={{ rotate: [-1.5, 0.5, -1.5], y: [0, -5, 0] }}
                                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedPortrait(portraits[portraitIndex]); }}
                                        className="wc-card"
                                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "#fff", padding: "12px 12px 42px", border: "none", boxShadow: "var(--wc-shadow-sm)", zIndex: 3 }}
                                    >
                                        <div style={{ width: "100%", height: "calc(100% - 28px)", position: "relative", overflow: "hidden", background: "#fdf8f4" }}>
                                            <AnimatePresence mode="wait">
                                                <motion.div key={portraitIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ position: "absolute", inset: 0 }}>
                                                    <Image src={portraits[portraitIndex].src} alt="" fill style={{ objectFit: "cover", objectPosition: "center top" }} />
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                        <div style={{ position: "absolute", bottom: "10px", left: 0, right: 0, textAlign: "center", padding: "0 10px" }}>
                                            <AnimatePresence mode="wait">
                                                <motion.div key={portraitIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                                                    <HandwrittenText style={{ fontSize: "0.9rem", color: T.textSecondary, opacity: 0.8, lineHeight: 1.1 }}>{portraits[portraitIndex].label}</HandwrittenText>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                </div>

                                <div style={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
                                    <SectionHeading icon={Sparkles}>A Glance into the Past</SectionHeading>
                                    <h2 className="font-serif-display" style={{ fontSize: isMobile ? "2rem" : "2.6rem", color: T.textPrimary, marginBottom: "1.5rem", fontStyle: "italic", lineHeight: 1.2 }}>Jiwa yang lahir di hari yang istimewa</h2>
                                    <p className="font-serif" style={{ fontSize: "1.15rem", color: T.textSecondary, lineHeight: 1.8, fontWeight: 300 }}>"Setiap garis di sketsa ini adalah pengingat bahwa keberadaanmu selalu layak untuk diabadikan."</p>
                                    <div style={{ marginTop: "2rem", opacity: 0.6 }}>
                                        <HandwrittenText style={{ fontSize: "1rem" }}>(ketuk foto untuk memperbesar...)</HandwrittenText>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* MOON SECTION */}
                    <SectionDivider label="Langit Malam Kelahiranmu" />
                    <motion.section initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                        <div className="wc-card" style={{ background: "linear-gradient(145deg, #121620 0%, #1a202c 100%)", padding: "4rem 2rem", textAlign: "center", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <WashStripe type="lavender" />
                            {/* Stars background inside card */}
                            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.35 }}>
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: "2px", height: "2px", background: "#fff", borderRadius: "50%", animation: `twinkleStar ${2 + Math.random() * 3}s infinite` }} />
                                ))}
                            </div>

                            <div style={{ position: "relative", zIndex: 2 }}>
                                <Moon size={24} color="#8fa0c4" style={{ margin: "0 auto 1.5rem", opacity: 0.6 }} />
                                <div className="font-serif-display" style={{ fontSize: "0.75rem", color: "rgba(255,248,220,0.5)", textTransform: "uppercase", letterSpacing: "4px", marginBottom: "2rem" }}>28 November 2000</div>
                                <motion.div animate={{ scale: [1, 1.04, 1], filter: ["blur(0px)", "blur(1px)", "blur(0px)"] }} transition={{ duration: 5, repeat: Infinity }} style={{ fontSize: "6rem", marginBottom: "1rem" }}>{moonOnBirthday.emoji}</motion.div>
                                <h3 className="font-serif-display" style={{ fontSize: "1.8rem", color: "#e8d5b7", fontStyle: "italic", marginBottom: "0.8rem" }}>{moonOnBirthday.phase}</h3>
                                <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", fontStyle: "italic", maxWidth: "520px", margin: "0 auto 3rem", lineHeight: 1.7 }}>"Di malam kamu lahir, cahaya bulan menerangi {moonOnBirthday.illumination}% langit — seolah semesta sedang bersiap menyambut kehadiranmu."</p>

                                <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                                    {["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"].map((emoji, i) => (
                                        <div key={i} style={{ fontSize: "1.4rem", opacity: emoji === moonOnBirthday.emoji ? 1 : 0.15, transform: emoji === moonOnBirthday.emoji ? "scale(1.2)" : "none", transition: "all 0.4s ease" }}>{emoji}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* MUSIM KEHIDUPAN SECTION */}
                    <SectionDivider label="Musim-musim yang membentukmu" />
                    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="wc-card" style={{ padding: isMobile ? "2.5rem 1.5rem" : "3.5rem 3rem", position: "relative", overflow: "hidden", border: `1px solid ${T.cardBorder}` }}>
                            <WashStripe type="sage" />
                            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "4rem", position: "relative" }}>
                                {[
                                    { year: "2000 - 2006", title: "Fajar yang Lembut", desc: "Awal dari segalanya. Waktu yang membentuk siapa kamu.", icon: Sparkles },
                                    { year: "2006 - 2018", title: "Musim Bertumbuh", desc: "Tahun-tahun penuh warna, belajar, dan menemukan diri.", icon: Star },
                                    { year: "2018 - Kini", title: "Langkah Mendewasa", desc: "Perjalanan menjadi versi terbaik dari diri sendiri.", icon: Heart }
                                ].map((chapter, i) => (
                                    <div key={i} style={{ flex: 1, position: "relative" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                                            <div className="wc-card" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "none" }}>
                                                <chapter.icon size={16} color={T.accent} />
                                            </div>
                                            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, opacity: 0.6, letterSpacing: "1px" }}>{chapter.year}</span>
                                        </div>
                                        <h4 className="font-serif-display" style={{ fontSize: "1.3rem", color: T.textPrimary, marginBottom: "0.6rem" }}>{chapter.title}</h4>
                                        <p className="font-handwriting" style={{ fontSize: "1.1rem", color: T.textSecondary, lineHeight: 1.5 }}>{chapter.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* QUARTER CENTURY SECTION */}
                    <SectionDivider label="Titik keseimbangan" />
                    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="wc-card" style={{ padding: isMobile ? "3rem 1.5rem" : "4.5rem 4rem", border: `1px solid ${T.cardBorder}` }}>
                            <WashStripe type="ochre" />
                            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "4rem", alignItems: "center" }}>
                                <div style={{ flex: isMobile ? "none" : "0 0 35%", display: "flex", justifyContent: "center" }}>
                                    <div style={{ position: "relative", width: "180px", height: "180px" }}>
                                        {[0, 1].map(i => (
                                            <motion.div key={i} animate={{ scale: [1, 1.1, 1], rotate: [0, 90 + i * 90, 180 + i * 180] }} transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", inset: i * 25, border: `1px dashed ${T.dividerColor}`, borderRadius: "50%", opacity: 0.5 }} />
                                        ))}
                                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                                            <span className="font-serif-display" style={{ fontSize: "5rem", color: T.textPrimary, lineHeight: 0.8 }}>25</span>
                                            <HandwrittenText style={{ fontSize: "1.2rem" }}>Tahun</HandwrittenText>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ flex: 1, position: "relative" }}>
                                    <div style={{ position: "absolute", top: "-30px", left: "-30px", opacity: 0.05 }}><Quote size={80} color={T.accent} /></div>
                                    <h3 className="font-serif-display" style={{ fontSize: "1.8rem", color: T.textAccent, marginBottom: "1.5rem", fontStyle: "italic" }}>"Titik Keseimbangan Emas"</h3>
                                    <p className="font-serif" style={{ fontSize: "1.2rem", lineHeight: 1.8, color: T.textSecondary }}>Banyak yang bilang usia 25 adalah fase yang membingungkan. Seolah kamu harus memilih satu jalan pasti saat hatimu masih ingin menjelajah segalanya. <br /><br />Tapi percayalah, ini adalah <strong>usia terindah</strong>. Kakimu sudah cukup kuat untuk berdiri sendiri, tapi hatimu masih cukup lembut untuk memimpikan banyak hal. Kamu tidak terlambat. Kamu tidak tertinggal. Kamu sedang bertumbuh di waktu yang tepat.</p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* KAMUS 28 SECTION */}
                    <SectionDivider label="Makna di balik angka" />
                    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="wc-card" style={{ padding: "4rem 2rem", textAlign: "center", border: `1px solid ${T.cardBorder}` }}>
                            <WashStripe type="ochre" />
                            <div className="font-serif-display" style={{ fontSize: "0.75rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "4px", marginBottom: "2.5rem", opacity: 0.8 }}>Kamus Angka Dua Puluh Delapan</div>
                            <div className="font-serif-display" style={{ fontSize: "7rem", fontWeight: 400, fontStyle: "italic", position: "relative", display: "inline-block", color: T.textPrimary }}>
                                28
                                <motion.div animate={{ rotate: [0, 15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: "absolute", top: "-10px", right: "-30px", opacity: 0.6 }}><Sparkles size={28} color={T.accent} /></motion.div>
                            </div>
                            <div style={{ marginTop: "3rem", textAlign: "left", maxWidth: "480px", marginInline: "auto", minHeight: "120px", position: "relative" }}>
                                <AnimatePresence mode="wait">
                                    <motion.div key={kamusIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                        <div className="font-handwriting" style={{ fontSize: "1.3rem", color: T.textAccent, marginBottom: "0.8rem", borderBottom: `1px dashed ${T.dividerColor}`, paddingBottom: "8px" }}>"{kamusMeanings[kamusIndex].title}"</div>
                                        <p className="font-serif" style={{ fontSize: "1rem", color: T.textSecondary, fontStyle: "italic", lineHeight: 1.6 }}>{kamusMeanings[kamusIndex].desc}</p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.section>

                    {/* FOOTER */}
                    <footer style={{ marginTop: "8rem", textAlign: "center" }}>
                        <HandwrittenText style={{ fontSize: "1.4rem", color: T.textAccent, maxWidth: "400px", opacity: 0.8 }}>...karena setiap detailmu layak untuk diceritakan.</HandwrittenText>
                    </footer>
                </Container>
            </main>

            {/* PORTRAIT POPUP */}
            <AnimatePresence>
                {selectedPortrait && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPortrait(null)} style={{ position: "fixed", inset: 0, background: T.overlayBg, backdropFilter: "blur(5px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} onClick={e => e.stopPropagation()} className="wc-card" style={{ padding: "1.5rem", maxWidth: "420px", border: "none", boxShadow: "0 30px 60px rgba(0,0,0,0.2)" }}>
                            <div style={{ width: "100%", height: "300px", position: "relative", marginBottom: "2rem", overflow: "hidden", borderRadius: "4px" }}>
                                <Image src={selectedPortrait.src} alt="" fill style={{ objectFit: "cover" }} />
                            </div>
                            <HandwrittenText style={{ fontSize: "1.3rem", color: T.textPrimary, lineHeight: 1.6 }}>"Izin simpan foto ini sebagai kenang-kenangan. <br /><br /> Sayang kalau momen sebagus ini terlewat begitu saja.<br /><br />Tetaplah bersinar, dengan caramu sendiri."</HandwrittenText>
                            <p style={{ marginTop: "2rem", fontSize: "0.8rem", color: T.textMuted, letterSpacing: "2px", opacity: 0.6 }}>(KETUK UNTUK TUTUP)</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => {
    const { tokens } = useTheme();
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            {Icon && <Icon size={16} color={tokens.textAccent} style={{ opacity: 0.7 }} />}
            <h3 className="font-serif-display" style={{ fontSize: "0.7rem", fontWeight: 700, color: tokens.textSecondary, textTransform: "uppercase", letterSpacing: "3.5px" }}>{children}</h3>
        </div>
    );
};

const SectionDivider = ({ label }: { label?: string }) => {
    const { tokens } = useTheme();
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", margin: "6rem 0 4rem" }}>
            <div style={{ flex: 1, height: "1px", background: tokens.dividerColor, opacity: 0.5 }} />
            {label && <HandwrittenText style={{ fontSize: "1rem", color: tokens.textAccent, opacity: 0.6 }}>{label}</HandwrittenText>}
            <div style={{ flex: 1, height: "1px", background: tokens.dividerColor, opacity: 0.5 }} />
        </div>
    );
};
