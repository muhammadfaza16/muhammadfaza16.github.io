"use client";

import { motion } from "framer-motion";
import { Home, Sparkles } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/Container";

export default function SpecialDayPage() {
    return (
        <div style={{
            background: "#fdf8f1",
            backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 0)",
            backgroundSize: "40px 40px",
            minHeight: "100svh",
            color: "#444",
            fontFamily: "'Crimson Pro', serif, -apple-system",
            position: "relative"
        }}>
            <div style={{
                position: "fixed",
                inset: 0,
                opacity: 0.4,
                pointerEvents: "none",
                backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
                zIndex: 1
            }} />

            <main style={{ position: "relative", zIndex: 10, padding: "3rem 0" }}>
                <Container>
                    <Link href="/" style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "44px",
                        height: "44px",
                        background: "#fff",
                        border: "2px solid #5a5a5a",
                        boxShadow: "2px 2px 0px #5a5a5a",
                        borderRadius: "12px",
                        color: "#5a5a5a",
                        marginBottom: "3rem",
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
                        <Home size={22} strokeWidth={2} />
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 10, rotate: 1 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                    >
                        <h1 style={{
                            fontSize: "2.5rem",
                            fontWeight: 700,
                            marginBottom: "2rem",
                            color: "#2d2d2d"
                        }}>
                            Your Special Day
                        </h1>

                        <div style={{
                            background: "#fffbf2",
                            border: "2px solid #5a5a5a",
                            boxShadow: "6px 6px 0px #5a5a5a",
                            padding: "4rem 2rem",
                            textAlign: "center",
                            transform: "rotate(-1deg)"
                        }}>
                            <div style={{ color: "#d2691e", marginBottom: "1.5rem" }}>
                                <Sparkles size={48} strokeWidth={1} />
                            </div>
                            <h2 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "1rem" }}>Under Construction</h2>
                            <p style={{ color: "#777", fontStyle: "italic", fontSize: "1.1rem" }}>
                                I'm carefully sketching out something beautiful for this section.
                                It will be worth the wait.
                            </p>
                        </div>
                    </motion.div>
                </Container>
            </main>
        </div>
    );
}
