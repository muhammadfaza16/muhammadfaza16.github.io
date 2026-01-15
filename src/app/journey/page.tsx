"use client";

import { Container } from "@/components/Container";
import Link from "next/link";
import {
    Compass,
    Target,
    BookOpen,
    Brain,
    Megaphone,
    Globe,
    Sparkles,
    Building2,
    TrendingUp,
    ArrowRight,
    CheckCircle2,
    Circle,
    Lightbulb,
    PenLine
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

// --- Types ---
interface LearningArea {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    status: "in-progress" | "planned" | "completed";
    progress?: number;
    href: string;
}

interface VisionStep {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    isActive?: boolean;
}

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
            <Compass className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
            <span style={{ color: "var(--text-secondary)" }}>The Journey</span>
        </div>
    );
}

function LearningCard({ item }: { item: LearningArea }) {
    const Icon = item.icon;
    const statusColors = {
        "in-progress": "#22c55e",
        "planned": "var(--text-muted)",
        "completed": "var(--accent)"
    };
    const statusLabels = {
        "in-progress": "In Progress",
        "planned": "Planned",
        "completed": "Completed"
    };

    return (
        <Link href={item.href} className="block group">
            <motion.div
                variants={itemVariants}
                style={{
                    padding: "clamp(1.25rem, 3vw, 1.75rem)",
                    backgroundColor: "var(--card-bg)",
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    transition: "all 0.3s ease",
                    height: "100%"
                }}
                className="hover:border-[var(--border-strong)]"
            >
                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "clamp(0.75rem, 2vh, 1rem)"
                }}>
                    <div style={{
                        width: "clamp(40px, 10vw, 48px)",
                        height: "clamp(40px, 10vw, 48px)",
                        borderRadius: "12px",
                        backgroundColor: "var(--hover-bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent)"
                    }}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "clamp(0.65rem, 1.5vw, 0.7rem)",
                        fontFamily: "var(--font-mono)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: statusColors[item.status]
                    }}>
                        {item.status === "completed" ? (
                            <CheckCircle2 className="w-3 h-3" />
                        ) : item.status === "in-progress" ? (
                            <span style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: statusColors[item.status],
                                animation: "pulse 2s ease-in-out infinite"
                            }} />
                        ) : (
                            <Circle className="w-3 h-3" />
                        )}
                        {statusLabels[item.status]}
                    </div>
                </div>

                <h3 style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "clamp(1.1rem, 2.8vw, 1.25rem)",
                    fontWeight: 500,
                    marginBottom: "0.5rem",
                    lineHeight: 1.3
                }}>
                    {item.title}
                    <ArrowRight className="w-4 h-4 inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </h3>
                <p style={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    fontSize: "clamp(0.875rem, 2vw, 0.95rem)",
                    margin: 0
                }}>
                    {item.description}
                </p>

                {item.progress !== undefined && (
                    <div style={{ marginTop: "clamp(0.75rem, 2vh, 1rem)" }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "0.35rem",
                            fontSize: "clamp(0.65rem, 1.5vw, 0.7rem)",
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-muted)"
                        }}>
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                        </div>
                        <div style={{
                            height: "4px",
                            backgroundColor: "var(--hover-bg)",
                            borderRadius: "2px",
                            overflow: "hidden"
                        }}>
                            <div style={{
                                width: `${item.progress}%`,
                                height: "100%",
                                backgroundColor: "var(--accent)",
                                borderRadius: "2px",
                                transition: "width 0.5s ease"
                            }} />
                        </div>
                    </div>
                )}
            </motion.div>
        </Link>
    );
}

function VisionTimeline({ steps }: { steps: VisionStep[] }) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0"
        }}>
            {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        style={{
                            display: "flex",
                            gap: "clamp(1rem, 3vw, 1.5rem)",
                            position: "relative"
                        }}
                    >
                        {/* Timeline line */}
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flexShrink: 0
                        }}>
                            <div style={{
                                width: "clamp(40px, 10vw, 48px)",
                                height: "clamp(40px, 10vw, 48px)",
                                borderRadius: "50%",
                                backgroundColor: step.isActive ? "var(--accent)" : "var(--hover-bg)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: step.isActive ? "var(--background)" : "var(--text-secondary)",
                                border: step.isActive ? "none" : "1px solid var(--border)",
                                transition: "all 0.3s ease",
                                zIndex: 1
                            }}>
                                <Icon className="w-5 h-5" />
                            </div>
                            {index < steps.length - 1 && (
                                <div style={{
                                    width: "2px",
                                    flex: 1,
                                    minHeight: "clamp(2rem, 4vh, 3rem)",
                                    backgroundColor: "var(--border)"
                                }} />
                            )}
                        </div>

                        {/* Content */}
                        <div style={{
                            paddingBottom: index < steps.length - 1 ? "clamp(1.5rem, 3vh, 2rem)" : 0,
                            flex: 1
                        }}>
                            <h3 style={{
                                fontFamily: "'Source Serif 4', serif",
                                fontSize: "clamp(1.1rem, 2.8vw, 1.25rem)",
                                fontWeight: 500,
                                marginBottom: "0.35rem",
                                lineHeight: 1.3,
                                color: step.isActive ? "var(--foreground)" : "var(--text-secondary)"
                            }}>
                                {step.title}
                            </h3>
                            <p style={{
                                color: "var(--text-muted)",
                                lineHeight: 1.6,
                                fontSize: "clamp(0.875rem, 2vw, 0.95rem)",
                                margin: 0
                            }}>
                                {step.description}
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

export default function JourneyPage() {
    const learningAreas: LearningArea[] = [
        {
            icon: Brain,
            title: "AI Agent Development",
            description: "Building autonomous AI systems - LLM orchestration, tool-use patterns, dan sistem yang bisa 'mikir' sendiri.",
            status: "in-progress",
            progress: 35,
            href: "/journey/ai-agent"
        },
        {
            icon: Megaphone,
            title: "Brand Building",
            description: "Crafting authentic personal and product brands. Learning to tell stories that resonate.",
            status: "in-progress",
            progress: 20,
            href: "/journey/brand-building"
        },
        {
            icon: Lightbulb,
            title: "Psychology & Buying Behavior",
            description: "Understanding the 'why' behind decisions. Consumer psychology, behavioral economics, dan persuasion principles.",
            status: "planned",
            href: "/journey/psychology"
        },
        {
            icon: PenLine,
            title: "Storytelling & Copywriting",
            description: "The art of words that move people. Copywriting, narrative structures, dan emotional hooks.",
            status: "planned",
            href: "/journey/storytelling"
        },
        {
            icon: Globe,
            title: "English Mastery",
            description: "Leveling up communication skills. From good enough to genuinely fluent.",
            status: "in-progress",
            progress: 60,
            href: "/journey/english"
        },
        {
            icon: TrendingUp,
            title: "Marketing Fundamentals",
            description: "Growth strategies, user acquisition, dan bagaimana caranya biar orang tau produk lo exist.",
            status: "planned",
            href: "/journey/marketing"
        }
    ];

    const visionSteps: VisionStep[] = [
        {
            icon: BookOpen,
            title: "Learn & Build Skills",
            description: "Master the fundamentals - AI, branding, psychology, marketing. Build the toolkit.",
            isActive: true
        },
        {
            icon: Sparkles,
            title: "Build IT/AI Solutions",
            description: "Create products that solve real problems. Start with AI-powered tools and services.",
            isActive: false
        },
        {
            icon: Building2,
            title: "Multiple Businesses",
            description: "Diversify. Build multiple revenue streams from different products and services.",
            isActive: false
        },
        {
            icon: TrendingUp,
            title: "Scale",
            description: "Grow beyond limits. Systems, teams, dan leverage untuk multiply impact.",
            isActive: false
        }
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
                            2026: Year of building.
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            style={{
                                fontFamily: "'Source Serif 4', serif",
                                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                                color: "var(--text-secondary)",
                                maxWidth: "48ch",
                                lineHeight: 1.6,
                                margin: 0
                            }}
                        >
                            A documentation of the journey from learning to creating.
                            This is where I track what I&apos;m learning, building, and becoming.
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
                            Started: January 2026 · Last updated: January 15, 2026
                        </motion.p>
                    </motion.div>
                </Container>
            </section>

            {/* Long-term Vision Section */}
            <Container>
                <motion.section
                    initial="hidden"
                    animate="show"
                    variants={containerVariants}
                    className="animate-fade-in animation-delay-200"
                    style={{
                        maxWidth: "42rem",
                        marginBottom: "clamp(3rem, 6vh, 4rem)"
                    }}
                >
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "clamp(1.25rem, 3vh, 1.75rem)"
                    }}>
                        <Target className="w-4 h-4" style={{ color: "var(--accent)" }} />
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                            fontWeight: 500,
                            margin: 0
                        }}>
                            The Vision
                        </h2>
                    </div>

                    <VisionTimeline steps={visionSteps} />
                </motion.section>
            </Container>

            {/* Learning Areas Section */}
            <Container>
                <motion.section
                    initial="hidden"
                    animate="show"
                    variants={containerVariants}
                    className="animate-fade-in animation-delay-300"
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
                        <BookOpen className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                            fontWeight: 500,
                            margin: 0
                        }}>
                            Learning Areas
                        </h2>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                        gap: "clamp(1rem, 3vw, 1.25rem)"
                    }}>
                        {learningAreas.map((item, i) => (
                            <LearningCard key={i} item={item} />
                        ))}
                    </div>
                </motion.section>
            </Container>

            {/* Footer Quote */}
            <Container>
                <div style={{
                    marginTop: "clamp(1rem, 2vh, 2rem)",
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
                        lineHeight: 1.5
                    }}>
                        &quot;The journey of a thousand miles begins with one step.&quot;
                    </p>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)",
                        color: "var(--text-muted)",
                        marginTop: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em"
                    }}>
                        — Lao Tzu
                    </p>
                </div>
            </Container>
        </div>
    );
}
