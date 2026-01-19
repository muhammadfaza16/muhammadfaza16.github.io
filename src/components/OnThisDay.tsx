"use client";

import { useEffect, useState, useRef } from "react";
import { getOnThisDay, HistoricEvent } from "@/data/onThisDay";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export function OnThisDay() {
    const [events, setEvents] = useState<HistoricEvent[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setEvents(getOnThisDay());
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const getCategoryColor = (category: string) => {
        const cat = category.toLowerCase();
        if (["history", "war", "politics"].some(c => cat.includes(c))) return "#f59e0b"; // Amber
        if (["technology", "tech", "science"].some(c => cat.includes(c))) return "#3b82f6"; // Blue
        if (["arts", "music", "film", "culture"].some(c => cat.includes(c))) return "#ec4899"; // Pink
        if (["space", "astronomy"].some(c => cat.includes(c))) return "#8b5cf6"; // Violet
        return "#64748b"; // Slade
    };

    const handleNext = () => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
            setIsVisible(true);
        }, 300);
    };

    const handlePrev = () => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
            setIsVisible(true);
        }, 300);
    };

    // Swipe handling
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const minSwipeDistance = 50;

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
        if (distance > minSwipeDistance) handleNext();
        else if (distance < -minSwipeDistance) handlePrev();
    };

    if (events.length === 0) return null;

    const event = events[currentIndex];
    const accentColor = getCategoryColor(event.category);

    return (
        <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                // @ts-ignore
                "--widget-accent": accentColor
            } as React.CSSProperties}
        >
            <div style={{
                borderRadius: "1.5rem",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                padding: "clamp(1.5rem, 4vw, 2rem)",
                position: "relative",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                transition: "all 0.5s ease"
            }}>
                {/* Bloom Effect */}
                <div style={{
                    position: "absolute",
                    inset: "0",
                    background: "var(--widget-accent)",
                    opacity: 0.05,
                    filter: "blur(80px)",
                    transform: "scale(0.8)",
                    zIndex: 0,
                    transition: "background 0.5s ease"
                }} />

                {/* Progress Bar */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "3px",
                    background: "var(--widget-accent)",
                    width: `${((currentIndex + 1) / events.length) * 100}%`,
                    transition: "width 0.5s ease, background 0.5s ease",
                    zIndex: 2
                }} />

                {/* Background Watermark */}
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(-10deg)",
                    fontSize: "clamp(4rem, 12vw, 8rem)",
                    opacity: 0.02,
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    zIndex: 0,
                    fontFamily: "var(--font-sans)",
                    color: "var(--foreground)"
                }}>
                    {event.year}
                </div>

                {/* Header */}
                <div
                    className="flex items-center justify-between relative z-10"
                    style={{ marginBottom: "2.5rem" }} // Inline style to force spacing
                >
                    <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "100px",
                        border: "1px solid var(--widget-accent)",
                        background: "rgba(var(--background-rgb), 0.5)",
                        backdropFilter: "blur(4px)"
                    }}>
                        <Calendar className="w-3 h-3" style={{ color: "var(--widget-accent)" }} />
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--widget-accent)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600
                        }}>
                            On This Day
                        </span>
                    </span>

                    <span style={{
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-mono)",
                        color: "var(--text-secondary)",
                        opacity: 0.5
                    }}>
                        {currentIndex + 1} / {events.length}
                    </span>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center", // Center vertically
                    position: "relative",
                    zIndex: 1,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(10px)",
                    transition: "all 0.4s ease"
                }}>
                    {/* Year */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.85rem",
                            color: "var(--widget-accent)",
                            display: "block",
                            marginBottom: "0.85rem" // Inline style to force spacing
                        }}>
                            {event.category} • {event.year}
                        </span>
                        <h3 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                            fontWeight: 500,
                            lineHeight: 1.2,
                            color: "var(--foreground)",
                            marginBottom: "1rem"
                        }}>
                            {event.title}
                        </h3>
                    </div>

                    <p style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "1.05rem",
                        lineHeight: 1.7,
                        color: "var(--text-secondary)",
                        marginBottom: "1.5rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                    }}>
                        {event.description}
                    </p>

                    <a href={`https://en.wikipedia.org/wiki/${event.year}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-[var(--widget-accent)] hover:underline decoration-1 underline-offset-4 w-fit"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}
                    >
                        <span>Read History</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>

                {/* Spacing Separator */}
                <div style={{
                    width: "100%",
                    height: "1px",
                    background: "var(--border)",
                    opacity: 0.5,
                    marginTop: "0.75rem",
                    marginBottom: "0.75rem"
                }} />

                {/* Footer Controls */}
                <div
                    className="flex items-center justify-between gap-2 relative z-10"
                    style={{
                        paddingTop: "0.25rem"
                    }}
                >
                    <button
                        onClick={handlePrev}
                        className="h-10 w-10 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] flex items-center justify-center transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Date Display */}
                    <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase"
                    }}>
                        {new Date(2000, event.month, event.day).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
                    </div>

                    <button
                        onClick={handleNext}
                        className="h-10 w-10 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] flex items-center justify-center transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

            </div>
        </div>
    );
}
