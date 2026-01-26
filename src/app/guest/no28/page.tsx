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
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setMounted(true);
        const now = new Date();
        const hour = now.getHours();

        if (hour >= 5 && hour < 12) setGreeting("Good Morning");
        else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
        else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
        else setGreeting("Good Night");

        setDateString(now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        }));

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    if (!mounted) return null;

    const sketchyBoxStyle = {
        background: "#fff",
        border: "2px solid #5a5a5a",
        boxShadow: "4px 4px 0px #5a5a5a",
        transition: "all 0.3s ease",
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
            overflowX: "hidden"
        }}>
            {/* Soft Watercolor Washes */}
            <div style={{
                position: "fixed",
                top: "15%",
                right: "-10%",
                width: "600px",
                height: "600px",
                background: "radial-gradient(circle, rgba(216, 226, 220, 0.3) 0%, transparent 70%)",
                filter: "blur(60px)",
                pointerEvents: "none",
                zIndex: 0
            }} />
            <div style={{
                position: "fixed",
                bottom: "5%",
                left: "-5%",
                width: "550px",
                height: "550px",
                background: "radial-gradient(circle, rgba(255, 229, 217, 0.4) 0%, transparent 70%)",
                filter: "blur(60px)",
                pointerEvents: "none",
                zIndex: 0
            }} />

            {/* Individual Watercolor Sketches - Scattered */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4 }}
                style={{ position: "fixed", top: "5%", left: "8%", width: "150px", height: "150px", zIndex: 1, pointerEvents: "none", transform: "rotate(-10deg)" }}
            >
                <Image src="/detail_lavender.png" alt="" fill style={{ objectFit: 'contain' }} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.3 }}
                style={{ position: "fixed", top: "45%", right: "8%", width: "120px", height: "120px", zIndex: 1, pointerEvents: "none", transform: "rotate(15deg)" }}
            >
                <Image src="/detail_rose.png" alt="" fill style={{ objectFit: 'contain' }} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.35 }}
                style={{ position: "fixed", bottom: "15%", left: "5%", width: "140px", height: "140px", zIndex: 1, pointerEvents: "none", transform: "rotate(-5deg)" }}
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

            {/* Ambient Cursor Light */}
            <div style={{
                position: "fixed",
                left: mousePos.x,
                top: mousePos.y,
                transform: "translate(-50%, -50%)",
                width: "450px",
                height: "450px",
                background: "radial-gradient(circle, rgba(255, 214, 10, 0.1) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 6,
                transition: "left 0.1s ease-out, top 0.1s ease-out"
            }} />

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
                            {greeting}, <span style={{ fontFamily: "cursive, 'Brush Script MT', 'Dancing Script'", color: "#d2691e", fontSize: "1.25em", transform: "rotate(-2deg) translateY(4px)", display: "inline-block" }}>Guest 28.</span>
                        </h1>
                    </motion.div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", marginBottom: "2.5rem", position: "relative", zIndex: 20 }}>
                        <Link href="/guest/no28/letter" style={{ textDecoration: "none" }}>
                            <motion.div initial={{ rotate: -4, x: -8 }} animate={{ y: [0, -6, 0], rotate: -4, x: -8 }} transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...sketchyBoxStyle, height: "260px", padding: "2.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#fdfdee", position: "relative" }}>
                                <div style={{ width: "50px", height: "50px", border: "2px solid #5a5a5a", borderRadius: "15% 30% 20% 40%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
                                    <Mail size={24} color="#5a5a5a" strokeWidth={1.5} />
                                </div>
                                <div style={{ borderTop: "2px solid rgba(0,0,0,0.05)", paddingTop: "1rem" }}>
                                    <h3 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#333" }}>A Personal Note</h3>
                                    <p style={{ color: "#777", fontStyle: "italic" }}>The ink is still fresh</p>
                                </div>
                                <ChevronRight size={18} style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem", color: "#ccc" }} />
                            </motion.div>
                        </Link>

                        <Link href="/guest/no28/special_day" style={{ textDecoration: "none" }}>
                            <motion.div initial={{ rotate: 5, x: 8 }} animate={{ y: [6, 0, 6], rotate: 5, x: 8 }} transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...sketchyBoxStyle, height: "260px", padding: "2.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#fffbf2", position: "relative" }}>
                                <div style={{ width: "50px", height: "50px", border: "2px solid #5a5a5a", borderRadius: "40% 20% 30% 15%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
                                    <Calendar size={24} color="#5a5a5a" strokeWidth={1.5} />
                                </div>
                                <div style={{ borderTop: "2px solid rgba(0,0,0,0.05)", paddingTop: "1rem" }}>
                                    <h3 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#333" }}>Pieces of Us</h3>
                                    <p style={{ color: "#777", fontStyle: "italic" }}>Moments etched in time</p>
                                </div>
                                <ChevronRight size={18} style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem", color: "#ccc" }} />
                            </motion.div>
                        </Link>
                    </div>

                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 7, repeat: Infinity }} style={{ ...sketchyBoxStyle, padding: "3rem 2.5rem", display: "flex", alignItems: "center", gap: "2.5rem", background: "rgba(255,255,255,0.75)", marginTop: "3rem", borderStyle: "dashed", borderWidth: "1px", boxShadow: "none", position: "relative", zIndex: 20 }}>
                        <div style={{ color: "#a0907d", transform: "scale(1.2) rotate(-5deg)" }}>
                            <Quote size={40} strokeWidth={1.2} />
                        </div>
                        <div>
                            <p style={{ fontSize: "1.25rem", fontWeight: 300, lineHeight: "1.8", color: "#444", fontStyle: "italic", marginBottom: "1rem", maxWidth: "650px" }}>
                                "The only way to do great work is to love what you do. Keep looking, don't settle."
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#a0907d", fontSize: "0.9rem", opacity: 0.6 }}>
                                <Sparkles size={14} /> whispers from the heart
                            </div>
                        </div>
                    </motion.div>
                </Container>
            </main>
        </div>
    );
}
