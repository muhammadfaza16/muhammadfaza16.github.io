"use client";

import React from "react";
import { Container } from "@/components/Container";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { ZenHideable } from "@/components/ZenHideable";
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import { motion } from "framer-motion";

const books = [
    { title: "Co-Intelligence", author: "Ethan Mollick", status: "Reading", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop", notes: "Living and working with AI. Not just using it, but collaborating with it.", colSpan: 2, color: "#6b7d5e" },
    { title: "StoryBrand", author: "Donald Miller", status: "Reading", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop", notes: "Clarifying the message. If you confuse, you'll lose.", colSpan: 1, color: "#6b7d5e" },
    { title: "Naval Almanack", author: "Naval Ravikant", status: "Favorite", imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df643?q=80&w=2070&auto=format&fit=crop", notes: "Wealth and happiness. The guide to playing long-term games.", colSpan: 1, color: "#8a7a50" },
    { title: "Psychology of Money", author: "Morgan Housel", status: "Favorite", imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop", notes: "Doing well with money is about behavior, not just knowledge.", colSpan: 2, color: "#8a7a50" },
];

export default function BookshelfPage() {
    return (
        <AtmosphericBackground variant="warm">
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
                                    Mentors <span style={{ color: "var(--ink-muted)" }}>on paper.</span>
                                </h2>
                                <p style={{
                                    fontSize: "clamp(1rem, 3vw, 1.1rem)",
                                    color: "var(--ink-secondary)",
                                    lineHeight: 1.6,
                                    margin: 0
                                }}>
                                    Kumpulan ide yang ngebentuk sistem operasi berpikir gue.
                                    Dari biologi perilaku sampe seni membangun narasi.
                                </p>
                            </div>
                        </Container>
                    </section>

                    {/* Frosted Glass Book Cards */}
                    <section style={{ marginTop: "2rem" }}>
                        <Container>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                                gridAutoFlow: "dense",
                                gap: "1rem"
                            }}>
                                {books.map((book, idx) => (
                                    <motion.div
                                        key={book.title}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                                        style={{
                                            gridColumn: book.colSpan === 2 ? "span 2" : "span 1",
                                            background: "var(--glass-bg)",
                                            backdropFilter: "var(--glass-blur)",
                                            WebkitBackdropFilter: "var(--glass-blur)",
                                            border: "1px solid var(--glass-border)",
                                            borderRadius: "16px",
                                            padding: "1.25rem",
                                            boxShadow: "var(--glass-shadow)",
                                            position: "relative",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                        }}
                                    >
                                        {/* Status Badge */}
                                        <div style={{
                                            display: "inline-block",
                                            fontSize: "0.65rem",
                                            fontWeight: 600,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            color: book.color,
                                            background: `${book.color}18`,
                                            padding: "0.2rem 0.6rem",
                                            borderRadius: "6px",
                                            marginBottom: "0.75rem",
                                        }}>
                                            {book.status}
                                        </div>

                                        <h3 style={{
                                            fontSize: "clamp(1rem, 3vw, 1.15rem)",
                                            fontWeight: 600,
                                            color: "var(--ink-primary)",
                                            margin: "0 0 0.25rem 0",
                                            lineHeight: 1.3
                                        }}>
                                            {book.title}
                                        </h3>
                                        <p style={{
                                            fontSize: "0.8rem",
                                            color: "var(--ink-muted)",
                                            margin: "0 0 0.75rem 0",
                                            fontWeight: 500
                                        }}>
                                            {book.author}
                                        </p>
                                        <p style={{
                                            fontSize: "0.82rem",
                                            color: "var(--ink-secondary)",
                                            fontStyle: "italic",
                                            lineHeight: 1.5,
                                            margin: 0,
                                            opacity: 0.8
                                        }}>
                                            &ldquo;{book.notes}&rdquo;
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </Container>
                    </section>
                </ZenHideable>
            </main>
        </AtmosphericBackground>
    );
}
