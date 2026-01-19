"use client";

import { useEffect, useState, useRef } from "react";
import { getAllFacts, Fact } from "@/data/didYouKnow";
import { Lightbulb, Sparkles, Play, Pause, Shuffle, Copy, Check, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export function DidYouKnow() {
    const [facts, setFacts] = useState<Fact[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
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

    const getCategoryColor = (category: string) => {
        const cat = category.toLowerCase();
        if (["science", "physics", "chemistry"].some(c => cat.includes(c))) return "#0ea5e9"; // Sky
        if (["space", "astronomy"].some(c => cat.includes(c))) return "#8b5cf6"; // Violet
        if (["nature", "biology"].some(c => cat.includes(c))) return "#10b981"; // Emerald
        if (["history", "archeology"].some(c => cat.includes(c))) return "#f59e0b"; // Amber
        if (["tech", "technology"].some(c => cat.includes(c))) return "#3b82f6"; // Blue
        if (["philosophy", "psychology"].some(c => cat.includes(c))) return "#ec4899"; // Pink
        return "#64748b"; // Default Slate
    };

    const handleNext = () => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % facts.length);
            setProgress(0);
            setMindBlown(false);
            setIsVisible(true);
        }, 300);
    };

    const handlePrev = () => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + facts.length) % facts.length);
            setProgress(0);
            setMindBlown(false);
            setIsVisible(true);
        }, 300);
    };

    const handleShuffle = () => {
        setIsVisible(false);
        setTimeout(() => {
            let newIndex;
            do { newIndex = Math.floor(Math.random() * facts.length); }
            while (newIndex === currentIndex && facts.length > 1);
            setCurrentIndex(newIndex);
            setProgress(0);
            setMindBlown(false);
            setIsVisible(true);
        }, 300);
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

    if (facts.length === 0) return null;

    const fact = facts[currentIndex];
    const accentColor = getCategoryColor(fact.category);
    // Generate Wikipedia search link as fallback source
    const sourceLink = fact.source || `https://www.google.com/search?q=${encodeURIComponent(fact.text.slice(0, 80))}`;

    return (
        <div
            ref={containerRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={(e) => {
                // Prevent toggling if clicking a button or link
                if ((e.target as HTMLElement).closest('button, a')) return;
                togglePlay();
            }}
            style={{
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer", // Hint that it's clickable
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

                {/* Progress Bar - Auto-play Timer */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "3px",
                    background: "var(--widget-accent)",
                    width: `${progress}%`,
                    transition: "width 0.1s linear, background 0.5s ease", // Linear for timer
                    zIndex: 2
                }} />

                {/* Decorative Icon - Moved to background/bottom to avoid overlap */}
                <Lightbulb
                    className="absolute -bottom-4 -right-4 opacity-[0.03] w-32 h-32 -rotate-12 pointer-events-none"
                    style={{ color: "var(--widget-accent)", transition: "color 0.5s ease" }}
                />

                {/* Header Actions */}
                <div className="flex items-center justify-between relative z-10 mb-6">
                    {/* Brand Pill - Matches OnThisDay */}
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
                        <Lightbulb className="w-3 h-3" style={{ color: "var(--widget-accent)" }} />
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--widget-accent)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600
                        }}>
                            Eh, Tau Gak?
                        </span>
                    </span>

                    <div className="flex items-center gap-3">
                        <span style={{
                            fontSize: "0.7rem",
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-secondary)",
                            opacity: 0.5
                        }}>
                            {currentIndex + 1} / {facts.length}
                        </span>

                        <div className="w-[1px] h-3 bg-[var(--border)] opacity-50" />

                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleMindBlown}
                                className={`p-1.5 rounded-full transition-all active:scale-95 ${mindBlown ? "bg-[rgba(var(--accent-rgb),0.1)]" : "hover:bg-[var(--hover-bg)]"}`}
                                title="Mind Blown!"
                                style={{ color: mindBlown ? "var(--widget-accent)" : "var(--text-secondary)" }}
                            >
                                <span style={{ fontSize: "0.9rem" }}>🤯</span>
                            </button>
                            <button
                                onClick={handleCopy}
                                className="p-1.5 rounded-full hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] transition-all active:scale-95"
                                title="Copy"
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(10px)",
                    transition: "all 0.4s ease"
                }}>
                    {/* Category Pill */}
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "100px",
                        border: "1px solid var(--border)",
                        marginBottom: "1.5rem",
                        background: "var(--card-bg)"
                    }}>
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: "var(--widget-accent)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600
                        }}>
                            {fact.category}
                        </span>
                    </div>

                    {/* The Fact */}
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.15rem, 3vw, 1.35rem)",
                        lineHeight: 1.5,
                        color: "var(--foreground)",
                        fontStyle: "italic",
                        marginBottom: "1.5rem",
                        maxWidth: "90%"
                    }}>
                        "{fact.text}"
                    </p>

                    <a
                        href={sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--widget-accent)] transition-colors px-3 py-1 rounded-full hover:bg-[var(--hover-bg)]"
                        style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}
                    >
                        <span>Verifikasi</span>
                        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
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
                    className="flex items-center justify-between gap-3 relative z-10"
                    style={{
                        paddingTop: "0.25rem" // Additional padding if needed
                    }}
                >
                    <button
                        onClick={handlePrev}
                        className="h-10 w-10 shrink-0 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] flex items-center justify-center transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="h-10 w-10 shrink-0 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] flex items-center justify-center transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                        title={isAutoPlaying ? "Pause" : "Play"}
                    >
                        {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    <button
                        onClick={handleShuffle}
                        className="flex-1 h-10 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] flex items-center justify-center gap-2 transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)] px-4"
                    >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 500 }}>
                            Random
                        </span>
                    </button>

                    <button
                        onClick={handleNext}
                        className="h-10 w-10 shrink-0 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--widget-accent)] hover:border-[var(--widget-accent)] flex items-center justify-center transition-all active:scale-95 bg-[rgba(125,125,125,0.05)] hover:bg-[rgba(125,125,125,0.1)]"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
