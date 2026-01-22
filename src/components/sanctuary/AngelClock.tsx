"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Lock, ArrowRight, Sun, Moon, RefreshCw, Heart, Sparkles, Calendar as CalendarIcon, Battery, Zap, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

// CONFIGURATION
// TODO: Consider moving this to a context or user config if dynamic users needed
const BIRTH_DATE = new Date(2000, 10, 28); // November 28, 2000
const CAPSULE_UNLOCK_DATE = "2026-12-31";

// Enhanced Motivations Structure (Indonesian: Crush Coded, Mature, playful)
const MOTIVATIONS = {
    morning: [
        "Pagi. Dunia jadi lebih cerah dikit karena kamu bangun.",
        "Senyum dulu. Itu look makeup terbaik kamu hari ini.",
        "Hari ini kanvas kosong. Jangan takut coret-coret dikiit.",
        "Bangun, Tuan Putri. Universe lagi nungguin pesonamu."
    ],
    evening: [
        "Udah capeknya? Istirahat ya, kamu udah cukup hebat hari ini.",
        "Bintangnya lagi bagus, biarpun masih kalah sama kamu.",
        "Lepasin berat di pundak. Besok kita angkat lagi pelan-pelan.",
        "Tidur gih. Mimpi yang indah-indah aja ya."
    ],
    any: [
        "Kamu tau gak? Ada yang diem-diem bangga banget sama pencapaianmu.",
        "Jangan lupa napas. Kamu manusia, bukan robot.",
        "Keberadaanmu aja udah cukup bikin hari ini layak dirayain.",
        "Semesta kayaknya lagi seneng, soalnya ada kamu di dalamnya.",
        "Kamu disayang. Lebih banyak dari yang kamu sadar.",
        "Terus bersinar ya. Jangan redup cuma gara-gara awan lewat.",
        "Pelan-pelan aja. Tangganya nggak lari kok."
    ]
};

export function AngelClock() {
    const { toast } = useToast();
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        totalSeconds: number;
        isBirthday: boolean;
    } | null>(null);

    const [activeQuote, setActiveQuote] = useState<string>("");
    const [mounted, setMounted] = useState(false);

    const getRandomQuote = useCallback(() => {
        const hour = new Date().getHours();
        const timeOfDay = hour >= 5 && hour < 17 ? "morning" : "evening";
        const pool = [...MOTIVATIONS[timeOfDay], ...MOTIVATIONS.any];
        return pool[Math.floor(Math.random() * pool.length)];
    }, []);

    const shuffleQuote = () => setActiveQuote(getRandomQuote());

    useEffect(() => {
        setMounted(true);
        setActiveQuote(getRandomQuote());

        const interval = setInterval(() => {
            const now = new Date();
            const currentYear = now.getFullYear();
            let nextBirthday = new Date(BIRTH_DATE);
            nextBirthday.setFullYear(currentYear);

            // Check if birthday passed this year
            if (now > nextBirthday) {
                nextBirthday.setFullYear(currentYear + 1);
            }

            // Check if today is birthday
            const isBirthday = now.getDate() === BIRTH_DATE.getDate() && now.getMonth() === BIRTH_DATE.getMonth();

            const diffMs = nextBirthday.getTime() - now.getTime();
            // Handle edge case where it IS birthday (diff negative slightly due to time, logic above handles "next" year primarily)
            // But if isBirthday is true, we want special display

            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds, totalSeconds: Math.floor(diffMs / 1000), isBirthday });
        }, 1000);

        return () => clearInterval(interval);
    }, [getRandomQuote]);

    // Milestone detection
    const milestone = useMemo(() => {
        if (!timeLeft) return null;
        if (timeLeft.isBirthday) return "SELAMAT ULANG TAHUN!";
        const d = timeLeft.days;
        if (d === 100) return "100 Hari Lagi";
        if (d === 50) return "Setengah Jalan";
        if (d === 30) return "Sebulan Terakhir";
        if (d === 7) return "Minggu Final";
        if (d === 1) return "Besok Banget";
        return null;
    }, [timeLeft]);

    const handleCapsuleClick = () => {
        const now = new Date();
        if (now >= new Date(CAPSULE_UNLOCK_DATE)) {
            toast("Membuka Kapsul Waktu...", "cosmic");
        } else {
            toast(`Terkunci sampai ${CAPSULE_UNLOCK_DATE}. Sabar ya.`, "error");
        }
    };

    if (!mounted || !timeLeft) return null;

    const isEvening = new Date().getHours() >= 17 || new Date().getHours() < 5;

    // Derived Stats
    const yearProgress = ((365 - timeLeft.days) / 365) * 100;
    const age = new Date().getFullYear() - BIRTH_DATE.getFullYear() - (new Date() < new Date(new Date().getFullYear(), BIRTH_DATE.getMonth(), BIRTH_DATE.getDate()) ? 1 : 0);
    const weekendsRemaining = Math.floor(timeLeft.days / 7);

    return (
        <div
            className="w-full flex flex-col !gap-16"
            style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}
        >

            {/* 
               1. THE GIANT COUNTDOWN (STEVE JOBS STYLE)
               Minimalist, centered, perfectly typeset.
            */}
            <section className="relative flex flex-col items-center justify-center py-12">
                {/* Background Ambient Glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full pointer-events-none"
                    style={{
                        background: timeLeft.isBirthday
                            ? 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, rgba(0,0,0,0) 70%)'
                            : 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, rgba(0,0,0,0) 70%)',
                        filter: 'blur(80px)',
                        zIndex: -1
                    }}
                />

                {/* Milestone Badge */}
                {milestone && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="!mb-6 px-4 py-1.5 rounded-full backdrop-blur-md"
                        style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                            color: 'rgba(251, 191, 36, 0.9)'
                        }}
                    >
                        <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase flex items-center gap-2">
                            <Sparkles size={12} /> {milestone}
                        </span>
                    </motion.div>
                )}

                {/* The DAYS Number */}
                <div className="relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ marginBottom: '1rem', textAlign: 'center' }}
                    >
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontStyle: 'italic', color: 'rgba(251, 113, 133, 0.8)' }}>
                            {timeLeft.isBirthday ? "Ini Harimu, Sang Tokoh Utama" : "Menuju Harimu"}
                        </h2>
                    </motion.div>

                    {timeLeft.isBirthday ? (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(5rem, 15vw, 8rem)', color: '#fcd34d', lineHeight: 1 }}
                        >
                            Selamat<br />Ulang Tahun
                        </motion.div>
                    ) : (
                        <>
                            <motion.h1
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: 'clamp(6rem, 20vw, 14rem)',
                                    color: 'var(--foreground)',
                                    textShadow: '0 20px 60px rgba(0,0,0,0.1)',
                                    fontVariantNumeric: 'tabular-nums',
                                    lineHeight: 1,
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                {timeLeft.days}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 1 }}
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                                    color: 'rgba(255,255,255,0.3)',
                                    fontStyle: 'italic',
                                    fontWeight: 300,
                                    marginTop: '1rem',
                                    textAlign: 'center'
                                }}
                            >
                                hari lagi menuju versi terbaikmu di usia {age + 1}
                            </motion.p>
                        </>
                    )}
                </div>

                {/* Precision Ticker */}
                {!timeLeft.isBirthday && (
                    <div
                        className="grid grid-cols-3 w-full max-w-2xl"
                        style={{ gap: '1.5rem', marginTop: '2rem', paddingTop: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        {[
                            { val: timeLeft.hours, label: 'Jam' },
                            { val: timeLeft.minutes, label: 'Menit' },
                            { val: timeLeft.seconds, label: 'Detik' }
                        ].map((t, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 300, color: 'rgba(255,255,255,0.7)', fontVariantNumeric: 'tabular-nums' }}>
                                    {t.val.toString().padStart(2, '0')}
                                </span>
                                <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                                    {t.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 
               2. THE GRID (VISUALIZING TIME)
               Left: Progress Bar & Stats. Right: Calendar.
            */}
            <section className="grid md:grid-cols-2 max-w-6xl mx-auto w-full" style={{ gap: '1.5rem', padding: '0 1rem' }}>

                {/* Visual Progress & Stats */}
                <div className="flex flex-col justify-center" style={{ gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>Perjalanan Mengorbit</span>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
                                {Math.round(yearProgress)}%
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                    width: `${yearProgress}%`,
                                    background: 'linear-gradient(90deg, #f43f5e 0%, #fbbf24 100%)',
                                    boxShadow: '0 0 20px rgba(244, 63, 94, 0.3)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                        {[
                            {
                                label: "Sisa Weekend",
                                val: weekendsRemaining,
                                icon: <Coffee size={14} />
                            },
                            {
                                label: "Detak Jantung",
                                val: (timeLeft.totalSeconds * 1.2).toLocaleString().split('.')[0],
                                icon: <Heart size={14} />
                            },
                            {
                                label: "Baterai Energi",
                                val: "100%",
                                icon: <Zap size={14} />
                            },
                            {
                                label: "Sunrise Lagi",
                                val: timeLeft.days,
                                icon: <Sun size={14} />
                            }
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border transition-colors duration-500 group"
                                style={{
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.01)',
                                    borderColor: 'rgba(255,255,255,0.04)'
                                }}
                            >
                                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.25rem', lineHeight: 1 }} className="group-hover:text-rose-300 transition-colors">
                                    {stat.val}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.5625rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
                                    {stat.icon} {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Year Grid Widget */}
                <div
                    className="!p-6 md:!p-8 rounded-[1.5rem] border backdrop-blur-md flex flex-col"
                    style={{
                        background: 'rgba(255, 255, 255, 0.015)',
                        borderColor: 'rgba(255, 255, 255, 0.06)'
                    }}
                >
                    <div className="flex justify-between items-center !mb-4">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-mono flex items-center gap-2">
                            <CalendarIcon size={12} />
                            Orbit Waktumu
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono">Hari Ini</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        </div>
                    </div>

                    {/* The Grid: 365 Days */}
                    <div className="flex-1 flex flex-wrap content-start !gap-1.5">
                        {Array.from({ length: 365 }).map((_, i) => {
                            // Logic: 0 to 365. 
                            // daysPassed = 365 - timeLeft.days. 
                            const daysPassed = 365 - timeLeft.days;
                            const isPast = i < daysPassed;
                            const isToday = i === daysPassed;

                            return (
                                <div
                                    key={i}
                                    title={isToday ? "Today" : isPast ? "Past" : "Future"}
                                    className={`
                                        w-1.5 h-1.5 rounded-full transition-all duration-500
                                        ${isToday ? 'scale-150 shadow-[0_0_10px_rgba(244,63,94,0.8)] z-10' : ''}
                                    `}
                                    style={{
                                        backgroundColor: isToday
                                            ? '#f43f5e' // Rose for Today
                                            : isPast
                                                ? 'rgba(255, 255, 255, 0.1)' // Dim for Past
                                                : 'rgba(255, 255, 255, 0.03)', // Faint for Future
                                        border: !isPast && !isToday ? '1px solid rgba(255,255,255,0.05)' : 'none'
                                    }}
                                />
                            );
                        })}
                    </div>

                    <div className="!mt-4 text-center">
                        <p className="text-[10px] text-white/20 font-mono italic">
                            Satu titik, satu hari. Yang menyala itu kamu, saat ini.
                        </p>
                    </div>
                </div>
            </section>

            {/* 
               3. MOTIVATION & CAPSULE
            */}
            <section className="grid grid-cols-1 md:grid-cols-3 !gap-6 max-w-6xl mx-auto w-full !mb-10 px-4">
                {/* Motivation Card */}
                <div
                    className="md:col-span-2 relative !p-6 md:!p-10 rounded-[1.5rem] overflow-hidden group hover:!bg-white/5 transition-colors duration-500"
                    style={{
                        background: isEvening
                            ? 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(49, 46, 129, 0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(67, 56, 202, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                        border: '1px solid rgba(255,255,255,0.06)'
                    }}
                >
                    <div className="flex justify-between items-start !mb-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full !bg-white/5 border !border-white/5">
                            {isEvening ? <Moon size={12} className="text-indigo-300" /> : <Sun size={12} className="text-amber-300" />}
                            <span className="text-[9px] uppercase tracking-widest text-white/50 font-mono">
                                {isEvening ? 'Pesan Malam' : 'Bisikan Pagi'}
                            </span>
                        </div>
                        <button
                            onClick={shuffleQuote}
                            className="p-2 rounded-full hover:bg-white/10 text-white/20 hover:text-white/80 transition-all"
                            title="New Perspective"
                        >
                            <RefreshCw size={14} />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeQuote}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="min-h-[80px] flex items-center justify-center"
                        >
                            <p className="font-serif text-xl md:text-2xl text-center text-white/80 leading-relaxed italic">
                                "{activeQuote}"
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Lock Box */}
                <div
                    onClick={handleCapsuleClick}
                    className="md:col-span-1 !p-6 rounded-[1.5rem] border !border-white/5 hover:!border-rose-500/20 transition-colors cursor-pointer group flex flex-col justify-between"
                    style={{ background: 'rgba(0,0,0,0.2)' }}
                >
                    <div className="flex justify-between items-start">
                        <Lock size={20} className="text-white/30 group-hover:text-rose-400 transition-colors" />
                        <span className="text-[9px] font-mono text-white/20">{CAPSULE_UNLOCK_DATE}</span>
                    </div>

                    <div>
                        <h3 className="text-xl font-serif text-white/80 mb-2">Pasak Waktu</h3>
                        <p className="text-sm text-white/40 leading-relaxed">
                            Ada serpihan masa lalu yang dititipin buat kamu. Tunggu tanggal mainnya ya.
                        </p>
                    </div>

                    <div className="self-end p-2 rounded-full border border-white/10 group-hover:bg-rose-500/10 group-hover:border-rose-500/20 transition-all">
                        <ArrowRight size={14} className="text-white/30 group-hover:text-rose-400" />
                    </div>
                </div>
            </section>
        </div>
    );
}
