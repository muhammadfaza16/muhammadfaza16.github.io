"use client";

import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/Container";

export default function LetterPage() {
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
                        initial={{ opacity: 0, y: 10, rotate: -0.5 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                    >
                        <h1 style={{
                            fontSize: "2.5rem",
                            fontWeight: 700,
                            marginBottom: "2rem",
                            color: "#2d2d2d"
                        }}>
                            A Personal Letter
                        </h1>

                        <div style={{
                            background: "#fff",
                            border: "2px solid #5a5a5a",
                            boxShadow: "6px 6px 0px #5a5a5a",
                            padding: "3rem",
                            lineHeight: "1.9",
                            color: "#3c3c3c",
                            fontSize: "1.1rem",
                            position: "relative",
                            transform: "rotate(0.5deg)"
                        }}>
                            {/* Paper Line Effect */}
                            <div style={{
                                position: "absolute",
                                left: "1.5rem",
                                top: 0,
                                bottom: 0,
                                width: "2px",
                                background: "rgba(200, 0, 0, 0.1)",
                                zIndex: 5
                            }} />

                            <p style={{ marginBottom: "1.5rem" }}>Dear Guest 28,</p>
                            <p style={{ marginBottom: "1.5rem" }}>
                                This space is reserved for a more personal message. In this quiet corner of the digital cosmos,
                                I wanted to create something that feels a bit more analog, a bit more human.
                            </p>
                            <p style={{ marginBottom: "2rem" }}>
                                Stay tuned as I pen down the rest of this note. For now, enjoy the stillness.
                            </p>
                            <p style={{ fontStyle: "italic", color: "#666" }}>
                                Warmest regards,<br />
                                <span style={{ fontFamily: "cursive", fontSize: "1.4rem", color: "#333" }}>Faza</span>
                            </p>
                        </div>
                    </motion.div>
                </Container>
            </main>
        </div>
    );
}
