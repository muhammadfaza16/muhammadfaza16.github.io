"use client";

import { Container } from "@/components/Container";
import Link from "next/link";
import {
    MapPin,
    Calendar,
    Zap,
    Coffee,
    ArrowRight,
    MousePointer2,
    Terminal,
    Fingerprint,
    Atom
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
            className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-8 shadow-sm backdrop-blur-sm bg-opacity-80"
            style={{ padding: "0.2rem 0.6rem", gap: "0.5rem", marginBottom: "1.5rem" }}
        >
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Jakarta, ID</span>
            <span className="text-zinc-300 dark:text-zinc-600 mx-1">|</span>
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
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
    }
};

export default function AboutPage() {
    return (
        <div style={{ paddingBottom: "clamp(4rem, 10vh, 8rem)" }} className="relative overflow-hidden">

            {/* Ambient Background Gradient (Subtle) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-zinc-100/50 to-transparent dark:from-zinc-900/20 dark:to-transparent rounded-[100%] blur-3xl -z-10 pointer-events-none" />

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
                            Hi, I'm Faza. Just a guy connected to the terminal.<br className="hidden md:block" />
                            This is my <span className="italic">personal log</span>. Kumpulan eksperimen, catatan teknis, dan hal-hal random yang gue kerjain saat (harusnya) tidur. This is just the beginning.
                        </motion.p>
                    </motion.div>
                </Container>
            </section>

            {/* 2. VALUES: "Principles" - Upgraded UI & Copy */}
            <section style={{ padding: "clamp(4rem, 8vh, 6rem) 0", borderTop: "1px solid var(--border)" }}>
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12 text-center md:text-left flex items-center gap-3"
                    >
                        <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-8 md:w-12" />
                        <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)]">Principles</span>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
                    >
                        {[
                            {
                                icon: <MousePointer2 className="w-5 h-5" />,
                                title: "Simplicity First",
                                desc: "Kalau bisa simple, kenapa harus ribet? I fight entropy in code and design."
                            },
                            {
                                icon: <Atom className="w-5 h-5" />,
                                title: "First Principles",
                                desc: "Grounded in math, driven by science. Bagi saya, coding adalah bentuk terapan dari logika murni."
                            },
                            {
                                icon: <Fingerprint className="w-5 h-5" />,
                                title: "Soulful Craft",
                                desc: "Coding itu kayak nulis puisi buat mesin. It should be elegant, efficient, and clean."
                            }
                        ].map((item, i) => (
                            <motion.div key={i} variants={itemVariants} className="group">
                                <div className="mb-4 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                                    {item.icon}
                                </div>
                                <h3 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "1.5rem",
                                    fontWeight: 500,
                                    marginBottom: "0.75rem",
                                    letterSpacing: "-0.02em"
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

            {/* 3. ARCHIVE: Compact List (Old Format Refined) */}
            <section style={{ padding: "clamp(4rem, 8vh, 6rem) 0", backgroundColor: "var(--card-bg)" }}>
                <Container>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-end justify-between border-b border-[var(--border)]"
                        style={{ paddingBottom: "1.5rem", marginBottom: "2rem" }}
                    >
                        <div>
                            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] block mb-2">Navigation</span>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "clamp(2rem, 5vw, 2.5rem)",
                                fontWeight: 400,
                                margin: 0,
                                letterSpacing: "-0.02em"
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
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                        {[
                            { href: "/now", emoji: "⚡", title: "Now", desc: "Lagi sibuk apa? Current snapshot of priorities." },
                            { href: "/bookshelf", emoji: "📚", title: "Bookshelf", desc: "Tsundoku survivor. Reading log." },
                            { href: "/ideas", emoji: "💡", title: "Ideas", desc: "Gudang ide liar. Raw drafts & brain dumps." },
                            { href: "/links", emoji: "🔗", title: "Links", desc: "Bookmarks pilihan. Curated internet gems." },
                            { href: "/changelog", emoji: "📝", title: "Changelog", desc: "Sejarah update. Site evolution log." },
                            { href: "/til", emoji: "🎓", title: "TIL", desc: "Hari ini belajar apa? Bite-sized snippets." },
                            { href: "/uses", emoji: "🛠️", title: "Uses", desc: "Gear & Tools. My battle station stack." }
                        ].map((link) => (
                            <Link href={link.href} key={link.href} className="block group">
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ x: 3 }}
                                    className="relative overflow-hidden flex items-center gap-4 p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                                >
                                    {/* Line Transition */}
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-900 dark:bg-zinc-100 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                                    <span style={{ fontSize: "1.4rem", flexShrink: 0, width: "2rem", textAlign: "center" }}>
                                        {link.emoji}
                                    </span>

                                    <div className="flex-1 min-w-0 flex items-baseline justify-between gap-4">
                                        <div>
                                            <h4 style={{
                                                fontFamily: "'Playfair Display', serif",
                                                fontSize: "1.1rem",
                                                fontWeight: 500,
                                                letterSpacing: "-0.01em"
                                            }} className="text-zinc-900 dark:text-zinc-100">
                                                {link.title}
                                            </h4>
                                        </div>
                                        <p style={{
                                            color: "var(--text-secondary)",
                                            fontSize: "0.85rem",
                                            lineHeight: 1.4,
                                        }} className="truncate font-mono opacity-70 hidden sm:block">
                                            {link.desc}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                </Container>
            </section>

            {/* 4. FOOTER: Elevated Interactivity */}
            <section style={{ padding: "clamp(4rem, 8vh, 6rem) 0", textAlign: "center" }}>
                <Container>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.5rem, 5vw, 1.75rem)",
                            marginBottom: "2rem",
                            fontStyle: "italic",
                            color: "var(--text-secondary)"
                        }}>
                            "Stay hungry, stay foolish. Tapi jangan lupa makan."
                        </p>

                        <div className="flex gap-4">
                            <a href="https://x.com/scienfilix" target="_blank" rel="noopener noreferrer"
                                className="group bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                                style={{ padding: "0.6rem 1.25rem" }}
                            >
                                <span className="text-sm font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">Twitter</span>
                                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors -rotate-45 group-hover:rotate-0" />
                            </a>
                            <a href="https://github.com/mfazans23" target="_blank" rel="noopener noreferrer"
                                className="group bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                                style={{ padding: "0.6rem 1.25rem" }}
                            >
                                <span className="text-sm font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">GitHub</span>
                                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors -rotate-45 group-hover:rotate-0" />
                            </a>
                        </div>
                    </motion.div>
                </Container>
            </section>
        </div>
    );
}
