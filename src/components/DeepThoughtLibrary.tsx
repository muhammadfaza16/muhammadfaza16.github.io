"use client";

import { useState, useEffect, useRef } from "react";
import { getAllDeepFacts, DeepFact } from "@/data/deepFacts";
import { BookOpen, ChevronLeft, ChevronRight, Shuffle, Quote, Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import { Container } from "./Container";
import { ScrollReveal } from "./ScrollReveal";

export function DeepThoughtLibrary() {
    const [facts, setFacts] = useState<DeepFact[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [copied, setCopied] = useState(false);

    // Swipe handling
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const minSwipeDistance = 50;

    useEffect(() => {
        setFacts(getAllDeepFacts());
        // Random start
        setCurrentIndex(Math.floor(Math.random() * getAllDeepFacts().length));
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                handlePrev();
            } else if (e.key === "ArrowRight") {
                handleNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [facts, isAnimating]); // Dependencies needed to access latest state if not using functional updates with refs, 
    // but here we call handlePrev/Next which use functional state updates or depend on current closure.
    // Actually handleNext checks isAnimating, which is state. 
    // Better to keep dependencies or use refs for isAnimating to avoid stale closures if the effect re-runs often.
    // Since handleNext/Prev are robust (check isAnimating), re-attaching listener is fine.

    const getCategoryColor = (category: string) => {
        const cat = category.toLowerCase();
        if (["physics", "astronomy", "neuroscience", "chemistry"].some(c => cat.includes(c))) return "#0ea5e9"; // Cyan/Sky
        if (["psychology", "mindfulness", "philosophy"].some(c => cat.includes(c))) return "#8b5cf6"; // Violet
        if (["growth", "productivity", "business", "finance"].some(c => cat.includes(c))) return "#10b981"; // Emerald
        if (["history", "sociology", "biography"].some(c => cat.includes(c))) return "#f59e0b"; // Amber
        if (["biology", "self-help", "love", "relationships"].some(c => cat.includes(c))) return "#ec4899"; // Pink
        return "#3b82f6"; // Default Blue
    };

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % facts.length);
            setIsAnimating(false);
        }, 300);
    };

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + facts.length) % facts.length);
            setIsAnimating(false);
        }, 300);
    };

    const handleShuffle = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            let newIndex;
            do { newIndex = Math.floor(Math.random() * facts.length); }
            while (newIndex === currentIndex && facts.length > 1);
            setCurrentIndex(newIndex);
            setIsAnimating(false);
        }, 300);
    };

    const handleCopy = () => {
        if (!fact) return;
        const textToCopy = `"${fact.text}" — ${fact.book} by ${fact.author}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const onTouchStart = (e: React.TouchEvent) => {
        touchEndX.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    };

    if (facts.length === 0) return null;

    const fact = facts[currentIndex];
    const accentColor = getCategoryColor(fact.category);

    return (
        <section style={{
            paddingTop: "clamp(4rem, 8vw, 8rem)",
            paddingBottom: "clamp(4rem, 8vw, 8rem)",
            position: "relative",
            overflow: "hidden",
            borderTop: "1px solid var(--border)",
            background: "linear-gradient(to bottom, var(--background), var(--card-bg))",
            // @ts-ignore
            "--daily-accent": accentColor // Define local variable for this section
        } as React.CSSProperties}>
            {/* Background Texture - Subtle Grid */}
            <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                backgroundSize: "4rem 4rem",
                opacity: 0.03,
                pointerEvents: "none"
            }} />

            <Container>
                <ScrollReveal>
                    {/* Section Header */}
                    <div style={{
                        textAlign: "center",
                        marginBottom: "clamp(2rem, 5vw, 4rem)",
                        position: "relative",
                        zIndex: 1
                    }}>
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--daily-accent)",
                            textTransform: "uppercase",
                            letterSpacing: "0.2em",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "1rem",
                            transition: "color 0.5s ease"
                        }}>
                            <BookOpen className="w-3 h-3" />
                            Library of Thoughts
                        </span>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(2rem, 5vw, 3.5rem)",
                            fontWeight: 400,
                            color: "var(--foreground)",
                            marginBottom: "1rem",
                            lineHeight: 1.1
                        }}>
                            The Universe & You.
                        </h2>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.1rem",
                            color: "var(--text-secondary)",
                            maxWidth: "45ch",
                            margin: "0 auto",
                            lineHeight: 1.6
                        }}>
                            Mencoba memahami cara kerja semesta, sambil pelan-pelan memahami kamu.
                        </p>
                    </div>

                    {/* The Fact Card */}
                    <div
                        style={{
                            maxWidth: "800px",
                            margin: "0 auto",
                            position: "relative"
                        }}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <div style={{
                            background: "var(--card-bg)",
                            border: "1px solid var(--border)",
                            borderRadius: "1.5rem",
                            padding: "clamp(1.5rem, 5vw, 4rem)",
                            position: "relative",
                            zIndex: 1,
                            boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                            transition: "opacity 0.3s ease, transform 0.3s ease",
                            opacity: isAnimating ? 0 : 1,
                            transform: isAnimating ? "translateY(10px) scale(0.98)" : "translateY(0) scale(1)",
                            overflow: "hidden"
                        }}>
                            {/* Card Background Bloom - Optimized */}
                            <div style={{
                                position: "absolute",
                                inset: "0",
                                background: `radial-gradient(circle at center, var(--daily-accent), transparent 70%)`,
                                opacity: 0.08,
                                zIndex: 0,
                                pointerEvents: "none", // Ensure it doesn't block clicks
                                transition: "background 0.5s ease"
                            }} />

                            {/* Progress Bar Top - Simple Line */}
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: "3px",
                                background: "var(--daily-accent)",
                                width: `${((currentIndex + 1) / facts.length) * 100}%`,
                                transition: "width 0.5s ease, background 0.5s ease",
                                zIndex: 2
                            }} />

                            {/* Decorative Quote Icon */}
                            <Quote
                                className="absolute top-4 left-4 md:top-8 md:left-8 opacity-20 w-8 h-8 md:w-12 md:h-12 rotate-180 pointer-events-none"
                                style={{ color: "var(--daily-accent)", transition: "color 0.5s ease" }}
                            />

                            {/* Action Buttons (Top Right) */}
                            <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-3">
                                <span style={{
                                    fontSize: "0.7rem",
                                    fontFamily: "var(--font-mono)",
                                    color: "var(--text-secondary)",
                                    opacity: 0.5
                                }}>
                                    {currentIndex + 1} / {facts.length}
                                </span>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 rounded-full hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--daily-accent)] transition-all active:scale-95"
                                    title="Copy to clipboard"
                                >
                                    {copied ?
                                        <Check className="w-4 h-4" style={{ color: "var(--daily-accent)" }} /> :
                                        <Copy className="w-4 h-4" />
                                    }
                                </button>
                            </div>

                            {/* Decorative Sparkles */}
                            <Sparkles
                                className="absolute bottom-4 left-4 opacity-20 w-8 h-8 pointer-events-none"
                                style={{ color: "var(--daily-accent)", transition: "color 0.5s ease" }}
                            />

                            {/* Book & Author Tag */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.75rem",
                                marginBottom: "2rem",
                                marginTop: "2rem",
                                flexWrap: "wrap",
                                position: "relative",
                                zIndex: 2
                            }}>
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent(fact.book + " by " + fact.author)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 rounded-full transition-all hover:bg-[var(--hover-bg)]"
                                    style={{
                                        textDecoration: "none",
                                        border: "1px solid var(--daily-accent)",
                                        padding: "0.5rem 1.75rem",
                                        transition: "border-color 0.5s ease"
                                    }}
                                >
                                    <span style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.75rem",
                                        color: "var(--daily-accent)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        fontWeight: 600,
                                        transition: "color 0.5s ease"
                                    }}>
                                        {fact.book}
                                    </span>
                                    <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" style={{ color: "var(--daily-accent)" }} />
                                </a>
                                <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75rem",
                                    color: "var(--text-secondary)"
                                }}>
                                    by {fact.author}
                                </span>
                            </div>

                            {/* Main Content */}
                            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                                <h3 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "clamp(1.5rem, 5vw, 2rem)",
                                    marginBottom: "1.5rem",
                                    color: "var(--foreground)",
                                    lineHeight: 1.2,
                                    fontStyle: "italic",
                                    fontWeight: 600
                                }}>
                                    {fact.title}
                                </h3>
                                <p style={{
                                    fontFamily: "'Source Serif 4', serif",
                                    fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
                                    lineHeight: 1.8,
                                    color: "var(--text-secondary)",
                                    marginBottom: 0,
                                    opacity: 0.9
                                }}>
                                    {fact.text}
                                </p>
                            </div>

                            {/* Controls - Thumb Friendly */}
                            <div
                                className="flex flex-col md:flex-row items-center justify-center gap-4"
                                style={{
                                    marginTop: "2rem",
                                    paddingTop: "2rem",
                                    borderTop: "1px solid var(--border)",
                                    position: "relative",
                                    zIndex: 10
                                }}
                            >
                                <div className="flex items-center gap-6 w-full md:w-auto justify-center">
                                    <button
                                        onClick={handlePrev}
                                        className="h-12 w-12 rounded-full transition-all border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--daily-accent)] hover:border-[var(--daily-accent)] active:scale-95 touch-manipulation flex items-center justify-center bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                                        aria-label="Previous thought"
                                    >
                                        <ChevronLeft className="w-5 h-5 absolute" style={{ transform: 'translateX(-1px)' }} />
                                    </button>

                                    {/* Shuffle - Middle on Mobile */}
                                    <button
                                        onClick={handleShuffle}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 h-12 px-8 rounded-full transition-all border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--daily-accent)] hover:border-[var(--daily-accent)] active:scale-95 touch-manipulation group bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                                    >
                                        <Shuffle className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>
                                            Shuffle
                                        </span>
                                    </button>

                                    <button
                                        onClick={handleNext}
                                        className="h-12 w-12 rounded-full transition-all border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--daily-accent)] hover:border-[var(--daily-accent)] active:scale-95 touch-manipulation flex items-center justify-center bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                                        aria-label="Next thought"
                                    >
                                        <ChevronRight className="w-5 h-5 absolute" style={{ transform: 'translateX(1px)' }} />
                                    </button>
                                </div>
                                <div className="hidden md:block text-xs text-[var(--text-secondary)] opacity-50 font-mono mt-2">
                                    Protip: Use Arrow Keys ← → to navigate
                                </div>
                            </div>

                        </div>
                    </div>
                </ScrollReveal>
            </Container>
        </section>
    );
}
