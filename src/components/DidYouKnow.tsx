"use client";

import { useEffect, useState, useRef } from "react";
import { getAllFacts, Fact } from "@/data/didYouKnow";
import { Lightbulb, Sparkles, Play, Pause } from "lucide-react";

export function DidYouKnow() {
    const [facts, setFacts] = useState<Fact[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setFacts(getAllFacts());
        // Randomize start
        setCurrentIndex(Math.floor(Math.random() * getAllFacts().length));

        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Auto-rotation logic with resume capability
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isAutoPlaying && facts.length > 1) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setCurrentIndex((curr) => (curr + 1) % facts.length);
                        return 0;
                    }
                    // Increment to reach 100% in 12 seconds (12000ms)
                    // Interval is 100ms -> 120 steps
                    // 100 / 120 ≈ 0.833% per step
                    return prev + 0.833;
                });
            }, 100);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isAutoPlaying, facts.length]);

    // Reset progress when manually changing slides? 
    // Actually user can't manually change slides here, only Play/Pause.
    // But if we toggle Play/Pause, we want progress to stay.

    // However, if the fact changes (e.g. valid rotation), progress resets to 0 (handled inside setProgress callback).

    const togglePlay = () => {
        setIsAutoPlaying((prev) => !prev);
    };

    if (facts.length === 0) return null;

    const fact = facts[currentIndex];
    const animKey = `fact-${currentIndex}`;

    return (
        <div
            style={{
                borderRadius: "1rem",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                padding: "clamp(1.5rem, 4vw, 2rem)", // Responsive padding
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Decorative Sparkles */}
            <Sparkles
                className="absolute top-4 right-4 text-[var(--accent)] opacity-20 w-12 h-12 rotate-12 pointer-events-none"
                strokeWidth={1}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(10px)",
                    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            background: "var(--accent)", // Solid blue
                            border: "none",
                            borderRadius: "100px",
                            fontSize: "0.7rem",
                            fontWeight: 500,
                            fontFamily: "var(--font-mono)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "white" // White text for contrast
                        }}>
                            <Lightbulb className="w-3 h-3" />
                            <span>Did You Know?</span>
                        </span>

                        <span key={animKey} style={{
                            fontSize: "0.8rem",
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-secondary)",
                            opacity: 0.8,
                            animation: "fadeIn 0.5s ease-out"
                        }}>
                            {fact.category}
                        </span>
                    </div>

                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePlay}
                        className="group hover:bg-[var(--hover-bg)] transition-colors"
                        style={{
                            padding: "0.5rem",
                            borderRadius: "50%",
                            border: "1px solid var(--border)",
                            color: "var(--foreground)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.05)",
                            zIndex: 10
                        }}
                        aria-label={isAutoPlaying ? "Pause" : "Play"}
                    >
                        {isAutoPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                        ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div key={animKey} className="animate-fade-in-up">
                    <p style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "1.1rem",
                        fontWeight: 400,
                        lineHeight: 1.7,
                        color: "var(--text-secondary)", // Match OnThisDay
                        marginBottom: "1.5rem"
                    }}>
                        {fact.text}
                    </p>

                    {/* Progress Bar */}
                    <div style={{
                        height: "2px",
                        width: "100%",
                        background: "var(--border)",
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "1px",
                        opacity: 0.8, // Always visible to show state
                        transition: "opacity 0.3s"
                    }}>
                        <div style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            background: "var(--accent)",
                            height: "100%",
                            width: `${progress}%`, // Controlled by state
                            transition: "width 0.1s linear" // Smooth update for 100ms interval
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
