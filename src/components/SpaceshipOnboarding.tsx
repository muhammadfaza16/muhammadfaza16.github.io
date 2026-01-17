"use client";

import { useState, useEffect } from "react";
import { GradientOrb } from "./GradientOrb";
import { CosmicStars } from "./CosmicStars";

export function SpaceshipOnboarding() {
    // Start with null to indicate "loading" state - prevents flash
    const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
    const [isExiting, setIsExiting] = useState(false);
    const [showContent, setShowContent] = useState(false);

    // Check localStorage on mount
    useEffect(() => {
        const onboarded = localStorage.getItem("hasOnboarded");
        setHasOnboarded(onboarded === "true");
    }, []);

    // Trigger content reveal animation after initial render
    useEffect(() => {
        if (hasOnboarded === false) {
            const timer = setTimeout(() => setShowContent(true), 100);
            return () => clearTimeout(timer);
        }
    }, [hasOnboarded]);

    // Handle CTA click
    const handleEnter = () => {
        setIsExiting(true);
        setTimeout(() => {
            localStorage.setItem("hasOnboarded", "true");
            setHasOnboarded(true);
        }, 1200); // After transition completes
    };

    // While checking localStorage, render nothing to prevent flash
    if (hasOnboarded === null) {
        return null;
    }

    // If already onboarded, don't render anything
    if (hasOnboarded) {
        return null;
    }

    return (
        <div
            className={`onboarding-overlay ${isExiting ? "onboarding-exit" : ""}`}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--background)",
                overflow: "hidden",
            }}
        >
            {/* Cosmic Background */}
            <div style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
            }}>
                <GradientOrb />
                <CosmicStars />
            </div>

            {/* Additional Stars Overlay */}
            <div style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 20% 80%, rgba(var(--accent-rgb, 96, 165, 250), 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(var(--accent-rgb, 96, 165, 250), 0.08) 0%, transparent 40%)`,
                pointerEvents: "none",
            }} />

            {/* Main Content Container */}
            <div
                className={`onboarding-content ${showContent ? "show" : ""}`}
                style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2rem",
                    padding: "2rem",
                    textAlign: "center",
                    opacity: 0,
                    transform: "translateY(20px)",
                    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                {/* Spaceship with Avatar */}
                <div className="spaceship-container" style={{
                    marginBottom: "1rem",
                }}>
                    <svg
                        width="280"
                        height="200"
                        viewBox="0 0 280 200"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            color: "var(--foreground)",
                            overflow: "visible",
                        }}
                    >
                        {/* Spaceship Glow */}
                        <defs>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
                                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Spaceship Body */}
                        <g className="spaceship-body" filter="url(#glow)">
                            {/* Main hull */}
                            <path d="M140 60 L180 120 L170 130 L110 130 L100 120 Z" strokeWidth="2" />

                            {/* Cockpit window */}
                            <ellipse cx="140" cy="90" rx="18" ry="12" strokeWidth="1.5" opacity="0.8" />
                            <ellipse cx="140" cy="90" rx="10" ry="6" strokeWidth="1" opacity="0.5" />

                            {/* Wings */}
                            <path d="M100 120 L60 140 L70 130 L100 115" strokeWidth="1.5" />
                            <path d="M180 120 L220 140 L210 130 L180 115" strokeWidth="1.5" />

                            {/* Wing details */}
                            <path d="M75 135 L85 128" strokeWidth="1" opacity="0.6" />
                            <path d="M205 135 L195 128" strokeWidth="1" opacity="0.6" />

                            {/* Thruster base */}
                            <rect x="120" y="130" width="40" height="12" rx="3" strokeWidth="1.5" />

                            {/* Antenna */}
                            <path d="M140 60 L140 45" strokeWidth="1.5" />
                            <circle cx="140" cy="42" r="3" strokeWidth="1" />
                        </g>

                        {/* Thruster Flames (Animated) */}
                        <g className="thruster-flames">
                            <path
                                d="M125 142 L140 175 L155 142"
                                fill="url(#flameGradient)"
                                stroke="var(--accent)"
                                strokeWidth="1"
                                opacity="0.8"
                            >
                                <animate
                                    attributeName="d"
                                    values="M125 142 L140 175 L155 142;M125 142 L140 185 L155 142;M125 142 L140 175 L155 142"
                                    dur="0.5s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    values="0.8;0.5;0.8"
                                    dur="0.3s"
                                    repeatCount="indefinite"
                                />
                            </path>
                            {/* Inner flame */}
                            <path
                                d="M132 142 L140 165 L148 142"
                                fill="var(--background)"
                                stroke="var(--accent)"
                                strokeWidth="0.5"
                                opacity="0.6"
                            >
                                <animate
                                    attributeName="d"
                                    values="M132 142 L140 165 L148 142;M132 142 L140 170 L148 142;M132 142 L140 165 L148 142"
                                    dur="0.4s"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </g>

                        {/* Avatar sitting on spaceship */}
                        <g transform="translate(115, 20)" stroke="var(--accent)" strokeWidth="2">
                            {/* Head */}
                            <circle cx="25" cy="18" r="8" />

                            {/* Body (sitting pose) */}
                            <path d="M25 26 L25 40" /> {/* Torso */}
                            <path d="M25 40 L15 50" /> {/* Leg L */}
                            <path d="M25 40 L35 50" /> {/* Leg R */}
                            <path d="M25 30 L17 36" /> {/* Arm L */}
                            <path d="M25 30 L33 36" /> {/* Arm R */}

                            {/* Helmet/Astronaut visor hint */}
                            <path d="M18 15 C18 10, 32 10, 32 15" strokeWidth="1" opacity="0.5" />
                        </g>

                        {/* Decorative stars around */}
                        <g opacity="0.6" className="decorative-stars">
                            <circle cx="50" cy="60" r="1.5" fill="currentColor" />
                            <circle cx="230" cy="80" r="2" fill="currentColor" />
                            <circle cx="40" cy="150" r="1" fill="currentColor" />
                            <circle cx="240" cy="160" r="1.5" fill="currentColor" />
                            <circle cx="260" cy="50" r="1" fill="currentColor" />
                            <circle cx="20" cy="100" r="1.5" fill="currentColor" />

                            {/* Twinkling effect */}
                            <circle cx="70" cy="40" r="1" fill="var(--accent)">
                                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="210" cy="50" r="1.5" fill="var(--accent)">
                                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
                            </circle>
                        </g>
                    </svg>
                </div>

                {/* Welcome Text */}
                <div className="welcome-text" style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                }}>
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        color: "var(--accent)",
                        textTransform: "uppercase",
                        letterSpacing: "0.25em",
                    }}>
                        Transmission Received
                    </span>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                        fontWeight: 400,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        color: "var(--foreground)",
                        margin: 0,
                    }}>
                        Welcome, Wanderer.
                    </h1>
                    <p style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "clamp(1rem, 3vw, 1.25rem)",
                        color: "var(--text-secondary)",
                        maxWidth: "400px",
                        lineHeight: 1.6,
                        margin: "0.5rem 0 0 0",
                    }}>
                        You've drifted into a corner of the cosmos where thoughts float freely.
                    </p>
                </div>

                {/* CTA Button */}
                <button
                    onClick={handleEnter}
                    className="onboarding-cta"
                    style={{
                        marginTop: "1.5rem",
                        padding: "1rem 2.5rem",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "var(--background)",
                        background: "var(--foreground)",
                        border: "none",
                        borderRadius: "50px",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <span style={{ position: "relative", zIndex: 1 }}>
                        Begin the Journey →
                    </span>
                </button>

                {/* Skip link for returning users */}
                <button
                    onClick={handleEnter}
                    style={{
                        marginTop: "0.5rem",
                        padding: "0.5rem 1rem",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        opacity: 0.6,
                        transition: "opacity 0.3s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
                >
                    or press any key to skip
                </button>
            </div>

            {/* Styles */}
            <style>{`
                .onboarding-content.show {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }

                .spaceship-container {
                    animation: spaceshipFloat 6s ease-in-out infinite;
                }

                @keyframes spaceshipFloat {
                    0%, 100% { transform: translateY(0) rotate(-1deg); }
                    25% { transform: translateY(-15px) rotate(0.5deg); }
                    50% { transform: translateY(-8px) rotate(1deg); }
                    75% { transform: translateY(-20px) rotate(-0.5deg); }
                }

                .decorative-stars {
                    animation: starsFloat 8s ease-in-out infinite;
                }

                @keyframes starsFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .onboarding-cta:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }

                .onboarding-cta:active {
                    transform: translateY(-1px);
                }

                .onboarding-cta::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s ease;
                }

                .onboarding-cta:hover::before {
                    left: 100%;
                }

                .onboarding-exit {
                    animation: onboardingExit 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                @keyframes onboardingExit {
                    0% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                    }
                    100% {
                        opacity: 0;
                        transform: scale(1.1);
                        pointer-events: none;
                    }
                }

                .onboarding-exit .spaceship-container {
                    animation: spaceshipExit 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                @keyframes spaceshipExit {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) scale(0.5);
                        opacity: 0;
                    }
                }

                .onboarding-exit .welcome-text,
                .onboarding-exit .onboarding-cta,
                .onboarding-exit button {
                    animation: fadeOutDown 0.6s ease-out forwards;
                }

                @keyframes fadeOutDown {
                    0% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                }
            `}</style>
        </div>
    );
}
