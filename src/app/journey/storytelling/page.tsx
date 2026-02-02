"use client";

import { Container } from "@/components/Container";
import Link from "next/link";
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import {
    PenLine,
    ArrowLeft,
    BookOpen,
    Link2,
    Lightbulb,
    CheckCircle2,
    Circle,
    Clock
} from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

interface Resource {
    title: string;
    type: "article" | "video" | "course" | "book" | "tool";
    completed?: boolean;
}

interface LogEntry {
    date: string;
    content: string;
}

export default function StorytellingPage() {
    const resources: Resource[] = [
        { title: "The Copywriter's Handbook - Robert Bly", type: "book", completed: false },
        { title: "Story - Robert McKee", type: "book", completed: false },
        { title: "Ogilvy on Advertising", type: "book", completed: false },
    ];

    const learningLog: LogEntry[] = [
        {
            date: "January 15, 2026",
            content: "Words are the original technology. Time to master them."
        },
    ];

    const keyInsights = [
        "Great copy is about the reader, not the writer",
        "Clarity beats cleverness every time",
        "Every sentence should earn its place",
    ];

    return (
        <div style={{ paddingBottom: "clamp(4rem, 8vh, 8rem)" }}>
            {/* Standard Back Button */}
            <StandardBackButton href="/journey" />
            <section style={{
                minHeight: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "clamp(5rem, 12vh, 8rem)",
                paddingBottom: "clamp(2rem, 4vh, 3rem)"
            }}>
                <Container>
                    <motion.div initial="hidden" animate="show" variants={containerVariants} className="animate-fade-in-up">


                        <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "clamp(1rem, 2vh, 1.5rem)" }}>
                            <div style={{
                                width: "clamp(48px, 12vw, 64px)",
                                height: "clamp(48px, 12vw, 64px)",
                                borderRadius: "16px",
                                backgroundColor: "var(--hover-bg)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--accent)"
                            }}>
                                <PenLine className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "clamp(2rem, 6vw, 3rem)",
                                    fontWeight: 400,
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.1
                                }}>
                                    Storytelling & Copywriting
                                </h1>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    marginTop: "0.5rem",
                                    fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                                    fontFamily: "var(--font-mono)",
                                    color: "var(--text-muted)"
                                }}>
                                    <Circle className="w-3 h-3" />
                                    Planned
                                </div>
                            </div>
                        </motion.div>

                        <motion.p variants={itemVariants} style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                            color: "var(--text-secondary)",
                            maxWidth: "55ch",
                            lineHeight: 1.6
                        }}>
                            The art of words that move people. Copywriting, narrative structures, dan emotional hooks.
                        </motion.p>
                    </motion.div>
                </Container>
            </section>

            <Container>
                <div className="animate-fade-in animation-delay-200" style={{ maxWidth: "52rem" }}>

                    <motion.section initial="hidden" animate="show" variants={containerVariants} style={{ marginBottom: "clamp(3rem, 6vh, 4rem)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "clamp(1.25rem, 3vh, 1.75rem)" }}>
                            <Lightbulb className="w-4 h-4" style={{ color: "var(--accent)" }} />
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.25rem, 3vw, 1.5rem)", fontWeight: 500, margin: 0 }}>Key Insights</h2>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {keyInsights.map((insight, i) => (
                                <motion.div key={i} variants={itemVariants} style={{ padding: "clamp(1rem, 2.5vw, 1.25rem)", backgroundColor: "var(--card-bg)", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "clamp(0.9rem, 2vw, 1rem)", lineHeight: 1.6 }}>
                                    {insight}
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    <motion.section initial="hidden" animate="show" variants={containerVariants} style={{ marginBottom: "clamp(3rem, 6vh, 4rem)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "clamp(1.25rem, 3vh, 1.75rem)" }}>
                            <Link2 className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.25rem, 3vw, 1.5rem)", fontWeight: 500, margin: 0 }}>Resources</h2>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {resources.map((resource, i) => (
                                <motion.div key={i} variants={itemVariants} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "clamp(0.75rem, 2vw, 1rem)", borderRadius: "10px", border: "1px solid var(--border)", backgroundColor: resource.completed ? "var(--hover-bg)" : "transparent" }}>
                                    {resource.completed ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} /> : <Circle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />}
                                    <span style={{ flex: 1, fontSize: "clamp(0.9rem, 2vw, 1rem)", textDecoration: resource.completed ? "line-through" : "none", color: resource.completed ? "var(--text-muted)" : "var(--foreground)" }}>{resource.title}</span>
                                    <span style={{ fontSize: "clamp(0.65rem, 1.5vw, 0.7rem)", fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--text-muted)", padding: "0.2rem 0.5rem", backgroundColor: "var(--hover-bg)", borderRadius: "4px" }}>{resource.type}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    <motion.section initial="hidden" animate="show" variants={containerVariants}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "clamp(1.25rem, 3vh, 1.75rem)" }}>
                            <BookOpen className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.25rem, 3vw, 1.5rem)", fontWeight: 500, margin: 0 }}>Learning Log</h2>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1.25rem, 3vh, 1.75rem)" }}>
                            {learningLog.map((entry, i) => (
                                <motion.div key={i} variants={itemVariants} style={{ paddingLeft: "clamp(1rem, 2.5vw, 1.5rem)", borderLeft: "2px solid var(--border)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                        <Clock className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                                        <span style={{ fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{entry.date}</span>
                                    </div>
                                    <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(0.95rem, 2.2vw, 1.05rem)", lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>{entry.content}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                </div>
            </Container>
        </div>
    );
}
