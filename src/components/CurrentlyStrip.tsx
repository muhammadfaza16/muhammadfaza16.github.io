"use client";

import { useState, useEffect, useRef, useMemo, memo } from "react";
import { useAudio, PLAYLIST } from "./AudioContext";
import { useNarrativeEngine } from "../hooks/useNarrativeEngine"; // Import Narrative Engine Hook
import { useZen } from "./ZenContext";
import { ZenHideable } from "./ZenHideable";
import { SkipBack, SkipForward, Sparkles, X, AlignLeft } from "lucide-react";
import { getSongMessage } from "../data/songMessages";
import { LyricsDisplay } from "./LyricsDisplay";
import { motion, AnimatePresence } from "framer-motion";

// Helper component for typewriter effect
// Helper component for typewriter effect (Infinite Loop + Human Touch)
// Helper component for typewriter effect (Infinite Loop + Human Touch + Typos)
// Now supports multiple texts cycling!
function TypewriterText({
    text,
    texts,
    speed = 60,
    deleteSpeed = 30,
    pauseDuration = 2000
}: {
    text?: string;
    texts?: string[];
    speed?: number;
    deleteSpeed?: number;
    pauseDuration?: number
}) {
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isTypo, setIsTypo] = useState(false);
    const [textIndex, setTextIndex] = useState(0);

    // Normalize input to array
    const textQueue = useMemo(() => texts || (text ? [text] : []), [text, texts]);
    const currentFullText = textQueue[textIndex % textQueue.length] || "";

    // Cursor blinking effect
    const [isCursorVisible, setIsCursorVisible] = useState(true);
    useEffect(() => {
        const cursorTimer = setInterval(() => {
            setIsCursorVisible((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorTimer);
    }, []);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const currentSpeed = isDeleting
            ? deleteSpeed
            : speed + (Math.random() * (speed * 0.5)); // fast variance

        if (isDeleting) {
            // Deleting Phase
            setIsTypo(false);
            if (displayedText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayedText(currentFullText.substring(0, displayedText.length - 1));
                }, deleteSpeed);
            } else {
                // Done deleting, switch text and restart
                timeout = setTimeout(() => {
                    setIsDeleting(false);
                    setTextIndex((prev) => prev + 1);
                }, 800);
            }
        } else {
            // Typing Phase
            if (isTypo) {
                // Reaction time to realize typo
                timeout = setTimeout(() => {
                    setDisplayedText((prev) => prev.slice(0, -1));
                    setIsTypo(false);
                }, 400);
            } else if (displayedText.length < currentFullText.length) {
                // Chance to make a typo (5%)
                const shouldTypo = Math.random() < 0.05 && displayedText.length > 2 && displayedText.length < currentFullText.length - 3;

                if (shouldTypo) {
                    const keyboard = "abcdefghijklmnopqrstuvwxyz";
                    const randomChar = keyboard.charAt(Math.floor(Math.random() * keyboard.length));
                    timeout = setTimeout(() => {
                        setDisplayedText((prev) => prev + randomChar);
                        setIsTypo(true);
                    }, currentSpeed);
                } else {
                    // Type correct char
                    timeout = setTimeout(() => {
                        setDisplayedText(currentFullText.substring(0, displayedText.length + 1));
                    }, currentSpeed);
                }
            } else {
                // Done typing, wait before deleting
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, pauseDuration);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, isTypo, textIndex, textQueue, currentFullText, speed, deleteSpeed, pauseDuration]);

    return (
        <span>
            {displayedText}
            <span style={{
                display: "inline-block",
                width: "2px",
                height: "1em",
                backgroundColor: "currentColor",
                marginLeft: "2px",
                verticalAlign: "middle",
                opacity: isCursorVisible ? 1 : 0,
                transition: "opacity 0.1s"
            }} />
        </span>
    );
}

// Derived values from context now
// const playlist removed as it is handled by context for the active song

function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function getMoods(hour: number): string[] {
    if (hour >= 5 && hour < 8) return ["lowkey missing u", "kangen dikit (banyak)", "woke up smiling"];
    if (hour >= 8 && hour < 11) return ["distracted by u", "nungguin chat kamu", "kerja rasa rindu"];
    if (hour >= 11 && hour < 14) return ["butuh asupan (kamu)", "halfway to seeing u", "makan siang bareng yuk?"];
    if (hour >= 14 && hour < 17) return ["daydreaming rn", "bengong mikirin kamu", "afternoon slump < u"];
    if (hour >= 17 && hour < 19) return ["golden hour < u", "pengen telponan", "finally free (for u)"];
    if (hour >= 19 && hour < 22) return ["lagi dengerin lagu kita", "scrolling tapi kangen", "winding down w/ u on my mind"];
    if (hour >= 22 || hour < 2) return ["up thinking about us", "belum bobo?", "moonchild missing sun"];
    return ["dreaming of u. shh.", "3am thoughts of u", "kenapa belum tidur? (mikirin u)"];
}

// Smooth text transition component
// Text component with fixed width constraint to prevent layout shifts
function FixedWidthText({ text, width, className }: { text: string; width: string; className?: string }) {
    const [displayText, setDisplayText] = useState(text);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        if (text === displayText) return;

        setOpacity(0);

        const timer = setTimeout(() => {
            setDisplayText(text);
            setOpacity(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [text, displayText]);

    return (
        <span
            className={className}
            style={{
                display: "inline-block",
                width: width,
                minWidth: width,
                maxWidth: width,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "opacity 0.5s ease-in-out",
                opacity: opacity,
                verticalAlign: "middle",
                textAlign: "left"
            }}
        >
            {displayText}
        </span>
    );
}


// Individual Marquee Item with Visibility Tracking (Memoized)
const MarqueeItem = memo(function MarqueeItem({ item, id, onVisibilityChange }: {
    item: { icon: React.ReactNode; label: string; text: string; width?: string; labelWidth?: string; onClick?: () => void; className?: string };
    id: string;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
}) {
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only observe "Checking in" items
        if (item.label !== "Checking in") return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                onVisibilityChange(id, entry.isIntersecting);
            },
            { threshold: 0 }
        );

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        return () => observer.disconnect();
    }, [id, item.label, onVisibilityChange]);

    return (
        <div
            ref={itemRef}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                userSelect: "none",
                cursor: item.onClick ? "pointer" : "default",
                opacity: 0.9,
                transition: "opacity 0.2s"
            }}
            onClick={item.onClick}
            className={item.className}
        >
            <span style={{ color: "var(--accent)" }}>{item.icon}</span>
            <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                opacity: 0.7,
                display: "inline-block", // Required for width
                width: item.labelWidth || "auto", // Fixed label width
                textAlign: "left"
            }}>
                {item.label}:
            </span>
            <FixedWidthText
                text={item.text}
                width={item.width || "auto"}
                className={item.className}
            />
        </div >
    );
}
);

// Helper for the continuous marquee (Memoized)
const ContinuousMarquee = memo(function ContinuousMarquee({ items, onVisibilityChange }: {
    items: { icon: React.ReactNode; label: string; text: string; width?: string; labelWidth?: string; onClick?: () => void; className?: string }[];
    onVisibilityChange: (id: string, isVisible: boolean) => void;
    narrativeText?: string; // Trigger update on text change
}) {
    // Force re-render/animate when narrativeText changes if needed.
    // Since 'items' will change, this is handled by React defaut.
    return (
        <div style={{
            display: "flex",
            overflow: "hidden",
            width: "100%",
            maskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)"
        }}>
            {[0, 1, 2, 3].map((key) => (
                <div
                    key={key}
                    style={{
                        display: "flex",
                        gap: "1.25rem",
                        animation: "marquee 25s linear infinite",
                        paddingRight: "1.25rem",
                        flexShrink: 0,
                        transform: "translate3d(0, 0, 0)",
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden"
                    }}
                >
                    {items.map((item, i) => (
                        <MarqueeItem
                            key={`${key}-${i}`}
                            id={`${key}-${i}`}
                            item={item}
                            onVisibilityChange={onVisibilityChange}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
});


function getCheckInMessages(hour: number): string[] {
    // 05:00 - 10:59 (Morning)
    if (hour >= 5 && hour < 11) {
        return [
            "Morning. Mimpi aku ga?",
            "Hope ur day is as pretty as u.",
            "Semangat hari ini, aku pantau dari jauh 👀",
            "Sending u good energy (and a kiss) ✨",
            "Jangan lupa sarapan, manis."
        ];
    }
    // 11:00 - 14:59 (Mid-day / Lunch)
    if (hour >= 11 && hour < 15) {
        return [
            "Makan siang gih, jangan telat.",
            "Hydrate! (Send pic?) 💧",
            "Thinking of u at lunch.",
            "Bored? Gabut? Chat aku.",
            "Coba senyum dikit dong :)"
        ];
    }
    // 15:00 - 18:59 (Afternoon)
    if (hour >= 15 && hour < 19) {
        return [
            "Capek ya? Semangat kerjanya.",
            "Udah sore, jangan lembur teuing.",
            "Counting down to seeing u.",
            "Need a break? Call me.",
            "Take a deep breath. You got this."
        ];
    }
    // 19:00 - 22:59 (Evening)
    if (hour >= 19 && hour < 23) {
        return [
            "Cerita dong hari ini ngapain aja.",
            "Proud of u today.",
            "Wish u were here.",
            "Rest well, you did great.",
            "Dunia lagi berisik? Sini peluk."
        ];
    }
    // 23:00 - 04:59 (Late Night)
    return [
        "Bobo yuk, udah malem.",
        "Dream of me? Jk... unless?",
        "Miss u. G'night.",
        "Matikan hp, mimpikan aku.",
        "Jangan begadang, ga baik buat rindu."
    ];
}

const POKE_RESPONSES = [
    "Apa?", "Yo!", "Hadir!", "Sttt..",
    "Lagi asik", "Kenapa?", "Waduh", "Hehe",
    "Focus...", "Vibing~", "Ouch!", "Ticklish!"
];

import { getDynamicLyrics, LyricItem } from "../data/songLyrics";

// Multi-Level Vibe Data (Song Title -> Timestamps with intensity levels)
// level 1 = build up (pre-chorus)
// level 2 = beat drop (main drop)
const SONG_VIBES: Record<string, { start: number; end: number; level: 1 | 2 }[]> = {
    "Alan Walker — Faded": [
        { start: 31, end: 52, level: 1 },   // build up
        { start: 53, end: 92, level: 2 },  // beat drop
        // setelah 100, kembali normal
    ],
    // Format:
    // "Song Title": [
    //     { start: X, end: Y, level: 1 },  // build up
    //     { start: Y, end: Z, level: 2 },  // beat drop
    // ],
};

// Vibing Avatar Component (Levitation Mode)
const VibingAvatar = memo(function VibingAvatar({
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
    const { analyser, audioRef, currentSong } = useAudio();
    const floaterRef = useRef<SVGGElement>(null);
    const rafRef = useRef<number | null>(null);

    // Poke Interaction State
    const [pokeResponse, setPokeResponse] = useState<string | null>(null);
    const pokeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastMonologueRef = useRef<number>(0); // Cooldown for auto-monologue
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

        const bufferLength = analyser ? analyser.frequencyBinCount : 0;
        const dataArray = analyser ? new Uint8Array(bufferLength) : new Uint8Array(0);

        const tick = () => {
            // [MODIFIED] Audio Analysis / Simulation
            let avgBass = 0;
            let avgVol = 0;

            if (analyser) {
                // Real Analysis (Desktop/If enabled)
                analyser.getByteFrequencyData(dataArray);

                // Calculate bass (lower frequencies)
                let bassSum = 0;
                const bassBinCount = 4;
                for (let i = 0; i < bassBinCount; i++) {
                    bassSum += dataArray[i];
                }
                avgBass = bassSum / bassBinCount;

                // Calculate Overall Energy
                let totalSum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    totalSum += dataArray[i];
                }
                avgVol = totalSum / bufferLength;

            } else {
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
            const currentTime = audioRef.current?.currentTime ?? 0;
            const vibes = SONG_VIBES[currentSong.title];
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

            // [Timed Lyrics Sync] - Independent of analyser now!
            if (lyrics) {
                let lyricFound = false;
                for (const lyric of lyrics) {
                    if (currentTime >= lyric.start && currentTime < lyric.end) {
                        lyricFound = true;
                        const lyricKey = `${lyric.start}-${lyric.end}`;

                        if (lastLyricRef.current !== lyricKey) {
                            lastLyricRef.current = lyricKey;
                            const isFaded = currentSong.title.includes("Faded");

                            if (lyric.expressive) {
                                const words = lyric.text.split(' ');
                                const lyricDuration = (lyric.end - lyric.start) * 1000;
                                const staggerMs = isFaded
                                    ? Math.min(350, Math.max(200, (lyricDuration * 0.8) / words.length))
                                    : 350;

                                words.forEach((word: string, index: number) => {
                                    setTimeout(() => {
                                        const id = expressiveIdRef.current++;
                                        setExpressiveWords([{ id, text: word, index }]);
                                    }, index * staggerMs);
                                });

                                setTimeout(() => {
                                    setExpressiveWords([]);
                                }, lyricDuration);
                            } else {
                                const words = lyric.text.split(' ');
                                const lyricDuration = (lyric.end - lyric.start) * 1000;
                                const staggerMs = isFaded
                                    ? Math.min(350, Math.max(200, (lyricDuration * 0.8) / words.length))
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
    }, [isPlaying, analyser, currentSong, lyrics]);

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
                        font-family: var(--font-serif);
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

const WELCOME_MESSAGES = [
    "Hey... you made it.",
    "This isn't just a playlist.",
    "It's a collection of my thoughts.",
    "Ready to dive in?"
];


export function CurrentlyStrip() {
    // Destructure audio context with audioRef for the engine
    const { isPlaying, isBuffering, togglePlay, currentSong, nextSong, prevSong, hasInteracted, audioRef, warmup } = useAudio();

    // Debounced Buffering State (to avoid flickering "Buffering..." on fast loads)
    const [showBufferingUI, setShowBufferingUI] = useState(false);

    // Track song changes to temporarily show title
    const [justChangedSong, setJustChangedSong] = useState(false);

    useEffect(() => {
        setJustChangedSong(true);
        const timer = setTimeout(() => setJustChangedSong(false), 5000); // Show title for 5s
        return () => clearTimeout(timer);
    }, [currentSong]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isBuffering) {
            // Wait 1s before shouting "Buffering..." to the user
            // This hides short network hiccups or fast song switches
            timer = setTimeout(() => {
                setShowBufferingUI(true);
            }, 1000);
        } else {
            setShowBufferingUI(false);
        }
        return () => clearTimeout(timer);
    }, [isBuffering]);

    // Calculate Next Song for Bridging Logic
    const currentIndex = PLAYLIST.findIndex(s => s.title === currentSong.title);
    const nextIndex = (currentIndex + 1) % PLAYLIST.length;
    const nextSongTitle = PLAYLIST[nextIndex].title;

    // Initialize Narrative Engine
    const narrative = useNarrativeEngine({
        currentSongTitle: currentSong.title,
        isPlaying,
        audioRef,
        nextSongTitle // Pass it to engine
    });

    const { isZen, toggleZen } = useZen(); // Zen mode state

    const [currentTime, setCurrentTime] = useState("");
    const [currentHour, setCurrentHour] = useState(0);

    // Initial hydration fix
    const [isHydrated, setIsHydrated] = useState(false);

    // Moods now rotate based on time
    const [moods, setMoods] = useState<string[]>([]);
    const [moodIndex, setMoodIndex] = useState(0);
    const displayMood = moods.length > 0 ? moods[moodIndex % moods.length] : "";

    // Song Messages (under play button)
    const [songMessageIndex, setSongMessageIndex] = useState(0);
    const [msgOpacity, setMsgOpacity] = useState(1);

    // We only change the message when song changes or rotation happens
    // We only change the message when song changes or rotation happens
    const displaySongMessage = useMemo(() => {
        // Buffering State (Highest Priority)
        if (showBufferingUI) return "Buffering...";

        // UX FIX: Show Title immediately after song change (priority over narrative)
        if (justChangedSong) return currentSong.title;

        // Initial onboarding text
        if (!hasInteracted && !isPlaying) {
            return "Pick a song. Let's see where it takes us.";
        }
        return getSongMessage(currentSong.title, isPlaying, songMessageIndex);
    }, [currentSong, isPlaying, songMessageIndex, hasInteracted, showBufferingUI, justChangedSong]);

    // Check-in Message (THE NARRATIVE TEXT)
    // We use the text from the narrative engine directly
    const displayCheckIn = narrative.text;

    // "Welcome" text state (only shows once on very first interaction ever if we wanted,
    // but here we might just keep it simple)
    const [showWelcomeText, setShowWelcomeText] = useState(false);

    // Avatar Tooltip State
    const [showAvatarTooltip, setShowAvatarTooltip] = useState(false);

    // Lyrics Mode State
    const [showLyrics, setShowLyrics] = useState(false);

    useEffect(() => {
        if (isHydrated) {
            setShowAvatarTooltip(true);
            const timer = setTimeout(() => {
                setShowAvatarTooltip(false);
            }, 10000); // 10 seconds
            return () => clearTimeout(timer);
        }
    }, [isHydrated]);

    // Lyrics logic - Restored for Manual/Special Songs (e.g. Faded)
    // We need to check if these are "special" lyrics or just generic time-based ones.
    // Actually, getDynamicLyrics returns time-based ones by default if not Faded.
    // But the user WANTS "Faded" manual lyrics.
    // If the song is "Faded", getDynamicLyrics returns the specific array.
    // If it's another song, it returns the generic banks.
    // We want: Faded -> Manual Lyrics. Others -> Narrative Engine.

    // We can check if the song is in a "Special List" or just use the fact that non-special songs return generic arrays.
    // A cleaner way: Check if getDynamicLyrics returns the generic bank.
    // Or just check the song title.
    const isSpecialLyricSong = ["Alan Walker — Faded"].includes(currentSong.title);

    const manualLyrics = useMemo(() => {
        if (isSpecialLyricSong) {
            return getDynamicLyrics(currentSong.title);
        }
        return [];
    }, [currentSong, isSpecialLyricSong]);

    // narrativeLyricItem removed as it is no longer used.



    useEffect(() => {
        if (isPlaying && !hasInteracted) {
            // First time playing - show welcome text
            // setHasInteracted(true); // This is now managed by useAudio
            sessionStorage.setItem('player_interacted', 'true');
            setShowWelcomeText(true);
            // Hide after 5 seconds
            setTimeout(() => {
                setShowWelcomeText(false);
            }, 5000);
        }
    }, [isPlaying, hasInteracted]);

    // This useEffect is no longer needed as displaySongMessage is a useMemo
    // and rawSongMessage is removed.
    // useEffect(() => {
    //     if (rawSongMessage === displaySongMessage) return;
    //     setMsgOpacity(0);
    //     const timer = setTimeout(() => {
    //         setDisplaySongMessage(rawSongMessage);
    //         setMsgOpacity(1);
    //     }, 500);
    //     return () => clearTimeout(timer);
    // }, [rawSongMessage, displaySongMessage]);



    // Individually memoize items to prevent unnecessary    // Memoized Items
    const playingItem = useMemo(() => ({
        icon: showBufferingUI ? "⏳" : "🎵",
        label: showBufferingUI ? "Status" : "Playing",
        text: showBufferingUI ? "Buffering..." : currentSong.title,
        width: "200px", // Fixed width for song title
        labelWidth: "60px",
        className: "marquee-song-title"
    }), [currentSong.title, showBufferingUI]);

    const timeItem = useMemo(() => ({
        icon: "◎",
        label: "Time",
        text: currentTime,
        width: "65px",
        labelWidth: "40px" // Adjusted to legacy
    }), [currentTime]);

    const moodItem = useMemo(() => ({
        icon: "⚡",
        label: "Mood",
        text: displayMood,
        width: "160px",
        labelWidth: "40px"
    }), [displayMood]);

    const checkInItem = useMemo(() => ({
        icon: "💌",
        label: "Checking in",
        text: narrative.text || "Thinking of u...",
        width: "320px",
        labelWidth: "90px" // Legacy width
    }), [narrative.text]);

    // Initial visit welcome messages for marquee
    const welcomeItems = useMemo(() => [
        { icon: "👋", label: "Hey", text: "You made it. Finally." },
        { icon: "🧠", label: "Info", text: "This isn't just a playlist. It's my collection of thoughts." },
        { icon: "▶️", label: "Action", text: "Pick a song. Let's see where it takes us." },
    ], []);

    // Status items for the marquee (switch based on interaction state)
    const statusItems = useMemo(() => {
        // Show welcome items if user hasn't interacted yet
        if (!hasInteracted && !isPlaying) {
            return welcomeItems;
        }
        // Normal items after interaction
        return [
            playingItem,
            timeItem,
            moodItem,
            checkInItem
        ];
    }, [hasInteracted, isPlaying, welcomeItems, playingItem, timeItem, moodItem, checkInItem]);

    // Tracker for checking-in visibility
    const visibleCheckIns = useRef(new Set<string>());

    const handleVisibilityChange = (id: string, isVisible: boolean) => {
        if (isVisible) {
            visibleCheckIns.current.add(id);
        } else {
            visibleCheckIns.current.delete(id);
        }
    };

    useEffect(() => {
        setIsHydrated(true);

        let lastHour = -1; // Local tracking to prevent mood array re-creation

        const updateTime = () => {
            const now = new Date();
            setCurrentTime(formatTime(now)); // React bails out if string is same

            const h = now.getHours();
            // Only update moods if hour actually changes to avoid re-renders
            if (h !== lastHour) {
                setMoods(getMoods(h));
                setCurrentHour(h);
                lastHour = h;
            }
        };
        updateTime();
        const timeInterval = setInterval(updateTime, 1000);

        // Rotate mood message and song message every 20 seconds
        const contentRotationInterval = setInterval(() => {
            setMoodIndex((prev) => prev + 1);
            setSongMessageIndex((prev) => prev + 1);
        }, 20000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(contentRotationInterval);
        };
    }, []);

    if (!isHydrated) return null;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                gap: "0rem"
            }}>

            {/* Welcome Text */}
            {showWelcomeText && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: 'clamp(2rem, 10vw, 3.5rem)',
                        fontWeight: 500,
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        letterSpacing: '-0.01em',
                        color: 'var(--foreground)',
                        textAlign: 'center',
                        zIndex: 9999,
                        pointerEvents: 'none',
                        opacity: 0,
                        animation: 'welcome-fade 5s ease-in-out forwards'
                    }}
                >
                    Good choice, baby!
                    <style>{`
                        @keyframes welcome-fade {
                            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.98); }
                            15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                            85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                            100% { opacity: 0; transform: translate(-50%, -50%) scale(1.01); }
                        }
                    `}</style>
                </div>
            )}

            {/* Lyrics Layer (Sky) - Appears above avatar with smooth height animation */}
            <AnimatePresence>
                {showLyrics && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                        animate={{ height: "auto", opacity: 1, marginBottom: "1rem" }}
                        exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // Apple-like ease
                        style={{ overflow: "hidden", width: "100%" }}
                    >
                        <LyricsDisplay />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Avatar Layer - Always visible but shifted down when lyrics appear */}
            <div style={{ position: "relative" }}>
                {/* Avatar Tooltip - disappears when playing */}
                {!isPlaying && (
                    <div
                        style={{
                            position: "absolute",
                            top: "16px", // Right at the top edge
                            left: "50%",
                            transform: "translate(-50%, -100%)",
                            maxWidth: "140px",
                            width: "max-content",
                            marginBottom: "0px",
                            fontSize: "0.65rem", // Smaller
                            fontFamily: "var(--font-mono)",
                            color: "var(--foreground)",
                            opacity: 0.7,
                            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                            lineHeight: 1.2, // Tighter line spacing
                            whiteSpace: "normal",
                            textAlign: "center",
                            zIndex: 10,
                            pointerEvents: "none",
                            animation: "tooltip-enter 0.5s ease-out forwards"
                        }}
                    >
                        <TypewriterText
                            texts={WELCOME_MESSAGES}
                            speed={60}
                            deleteSpeed={50}
                            pauseDuration={3000}
                        />
                        <style>{`
                            @keyframes tooltip-enter {
                                0% { opacity: 0; }
                                100% { opacity: 0.7; }
                            }
                        `}</style>
                    </div>
                )}

                {/* Logic: If manual lyrics exist (Faded), use them. Otherwise use Narrative text. */}
                <VibingAvatar
                    // UX FIX: Avatar "Optimistically" floats during buffering.
                    // Only sit if we are paused / stopped.
                    // If buffering, we stay "Playing" (Floating) but maybe the internal wiggle pauses?
                    // actually user prefers it to just "stay floating". keeping isPlaying=true achieves that.
                    isPlaying={isPlaying}
                    hour={currentHour}
                    lyrics={manualLyrics}
                    narrativeText={manualLyrics.length > 0 ? undefined : narrative.text}
                    mood={narrative.mood}
                    pose={narrative.pose}
                />
            </div>

            {/* Top: Marquee Pill */}
            <ZenHideable showOnlyInZen>
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.75rem",
                        padding: "0.5rem 1.25rem",
                        borderRadius: "99px",
                        backgroundColor: "rgba(var(--background-rgb), 0.5)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid var(--border)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                        letterSpacing: "0.02em",
                        width: "clamp(300px, 90vw, 600px)",
                        overflow: "hidden"
                    }}
                    className="pause-on-hover"
                >
                    <ContinuousMarquee items={statusItems} onVisibilityChange={handleVisibilityChange} />
                </div>
            </ZenHideable>


            {/* Bottom: Play Control */}
            <div
                style={{
                    minHeight: "3rem", // reduced height
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingTop: "0rem", // adjusted for symmetry
                    paddingBottom: "0.25rem"
                }}
            >
                {/* Song message text with fade transition */}
                <p
                    style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: "0.95rem",
                        color: "var(--text-muted)",
                        margin: 0,
                        marginBottom: "0", // Reduced margin
                        cursor: "pointer",
                        userSelect: "none",
                        textAlign: "center",
                        minHeight: "2.8em", // Fixed height for 2 lines
                        display: "flex",
                        alignItems: "center", // Centered for symmetric gaps
                        justifyContent: "center",
                        transition: "opacity 0.5s ease-in-out",
                        opacity: msgOpacity
                    }}
                    onClick={togglePlay}
                >
                    {displaySongMessage}
                </p>

                {/* Player controls row */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {/* Hide prev/next buttons in initial state */}
                    {hasInteracted && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                prevSong();
                            }}
                            style={{
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                color: "var(--text-muted)",
                                opacity: 0.5,
                                display: "flex",
                                alignItems: "center",
                                transition: "all 0.2s ease",
                                padding: "4px"
                            }}
                            className="hover:opacity-100"
                            title="Previous Song"
                        >
                            <SkipBack size={14} />
                        </div>
                    )}

                    <button
                        onClick={togglePlay}
                        onMouseEnter={warmup} // SMART LOAD: Desktop Hover
                        onTouchStart={warmup} // SMART LOAD: Mobile Touch Start (100ms win)
                        style={{
                            all: "unset",
                            fontSize: (!hasInteracted && !isPlaying) ? "1.5rem" : "0.9rem",
                            color: "var(--foreground)",
                            opacity: (!hasInteracted && !isPlaying) ? 0.8 : 0.7,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px",
                            background: "transparent",
                            WebkitTapHighlightColor: "transparent",
                            cursor: "pointer",
                            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                        className="hover:opacity-100"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? "⏸" : "▶"}
                    </button>

                    {hasInteracted && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                nextSong();
                            }}
                            style={{
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                color: "var(--text-muted)",
                                opacity: 0.5,
                                display: "flex",
                                alignItems: "center",
                                transition: "all 0.2s ease",
                                padding: "4px"
                            }}
                            className="hover:opacity-100"
                            title="Next Song"
                        >
                            <SkipForward size={14} />
                        </div>
                    )}

                    {/* Lyrics Toggle */}
                    {hasInteracted && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowLyrics(prev => !prev);
                            }}
                            style={{
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                color: showLyrics ? "var(--accent)" : "var(--text-muted)",
                                opacity: showLyrics ? 1 : 0.5,
                                display: "flex",
                                alignItems: "center",
                                transition: "all 0.2s ease",
                                padding: "4px",
                                marginLeft: "4px"
                            }}
                            className="hover:opacity-100"
                            title="Lyrics"
                        >
                            <AlignLeft size={14} />
                        </div>
                    )}

                    {/* Zen Mode Toggle - Mobile focused */}
                    {hasInteracted && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleZen();
                            }}
                            style={{
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                color: isZen ? "var(--accent)" : "var(--text-muted)",
                                opacity: isZen ? 1 : 0.5,
                                display: "flex",
                                alignItems: "center",
                                transition: "all 0.2s ease",
                                padding: "4px",
                                marginLeft: "4px" // Extra spacing
                            }}
                            className="hover:opacity-100"
                            title={isZen ? "Exit Zen Mode" : "Enter Zen Mode"}
                        >
                            {isZen ? <X size={14} /> : <Sparkles size={14} />}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
