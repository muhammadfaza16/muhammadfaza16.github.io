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

    // Auto-rotation removed as per user request

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    };

    if (events.length === 0) return null;

    const event = events[currentIndex];

    // Animation key to force re-render specific elements on change
    const animKey = `event-${currentIndex}`;

    return (
        <div
            style={{
                fontFamily: "'Playfair Display', serif",
                color: "var(--foreground)",
                position: "relative",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: "1rem",
                border: "1px solid var(--border)",
                padding: "clamp(1.5rem, 4vw, 2.5rem)",
                background: "var(--background)"
            }}
        >
            {/* Background "ON THIS DAY" Watermark */}
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "clamp(4rem, 15vw, 12rem)",
                opacity: 0.03,
                fontWeight: 700,
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: 0,
                fontFamily: "var(--font-sans)",
                letterSpacing: "-0.05em"
            }}>
                REWIND
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Header Badge - Cleaned up */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "2rem",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
                }}>
                    <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        background: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: "100px",
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-mono)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--text-secondary)"
                    }}>
                        <Calendar className="w-3 h-3" />
                        <span>Throwback Nih</span>
                    </span>

                    <span style={{
                        height: "1px",
                        width: "20px",
                        background: "var(--border)"
                    }} className="hidden sm:block" />

                    <span key={animKey} style={{
                        fontSize: "0.85rem",
                        fontFamily: "var(--font-mono)",
                        color: "var(--accent)",
                        animation: "fadeIn 0.5s ease-out"
                    }}>
                        {event.category}
                    </span>
                </div>

                {/* Content Container with Animation Key */}
                <div key={animKey} className="animate-fade-in-up">
                    {/* Massive Year */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "1.5rem",
                    }}>
                        <span style={{
                            fontSize: "clamp(3.5rem, 10vw, 8rem)", // Smaller on mobile
                            lineHeight: 0.9,
                            fontWeight: 400,
                            letterSpacing: "-0.04em"
                        }}>
                            {event.year}
                        </span>
                        <span style={{
                            fontSize: "1.5rem",
                            fontFamily: "var(--font-mono)",
                            color: "var(--accent)",
                            marginTop: "0.5rem",
                            opacity: 0.8
                        }}>
                            {new Date(event.year, event.month, event.day).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                        fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                        fontWeight: 500,
                        marginBottom: "1.5rem",
                        lineHeight: 1.2,
                    }}>
                        {event.title}
                    </h3>

                    {/* Description - Editorial Style */}
                    <div style={{ position: "relative" }}>
                        <p style={{
                            fontSize: "1.1rem",
                            lineHeight: 1.7,
                            color: "var(--text-secondary)",
                            fontFamily: "'Source Serif 4', serif",
                            maxWidth: "100%", // Use full width available
                            margin: 0,
                            marginBottom: "1.5rem"
                        }}>
                            <span style={{
                                float: "left",
                                fontSize: "clamp(2.5em, 8vw, 3.5em)",
                                lineHeight: 0.8,
                                paddingRight: "0.1em",
                                paddingTop: "0.1em",
                                color: "var(--foreground)"
                            }}>
                                {event.description.charAt(0)}
                            </span>
                            {event.description.slice(1)}
                        </p>

                        {/* Action / Context */}
                        <div>
                            <a href={`https://en.wikipedia.org/wiki/${event.year}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontSize: "0.9rem",
                                    fontFamily: "var(--font-mono)",
                                    color: "var(--foreground)",
                                    textDecoration: "none",
                                    paddingBottom: "2px",
                                    borderBottom: "1px solid var(--border)"
                                }}
                            >
                                Baca cerita lengkapnya
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Floating Navigation - Bottom Right */}
                {events.length > 1 && (
                    <div style={{
                        position: "absolute",
                        right: "0",
                        bottom: "0",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "0.5rem",
                        zIndex: 10,
                        background: "linear-gradient(to left, var(--background) 70%, transparent)",
                        paddingLeft: "2rem",
                        paddingTop: "0.5rem"
                    }}>
                        <button
                            onClick={handlePrev}
                            className="group hover:bg-[var(--hover-bg)] transition-colors backdrop-blur-sm"
                            style={{
                                padding: "0.75rem",
                                borderRadius: "50%",
                                border: "1px solid var(--border)",
                                color: "var(--foreground)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255,255,255,0.05)"
                            }}
                            aria-label="Previous event"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Counter - Between arrows */}
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--text-secondary)",
                            opacity: 0.6,
                            whiteSpace: "nowrap"
                        }}>
                            {currentIndex + 1}/{events.length}
                        </span>

                        <button
                            onClick={handleNext}
                            className="group hover:bg-[var(--hover-bg)] transition-colors backdrop-blur-sm"
                            style={{
                                padding: "0.75rem",
                                borderRadius: "50%",
                                border: "1px solid var(--border)",
                                color: "var(--foreground)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255,255,255,0.05)"
                            }}
                            aria-label="Next event"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
