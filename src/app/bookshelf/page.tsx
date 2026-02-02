"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/Container";
import { IosBentoCard } from "@/components/sanctuary/IosBentoCard";
import { ZenHideable } from "@/components/ZenHideable";
import { BookOpen, ArrowLeft, Star, Clock, CheckCircle } from "lucide-react";
import { StandardBackButton } from "@/components/ui/StandardBackButton";
import Link from "next/link";
import { motion } from "framer-motion";

const GradientOrb = dynamic(() => import("@/components/GradientOrb").then(mod => mod.GradientOrb), { ssr: false });
const CosmicStars = dynamic(() => import("@/components/CosmicStars").then(mod => mod.CosmicStars), { ssr: false });
const MilkyWay = dynamic(() => import("@/components/MilkyWay").then(mod => mod.MilkyWay), { ssr: false });

const books = [
    { title: "Co-Intelligence", author: "Ethan Mollick", status: "Reading", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop", notes: "Living and working with AI. Not just using it, but collaborating with it.", colSpan: 2, color: "#ff9500" },
    { title: "StoryBrand", author: "Donald Miller", status: "Reading", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop", notes: "Clarifying the message. If you confuse, you'll lose.", colSpan: 1, color: "#ff9500" },
    { title: "Naval Almanack", author: "Naval Ravikant", status: "Favorite", imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df643?q=80&w=2070&auto=format&fit=crop", notes: "Wealth and happiness. The guide to playing long-term games.", colSpan: 1, color: "#f59e0b" },
    { title: "Psychology of Money", author: "Morgan Housel", status: "Favorite", imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop", notes: "Doing well with money is about behavior, not just knowledge.", colSpan: 2, color: "#f59e0b" },
];

export default function BookshelfPage() {
    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#050505",
            color: "white",
            position: "relative",
            overflowX: "hidden"
        }}>
            {/* Ambient Background */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <MilkyWay />
                <GradientOrb />
                <CosmicStars />
            </div>

            <main style={{ position: "relative", zIndex: 1, paddingBottom: "8rem" }}>
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
                                    marginBottom: "1.5rem"
                                }}>
                                    Mentors <span style={{ color: "rgba(255,255,255,0.4)" }}>on paper.</span>
                                </h2>
                                <p style={{
                                    fontSize: "clamp(1rem, 3vw, 1.1rem)",
                                    color: "rgba(255,255,255,0.6)",
                                    lineHeight: 1.6,
                                    margin: 0
                                }}>
                                    Kumpulan ide yang ngebentuk sistem operasi berpikir gue.
                                    Dari biologi perilaku sampe seni membangun narasi.
                                </p>
                            </div>
                        </Container>
                    </section>

                    {/* Bento Grid Content */}
                    <section style={{ marginTop: "2rem" }}>
                        <Container>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
                                gridAutoFlow: "dense",
                                gap: "1.5rem"
                            }}>
                                {books.map((book, idx) => (
                                    <IosBentoCard
                                        key={book.title}
                                        title={book.title}
                                        subtitle={`${book.author} • ${book.status}`}
                                        imageUrl={book.imageUrl}
                                        href="#"
                                        colSpan={book.colSpan}
                                        delay={idx * 0.1}
                                        accentColor={book.color}
                                    >
                                        <p style={{
                                            fontSize: "0.85rem",
                                            color: "rgba(255,255,255,0.5)",
                                            fontStyle: "italic",
                                            lineHeight: 1.4,
                                            margin: 0
                                        }}>
                                            "{book.notes}"
                                        </p>
                                    </IosBentoCard>
                                ))}
                            </div>
                        </Container>
                    </section>
                </ZenHideable>
            </main>
        </div>
    );
}
