"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { Home, Mail, Calendar, Quote, Sparkles, ChevronRight, BookOpen, Wind } from "lucide-react";
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

// --- Page ---

import { haikuCollection } from "@/data/guestNo28Haikus";

export default function GuestNo28Dashboard() {
    const [mounted, setMounted] = useState(false);
    const [greeting, setGreeting] = useState("");
    const [dateString, setDateString] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [dailyHaiku, setDailyHaiku] = useState(haikuCollection[0]);

    useEffect(() => {
        setMounted(true);

        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Daily Haiku Logic
        const startEpoch = new Date("2025-01-01").getTime();
        const today = new Date().getTime();
        const daysSince = Math.floor((today - startEpoch) / (1000 * 60 * 60 * 24));
        const haikuIndex = Math.abs(daysSince) % haikuCollection.length;
        setDailyHaiku(haikuCollection[haikuIndex]);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!mounted) return null;

    const baseCardStyle = {
        transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        position: "relative" as "relative",
    };

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

            {/* Individual Watercolor Sketches */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4, y: [0, -15, 0], rotate: [-10, -5, -10] }}
                transition={{ opacity: { duration: 1 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
                style={{ position: "fixed", top: "5%", left: "8%", width: "150px", height: "150px", zIndex: 1, pointerEvents: "none" }}
            >
                <Image src="/detail_lavender.png" alt="" fill style={{ objectFit: 'contain' }} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.3, y: [0, 10, 0], rotate: [15, 20, 15] }}
                transition={{ opacity: { duration: 1, delay: 0.2 }, y: { duration: 8, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 9, repeat: Infinity, ease: "easeInOut" } }}
                style={{ position: "fixed", top: "45%", right: "8%", width: "120px", height: "120px", zIndex: 1, pointerEvents: "none" }}
            >
                <Image src="/detail_rose.png" alt="" fill style={{ objectFit: 'contain' }} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.35, y: [0, -8, 0], rotate: [-5, 0, -5] }}
                transition={{ opacity: { duration: 1, delay: 0.4 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
                style={{ position: "fixed", bottom: "15%", left: "5%", width: "140px", height: "140px", zIndex: 1, pointerEvents: "none" }}
            >
                <Image src="/detail_leaf.png" alt="" fill style={{ objectFit: 'contain' }} />
            </motion.div>

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
                style={{ position: "fixed", top: "2%", right: "5%", width: "45vh", height: "45vh", zIndex: 1, pointerEvents: "none", mixBlendMode: "multiply" }}
            >
                <Image src="/hijabi_details.png" alt="Detailed Personal Sketch" fill style={{ objectFit: 'contain' }} />
            </motion.div>
            <div style={{ position: "fixed", inset: 0, opacity: 0.4, pointerEvents: "none", backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", zIndex: 5 }} />

            <main style={{ position: "relative", zIndex: 10, padding: isMobile ? "2rem 0" : "3rem 0" }}>
                <Container>
                    <div style={{ marginBottom: "2.5rem" }}>
                        <Link href="/" style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: "44px", height: "44px", background: "#fff", border: "2px solid #5a5a5a",
                            boxShadow: "2px 2px 0px #5a5a5a", borderRadius: "12px", color: "#5a5a5a", transition: "all 0.2s ease"
                        }}>
                            <Home size={22} strokeWidth={2} />
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        style={{ marginBottom: isMobile ? "4rem" : "15vh", textAlign: "center", position: "relative" }}
                    >
                        {/* Decorative 'Stamp' Date */}
                        <div style={{
                            display: "inline-block",
                            border: "1px solid #a0907d",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                            color: "#a0907d",
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                            marginBottom: "1.5rem",
                            background: "rgba(255,255,255,0.5)"
                        }}>
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>

                        <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", fontWeight: 700, color: "#2d2d2d", lineHeight: 1.1, fontFamily: "'Crimson Pro', serif" }}>
                            Selamat Datang, <br />
                            <span style={{
                                fontFamily: "cursive, 'Brush Script MT', 'Dancing Script'",
                                color: "#d2691e",
                                fontSize: "1.1em",
                                transform: "rotate(-2deg) translateY(4px)",
                                display: "inline-block",
                                marginTop: "0.5rem"
                            }}>
                                Tamu Ke-28.
                            </span>
                        </h1>

                        <p style={{ marginTop: "1.5rem", fontSize: "1.1rem", color: "#666", fontStyle: "italic", maxWidth: "500px", marginInline: "auto" }}>
                            "Ruang ini dirawat oleh waktu, khusus untuk menyambutmu."
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
                            gap: isMobile ? "2rem" : "3.5rem",
                            marginBottom: "2.5rem",
                            position: "relative",
                            zIndex: 20
                        }}>

                        <Link href="/guest/no28/letter" style={{ textDecoration: "none" }}>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, y: -5, rotate: -1, boxShadow: "0 15px 30px rgba(0,0,0,0.12)" }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    ...baseCardStyle,
                                    height: "320px",
                                    padding: "2.2rem 1.8rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    background: "#ffffff",
                                    backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #fdfbf8 28px)",
                                    borderRadius: "4px 8px 4px 12px",
                                    border: "1px solid #dcdde1",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                    opacity: 1
                                }}
                            >
                                <WashiTape color="#e6af2e" rotate="-3deg" width="110px" />
                                <div style={{ position: "absolute", bottom: "10px", right: "10px", width: "120px", height: "120px", opacity: 0.6, transform: "rotate(10deg)", pointerEvents: "none", zIndex: 0, mixBlendMode: "multiply" }}>
                                    <Image src="/sage_sketch.png" alt="" fill style={{ objectFit: "contain" }} />
                                </div>
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <div style={{ width: "45px", height: "45px", border: "1.5px solid #5a5a5a", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", transform: "rotate(-5deg)", boxShadow: "2px 2px 0 #5a5a5a" }}>
                                        <Mail size={22} color="#5a5a5a" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <h3 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#333", fontFamily: "'Crimson Pro', serif" }}>Sepucuk Surat</h3>
                                    <p style={{ color: "#666", fontStyle: "italic", fontSize: "0.9rem", marginTop: "2px" }}>"Tinta yang baru saja mengering..."</p>
                                </div>
                            </motion.div>
                        </Link>

                        <Link href="/guest/no28/special_day" style={{ textDecoration: "none" }}>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, y: -5, rotate: 2, boxShadow: "0 15px 30px rgba(0,0,0,0.12)" }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    ...baseCardStyle,
                                    height: "320px",
                                    padding: "2.2rem 1.8rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    background: "#ffffff",
                                    borderRadius: "4px 12px 4px 8px",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                    border: "1px solid #dcdde1",
                                    opacity: 1
                                }}
                            >
                                <WashiTape color="#ff9f1c" rotate="2deg" width="100px" />
                                <div style={{ position: "absolute", top: "15%", right: "10px", width: "130px", height: "130px", opacity: 0.5, transform: "rotate(-10deg)", pointerEvents: "none", zIndex: 0, mixBlendMode: "multiply" }}>
                                    <Image src="/detail_rose.png" alt="" fill style={{ objectFit: "contain" }} />
                                </div>
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <div style={{ width: "45px", height: "45px", border: "1.5px solid #5a5a5a", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", transform: "rotate(4deg)", boxShadow: "2px 2px 0 #5a5a5a" }}>
                                        <BookOpen size={22} color="#5a5a5a" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <h3 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#333", fontFamily: "'Crimson Pro', serif" }}>Lembaran Kisah</h3>
                                    <p style={{ color: "#888", fontStyle: "italic", fontSize: "0.9rem", marginTop: "2px" }}>"Setiap detiknya adalah puisi yang kau tulis tanpa kata."</p>
                                </div>
                            </motion.div>
                        </Link>

                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -5, rotate: -0.5, boxShadow: "0 15px 30px rgba(0,0,0,0.12)" }}
                            style={{
                                ...baseCardStyle,
                                height: isMobile ? "auto" : "320px",
                                padding: "1.8rem",
                                background: "#ffffff",
                                border: "1px solid #dcdde1",
                                borderLeft: "6px solid #d2691e",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                borderRadius: "4px 8px 12px 4px",
                                opacity: 1
                            }}
                        >
                            <WashiTape color="#b2c6bf" rotate="1deg" width="60px" />
                            <div style={{ position: "absolute", top: "5px", right: "5px", width: "100px", height: "100px", opacity: 0.6, transform: "rotate(-15deg)", pointerEvents: "none", zIndex: 0, mixBlendMode: "multiply" }}>
                                <Image src="/lavender_sketch.png" alt="" fill style={{ objectFit: "contain" }} />
                            </div>
                            <div style={{ position: "relative", zIndex: 1 }}>
                                <SectionTitle icon={Sparkles}>Haiku Kecil</SectionTitle>
                                <div style={{ marginTop: "1rem" }}>
                                    <HandwrittenNote style={{ fontSize: "1.25rem", color: "#4e4439", display: "block", marginBottom: "0.3rem" }}>
                                        {dailyHaiku.line1}
                                    </HandwrittenNote>
                                    <HandwrittenNote style={{ fontSize: "1.25rem", color: "#4e4439", display: "block", marginBottom: "0.3rem" }}>
                                        {dailyHaiku.line2}
                                    </HandwrittenNote>
                                    <HandwrittenNote style={{ fontSize: "1.25rem", color: "#4e4439", display: "block" }}>
                                        {dailyHaiku.line3}
                                    </HandwrittenNote>
                                </div>
                            </div>
                            <div style={{ position: "absolute", bottom: "1rem", right: "1rem", opacity: 0.2 }}>
                                <Wind size={20} color="#a0907d" />
                            </div>
                            {/* Torn paper edge effect via CSS mask or image would go here, simplified for now */}
                        </motion.div>



                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 1.5, duration: 2 }}
                        style={{ textAlign: "center", marginTop: "5rem", marginBottom: "2rem" }}
                    >
                        <HandwrittenNote style={{ fontSize: "1rem", color: "#a0907d" }}>
                            Sekadar pengingat kecil, bahwa keberadaanmu adalah alasan ruang ini ada.
                        </HandwrittenNote>
                    </motion.div>
                </Container>
            </main>
        </div>
    );
}
