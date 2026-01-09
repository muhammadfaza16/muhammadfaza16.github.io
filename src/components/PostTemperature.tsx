"use client";

import { useState, useEffect } from "react";

export function PostTemperature() {
    const [readers, setReaders] = useState<number | null>(null);

    useEffect(() => {
        // Generate initial random readers (1-5)
        const initial = Math.floor(Math.random() * 5) + 1;
        setReaders(initial);

        // Fluctuate randomly every 30-60 seconds
        const interval = setInterval(() => {
            setReaders(prev => {
                if (prev === null) return initial;
                const change = Math.random() > 0.5 ? 1 : -1;
                const newValue = prev + change;
                // Keep between 1 and 8
                return Math.max(1, Math.min(8, newValue));
            });
        }, 30000 + Math.random() * 30000);

        return () => clearInterval(interval);
    }, []);

    if (readers === null) return null;

    return (
        <span
            className="inline-flex items-center gap-1.5"
            style={{ fontSize: "0.75rem", fontWeight: 500 }}
        >
            {/* Pulsing dot */}
            <span
                className="relative flex h-2 w-2"
            >
                <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: "#ef4444" }}
                />
                <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: "#ef4444" }}
                />
            </span>
            <span style={{ letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {readers} reading now
            </span>
        </span>
    );
}
