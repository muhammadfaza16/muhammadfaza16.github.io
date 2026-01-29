"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, Variants, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Home, Mail, Calendar, Quote, Sparkles, ChevronRight, BookOpen, Wind, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";

// --- Components ---

const HandwrittenNote = ({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <span style={{
        fontFamily: "'Caveat', cursive, 'Brush Script MT'",
        color: "#a0907d",
        fontSize: "1.2rem",
        display: "inline-block",
        lineHeight: 1.2,
        ...style
    }}>
        {children}
    </span>
);

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.8rem" }}>
        {Icon && <Icon size={14} color="#a0907d" style={{ opacity: 0.8 }} />}
        <h3 style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a0907d", textTransform: "uppercase", letterSpacing: "2.5px" }}>{children}</h3>
    </div>
);

const WashiTape = ({ color, rotate = "0deg", width = "90px" }: { color: string, rotate?: string, width?: string }) => (
    <div style={{
        position: "absolute",
        top: "-12px",
        left: "50%",
        transform: `translateX(-50%) rotate(${rotate})`,
        width: width,
        height: "24px",
        backgroundColor: color,
        opacity: 1,
        zIndex: 100,
        boxShadow: "0 2px 4px rgba(0,0,0,0.18)",
        borderRadius: "2px",
    }}>
        <div style={{ width: "100%", height: "100%", opacity: 0.08, background: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }} />
    </div>
);

const NoiseOverlay = () => (
    <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 50, opacity: 0.07,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        mixBlendMode: "overlay"
    }} />
);

const FloatingParticles = () => {
    const particles = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, size: Math.random() * 4 + 2, duration: Math.random() * 20 + 10, delay: Math.random() * 5
    })), []);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            {particles.map((p: any) => (
                <motion.div key={p.id} animate={{ y: [0, -100, 0], opacity: [0, 0.4, 0], scale: [0.8, 1.2, 0.8] }} transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
                    style={{ position: "absolute", left: p.left, top: p.top, width: p.size, height: p.size, borderRadius: "50%", background: "#d2691e", filter: "blur(1px)" }} />
            ))}
        </div>
    );
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
};

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

import { haikuCollection } from "@/data/guestNo28Haikus";

export default function GuestNo28Dashboard() {
    const [mounted, setMounted] = useState(false);
    const [greeting, setGreeting] = useState("");
    const [subtext, setSubtext] = useState("");
    const [displayedSubtext, setDisplayedSubtext] = useState("");
    const [dateString, setDateString] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [dailyHaiku, setDailyHaiku] = useState(haikuCollection[0]);

    // New interactive states
    const [showSecretMessage, setShowSecretMessage] = useState(false);
    const [haikuRevealed, setHaikuRevealed] = useState(false);
    const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
    const [longPressHearts, setLongPressHearts] = useState<{ id: number; x: number; y: number }[]>([]);
    const [pullRefreshMessage, setPullRefreshMessage] = useState("");

    // Parallax Effects
    const { scrollY } = useScroll();
    const headerParallax = useTransform(scrollY, [0, 500], [0, 200]); // Moves down 200px as we scroll 500px
    const cardsParallax = useTransform(scrollY, [0, 500], [0, -50]);  // Moves up slightly


    // Extended features
    // Extended features
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
    const SPECIAL_DATE = new Date("2026-02-09"); // Birthday or special date
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    // PIN Guard
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [pinInput, setPinInput] = useState("");
    const [pinError, setPinError] = useState(false);
    const CORRECT_PIN = "2811";

    // Check localStorage for unlock status
    useEffect(() => {
        const unlocked = localStorage.getItem("guest28_unlocked");
        if (unlocked === "true") {
            setIsUnlocked(true);
        }
    }, []);

    const handlePinSubmit = () => {
        if (pinInput === CORRECT_PIN) {
            setIsUnlocked(true);
            localStorage.setItem("guest28_unlocked", "true");
            setPinError(false);
        } else {
            setPinError(true);
            setPinInput("");
        }
    };

    const handlePinKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handlePinSubmit();
        }
    };

    useEffect(() => {
        setMounted(true);

        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Time-aware greeting and subtext
        const h = new Date().getHours();
        let greet = "Selamat malam";
        let sub = "Malam adalah waktu untuk pulang ke dirimu sendiri. Istirahatlah.";

        if (h >= 4 && h < 11) {
            greet = "Selamat pagi";
            sub = "Semoga hari ini membawamu pada hal-hal baik yang tak terduga.";
        }
        else if (h >= 11 && h < 15) {
            greet = "Selamat siang";
            sub = "Di tengah kesibukanmu, jangan lupa mengambil napas sejenak.";
        }
        else if (h >= 15 && h < 18) {
            greet = "Selamat sore";
            sub = "Terima kasih sudah berjuang sejauh ini. Kamu hebat.";
        }

        setGreeting(greet);
        setSubtext(sub);

        // Daily Haiku Logic
        const startEpoch = new Date("2025-01-01").getTime();
        const today = new Date().getTime();
        const daysSince = Math.floor((today - startEpoch) / (1000 * 60 * 60 * 24));
        const haikuIndex = Math.abs(daysSince) % haikuCollection.length;
        setDailyHaiku(haikuCollection[haikuIndex]);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Typewriter effect for subtext
    useEffect(() => {
        if (!subtext) return;
        setDisplayedSubtext("");
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedSubtext(subtext.slice(0, i));
            i++;
            if (i > subtext.length) clearInterval(interval);
        }, 35); // Slightly faster for better UX
        return () => clearInterval(interval);
    }, [subtext]);

    // Countdown timer to special date
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = SPECIAL_DATE.getTime() - now;

            if (distance > 0) {
                setCountdown({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
                });
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    // Shake detection for secret message
    useEffect(() => {
        let lastX = 0, lastY = 0, lastZ = 0;
        let lastShakeTime = 0;
        const SHAKE_THRESHOLD = 25;

        const handleMotion = (e: DeviceMotionEvent) => {
            const acc = e.accelerationIncludingGravity;
            if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

            const deltaX = Math.abs(acc.x - lastX);
            const deltaY = Math.abs(acc.y - lastY);
            const deltaZ = Math.abs(acc.z - lastZ);

            if ((deltaX > SHAKE_THRESHOLD || deltaY > SHAKE_THRESHOLD || deltaZ > SHAKE_THRESHOLD)) {
                const now = Date.now();
                if (now - lastShakeTime > 1500) { // Debounce 1.5s
                    lastShakeTime = now;
                    setShowSecretMessage(true);
                    // Vibrate if available
                    if (navigator.vibrate) navigator.vibrate(100);
                    setTimeout(() => setShowSecretMessage(false), 4000);
                }
            }
            lastX = acc.x; lastY = acc.y; lastZ = acc.z;
        };

        // Request permission on iOS 13+
        const requestPermission = async () => {
            if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
                try {
                    const permission = await (DeviceMotionEvent as any).requestPermission();
                    if (permission === 'granted') {
                        window.addEventListener('devicemotion', handleMotion);
                    }
                } catch (e) {
                    console.log('DeviceMotion permission denied');
                }
            } else {
                window.addEventListener('devicemotion', handleMotion);
            }
        };

        requestPermission();
        return () => window.removeEventListener('devicemotion', handleMotion);
    }, []);

    // Double-tap heart handler
    const handleDoubleTap = (e: React.TouchEvent | React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
        const newHeart = { id: Date.now(), x, y };
        setHearts(prev => [...prev, newHeart]);
        if (navigator.vibrate) navigator.vibrate(50);
        setTimeout(() => {
            setHearts(prev => prev.filter(h => h.id !== newHeart.id));
        }, 1000);
    };

    // Long-press easter egg handler
    let longPressTimer: NodeJS.Timeout | null = null;
    const handleLongPressStart = (e: React.TouchEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        longPressTimer = setTimeout(() => {
            if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
            // Create explosion of hearts
            const newHearts = Array.from({ length: 8 }).map((_, i) => ({
                id: Date.now() + i,
                x: centerX + (Math.random() - 0.5) * 100,
                y: centerY + (Math.random() - 0.5) * 100
            }));
            setLongPressHearts(newHearts);
            setTimeout(() => setLongPressHearts([]), 1500);
        }, 800);
    };
    const handleLongPressEnd = () => {
        if (longPressTimer) clearTimeout(longPressTimer);
    };

    // Secret messages for shake
    const secretMessages = [
        "Kamu adalah alasan halaman ini ada 💕",
        "Setiap langkahmu adalah puisi tersendiri",
        "Aku akan selalu mendoakan yang terbaik untukmu",
        "Kamu lebih indah dari yang kamu kira",
        "Terima kasih sudah menjadi kamu"
    ];
    const randomSecretMessage = useMemo(() =>
        secretMessages[Math.floor(Math.random() * secretMessages.length)]
        , [showSecretMessage]);



    if (!mounted) return null;

    // PIN Gate UI
    if (!isUnlocked) {
        return (
            <div style={{
                minHeight: "100svh",
                background: "#fdf8f1",
                backgroundImage: `
                    radial-gradient(#e5e0d8 1px, transparent 0),
                    linear-gradient(to right, rgba(0,0,0,0.01) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.01) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px, 20px 20px, 20px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                fontFamily: "'Crimson Pro', serif"
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: "#fff",
                        padding: "3rem 2.5rem",
                        borderRadius: "4px 8px 4px 10px",
                        border: "1px solid #e8e2d9",
                        boxShadow: "2px 5px 20px rgba(160, 144, 125, 0.12)",
                        textAlign: "center",
                        maxWidth: "320px",
                        position: "relative"
                    }}
                >
                    {/* Washi Tape */}
                    <div style={{
                        position: "absolute",
                        top: "-12px",
                        left: "50%",
                        transform: "translateX(-50%) rotate(-2deg)",
                        width: "80px",
                        height: "24px",
                        backgroundColor: "#b07d62",
                        opacity: 0.9,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.18)",
                        borderRadius: "2px",
                    }} />

                    <div style={{ marginBottom: "1.5rem" }}>
                        <Sparkles size={28} color="#b07d62" style={{ marginBottom: "1rem", opacity: 0.6 }} />
                        <h2 style={{ fontSize: "1.4rem", color: "#4e4439", fontWeight: 600, marginBottom: "0.5rem" }}>
                            Ruang Pribadi
                        </h2>
                        <HandwrittenNote style={{ fontSize: "1rem", opacity: 0.7 }}>
                            Masukkan 4 digit untuk melanjutkan...
                        </HandwrittenNote>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                            onKeyDown={handlePinKeyDown}
                            placeholder="• • • •"
                            style={{
                                width: "100%",
                                padding: "1rem",
                                fontSize: "1.8rem",
                                textAlign: "center",
                                letterSpacing: "0.8rem",
                                border: pinError ? "2px solid #e57373" : "1px solid #e8e2d9",
                                borderRadius: "8px",
                                background: "#faf8f5",
                                color: "#4e4439",
                                fontFamily: "'Crimson Pro', serif",
                                outline: "none",
                                transition: "border-color 0.2s"
                            }}
                        />
                        {pinError && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ color: "#e57373", fontSize: "0.85rem", marginTop: "0.5rem" }}
                            >
                                Kode tidak tepat
                            </motion.p>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePinSubmit}
                        style={{
                            width: "100%",
                            padding: "0.8rem 1.5rem",
                            background: "#b07d62",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "1rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            fontFamily: "'Crimson Pro', serif"
                        }}
                    >
                        Masuk
                    </motion.button>

                    <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "#aaa" }}>
                        Petunjuk: Tanggal lahir spesial 💫
                    </p>
                </motion.div>
            </div>
        );
    }

    const baseCardStyle = {
        transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        position: "relative" as "relative",
    };

    // Cards data for swipeable carousel
    const cards = [
        {
            title: "Sepucuk Surat",
            subtitle: '"Tinta yang baru saja mengering..."',
            href: "/guest/no28/letter",
            image: "/sketch_envelope_flower_v2.webp",
            tapeColor: "#ff6b6b"
        },
        {
            title: "Lembaran Kisah",
            subtitle: '"Setiap detiknya adalah puisi..."',
            href: "/guest/no28/special_day",
            image: "/sketch_maryjane_shoes.webp",
            tapeColor: "#4ecdc4"
        }
    ];

    return (
        <div style={{
            background: "#fdf8f1",
            backgroundImage: `
                radial-gradient(#e5e0d8 1px, transparent 0),
                linear-gradient(to right, rgba(0,0,0,0.01) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.01) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px, 20px 20px, 20px 20px",
            minHeight: "100svh",
            color: "#444",
            fontFamily: "'Crimson Pro', serif, -apple-system",
            position: "relative",
            overflowX: "hidden",
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)"
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />

            {/* Ambient Background Elements */}
            <NoiseOverlay />
            <FloatingParticles />
            <FallingPetals />
            <Butterflies />

            {/* Hidden Audio Element - Moved to Layout */}


            {/* Secret Message Overlay (Shake to Reveal) */}
            <AnimatePresence>
                {showSecretMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(253, 248, 241, 0.95)",
                            zIndex: 9999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "2rem"
                        }}
                        onClick={() => setShowSecretMessage(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 20 }}
                            style={{
                                textAlign: "center",
                                maxWidth: "300px"
                            }}
                        >
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                                style={{ fontSize: "3rem", marginBottom: "1rem" }}
                            >
                                💕
                            </motion.div>
                            <p style={{
                                fontFamily: "'Caveat', cursive",
                                fontSize: "1.8rem",
                                color: "#b07d62",
                                lineHeight: 1.4
                            }}>
                                {randomSecretMessage}
                            </p>
                            <p style={{
                                fontSize: "0.8rem",
                                color: "#a0907d",
                                marginTop: "1rem",
                                opacity: 0.7
                            }}>
                                (tap to close)
                            </p>
                        </motion.div>
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

            {/* Subtle Decorative Sketches - Enabled on all screens, reduced for subtlety */}
            <>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isMobile ? 0.25 : 0.35, y: [0, -12, 0], rotate: [-8, -3, -8] }}
                    transition={{ opacity: { duration: 1 }, y: { duration: 8, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" } }}
                    style={{ position: "fixed", top: "8%", left: isMobile ? "3%" : "8%", width: isMobile ? "100px" : "130px", height: isMobile ? "100px" : "130px", zIndex: 1, pointerEvents: "none" }}
                >
                    <Image src="/detail_lavender.webp" alt="" fill style={{ objectFit: 'contain' }} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isMobile ? 0.2 : 0.3, y: [0, -8, 0], rotate: [-5, 0, -5] }}
                    transition={{ opacity: { duration: 1, delay: 0.3 }, y: { duration: 9, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 11, repeat: Infinity, ease: "easeInOut" } }}
                    style={{ position: "fixed", bottom: "18%", right: isMobile ? "3%" : "6%", width: isMobile ? "90px" : "120px", height: isMobile ? "90px" : "120px", zIndex: 1, pointerEvents: "none" }}
                >
                    <Image src="/detail_leaf.webp" alt="" fill style={{ objectFit: 'contain' }} />
                </motion.div>
            </>

            {/* Detailed Artistic Hijabi Sketch (Backview) - Relocated to Top */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                    opacity: 0.2,
                    y: [0, -10, 0],
                    rotate: [-2, 2, -2]
                }}
                transition={{
                    opacity: { duration: 1.5 },
                    y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ position: "fixed", top: "15%", right: "5%", width: "45vh", height: "45vh", zIndex: 1, pointerEvents: "none", mixBlendMode: "multiply" }}
            >
                <Image src="/hijabi_details.webp" alt="Detailed Personal Sketch" fill style={{ objectFit: 'contain' }} />
            </motion.div>
            <div style={{ position: "fixed", inset: 0, opacity: 0.4, pointerEvents: "none", backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", zIndex: 5 }} />

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "2rem 0" : "3rem 0" }}>
                <Container>
                    <div style={{ marginBottom: "2.5rem" }}>
                        <Link href="/guest" style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: "44px", height: "44px", background: "#fff", border: "2px solid #5a5a5a",
                            boxShadow: "2px 2px 0px #5a5a5a", borderRadius: "12px", color: "#5a5a5a", transition: "all 0.2s ease"
                        }}>
                            <ArrowLeft size={22} strokeWidth={2} />
                        </Link>
                    </div>

                    <motion.div style={{ y: headerParallax }}>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            style={{ marginBottom: isMobile ? "4rem" : "15vh", textAlign: "center", position: "relative" }}
                        >
                            {/* Watercolor Splash Behind Text */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.8, scale: 1 }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: "350px",
                                    height: "350px",
                                    zIndex: -1,
                                    pointerEvents: "none",
                                    mixBlendMode: "multiply",
                                    maskImage: "radial-gradient(circle, black 40%, transparent 70%)",
                                    WebkitMaskImage: "radial-gradient(circle, black 40%, transparent 70%)"
                                }}
                            >
                                <Image src="/watercolor_splash.webp" alt="" fill style={{ objectFit: "contain" }} priority />
                            </motion.div>

                            {/* Minimalist Date Display */}
                            <div style={{
                                fontFamily: "'Crimson Pro', serif",
                                fontSize: "0.9rem",
                                color: "#8a7058",
                                textTransform: "uppercase",
                                letterSpacing: "3px",
                                marginBottom: "1rem",
                                opacity: 0.9,
                                fontWeight: 600
                            }}>
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>

                            <h1 style={{ fontSize: "clamp(3rem, 10vw, 4.5rem)", fontWeight: 500, color: "#2d2d2d", lineHeight: 1.1, fontFamily: "'Playfair Display', serif", fontStyle: "italic", marginBottom: "0.5rem" }}>
                                {greeting},
                            </h1>
                            <h2 style={{ fontSize: "2.2rem", fontWeight: 400, color: "#b07d62", fontFamily: "'Caveat', cursive", marginTop: "0" }}>
                                untukmu pemilik angka 28
                            </h2>

                            <p style={{ marginTop: "1.5rem", fontSize: "1.1rem", color: "#666", fontStyle: "italic", maxWidth: "500px", marginInline: "auto", minHeight: "3em" }}>
                                "{displayedSubtext}"
                            </p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        style={{
                            display: isMobile ? "flex" : "grid",
                            flexDirection: isMobile ? "column" : undefined,
                            gridTemplateColumns: isMobile ? "none" : "repeat(auto-fit, minmax(260px, 1fr))",
                            gap: isMobile ? "2rem" : "3.5rem",
                            marginBottom: "2.5rem",
                            position: "relative",
                            zIndex: 20
                        }}>

                        <Link href="/guest/no28/letter" scroll={false} style={{ textDecoration: "none", width: isMobile ? "92%" : "auto", alignSelf: isMobile ? "flex-start" : "auto", display: "block" }}>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, y: -5, rotate: -1, boxShadow: "0 15px 30px rgba(0,0,0,0.12)" }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    ...baseCardStyle,
                                    height: "320px",
                                    padding: "2rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center", // Center content vertically
                                    alignItems: "center",     // Center content horizontally
                                    background: "#ffffff",
                                    backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png'), repeating-linear-gradient(transparent, transparent 27px, #fdfbf8 28px)",
                                    borderRadius: "4px 8px 4px 12px",
                                    border: "1px solid #dcdde1",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                    opacity: 1,
                                    textAlign: "center"
                                }}
                            >
                                <WashiTape color="#ff6b6b" rotate="-3deg" width="110px" />

                                {/* Central Sketch Illustration */}
                                <div style={{ position: "relative", width: "200px", height: "150px", marginBottom: "1rem", marginTop: "1rem", mixBlendMode: "multiply" }}>
                                    <Image src="/sketch_envelope_flower_v2.webp" alt="Vintage Envelope Sketch" fill style={{ objectFit: "contain" }} />
                                </div>

                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <h3 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#333", fontFamily: "'Crimson Pro', serif" }}>Sepucuk Surat</h3>
                                    <p style={{ fontFamily: "'Caveat', cursive", color: "#8a7058", fontSize: "1.2rem", marginTop: "4px" }}>"Tinta yang baru saja mengering..."</p>
                                </div>
                            </motion.div>
                        </Link>

                        <Link href="/guest/no28/special_day" scroll={false} style={{ textDecoration: "none", width: isMobile ? "92%" : "auto", alignSelf: isMobile ? "flex-end" : "auto", display: "block" }}>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, y: -5, rotate: 2, boxShadow: "0 15px 30px rgba(0,0,0,0.12)" }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    ...baseCardStyle,
                                    height: "320px",
                                    padding: "2rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    background: "#ffffff",
                                    backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
                                    borderRadius: "4px 12px 4px 8px",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                    border: "1px solid #dcdde1",
                                    opacity: 1,
                                    textAlign: "center"
                                }}
                            >
                                <WashiTape color="#4ecdc4" rotate="2deg" width="100px" />

                                {/* Central Sketch Illustration */}
                                <div style={{ position: "relative", width: "210px", height: "180px", marginBottom: "1rem", marginTop: "1rem", mixBlendMode: "multiply", transform: "rotate(-2deg)" }}>
                                    <Image src="/sketch_gift_box.webp" alt="Vintage Gift Box Sketch" fill style={{ objectFit: "contain" }} />
                                </div>

                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <h3 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#333", fontFamily: "'Crimson Pro', serif" }}>Bingkisan Kecil Untukmu</h3>
                                    <p style={{ fontFamily: "'Caveat', cursive", color: "#8a7058", fontSize: "1.1rem", marginTop: "4px" }}>"...sebagai bukti bahwa kamu selalu terlihat."</p>
                                </div>
                            </motion.div>
                        </Link>

                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -5, rotate: -0.5, boxShadow: "0 15px 30px rgba(0,0,0,0.12)" }}
                            onTouchStart={handleLongPressStart}
                            onTouchEnd={handleLongPressEnd}
                            onDoubleClick={handleDoubleTap}
                            onClick={() => !haikuRevealed && setHaikuRevealed(true)}
                            style={{
                                ...baseCardStyle,
                                height: isMobile ? "auto" : "320px",
                                minHeight: "200px",
                                padding: "1.8rem",
                                background: "#ffffff",
                                border: "1px solid #dcdde1",
                                borderLeft: "6px solid #d2691e",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                borderRadius: "4px 8px 12px 4px",
                                opacity: 1,
                                width: isMobile ? "96%" : "auto",
                                alignSelf: isMobile ? "center" : "auto",
                                cursor: "pointer"
                            }}
                        >
                            <WashiTape color="#a06cd5" rotate="1deg" width="60px" />

                            {/* Long-press heart explosion overlay */}
                            {longPressHearts.map(heart => (
                                <motion.div
                                    key={heart.id}
                                    initial={{ scale: 0, opacity: 1 }}
                                    animate={{ scale: 2, opacity: 0, y: -50 }}
                                    transition={{ duration: 1 }}
                                    style={{
                                        position: "absolute",
                                        left: heart.x,
                                        top: heart.y,
                                        fontSize: "2rem",
                                        pointerEvents: "none",
                                        zIndex: 100
                                    }}
                                >
                                    💕
                                </motion.div>
                            ))}

                            <div style={{ position: "absolute", top: "5px", right: "5px", width: "100px", height: "100px", opacity: 0.6, transform: "rotate(-15deg)", pointerEvents: "none", zIndex: 0, mixBlendMode: "multiply" }}>
                                <Image src="/lavender_sketch.webp" alt="" fill style={{ objectFit: "contain" }} />
                            </div>
                            <div style={{ position: "relative", zIndex: 1 }}>
                                <SectionTitle icon={Sparkles}>Haiku Kecil</SectionTitle>

                                {/* Tap to reveal prompt */}
                                {!haikuRevealed && (
                                    <motion.p
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{
                                            fontFamily: "'Caveat', cursive",
                                            fontSize: "1rem",
                                            color: "#a0907d",
                                            marginTop: "1rem",
                                            textAlign: "center"
                                        }}
                                    >
                                        ✨ tap untuk membaca...
                                    </motion.p>
                                )}

                                {/* Animated Haiku Lines (letter by letter) */}
                                {haikuRevealed && (
                                    <div style={{ marginTop: "1rem" }}>
                                        {[dailyHaiku.line1, dailyHaiku.line2, dailyHaiku.line3].map((line, lineIndex) => (
                                            <div key={lineIndex} style={{ marginBottom: "0.3rem" }}>
                                                {line.split("").map((char, charIndex) => (
                                                    <motion.span
                                                        key={charIndex}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{
                                                            delay: (lineIndex * line.length + charIndex) * 0.03,
                                                            duration: 0.3
                                                        }}
                                                        style={{
                                                            fontFamily: "'Caveat', cursive",
                                                            fontSize: "1.25rem",
                                                            color: "#4e4439",
                                                            display: "inline-block"
                                                        }}
                                                    >
                                                        {char === " " ? "\u00A0" : char}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div style={{ position: "absolute", bottom: "1rem", right: "1rem", opacity: 0.2 }}>
                                <Wind size={20} color="#a0907d" />
                            </div>
                        </motion.div>



                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ delay: 1.5, duration: 2 }}
                        style={{ textAlign: "center", marginTop: "5rem", marginBottom: "1rem" }}
                    >
                        <HandwrittenNote style={{ fontSize: "1rem", color: "#a0907d" }}>
                            Sekadar pengingat kecil, bahwa keberadaanmu adalah alasan ruang ini ada.
                        </HandwrittenNote>
                    </motion.div>


                </Container>
            </main >
        </div >
    );
}
