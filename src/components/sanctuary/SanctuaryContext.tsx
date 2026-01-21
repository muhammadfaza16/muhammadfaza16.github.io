"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// --- Types ---

type Mood = "anxious" | "lonely" | "sleepless" | null;

interface MoodEntry {
    date: string; // ISO String
    mood: Mood;
}

interface SanctuaryState {
    // General
    lastVisit: string | null;

    // Daily Reminder (Brain)
    dailyQuoteIndex: number;
    lastQuoteDate: string | null; // Date string YYYY-MM-DD

    // Mirror of Truth (Brain)
    unlockedTruths: number[]; // Array of indices representing revealed truths
    lastTruthRevealDate: string | null; // Date string YYYY-MM-DD

    // Comfort Station (Memory)
    moodHistory: MoodEntry[];
}

interface SanctuaryContextType extends SanctuaryState {
    // Actions
    setMood: (mood: Mood) => void;
    unlockTruth: (index: number) => void;
    refreshDailyQuote: (totalQuotes: number) => void;
}

// --- Defaults ---

const defaultState: SanctuaryState = {
    lastVisit: null,
    dailyQuoteIndex: 0,
    lastQuoteDate: null,
    unlockedTruths: [],
    lastTruthRevealDate: null,
    moodHistory: [],
};

const SanctuaryContext = createContext<SanctuaryContextType | undefined>(undefined);

// --- Provider ---

const STORAGE_KEY = "sanctuary_brain_v1";

export function SanctuaryProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<SanctuaryState>(defaultState);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Load from LocalStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with default to ensure new fields are present if schema changes
                setState({ ...defaultState, ...parsed });
            }
        } catch (e) {
            console.error("Failed to load Sanctuary memory:", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // 2. Save to LocalStorage whenever state changes
    useEffect(() => {
        if (!isLoaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error("Failed to save Sanctuary memory:", e);
        }
    }, [state, isLoaded]);

    // --- Actions ---

    const setMood = (mood: Mood) => {
        if (!mood) return;
        const today = new Date().toISOString();

        setState(prev => ({
            ...prev,
            lastVisit: today,
            moodHistory: [...prev.moodHistory, { date: today, mood }].slice(-50) // Keep last 50 only
        }));
    };

    const unlockTruth = (index: number) => {
        const today = new Date().toISOString().split('T')[0];

        setState(prev => {
            // Prevent duplicate unlocks of the same index
            if (prev.unlockedTruths.includes(index)) return prev;

            return {
                ...prev,
                unlockedTruths: [...prev.unlockedTruths, index],
                lastTruthRevealDate: today
            };
        });
    };

    const refreshDailyQuote = (totalQuotes: number) => {
        const today = new Date().toISOString().split('T')[0];

        setState(prev => {
            // If it's still the same day and we have a valid index, don't change it
            if (prev.lastQuoteDate === today && prev.dailyQuoteIndex < totalQuotes) {
                return prev;
            }

            // Otherwise, pick a new random quote
            // improved random: ensures it's different if possible (optional, but simple random is fine for now)
            const newIndex = Math.floor(Math.random() * totalQuotes);

            return {
                ...prev,
                lastQuoteDate: today,
                dailyQuoteIndex: newIndex
            };
        });
    };

    const value = {
        ...state,
        setMood,
        unlockTruth,
        refreshDailyQuote
    };

    // Prevent rendering children until state is loaded to avoid hydration mismatch or flash of incorrect state
    if (!isLoaded) return null;

    return (
        <SanctuaryContext.Provider value={value}>
            {children}
        </SanctuaryContext.Provider>
    );
}

// --- Hook ---

export function useSanctuary() {
    const context = useContext(SanctuaryContext);
    if (context === undefined) {
        throw new Error("useSanctuary must be used within a SanctuaryProvider");
    }
    return context;
}
