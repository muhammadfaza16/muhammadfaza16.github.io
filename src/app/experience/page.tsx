"use client";

import React from "react";
import Link from "next/link";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const EXPERIENCE = [
    {
        role: "Senior Frontend Engineer",
        company: "TechFlow Inc.",
        date: "2023 — Present",
        description: [
            "Led the migration of legacy dashboard to Next.js 14.",
            "Improved core web vitals by 40%.",
            "Mentored junior developers and established code review standards."
        ]
    },
    {
        role: "Product Designer",
        company: "Studio Ghibli (Concept)",
        date: "2021 — 2023",
        description: [
            "Designed immersive web experiences for promotional campaigns.",
            "Collaborated with art directors to translate visual language into code.",
            "Built a custom design system used across 5 internal projects."
        ]
    },
    {
        role: "Freelance Developer",
        company: "Self-employed",
        date: "2019 — 2021",
        description: [
            "Delivered 15+ custom websites for clients in creative industries.",
            "Specialized in interactive storytelling and WebGL animations.",
            "Managed full lifecycle from concept to deployment."
        ]
    }
];

export default function ExperiencePage() {
    return (
        <AtmosphericBackground variant="sage">
            <main style={{
                minHeight: "100svh",
                padding: "1.5rem",
                position: "relative",
            }}>

                {/* Back Button */}
                <div style={{
                    position: "fixed",
                    top: "24px",
                    left: "24px",
                    zIndex: 40,
                }}>
                    <Link
                        href="/portfolio"
                        prefetch={false}
                        aria-label="Go Back"
                        style={{
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(30, 30, 30, 0.4)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            borderRadius: "50%",
                            color: "white",
                            transition: "all 0.2s ease",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            textDecoration: "none",
                        }}
                    >
                        <ChevronLeft size={24} />
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        maxWidth: "600px",
                        margin: "0 auto",
                        paddingTop: "5rem",
                    }}
                >
                    <h1 style={{
                        fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
                        fontWeight: 800,
                        color: "var(--ink-primary)",
                        letterSpacing: "-0.03em",
                        marginBottom: "0.3rem",
                    }}>Experience</h1>
                    <p style={{
                        color: "var(--ink-secondary)",
                        fontStyle: "italic",
                        opacity: 0.8,
                        marginBottom: "2.5rem",
                        fontSize: "0.95rem",
                    }}>My professional journey so far.</p>

                    {/* Timeline */}
                    <div style={{
                        position: "relative",
                        borderLeft: "2px solid rgba(0,0,0,0.1)",
                        marginLeft: "0.8rem",
                        paddingLeft: "2rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2.5rem",
                    }}>
                        {EXPERIENCE.map((job, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                style={{ position: "relative" }}
                            >
                                {/* Timeline Dot */}
                                <div style={{
                                    position: "absolute",
                                    left: "-2.6rem",
                                    top: "0.4rem",
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "50%",
                                    backgroundColor: "var(--paper-bg, #f5f2eb)",
                                    border: "2.5px solid var(--ink-primary)",
                                }} />

                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.15rem",
                                    marginBottom: "0.5rem",
                                }}>
                                    <h3 style={{
                                        fontSize: "1.15rem",
                                        fontWeight: 700,
                                        color: "var(--ink-primary)",
                                        margin: 0,
                                    }}>{job.role}</h3>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}>
                                        <span style={{ color: "var(--ink-secondary)", fontWeight: 500, fontSize: "0.9rem" }}>{job.company}</span>
                                        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--ink-muted)" }}>{job.date}</span>
                                    </div>
                                </div>

                                <ul style={{
                                    listStyle: "disc",
                                    paddingLeft: "1.2rem",
                                    margin: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.4rem",
                                }}>
                                    {job.description.map((desc, j) => (
                                        <li key={j} style={{
                                            color: "var(--ink-secondary)",
                                            fontSize: "0.85rem",
                                            lineHeight: 1.6,
                                        }}>{desc}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </main>
        </AtmosphericBackground>
    );
}
