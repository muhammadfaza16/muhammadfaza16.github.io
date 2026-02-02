"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/Container";
import { IosBentoCard } from "@/components/sanctuary/IosBentoCard";
import { ZenHideable } from "@/components/ZenHideable";
import { Target, ArrowLeft, Brain, Code, Sparkles, TrendingUp, Compass, Rocket } from "lucide-react";
import Link from "next/link";
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import { motion } from "framer-motion";

const GradientOrb = dynamic(() => import("@/components/GradientOrb").then(mod => mod.GradientOrb), { ssr: false });
const CosmicStars = dynamic(() => import("@/components/CosmicStars").then(mod => mod.CosmicStars), { ssr: false });
const MilkyWay = dynamic(() => import("@/components/MilkyWay").then(mod => mod.MilkyWay), { ssr: false });

const QUARTERLY_TARGETS = [
    {
        q: "Q1",
        label: "Foundation",
        targets: ["Master LLM Orchestration", "Personal Brand V1", "Physical Baseline Set"]
    },
    {
        q: "Q2",
        label: "Building",
        targets: ["Launch AI Agent Service", "English Fluency Push", "First SaaS MVP"]
    },
    {
        q: "Q3",
        label: "Expansion",
        targets: ["Scale Content Engine", "Deep Learning Research", "Networking Expansion"]
    },
    {
        q: "Q4",
        label: "Reflection",
        targets: ["Year-End Review", "System Optimization", "2027 Planning"]
    }
];

const SKILL_ACQUISITION = [
    { name: "AI Agent Orchestration", progress: 35, icon: <Brain size={16} />, color: "#5856d6" },
    { name: "Fullstack Architecture", progress: 65, icon: <Code size={16} />, color: "#5ac8fa" },
    { name: "Consumer Psychology", progress: 20, icon: <Sparkles size={16} />, color: "#af52de" },
    { name: "Growth Marketing", progress: 15, icon: <TrendingUp size={16} />, color: "#ff9500" },
];

export default function JourneyPage() {
    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#050505",
            color: "white",
            position: "relative",
            overflowX: "hidden"
        }}>
            {/* Ambient Background */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <MilkyWay />
                <GradientOrb />
                <CosmicStars />
            </div>

            <main style={{ position: "relative", zIndex: 1, paddingBottom: "8rem" }}>
                {/* Standard Back Button */}
                <StandardBackButton href="/starlight" />

                <ZenHideable hideInZen>
                    {/* Hero Intro */}
                    <section style={{ paddingTop: "4rem", paddingBottom: "2rem" }}>
                        <Container>
                            <div style={{ maxWidth: "600px" }}>
                                <h2 style={{
                                    fontSize: "clamp(2rem, 5vw, 2.5rem)",
                                    fontWeight: 700,
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.1,
                                    marginBottom: "1.5rem"
                                }}>
                                    2026: <span style={{ color: "#af52de" }}>The Year of Building.</span>
                                </h2>
                                <p style={{
                                    fontSize: "clamp(1rem, 3vw, 1.1rem)",
                                    color: "rgba(255,255,255,0.6)",
                                    lineHeight: 1.6,
                                    margin: 0
                                }}>
                                    Iterasi demi iterasi. Fokus tahun ini adalah menjembatani jarak antara ide dan eksekusi melalui penguasaan skill dan target yang terukur.
                                </p>
                            </div>
                        </Container>
                    </section>

                    {/* Skill Progress Section */}
                    <section style={{ marginTop: "3rem" }}>
                        <Container>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                gap: "1.5rem",
                                marginBottom: "4rem"
                            }}>
                                {SKILL_ACQUISITION.map((skill, idx) => (
                                    <motion.div
                                        key={skill.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        style={{
                                            background: "rgba(255, 255, 255, 0.03)",
                                            padding: "1.5rem",
                                            borderRadius: "22px",
                                            border: "1px solid rgba(255, 255, 255, 0.05)",
                                            backdropFilter: "blur(20px)"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                                            <div style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "8px",
                                                backgroundColor: `${skill.color}20`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: skill.color
                                            }}>
                                                {skill.icon}
                                            </div>
                                            <h4 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>{skill.name}</h4>
                                        </div>
                                        <div style={{ height: "6px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.progress}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                style={{ height: "100%", backgroundColor: skill.color, borderRadius: "3px" }}
                                            />
                                        </div>
                                        <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)" }}>
                                            PROGRESS: {skill.progress}%
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Roadmap Targets */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.5rem"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                                    <Rocket size={20} color="#af52de" />
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>Quarterly Roadmap</h3>
                                </div>

                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                    gap: "1.5rem"
                                }}>
                                    {QUARTERLY_TARGETS.map((q, idx) => (
                                        <motion.div
                                            key={q.q}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            style={{
                                                background: "rgba(255, 255, 255, 0.02)",
                                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                                borderRadius: "24px",
                                                padding: "1.5rem",
                                                height: "100%"
                                            }}
                                        >
                                            <div style={{
                                                fontSize: "0.8rem",
                                                fontWeight: 800,
                                                color: "#af52de",
                                                marginBottom: "0.25rem"
                                            }}>
                                                {q.q}
                                            </div>
                                            <h4 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>{q.label}</h4>
                                            <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                                {q.targets.map(t => (
                                                    <li key={t} style={{
                                                        fontSize: "0.9rem",
                                                        color: "rgba(255,255,255,0.6)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.5rem"
                                                    }}>
                                                        <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#af52de" }} />
                                                        {t}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </Container>
                    </section>
                </ZenHideable>
            </main>
        </div>
    );
}
