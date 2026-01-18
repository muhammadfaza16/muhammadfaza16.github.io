"use client";

import { Container } from "@/components/Container";
import Link from "next/link";
import {
    Code2,
    Palette,
    Zap,
    LayoutTemplate,
    Box,
    Type,
    Eye,
    Music,
    Terminal,
    Sparkles,
    Accessibility,
    Cpu,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

// --- Animation Variants ---
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

// --- Components ---
function TechCard({ icon: Icon, title, desc, tag }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: string;
    tag?: string;
}) {
    return (
        <motion.div
            variants={itemVariants}
            style={{
                padding: "clamp(1.25rem, 3vw, 1.5rem)",
                backgroundColor: "var(--card-bg)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                transition: "all 0.3s ease",
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
            className="hover:border-[var(--border-strong)] group"
        >
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "1rem"
            }}>
                <div style={{
                    width: "clamp(40px, 10vw, 48px)",
                    height: "clamp(40px, 10vw, 48px)",
                    borderRadius: "12px",
                    backgroundColor: "var(--hover-bg)",
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Icon className="w-5 h-5" />
                </div>
                {tag && (
                    <span style={{
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-mono)",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "99px",
                        backgroundColor: "var(--hover-bg)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border)"
                    }}>
                        {tag}
                    </span>
                )}
            </div>

            <h3 style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "clamp(1.1rem, 2.5vw, 1.25rem)",
                fontWeight: 500,
                marginBottom: "0.5rem",
                color: "var(--foreground)"
            }}>
                {title}
            </h3>

            <p style={{
                color: "var(--text-secondary)",
                fontSize: "clamp(0.875rem, 2vw, 0.95rem)",
                lineHeight: 1.6,
                margin: 0,
                flex: 1
            }}>
                {desc}
            </p>
        </motion.div>
    );
}

function FeatureRow({ icon: Icon, title, desc }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: React.ReactNode;
}) {
    return (
        <motion.div
            variants={itemVariants}
            style={{
                display: "flex",
                gap: "clamp(1rem, 3vw, 1.5rem)",
                padding: "clamp(1rem, 3vw, 1.5rem)",
                borderBottom: "1px solid var(--border)"
            }}
        >
            <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "var(--hover-bg)",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
            }}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h4 style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "var(--foreground)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                }}>
                    {title}
                </h4>
                <p style={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    fontSize: "0.95rem",
                    maxWidth: "50ch",
                    margin: 0
                }}>
                    {desc}
                </p>
            </div>
        </motion.div>
    );
}

export default function ColophonPage() {
    return (
        <div style={{ paddingBottom: "clamp(4rem, 8vh, 8rem)" }}>
            {/* Hero Section */}
            <section style={{
                minHeight: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "clamp(5rem, 12vh, 8rem)",
                paddingBottom: "clamp(2rem, 4vh, 3rem)"
            }}>
                <Container>
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={containerVariants}
                        className="animate-fade-in-up"
                    >
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.35rem 0.75rem",
                            backgroundColor: "var(--hover-bg)",
                            borderRadius: "99px",
                            fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                            fontFamily: "var(--font-mono)",
                            marginBottom: "clamp(1.5rem, 3vh, 2rem)"
                        }}>
                            <Terminal className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                            <span style={{ color: "var(--text-secondary)" }}>Colophon</span>
                        </div>

                        <motion.h1
                            variants={itemVariants}
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                                fontWeight: 400,
                                letterSpacing: "-0.03em",
                                lineHeight: 1.1,
                                marginBottom: "clamp(1rem, 2vh, 1.5rem)",
                                color: "var(--foreground)",
                                maxWidth: "16ch"
                            }}
                        >
                            Under the hood.
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            style={{
                                fontFamily: "'Source Serif 4', serif",
                                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                                color: "var(--text-secondary)",
                                maxWidth: "45ch",
                                lineHeight: 1.6,
                                margin: 0
                            }}
                        >
                            Dokumentasi teknis, stack yang digunakan, dan panduan fitur
                            untuk eksplorasi website ini. Karena transparansi itu seksi.
                        </motion.p>
                    </motion.div>
                </Container>
            </section>

            <Container>
                {/* Tech Stack */}
                <motion.section
                    initial="hidden"
                    animate="show"
                    variants={containerVariants}
                    className="animate-fade-in animation-delay-200"
                    style={{ marginBottom: "clamp(4rem, 8vh, 6rem)" }}
                >
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "clamp(1.5rem, 4vh, 2rem)"
                    }}>
                        <Cpu className="w-5 h-5" style={{ color: "var(--accent)" }} />
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.5rem, 3vw, 1.75rem)",
                            fontWeight: 500,
                            margin: 0
                        }}>
                            Tech Stack
                        </h2>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "1rem"
                    }}>
                        <TechCard
                            icon={Box}
                            title="Next.js 16"
                            desc="App Router, Server Components untuk performa, dan Turbopack buat DX yang ngebut."
                            tag="Core"
                        />
                        <TechCard
                            icon={Code2}
                            title="React 19"
                            desc="Library UI utama. Pakai fitur-fitur bleeding edge karena kenapa enggak?"
                            tag="UI"
                        />
                        <TechCard
                            icon={Palette}
                            title="Tailwind CSS 4"
                            desc="Styling engine. Utility-first, tapi banyak pakai custom CSS variables untuk theming."
                            tag="Style"
                        />
                        <TechCard
                            icon={Zap}
                            title="Framer Motion"
                            desc="Orchestrator animasi fluid yang bikin interaksi terasa 'hidup' dan organic."
                            tag="Animation"
                        />
                        <TechCard
                            icon={Type}
                            title="Typography"
                            desc="Playfair Display (Headings), Source Serif 4 (Body), dan Space Mono (UI/Code)."
                            tag="Fonts"
                        />
                        <TechCard
                            icon={LayoutTemplate}
                            title="Lucide React"
                            desc="Set ikon open-source yang konsisten, bersih, dan lightweight."
                            tag="Icons"
                        />
                    </div>
                </motion.section>

                {/* User Guide */}
                <motion.section
                    initial="hidden"
                    animate="show"
                    variants={containerVariants}
                    className="animate-fade-in animation-delay-300"
                    style={{ maxWidth: "48rem" }}
                >
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "clamp(1.5rem, 4vh, 2rem)"
                    }}>
                        <Sparkles className="w-5 h-5" style={{ color: "var(--accent)" }} />
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.5rem, 3vw, 1.75rem)",
                            fontWeight: 500,
                            margin: 0
                        }}>
                            User Guide
                        </h2>
                    </div>

                    <div style={{
                        backgroundColor: "var(--card-bg)",
                        borderRadius: "16px",
                        border: "1px solid var(--border)",
                        overflow: "hidden"
                    }}>
                        <FeatureRow
                            icon={Eye}
                            title="Read Mode"
                            desc="Klik ikon mata di pojok kanan bawah saat baca artikel untuk masuk mode fokus. Sidebar dan distraksi bakal ilang."
                        />
                        <FeatureRow
                            icon={Music}
                            title="Audio Player"
                            desc="Ada background music player yang persistent. Bisa di-pause atau skip kalau selera musik gue ga cocok sama lo."
                        />
                        <FeatureRow
                            icon={Terminal}
                            title="Secrets"
                            desc={
                                <span>
                                    Ada beberapa easter eggs tersembunyi. Coba <code className="text-xs bg-[var(--hover-bg)] px-1 py-0.5 rounded">↑ ↑ ↓ ↓ ← → ← → B A</code> di keyboard lo.
                                </span>
                            }
                        />
                        <FeatureRow
                            icon={Accessibility}
                            title="Accessibility"
                            desc="Support keyboard navigation, semantic HTML, dan 'Skip to Content' link buat screen reader."
                        />
                    </div>
                </motion.section>
            </Container>
        </div>
    );
}
