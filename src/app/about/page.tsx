"use client";

import { Container } from "@/components/Container";
import Link from "next/link";
import {
    MapPin,
    ArrowRight,
    MousePointer2,
    Fingerprint,
    Atom,
    Zap,
    BookOpen,
    Lightbulb,
    Link2,
    Clock,
    GraduationCap,
    Monitor,
    User,
    Compass
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
function StatusPill() {
    return (
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
            <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                animation: "pulse 2s ease-in-out infinite"
            }} />
            <span style={{ color: "var(--text-secondary)" }}>Online</span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ color: "var(--text-muted)" }}>Jakarta</span>
        </div>
    );
}

function PrincipleCard({ icon: Icon, title, desc }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: string
}) {
    return (
        <motion.div
            variants={itemVariants}
            style={{
                padding: "clamp(1.25rem, 3vw, 1.75rem)",
                backgroundColor: "var(--card-bg)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                transition: "all 0.3s ease"
            }}
            className="hover:border-[var(--border-strong)]"
        >
            <div style={{
                width: "clamp(40px, 10vw, 48px)",
                height: "clamp(40px, 10vw, 48px)",
                borderRadius: "12px",
                backgroundColor: "var(--hover-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "clamp(1rem, 2vh, 1.25rem)",
                color: "var(--accent)"
            }}>
                <Icon className="w-5 h-5" />
            </div>
            <h3 style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "clamp(1.1rem, 2.8vw, 1.25rem)",
                fontWeight: 500,
                marginBottom: "0.5rem",
                lineHeight: 1.3
            }}>
                {title}
            </h3>
            <p style={{
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                fontSize: "clamp(0.875rem, 2vw, 0.95rem)",
                margin: 0
            }}>
                {desc}
            </p>
        </motion.div>
    );
}

function ArchiveLink({ href, icon: Icon, title, desc }: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: string
}) {
    return (
        <Link href={href} className="block group">
            <motion.div
                variants={itemVariants}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "clamp(0.875rem, 2.5vw, 1rem)",
                    padding: "clamp(0.875rem, 2.5vw, 1rem)",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--card-bg)",
                    transition: "all 0.2s ease"
                }}
                className="hover:border-[var(--border-strong)]"
            >
                <div style={{
                    width: "clamp(36px, 9vw, 40px)",
                    height: "clamp(36px, 9vw, 40px)",
                    borderRadius: "10px",
                    backgroundColor: "var(--hover-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "var(--accent)"
                }}>
                    <Icon className="w-4 h-4" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
                        fontWeight: 500,
                        marginBottom: "0.15rem"
                    }}>
                        {title}
                    </h4>
                    <p style={{
                        color: "var(--text-muted)",
                        fontSize: "clamp(0.75rem, 1.8vw, 0.8rem)",
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}>
                        {desc}
                    </p>
                </div>
                <ArrowRight
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    style={{ color: "var(--text-muted)" }}
                />
            </motion.div>
        </Link>
    );
}

export default function AboutPage() {
    const principles = [
        {
            icon: MousePointer2,
            title: "Simplicity First",
            desc: "Kompleksitas adalah hutang. Setiap fitur yang gak perlu adalah beban yang harus dibayar nanti."
        },
        {
            icon: Atom,
            title: "First Principles",
            desc: "Jangan percaya best practices secara buta. Breakdown sampai ke akar, rebuild dari situ."
        },
        {
            icon: Fingerprint,
            title: "Soulful Craft",
            desc: "Kode yang bagus itu kayak prosa yang bagus — tiap baris punya alasan untuk ada."
        }
    ];

    const archiveLinks = [
        { href: "/now", icon: Zap, title: "Now", desc: "Lagi sibuk apa sekarang" },
        { href: "/journey", icon: Compass, title: "Journey", desc: "Long-term goals & learning log" },
        { href: "/bookshelf", icon: BookOpen, title: "Bookshelf", desc: "Koleksi bacaan" },
        { href: "/ideas", icon: Lightbulb, title: "Ideas", desc: "Gudang ide mentah" },
        { href: "/links", icon: Link2, title: "Links", desc: "Bookmark pilihan" },
        { href: "/changelog", icon: Clock, title: "Changelog", desc: "Timeline perjalanan" },
        { href: "/til", icon: GraduationCap, title: "TIL", desc: "Catatan harian" },
        { href: "/uses", icon: Monitor, title: "Uses", desc: "Gear dan tools" }
    ];

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
                        <StatusPill />

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
                            I turn caffeine into code.
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
                            Halo, gue Faza. Cuma orang biasa yang suka ngoding sambil ngopi.
                            Ini personal log gue. Kumpulan eksperimen, catatan teknis,
                            dan hal-hal random yang gue kerjain.
                        </motion.p>

                        <motion.p
                            variants={itemVariants}
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                                color: "var(--text-muted)",
                                marginTop: "clamp(1.5rem, 3vh, 2rem)"
                            }}
                        >
                            Software Engineer · Professional Overthinker · Part-time Lover
                        </motion.p>
                    </motion.div>
                </Container>
            </section>

            {/* Principles Section */}
            <Container>
                <motion.section
                    initial="hidden"
                    animate="show"
                    variants={containerVariants}
                    className="animate-fade-in animation-delay-200"
                    style={{
                        maxWidth: "52rem",
                        marginBottom: "clamp(3rem, 6vh, 4rem)"
                    }}
                >
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "clamp(1.25rem, 3vh, 1.75rem)"
                    }}>
                        <User className="w-4 h-4" style={{ color: "var(--accent)" }} />
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                            fontWeight: 500,
                            margin: 0
                        }}>
                            Principles
                        </h2>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                        gap: "clamp(1rem, 3vw, 1.25rem)"
                    }}>
                        {principles.map((item, i) => (
                            <PrincipleCard key={i} {...item} />
                        ))}
                    </div>
                </motion.section>
            </Container>

            {/* Archive Section */}
            <Container>
                <motion.section
                    initial="hidden"
                    animate="show"
                    variants={containerVariants}
                    className="animate-fade-in animation-delay-300"
                    style={{ maxWidth: "42rem" }}
                >
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "clamp(1.25rem, 3vh, 1.75rem)"
                    }}>
                        <BookOpen className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                            fontWeight: 500,
                            margin: 0
                        }}>
                            The Archive
                        </h2>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                        gap: "clamp(0.75rem, 2vh, 1rem)"
                    }}>
                        {archiveLinks.map((link) => (
                            <ArchiveLink key={link.href} {...link} />
                        ))}
                    </div>
                </motion.section>
            </Container>

            {/* Footer Section */}
            <Container>
                <div style={{
                    marginTop: "clamp(3rem, 6vh, 4rem)",
                    paddingTop: "clamp(2rem, 4vh, 3rem)",
                    borderTop: "1px solid var(--border)",
                    textAlign: "center",
                    maxWidth: "42rem"
                }}>
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
                        fontStyle: "italic",
                        color: "var(--text-secondary)",
                        maxWidth: "35ch",
                        margin: "0 auto",
                        lineHeight: 1.5,
                        marginBottom: "clamp(1.5rem, 3vh, 2rem)"
                    }}>
                        "Stay hungry, stay foolish. Tapi jangan lupa makan."
                    </p>

                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "clamp(0.75rem, 2vw, 1rem)",
                        flexWrap: "wrap"
                    }}>
                        <a
                            href="https://x.com/scienfilix"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.5rem 1rem",
                                backgroundColor: "var(--hover-bg)",
                                borderRadius: "99px",
                                fontSize: "clamp(0.75rem, 1.8vw, 0.8rem)",
                                fontFamily: "var(--font-mono)",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                transition: "all 0.2s ease"
                            }}
                            className="hover:bg-[var(--card-bg)]"
                        >
                            Twitter
                            <ArrowRight className="w-3 h-3" style={{ transform: "rotate(-45deg)" }} />
                        </a>
                        <a
                            href="https://github.com/mfazans23"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.5rem 1rem",
                                backgroundColor: "var(--hover-bg)",
                                borderRadius: "99px",
                                fontSize: "clamp(0.75rem, 1.8vw, 0.8rem)",
                                fontFamily: "var(--font-mono)",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                transition: "all 0.2s ease"
                            }}
                            className="hover:bg-[var(--card-bg)]"
                        >
                            GitHub
                            <ArrowRight className="w-3 h-3" style={{ transform: "rotate(-45deg)" }} />
                        </a>
                    </div>
                </div>
            </Container>
        </div>
    );
}
