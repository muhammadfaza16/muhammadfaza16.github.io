"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";
import { DigitalClock } from "./DigitalClock";
import { useZen } from "./ZenContext";
import { Zap, BookOpen, Lightbulb, GraduationCap, Link2, Clock, Monitor } from "lucide-react";

export function Header() {
    const pathname = usePathname();
    const { isZen } = useZen();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: "/blog", label: "Writing" },
        { href: "/project", label: "Project" },
        { href: "/journey", label: "Journey" },
        { href: "/about", label: "About" },
    ];

    const moreLinks = [
        { href: "/now", label: "Now", icon: Zap },
        { href: "/bookshelf", label: "Bookshelf", icon: BookOpen },
        { href: "/ideas", label: "Ideas", icon: Lightbulb },
        { href: "/til", label: "TIL", icon: GraduationCap },
        { href: "/links", label: "Links", icon: Link2 },
        { href: "/changelog", label: "Changelog", icon: Clock },
        { href: "/uses", label: "Uses", icon: Monitor },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setIsMoreOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setIsMoreOpen(false);
        setIsMobileMoreOpen(false);
    }, [pathname]);

    // Add/remove class for body styling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add("menu-open");
        } else {
            document.body.classList.remove("menu-open");
        }
        return () => {
            document.body.classList.remove("menu-open");
        };
    }, [isMenuOpen]);

    return (
        <header
            className="glass"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                borderBottom: "1px solid var(--border)",
                transition: "background-color 0.3s ease, border-color 0.3s ease, transform 0.5s ease, opacity 0.5s ease",
                height: "5rem", // Fixed height for consistency
                transform: isZen ? "translateY(-100%)" : "translateY(0)",
                opacity: isZen ? 0 : 1,
                pointerEvents: isZen ? "none" : "auto"
            }}
        >
            <Container>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "5rem" }}>

                    {/* Desktop Navigation (Hidden on Mobile) */}
                    <nav
                        style={{ gap: "2rem", alignItems: "center" }}
                        className="desktop-flex no-scrollbar"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{ fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
                                className={`link-underline transition-colors ${isActive(link.href.replace('#', '')) ? 'text-[var(--foreground)]' : 'text-[var(--secondary)] hover:text-[var(--foreground)]'}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* More Dropdown */}
                        <div ref={moreRef} style={{ position: "relative" }}>
                            <button
                                onClick={() => setIsMoreOpen(!isMoreOpen)}
                                style={{
                                    fontSize: "0.8rem",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                    padding: 0,
                                    color: isMoreOpen ? "var(--foreground)" : "var(--secondary)",
                                    transition: "color 0.2s ease"
                                }}
                                className="hover:text-[var(--foreground)]"
                            >
                                More
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        transform: isMoreOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.2s ease"
                                    }}
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isMoreOpen && (
                                <div
                                    className="animate-fade-in"
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 1rem)",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        minWidth: "180px",
                                        backgroundColor: "var(--background)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                                        overflow: "hidden",
                                        zIndex: 100
                                    }}
                                >
                                    {moreLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.75rem",
                                                padding: "0.75rem 1rem",
                                                fontSize: "0.9rem",
                                                color: isActive(link.href) ? "var(--foreground)" : "var(--text-secondary)",
                                                backgroundColor: isActive(link.href) ? "var(--hover-bg)" : "transparent",
                                                transition: "all 0.15s ease",
                                                textDecoration: "none"
                                            }}
                                            className="dropdown-item-hover"
                                        >
                                            <link.icon className="w-4 h-4" />
                                            <span>{link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Home Icon (Left) */}
                    <div className="mobile-only" style={{ display: "flex", alignItems: "center" }}>
                        <Link
                            href="/"
                            style={{
                                opacity: pathname === "/" ? 1 : 0.5,
                                transition: "opacity 0.3s ease"
                            }}
                            onClick={() => setIsMenuOpen(false)}
                            className="hover:opacity-100"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </Link>
                    </div>

                    {/* Actions - Right */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <ThemeToggle />

                        {/* Hamburger Button (Mobile Only) */}
                        <button
                            className="mobile-only"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{
                                color: "var(--foreground)",
                                padding: "0.5rem",
                                marginRight: "-0.5rem"
                            }}
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? (
                                // Close Icon
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            ) : (
                                // Menu Icon
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown - Always mounted for smooth transition */}
                <div
                    className="mobile-only glass"
                    style={{
                        position: "absolute",
                        top: "5rem", // Below header
                        left: 0,
                        right: 0,
                        borderBottom: "1px solid var(--border)",
                        padding: "2rem 0",
                        height: "calc(100vh - 5rem)", // Full screen minus header
                        backgroundColor: "var(--background)",
                        overflowY: "auto",
                        // Transition State
                        opacity: isMenuOpen ? 1 : 0,
                        pointerEvents: isMenuOpen ? "auto" : "none",
                        visibility: isMenuOpen ? "visible" : "hidden",
                        transform: isMenuOpen ? "translateY(0)" : "translateY(-8px)",
                        transition: "opacity 0.2s ease, transform 0.2s ease, visibility 0.2s"
                    }}
                >
                    <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                        {/* Digital Clock */}
                        <DigitalClock onClick={() => setIsMenuOpen(false)} />

                        {/* Main Links */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                style={{
                                    fontSize: "1.25rem",
                                    letterSpacing: "0.05em"
                                }}
                                className={`transition-colors ${isActive(link.href.replace('#', '')) ? 'text-[var(--foreground)]' : 'text-[var(--secondary)]'}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Divider */}
                        <div style={{ width: "60px", height: "1px", backgroundColor: "var(--border)", margin: "0.5rem 0" }} />

                        {/* Mobile More Button */}
                        <button
                            onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
                            style={{
                                fontSize: "1.25rem",
                                letterSpacing: "0.05em",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                color: isMobileMoreOpen ? "var(--foreground)" : "var(--secondary)",
                                transition: "color 0.2s ease"
                            }}
                        >
                            <span>Archives</span>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                    transform: isMobileMoreOpen ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.2s ease"
                                }}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>

                        {/* More Links Collapsible */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "1rem",
                                overflow: "hidden",
                                maxHeight: isMobileMoreOpen ? "500px" : "0",
                                opacity: isMobileMoreOpen ? 1 : 0,
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                marginTop: isMobileMoreOpen ? "0.5rem" : "0"
                            }}
                        >
                            {moreLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{
                                        fontSize: "1.1rem",
                                        letterSpacing: "0.05em",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem"
                                    }}
                                    className={`transition-colors ${isActive(link.href) ? 'text-[var(--foreground)]' : 'text-[var(--secondary)]'}`}
                                >
                                    <span style={{ fontSize: "1.25rem", width: "1.5rem", display: "flex", justifyContent: "center" }}><link.icon className="w-5 h-5" /></span>
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>
            </Container>
        </header>
    );
}
