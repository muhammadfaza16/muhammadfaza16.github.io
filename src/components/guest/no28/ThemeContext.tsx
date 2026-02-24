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

    // Tape / Decorative → now Wash Stripe
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

// --- Theme Definitions (Watercolor Palette) ---

const themes: Record<ThemeMode, ThemeTokens> = {
    default: {
        pageBg: "#faf6f0",
        pageBgDots: "radial-gradient(#e8e2d8 0.6px, transparent 0)",
        pageBgSize: "28px 28px",
        cardBg: "#fffdf9",
        cardBorder: "rgba(58, 50, 43, 0.06)",
        cardShadow: "0 6px 28px rgba(58, 50, 43, 0.08)",
        textPrimary: "#3a322b",
        textSecondary: "#7a6e62",
        textMuted: "#a89e92",
        textAccent: "#b07d62",
        accent: "#b07d62",
        accentLight: "#c9a085",
        accentGlow: "rgba(176, 125, 98, 0.1)",
        tapeDefault: "#d4b896",
        overlayBg: "rgba(250, 246, 240, 0.95)",
        paperTexture: "none",
        particleColor: "rgba(142, 168, 195, 0.4)",
        petalGradient: "linear-gradient(135deg, rgba(212, 160, 160, 0.5) 0%, rgba(184, 169, 201, 0.3) 100%)",
        handwrittenColor: "#7a6e62",
        dividerColor: "rgba(58, 50, 43, 0.08)",
        buttonBg: "#fffdf9",
        buttonBorder: "rgba(58, 50, 43, 0.12)",
        buttonText: "#3a322b",
        buttonShadow: "0 2px 8px rgba(58, 50, 43, 0.08)",
    },
    night: {
        pageBg: "#0f1218",
        pageBgDots: "radial-gradient(#1a2030 0.6px, transparent 0)",
        pageBgSize: "28px 28px",
        cardBg: "rgba(20, 26, 36, 0.9)",
        cardBorder: "rgba(255,255,255,0.06)",
        cardShadow: "0 6px 28px rgba(0,0,0,0.25)",
        textPrimary: "#e0dbd4",
        textSecondary: "#8a94a4",
        textMuted: "#556070",
        textAccent: "#d4b896",
        accent: "#d4b896",
        accentLight: "#e8dbc8",
        accentGlow: "rgba(212, 184, 150, 0.08)",
        tapeDefault: "#2a3040",
        overlayBg: "rgba(15, 18, 24, 0.95)",
        paperTexture: "none",
        particleColor: "rgba(212, 184, 150, 0.2)",
        petalGradient: "linear-gradient(135deg, rgba(180, 164, 144, 0.2) 0%, rgba(160, 150, 180, 0.1) 100%)",
        handwrittenColor: "#a0947e",
        dividerColor: "rgba(255,255,255,0.05)",
        buttonBg: "rgba(255,255,255,0.04)",
        buttonBorder: "rgba(255,255,255,0.1)",
        buttonText: "#c0b8a4",
        buttonShadow: "0 2px 6px rgba(0,0,0,0.3)",
    },
    golden: {
        pageBg: "#1a130c",
        pageBgDots: "radial-gradient(#2d1f14 0.6px, transparent 0)",
        pageBgSize: "28px 28px",
        cardBg: "rgba(32, 22, 14, 0.9)",
        cardBorder: "rgba(210, 160, 80, 0.12)",
        cardShadow: "0 6px 28px rgba(0,0,0,0.2), 0 0 40px rgba(210, 160, 80, 0.03)",
        textPrimary: "#efe6d6",
        textSecondary: "#b5a48c",
        textMuted: "#7a6a56",
        textAccent: "#d4a050",
        accent: "#d4a050",
        accentLight: "#e8c070",
        accentGlow: "rgba(210, 160, 80, 0.1)",
        tapeDefault: "#3a2c18",
        overlayBg: "rgba(26, 19, 12, 0.95)",
        paperTexture: "none",
        particleColor: "rgba(210, 160, 80, 0.25)",
        petalGradient: "linear-gradient(135deg, rgba(210, 160, 80, 0.25) 0%, rgba(230, 190, 100, 0.1) 100%)",
        handwrittenColor: "#c0a060",
        dividerColor: "rgba(210, 160, 80, 0.08)",
        buttonBg: "rgba(210, 160, 80, 0.06)",
        buttonBorder: "rgba(210, 160, 80, 0.2)",
        buttonText: "#d4a050",
        buttonShadow: "0 2px 8px rgba(210, 160, 80, 0.12)",
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
