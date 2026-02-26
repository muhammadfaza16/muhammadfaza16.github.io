"use client";

import { useState, useEffect, useRef, memo } from "react";
import { useAudio } from "../AudioContext";
import { LyricItem } from "@/data/songLyrics";
import { POKE_RESPONSES, SONG_VIBES } from "./constants";

// Vibing Avatar Component (Levitation Mode)
export const VibingAvatar = memo(function VibingAvatar({
    isPlaying,
    hour,
    lyrics,
    narrativeText,
    mood,
    pose
}: {
    isPlaying: boolean;
    hour: number;
    lyrics: LyricItem[];
    narrativeText?: string;
    mood?: 'curious' | 'intense' | 'smart' | 'flirty' | 'chill';
    pose?: 'leaning_in' | 'chill' | 'bouncing' | 'annoyed';
}) {
    const { audioRef, currentSong } = useAudio();
    const floaterRef = useRef<SVGGElement>(null);
    const rafRef = useRef<number | null>(null);

    // Poke Interaction State
    const [pokeResponse, setPokeResponse] = useState<string | null>(null);
    const pokeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastLyricRef = useRef<string | null>(null); // Track displayed lyric to avoid stale closure

    // Floating Lyrics State (word-by-word animation)
    const [floatingWords, setFloatingWords] = useState<{ id: number; text: string; wordIndex: number }[]>([]);
    const wordIdRef = useRef(0);

    // Expressive Lyric State (dramatic full-screen text, word-by-word)
    const [expressiveWords, setExpressiveWords] = useState<{ id: number; text: string; index: number }[]>([]);
    const expressiveIdRef = useRef(0);

    // Dynamic Music Notes (bass-reactive)
    const [dynamicNotes, setDynamicNotes] = useState<{ id: number; x: number; delay: number }[]>([]);
    const noteIdRef = useRef(0);
    const lastNoteSpawnRef = useRef(0);

    const handlePoke = () => {
        // Prevent spamming
        if (pokeResponse) return;

        // Random reaction text
        const text = POKE_RESPONSES[Math.floor(Math.random() * POKE_RESPONSES.length)];
        setPokeResponse(text);

        // Reset after 2s
        if (pokeTimeoutRef.current) clearTimeout(pokeTimeoutRef.current);
        pokeTimeoutRef.current = setTimeout(() => {
            setPokeResponse(null);
        }, 2000);
    };

    useEffect(() => {
        // [MODIFIED] Run loop if playing, even if analyser is missing (for mobile stability)
        if (!isPlaying) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (floaterRef.current) floaterRef.current.style.transform = "scale(1)";
            return;
        }

        const tick = () => {
            // [MODIFIED] Audio Analysis / Simulation
            let avgBass = 0;
            let avgVol = 0;

            // [NEW] Simulation Mode (Mobile/No Analyser)
            // Use Vibe Data to simulate energy
            const currentTime = audioRef.current?.currentTime ?? 0;
            const vibes = SONG_VIBES[currentSong.title];
            let currentVibeLevel = 0;

            if (vibes) {
                for (const vibe of vibes) {
                    if (currentTime >= vibe.start && currentTime < vibe.end) {
                        currentVibeLevel = vibe.level;
                        break;
                    }
                }
            }

            // Simulate Bass based on Vibe Level
            // Base: Breathing (Sine wave)
            const pulse = (Math.sin(Date.now() / 500) + 1) / 2; // 0 to 1

            if (currentVibeLevel === 2) {
                // BEAT DROP: High simulated bass to trigger notes
                // Random spikes to mimic beat
                avgBass = 160 + (Math.random() * 50);
                avgVol = 180;
            } else if (currentVibeLevel === 1) {
                // BUILD UP
                avgBass = 80 + (pulse * 40);
                avgVol = 100;
            } else {
                // CHILL
                avgBass = 20 + (pulse * 20);
                avgVol = 50;
            }

            // Map bass (0-255) to scale (1.0 - 1.2)
            // Threshold: only react if bass > 100 to avoid jitter relative to real or sim data
            const scale = avgBass > 50 ? 1 + (avgBass / 255) * 0.15 : 1;

            if (floaterRef.current) {
                floaterRef.current.style.transform = `scale(${scale})`;
                floaterRef.current.style.transition = 'transform 0.05s ease-out';
            }

            // [Bass-Reactive Music Notes]
            const now = Date.now();
            // Spawn notes when bass > 150 and cooldown passed.
            // Works for both Real (High Bass) and Sim (Level 2 sets bass > 160)
            if (avgBass > 150 && now - lastNoteSpawnRef.current > 300) {
                lastNoteSpawnRef.current = now;
                const id = noteIdRef.current++;
                const x = 5 + Math.random() * 25; // Random X around head
                const delay = Math.random() * 0.3;
                setDynamicNotes(prev => [...prev, { id, x, delay }]);
                setTimeout(() => {
                    setDynamicNotes(prev => prev.filter(n => n.id !== id));
                }, 2500);
            }

            // [Intensity Detection & Override]
            // Re-calc vibe level for class application
            let vibeLevel = 0;

            if (vibes) {
                for (const vibe of vibes) {
                    if (currentTime >= vibe.start && currentTime < vibe.end) {
                        vibeLevel = vibe.level;
                        break;
                    }
                }
            }

            // High Energy Effects (CSS Aura/Stars)
            if (floaterRef.current) {
                const container = floaterRef.current.closest('.avatar-container');
                if (container) {
                    container.classList.remove('high-energy', 'vibe-level-1', 'vibe-level-2');

                    if (vibeLevel === 2) {
                        container.classList.add('vibe-level-2');
                    } else if (vibeLevel === 1) {
                        container.classList.add('vibe-level-1');
                    } else if (avgVol > 140) { // Fallback to volume check
                        container.classList.add('high-energy');
                    }
                }
            }

            // [Timed Lyrics Sync] - JSON Engine
            if (lyrics && lyrics.length > 0) {
                let lyricFound = false;

                for (let i = 0; i < lyrics.length; i++) {
                    const lyric = lyrics[i];
                    // Calculate dynamic end time
                    const nextTime = (i + 1 < lyrics.length) ? lyrics[i + 1].time : (lyric.time + 5);
                    const start = lyric.time;
                    const end = nextTime;

                    if (currentTime >= start && currentTime < end) {
                        lyricFound = true;
                        const lyricKey = `${start}-${end}`;

                        if (lastLyricRef.current !== lyricKey) {
                            lastLyricRef.current = lyricKey;

                            // Check if "Faded" for easter eggs? (Optional)
                            const isFaded = currentSong.title.includes("Faded");

                            // Standard Floating Words Logic
                            const words = lyric.text.split(' ');
                            const lyricDuration = (end - start) * 1000;
                            // Clamp duration for safety (e.g. max 5s per line for animation speed)
                            const effectiveDuration = Math.min(lyricDuration, 5000);

                            const staggerMs = isFaded
                                ? Math.min(350, Math.max(200, (effectiveDuration * 0.8) / words.length))
                                : 350;

                            words.forEach((word: string, index: number) => {
                                setTimeout(() => {
                                    const id = wordIdRef.current++;
                                    setFloatingWords(prev => [...prev, { id, text: word, wordIndex: index }]);
                                    setTimeout(() => {
                                        setFloatingWords(prev => prev.filter(w => w.id !== id));
                                    }, 7000);
                                }, index * staggerMs);
                            });
                        }
                        break;
                    }
                }

                if (!lyricFound && lastLyricRef.current) {
                    lastLyricRef.current = null;
                }
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        tick();

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isPlaying, currentSong, lyrics]);

    // Separate Effect for Narrative Text (Immediate Trigger)
    useEffect(() => {
        if (!narrativeText || !isPlaying) return; // Only show floating text when playing

        // Trigger floating words animation immediately
        const words = narrativeText.split(' ');
        // Calculate reading duration for cleanup reference only
        const duration = Math.max(2500, words.length * 350);

        // Fixed stagger for "Convos" - Standard reading pace
        const staggerMs = 350;

        words.forEach((word: string, index: number) => {
            setTimeout(() => {
                const id = wordIdRef.current++;
                setFloatingWords(prev => [...prev, { id, text: word, wordIndex: index }]);
                setTimeout(() => {
                    setFloatingWords(prev => prev.filter(w => w.id !== id));
                }, 7000); // 7s lifetime
            }, index * staggerMs);
        });

    }, [narrativeText]);


    return (
        <div style={{
            height: "55px", // Increased height for floating space
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            marginBottom: "0rem",
            position: "relative" // For bubble positioning
            // overflow: "hidden" // Removed to allow notes to float up
        }}>
            <style>
                {`
                    @keyframes float-up {
                        0% { transform: translateY(0) rotate(0deg); }
                        100% { transform: translateY(-14px) rotate(-2deg); }
                    }
                    @keyframes float-bob {
                        0%, 100% { transform: translateY(-14px) rotate(-2deg); }
                        50% { transform: translateY(-20px) rotate(1deg); }
                    }

                    /* State Transitions for Visibility */
                    .sit-pose, .lie-anchor {
                        transition: opacity 1.5s ease-in-out, transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                        transform-origin: center bottom;
                    }

                    /* SITTING (Default) */
                    .sit-pose {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    .lie-anchor {
                        opacity: 0;
                        transform: translateY(5px); /* Start slightly low */
                    }
                    
                    /* PLAYING ACTIVE STATE */
                    .avatar-floating .sit-pose {
                        opacity: 0;
                        transform: translateY(15px) rotate(-15deg) scale(0.9); /* Recline slow fade */
                    }
                    .avatar-floating .lie-anchor {
                        opacity: 1;
                        transform: translateY(0); /* Land on ground */
                    }

                    /* LEVITATION LOGIC (Inner Group) */
                    .lie-floater {
                        transform-origin: center center;
                    }
                    .avatar-floating .lie-floater {
                        /* 
                           1. Wait 1.5s (Lying down phase)
                           2. Float Up (2s duration)
                           3. Continuous Bob (Infinite, starts after float-up finishes) 
                        */
                        animation: 
                            float-up 2s ease-in-out 1.5s forwards,
                            float-bob 5s ease-in-out 3.5s infinite;
                    }

                    @keyframes echo-spread {
                        0% { transform: scale(1); opacity: 0.6; stroke-width: 1.5; }
                        100% { transform: scale(1.5); opacity: 0; stroke-width: 0.5; }
                    }
                    .echo-clone {
                        opacity: 0;
                        transform-origin: 30px 25px; /* Center of the body cluster */
                        pointer-events: none;
                    }
                    .avatar-floating .echo-clone {
                        animation: echo-spread 3s infinite ease-out;
                    }

                    @keyframes note-float {
                        0% { transform: translate(0, 0) rotate(0deg) scale(0.5); opacity: 0; }
                        20% { opacity: 0.35; }
                        100% { transform: translate(8px, -25px) rotate(15deg) scale(1); opacity: 0; }
                    }
                    .music-note {
                        opacity: 0;
                        transform-box: fill-box;
                        transform-origin: center;
                        pointer-events: none;
                    }
                    .avatar-floating .music-note {
                        animation: note-float 4s infinite ease-out;
                    }
                    
                    /* Dynamic Bass-Reactive Notes (smooth and natural) */
                    @keyframes dynamic-note-float {
                        0% { 
                            transform: translate(0, 0) scale(0.6); 
                            opacity: 0; 
                        }
                        20% { 
                            opacity: 0.4; 
                            transform: translate(3px, -10px) scale(1); 
                        }
                        100% { 
                            transform: translate(8px, -40px) scale(0.8); 
                            opacity: 0; 
                        }
                    }
                    .avatar-floating .dynamic-note {
                        animation: dynamic-note-float 3s ease-out forwards !important;
                    }

                    /* Floating Lyrics Animation */
                    @keyframes lyric-float {
                        0% { 
                            transform: translateY(0); 
                            opacity: 0; 
                        }
                        5% { 
                            opacity: 1; 
                        }
                        50% {
                            opacity: 0.7;
                        }
                        75% {
                            opacity: 0.3;
                        }
                        90% {
                            opacity: 0;
                        }
                        100% { 
                            transform: translateY(-100px); 
                            opacity: 0; 
                        }
                    }
                    .floating-lyric {
                        position: absolute;
                        left: 50%;
                        top: -5px;
                        font-size: 0.65rem;
                        font-weight: 600;
                        color: var(--foreground);
                        white-space: nowrap;
                        pointer-events: none;
                        animation: lyric-float 6s linear forwards;
                        text-shadow: 0 1px 3px rgba(0,0,0,0.3);
                        will-change: transform, opacity;
                    }

                    /* Poke Animations */
                    @keyframes poke-jump {
                        0% { transform: translateY(0); }
                        50% { transform: translateY(-5px); }
                        100% { transform: translateY(0); }
                    }
                    .avatar-poke-active {
                        animation: poke-jump 0.3s ease-out;
                    }
                    
                    /* High Energy (Reff/Drop) Effects - Smooth Transitions */
                    .echo-clone {
                        transition: opacity 0.8s ease-out, stroke 0.8s ease-out, stroke-width 0.5s ease-out;
                    }
                    .music-note {
                        transition: filter 0.5s ease-out;
                    }
                    
                    .high-energy .echo-clone {
                        opacity: 0.6; /* Slightly stronger */
                        stroke: #ffbd2e; /* Golden aura */
                        stroke-width: 1.8px;
                        /* No animation-duration change - prevents choppy restart */
                    }
                    .high-energy .music-note {
                        filter: drop-shadow(0 0 4px rgba(255, 189, 46, 0.7)); /* Golden glow */
                        /* No animation-duration change - prevents choppy restart */
                    }
                    .high-energy {
                        filter: drop-shadow(0 0 6px rgba(255, 189, 46, 0.4)); /* Subtle avatar glow */
                        transition: filter 0.5s ease-out;
                    }

                    @keyframes pop-in {
                        0% { opacity: 0; transform: translate(-50%, 10px) scale(0.8); }
                        100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
                    }

                    /* ========== VIBE LEVEL 1: RISING / FALLING ========== */
                    .vibe-level-1 .echo-clone {
                        opacity: 0.6;
                        stroke: #ffbd2e; /* Golden */
                    }
                    .vibe-level-1 .music-note {
                        filter: drop-shadow(0 0 6px rgba(255, 189, 46, 0.9));
                    }
                    .vibe-level-1 {
                        filter: brightness(1.1) drop-shadow(0 0 8px rgba(255, 189, 46, 0.4));
                        transition: filter 0.8s ease-out;
                    }

                    /* ========== VIBE LEVEL 2: PEAK / ENAK BANGET ========== */
                    .vibe-level-2 .echo-clone {
                        opacity: 0.75;
                        stroke: #fffb00; /* Neon Yellow */
                    }
                    .vibe-level-2 .music-note {
                        filter: drop-shadow(0 0 10px rgba(255, 251, 0, 1));
                    }
                    .vibe-level-2 {
                        filter: brightness(1.3) drop-shadow(0 0 15px rgba(255, 251, 0, 0.6));
                        transition: filter 0.8s ease-out;
                    }

                    /* ========== EXPRESSIVE LYRIC (Dramatic Word-by-Word) ========== */
                    @keyframes expressive-word {
                        0% { 
                            opacity: 0; 
                            transform: translate(-50%, -50%) scale(0.6);
                            filter: blur(4px);
                        }
                        20% { 
                            opacity: 1; 
                            transform: translate(-50%, -50%) scale(1.08);
                            filter: blur(0);
                        }
                        35% { 
                            transform: translate(-50%, -50%) scale(1);
                        }
                        80% { 
                            opacity: 1; 
                            transform: translate(-50%, -50%) scale(1);
                        }
                        100% { 
                            opacity: 0; 
                            transform: translate(-50%, -50%) scale(1.15);
                            filter: blur(2px);
                        }
                    }
                    .expressive-word {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: clamp(3rem, 15vw, 7rem);
                        font-weight: 800;
                        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
                        letter-spacing: -0.02em;
                        color: var(--foreground);
                        text-align: center;
                        z-index: 9999;
                        pointer-events: none;
                        text-shadow: 
                            0 0 20px rgba(255, 251, 0, 0.8),
                            0 0 40px rgba(255, 251, 0, 0.6),
                            0 0 80px rgba(255, 189, 46, 0.4),
                            0 4px 20px rgba(0, 0, 0, 0.3);
                        animation: expressive-word var(--word-duration, 1s) cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    }
                `}
            </style>

            {/* Expressive Words (Dramatic Word-by-Word) */}
            {expressiveWords.map((word) => (
                <div
                    key={word.id}
                    className="expressive-word"
                    style={{ ['--word-duration' as string]: '0.9s' }}
                >
                    {word.text}
                </div>
            ))}

            {/* Speech Bubble (HTML overlay) */}
            {pokeResponse && (
                <div style={{
                    position: "absolute",
                    top: "-25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--foreground)",
                    color: "var(--background)",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    fontFamily: "var(--font-mono)",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                    pointerEvents: "none",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    animation: "pop-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
                }}>
                    {pokeResponse}
                    {/* Tiny Triangle Pointer */}
                    <div style={{
                        position: "absolute",
                        bottom: "-4px",
                        left: "50%",
                        width: "0",
                        height: "0",
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                        borderTop: "4px solid var(--foreground)",
                        transform: "translateX(-50%)"
                    }} />
                </div>
            )}

            {/* Floating Lyrics (dreamy word-by-word) */}
            {floatingWords.map((word) => (
                <span
                    key={word.id}
                    className="floating-lyric"
                    style={{
                        // Alternating left-right spread: even words left, odd words right
                        marginLeft: `${(word.wordIndex % 2 === 0 ? -1 : 1) * 20}px`,
                    }}
                >
                    {word.text}
                </span>
            ))}


            <svg
                width="80"
                height="55"
                viewBox="0 0 80 55"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`avatar-container ${isPlaying ? "avatar-floating" : ""} ${pokeResponse ? "avatar-poke-active" : ""} ${pose ? `pose-${pose}` : ""}`}
                onClick={handlePoke}
                style={{
                    color: mood === 'intense' ? '#ff4d4d' : mood === 'flirty' ? '#ff69b4' : "var(--accent)", // Mood color overrides
                    overflow: "visible",
                    cursor: "pointer", // Indicate interactivity
                    userSelect: "none",
                    position: "relative" // For bubble context if needed (though parent has it)
                }}
                aria-label="faza"
            >
                {/* Sitting Pose Group */}
                <g className="sit-pose">
                    <path d="M40 38 L40 48" /> {/* Torso */}
                    <path d="M40 48 L32 55" /> {/* Leg L */}
                    <path d="M40 48 L48 55" /> {/* Leg R */}
                    <path d="M40 40 L34 44" /> {/* Arm L */}
                    <path d="M40 40 L46 44" /> {/* Arm R */}
                    <circle cx="40" cy="34" r="5" /> {/* Head */}

                    {/* Routine Props (Only visible when SITTING/NOT PLAYING) */}
                    {!isPlaying && hour >= 5 && hour < 10 && (
                        <g className="prop-coffee">
                            {/* Coffee Mug in hand */}
                            <path d="M30 42 L30 46 L34 46 L34 42 Z" fill="currentColor" />
                            <path d="M34 43 C35 43 35 45 34 45" fill="none" strokeWidth="1" /> {/* Handle */}
                            {/* Steam */}
                            <path d="M31 40 L31 38" stroke="currentColor" strokeWidth="0.5" opacity="0.6">
                                <animate attributeName="d" values="M31 40 L31 38; M31 39 L32 37; M31 40 L31 38" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                            </path>
                        </g>
                    )}
                    {!isPlaying && hour >= 10 && hour < 18 && (
                        <g className="prop-laptop">
                            {/* Laptop on lap */}
                            <rect x="34" y="42" width="12" height="8" rx="1" fill="currentColor" transform="rotate(-10 40 46)" />
                            <rect x="36" y="43" width="8" height="6" rx="0.5" fill="var(--background)" transform="rotate(-10 40 46)" />
                        </g>
                    )}
                </g>

                {/* Expressions / Emotes (Visible on Poke) */}


                {/* Lying Wrapper (Anchor for Opacity) */}
                <g className="lie-anchor">
                    {/* Floating Wrapper (Anchor for Levitation) */}
                    <g className="lie-floater">
                        {/* Audio Reactive Scale Wrapper */}
                        <g ref={floaterRef} style={{ transformOrigin: "30px 35px" }}>
                            <g transform="translate(10, 10)">
                                {/* Body Echoes (Behind body) - "Terhanyut" effect */}
                                <g className="echo-clone" style={{ animationDelay: "3.5s" }}>
                                    <path d="M15 28 L35 28" /> {/* Torso */}
                                    <path d="M18 28 L 5 22 L 12 25" strokeLinejoin="round" /> {/* Arms */}
                                    <path d="M35 28 L55 28" /> {/* R Leg */}
                                    <path d="M55 28 L58 24" />
                                    <path d="M35 28 L45 18" /> {/* L Leg */}
                                    <path d="M45 18 L50 28" />
                                    <circle cx="12" cy="25" r="5" /> {/* Head */}
                                </g>
                                <g className="echo-clone" style={{ animationDelay: "4.5s" }}>
                                    <path d="M15 28 L35 28" />
                                    <path d="M18 28 L 5 22 L 12 25" strokeLinejoin="round" />
                                    <path d="M35 28 L55 28" />
                                    <path d="M55 28 L58 24" />
                                    <path d="M35 28 L45 18" />
                                    <path d="M45 18 L50 28" />
                                    <circle cx="12" cy="25" r="5" />
                                </g>

                                {/* Head (looking up) */}
                                <circle cx="12" cy="25" r="5" />

                                {/* Music Notes (Floating from head) */}
                                <g className="music-note" style={{ animationDelay: "2s" }}>
                                    <circle cx="20" cy="18" r="2" fill="currentColor" />
                                    <path d="M22 18 L22 8 L28 10" strokeWidth="1.5" strokeLinecap="round" />
                                </g>
                                <g className="music-note" style={{ animationDelay: "4s" }}>
                                    <circle cx="10" cy="20" r="2" fill="currentColor" />
                                    <circle cx="16" cy="18" r="2" fill="currentColor" />
                                    <path d="M12 20 L12 12 L18 10 L18 18" strokeWidth="1.5" strokeLinecap="round" />
                                </g>

                                {/* Dynamic Bass-Reactive Notes */}
                                {dynamicNotes.map((note) => (
                                    <g
                                        key={note.id}
                                        className="music-note dynamic-note"
                                        style={{ animationDelay: `${note.delay}s` }}
                                    >
                                        <circle cx={note.x} cy="18" r="2" fill="currentColor" />
                                        <path d={`M${note.x + 2} 18 L${note.x + 2} 8 L${note.x + 8} 10`} strokeWidth="1.5" strokeLinecap="round" />
                                    </g>
                                ))}
                                {/* Torso */}
                                <path d="M15 28 L35 28" />

                                {/* Arms */}
                                <path d="M18 28 L 5 22 L 12 25" strokeLinejoin="round" />

                                {/* R Leg */}
                                <path d="M35 28 L55 28" />
                                <path d="M55 28 L58 24" />

                                {/* L Leg */}
                                <path d="M35 28 L45 18" />
                                <path d="M45 18 L50 28" />
                            </g>
                        </g>
                    </g>
                </g>

                {/* Grass/Ground line */}
                <path d="M0 48 L80 48" strokeWidth="1.5" strokeOpacity="0.2" />
                <title>faza</title>
            </svg>
        </div >
    );
});
