"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/Container";

export function JarvisHero() {
    const [greeting, setGreeting] = useState("");
    const [subtext, setSubtext] = useState("");
    const [mounted, setMounted] = useState(false);

    // Time-aware logic
    useEffect(() => {
        setMounted(true);
        const hour = new Date().getHours();

        let timeGreeting = "Greetings.";
        let timeSubtext = "System active.";

        if (hour >= 5 && hour < 12) {
            timeGreeting = "Selamat pagi, Faza.";
            timeSubtext = "Solar systems charging. Ready for the day.";
        } else if (hour >= 12 && hour < 17) {
            timeGreeting = "Selamat siang, Faza.";
            timeSubtext = "Optimal productivity levels detected.";
        } else if (hour >= 17 && hour < 21) {
            timeGreeting = "Selamat sore, Faza.";
            timeSubtext = "The sun is setting. Time to reflect.";
        } else {
            timeGreeting = "Selamat malam, Faza.";
            timeSubtext = "Starlight mode engaged. Peace and quiet.";
        }

        // Typewriter effect simulation (state updates only, simple fade in for now to keep it clean)
        setGreeting(timeGreeting);
        setSubtext(timeSubtext);
    }, []);

    if (!mounted) return null;

    return (
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">

            {/* THE ORB - Ethereal Core */}
            <div className="relative w-64 h-64 mb-12 transform-gpu">
                {/* Core Pulse */}
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute inset-10 bg-indigo-500/30 rounded-full blur-2xl animate-pulse-slower delay-75"></div>
                <div className="absolute inset-20 bg-white/40 rounded-full blur-xl animate-pulse-fast"></div>

                {/* Rings */}
                <div className="absolute inset-0 border border-white/10 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-4 border border-white/5 rounded-full animate-reverse-spin-slower"></div>
            </div>

            <Container>
                <div className="space-y-6 relative z-10">

                    {/* System Status Label */}
                    <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-[0.3em] text-blue-300/70 uppercase">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                        <span>Identity Core: Online</span>
                    </div>

                    {/* Main Greeting */}
                    <h1 className="font-sans text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        {greeting}
                    </h1>

                    {/* Dynamic Subtext */}
                    <p className="font-serif text-lg md:text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
                        {subtext}
                    </p>

                </div>
            </Container>

            {/* Decorative HUD Elements */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-30">
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent" />
            </div>

        </section>
    );
}
