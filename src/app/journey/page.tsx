"use client";

import React from "react";
import { Container } from "@/components/Container";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { ZenHideable } from "@/components/ZenHideable";
import { Brain, Code, Sparkles, TrendingUp, Rocket } from "lucide-react";
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import { motion } from "framer-motion";

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
    { name: "AI Agent Orchestration", progress: 35, icon: <Brain size={16} />, color: "#5a6a80" },
    { name: "Fullstack Architecture", progress: 65, icon: <Code size={16} />, color: "#5d7d70" },
    { name: "Consumer Psychology", progress: 20, icon: <Sparkles size={16} />, color: "#6d5f80" },
    { name: "Growth Marketing", progress: 15, icon: <TrendingUp size={16} />, color: "#8a7a50" },
];

export default function JourneyPage() {
    return (
        <AtmosphericBackground variant="olive">
            <main style={{ paddingBottom: "8rem" }}>
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
                                    marginBottom: "1.5rem",
                                    color: "var(--ink-primary)"
                                }}>
                                    2026: <span style={{ color: "var(--ink-accent)" }}>The Year of Building.</span>
                                </h2>
                                <p style={{
                                    fontSize: "clamp(1rem, 3vw, 1.1rem)",
                                    color: "var(--ink-secondary)",
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
                                gap: "1rem",
                                marginBottom: "4rem"
                            }}>
                                {SKILL_ACQUISITION.map((skill, idx) => (
                                    <motion.div
                                        key={skill.name}
                                        initial={{ opacity: 1, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        style={{
                                            background: "var(--glass-bg)",
                                            padding: "1.25rem",
                                            borderRadius: "16px",
                                            border: "1px solid var(--glass-border)",
                                            backdropFilter: "var(--glass-blur)",
                                            WebkitBackdropFilter: "var(--glass-blur)",
                                            boxShadow: "var(--glass-shadow)",
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
                                            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0, color: "var(--ink-primary)" }}>{skill.name}</h4>
                                        </div>
                                        <div style={{ height: "5px", backgroundColor: "rgba(45, 51, 40, 0.1)", borderRadius: "3px", overflow: "hidden" }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.progress}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                style={{ height: "100%", backgroundColor: skill.color, borderRadius: "3px" }}
                                            />
                                        </div>
                                        <div style={{ marginTop: "0.5rem", fontSize: "0.7rem", color: "var(--ink-muted)", fontFamily: "var(--font-mono)" }}>
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
                                    <Rocket size={20} color="var(--ink-accent)" />
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0, color: "var(--ink-primary)" }}>Quarterly Roadmap</h3>
                                </div>

                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                    gap: "1rem"
                                }}>
                                    {QUARTERLY_TARGETS.map((q, idx) => (
                                        <motion.div
                                            key={q.q}
                                            initial={{ opacity: 1, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            style={{
                                                background: "var(--glass-bg)",
                                                border: "1px solid var(--glass-border)",
                                                borderRadius: "16px",
                                                padding: "1.25rem",
                                                height: "100%",
                                                backdropFilter: "var(--glass-blur)",
                                                WebkitBackdropFilter: "var(--glass-blur)",
                                                boxShadow: "var(--glass-shadow)",
                                            }}
                                        >
                                            <div style={{
                                                fontSize: "0.75rem",
                                                fontWeight: 800,
                                                color: "var(--ink-accent)",
                                                marginBottom: "0.25rem",
                                                fontFamily: "var(--font-mono)"
                                            }}>
                                                {q.q}
                                            </div>
                                            <h4 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "1rem", color: "var(--ink-primary)" }}>{q.label}</h4>
                                            <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                                {q.targets.map(t => (
                                                    <li key={t} style={{
                                                        fontSize: "0.85rem",
                                                        color: "var(--ink-secondary)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.5rem"
                                                    }}>
                                                        <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--ink-accent)" }} />
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
        </AtmosphericBackground>
    );
}
