"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Sparkles, Clock, Calendar, Heart, Gift, Activity, Wind, Star, BookOpen, Map, MapPin, Quote, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { MOOD_CONFIG, JournalEntry } from "@/types/journal";

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

const BentoCard = React.memo(({ children, style = {}, rotate = "0deg", delay = 0, tapeColor, isMobile, className }: { children: React.ReactNode, style?: React.CSSProperties, rotate?: string, delay?: number, tapeColor?: string, isMobile?: boolean, className?: string }) => (
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
));
BentoCard.displayName = "BentoCard";

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.8rem" }}>
        {Icon && <Icon size={14} color="#a0907d" style={{ opacity: 0.8 }} />}
        <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a0907d", textTransform: "uppercase", letterSpacing: "2.5px" }}>{children}</h3>
    </div>
);

const DotGrid = React.memo(({ total, filled, columns = 20, color = "#b07d62", size = "6px", customColors = {} }: { total: number, filled: number, columns?: number, color?: string, size?: string, customColors?: Record<number, string> }) => {
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
                const customColor = customColors[i];

                // Determine base color logic
                let dotColor = customColor || (i < filled ? color : "#e4dfd7");
                if (!customColor && isToday) dotColor = "#d2691e";


                return (
                    <motion.div
                        key={i}
                        animate={isToday ? { scale: [1, 1.8, 1], opacity: [1, 0.8, 1] } : {}}
                        transition={isToday ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                        style={{
                            width: size,
                            height: size,
                            borderRadius: isLast ? "0" : "2px", // Star shape logic simplified or just circle
                            background: dotColor,
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
});
DotGrid.displayName = "DotGrid";

// --- Ambient Components ---

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

// Typewriter Effect Component - Robust
const TypewriterText = ({ text, style }: { text: string, style?: React.CSSProperties }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        setDisplayedText("");
        setIsTyping(true);

        const characters = Array.from(text);
        let i = 0;
        const speed = 50;

        const timer = setInterval(() => {
            if (i < characters.length) {
                setDisplayedText((prev) => prev + characters[i]);
                i++;
            } else {
                setIsTyping(false);
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text]);

    return (
        <span style={style}>
            {displayedText}
            {isTyping && <span style={{ opacity: 0.5, marginLeft: "2px" }}>|</span>}
        </span>
    );
};

// Floating particles - Optimized with CSS Keyframes
const FloatingParticles = () => {
    // Inject styles once
    const styleId = "floating-particles-style";
    if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
            @keyframes floatUp {
                0% { transform: translateY(0); opacity: 0; }
                50% { opacity: 0.4; }
                100% { transform: translateY(-80px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    const particles = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 2,
        duration: Math.random() * 15 + 10 + 's',
        delay: Math.random() * 5 + 's'
    })), []);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            {particles.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: "absolute",
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        borderRadius: "50%",
                        background: "#d2691e",
                        opacity: 0,
                        animation: `floatUp ${p.duration} linear infinite`,
                        animationDelay: p.delay
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

// --- Standalone Widgets (Optimized) ---

const HeartbeatWidget = ({ isMobile }: { isMobile?: boolean }) => {
    const [beats, setBeats] = useState<number>(0);
    const birthDate = useMemo(() => new Date(2000, 10, 28), []);

    useEffect(() => {
        // Update immediately
        const updateBeats = () => {
            const now = new Date();
            const val = Math.floor((now.getTime() - birthDate.getTime()) / 1000 * 1.2);
            setBeats(val);
        };
        updateBeats();

        const timer = setInterval(updateBeats, 1000);
        return () => clearInterval(timer);
    }, [birthDate]);

    // Initial render hydration mismatch prevention
    if (beats === 0) return null;

    return (
        <React.Fragment>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.857, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Heart size={28} color="#b07d62" fill="#b07d62" style={{ opacity: 0.8 }} />
                </motion.div>
                <div>
                    <div style={{ fontSize: "0.7rem", color: "#a0907d", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.3rem" }}>
                        Detak jantungmu sejak lahir
                    </div>
                    <div style={{
                        fontSize: isMobile ? "1.8rem" : "2.5rem",
                        fontWeight: 900,
                        color: "#b07d62",
                        fontFamily: "'Crimson Pro', serif",
                        fontVariantNumeric: "tabular-nums" // Prevents jitter
                    }}>
                        {beats.toLocaleString('id-ID')}
                    </div>
                </div>
                <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.857, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                >
                    <Heart size={28} color="#b07d62" fill="#b07d62" style={{ opacity: 0.8 }} />
                </motion.div>
            </div>
            <HandwrittenNote style={{ marginTop: "1rem", fontSize: "1rem", opacity: 0.7 }}>
                "...dan setiap detaknya adalah bukti bahwa kamu berharga."
            </HandwrittenNote>
        </React.Fragment>
    );
};

// --- Page ---

const TimeCapsule = ({ onClick }: { onClick: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            width: "60px",
            height: "60px",
            zIndex: 50,
            cursor: "pointer",
            filter: "drop-shadow(0 4px 6px rgba(160, 144, 125, 0.3))"
        }}
    >
        <Image
            src="/time_capsule_icon_clean.webp"
            alt="Time Capsule"
            fill
            style={{
                objectFit: "contain"
            }}
        />
    </motion.div>
);

const CardSlider = ({ slides, isMobile }: { slides: React.ReactNode[], isMobile: boolean }) => {
    const [index, setIndex] = useState(0);

    return (
        <div style={{ gridColumn: isMobile ? "span 1" : "span 12", position: "relative", marginTop: "2rem" }}>
            <div style={{ position: "relative", overflow: "hidden", padding: "10px" }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {slides[index]}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", marginTop: "-1rem", paddingBottom: "2rem" }}>
                <button
                    onClick={() => setIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "10px", color: "#b07d62" }}
                >
                    <ArrowLeft size={24} />
                </button>

                <div style={{ display: "flex", gap: "8px" }}>
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setIndex(i)}
                            style={{
                                width: "8px", height: "8px", borderRadius: "50%",
                                background: i === index ? "#b07d62" : "#e8e2d9",
                                cursor: "pointer", transition: "all 0.3s"
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "10px", color: "#b07d62" }}
                >
                    <ArrowLeft size={24} style={{ transform: "rotate(180deg)" }} />
                </button>
            </div>
        </div>
    )
}

export default function SpecialDayBentoPage() {
    const [mounted, setMounted] = useState(false);
    const [stableNow, setStableNow] = useState<Date | null>(null); // For static widgets (Calendar, Age) - Updates infrequently
    const [isMobile, setIsMobile] = useState(false);
    const [wisdom, setWisdom] = useState("");
    const [kamusIndex, setKamusIndex] = useState(0);

    // New interactive states
    const [showShakeOverlay, setShowShakeOverlay] = useState(false);
    const [kamusHearts, setKamusHearts] = useState<{ id: number; x: number; y: number }[]>([]);
    const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
    const [showTodayMessage, setShowTodayMessage] = useState(false);
    const [showTimeCapsuleMessage, setShowTimeCapsuleMessage] = useState(false);
    const [journalColors, setJournalColors] = useState<Record<number, string>>({}); // moved here
    const wisdomIndexRef = useRef(0);
    const [dots, setDots] = useState("");


    // Typewriter effect for dots
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev === "...") return "";
                return prev + ".";
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Portrait Gallery State
    const [portraitIndex, setPortraitIndex] = useState(0);
    const [selectedPortrait, setSelectedPortrait] = useState<{ src: string, label: string } | null>(null);
    const portraits = [
        { src: "/portrait_4.webp", label: "Ada banyak hal baik yang tumbuh dari senyummu" },
        { src: "/portrait_1.webp", label: "Binar itu, semoga tak pernah redup oleh ragu" },
        { src: "/portrait_3.webp", label: "Sederhana, namun cukup untuk meneduhkan sekitar" },
        { src: "/portrait_2.webp", label: "Terima kasih telah menjadi bagian baik dari semesta" },
        { src: "/portrait_5.webp", label: "Hadirmu, pengingat bahwa hal indah itu nyata" }
    ];

    // Birth Date: 28 November 2000
    const birthDate = new Date(2000, 10, 28);
    const lifeExpectancyYears = 80;
    const totalLifeMonths = lifeExpectancyYears * 12;

    // --- Calculations (Moved to Top) ---
    const currentNow = stableNow || new Date(); // Use STABLE now for heavy calculations

    const totalMsLived = currentNow.getTime() - birthDate.getTime();
    const monthsLived = (currentNow.getFullYear() - birthDate.getFullYear()) * 12 + (currentNow.getMonth() - birthDate.getMonth());

    // Exact Age
    let age = currentNow.getFullYear() - birthDate.getFullYear();
    const m = currentNow.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && currentNow.getDate() < birthDate.getDate())) {
        age--;
    }

    // --- Personal Year Loop ---
    // Make sure we are strictly using local dates (hours zeroed) for day-diff calculations
    // Logic: If today is Nov 28, it IS the starts.
    // Start of Personal Year: Last Nov 28
    let startOfPersonalYear = new Date(currentNow.getFullYear(), 10, 28);
    // If today is BEFORE Nov 28, then the personal year started LAST year.
    // If today IS Nov 28, it starts TODAY (Day 1).
    if (currentNow.getTime() < startOfPersonalYear.getTime()) {
        startOfPersonalYear = new Date(currentNow.getFullYear() - 1, 10, 28);
    }
    // ensure midnight alignment
    startOfPersonalYear.setHours(0, 0, 0, 0);

    let endOfPersonalYear = new Date(startOfPersonalYear.getFullYear() + 1, 10, 28);
    endOfPersonalYear.setHours(0, 0, 0, 0);

    const totalDaysInPersonalYear = Math.round((endOfPersonalYear.getTime() - startOfPersonalYear.getTime()) / (1000 * 60 * 60 * 24));

    // Correct logic: If today is start date, it's Day 1.
    const currentNowMidnight = new Date(currentNow);
    currentNowMidnight.setHours(0, 0, 0, 0);

    const currentDayInPersonalYear = Math.floor((currentNowMidnight.getTime() - startOfPersonalYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysLeftInPersonalYear = Math.max(0, totalDaysInPersonalYear - currentDayInPersonalYear + 1); // +1 because we are IN the current day

    // --- Time Capsule Target ---
    // Target: Next Birthday (Nov 28)
    // We want the countdown to hit 0 at midnight of the 28th.
    // If today is Nov 27, diff is 1 day. 
    const nextBirthday = new Date(currentNow.getFullYear(), 10, 28);
    if (currentNow.getTime() > nextBirthday.getTime() + 86400000) { // Allow 24h grace period or until next year
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }

    // SPECIAL DATE for Time Capsule (Nov 28, 2026 as originally requested, or dynamic next birthday?)
    // Original code used 2026-11-28. We should stick to next birthday for generic logic or specific 2026 if hardcoded.
    // User asked "logic dynamic", so let's make it the UPCOMING Nov 28.
    const daysUntil = useMemo(() => {
        if (!stableNow) return 0;

        const now = new Date(stableNow);
        const currentYear = now.getFullYear();

        // Target: Nov 28 of current year
        let target = new Date(currentYear, 10, 28);

        // Normalize to midnight for fair comparison to avoid sub-day diffs
        const nowMid = new Date(now);
        nowMid.setHours(0, 0, 0, 0);

        // If today is AFTER Nov 28, target is next year
        if (nowMid.getTime() > target.getTime()) {
            target.setFullYear(currentYear + 1);
        }

        const diff = target.getTime() - nowMid.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }, [stableNow]);


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
        "Ruang ini tercipta untuk merayakan setiap jejak langkah kecilmu.",
        "Percayalah, setiap peluh yang luruh sedang membasuh benih-benih impianmu.",
        "Kamu hebat, karena mampu bertahan sejauh ini dengan kaki dan hatimu sendiri.",
        "Teruslah menjadi pribadi yang hangat, karena bagian paling mempesona dari manusia adalah kebaikannya.",
        "Dan kamu, adalah wujud nyata dari kebaikan itu."
    ];

    useEffect(() => {
        setMounted(true);
        const nowInit = new Date();
        setStableNow(nowInit);

        // Fetch Journal Data for Colors
        const savedJournal = localStorage.getItem("journal_entries_25");
        if (savedJournal) {
            try {
                const entries = JSON.parse(savedJournal) as Record<string, JournalEntry>;
                const colorMap: Record<number, string> = {};

                Object.values(entries).forEach(entry => {
                    const entryDate = new Date(entry.date);
                    entryDate.setHours(0, 0, 0, 0);

                    // Only map if within current personal year
                    if (entryDate >= startOfPersonalYear && entryDate < endOfPersonalYear) {
                        const dayIndex = Math.floor((entryDate.getTime() - startOfPersonalYear.getTime()) / (1000 * 60 * 60 * 24));
                        // Map 0-indexed day to color
                        if (dayIndex >= 0) {
                            colorMap[dayIndex] = MOOD_CONFIG[entry.category]?.color || "#b07d62";
                        }
                    }
                });
                setJournalColors(colorMap);
            } catch (e) {
                console.error("Failed to parse journal colors", e);
            }
        }

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);

        // Stable timer (check date change every minute)
        const stableTimer = setInterval(() => {
            const n = new Date();
            if (n.getDate() !== nowInit.getDate()) setStableNow(n);
        }, 60000);

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
            clearInterval(stableTimer);
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

    // Portrait gallery cycling
    useEffect(() => {
        const timer = setInterval(() => {
            setPortraitIndex((prev) => (prev + 1) % portraits.length);
        }, 12000); // Change every 12 seconds
        return () => clearInterval(timer);
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

    if (!mounted) return null;
    if (!stableNow) return null; // Prevent hydration mismatch by not rendering until client-side active

    if (!mounted || !stableNow) return null; // Prevent hydration mismatch by not rendering until client-side active

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
            <TimeCapsule onClick={() => setShowTimeCapsuleMessage(true)} />

            <AnimatePresence>
                {showTimeCapsuleMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowTimeCapsuleMessage(false)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 9999, // High z-index
                            background: "rgba(0,0,0,0.4)",
                            backdropFilter: "blur(2px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "1rem"
                        }}
                    >
                        <div style={{ position: "relative", width: "100%", maxWidth: "340px", height: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>

                            {/* The Message Paper */}
                            <motion.div
                                initial={{ y: 100, opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{ y: -80, opacity: 1, scale: 1, rotate: 2 }}
                                exit={{ y: 0, opacity: 0, scale: 0.8 }}
                                transition={{ delay: 0.8, duration: 1, type: "spring", bounce: 0.3 }}
                                style={{
                                    width: "280px",
                                    background: "#fdf8f0",
                                    backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
                                    padding: "2rem",
                                    border: "1px solid #d2b48c",
                                    borderRadius: "2px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                                    position: "relative",
                                    zIndex: 1, // Paper appears "out of" the envelope
                                    textAlign: "center"
                                }}
                            >
                                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🕰️</div>
                                <HandwrittenNote style={{ fontSize: "1.2rem", color: "#4e4439", lineHeight: 1.6 }}>
                                    "Maaf, pesan ini masih terlelap. <br />Ia akan terbangun untuk menyapamu tepat di hari istimewamu nanti."
                                </HandwrittenNote>

                                <div style={{ marginTop: "1rem" }}>
                                    <HandwrittenNote style={{ fontSize: "1.4rem", color: "#b07d62", fontWeight: 600 }}>
                                        {daysUntil} hari lagi{dots}
                                    </HandwrittenNote>
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "1.5rem", fontStyle: "italic" }}>
                                    (ketuk di luar untuk menutup)
                                </div>
                            </motion.div>

                            {/* The Envelope */}
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{
                                    scale: [0.5, 1.2, 1],
                                    opacity: 1,
                                    rotate: [0, -10, 10, -5, 5, 0], // Shake effect
                                }}
                                transition={{
                                    scale: { duration: 0.5 },
                                    opacity: { duration: 0.3 },
                                    rotate: { delay: 0.5, duration: 0.6, ease: "easeInOut" }
                                }}
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    position: "relative",
                                    zIndex: 2, // In front of paper start
                                    marginTop: "-40px", // Overlap
                                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))"
                                }}
                            >
                                <Image
                                    src="/time_capsule_icon_clean.webp"
                                    alt="Envelope"
                                    fill
                                    style={{ objectFit: "contain" }}
                                />
                            </motion.div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        <Image src="/special_peony.webp" alt="" fill style={{ objectFit: 'contain' }} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.35, y: [0, -8, 0], rotate: [-5, 0, -5] }}
                        transition={{ opacity: { duration: 1, delay: 0.4 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
                        style={{ position: "fixed", bottom: "15%", left: "5%", width: "180px", height: "180px", zIndex: 1, pointerEvents: "none" }}
                    >
                        <Image src="/special_wildflowers.webp" alt="" fill style={{ objectFit: 'contain' }} />
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
                                width: "44px", height: "44px", background: "#fff", border: "2px solid #5a5a5a",
                                borderRadius: "12px", color: "#5a5a5a", boxShadow: "2px 2px 0px #5a5a5a",
                                transition: "all 0.2s ease"
                            }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = "translate(-1px, -1px)";
                                    e.currentTarget.style.boxShadow = "4px 4px 0px #5a5a5a";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = "translate(0, 0)";
                                    e.currentTarget.style.boxShadow = "2px 2px 0px #5a5a5a";
                                }}
                            >
                                <ArrowLeft size={22} strokeWidth={2} />
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
                                {currentNow.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
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


                        {/* 1. Stacked Polaroid Portrait Card */}
                        <BentoCard isMobile={isMobile} style={{ gridColumn: isMobile ? "span 1" : "span 12", minHeight: isMobile ? "auto" : "380px", display: "flex", alignItems: "center", justifyContent: "center" }} rotate="0deg" tapeColor="#87b0a5">
                            <div style={{
                                display: "flex",
                                flexDirection: isMobile ? "column" : "row",
                                alignItems: "center",
                                gap: isMobile ? "2rem" : "4rem",
                                padding: isMobile ? "1rem" : "2rem"
                            }}>
                                {/* Stacked Polaroid Frame */}
                                <div
                                    style={{
                                        position: "relative",
                                        width: isMobile ? "220px" : "280px",
                                        height: isMobile ? "280px" : "360px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        // Tap to shuffle manually
                                        if (typeof window !== "undefined" && window.navigator.vibrate) {
                                            window.navigator.vibrate(10);
                                        }
                                        setPortraitIndex((prev) => (prev + 1) % portraits.length);
                                    }}
                                >
                                    {/* Back Layer (3rd card) */}
                                    <div style={{
                                        position: "absolute",
                                        top: "16px",
                                        left: "16px",
                                        width: "100%",
                                        height: "100%",
                                        background: "#fff",
                                        padding: "10px 10px 35px 10px",
                                        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                                        transform: "rotate(6deg)",
                                        zIndex: 1
                                    }}>
                                        <div style={{ width: "100%", height: "calc(100% - 25px)", background: "#f5f3f0", position: "relative", overflow: "hidden" }}>
                                            <Image
                                                src={portraits[(portraitIndex + 2) % portraits.length].src}
                                                alt=""
                                                fill
                                                style={{ objectFit: "cover", objectPosition: "center top", opacity: 0.7 }}
                                            />
                                        </div>
                                    </div>

                                    {/* Middle Layer (2nd card) - Shows SAME image as top for seamless transition */}
                                    <div style={{
                                        position: "absolute",
                                        top: "8px",
                                        left: "8px",
                                        width: "100%",
                                        height: "100%",
                                        background: "#fff",
                                        padding: "10px 10px 35px 10px",
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                                        transform: "rotate(-4deg)",
                                        zIndex: 2
                                    }}>
                                        <div style={{ width: "100%", height: "calc(100% - 25px)", background: "#f5f3f0", position: "relative", overflow: "hidden" }}>
                                            <Image
                                                src={portraits[portraitIndex].src}
                                                alt=""
                                                fill
                                                style={{ objectFit: "cover", objectPosition: "center top", opacity: 0.85 }}
                                            />
                                        </div>
                                    </div>

                                    {/* Top Layer (Current card - static frame, animated image inside) */}
                                    <motion.div
                                        initial={{ rotate: -2 }}
                                        animate={{ rotate: [-2, 0, -2] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPortrait(portraits[portraitIndex]);
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            background: "#fff",
                                            padding: "12px 12px 40px 12px",
                                            boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)",
                                            zIndex: 3
                                        }}
                                    >
                                        <div style={{
                                            width: "100%",
                                            height: "calc(100% - 28px)",
                                            position: "relative",
                                            overflow: "hidden",
                                            background: "#faf8f5"
                                        }}>
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={portraitIndex}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    style={{ position: "absolute", inset: 0 }}
                                                >
                                                    <Image
                                                        src={portraits[portraitIndex].src}
                                                        alt={portraits[portraitIndex].label}
                                                        fill
                                                        style={{ objectFit: "cover", objectPosition: "center top" }}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                        {/* Polaroid Caption */}
                                        <div style={{
                                            position: "absolute",
                                            bottom: "10px",
                                            left: "0",
                                            right: "0",
                                            textAlign: "center"
                                        }}>
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={portraitIndex}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    transition={{ duration: 0.4 }}
                                                >
                                                    <HandwrittenNote style={{
                                                        fontFamily: "'Caveat', cursive, 'Brush Script MT'",
                                                        color: "#8a7058",
                                                        fontSize: "0.95rem",
                                                        display: "inline-block",
                                                        lineHeight: 1.1
                                                    }}>
                                                        {portraits[portraitIndex].label}
                                                    </HandwrittenNote>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Text Content */}
                                <div style={{ textAlign: isMobile ? "center" : "left", maxWidth: "400px" }}>
                                    <div style={{ fontSize: "0.7rem", color: "#a0907d", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "0.5rem" }}>
                                        Untukmu
                                    </div>
                                    <h3 style={{
                                        fontSize: isMobile ? "1.8rem" : "2.2rem",
                                        fontWeight: 300,
                                        color: "#4e4439",
                                        fontFamily: "'Crimson Pro', serif",
                                        lineHeight: 1.3,
                                        marginBottom: "1rem"
                                    }}>
                                        Jiwa yang lahir di hari yang istimewa
                                    </h3>
                                    <HandwrittenNote style={{ fontSize: "1.1rem", lineHeight: 1.6, opacity: 0.8 }}>
                                        Setiap garis di sketsa ini adalah pengingat bahwa keberadaanmu layak untuk diabadikan.
                                    </HandwrittenNote>
                                </div>
                            </div>
                        </BentoCard>

                        {/* 2. Personal Year Loop (Instead of Calendar) */}
                        <Link href="/guest/no28/journal" style={{ gridColumn: isMobile ? "span 1" : "span 12", textDecoration: "none", color: "inherit", display: "block" }}>
                            <BentoCard isMobile={isMobile} rotate="-0.4deg" tapeColor="#f6a4a9" style={{ height: "100%", transition: "transform 0.2s" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.8rem" }}>
                                    <Map size={14} color="#a0907d" style={{ opacity: 0.8 }} />
                                    <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a0907d", textTransform: "uppercase", letterSpacing: "2.5px" }}>Lembaran Kisah Ke-{age + 1}</h3>
                                    <div style={{ marginLeft: "auto", fontFamily: "'Caveat', cursive", fontSize: "1.1rem", color: "#b07d62", transform: "rotate(-2deg)", opacity: 0.8 }}>ukir ceritamu...</div>
                                </div>

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
                                        customColors={journalColors}
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
                        </Link>

                        {/* --- NEW CARD: Tantang 25 Tahun (Quarter Life) --- */}
                        <BentoCard isMobile={isMobile} style={{ gridColumn: isMobile ? "span 1" : "span 12" }} rotate="-0.2deg" tapeColor="#aebdca">
                            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "2rem" : "4rem", alignItems: "center" }}>
                                {/* Left Side: Visual Metaphor (Dynamic Compass/Growth) */}
                                <div style={{ flex: isMobile ? "none" : "0 0 35%", position: "relative", display: "flex", justifyContent: "center" }}>
                                    <div style={{ position: "relative", width: "180px", height: "180px" }}>
                                        {/* Animated Rings */}
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3], rotate: [0, 90, 180] }}
                                                transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                                                style={{
                                                    position: "absolute", inset: i * 20,
                                                    border: "1px dashed #aebdca", borderRadius: "50%",
                                                }}
                                            />
                                        ))}
                                        {/* Center Typography */}
                                        <div style={{
                                            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                                            flexDirection: "column", zIndex: 10
                                        }}>
                                            <span style={{ fontSize: "5rem", fontFamily: "'Crimson Pro', serif", fontWeight: 400, color: "#4e4439", lineHeight: 0.8 }}>25</span>
                                            <HandwrittenNote style={{ fontSize: "1.2rem", marginTop: "5px" }}>Tahun</HandwrittenNote>
                                        </div>
                                        {/* Orbiting Icons */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                            style={{ position: "absolute", inset: 0 }}
                                        >
                                            <div style={{ position: "absolute", top: -15, left: "50%", transform: "translateX(-50%)", background: "#fdf8f4", padding: "5px" }}>
                                                <Star size={16} color="#aebdca" fill="#aebdca" fillOpacity={0.5} />
                                            </div>
                                            <div style={{ position: "absolute", bottom: -15, left: "50%", transform: "translateX(-50%) rotate(180deg)", background: "#fdf8f4", padding: "5px" }}>
                                                <Wind size={16} color="#aebdca" />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Right Side: The Message */}
                                <div style={{ flex: 1, position: "relative" }}>
                                    <div style={{ position: "absolute", top: "-20px", left: "-20px", opacity: 0.1 }}>
                                        <Quote size={60} color="#aebdca" />
                                    </div>
                                    <h3 style={{
                                        fontSize: "1.6rem", fontWeight: 400, color: "#b07d62",
                                        fontFamily: "'Crimson Pro', serif", marginBottom: "1rem", fontStyle: "italic"
                                    }}>
                                        "Titik Keseimbangan Emas"
                                    </h3>
                                    <p style={{
                                        fontFamily: "'Crimson Pro', serif", fontSize: "1.1rem", lineHeight: 1.8, color: "#4e4439", marginBottom: "1.5rem"
                                    }}>
                                        Banyak yang bilang usia 25 adalah fase yang membingungkan. Seolah kamu harus memilih satu jalan pasti saat hatimu masih ingin menjelajah segalanya.
                                        <br /><br />
                                        Tapi percayalah, ini adalah <strong>usia terindah</strong>. Kakimu sudah cukup kuat untuk berdiri sendiri, tapi hatimu masih cukup lembut untuk memimpikan banyak hal.
                                        Kamu tidak terlambat. Kamu tidak tertinggal. Kamu sedang mekar tepat pada waktunya.
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "1rem" }}>
                                        <div style={{ height: "1px", width: "40px", background: "#aebdca" }} />
                                        <HandwrittenNote style={{ color: "#aebdca", fontSize: "1rem" }}>Quarter Century Bloom</HandwrittenNote>
                                    </div>
                                </div>
                            </div>
                        </BentoCard>

                        {/* --- SLIDER SECTION: Musim, Kamus, Heartbeat --- */}
                        <CardSlider isMobile={isMobile} slides={[
                            // 1. Musim-Musim Kehidupan
                            <BentoCard key="musim2" isMobile={isMobile} style={{ width: "100%", minHeight: isMobile ? "auto" : "280px" }} rotate="0.2deg" tapeColor="#e8c9a0">
                                <SectionTitle icon={BookOpen}>Musim-Musim Kehidupanmu</SectionTitle>
                                <div style={{
                                    position: "absolute",
                                    bottom: isMobile ? "-30px" : "-50px",
                                    right: isMobile ? "-30px" : "-20px",
                                    width: isMobile ? "180px" : "320px",
                                    height: isMobile ? "180px" : "320px",
                                    opacity: 0.25,
                                    transform: isMobile ? "rotate(8deg)" : "rotate(-3deg)",
                                    pointerEvents: "none",
                                    zIndex: 0
                                }}>
                                    <Image src="/special_hijabi_main.webp" alt="" fill style={{ objectFit: "contain" }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "1.5rem" : "3rem", marginTop: "1rem", position: "relative" }}>
                                    {/* Golden Thread (Dashed Line) */}
                                    {!isMobile && (
                                        <div style={{ position: "absolute", top: "24px", left: "1.5rem", right: "2rem", height: "2px", borderTop: "2px dashed #e8e2d9", zIndex: 0 }} />
                                    )}
                                    {[
                                        { year: "2000 - 2006", title: "Fajar yang Lembut", desc: "Awal dari segalanya. Waktu yang membentuk siapa kamu.", icon: Sparkles },
                                        { year: "2006 - 2018", title: "Musim Bertumbuh", desc: "Tahun-tahun penuh warna, belajar, dan menemukan diri.", icon: Star },
                                        { year: "2018 - Kini", title: "Langkah Mendewasa", desc: "Perjalanan menjadi versi terbaik dari diri sendiri.", icon: Heart }
                                    ].map((chapter, i) => (
                                        <div key={i} style={{ flex: 1, position: "relative", paddingLeft: isMobile ? "1.5rem" : "0", borderLeft: isMobile ? "1px dashed #e5e0d8" : "none", zIndex: 1 }}>
                                            {!isMobile && i > 0 && <div style={{ position: "absolute", left: "-1rem", top: "1.5rem", width: "1rem", borderTop: "1px dashed #e5e0d8" }} />}
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                                <div style={{
                                                    width: "32px", height: "32px", borderRadius: "50%", background: "#fff",
                                                    border: "1px solid #e8e2d9", display: "flex", alignItems: "center", justifyContent: "center",
                                                    boxShadow: "0 0 12px rgba(176, 125, 98, 0.12)"
                                                }}>
                                                    <chapter.icon size={14} color="#b07d62" />
                                                </div>
                                                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#aaa" }}>{chapter.year}</span>
                                            </div>
                                            <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#4e4439" }}>{chapter.title}</h4>
                                            <HandwrittenNote style={{ fontSize: "0.9rem", marginTop: "4px" }}>{chapter.desc}</HandwrittenNote>
                                        </div>
                                    ))}
                                </div>
                            </BentoCard>,

                            // 2. Kamus Angka 28
                            <BentoCard key="kamus28" isMobile={isMobile} style={{ width: "100%", background: "linear-gradient(to bottom, #fff, #fdfbf7)" }} rotate="0.6deg" tapeColor="#b598d9">
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
                            </BentoCard>,

                            // 3. Heartbeat Counter
                            <BentoCard key="heartbeat" isMobile={isMobile} style={{ width: "100%", textAlign: "center" }} rotate="0.3deg" tapeColor="#87b0a5">
                                <HeartbeatWidget isMobile={isMobile} />
                            </BentoCard>
                        ]} />


                        {/* 5. Bisikan Sanubari (Consolidated Wisdom) */}
                        <BentoCard isMobile={isMobile} style={{ gridColumn: isMobile ? "span 1" : "span 12", padding: isMobile ? "3rem 1.8rem" : "6rem 4rem", background: "#fefbfc" }} rotate="0deg" tapeColor="#f08bb1">
                            <div style={{ position: "absolute", bottom: "-10px", right: "-10px", width: "140px", height: "140px", opacity: 0.85, transform: "rotate(-15deg)", pointerEvents: "none", zIndex: 0, mixBlendMode: "multiply" }}>
                                <Image src="/special_peony.webp" alt="" fill style={{ objectFit: "contain" }} />
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


                    {/* Polaroid Logic: Apology Popup */}
                    <AnimatePresence>
                        {selectedPortrait && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedPortrait(null)}
                                style={{
                                    position: "fixed",
                                    inset: 0,
                                    background: "rgba(0,0,0,0.6)",
                                    backdropFilter: "blur(4px)",
                                    zIndex: 99999,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "2rem"
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        background: "#fff",
                                        padding: "1.5rem",
                                        borderRadius: "2px",
                                        maxWidth: "400px",
                                        textAlign: "center",
                                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                                        position: "relative"
                                    }}
                                >
                                    {/* The Image Itself (Mini) */}
                                    <div style={{ width: "100%", height: "250px", position: "relative", marginBottom: "1.5rem", background: "#f0f0f0" }}>
                                        <Image src={selectedPortrait.src} alt="" fill style={{ objectFit: "cover" }} />
                                    </div>

                                    <HandwrittenNote style={{ fontSize: "1.2rem", color: "#4e4439", marginBottom: "1rem", lineHeight: 1.6 }}>
                                        "Maaf ya, sudah lancang mengabadikan ini tanpa izin.
                                        <br /><br />
                                        Tapi rasanya berdosa jika membiarkan cahaya seindah ini berlalu tanpa kenangan.
                                        <br /><br />
                                        Tetaplah bersinar, dengan caramu sendiri."
                                    </HandwrittenNote>

                                    <div style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "1.5rem", cursor: "pointer" }} onClick={() => setSelectedPortrait(null)}>
                                        (ketuk di luar untuk menutup)
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </Container>
            </main>
        </div>
    );
}
