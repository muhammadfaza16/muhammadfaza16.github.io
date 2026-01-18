"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { NARRATIVE_THREADS, BRIDGE_LINES, NarrativeThread, ThreadCategory } from '../data/narrative-db';

interface NarrativeState {
    text: string;           // The current text to display
    isFrozen: boolean;      // If true, we are "holding" the conversation
    threadId: string | null; // Current thread ID
    lineIndex: number;      // Current line index in the thread
    sessionCategory: ThreadCategory; // INTRO -> DEEP -> COMFORT
}

interface NarrativeContextType extends NarrativeState {
    advanceToNextLine: () => void;
    unfreeze: () => void;
}

const NarrativeContext = createContext<NarrativeContextType | null>(null);

const SESSION_STORAGE_KEY = 'narrative_engine_state';
const THREAD_DELAY_MS = 15000; // Delay between threads (silence gap)
const BASE_READ_TIME_MS = 2000;
const CHAR_READ_TIME_MS = 50; // ms per character

export function NarrativeProvider({ children }: { children: React.ReactNode }) {
    // === STATE ===
    const [state, setState] = useState<NarrativeState>({
        text: "",
        isFrozen: false,
        threadId: null,
        lineIndex: -1,
        sessionCategory: 'INTRO'
    });

    // Refs for timer management to avoid closure staleness
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const stateRef = useRef(state);
    const isInitializedRef = useRef(false); // Track initialization

    // Sync ref with state
    useEffect(() => {
        stateRef.current = state;
        // Persist to session storage on every state change
        if (state.threadId) {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
        }
    }, [state]);

    // === INITIALIZATION ===
    useEffect(() => {
        const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // On reload/return: Set frozen to true, but keep the index
                const restoredState = { ...parsed, isFrozen: true };
                setState(restoredState);
                stateRef.current = restoredState; // Sync ref immediately
            } catch (e) {
                console.error("Failed to load narrative state", e);
                startNewSession();
            }
        } else {
            startNewSession();
        }
        isInitializedRef.current = true; // Mark as initialized

        // Cleanup on unmount (user navigates away)
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            // We ensure the final state is saved as frozen
            const finalState = { ...stateRef.current, isFrozen: true };
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(finalState));
        };
    }, []);

    // === LOGIC ===

    const startNewSession = () => {
        const thread = pickRandomThread('INTRO');
        setState({
            text: thread.lines[0],
            isFrozen: false,
            threadId: thread.id,
            lineIndex: 0,
            sessionCategory: 'INTRO'
        });
        scheduleNextLine(thread.lines[0]);
    };

    const pickRandomThread = (category: ThreadCategory, excludeId?: string | null): NarrativeThread => {
        let pool = NARRATIVE_THREADS.filter(t => t.category === category);
        if (pool.length === 0) pool = NARRATIVE_THREADS; // Fallback

        // Try to avoid repeating immediately
        const filtered = pool.filter(t => t.id !== excludeId);
        const candidates = filtered.length > 0 ? filtered : pool;

        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
    };

    const scheduleNextLine = (currentText: string) => {
        if (timerRef.current) clearTimeout(timerRef.current);

        // Dense Pacing Calculation
        const duration = BASE_READ_TIME_MS + (currentText.length * CHAR_READ_TIME_MS);

        timerRef.current = setTimeout(() => {
            advance();
        }, duration);
    };

    const advance = () => {
        const current = stateRef.current;
        if (current.isFrozen) return; // Don't advance if frozen

        const currentThread = NARRATIVE_THREADS.find(t => t.id === current.threadId);
        if (!currentThread) {
            startNewSession();
            return;
        }

        const nextIndex = current.lineIndex + 1;

        if (nextIndex < currentThread.lines.length) {
            // Next line in same thread
            const nextText = currentThread.lines[nextIndex];
            setState(prev => ({ ...prev, lineIndex: nextIndex, text: nextText }));
            scheduleNextLine(nextText);
        } else {
            // Thread finished - Wait for GAP then pick next thread
            setState(prev => ({ ...prev, text: "" })); // Clear text for silence

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                startNextThread();
            }, THREAD_DELAY_MS);
        }
    };

    const startNextThread = () => {
        const current = stateRef.current;
        let nextCategory: ThreadCategory = current.sessionCategory;

        // Simple progression logic
        if (current.sessionCategory === 'INTRO') nextCategory = 'DEEP';
        else if (current.sessionCategory === 'DEEP') {
            // 30% chance to switch to COMFORT, or if deep pool exhausted (not tracked yet)
            if (Math.random() > 0.7) nextCategory = 'COMFORT';
        } else {
            // Back to Deep sometimes
            if (Math.random() > 0.6) nextCategory = 'DEEP';
        }

        const nextThread = pickRandomThread(nextCategory, current.threadId);

        setState({
            text: nextThread.lines[0],
            isFrozen: false,
            threadId: nextThread.id,
            lineIndex: 0,
            sessionCategory: nextCategory
        });
        scheduleNextLine(nextThread.lines[0]);
    };

    // Public Action: Unfreeze (called by UI on mount if frozen)
    const unfreeze = () => {
        // If not frozen, but also not initialized, might need to start fresh
        if (!stateRef.current.isFrozen) {
            // If we have no text but are initialized, start a new thread
            if (isInitializedRef.current && !stateRef.current.text && !timerRef.current) {
                startNextThread();
            }
            return;
        }

        // Play Bridge First
        const bridge = BRIDGE_LINES[Math.floor(Math.random() * BRIDGE_LINES.length)];

        setState(prev => ({ ...prev, text: bridge, isFrozen: false }));

        // After reading bridge, resume the thread where it left off
        const bridgeDuration = BASE_READ_TIME_MS + (bridge.length * CHAR_READ_TIME_MS);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            // Resume logic
            const current = stateRef.current;
            const currentThread = NARRATIVE_THREADS.find(t => t.id === current.threadId);
            if (currentThread && current.lineIndex < currentThread.lines.length) {
                const resumeText = currentThread.lines[current.lineIndex];
                setState(prev => ({ ...prev, text: resumeText }));
                scheduleNextLine(resumeText);
            } else {
                startNextThread();
            }
        }, bridgeDuration);
    };

    const advanceToNextLine = () => {
        // Manual advance check (optional usage)
        advance();
    };

    return (
        <NarrativeContext.Provider value={{ ...state, advanceToNextLine, unfreeze }}>
            {children}
        </NarrativeContext.Provider>
    );
}

export function useNarrative() {
    const context = useContext(NarrativeContext);
    if (!context) {
        throw new Error("useNarrative must be used within a NarrativeProvider");
    }
    return context;
}
