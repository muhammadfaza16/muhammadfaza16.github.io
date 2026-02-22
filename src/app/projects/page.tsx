"use client";

import React from "react";
import Link from "next/link";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { Github, Globe, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const PROJECTS = [
    {
        title: "Zen Journal",
        description: "A digital journaling app focused on mental clarity and minimal distraction.",
        tags: ["Next.js", "Tailwind", "Supabase"],
        links: { demo: "#", github: "#" }
    },
    {
        title: "EcoTrack",
        description: "Mobile-first PWA for tracking daily carbon footprint with gamification elements.",
        tags: ["React", "PWA", "Firebase"],
        links: { demo: "#", github: "#" }
    },
    {
        title: "Soundscape API",
        description: "Procedural audio generation engine for ambient web experiences.",
        tags: ["Node.js", "Web Audio API", "TypeScript"],
        links: { demo: "#", github: "#" }
    },
    {
        title: "Lumina UI",
        description: "An open-source component library for building light-sensitive interfaces.",
        tags: ["Storybook", "CSS Modules", "Rollup"],
        links: { demo: "#", github: "#" }
    }
];

export default function ProjectsPage() {
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
                        href="/starlight"
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
                    initial={{ opacity: 1, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        maxWidth: "720px",
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
                    }}>Projects</h1>
                    <p style={{
                        color: "var(--ink-secondary)",
                        fontStyle: "italic",
                        opacity: 0.8,
                        marginBottom: "2.5rem",
                        fontSize: "0.95rem",
                    }}>Selected works and experiments.</p>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "1.2rem",
                    }}>
                        {PROJECTS.map((project, i) => (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 1, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + (i * 0.1) }}
                                style={{
                                    background: "rgba(255,255,255,0.35)",
                                    backdropFilter: "blur(16px)",
                                    WebkitBackdropFilter: "blur(16px)",
                                    borderRadius: "16px",
                                    padding: "1.25rem",
                                    border: "1px solid rgba(255,255,255,0.18)",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
                                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--ink-primary)", margin: 0 }}>{project.title}</h3>
                                    <div style={{ display: "flex", gap: "0.6rem" }}>
                                        <a href={project.links.github} style={{ color: "var(--ink-secondary)", transition: "color 0.2s" }}>
                                            <Github size={18} />
                                        </a>
                                        <a href={project.links.demo} style={{ color: "var(--ink-secondary)", transition: "color 0.2s" }}>
                                            <Globe size={18} />
                                        </a>
                                    </div>
                                </div>

                                <p style={{
                                    color: "var(--ink-secondary)",
                                    fontSize: "0.85rem",
                                    lineHeight: 1.6,
                                    marginBottom: "1rem",
                                }}>
                                    {project.description}
                                </p>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                    {project.tags.map(tag => (
                                        <span key={tag} style={{
                                            fontSize: "0.7rem",
                                            fontFamily: "monospace",
                                            fontWeight: 600,
                                            color: "var(--ink-muted)",
                                            backgroundColor: "rgba(255,255,255,0.45)",
                                            padding: "0.2rem 0.5rem",
                                            borderRadius: "6px",
                                            border: "1px solid rgba(255,255,255,0.25)",
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </main>
        </AtmosphericBackground>
    );
}
