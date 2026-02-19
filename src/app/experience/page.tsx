"use client";

import React from "react";
import Link from "next/link";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
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
                    className="max-w-2xl mx-auto pt-20 md:pt-32"
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-ink-primary mb-2 tracking-tight">Experience</h1>
                    <p className="text-ink-secondary mb-12 italic opacity-80">My professional journey so far.</p>

                    <div className="relative border-l border-ink-primary/20 ml-3 md:ml-6 pl-8 md:pl-12 space-y-12">
                        {EXPERIENCE.map((job, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="relative"
                            >
                                {/* Timeline Dot */}
                                <div className="absolute -left-[41px] md:-left-[57px] top-2 w-4 h-4 rounded-full bg-paper-bg border-2 border-ink-primary"></div>

                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                                    <h3 className="text-xl font-bold text-ink-primary">{job.role}</h3>
                                    <span className="font-mono text-sm text-ink-muted">{job.date}</span>
                                </div>
                                <div className="text-ink-secondary font-medium mb-4">{job.company}</div>

                                <ul className="list-disc list-outside ml-4 space-y-2 text-ink-secondary/90 leading-relaxed">
                                    {job.description.map((desc, j) => (
                                        <li key={j}>{desc}</li>
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
