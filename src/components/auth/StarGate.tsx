"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "../Container";
import { Lock, Sparkles, AlertCircle } from "lucide-react";

interface StarGateProps {
    gateType: "angel" | "void"; // Only for private gardens
    onUnlock: () => void;
}

// HARDCODED KEYS (Security by Obscurity for Static Site)
// In a real app, these should be env vars or hashed.
// For GitHub Pages, checking a string is the only way without a backend.
// We can obfuscate nicely later.
const KEYS = {
    angel: "lighthouse", // The password for the Angel Garden
    void: "dreamer",     // The password for the Private Garden
};

export function StarGate({ gateType, onUnlock }: StarGateProps) {
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Check if already unlocked in this session
    useEffect(() => {
        const isUnlocked = sessionStorage.getItem(`gate_unlocked_${gateType}`);
        if (isUnlocked === "true") {
            onUnlock();
        }
    }, [gateType, onUnlock]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(false);

        const correctKey = KEYS[gateType];

        // Normalize input
        const normalizedInput = input.trim().toLowerCase();

        if (normalizedInput === correctKey) {
            setIsAnimating(true);

            // Success Animation Time
            setTimeout(() => {
                sessionStorage.setItem(`gate_unlocked_${gateType}`, "true");
                onUnlock();
            }, 1000);
        } else {
            setError(true);
            // Shake animation trigger
            setTimeout(() => setError(false), 500);
        }
    };

    const getGateDetails = () => {
        if (gateType === "angel") {
            return {
                title: "The Sanctuary",
                hint: "A safe place.",
                color: "var(--accent)", // Use theme accent (Rose Gold for Angel)
                icon: <Sparkles className="w-6 h-6 animate-pulse" />
            };
        }
        return {
            title: "The Void",
            hint: "Restricted Access.",
            color: "#ffffff",
            icon: <Lock className="w-6 h-6" />
        };
    };

    const details = getGateDetails();

    if (isAnimating) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000">
                <div className="text-white text-2xl font-serif animate-pulse">
                    Opening the Gate...
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-[var(--background)] flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                {/* Simple Starfield */}
                <div className="stars-static" />
            </div>

            <Container className="relative z-10 max-w-md w-full">
                <div className="text-center space-y-8 animate-fade-in">

                    {/* Lock Icon */}
                    <div
                        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center border border-[var(--border)]"
                        style={{ color: details.color, borderColor: details.color }}
                    >
                        {details.icon}
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-serif mb-2">{details.title}</h1>
                        <p className="text-[var(--text-secondary)] font-mono text-sm tracking-widest uppercase">
                            {details.hint}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="password"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter Passcode..."
                            className={`
                w-full bg-[var(--card-bg)] border border-[var(--border)] 
                px-6 py-4 text-center font-mono rounded-full 
                focus:outline-none focus:border-[var(--accent)] 
                transition-all duration-300
                ${error ? 'border-red-500 animate-shake' : ''}
              `}
                            autoFocus
                        />

                        {error && (
                            <div className="absolute -bottom-8 left-0 right-0 text-center text-red-500 text-xs font-mono flex items-center justify-center gap-2">
                                <AlertCircle className="w-3 h-3" />
                                <span>Access Denied</span>
                            </div>
                        )}
                    </form>

                    {/* Return Hint */}
                    <button
                        onClick={() => window.history.back()}
                        className="text-xs font-mono text-[var(--text-secondary)] opacity-50 hover:opacity-100 transition-opacity"
                    >
                        ← RETURN TO STAR MAP
                    </button>
                </div>
            </Container>

        </div>
    );
}
