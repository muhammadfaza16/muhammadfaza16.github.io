"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Mail, Calendar, Quote, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";

export default function GuestNo28Dashboard() {
    const [mounted, setMounted] = useState(false);
    const [greeting, setGreeting] = useState("");
    const [dateString, setDateString] = useState("");
    useEffect(() => {
        setMounted(true);
        const now = new Date();
        const hour = now.getHours();

        if (hour >= 5 && hour < 11) setGreeting("Selamat Pagi");
        else if (hour >= 11 && hour < 15) setGreeting("Selamat Siang");
        else if (hour >= 15 && hour < 18) setGreeting("Selamat Sore");
        else setGreeting("Selamat Malam");

        setDateString(now.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }));
    }, []);

    if (!mounted) return null;

    const WashiTape = ({ color, rotate = "0deg", width = "90px" }: { color: string, rotate?: string, width?: string }) => (
        <div style={{
            position: "absolute",
            top: "-12px",
            left: "50%",
            transform: `translateX(-50%) rotate(${rotate})`,
            width: width,
            height: "24px",
            backgroundColor: color,
            opacity: 0.9,
            zIndex: 10,
            boxShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            maskImage: "linear-gradient(90deg, transparent 2px, #000 2px, #000 calc(100% - 2px), transparent calc(100% - 2px))", // Simple edge masking
        }}>
            <div style={{ width: "100%", height: "100%", opacity: 0.15, background: "#fff", mixBlendMode: "overlay" }} />
        </div>
    );

    const baseCardStyle = {
        transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        position: "relative" as "relative",
    };

    return (
        <div style={{
            background: "#fdf8f1", // Creamy paper base
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
            // Full Width Breakout to prevent side gaps
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)"
        }}>
            {/* Soft Watercolor Washes - Breathing Ambient Animation */}
            <motion.div
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.4, 0.3],
                    rotate: [0, 5, 0]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: "fixed",
                    top: "15%",
                    right: "-10%",
                    width: "600px",
                    height: "600px",
                    background: "radial-gradient(circle, rgba(216, 226, 220, 0.3) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.5, 0.4],
                    rotate: [0, -5, 0]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                style={{
                    position: "fixed",
                    bottom: "5%",
                    left: "-5%",
                    width: "550px",
                    height: "550px",
                    background: "radial-gradient(circle, rgba(255, 229, 217, 0.4) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />

            {/* Individual Watercolor Sketches - Gentle Float */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 0.4,
                    y: [0, -15, 0],
                    rotate: [-10, -5, -10]
                }}
                transition={{
                    opacity: { duration: 1 },
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ position: "fixed", top: "5%", left: "8%", width: "150px", height: "150px", zIndex: 1, pointerEvents: "none" }}
            >
                <Image src="/detail_lavender.png" alt="" fill style={{ objectFit: 'contain' }} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 0.3,
                    y: [0, 10, 0],
                    rotate: [15, 20, 15]
                }}
                transition={{
                    opacity: { duration: 1, delay: 0.2 },
                    y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 9, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ position: "fixed", top: "45%", right: "8%", width: "120px", height: "120px", zIndex: 1, pointerEvents: "none" }}
            >
                <Image src="/detail_rose.png" alt="" fill style={{ objectFit: 'contain' }} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 0.35,
                    y: [0, -8, 0],
                    rotate: [-5, 0, -5]
                }}
                transition={{
                    opacity: { duration: 1, delay: 0.4 },
                    y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ position: "fixed", bottom: "15%", left: "5%", width: "140px", height: "140px", zIndex: 1, pointerEvents: "none" }}
            >
                <Image src="/detail_leaf.png" alt="" fill style={{ objectFit: 'contain' }} />
            </motion.div>

            {/* Detailed Artistic Hijabi Sketch (Backview) */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.25, x: 0 }}
                style={{
                    position: "fixed",
                    right: "-2%",
                    bottom: "-2%",
                    width: "55vh",
                    height: "55vh",
                    zIndex: 2,
                    pointerEvents: "none",
                    mixBlendMode: "multiply",
                }}
            >
                <Image
                    src="/hijabi_details.png"
                    alt="Detailed Personal Sketch"
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </motion.div>



            <div style={{ position: "fixed", inset: 0, opacity: 0.4, pointerEvents: "none", backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')", zIndex: 5 }} />

            <main style={{ position: "relative", zIndex: 10, padding: "3rem 0" }}>
                <Container>
                    <div style={{ marginBottom: "2.5rem" }}>
                        <Link href="/" style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: "44px", height: "44px", background: "#fff", border: "2px solid #5a5a5a",
                            boxShadow: "2px 2px 0px #5a5a5a", borderRadius: "12px", color: "#5a5a5a", transition: "all 0.2s ease"
                        }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px #5a5a5a"; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "2px 2px 0px #5a5a5a"; }}
                        >
                            <Home size={22} strokeWidth={2} />
                        </Link>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ marginBottom: "4rem", textAlign: "center" }}>
                        <p style={{ fontSize: "1.1rem", color: "#a0907d", fontStyle: "italic", marginBottom: "0.5rem" }}>{dateString}</p>
                        <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", fontWeight: 700, color: "#2d2d2d", lineHeight: 1.1 }}>
                            {greeting}, <span style={{ fontFamily: "cursive, 'Brush Script MT', 'Dancing Script'", color: "#d2691e", fontSize: "1.25em", transform: "rotate(-2deg) translateY(4px)", display: "inline-block" }}>Tamu Ke-28.</span>
                        </h1>
                    </motion.div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", marginBottom: "2.5rem", position: "relative", zIndex: 20 }}>
                        <Link href="/guest/no28/letter" style={{ textDecoration: "none" }}>
                            <motion.div
                                initial={{ rotate: -2 }}
                                whileHover={{ scale: 1.02, rotate: -1 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    ...baseCardStyle,
                                    height: "280px",
                                    padding: "2.5rem 2rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    background: "#fdfbf7",
                                    backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #e1e4e8 28px)", // Notebook lines
                                    borderRadius: "2px 5px 2px 255px / 255px 225px 15px 255px", // Subtle organic
                                    border: "1px solid #d1d5db",
                                    boxShadow: "3px 3px 8px rgba(0,0,0,0.06)",
                                }}
                            >
                                <WashiTape color="#e6af2e" rotate="-3deg" width="110px" />

                                {/* Sticker: Sage Sketch */}
                                <div style={{ position: "absolute", top: "10px", right: "10px", width: "80px", height: "80px", opacity: 0.8, transform: "rotate(10deg)", pointerEvents: "none" }}>
                                    <Image src="/sage_sketch.png" alt="" fill style={{ objectFit: "contain" }} />
                                </div>

                                <div style={{
                                    width: "48px",
                                    height: "48px",
                                    border: "2px solid #5a5a5a",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "#fff",
                                    transform: "rotate(-5deg)",
                                    boxShadow: "2px 2px 0 #5a5a5a"
                                }}>
                                    <Mail size={24} color="#5a5a5a" strokeWidth={1.5} />
                                </div>

                                <div style={{ marginTop: "1rem" }}>
                                    <h3 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#333", fontFamily: "'Crimson Pro', serif" }}>Sepucuk Surat</h3>
                                    <p style={{ color: "#666", fontStyle: "italic", fontSize: "0.95rem", marginTop: "4px" }}>"Tinta yang baru saja mengering..."</p>
                                </div>
                                <ChevronRight size={18} style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem", color: "#aaa" }} />
                            </motion.div>
                        </Link>

                        <Link href="/guest/no28/special_day" style={{ textDecoration: "none" }}>
                            <motion.div
                                initial={{ rotate: 1 }}
                                whileHover={{ scale: 1.02, rotate: 2 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    ...baseCardStyle,
                                    height: "280px",
                                    padding: "1rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    background: "#fff",
                                    borderRadius: "2px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)", // Polaroid clean shadow
                                    border: "1px solid #eee"
                                }}
                            >
                                <WashiTape color="#ff9f1c" rotate="2deg" width="100px" />

                                {/* Sticker: Peach Sketch */}
                                <div style={{ position: "absolute", bottom: "70px", right: "10px", width: "90px", height: "90px", opacity: 0.85, transform: "rotate(-15deg)", zIndex: 5, pointerEvents: "none" }}>
                                    <Image src="/peach_sketch.png" alt="" fill style={{ objectFit: "contain" }} />
                                </div>

                                {/* Polaroid Image Placeholder */}
                                <div style={{
                                    flex: 1,
                                    background: "#f0f0f0",
                                    marginBottom: "1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    position: "relative"
                                }}>
                                    <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "url('https://www.transparenttextures.com/patterns/noise.png')" }} />
                                    <Calendar size={32} color="#aaa" strokeWidth={1} />
                                </div>

                                <div style={{ padding: "0 0.5rem 0.5rem" }}>
                                    <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#333", marginBottom: "2px" }}>Kepingan Kita</h3>
                                    <p style={{ color: "#888", fontSize: "0.85rem", letterSpacing: "0.5px" }}>MOMEN YANG TERUKIR ABADI</p>
                                </div>
                            </motion.div>
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        style={{
                            padding: "3rem 2.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "2.5rem",
                            background: "#fff",
                            marginTop: "3rem",
                            position: "relative",
                            zIndex: 20,
                            borderRadius: "2px",
                            boxShadow: "2px 4px 10px rgba(0,0,0,0.05)",
                            transform: "rotate(1deg)"
                        }}
                    >
                        <WashiTape color="#a8d5ba" rotate="-1.5deg" width="140px" />

                        {/* Sticker: Lavender Sketch */}
                        <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "100px", height: "100px", opacity: 0.8, transform: "rotate(-20deg)", pointerEvents: "none" }}>
                            <Image src="/lavender_sketch.png" alt="" fill style={{ objectFit: "contain" }} />
                        </div>

                        <div style={{ color: "#a0907d", transform: "scale(1.2) rotate(-5deg)" }}>
                            <Quote size={40} strokeWidth={1.2} />
                        </div>
                        <div>
                            <p style={{ fontSize: "1.25rem", fontWeight: 300, lineHeight: "1.8", color: "#444", fontStyle: "italic", marginBottom: "1rem", maxWidth: "650px" }}>
                                "Satu-satunya jalan menuju karya agung adalah mencintai apa yang kau kerjakan. Teruslah mencari, jangan lekas berpuas hati."
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#a0907d", fontSize: "0.9rem", opacity: 0.6 }}>
                                <Sparkles size={14} /> bisikan sanubari
                            </div>
                        </div>
                    </motion.div>
                </Container>
            </main>
        </div>
    );
}
