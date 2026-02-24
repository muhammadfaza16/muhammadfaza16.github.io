"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Home, Mail, Calendar, Quote, Sparkles, ChevronRight, BookOpen, Wind, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { useTheme } from "@/components/guest/no28/ThemeContext";

// --- Watercolor Components ---

const HandwrittenText = ({ children, style = {}, className = "" }: { children: React.ReactNode, style?: React.CSSProperties, className?: string }) => (
    <span
        className={`font-handwriting ${className}`}
        style={{
            fontSize: "1.25rem",
            display: "inline-block",
            lineHeight: 1.2,
            ...style
        }}
    >
        {children}
    </span>
);

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => {
    const { tokens } = useTheme();
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            {Icon && <Icon size={16} color={tokens.textAccent} style={{ opacity: 0.7 }} />}
            <h3 className="font-serif-display" style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: tokens.textSecondary,
                textTransform: "uppercase",
                letterSpacing: "3px"
            }}>
                {children}
            </h3>
        </div>
    );
};

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
                        position: "absolute",
                        left: drop.left,
                        top: "-20px",
                        width: drop.size,
                        height: drop.size,
                        borderRadius: "50%",
                        background: drop.color,
                        filter: `blur(${drop.blur}px)`,
                        opacity: 0.4,
                        animation: `wc-paint-drop ${drop.duration}s linear ${drop.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
};

const FloatingMist = () => (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <motion.div
            animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3],
                x: [-20, 20, -20]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            style={{
                position: "absolute",
                top: "10%",
                right: "-5%",
                width: "500px",
                height: "500px",
                background: "radial-gradient(circle, var(--wc-wash-blue-light) 0%, transparent 70%)",
                filter: "blur(80px)"
            }}
        />
        <motion.div
            animate={{
                scale: [1, 1.15, 1],
                opacity: [0.35, 0.45, 0.35],
                x: [20, -20, 20]
            }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{
                position: "absolute",
                bottom: "5%",
                left: "-5%",
                width: "600px",
                height: "600px",
                background: "radial-gradient(circle, var(--wc-wash-rose-light) 0%, transparent 70%)",
                filter: "blur(90px)"
            }}
        />
    </div>
);

// --- Page Logic ---

import { haikuCollection } from "@/data/guestNo28Haikus";

export default function GuestNo28Dashboard() {
    const { tokens, mode } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [greeting, setGreeting] = useState("");
    const [subtext, setSubtext] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [dailyHaiku, setDailyHaiku] = useState(haikuCollection[0]);

    const [showSecretMessage, setShowSecretMessage] = useState(false);
    const [haikuRevealed, setHaikuRevealed] = useState(false);
    const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
    const [longPressHearts, setLongPressHearts] = useState<{ id: number; x: number; y: number }[]>([]);

    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
    const SPECIAL_DATE = new Date("2026-11-28");

    const [isUnlocked, setIsUnlocked] = useState(false);
    const [pinInput, setPinInput] = useState("");
    const [pinError, setPinError] = useState(false);
    const CORRECT_PIN = "2811";

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
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
    };

    const handlePinKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handlePinSubmit();
    };

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const h = new Date().getHours();
        let greet = "Selamat malam";
        let sub = "Malam adalah waktu untuk pulang ke dirimu sendiri. Istirahatlah.";

        if (h >= 4 && h < 11) {
            greet = "Selamat pagi";
            sub = "Semoga hari ini membawamu pada hal-hal baik yang tak terduga.";
        } else if (h >= 11 && h < 15) {
            greet = "Selamat siang";
            sub = "Di tengah kesibukanmu, jangan lupa mengambil napas sejenak.";
        } else if (h >= 15 && h < 18) {
            greet = "Selamat sore";
            sub = "Terima kasih sudah berjuang sejauh ini. Kamu hebat.";
        }

        setGreeting(greet);
        setSubtext(sub);

        const startEpoch = new Date("2025-01-01").getTime();
        const today = new Date().getTime();
        const daysSince = Math.floor((today - startEpoch) / (1000 * 60 * 60 * 24));
        const haikuIndex = Math.abs(daysSince) % haikuCollection.length;
        setDailyHaiku(haikuCollection[haikuIndex]);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        const interval = setInterval(updateCountdown, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let lastX = 0, lastY = 0, lastZ = 0;
        let lastShakeTime = 0;
        const SHAKE_THRESHOLD = 30;

        const handleMotion = (e: DeviceMotionEvent) => {
            const acc = e.accelerationIncludingGravity;
            if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

            const deltaX = Math.abs(acc.x - lastX);
            const deltaY = Math.abs(acc.y - lastY);
            const deltaZ = Math.abs(acc.z - lastZ);

            if ((deltaX > SHAKE_THRESHOLD || deltaY > SHAKE_THRESHOLD || deltaZ > SHAKE_THRESHOLD)) {
                const now = Date.now();
                if (now - lastShakeTime > 2000) {
                    lastShakeTime = now;
                    setShowSecretMessage(true);
                    if (navigator.vibrate) navigator.vibrate(100);
                    setTimeout(() => setShowSecretMessage(false), 5000);
                }
            }
            lastX = acc.x; lastY = acc.y; lastZ = acc.z;
        };

        const requestPermission = async () => {
            if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
                try {
                    const permission = await (DeviceMotionEvent as any).requestPermission();
                    if (permission === 'granted') window.addEventListener('devicemotion', handleMotion);
                } catch (e) { console.log('Permission denied'); }
            } else {
                window.addEventListener('devicemotion', handleMotion);
            }
        };

        if (isUnlocked) requestPermission();
        return () => window.removeEventListener('devicemotion', handleMotion);
    }, [isUnlocked]);

    const handleDoubleTap = (e: React.TouchEvent | React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
        const newHeart = { id: Date.now(), x, y };
        setHearts(prev => [...prev, newHeart]);
        if (navigator.vibrate) navigator.vibrate(50);
        setTimeout(() => setHearts(prev => prev.filter(h => h.id !== newHeart.id)), 1000);
    };

    let longPressTimer: NodeJS.Timeout | null = null;
    const handleLongPressStart = (e: React.TouchEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        longPressTimer = setTimeout(() => {
            if (navigator.vibrate) navigator.vibrate([50, 50, 80]);
            const newHearts = Array.from({ length: 10 }).map((_, i) => ({
                id: Date.now() + i,
                x: centerX + (Math.random() - 0.5) * 120,
                y: centerY + (Math.random() - 0.5) * 120
            }));
            setLongPressHearts(newHearts);
            setTimeout(() => setLongPressHearts([]), 1500);
        }, 700);
    };
    const handleLongPressEnd = () => { if (longPressTimer) clearTimeout(longPressTimer); };

    const secretMessages = [
        "Keberadaanmu adalah puisi paling indah 💕",
        "Terima kasih sudah memilih untuk terus melangkah",
        "Mekar lah sesuai waktumu, jangan terburu-buru",
        "Kamu lebih kuat dari yang terlihat, lebih baik dari yang kau kira",
        "Setiap coretan di sini ada hanya untukmu"
    ];
    const randomSecretMessage = useMemo(() => secretMessages[Math.floor(Math.random() * secretMessages.length)], [showSecretMessage]);

    if (!mounted) return null;

    // --- PIN GATE UI ---
    if (!isUnlocked) {
        return (
            <div className="bg-wc-canvas" style={{
                minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center",
                padding: "2rem", backgroundImage: tokens.pageBgDots, backgroundSize: tokens.pageBgSize
            }}>
                <FloatingMist />
                <AmbientPaintDrops />

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="wc-card" style={{
                    padding: "3.5rem 2.5rem", textAlign: "center", maxWidth: "340px", border: `1px solid ${tokens.cardBorder}`,
                }}>
                    <WashStripe type="ochre" />

                    <div style={{ marginBottom: "2rem", position: "relative", zIndex: 1 }}>
                        <Sparkles size={32} color={tokens.textAccent} style={{ marginBottom: "1.2rem", opacity: 0.5 }} />
                        <h2 className="font-serif-display" style={{ fontSize: "1.5rem", color: tokens.textPrimary, fontWeight: 600, marginBottom: "0.5rem" }}>
                            Ruang Kontemplasi
                        </h2>
                        <HandwrittenText style={{ color: tokens.textSecondary, fontSize: "1.1rem" }}>
                            Silakan masukkan angka...
                        </HandwrittenText>
                    </div>

                    <div style={{ marginBottom: "2rem", position: "relative", zIndex: 1 }}>
                        <input
                            type="password" inputMode="numeric" maxLength={4}
                            value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                            onKeyDown={handlePinKeyDown} placeholder="• • • •"
                            className="font-serif-display wc-scrollbar"
                            style={{
                                width: "100%", padding: "1.2rem", fontSize: "1.8rem", textAlign: "center", letterSpacing: "0.8rem",
                                border: pinError ? "2px solid #e57373" : `1px solid ${tokens.dividerColor}`,
                                borderRadius: "12px", background: tokens.pageBg, color: tokens.textPrimary, outline: "none", transition: "all 0.3s var(--wc-ease)"
                            }}
                        />
                        <AnimatePresence>
                            {pinError && (
                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: "#e57373", fontSize: "0.85rem", marginTop: "0.8rem" }}>
                                    Belum tepat, coba lagi...
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={handlePinSubmit}
                        style={{
                            width: "100%", padding: "1rem", background: tokens.accent, color: "#fff", border: "none",
                            borderRadius: "10px", fontSize: "1.1rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(176, 125, 98, 0.2)"
                        }}
                    >
                        Buka Pintu
                    </motion.button>

                    <p className="font-handwriting" style={{ marginTop: "2rem", fontSize: "0.95rem", color: tokens.textMuted, opacity: 0.7 }}>
                        Petunjuk: Tanggal kelahiran yang spesial ✨
                    </p>
                </motion.div>
            </div>
        );
    }

    // --- MAIN DASHBOARD UI ---
    return (
        <div className="bg-wc-canvas wc-scrollbar" style={{
            minHeight: "100svh", backgroundImage: tokens.pageBgDots, backgroundSize: tokens.pageBgSize,
            color: tokens.textPrimary, position: "relative", overflowX: "hidden"
        }}>
            <FloatingMist />
            <AmbientPaintDrops />

            <AnimatePresence>
                {showSecretMessage && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: "fixed", inset: 0, background: tokens.overlayBg,
                            zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem"
                        }}
                        onClick={() => setShowSecretMessage(false)}
                    >
                        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} style={{ textAlign: "center", maxWidth: "320px" }}>
                            <motion.div animate={{ rotate: [0, -15, 15, -10, 0] }} transition={{ duration: 0.6 }} style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>🌸</motion.div>
                            <p className="font-handwriting" style={{ fontSize: "2rem", color: tokens.textAccent, lineHeight: 1.3 }}>{randomSecretMessage}</p>
                            <p style={{ fontSize: "0.8rem", color: tokens.textMuted, marginTop: "1.5rem", letterSpacing: "2px", opacity: 0.6 }}>(KETUK UNTUK TUTUP)</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                animate={{ y: [0, -15, 0], rotate: [-5, -2, -5] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "fixed", top: "10%", left: isMobile ? "-5%" : "5%", width: "160px", height: "160px", zIndex: 2, pointerEvents: "none", opacity: 0.4, mixBlendMode: mode === "default" ? "multiply" : "screen" }}
            >
                <Image src="/watercolor_details.png" alt="" fill style={{ objectFit: 'contain' }} />
            </motion.div>

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "2rem 0" : "4rem 0" }}>
                <Container>
                    <div style={{ marginBottom: "3rem" }}>
                        <Link href="/guest" className="wc-card hover-ink-bleed" style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: "50px", height: "50px", background: tokens.cardBg, borderRadius: "14px", color: tokens.textPrimary
                        }}>
                            <ArrowLeft size={24} />
                        </Link>
                    </div>

                    <header style={{ marginBottom: isMobile ? "4rem" : "15vh", textAlign: "center", position: "relative" }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 0.65, scale: 1.15 }} transition={{ duration: 2 }}
                            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "400px", height: "400px", zIndex: -1, pointerEvents: "none", mixBlendMode: mode === "default" ? "multiply" : "screen" }}
                        >
                            <Image src="/watercolor_splash.webp" alt="" fill style={{ objectFit: "contain" }} priority />
                        </motion.div>

                        <div className="font-serif-display" style={{ fontSize: "0.85rem", color: tokens.textAccent, textTransform: "uppercase", letterSpacing: "4px", marginBottom: "1.2rem", fontWeight: 600, opacity: 0.8 }}>
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>

                        <h1 className="font-serif-display" style={{ fontSize: "clamp(3.5rem, 12vw, 5.5rem)", fontWeight: 400, color: tokens.textPrimary, lineHeight: 1, fontStyle: "italic", marginBottom: "0.5rem" }}>
                            {greeting},
                        </h1>
                        <h2 className="font-handwriting" style={{ fontSize: "2.6rem", fontWeight: 400, color: tokens.textAccent, marginTop: "-0.5rem", opacity: 0.95 }}>
                            pemilik angka dua puluh delapan
                        </h2>

                        <p style={{ marginTop: "2.5rem", fontSize: "1.2rem", color: tokens.textSecondary, fontStyle: "italic", maxWidth: "520px", marginInline: "auto", minHeight: "3.5em", lineHeight: 1.6 }}>
                            "{subtext}"
                        </p>
                    </header>

                    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.2 } } }} style={{ display: isMobile ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: isMobile ? "2.5rem" : "3.5rem", marginBottom: "5rem" }}>
                        <Link href="/guest/no28/letter" className="wc-card" style={{ textDecoration: "none", height: "350px" }}>
                            <WashStripe type="blue" />
                            <div style={{ padding: "2.5rem", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                                <div className="animate-wc-float" style={{ position: "relative", width: "180px", height: "140px", marginBottom: "1.5rem", mixBlendMode: mode === "default" ? "multiply" : "screen" }}>
                                    <Image src="/sketch_envelope_flower_v2.webp" alt="" fill style={{ objectFit: "contain" }} />
                                </div>
                                <h3 className="font-serif-display" style={{ fontSize: "1.7rem", color: tokens.textPrimary, marginBottom: "0.5rem" }}>Sepucuk Surat</h3>
                                <HandwrittenText style={{ color: tokens.textSecondary, fontSize: "1.2rem" }}>"Tinta yang baru saja mengering..."</HandwrittenText>
                            </div>
                        </Link>

                        <Link href="/guest/no28/special_day" className="wc-card" style={{ textDecoration: "none", height: "350px" }}>
                            <WashStripe type="sage" />
                            <div style={{ padding: "2.5rem", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                                <div className="animate-wc-float" style={{ animationDelay: "1s", position: "relative", width: "200px", height: "160px", marginBottom: "1rem", mixBlendMode: mode === "default" ? "multiply" : "screen" }}>
                                    <Image src="/sketch_gift_box.webp" alt="" fill style={{ objectFit: "contain" }} />
                                </div>
                                <h3 className="font-serif-display" style={{ fontSize: "1.7rem", color: tokens.textPrimary, marginBottom: "0.5rem" }}>Bingkisan Kecil</h3>
                                <HandwrittenText style={{ color: tokens.textSecondary, fontSize: "1.1rem" }}>"...sebagai bukti bahwa kamu selalu terlihat."</HandwrittenText>
                            </div>
                        </Link>

                        <motion.div className="wc-card wc-border-left" onDoubleClick={handleDoubleTap} onClick={() => !haikuRevealed && setHaikuRevealed(true)} onTouchStart={handleLongPressStart} onTouchEnd={handleLongPressEnd} style={{ height: isMobile ? "auto" : "350px", minHeight: "280px", cursor: "pointer", padding: "2.2rem" }}>
                            <WashStripe type="lavender" />
                            <AnimatePresence>
                                {hearts.map(heart => (<motion.div key={heart.id} initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2.5, opacity: 0, y: -60 }} exit={{ opacity: 0 }} style={{ position: "absolute", left: heart.x, top: heart.y, fontSize: "2rem", zIndex: 100 }}>❤️</motion.div>))}
                                {longPressHearts.map(heart => (<motion.div key={heart.id} initial={{ scale: 0, opacity: 1 }} animate={{ scale: 3, opacity: 0, y: -80 }} style={{ position: "absolute", left: heart.x, top: heart.y, fontSize: "2.5rem", zIndex: 100 }}>🌸</motion.div>))}
                            </AnimatePresence>
                            <div style={{ position: "absolute", top: "10px", right: "10px", width: "120px", height: "120px", opacity: 0.3, transform: "rotate(-10deg)", pointerEvents: "none", mixBlendMode: mode === "default" ? "multiply" : "screen" }}>
                                <Image src="/lavender_sketch.webp" alt="" fill style={{ objectFit: "contain" }} />
                            </div>
                            <div style={{ position: "relative", zIndex: 1 }}>
                                <SectionHeading icon={Wind}>Haiku Hari Ini</SectionHeading>
                                {!haikuRevealed ? (
                                    <motion.p animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }} className="font-handwriting" style={{ fontSize: "1.25rem", color: tokens.textSecondary, marginTop: "2rem", textAlign: "center" }}>(ketuk untuk membaca...)</motion.p>
                                ) : (
                                    <div style={{ marginTop: "1.5rem" }}>
                                        {[dailyHaiku.line1, dailyHaiku.line2, dailyHaiku.line3].map((line, lIdx) => (
                                            <div key={lIdx} style={{ marginBottom: "0.6rem" }}>
                                                {line.split("").map((char, cIdx) => (
                                                    <motion.span key={cIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (lIdx * 20 + cIdx) * 0.04, duration: 0.4 }} className="font-handwriting" style={{ fontSize: "1.45rem", color: tokens.textPrimary, display: "inline-block" }}>{char === " " ? "\u00A0" : char}</motion.span>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>

                    <footer style={{ textAlign: "center", marginTop: "6rem", marginBottom: "2rem", padding: "0 1rem" }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} transition={{ delay: 2, duration: 2 }}>
                            <HandwrittenText style={{ fontSize: "1.2rem", color: tokens.textSecondary, maxWidth: "420px" }}>
                                Sekadar pengingat kecil, bahwa keberadaanmu adalah alasan mengapa setiap coretan di ruang ini ada.
                            </HandwrittenText>
                        </motion.div>
                    </footer>
                </Container>
            </main>
        </div>
    );
}
