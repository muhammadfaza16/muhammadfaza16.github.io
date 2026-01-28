"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Sparkles, Clock, Calendar, Heart, Gift, Activity, Wind, Star, BookOpen, Map, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";

// --- Components ---

const WashiTape = ({ color, rotate = "0deg", width = "90px", height = "24px" }: { color: string, rotate?: string, width?: string, height?: string }) => (
    <div style={{
        position: "absolute",
        top: "-12px",
        left: "50%",
        transform: `translateX(-50%) rotate(${rotate})`,
        width: width,
        height: height,
        backgroundColor: color,
        opacity: 1,
        zIndex: 100, // Higher z-index
        boxShadow: "0 2px 4px rgba(0,0,0,0.18)",
        borderRadius: "2px",
    }}>
        <div style={{ width: "100%", height: "100%", opacity: 0.08, background: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }} />
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

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, rotate: 0 },
    show: (customRotate: number) => ({
        opacity: 1,
        y: 0,
        rotate: customRotate,
        transition: {
            type: "spring" as const,
            stiffness: 50,
            damping: 15
        }
    })
};

const BentoCard = ({ children, style = {}, rotate = "0deg", delay = 0, tapeColor, isMobile, className }: { children: React.ReactNode, style?: React.CSSProperties, rotate?: string, delay?: number, tapeColor?: string, isMobile?: boolean, className?: string }) => (
    <motion.div
        variants={itemVariants}
        custom={parseFloat(rotate)}
        className={className}
        style={{
            background: "#fff",
            borderRadius: "4px 8px 4px 10px / 12px 4px 15px 4px",
            border: "1px solid #e8e2d9",
            boxShadow: "2px 5px 15px rgba(160, 144, 125, 0.08)",
            padding: isMobile ? "1.8rem" : "2.5rem",
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
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.8rem" }}>
        {Icon && <Icon size={14} color="#a0907d" style={{ opacity: 0.8 }} />}
        <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a0907d", textTransform: "uppercase", letterSpacing: "2.5px" }}>{children}</h3>
    </div>
);

const DotGrid = ({ total, filled, columns = 20, color = "#b07d62", size = "6px" }: { total: number, filled: number, columns?: number, color?: string, size?: string }) => {
    // Memoize random values
    const dots = useMemo(() => {
        return Array.from({ length: total }).map(() => ({
            rotation: Math.random() * 6 - 3,
            scale: 0.8 + Math.random() * 0.4
        }));
    }, [total]);

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "5px",
            marginTop: "10px"
        }}>
            {dots.map((dot, i) => {
                const isToday = i === filled - 1;
                const isLast = i === total - 1;

                return (
                    <motion.div
                        key={i}
                        animate={isToday ? { scale: [1, 1.8, 1], opacity: [1, 0.8, 1] } : {}}
                        transition={isToday ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                        style={{
                            width: size,
                            height: size,
                            borderRadius: isLast ? "0" : "2px", // Star shape logic simplified or just circle
                            background: isToday ? "#d2691e" : (i < filled ? color : "#e4dfd7"),
                            opacity: 1,
                            transform: `rotate(${dot.rotation}deg) scale(${isLast ? 1.5 : 1})`,
                            boxShadow: isToday ? "0 0 4px #d2691e" : "none",
                            position: "relative",
                            clipPath: isLast ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" : "none" // Star shape for the last day
                        }}
                    />
                );
            })}
        </div>
    );
};

// --- Ambient Components ---

const NoiseOverlay = () => (
    <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 50,
        opacity: 0.07,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        mixBlendMode: "overlay"
    }} />
);
// Floating particles - Optimized
const FloatingParticles = () => {
    const particles = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 2,
        duration: Math.random() * 25 + 15,
        delay: Math.random() * 5
    })), []);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    animate={{
                        y: [0, -80, 0],
                        opacity: [0, 0.3, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: p.delay
                    }}
                    style={{
                        position: "absolute",
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        borderRadius: "50%",
                        background: "#d2691e",
                        willChange: "transform, opacity"
                    }}
                />
            ))}
        </div>
    );
};

const WaxSeal = ({ color = "#8b0000" }) => (
    <div style={{
        width: "60px",
        height: "60px",
        background: `radial-gradient(circle at 30% 30%, ${color}, #5a0000)`,
        borderRadius: "50%",
        boxShadow: "2px 4px 6px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: "20px",
        right: "20px",
        transform: "rotate(-15deg)"
    }}>
        <div style={{
            width: "45px",
            height: "45px",
            border: "2px dashed rgba(255,255,255,0.3)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Heart size={20} color="rgba(255,255,255,0.6)" fill="rgba(255,255,255,0.1)" />
        </div>
    </div>
);

// Falling Petals Component - Optimized
const FallingPetals = () => {
    const petals = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 5,
        size: 10 + Math.random() * 6,
    })), []);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
            {petals.map(petal => (
                <motion.div
                    key={petal.id}
                    initial={{ y: "-5%", opacity: 0 }}
                    animate={{
                        y: "105vh",
                        x: [0, 20, -15, 25, 0],
                        opacity: [0, 0.6, 0.6, 0.4, 0]
                    }}
                    transition={{
                        duration: petal.duration,
                        delay: petal.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        position: "absolute",
                        left: petal.left,
                        width: petal.size,
                        height: petal.size,
                        borderRadius: "50% 0 50% 50%",
                        background: "linear-gradient(135deg, #ffb7c5 0%, #ffc0cb 100%)",
                        willChange: "transform, opacity"
                    }}
                />
            ))}
        </div>
    );
};

// Butterflies Component - Optimized
const Butterflies = () => {
    const butterflies = useMemo(() => [
        { id: 1, startX: "15%", startY: "35%", color: "#e6a8d7" },
        { id: 2, startX: "75%", startY: "55%", color: "#a8d7e6" },
    ], []);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 3, pointerEvents: "none" }}>
            {butterflies.map(butterfly => (
                <motion.div
                    key={butterfly.id}
                    animate={{
                        x: [0, 60, -30, 80, 0],
                        y: [0, -50, 20, -60, 0],
                    }}
                    transition={{
                        duration: 25 + butterfly.id * 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: "absolute",
                        left: butterfly.startX,
                        top: butterfly.startY,
                        fontSize: "1.3rem",
                        willChange: "transform"
                    }}
                >
                    🦋
                </motion.div>
            ))}
        </div>
    );
};

// --- Page ---

export default function SpecialDayBentoPage() {
    const [mounted, setMounted] = useState(false);
    const [now, setNow] = useState(new Date());
    const [isMobile, setIsMobile] = useState(false);
    const [wisdom, setWisdom] = useState("");
    const [kamusIndex, setKamusIndex] = useState(0);

    // New interactive states
    const [heartbeats, setHeartbeats] = useState(0);
    const [showShakeOverlay, setShowShakeOverlay] = useState(false);
    const [kamusHearts, setKamusHearts] = useState<{ id: number; x: number; y: number }[]>([]);
    const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
    const [showTodayMessage, setShowTodayMessage] = useState(false);
    const wisdomIndexRef = useRef(0);

    // Birth Date: 28 November 2000
    const birthDate = new Date(2000, 10, 28);
    const lifeExpectancyYears = 80;
    const totalLifeMonths = lifeExpectancyYears * 12;

    const kamusMeanings = [
        {
            title: "Ketenangan & Intuisi",
            desc: "Dalam numerologi, 28 adalah simbol kepemimpinan yang lembut. Ia membawa harmoni, intuisi tajam, dan keinginan untuk membangun sesuatu yang abadi."
        },
        {
            title: "Siklus Bulan",
            desc: "Butuh sekitar 28 hari bagi bulan untuk menyempurnakan ceritanya dari gelap gulita hingga purnama benderang. Seperti itulah cahayamu tumbuh."
        },
        {
            title: "Sebuah Awal",
            desc: "Bagi semesta, 28 hanyalah angka. Tapi bagi kami yang mengenalmu, ia adalah tanggal di mana dunia menjadi sedikit lebih indah."
        }
    ];

    const [footerIndex, setFooterIndex] = useState(0);

    const footerQuotes = [
        "Ruang ini dibuat untuk merayakan setiap langkah kecilmu.",
        "Percayalah, usahamu selama ini tidak pernah sia-sia.",
        "Teruslah tumbuh, mekar, dan bahagia.",
        "Jangan pernah takut untuk bersinar dengan warnamu sendiri.",
        "Raihlah segala yang kamu impikan. Meski tak terlihat, doaku akan selalu menyertaimu."
    ];

    useEffect(() => {
        setMounted(true);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);

        const timer = setInterval(() => setNow(new Date()), 1000);
        const kamusTimer = setInterval(() => setKamusIndex(prev => (prev + 1) % kamusMeanings.length), 20000);

        const dailyWisdoms = [
            "Kamu adalah alasan di balik senyuman yang merekah hari ini, meski terkadang kamu tak menyadarinya. Keberadaanmu bukan sekadar angka di kalender, melainkan anugerah terindah bagi semesta yang seringkali lupa cara bersyukur.",
            "Setiap langkah yang kamu tapaki adalah guratan berharga dalam kanvas waktu yang abadi. Jangan pernah ragu pada dirimu sendiri, karena setiap hela nafasmu adalah bukti nyata bahwa dunia masih membutuhkan cahayamu.",
            "Hari ini adalah selembar kertas kosong yang menanti sentuhan cintamu yang paling jujur. Lukislah setiap detiknya dengan kebaikan dan keberanian, sebab kamu jauh lebih kuat dari rintangan mana pun.",
            "Tetaplah bersinar dengan caramu yang paling tenang. Dunia ini mungkin riuh dengan suara-suara yang asing, tapi ingatlah selalu bahwa di antara milyaran melodi, kamulah simfoni paling damai.",
            "Kebahagiaanmu bukanlah sebuah tujuan jauh di ufuk sana, melainkan prioritas utama yang harus kamu jaga di sini, saat ini. Cintailah dirimu sendiri seakan-akan kamu adalah permata paling langka.",
            "Terimalah dirimu apa adanya, dekaplah setiap detik yang kamu miliki dengan rasa syukur yang mendalam. Sebab di antara riuh rendah bisingnya dunia, kamulah melodi paling tenang yang pernah semesta ciptakan.",
            "Jangan pernah biarkan cahayamu redup hanya karena dunia belum siap menerima benderangnya. Kamu adalah kepingan teka-teki paling indah yang membuat gambaran tentang hidup ini menjadi sempurna."
        ];

        // Initial wisdom (Locked to the day of the month)
        const dayOfMonth = new Date().getDate();
        setWisdom(dailyWisdoms[dayOfMonth % dailyWisdoms.length]);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(timer);
            clearInterval(kamusTimer);
        };
    }, []);

    useEffect(() => {
        const isLastItem = footerIndex === footerQuotes.length - 1;
        const delay = isLastItem ? 15000 : 7000;

        const timer = setTimeout(() => {
            setFooterIndex((prev) => (prev + 1) % footerQuotes.length);
        }, delay);

        return () => clearTimeout(timer);
    }, [footerIndex]);

    // Heartbeat counter - ~70 BPM average (update every 5s for performance)
    useEffect(() => {
        const msPerHeartbeat = 60000 / 70; // ~857ms per beat
        const updateHeartbeats = () => {
            const msLived = Date.now() - birthDate.getTime();
            const beats = Math.floor(msLived / msPerHeartbeat);
            setHeartbeats(beats);
        };

        // Initial calculation
        updateHeartbeats();

        // Update every 5 seconds instead of every beat for performance
        const interval = setInterval(updateHeartbeats, 5000);

        return () => clearInterval(interval);
    }, []);

    // Shake detection for new wisdom
    useEffect(() => {
        let lastX = 0, lastY = 0, lastZ = 0;
        let lastShakeTime = 0;
        const SHAKE_THRESHOLD = 25;

        const dailyWisdoms = [
            "Kamu adalah alasan di balik senyuman yang merekah hari ini, meski terkadang kamu tak menyadarinya.",
            "Setiap langkah yang kamu tapaki adalah guratan berharga dalam kanvas waktu yang abadi.",
            "Hari ini adalah selembar kertas kosong yang menanti sentuhan terbaikmu.",
            "Tetaplah bersinar dengan caramu yang paling tenang.",
            "Kebahagiaanmu adalah prioritas utama yang harus kamu jaga di sini, saat ini.",
            "Terimalah dirimu apa adanya, dekaplah setiap detik yang kamu miliki dengan rasa syukur.",
            "Jangan pernah biarkan cahayamu redup hanya karena dunia belum siap menerima benderangnya."
        ];

        const handleMotion = (e: DeviceMotionEvent) => {
            const acc = e.accelerationIncludingGravity;
            if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

            const deltaX = Math.abs(acc.x - lastX);
            const deltaY = Math.abs(acc.y - lastY);
            const deltaZ = Math.abs(acc.z - lastZ);

            const now = Date.now();
            if ((deltaX > SHAKE_THRESHOLD || deltaY > SHAKE_THRESHOLD || deltaZ > SHAKE_THRESHOLD)
                && (now - lastShakeTime > 1500)) {
                lastShakeTime = now;
                if (navigator.vibrate) navigator.vibrate([50, 50, 100]);

                // Get next wisdom
                wisdomIndexRef.current = (wisdomIndexRef.current + 1) % dailyWisdoms.length;
                setWisdom(dailyWisdoms[wisdomIndexRef.current]);
                setShowShakeOverlay(true);
                setTimeout(() => setShowShakeOverlay(false), 3000);
            }

            lastX = acc.x;
            lastY = acc.y;
            lastZ = acc.z;
        };

        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
    }, []);

    // Long-press handler for Kamus 28
    let longPressTimer: NodeJS.Timeout | null = null;
    const handleKamusLongPressStart = (e: React.TouchEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        longPressTimer = setTimeout(() => {
            if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
            const newHearts = Array.from({ length: 8 }).map((_, i) => ({
                id: Date.now() + i,
                x: centerX + (Math.random() - 0.5) * 100,
                y: centerY + (Math.random() - 0.5) * 100
            }));
            setKamusHearts(newHearts);
            setTimeout(() => setKamusHearts([]), 1500);
        }, 800);
    };
    const handleKamusLongPressEnd = () => {
        if (longPressTimer) clearTimeout(longPressTimer);
    };

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

            {/* Ambient Background Elements */}
            <NoiseOverlay />
            <FloatingParticles />
            <FallingPetals />
            <Butterflies />

            {/* Shake Overlay for New Wisdom */}
            <AnimatePresence>
                {showShakeOverlay && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "rgba(255,255,255,0.95)",
                            padding: "2rem",
                            borderRadius: "20px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                            zIndex: 9999,
                            maxWidth: "90%",
                            textAlign: "center",
                            border: "1px dashed #d2b48c"
                        }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                            style={{ fontSize: "2rem", marginBottom: "1rem" }}
                        >
                            ✨
                        </motion.div>
                        <p style={{
                            fontFamily: "'Caveat', cursive",
                            fontSize: "1.3rem",
                            color: "#4e4439",
                            lineHeight: 1.5
                        }}>
                            "{wisdom}"
                        </p>
                        <p style={{
                            fontSize: "0.8rem",
                            color: "#a0907d",
                            marginTop: "1rem",
                            opacity: 0.7
                        }}>
                            ✧ kata baru untukmu ✧
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3], rotate: [0, 5, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "fixed", top: "15%", right: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(216, 226, 220, 0.3) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }}
            />

            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.5, 0.4], rotate: [0, -5, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                style={{ position: "fixed", bottom: "5%", left: "-5%", width: "550px", height: "550px", background: "radial-gradient(circle, rgba(255, 229, 217, 0.4) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }}
            />

            {/* Individual Watercolor Sketches - Hide on mobile */}
            {!isMobile && (
                <>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.4, y: [0, -15, 0], rotate: [-10, -5, -10] }}
                        transition={{ opacity: { duration: 1 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
                        style={{ position: "fixed", top: "2%", left: "8%", width: "200px", height: "200px", zIndex: 1, pointerEvents: "none" }}
                    >
                        <Image src="/special_peony.png" alt="" fill style={{ objectFit: 'contain' }} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.35, y: [0, -8, 0], rotate: [-5, 0, -5] }}
                        transition={{ opacity: { duration: 1, delay: 0.4 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
                        style={{ position: "fixed", bottom: "15%", left: "5%", width: "180px", height: "180px", zIndex: 1, pointerEvents: "none" }}
                    >
                        <Image src="/special_wildflowers.png" alt="" fill style={{ objectFit: 'contain' }} />
                    </motion.div>
                </>
            )}

            <div style={{ position: "fixed", inset: 0, opacity: 0.4, pointerEvents: "none", backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", zIndex: 5 }} />

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "4rem 0" : "6rem 0" }}>
                <Container>
                    {/* Header: Dedicated to 28 */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isMobile ? "4rem" : "20vh" }}>
                        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                            <Link href="/guest/no28" style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: "44px", height: "44px", background: "#fff", border: "1.2px solid #a0907d",
                                borderRadius: "12px", color: "#a0907d", boxShadow: "0 2px 10px rgba(160,144,125,0.12)"
                            }}>
                                <Home size={22} />
                            </Link>
                            <div style={{ transform: "rotate(-1deg)" }}>
                                <div style={{ fontSize: "0.65rem", color: "#a0907d", textTransform: "uppercase", letterSpacing: "2.5px", fontWeight: 700, marginBottom: "-2px" }}>Bingkisan Kecil Untukmu</div>
                                <HandwrittenNote style={{ fontSize: "1.2rem", fontWeight: 400, color: "#b07d62" }}>
                                    ...sebagai bukti bahwa kamu selalu terlihat.
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
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr" : "repeat(12, 1fr)",
                            gap: isMobile ? "2rem" : "3.5rem",
                        }}
                    >

                        <BentoCard isMobile={isMobile} style={{ gridColumn: isMobile ? "span 1" : "span 12", minHeight: isMobile ? "auto" : "320px" }} rotate="0.2deg" tapeColor="#87b0a5">
                            <SectionTitle icon={BookOpen}>Musim-Musim Kehidupanmu</SectionTitle>
                            <div style={{
                                position: "absolute",
                                bottom: isMobile ? "-30px" : "-50px",
                                right: isMobile ? "-30px" : "-20px",
                                width: isMobile ? "220px" : "400px",
                                height: isMobile ? "220px" : "400px",
                                opacity: 0.35,
                                transform: isMobile ? "rotate(8deg)" : "rotate(-3deg)",
                                pointerEvents: "none",
                                zIndex: 0
                            }}>
                                <Image src="/special_hijabi_main.png" alt="" fill style={{ objectFit: "contain" }} />
                            </div>
                            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "2rem" : "4rem", marginTop: "1rem", position: "relative" }}>
                                {/* Golden Thread (Dashed Line) */}
                                {!isMobile && (
                                    <div style={{ position: "absolute", top: "24px", left: "1.5rem", right: "2rem", height: "2px", borderTop: "2px dashed #e8e2d9", zIndex: 0 }} />
                                )}
                                {[
                                    { year: "2000 - 2007", title: "Pijar Cahaya Pertama", desc: "Saat dunia pertama kali menyapamu dengan hangat.", icon: Sparkles },
                                    { year: "2007 - 2018", title: "Nyala yang Mulai Membara", desc: "Masa merangkai mimpi dan melukis warna-warni kisah.", icon: Star },
                                    { year: "2018 - Kini", title: "Hangat yang Menenangkan", desc: "Menjadi melodi paling tenang di tengah riuh dunia.", icon: Heart }
                                ].map((chapter, i) => (
                                    <div key={i} style={{ flex: 1, position: "relative", paddingLeft: isMobile ? "1.5rem" : "0", borderLeft: isMobile ? "1px dashed #e5e0d8" : "none", zIndex: 1 }}>
                                        {!isMobile && i > 0 && <div style={{ position: "absolute", left: "-1rem", top: "1.5rem", width: "1rem", borderTop: "1px dashed #e5e0d8" }} />} {/* Remove old mobile connectors if simplifying */}
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                            <div style={{
                                                width: "36px", height: "36px", borderRadius: "50%", background: "#fff",
                                                border: "1px solid #e8e2d9", display: "flex", alignItems: "center", justifyContent: "center",
                                                boxShadow: "0 0 15px rgba(176, 125, 98, 0.15)" // Halo effect
                                            }}>
                                                <chapter.icon size={16} color="#b07d62" />
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
                        <BentoCard isMobile={isMobile} style={{ gridColumn: isMobile ? "span 1" : "span 7" }} rotate="-0.4deg" tapeColor="#f6a4a9">
                            <SectionTitle icon={Map}>Lembaran Kisah Ke-{age + 1}</SectionTitle>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
                                <div>
                                    <div style={{ fontSize: "0.8rem", color: "#a0907d", letterSpacing: "1px", fontWeight: 700, textTransform: "uppercase" }}>Halaman Yang Telah Kamu Isi</div>
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
                                <DotGrid
                                    total={totalDaysInPersonalYear}
                                    filled={currentDayInPersonalYear}
                                    columns={isMobile ? 18 : 27}
                                    size={isMobile ? "4px" : "6px"}
                                    color="#b07d62"
                                />
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.7rem", fontWeight: 700, color: "#aaa" }}>
                                    <span>28 NOV {startOfPersonalYear.getFullYear()}</span>
                                    <span>28 NOV {endOfPersonalYear.getFullYear()}</span>
                                </div>
                                <HandwrittenNote style={{ position: "absolute", top: "0", right: "20%", transform: "rotate(5deg)", fontSize: "0.9rem" }}>
                                    "Terus bersinar ya..."
                                </HandwrittenNote>
                            </div>
                        </BentoCard>

                        {/* 3. Kamus Angka 28 (Dedicated Widget) */}
                        <BentoCard isMobile={isMobile} style={{ gridColumn: isMobile ? "span 1" : "span 5", background: "linear-gradient(to bottom, #fff, #fdfbf7)" }} rotate="0.6deg" tapeColor="#b598d9">
                            <SectionTitle icon={Sparkles}>Kamus Angka 28</SectionTitle>
                            <div
                                onTouchStart={handleKamusLongPressStart}
                                onTouchEnd={handleKamusLongPressEnd}
                                style={{ textAlign: "center", padding: "1.5rem 0", position: "relative", cursor: "pointer" }}
                            >
                                {/* Long-press hearts explosion */}
                                {kamusHearts.map(heart => (
                                    <motion.div
                                        key={heart.id}
                                        initial={{ scale: 0, opacity: 1 }}
                                        animate={{ scale: 2, opacity: 0, y: -50 }}
                                        transition={{ duration: 1 }}
                                        style={{
                                            position: "absolute",
                                            left: heart.x,
                                            top: heart.y,
                                            fontSize: "1.5rem",
                                            pointerEvents: "none",
                                            zIndex: 100
                                        }}
                                    >
                                        ✨
                                    </motion.div>
                                ))}
                                <div style={{
                                    fontSize: "6rem",
                                    fontWeight: 900,
                                    lineHeight: 0.8,
                                    fontFamily: "'Crimson Pro', serif",
                                    position: "relative",
                                    display: "inline-block",
                                    backgroundImage: "linear-gradient(45deg, #b07d62, #d2691e, #8b4513)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    color: "transparent",
                                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
                                }}>
                                    28
                                    <motion.div animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: "absolute", top: "-10px", right: "-20px" }}>
                                        <Sparkles size={24} color="#d2691e" opacity={0.6} />
                                    </motion.div>
                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} style={{ position: "absolute", bottom: "5px", left: "-15px" }}>
                                        <Star size={16} color="#e6a23c" fill="#e6a23c" opacity={0.6} />
                                    </motion.div>
                                </div>
                                <div style={{ marginTop: "2rem", textAlign: "left", height: "140px", position: "relative" }}>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={kamusIndex}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.5 }}
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
                                        >
                                            <div style={{ marginBottom: "0.5rem", borderBottom: "1px dashed #e8e2d9", paddingBottom: "5px" }}>
                                                <HandwrittenNote style={{ color: "#4e4439", fontSize: "1.1rem" }}>"{kamusMeanings[kamusIndex].title}"</HandwrittenNote>
                                            </div>
                                            <div style={{ fontSize: "0.85rem", color: "#a0907d", fontStyle: "italic", lineHeight: 1.6 }}>
                                                {kamusMeanings[kamusIndex].desc}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </BentoCard>

                        {/* 4. Bisikan Sanubari (Consolidated Wisdom) */}
                        <BentoCard isMobile={isMobile} style={{ gridColumn: isMobile ? "span 1" : "span 12", padding: isMobile ? "3rem 1.8rem" : "6rem 4rem", background: "#fefbfc" }} rotate="0deg" tapeColor="#f08bb1">
                            <div style={{ position: "absolute", bottom: "-10px", right: "-10px", width: "140px", height: "140px", opacity: 0.85, transform: "rotate(-15deg)", pointerEvents: "none", zIndex: 0, mixBlendMode: "multiply" }}>
                                <Image src="/special_peony.png" alt="" fill style={{ objectFit: "contain" }} />
                            </div>
                            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
                                <Wind size={24} color="#b07d62" style={{ margin: "0 auto 1.5rem", opacity: 0.3 }} />
                                <p
                                    style={{ fontSize: isMobile ? "1.25rem" : "1.7rem", color: "#4e4439", fontStyle: "italic", lineHeight: 1.7, fontWeight: 300 }}
                                >
                                    "{wisdom}"
                                </p>
                                <div style={{ marginTop: "3rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                    <div style={{ width: "20px", height: "1px", background: "#b07d62", opacity: 0.2 }} />
                                    <HandwrittenNote style={{ fontSize: "1.4rem" }}>Bait Untukmu</HandwrittenNote>
                                    <div style={{ width: "20px", height: "1px", background: "#b07d62", opacity: 0.2 }} />
                                </div>
                            </div>
                        </BentoCard>

                        {/* 5. Heartbeat Counter Widget */}
                        <BentoCard isMobile={isMobile} style={{ gridColumn: isMobile ? "span 1" : "span 12", textAlign: "center" }} rotate="0.3deg" tapeColor="#87b0a5">
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.857, repeat: Infinity }}
                                    style={{ fontSize: "2rem" }}
                                >
                                    💓
                                </motion.div>
                                <div>
                                    <div style={{ fontSize: "0.7rem", color: "#a0907d", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.3rem" }}>
                                        Detak jantungmu sejak lahir
                                    </div>
                                    <div style={{
                                        fontSize: isMobile ? "1.8rem" : "2.5rem",
                                        fontWeight: 900,
                                        color: "#b07d62",
                                        fontFamily: "'Crimson Pro', serif"
                                    }}>
                                        {heartbeats.toLocaleString('id-ID')}
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.857, repeat: Infinity, delay: 0.4 }}
                                    style={{ fontSize: "2rem" }}
                                >
                                    💓
                                </motion.div>
                            </div>
                            <HandwrittenNote style={{ marginTop: "1rem", fontSize: "1rem", opacity: 0.7 }}>
                                "...dan setiap detaknya adalah bukti bahwa kamu berharga."
                            </HandwrittenNote>
                        </BentoCard>

                    </motion.div>

                    {/* Footer Narrative */}
                    <div style={{ marginTop: "6rem", textAlign: "center", position: "relative", paddingBottom: "4rem" }}>
                        <div style={{ width: "40px", height: "1px", background: "#b07d62", margin: "0 auto 2rem", opacity: 0.3 }} />
                        <div style={{ height: "40px", position: "relative", maxWidth: "700px", margin: "0 auto" }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={footerIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 1 }}
                                    style={{ position: "absolute", width: "100%", top: 0, left: 0 }}
                                >
                                    <HandwrittenNote style={{ fontSize: "1.3rem", color: "#b07d62", textShadow: "0 1px 1px rgba(0,0,0,0.05)" }}>{footerQuotes[footerIndex]}</HandwrittenNote>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>


                </Container>
            </main>
        </div>
    );
}
