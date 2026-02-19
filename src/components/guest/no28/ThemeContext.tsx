"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// --- Theme Types ---

export type ThemeMode = "default" | "night" | "golden";

export interface ThemeTokens {
    // Page background
    pageBg: string;
    pageBgDots: string;
    pageBgSize: string;

    // Card / Surface
    cardBg: string;
    cardBorder: string;
    cardShadow: string;

    // Text
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textAccent: string;

    // Accent
    accent: string;
    accentLight: string;
    accentGlow: string;

    // Tape / Decorative
    tapeDefault: string;

    // Overlay
    overlayBg: string;
    paperTexture: string;

    // Particles / Ambient
    particleColor: string;
    petalGradient: string;

    // Specific
    handwrittenColor: string;
    dividerColor: string;
    buttonBg: string;
    buttonBorder: string;
    buttonText: string;
    buttonShadow: string;
}

// --- Theme Definitions ---

const themes: Record<ThemeMode, ThemeTokens> = {
    default: {
        pageBg: "#fdf8f4",
        pageBgDots: "radial-gradient(#e5e0d8 0.7px, transparent 0)",
        pageBgSize: "32px 32px",
        cardBg: "#fff",
        cardBorder: "#e8e2d9",
        cardShadow: "0 8px 24px rgba(0,0,0,0.08)",
        textPrimary: "#4e4439",
        textSecondary: "#a0907d",
        textMuted: "#aaa",
        textAccent: "#b07d62",
        accent: "#b07d62",
        accentLight: "#d2691e",
        accentGlow: "rgba(176, 125, 98, 0.12)",
        tapeDefault: "#e8c9a0",
        overlayBg: "rgba(0,0,0,0.4)",
        paperTexture: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
        particleColor: "#d2691e",
        petalGradient: "linear-gradient(135deg, #ffb7c5 0%, #ffc0cb 100%)",
        handwrittenColor: "#a0907d",
        dividerColor: "#e8e2d9",
        buttonBg: "#fff",
        buttonBorder: "#5a5a5a",
        buttonText: "#5a5a5a",
        buttonShadow: "2px 2px 0px #5a5a5a",
    },
    night: {
        pageBg: "#0d1117",
        pageBgDots: "radial-gradient(#1a2332 0.7px, transparent 0)",
        pageBgSize: "32px 32px",
        cardBg: "rgba(22, 27, 34, 0.9)",
        cardBorder: "rgba(255,255,255,0.08)",
        cardShadow: "0 8px 24px rgba(0,0,0,0.3)",
        textPrimary: "#e2dcd5",
        textSecondary: "#8b95a5",
        textMuted: "#555e6b",
        textAccent: "#e8d5b7",
        accent: "#e8d5b7",
        accentLight: "#ffecd2",
        accentGlow: "rgba(232, 213, 183, 0.1)",
        tapeDefault: "#2a3444",
        overlayBg: "rgba(0,0,0,0.6)",
        paperTexture: "none",
        particleColor: "#ffecd2",
        petalGradient: "linear-gradient(135deg, rgba(200,184,164,0.3) 0%, rgba(200,184,164,0.1) 100%)",
        handwrittenColor: "#c8b8a4",
        dividerColor: "rgba(255,255,255,0.06)",
        buttonBg: "rgba(255,255,255,0.05)",
        buttonBorder: "rgba(255,255,255,0.15)",
        buttonText: "#c8b8a4",
        buttonShadow: "0 2px 4px rgba(0,0,0,0.3)",
    },
    golden: {
        pageBg: "#1a120d",
        pageBgDots: "radial-gradient(#2d1f15 0.7px, transparent 0)",
        pageBgSize: "32px 32px",
        cardBg: "rgba(35, 24, 16, 0.9)",
        cardBorder: "rgba(218, 165, 90, 0.15)",
        cardShadow: "0 8px 24px rgba(0,0,0,0.25), 0 0 30px rgba(218, 165, 90, 0.03)",
        textPrimary: "#f0e6d8",
        textSecondary: "#b8a48d",
        textMuted: "#7a6a58",
        textAccent: "#daa55a",
        accent: "#daa55a",
        accentLight: "#f0c675",
        accentGlow: "rgba(218, 165, 90, 0.12)",
        tapeDefault: "#3d2c1a",
        overlayBg: "rgba(10, 6, 3, 0.6)",
        paperTexture: "none",
        particleColor: "#daa55a",
        petalGradient: "linear-gradient(135deg, rgba(218, 165, 90, 0.3) 0%, rgba(240, 198, 117, 0.1) 100%)",
        handwrittenColor: "#c4a06a",
        dividerColor: "rgba(218, 165, 90, 0.1)",
        buttonBg: "rgba(218, 165, 90, 0.08)",
        buttonBorder: "rgba(218, 165, 90, 0.25)",
        buttonText: "#daa55a",
        buttonShadow: "0 2px 6px rgba(218, 165, 90, 0.15)",
    }
};

// --- Context ---

interface ThemeContextValue {
    mode: ThemeMode;
    tokens: ThemeTokens;
    setMode: (mode: ThemeMode) => void;
    cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    mode: "default",
    tokens: themes.default,
    setMode: () => { },
    cycleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

// --- Provider ---

const STORAGE_KEY = "guest_no28_theme";
const THEME_ORDER: ThemeMode[] = ["default", "night", "golden"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>("default");

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && THEME_ORDER.includes(saved as ThemeMode)) {
            setModeState(saved as ThemeMode);
        }
    }, []);

    const setMode = useCallback((newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem(STORAGE_KEY, newMode);
    }, []);

    const cycleTheme = useCallback(() => {
        setModeState(prev => {
            const idx = THEME_ORDER.indexOf(prev);
            const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
            localStorage.setItem(STORAGE_KEY, next);
            return next;
        });
    }, []);

    const tokens = themes[mode];

    return (
        <ThemeContext.Provider value={{ mode, tokens, setMode, cycleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// --- Theme labels & icons for UI ---
export const THEME_META: Record<ThemeMode, { label: string; emoji: string; description: string }> = {
    default: { label: "Siang", emoji: "☀️", description: "Hangat & cerah" },
    night: { label: "Malam", emoji: "🌙", description: "Tenang & syahdu" },
    golden: { label: "Senja", emoji: "🌅", description: "Emas & hangat" },
};
