"use client";

import React from "react";
import Link from "next/link";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { Github, Globe, ArrowUpRight } from "lucide-react";
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
            <main className="min-h-screen p-6 md:p-12 relative">

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="fixed top-6 left-6 z-20"
                >
                    <Link href="/portfolio" className="text-sm font-medium text-ink-secondary hover:text-ink-primary transition-colors no-underline">
                        ← portfolio
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto pt-20 md:pt-32"
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-ink-primary mb-2 tracking-tight">Projects</h1>
                    <p className="text-ink-secondary mb-12 italic opacity-80">Selected works and experiments.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PROJECTS.map((project, i) => (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + (i * 0.1) }}
                                className="group relative bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/60 transition-all hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-ink-primary">{project.title}</h3>
                                    <div className="flex gap-3">
                                        <a href={project.links.github} className="text-ink-secondary hover:text-ink-primary transition-colors">
                                            <Github size={18} />
                                        </a>
                                        <a href={project.links.demo} className="text-ink-secondary hover:text-ink-primary transition-colors">
                                            <Globe size={18} />
                                        </a>
                                    </div>
                                </div>

                                <p className="text-ink-secondary mb-6 text-sm leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-xs font-mono font-medium text-ink-muted bg-white/50 px-2 py-1 rounded-md border border-white/30">
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
