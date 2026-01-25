"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "./AudioContext";
import { useLyrics } from "../hooks/useLyrics";
import { cn } from "../lib/utils";

export function LyricsDisplay() {
    const { currentSong, audioRef, isPlaying, isBuffering } = useAudio();
    const { lyrics, loading, error } = useLyrics(currentSong.title);

    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const rafRef = useRef<number | null>(null);

    // Sync Engine: High-performance polling
    useEffect(() => {
        if (!lyrics || lyrics.length === 0) return;

        const sync = () => {
            if (audioRef.current) {
                const time = audioRef.current.currentTime;

                // Find the active line
                // Logic: A line is active if time >= line.time AND time < nextLine.time
                let currentIdx = -1;
                for (let i = 0; i < lyrics.length; i++) {
                    const start = lyrics[i].time;
                    const end = lyrics[i + 1] ? lyrics[i + 1].time : Infinity;

                    if (time >= start && time < end) {
                        currentIdx = i;
                        break;
                    }
                }

                if (currentIdx !== activeIndex) {
                    setActiveIndex(currentIdx);
                }
            }
            rafRef.current = requestAnimationFrame(sync);
        };

        if (isPlaying && !isBuffering) {
            rafRef.current = requestAnimationFrame(sync);
        } else {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        }

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [lyrics, isPlaying, isBuffering, audioRef, activeIndex]);

    // Reset index on song change
    useEffect(() => {
        setActiveIndex(-1);
    }, [currentSong]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[180px] w-full">
                <span className="text-zinc-500/50 animate-pulse font-serif italic text-sm tracking-widest">
                    SYNCING...
                </span>
            </div>
        );
    }

    if (error || !lyrics) {
        return (
            <div className="flex items-center justify-center h-[180px] w-full">
                <span className="text-zinc-500/30 font-serif italic text-sm tracking-widest">
                    INSTRUMENTAL
                </span>
            </div>
        );
    }

    const currentLine = lyrics[activeIndex];
    const nextLine = lyrics[activeIndex + 1];

    return (
        <div className="relative w-full max-w-2xl mx-auto h-[180px] flex flex-col items-center justify-center overflow-hidden select-none">

            {/* Active Line (Dreamy Transition) */}
            <div className="relative z-10 text-center px-4 transition-all duration-700 ease-out transform">
                {/* 
                    Key changes to trigger animation on text change. 
                    Using 'key' forces a re-mount for the animation to play every time the line changes.
                 */}
                {currentLine ? (
                    <p
                        key={activeIndex}
                        className="leading-snug text-white/90 font-serif italic tracking-normal animate-fade-in-up"
                        style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "clamp(1.25rem, 3vw, 2rem)", // Elegant, subtle size
                            textShadow: "0 2px 10px rgba(0,0,0,0.2)" // Very soft shadow
                        }}
                    >
                        &ldquo;{currentLine.text}&rdquo;
                    </p>
                ) : (
                    <p className="opacity-0">...</p>
                )}
            </div>

            {/* Next Line (Ghost Preview) - Optional, kept very subtle */}
            {nextLine && (
                <div className="absolute bottom-8 opacity-20 blur-[2px] transition-all duration-500 transform scale-95">
                    <p className="font-serif italic text-white/40 tracking-wide" style={{ fontFamily: "var(--font-serif)", fontSize: "1rem" }}>
                        {nextLine.text.substring(0, 40)}{nextLine.text.length > 40 ? "..." : ""}
                    </p>
                </div>
            )}

            <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(10px) scale(0.95); filter: blur(4px); }
                    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}</style>
        </div>
    );
}
