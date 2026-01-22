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
    { text: "The world is brighter because you are in it.", time: "morning" },
    { text: "Don't forget to smile today; it's your best look.", time: "morning" },
    { text: "You are capable of amazing things.", time: "morning" },
    { text: "Rest easy, you've done enough today.", time: "evening" },
    { text: "The stars are just the universe applauding your existence.", time: "evening" },
    { text: "Dream big, for you are made of stardust.", time: "evening" },
    { text: "You are a masterpiece in motion.", time: "any" },
    { text: "Your very existence is a reason to celebrate.", time: "any" },
    { text: "The universe dances to the rhythm of your heart.", time: "any" },
    { text: "You are loved more than you know.", time: "any" },
    { text: "Keep shining, beautiful soul.", time: "any" },
];

export function AngelClock() {
    const { toast } = useToast();
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        totalSeconds: number;
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

            setTimeLeft({ days, hours, minutes, seconds, totalSeconds: Math.floor(diffMs / 1000) });
        }, 1000);

        return () => clearInterval(interval);
    }, [getRandomQuote]);

    // Milestone detection
    const milestone = useMemo(() => {
        if (!timeLeft) return null;
        const d = timeLeft.days;
        if (d === 100) return "100 Days To Go";
        if (d === 50) return "Halfway There";
        if (d === 30) return "1 Month Left";
        if (d === 7) return "Final Week";
        if (d === 1) return "Tomorrow";
        if (d === 0) return "Today";
        return null;
    }, [timeLeft]);



    const handleCapsuleClick = () => {
        const now = new Date();
        if (now >= new Date(CAPSULE_UNLOCK_DATE)) {
            toast("Opening Time Capsule...", "cosmic");
        } else {
            toast(`Locked until ${CAPSULE_UNLOCK_DATE}`, "error");
        }
    };

    if (!mounted || !timeLeft || !activeQuote) return null;

    const isEvening = new Date().getHours() >= 17 || new Date().getHours() < 5;


    return (
        <div className="w-full flex flex-col gap-32">

            {/* 
               1. THE GIANT COUNTDOWN (STEVE JOBS STYLE)
               Minimalist, centered, perfectly typeset.
            */}
            <section className="relative flex flex-col items-center justify-center py-20">
                {/* Background Ambient Glow (Inline Style for safety) */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, rgba(0,0,0,0) 70%)',
                        filter: 'blur(80px)',
                        zIndex: -1
                    }}
                />

                {/* Milestone Badge */}
                {milestone && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 px-4 py-1.5 rounded-full"
                        style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                            color: 'rgba(251, 191, 36, 0.9)'
                        }}
                    >
                        <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase">
                            {milestone}
                        </span>
                    </motion.div>
                )}

                {/* The DAYS Number */}
                <div className="relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8 text-center"
                    >
                        <h2 className="text-xl md:text-2xl font-serif italic text-rose-300/80">
                            Countdown to You
                        </h2>
                    </motion.div>

                    <motion.h1
                        className="font-serif leading-none tracking-tighter"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            fontSize: 'clamp(8rem, 25vw, 18rem)',
                            color: 'var(--foreground)',
                            textShadow: '0 20px 60px rgba(0,0,0,0.1)',
                            fontVariantNumeric: 'tabular-nums'
                        }}
                    >
                        {timeLeft.days}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-center font-serif text-2xl md:text-4xl text-white/30 italic font-light mt-4"
                    >
                        days until your next bloom
                    </motion.p>
                </div>

                {/* Precision Ticker */}
                <div
                    className="grid grid-cols-3 gap-8 md:gap-20 mt-24 pt-12 border-t w-full max-w-2xl px-8"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                    {[
                        { val: timeLeft.hours, label: 'Hours' },
                        { val: timeLeft.minutes, label: 'Minutes' },
                        { val: timeLeft.seconds, label: 'Seconds' }
                    ].map((t, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className="font-mono text-3xl md:text-5xl font-light text-white/70 tabular-nums">
                                {t.val.toString().padStart(2, '0')}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 mt-2 font-mono">
                                {t.label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 
               2. THE GRID (VISUALIZING TIME)
               Left: Progress Bar & Stats. Right: Calendar.
            */}
            <section className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-6xl mx-auto w-full">

                {/* Visual Progress */}
                <div className="flex flex-col justify-center gap-10">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">Your Solar Journey</span>
                            <span className="text-2xl font-serif text-white/80 italic">
                                {Math.round(((365 - timeLeft.days) / 365) * 100)}%
                            </span>
                        </div>

                        {/* Custom Progress Bar with Inline Style */}
                        <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                    width: `${((365 - timeLeft.days) / 365) * 100}%`,
                                    background: 'linear-gradient(90deg, #f43f5e 0%, #fbbf24 100%)',
                                    boxShadow: '0 0 20px rgba(244, 63, 94, 0.3)'
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Weeks", val: Math.floor(timeLeft.days / 7) },
                            { label: "Heartbeats", val: (timeLeft.totalSeconds * 1.2).toLocaleString().split('.')[0] }, // Approx 72bpm
                            { label: "Breaths", val: (timeLeft.totalSeconds * 0.25).toLocaleString().split('.')[0] }, // Approx 15bpm
                            { label: "Sunrises", val: timeLeft.days }
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl border transition-colors duration-500 hover:border-white/10"
                                style={{
                                    background: 'rgba(255,255,255,0.01)',
                                    borderColor: 'rgba(255,255,255,0.04)'
                                }}
                            >
                                <div className="text-[2rem] font-serif text-white/80 mb-1 leading-none">
                                    {stat.val}
                                </div>
                                <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-mono">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Year Grid Widget */}
                <div
                    className="p-8 md:p-10 rounded-[2rem] border backdrop-blur-md flex flex-col"
                    style={{
                        background: 'rgba(255, 255, 255, 0.015)',
                        borderColor: 'rgba(255, 255, 255, 0.06)'
                    }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-mono flex items-center gap-2">
                            <CalendarIcon size={12} />
                            Your Solar Year
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono">Today</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        </div>
                    </div>

                    {/* The Grid */}
                    <div className="flex-1 flex flex-wrap content-start gap-1.5">
                        {Array.from({ length: 365 }).map((_, i) => {
                            // Calculate "progress" simply for visual demonstration based on days remaining
                            // Total days ~365. Days Passed = 365 - timeLeft.days.
                            // This is an approximation for visual flair.
                            const daysPassed = 365 - timeLeft.days;
                            const isPast = i < daysPassed;
                            const isToday = i === daysPassed;

                            return (
                                <div
                                    key={i}
                                    className={`
                                        w-1.5 h-1.5 rounded-full transition-all duration-500
                                        ${isToday ? 'scale-150 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : ''}
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

                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-white/20 font-mono italic">
                            Each dot is a day. The bright spark is you, right now.
                        </p>
                    </div>
                </div>
            </section>

            {/* 
               3. MOTIVATION & CAPSULE
            */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full mb-20">
                {/* Motivation Card */}
                <div
                    className="md:col-span-2 relative p-10 md:p-14 rounded-[2rem] overflow-hidden group"
                    style={{
                        background: isEvening
                            ? 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(49, 46, 129, 0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(67, 56, 202, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                        border: '1px solid rgba(255,255,255,0.06)'
                    }}
                >
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                            {isEvening ? <Moon size={12} className="text-indigo-300" /> : <Sun size={12} className="text-amber-300" />}
                            <span className="text-[9px] uppercase tracking-widest text-white/50 font-mono">
                                {isEvening ? 'Evening Reminder' : 'Morning Affirmation'}
                            </span>
                        </div>
                        <button onClick={shuffleQuote} className="text-white/20 hover:text-white/60 transition-colors">
                            <RefreshCw size={14} />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeQuote.text}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="min-h-[120px] flex items-center justify-center"
                        >
                            <p className="font-serif text-2xl md:text-3xl text-center text-white/80 leading-relaxed italic">
                                "{activeQuote.text}"
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Lock Box */}
                <div
                    onClick={handleCapsuleClick}
                    className="md:col-span-1 p-10 rounded-[2rem] border border-white/5 hover:border-rose-500/20 transition-colors cursor-pointer group flex flex-col justify-between"
                    style={{ background: 'rgba(0,0,0,0.2)' }}
                >
                    <div className="flex justify-between items-start">
                        <Lock size={20} className="text-white/30 group-hover:text-rose-400 transition-colors" />
                        <span className="text-[9px] font-mono text-white/20">{CAPSULE_UNLOCK_DATE}</span>
                    </div>

                    <div>
                        <h3 className="text-xl font-serif text-white/80 mb-2">Time Capsule</h3>
                        <p className="text-sm text-white/40 leading-relaxed">
                            A message from the past, waiting for the stars to align.
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
