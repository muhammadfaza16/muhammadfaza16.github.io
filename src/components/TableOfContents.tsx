"use client";

import { useEffect, useState, useCallback } from "react";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    items: TocItem[];
    mode?: "mobile" | "desktop" | "auto";
}

export function TableOfContents({ items, mode = "auto" }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    // Calculate active section based on scroll position
    const updateActiveSection = useCallback(() => {
        if (items.length === 0) return;

        const scrollY = window.scrollY;
        // Activation point at 350px from top - testing generous threshold
        const activationPoint = scrollY + 350;

        // Find the section whose anchor is closest to (but before) the activation point
        let currentSection = items[0]?.id || "";

        for (const item of items) {
            const element = document.getElementById(item.id);
            if (element) {
                const elementTop = element.getBoundingClientRect().top + scrollY;
                if (elementTop <= activationPoint) {
                    currentSection = item.id;
                } else {
                    break;
                }
            }
        }

        setActiveId(currentSection);
    }, [items]);

    // Track scroll for active section and reading progress
    useEffect(() => {
        const handleScroll = () => {
            // Update active section
            updateActiveSection();

            // Update reading progress
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setReadingProgress(Math.round((currentScroll / scrollHeight) * 100));
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Initial calculation
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [updateActiveSection]);

    if (items.length === 0) return null;

    // Get indentation based on header level
    const getIndent = (level: number) => {
        if (level === 2) return "0";
        if (level === 3) return "1rem";
        return "0";
    };

    return (
        <>
            {/* Mobile TOC - Collapsible */}
            {(mode === "mobile" || mode === "auto") && (
                <nav className={`mb-12 bg-[var(--card-bg)] rounded-xl border border-[var(--border)] animate-fade-in overflow-hidden ${mode === "auto" ? "lg:hidden" : ""}`}>
                    {/* Collapsible Header */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full p-6 flex items-center justify-between text-left hover:bg-[var(--card-hover)] transition-colors"
                        aria-expanded={isExpanded}
                    >
                        <h4 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1rem",
                            fontWeight: 600,
                            margin: 0,
                        }}>
                            Table of Contents
                        </h4>
                        <span
                            className="text-[var(--text-secondary)] transition-transform duration-300"
                            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </button>

                    {/* Collapsible Content */}
                    <div
                        className="transition-all duration-300 ease-in-out overflow-hidden"
                        style={{
                            maxHeight: isExpanded ? `${items.length * 50 + 32}px` : "0",
                            opacity: isExpanded ? 1 : 0
                        }}
                    >
                        <ul style={{ listStyle: "none", padding: "0 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {items.map((item) => (
                                <li key={item.id} style={{ paddingLeft: getIndent(item.level) }}>
                                    <a
                                        href={`#${item.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveId(item.id);
                                            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                                            setIsExpanded(false);
                                        }}
                                        style={{
                                            fontSize: item.level === 3 ? "0.9rem" : "0.95rem",
                                            color: activeId === item.id ? "var(--foreground)" : "var(--text-secondary)",
                                            opacity: item.level === 3 ? 0.85 : 1,
                                            textDecoration: "none",
                                            fontWeight: activeId === item.id ? 500 : 400,
                                            transition: "all 0.2s ease"
                                        }}
                                        className="hover:text-[var(--foreground)] hover:translate-x-1 inline-block transition-all"
                                    >
                                        {item.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            )}

            {/* Desktop TOC - Sticky Sidebar */}
            {(mode === "desktop" || mode === "auto") && (
                <nav className={`sticky top-24 self-start ml-8 animate-fade-in animation-delay-300 ${mode === "auto" ? "hidden lg:block" : ""}`} style={{ width: "240px" }}>
                    <div className="flex items-center justify-between mb-4">
                        <h4 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "var(--foreground)",
                            margin: 0
                        }}>
                            Contents
                        </h4>
                        <span
                            className="text-[var(--text-secondary)]"
                            style={{ fontSize: "0.75rem", fontWeight: 500 }}
                        >
                            {readingProgress}%
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div
                        style={{
                            height: "2px",
                            backgroundColor: "var(--border)",
                            marginBottom: "1rem",
                            borderRadius: "1px",
                            overflow: "hidden"
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: `${readingProgress}%`,
                                backgroundColor: "var(--foreground)",
                                transition: "width 0.1s ease-out"
                            }}
                        />
                    </div>

                    <ul style={{ listStyle: "none", padding: 0, borderLeft: "1px solid var(--border)" }}>
                        {items.map((item) => (
                            <li key={item.id} style={{ marginBottom: "0" }}>
                                <a
                                    href={`#${item.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveId(item.id);
                                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    style={{
                                        display: "block",
                                        paddingLeft: item.level === 3 ? "1.75rem" : "1rem",
                                        paddingTop: "0.5rem",
                                        paddingBottom: "0.5rem",
                                        fontSize: item.level === 3 ? "0.8rem" : "0.875rem",
                                        color: activeId === item.id ? "var(--foreground)" : "var(--text-secondary)",
                                        borderLeft: "2px solid",
                                        borderLeftColor: activeId === item.id ? "var(--foreground)" : "transparent",
                                        marginLeft: "-2px",
                                        transition: "all 0.2s ease",
                                        fontWeight: activeId === item.id ? 500 : 300,
                                    }}
                                    className="hover:text-[var(--foreground)]"
                                >
                                    {item.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </>
    );
}
