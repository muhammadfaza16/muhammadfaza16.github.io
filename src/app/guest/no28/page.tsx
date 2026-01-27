"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

        // Greeting Logic
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Selamat Pagi,");
        else if (hour < 15) setGreeting("Selamat Siang,");
        else if (hour < 18) setGreeting("Selamat Sore,");
        else setGreeting("Selamat Malam,");

        // Date String
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setDateString(date.toLocaleDateString('id-ID', options));

        // Mobile Check
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Daily Haiku Logic (Based on days since epoch to ensure persistence per day)
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

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ marginBottom: isMobile ? "6rem" : "20vh", textAlign: "center" }}>
                        <p style={{ fontSize: "1.1rem", color: "#a0907d", fontStyle: "italic", marginBottom: "0.5rem" }}>{dateString}</p>
                        <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", fontWeight: 700, color: "#2d2d2d", lineHeight: 1.1 }}>
                            {greeting}, <span style={{ fontFamily: "cursive, 'Brush Script MT', 'Dancing Script'", color: "#d2691e", fontSize: "1.25em", transform: "rotate(-2deg) translateY(4px)", display: "inline-block" }}>Tamu Ke-28.</span>
                        </h1>
                    </motion.div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: isMobile ? "2rem" : "3.5rem",
                        marginBottom: "2.5rem",
                        position: "relative",
                        zIndex: 20
                    }}>

                        <Link href="/guest/no28/letter" style={{ textDecoration: "none" }}>
                            <motion.div
                                initial={{ rotate: -2 }}
                                whileHover={{ scale: 1.02, rotate: -1 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    ...baseCardStyle,
                                    height: "280px",
                                    padding: "2.2rem 1.8rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    background: "#ffffff",
                                    backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #f5f5f5 28px)",
                                    borderRadius: "4px",
                                    border: "1px solid #dcdde1",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                    opacity: 1
                                }}
                            >
                                <WashiTape color="#e6af2e" rotate="-3deg" width="110px" />
                                <div style={{ position: "absolute", top: "10px", right: "10px", width: "80px", height: "80px", opacity: 0.8, transform: "rotate(10deg)", pointerEvents: "none" }}>
                                    <Image src="/sage_sketch.png" alt="" fill style={{ objectFit: "contain" }} />
                                </div>
                                <div style={{ width: "45px", height: "45px", border: "1.5px solid #5a5a5a", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", transform: "rotate(-5deg)", boxShadow: "2px 2px 0 #5a5a5a" }}>
                                    <Mail size={22} color="#5a5a5a" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#333", fontFamily: "'Crimson Pro', serif" }}>Sepucuk Surat</h3>
                                    <p style={{ color: "#666", fontStyle: "italic", fontSize: "0.9rem", marginTop: "2px" }}>"Tinta yang baru saja mengering..."</p>
                                </div>
                            </motion.div>
                        </Link>

                        <Link href="/guest/no28/special_day" style={{ textDecoration: "none" }}>
                            <motion.div
                                initial={{ rotate: 1, opacity: 1 }}
                                whileHover={{ scale: 1.02, rotate: 2 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    ...baseCardStyle,
                                    height: "280px",
                                    padding: "0.8rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    background: "#ffffff",
                                    borderRadius: "4px",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                    border: "1px solid #dcdde1",
                                    opacity: 1
                                }}
                            >
                                <WashiTape color="#f29bb7" rotate="-2deg" width="90px" />
                                <div style={{
                                    height: "190px",
                                    background: "#fdf8f4",
                                    marginBottom: "0.8rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    position: "relative"
                                }}>
                                    <Image src="/detail_rose.png" alt="" fill style={{ objectFit: "contain", padding: "30px", opacity: 0.8 }} />
                                    <div style={{ position: "absolute", inset: 0, border: "6px solid #fff", pointerEvents: "none" }} />
                                </div>
                                <div style={{ padding: "0 0.4rem" }}>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#333", marginBottom: "2px" }}>Narasi Hidup</h3>
                                    <HandwrittenNote style={{ fontSize: "0.85rem", color: "#a0907d" }}>"Setiap nafas yang berharga."</HandwrittenNote>
                                </div>
                            </motion.div>
                        </Link>

                        <motion.div
                            initial={{ rotate: -1, y: 10, opacity: 1 }}
                            whileHover={{ y: 5, rotate: -0.5 }}
                            style={{
                                ...baseCardStyle,
                                height: isMobile ? "auto" : "280px",
                                padding: "1.8rem",
                                background: "#ffffff",
                                border: "1px solid #dcdde1",
                                borderLeft: "6px solid #d2691e",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                opacity: 1
                            }}
                        >
                            <WashiTape color="#b2c6bf" rotate="1deg" width="60px" />
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
                            <div style={{ position: "absolute", bottom: "1rem", right: "1rem", opacity: 0.15 }}>
                                <Wind size={18} color="#a0907d" />
                            </div>
                        </motion.div>



                    </div>


                </Container>
            </main>
        </div>
    );
}
