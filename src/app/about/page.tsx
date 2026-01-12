"use client";

import { Container } from "@/components/Container";
import Link from "next/link";
import {
    MapPin,
    Calendar,
    Zap,
    Coffee,
    ArrowRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { Metadata } from "next";
import { motion } from "framer-motion";

// --- Components ---

function StatusPill() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-8 shadow-sm"
        >
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Jakarta, ID</span>
            <span className="text-zinc-300 dark:text-zinc-600">|</span>
            <span>Online</span>
        </motion.div>
    );
}

// Staggered Animation Container
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

export default function AboutPage() {
    return (
        <div style={{ paddingBottom: "clamp(4rem, 10vh, 8rem)" }}>

            {/* 1. HERO: Bilingual & Casual with Motion */}
            <section style={{
                minHeight: "75vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                paddingTop: "clamp(6rem, 15vh, 10rem)",
                paddingLeft: "1rem",
                paddingRight: "1rem"
            }}>
                <Container>
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={containerVariants}
                    >
                        <StatusPill />

                        <motion.h1 variants={itemVariants} style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3.5rem, 10vw, 7.5rem)",
                            fontWeight: 400,
                            lineHeight: 0.95,
                            letterSpacing: "-0.04em",
                            marginBottom: "3rem",
                            color: "var(--foreground)",
                            maxWidth: "20ch",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}>
                            Building digital artifacts. <br />
                            <span className="text-[var(--text-secondary)] italic" style={{ fontSize: "0.5em" }}>Sambil ngopi dan bakar surya 16.</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} style={{
                            fontSize: "1.35rem",
                            lineHeight: 1.6,
                            fontFamily: "'Source Serif 4', serif",
                            maxWidth: "40rem",
                            color: "var(--text-secondary)",
                            marginTop: 0,
                            marginBottom: "4rem",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}>
                            Hi, I'm Faza. Software Engineer yang kadang sok filsuf. <br className="hidden md:block" />
                            This site is my <span className="italic">digital garden</span>. empat buang ide, nyatet hal-hal random, dan showcase projects yang (semoga) berguna.
                        </motion.p>
                    </motion.div>
                </Container>
            </section>

            {/* 2. VALUES: Staggered Fade In */}
            <section style={{ padding: "clamp(4rem, 8vh, 6rem) 0", borderTop: "1px solid var(--border)" }}>
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12 text-center md:text-left"
                    >
                        <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)]">The Vibe</span>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "3rem"
                        }}
                    >
                        {[
                            {
                                title: "Keep it Simple",
                                desc: "Kalau bisa simple, kenapa harus ribet? I strive for clarity in code and design."
                            },
                            {
                                title: "Always Curious",
                                desc: "Hobi ngulik, from frontend magic to chaotic backend logs. Learning never stops."
                            },
                            {
                                title: "Craft Matters",
                                desc: "Coding itu kayak nulis puisi buat mesin. It should be elegant, efficient, and clean."
                            }
                        ].map((item, i) => (
                            <motion.div key={i} variants={itemVariants}>
                                <h3 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "1.5rem",
                                    fontWeight: 500,
                                    marginBottom: "0.75rem"
                                }}>
                                    {item.title}
                                </h3>
                                <p style={{
                                    color: "var(--text-secondary)",
                                    lineHeight: 1.6,
                                    fontSize: "1rem"
                                }}>
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </Container>
            </section>

            {/* 3. ARCHIVE: Compact List (Old Format) */}
            <section style={{ padding: "clamp(4rem, 8vh, 6rem) 0", backgroundColor: "var(--card-bg)" }}>
                <Container>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-12 flex items-end justify-between border-b border-[var(--border)] pb-6"
                    >
                        <div>
                            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] block mb-2">Navigation</span>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "clamp(2rem, 5vw, 2.5rem)",
                                fontWeight: 400,
                                margin: 0
                            }}>
                                The Archive
                            </h2>
                        </div>
                        <p className="hidden md:block text-[var(--text-secondary)] font-serif italic">
                            Gudang wacana & karya.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {[
                            { href: "/now", emoji: "⚡", title: "Now", desc: "Lagi sibuk apa? Current snapshot of focus & priorities." },
                            { href: "/bookshelf", emoji: "📚", title: "Bookshelf", desc: "Tsundoku survivor. Notes from the margins & reading log." },
                            { href: "/ideas", emoji: "💡", title: "Ideas", desc: "Gudang ide liar. Rough drafts, experiments, & brain dumps." },
                            { href: "/links", emoji: "🔗", title: "Links", desc: "Bookmarks pilihan. Curated gems from the weird web." },
                            { href: "/changelog", emoji: "📝", title: "Changelog", desc: "Sejarah update. The evolution of this digital garden." },
                            { href: "/til", emoji: "🎓", title: "TIL", desc: "Hari ini belajar apa? Bite-sized snippets of knowledge." },
                            { href: "/uses", emoji: "🛠️", title: "Uses", desc: "Gear & Tools. My battle station and software stack." }
                        ].map((link) => (
                            <Link href={link.href} key={link.href} className="block group">
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-5 p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                                >
                                    <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>
                                        {link.emoji}
                                    </span>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 style={{
                                                fontFamily: "'Playfair Display', serif",
                                                fontSize: "1.1rem",
                                                fontWeight: 500,
                                            }}>
                                                {link.title}
                                            </h4>
                                            <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p style={{
                                            color: "var(--text-secondary)",
                                            fontSize: "0.9rem",
                                            lineHeight: 1.4,
                                        }} className="truncate">
                                            {link.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                </Container>
            </section>

            {/* 4. FOOTER: Casual Sign-off */}
            <section style={{ padding: "clamp(4rem, 8vh, 6rem) 0", textAlign: "center" }}>
                <Container>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.5rem, 5vw, 1.75rem)",
                            marginBottom: "1.5rem",
                            fontStyle: "italic",
                            color: "var(--text-secondary)"
                        }}>
                            "Stay hungry, stay foolish. Tapi jangan lupa makan."
                        </p>

                        <div className="flex gap-6 justify-center">
                            <a href="https://x.com/scienfilix" target="_blank" rel="noopener noreferrer"
                                className="text-sm font-mono uppercase tracking-widest text-[var(--accent)] hover:opacity-80">
                                Twitter
                            </a>
                            <a href="https://github.com/mfazans23" target="_blank" rel="noopener noreferrer"
                                className="text-sm font-mono uppercase tracking-widest text-[var(--accent)] hover:opacity-80">
                                GitHub
                            </a>
                        </div>
                    </motion.div>
                </Container>
            </section>
        </div>
    );
}
