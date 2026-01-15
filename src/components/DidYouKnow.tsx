"use client";

import { useEffect, useState } from "react";
import { getAllFacts, Fact } from "@/data/didYouKnow";
import { Lightbulb, Sparkles, Play, Pause, Shuffle, Copy, Check, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export function DidYouKnow() {
    const [facts, setFacts] = useState<Fact[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [copied, setCopied] = useState(false);
    const [mindBlown, setMindBlown] = useState(false);

    useEffect(() => {
        setFacts(getAllFacts());
        setCurrentIndex(Math.floor(Math.random() * getAllFacts().length));
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAutoPlaying && facts.length > 1) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setCurrentIndex((curr) => (curr + 1) % facts.length);
                        setMindBlown(false); // Reset reaction for new fact
                        return 0;
                    }
                    return prev + 0.833; // 12 seconds
                });
            }, 100);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [isAutoPlaying, facts.length]);

    const togglePlay = () => setIsAutoPlaying((prev) => !prev);

    const handleShuffle = () => {
        let newIndex;
        do { newIndex = Math.floor(Math.random() * facts.length); }
        while (newIndex === currentIndex && facts.length > 1);
        setCurrentIndex(newIndex);
        setProgress(0);
        setMindBlown(false);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + facts.length) % facts.length);
        setProgress(0);
        setMindBlown(false);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % facts.length);
        setProgress(0);
        setMindBlown(false);
    };

    const handleCopy = async () => {
        if (!facts[currentIndex]) return;
        try {
            await navigator.clipboard.writeText(facts[currentIndex].text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) { console.error("Failed to copy:", err); }
    };

    const handleMindBlown = () => {
        setMindBlown(true);
        // Could also persist to localStorage for "favorites" feature later
    };

    if (facts.length === 0) return null;

    const fact = facts[currentIndex];
    const animKey = `fact-${currentIndex}`;

    // Generate Wikipedia search link as fallback source
    const sourceLink = fact.source || `https://www.google.com/search?q=${encodeURIComponent(fact.text.slice(0, 80))}`;

    return (
        <div
            style={{
                borderRadius: "1rem",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                padding: "clamp(1.5rem, 4vw, 2rem)",
                position: "relative",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            {/* Decorative Sparkles */}
            <Sparkles
                className="absolute top-4 right-4 text-[var(--accent)] opacity-20 w-12 h-12 rotate-12 pointer-events-none"
                strokeWidth={1}
            />

            <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
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
                            background: "transparent",
                            border: "1px solid var(--border)",
                            borderRadius: "100px",
                            fontSize: "0.7rem",
                            fontWeight: 500,
                            fontFamily: "var(--font-mono)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "var(--text-secondary)"
                        }}>
                            <Lightbulb className="w-3 h-3" />
                            <span>Did You Know?</span>
                        </span>
                    </div>

                    {/* Controls Row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        {/* Prev Button */}
                        <button
                            onClick={handlePrev}
                            className="group hover:bg-[var(--hover-bg)] transition-colors"
                            style={{
                                padding: "0.4rem",
                                borderRadius: "50%",
                                border: "1px solid var(--border)",
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "transparent"
                            }}
                            aria-label="Previous fact"
                        >
                            <ChevronLeft className="w-3.5 h-3.5 group-hover:text-[var(--foreground)]" />
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={handleNext}
                            className="group hover:bg-[var(--hover-bg)] transition-colors"
                            style={{
                                padding: "0.4rem",
                                borderRadius: "50%",
                                border: "1px solid var(--border)",
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "transparent"
                            }}
                            aria-label="Next fact"
                        >
                            <ChevronRight className="w-3.5 h-3.5 group-hover:text-[var(--foreground)]" />
                        </button>

                        {/* Divider */}
                        <span style={{ width: "1px", height: "16px", background: "var(--border)", marginLeft: "0.25rem", marginRight: "0.25rem" }} />

                        {/* Shuffle Button */}
                        <button
                            onClick={handleShuffle}
                            className="group hover:bg-[var(--hover-bg)] transition-colors"
                            style={{
                                padding: "0.4rem",
                                borderRadius: "50%",
                                border: "1px solid var(--border)",
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "transparent"
                            }}
                            aria-label="Random fact"
                            title="Surprise me!"
                        >
                            <Shuffle className="w-3.5 h-3.5 group-hover:text-[var(--foreground)]" />
                        </button>

                        {/* Play/Pause Button */}
                        <button
                            onClick={togglePlay}
                            className="group hover:bg-[var(--hover-bg)] transition-colors"
                            style={{
                                padding: "0.4rem",
                                borderRadius: "50%",
                                border: "1px solid var(--border)",
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "transparent"
                            }}
                            aria-label={isAutoPlaying ? "Pause" : "Play"}
                        >
                            {isAutoPlaying ? (
                                <Pause className="w-3.5 h-3.5 fill-current group-hover:text-[var(--foreground)]" />
                            ) : (
                                <Play className="w-3.5 h-3.5 fill-current ml-0.5 group-hover:text-[var(--foreground)]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Category + Counter */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)"
                }}>
                    <span key={animKey} style={{ animation: "fadeIn 0.5s ease-out", color: "var(--accent)" }}>
                        {fact.category}
                    </span>
                    <span style={{ opacity: 0.6 }}>
                        {currentIndex + 1} / {facts.length}
                    </span>
                </div>

                {/* Content */}
                <div key={animKey} className="animate-fade-in-up" style={{ flex: 1 }}>
                    <p style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "1.1rem",
                        fontWeight: 400,
                        lineHeight: 1.7,
                        color: "var(--foreground)",
                        marginBottom: "1.5rem"
                    }}>
                        {fact.text}
                    </p>
                </div>

                {/* Footer: Actions + Progress */}
                <div>
                    {/* Action Buttons */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1rem"
                    }}>
                        {/* Left: Source Link */}
                        <a
                            href={sourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                fontSize: "0.75rem",
                                fontFamily: "var(--font-mono)",
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                opacity: 0.7,
                                transition: "opacity 0.2s"
                            }}
                        >
                            <ExternalLink className="w-3 h-3" />
                            <span className="group-hover:underline">Verifikasi</span>
                        </a>

                        {/* Right: Reactions */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {/* Copy Button */}
                            <button
                                onClick={handleCopy}
                                className="group hover:bg-[var(--hover-bg)] transition-all"
                                style={{
                                    padding: "0.4rem 0.6rem",
                                    borderRadius: "100px",
                                    border: "1px solid var(--border)",
                                    color: copied ? "var(--accent)" : "var(--text-secondary)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                    background: "transparent",
                                    fontSize: "0.7rem",
                                    fontFamily: "var(--font-mono)"
                                }}
                                aria-label="Copy fact"
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copied ? "Copied!" : "Copy"}</span>
                            </button>

                            {/* Mind Blown Button */}
                            <button
                                onClick={handleMindBlown}
                                className={`group transition-all ${mindBlown ? 'scale-110' : 'hover:scale-105'}`}
                                style={{
                                    padding: "0.4rem 0.6rem",
                                    borderRadius: "100px",
                                    border: mindBlown ? "1px solid var(--accent)" : "1px solid var(--border)",
                                    color: mindBlown ? "var(--accent)" : "var(--text-secondary)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                    background: mindBlown ? "rgba(var(--accent-rgb), 0.1)" : "transparent",
                                    fontSize: "0.8rem",
                                    transition: "all 0.2s ease"
                                }}
                                aria-label="Mind blown!"
                            >
                                <span>🤯</span>
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                        height: "2px",
                        width: "100%",
                        background: "var(--border)",
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "1px",
                        opacity: 0.8
                    }}>
                        <div style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            background: "var(--accent)",
                            height: "100%",
                            width: `${progress}%`,
                            transition: "width 0.1s linear"
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
