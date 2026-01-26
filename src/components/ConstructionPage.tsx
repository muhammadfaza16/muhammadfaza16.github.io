"use client";

import { Container } from "@/components/Container";
import Link from "next/link";
import { ArrowLeft, Hammer } from "lucide-react";
import { motion } from "framer-motion";

interface ConstructionPageProps {
    title: string;
    description?: string;
}

export function ConstructionPage({ title, description = "This feature is currently being built in the workshop." }: ConstructionPageProps) {
    return (
        <div style={{
            minHeight: "100svh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            paddingTop: "6rem" // Account for fixed header/status bar space if any
        }}>
            <Container>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "32px",
                        padding: "3rem 2rem",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1.5rem",
                        maxWidth: "400px",
                        margin: "0 auto",
                        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)"
                    }}
                >
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #FFD60A, #FF9F0A)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 10px 20px rgba(255, 159, 10, 0.3)",
                        fontSize: "2rem",
                        color: "white"
                    }}>
                        <Hammer size={32} />
                    </div>

                    <div>
                        <h1 style={{
                            fontFamily: "-apple-system, sans-serif",
                            fontSize: "2rem",
                            fontWeight: 700,
                            marginBottom: "0.5rem",
                            background: "linear-gradient(to right, #fff, #aaa)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            {title}
                        </h1>
                        <p style={{
                            fontSize: "1rem",
                            color: "rgba(255,255,255,0.6)",
                            lineHeight: 1.5
                        }}>
                            {description}
                        </p>
                    </div>

                    <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.1)" }} />

                    <Link
                        href="/"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.875rem 2rem",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            color: "white",
                            borderRadius: "100px",
                            fontWeight: 500,
                            textDecoration: "none",
                            fontSize: "0.9rem",
                            letterSpacing: "0.02em",
                            transition: "all 0.2s",
                            border: "1px solid rgba(255,255,255,0.1)"
                        }}
                        className="hover:bg-white/20 active:scale-95"
                    >
                        <ArrowLeft size={16} />
                        Return to Lobby
                    </Link>
                </motion.div>
            </Container>
        </div>
    );
}
