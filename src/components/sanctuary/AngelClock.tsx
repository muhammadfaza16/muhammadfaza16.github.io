"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Lock, ArrowRight, Sun, Moon, RefreshCw, Heart, Sparkles, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

// CONFIGURATION
const BIRTH_DATE = new Date(2000, 10, 28); // November 28, 2000
const CAPSULE_UNLOCK_DATE = "2026-12-31";

// Enhanced Motivations
const MOTIVATIONS = [
    { text: "The sun rose again today, and so did every reason to keep going.", time: "morning" },
    { text: "Every sunrise is the universe's way of saying 'try again'.", time: "morning" },
    { text: "Coffee first, conquering the world second.", time: "morning" },
    { text: "The stars are just the universe leaving the lights on for you.", time: "evening" },
    { text: "Rest now. Tomorrow has its own magic.", time: "evening" },
    { text: "The moon watches over those who dream with open eyes.", time: "evening" },
    { text: "Somewhere in the cosmos, a star was made just to shine for you.", time: "any" },
    { text: "The universe spent 13.8 billion years preparing for your existence.", time: "any" },
    { text: "Your orbit is unique. Don't adjust it for people standing still.", time: "any" },
    { text: "Even on cloudy days, you're still someone's sunshine.", time: "any" },
    { text: "Chaos looks good on you. Keep dancing through it.", time: "any" },
];

export function AngelClock() {
    const { toast } = useToast();
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    const [activeQuote, setActiveQuote] = useState<typeof MOTIVATIONS[0] | null>(null);
    const [mounted, setMounted] = useState(false);

    const getRandomQuote = useCallback(() => {
        const hour = new Date().getHours();
        const timeOfDay = hour >= 5 && hour < 17 ? "morning" : "evening";
        const relevantQuotes = MOTIVATIONS.filter(q => q.time === timeOfDay || q.time === "any");
        return relevantQuotes[Math.floor(Math.random() * relevantQuotes.length)];
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

            if (now > nextBirthday) {
                nextBirthday.setFullYear(currentYear + 1);
            }

            const diffMs = nextBirthday.getTime() - now.getTime();
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, [getRandomQuote]);

    // Milestone detection
    const milestone = useMemo(() => {
        if (!timeLeft) return null;
        const d = timeLeft.days;
        if (d === 100) return "100 Days ✨";
        if (d === 50) return "50 Days 💫";
        if (d === 30) return "1 Month 🌙";
        if (d === 7) return "1 Week 🌟";
        if (d === 1) return "Tomorrow! 💝";
        if (d === 0) return "TODAY! 🎉";
        return null;
    }, [timeLeft]);

    const calendarGrid = useMemo(() => {
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

        const days = [];
        // Empty slots for days before the 1st
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        // Actual days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    }, []);

    const handleCapsuleClick = () => {
        const now = new Date();
        if (now >= new Date(CAPSULE_UNLOCK_DATE)) {
            // Capsule open logic
            toast("The capsule is opening...", "success");
        } else {
            toast(`This memory is locked until ${CAPSULE_UNLOCK_DATE}`, "error");
        }
    };

    if (!mounted || !timeLeft || !activeQuote) return null;

    const isEvening = new Date().getHours() >= 17 || new Date().getHours() < 5;
    const currentDay = new Date().getDate();

    return (
        <div className="w-full space-y-24 md:space-y-40">

            {/* ═══════════════════════════════════════════════════════════
                SECTION 1: THE HERO - Giant Countdown
                This is the emotional centerpiece. MASSIVE numbers.
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative py-16 md:py-24 flex flex-col items-center text-center">
                {/* Atmospheric glow */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-rose-500/15 via-amber-500/8 to-transparent blur-[150px] animate-pulse-slow" />
                </div>

                {/* Milestone Badge */}
                {milestone && (
                    <div className="inline-flex items-center gap-2.5 px-5 py-2 mb-16 rounded-full bg-amber-500/8 border border-amber-400/15 animate-fade-in backdrop-blur-sm">
                        <Sparkles size={13} className="text-amber-300/90" />
                        <span className="text-amber-200/90 font-medium tracking-wider text-[13px]">{milestone}</span>
                    </div>
                )}

                {/* THE BIG NUMBER */}
                <div className="relative group cursor-default">
                    {/* Floating Particles */}
                    <div className="absolute inset-0 -z-10 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute bg-white rounded-full opacity-15"
                                initial={{
                                    x: Math.random() * 200 - 100,
                                    y: Math.random() * 200 - 100,
                                    scale: Math.random() * 0.5 + 0.5,
                                }}
                                animate={{
                                    y: [null, Math.random() * -100],
                                    opacity: [0.15, 0],
                                }}
                                transition={{
                                    duration: Math.random() * 5 + 5,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: Math.random() * 5,
                                }}
                                style={{
                                    width: Math.random() * 4 + 2 + "px",
                                    height: Math.random() * 4 + 2 + "px",
                                    left: "50%",
                                    top: "50%",
                                }}
                            />
                        ))}
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="font-serif font-thin tracking-[-0.04em] leading-[0.85] select-none transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        style={{
                            fontSize: "clamp(9rem, 28vw, 20rem)",
                            color: "var(--foreground)",
                            textShadow: "0 0 100px rgba(244, 114, 182, 0.12)",
                        }}
                    >
                        {timeLeft.days}
                    </motion.h1>
                </div>

                {/* Poetic subtitle */}
                <p className="font-serif italic text-[1.35rem] md:text-[1.75rem] text-white/45 mt-10 md:mt-12 max-w-md leading-[1.5] tracking-wide">
                    days until the universe
                    <br />
                    <span className="text-rose-400/80 not-italic font-light">celebrates you.</span>
                </p>

                {/* Precise countdown ticker */}
                <div className="flex flex-wrap justify-center gap-12 md:gap-20 mt-20 pt-12 border-t border-white/[0.04] w-full max-w-3xl mx-auto">
                    {[
                        { value: timeLeft.hours.toString().padStart(2, '0'), label: "Hours" },
                        { value: timeLeft.minutes.toString().padStart(2, '0'), label: "Minutes" },
                        { value: timeLeft.seconds.toString().padStart(2, '0'), label: "Seconds" },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <span className="font-mono text-[2.5rem] md:text-[3.5rem] font-thin tracking-tight text-white/70 tabular-nums">
                                {item.value}
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 2: TIME PASSAGE & CALENDAR
                Visualizing the flow of time
            ═══════════════════════════════════════════════════════════ */}
            <section className="grid md:grid-cols-2 gap-10 md:gap-16">

                {/* Progress Visualization */}
                <div className="flex flex-col justify-center space-y-10">
                    <div className="flex items-center gap-4">
                        <Sparkles size={14} className="text-rose-400/80" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                            Year Progress
                        </span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                        <span className="font-mono text-[13px] text-rose-400/90 font-light">
                            {Math.round(((365 - timeLeft.days) / 365) * 100)}%
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose-500/90 to-amber-500/90 transition-all duration-1000 ease-out"
                            style={{ width: `${((365 - timeLeft.days) / 365) * 100}%` }}
                        />
                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 blur-lg opacity-40"
                            style={{ width: `${((365 - timeLeft.days) / 365) * 100}%` }}
                        />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-5">
                        {[
                            { value: Math.floor(timeLeft.days / 7), label: "Weeks", icon: "📅" },
                            { value: Math.floor(timeLeft.days * 24), label: "Hours", icon: "⏳" },
                            { value: Math.floor(timeLeft.days / 29.5), label: "Moons", icon: "🌕" },
                            { value: timeLeft.days * 3, label: "Teas", icon: "🍵" },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.04] hover:border-rose-500/15 transition-all duration-500 group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-lg grayscale group-hover:grayscale-0 transition-all duration-500">{stat.icon}</span>
                                    <span className="font-mono text-[9px] text-white/25 uppercase tracking-[0.2em]">{stat.label}</span>
                                </div>
                                <div className="font-mono text-[1.75rem] font-thin text-white/80 group-hover:text-rose-200/90 transition-colors duration-500">
                                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="rounded-[1.75rem] border border-white/[0.06] bg-white/[0.015] p-7 md:p-9 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <CalendarIcon size={16} className="text-rose-400/70" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500/80 animate-pulse" />
                    </div>

                    <div className="grid grid-cols-7 gap-2.5 text-center mb-3">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} className="text-[9px] font-mono text-white/25 py-2 tracking-wider">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2.5">
                        {calendarGrid.map((day, i) => {
                            if (!day) return <div key={i} />;
                            const isToday = day === currentDay;
                            return (
                                <div
                                    key={i}
                                    className={`
                                        aspect-square flex items-center justify-center rounded-xl text-[13px] font-mono transition-all duration-500
                                        ${isToday
                                            ? 'bg-rose-500/90 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] scale-110 font-medium'
                                            : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'}
                                    `}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 pt-7 border-t border-white/[0.04] text-center">
                        <p className="text-[11px] text-white/30 italic tracking-wide">
                            Each day is a new page in your story.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 3: DAILY TRANSMISSION (Motivation)
                Personal, warm, time-aware messages
            ═══════════════════════════════════════════════════════════ */}
            <section className="max-w-3xl mx-auto">
                <div
                    className="relative p-10 md:p-16 rounded-[2.5rem] overflow-hidden group transition-all duration-700 hover:shadow-[0_0_50px_rgba(255,255,255,0.03)]"
                >
                    {/* Dynamic Background */}
                    <div className={`absolute inset-0 transition-opacity duration-1000 ${isEvening ? 'opacity-100' : 'opacity-0'}`}
                        style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.03) 100%)" }} />
                    <div className={`absolute inset-0 transition-opacity duration-1000 ${!isEvening ? 'opacity-100' : 'opacity-0'}`}
                        style={{ background: "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 146, 60, 0.03) 100%)" }} />

                    <div className="absolute inset-0 border border-white/[0.06] rounded-[2.5rem]" />

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-10 md:mb-14">
                            <div className="flex items-center gap-3">
                                {isEvening ? (
                                    <Moon size={15} className="text-indigo-300/80" />
                                ) : (
                                    <Sun size={15} className="text-amber-300/80" />
                                )}
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                                    {isEvening ? "Evening Transmission" : "Morning Transmission"}
                                </span>
                            </div>
                            <button
                                onClick={shuffleQuote}
                                className="p-3 rounded-full hover:bg-white/[0.06] transition-all duration-500"
                                aria-label="New Quote"
                            >
                                <RefreshCw size={14} className="text-white/30 hover:text-white/70 transition-colors duration-500 hover:rotate-180" />
                            </button>
                        </div>

                        <div className="min-h-[8rem] md:min-h-[10rem] flex items-center justify-center py-4">
                            <AnimatePresence mode="wait">
                                <motion.blockquote
                                    key={activeQuote.text}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.6 }}
                                    className="font-serif text-[1.4rem] md:text-[1.75rem] leading-[1.6] italic text-white/75 text-center max-w-2xl mx-auto tracking-wide"
                                >
                                    "{activeQuote.text}"
                                </motion.blockquote>
                            </AnimatePresence>
                        </div>

                        <div className="flex justify-center mt-10">
                            <Heart size={14} className={`fill-current ${isEvening ? 'text-indigo-400/20' : 'text-amber-400/20'}`} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 4: TIME CAPSULE
                Mysterious, locked content
            ═══════════════════════════════════════════════════════════ */}
            <section className="max-w-2xl mx-auto pb-16">
                <div
                    onClick={handleCapsuleClick}
                    className="group relative p-9 md:p-12 rounded-[1.75rem] border border-white/[0.06] cursor-pointer bg-black/15 backdrop-blur-sm overflow-hidden hover:border-rose-500/25 transition-all duration-700 hover:bg-rose-900/[0.03]"
                >
                    {/* Subtle pattern */}
                    <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-700" style={{
                        backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
                        backgroundSize: "14px 14px",
                    }} />

                    <div className="relative flex justify-between items-start mb-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-rose-500/8 text-rose-400/80">
                                <Lock size={16} />
                            </div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 group-hover:text-rose-300/60 transition-colors duration-500">
                                Time Capsule
                            </span>
                        </div>
                        <span className="px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[9px] font-mono text-white/30 group-hover:border-rose-500/20 group-hover:text-rose-200/80 transition-colors duration-500 tracking-wide">
                            Unlock: {CAPSULE_UNLOCK_DATE}
                        </span>
                    </div>

                    <h3 className="font-serif text-[1.75rem] md:text-[2rem] text-white/90 mb-4 group-hover:text-white transition-colors duration-500 tracking-tight">
                        A Letter Frozen in Time
                    </h3>
                    <p className="text-white/40 italic max-w-md group-hover:text-white/55 transition-colors duration-500 leading-relaxed text-[15px]">
                        Some words are meant to be read at the right moment.
                        It stays locked until the stars align.
                    </p>

                    <div className="absolute bottom-9 right-9 p-3 rounded-full border border-white/[0.04] text-white/15 group-hover:text-rose-400/80 group-hover:border-rose-500/25 group-hover:translate-x-1 transition-all duration-500">
                        <ArrowRight size={18} />
                    </div>
                </div>
            </section>
        </div>
    );
}

