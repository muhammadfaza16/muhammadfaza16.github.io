"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

// In a real app, this comes from a config file updated via git
const LATEST_UPDATE = {
    timestamp: new Date("2026-01-22").getTime(), // Future date for testing "New"
    message: "A new letter has arrived.",
    type: "letter"
};

export function GardenChime() {
    const [hasNews, setHasNews] = useState(false);

    useEffect(() => {
        const lastVisit = localStorage.getItem("angel_garden_last_visit");

        if (!lastVisit || parseInt(lastVisit) < LATEST_UPDATE.timestamp) {
            setHasNews(true);
        }

        // Update visit time on mount
        localStorage.setItem("angel_garden_last_visit", Date.now().toString());
    }, []);

    if (!hasNews) return null;

    return (
        <div className="absolute top-28 right-4 md:top-32 md:right-8 z-20 group animate-fade-in">
            {/* The Chime (Visual) */}
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-100/50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 backdrop-blur-sm border border-amber-200/50 shadow-[0_0_15px_rgba(251,191,36,0.3)] animate-pulse-slow cursor-help">
                    <Bell className="w-4 h-4" />
                </div>

                {/* Firefly particle */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
            </div>

            {/* The Message (Tooltip) */}
            <div className="absolute top-12 right-0 w-48 md:w-64 bg-white/95 dark:bg-black/90 backdrop-blur-md p-4 rounded-xl border border-amber-100 dark:border-amber-900/50 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2 border-b border-amber-500/20 pb-1">
                    Fresh Bloom
                </div>
                <p className="text-sm text-amber-950 dark:text-amber-100 font-serif leading-relaxed">
                    "{LATEST_UPDATE.message}"
                </p>
                <button
                    onClick={() => setHasNews(false)}
                    className="mt-3 text-[10px] text-amber-500/50 hover:text-amber-500 uppercase tracking-wider flex items-center gap-1"
                >
                    Dismiss
                </button>
            </div>

        </div>
    );
}
