"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

interface AudioContextType {
    isPlaying: boolean;
    togglePlay: () => void;
    nextSong: (forcePlay?: boolean) => void;
    prevSong: () => void;
    currentSong: { title: string; audioUrl: string };
    analyser: AnalyserNode | null;
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}
const PLAYLIST = [
    {
        title: "Alan Walker — Alone Pt II",
        audioUrl: "/audio/Alan%20Walker%20-%20Alone%20Pt%20II.mp3"
    },
    {
        title: "Alan Walker — Alone",
        audioUrl: "/audio/Alan%20Walker%20-%20Alone.mp3"
    },
    {
        title: "Alan Walker — Darkside (feat. AuRa...",
        audioUrl: "/audio/Alan%20Walker%20-%20Darkside%20(feat.%20AuRa....mp3"
    },
    {
        title: "Alan Walker — Faded",
        audioUrl: "/audio/Alan%20Walker%20-%20Faded.mp3"
    },
    {
        title: "Alan Walker — Sing Me To Sleep",
        audioUrl: "/audio/Alan%20Walker%20-%20Sing%20Me%20To%20Sleep.mp3"
    },
    {
        title: "Alan Walker — The Spectre",
        audioUrl: "/audio/Alan%20Walker%20-%20The%20Spectre.mp3"
    },
    {
        title: "Alan Walker — Lily",
        audioUrl: "/audio/Alan%20Walker%20-%20Lily.mp3"
    },
    {
        title: "Alan Walker — On My Way",
        audioUrl: "/audio/Alan%20Walker%20-%20On%20My%20Way.mp3"
    },
    {
        title: "Arctic Monkeys — I Wanna Be Yours",
        audioUrl: "/audio/Arctic%20Monkeys%20-%20I%20Wanna%20Be%20Yours.mp3"
    },
    {
        title: "Astrid S — Hurts So Good",
        audioUrl: "/audio/Astrid%20S%20-%20Hurts%20So%20Good.mp3"
    },
    {
        title: "Bruno Mars — It Will Rain",
        audioUrl: "/audio/Bruno%20Mars%20-%20It%20Will%20Rain.mp3"
    },
    {
        title: "Bruno Mars — Locked Out Of Heaven",
        audioUrl: "/audio/Bruno%20Mars%20-%20Locked%20Out%20Of%20Heaven.mp3"
    },
    {
        title: "Bruno Mars — Talking To The Moon",
        audioUrl: "/audio/Bruno%20Mars%20-%20Talking%20To%20The%20Moon.mp3"
    },
    {
        title: "Conan Gray — Memories",
        audioUrl: "/audio/Conan%20Gray%20-%20Memories.mp3"
    },
    {
        title: "Ellie Goulding — Love Me Like You Do",
        audioUrl: "/audio/Ellie%20Goulding%20-%20Love%20Me%20Like%20You%20Do.mp3"
    },
    {
        title: "Glass Animals — You look so...",
        audioUrl: "/audio/Glass%20Animals%20-%20You%20look%20so....mp3"
    },
    {
        title: "Halsey — Without Me",
        audioUrl: "/audio/Halsey%20-%20Without%20Me.mp3"
    },
    {
        title: "Harry Styles — Sign of the Times",
        audioUrl: "/audio/Harry%20Styles%20-%20Sign%20of%20the%20Times.mp3"
    },
    {
        title: "Hoobastank — The Reason",
        audioUrl: "/audio/Hoobastank%20-%20The%20Reason.mp3"
    },
    {
        title: "James Arthur — Impossible",
        audioUrl: "/audio/James%20Arthur%20-%20Impossible.mp3"
    },
    {
        title: "John Newman — Love Me Again",
        audioUrl: "/audio/John%20Newman%20-%20Love%20Me%20Again.mp3"
    },
    {
        title: "Peterpan — Ku Katakan Dengan Indah",
        audioUrl: "/audio/Peterpan%20-%20Ku%20Katakan%20Dengan%20Indah.mp3"
    },
    {
        title: "Lord Huron — The Night We Met",
        audioUrl: "/audio/Lord%20Huron%20-%20The%20Night%20We%20Met.mp3"
    },
    {
        title: "Loreen — Tattoo",
        audioUrl: "/audio/Loreen%20-%20Tattoo.mp3"
    },
    {
        title: "Lukas Graham — 7 Years",
        audioUrl: "/audio/Lukas%20Graham%20-%207%20Years.mp3"
    },
    {
        title: "MAGIC! — Rude",
        audioUrl: "/audio/MAGIC!%20-%20Rude.mp3"
    },
    {
        title: "Melanie Martinez — Play Date",
        audioUrl: "/audio/Melanie%20Martinez%20-%20Play%20Date.mp3"
    },
    {
        title: "Noah — Ini Cinta",
        audioUrl: "/audio/Noah%20-%20Ini%20Cinta.mp3"
    },
    {
        title: "Noah — Separuh Aku",
        audioUrl: "/audio/Noah%20-%20Separuh%20Aku.mp3"
    },
    {
        title: "The Script — The Man Who...",
        audioUrl: "/audio/The%20Script%20-%20The%20Man%20Who....mp3"
    }
];

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    // Theme integration
    const { theme, setTheme } = useTheme();
    const wasSwitchedRef = useRef(false);

    // Melancholy Mode Effect
    useEffect(() => {
        if (isPlaying && setTheme) {
            if (theme === "light") {
                setTheme("dark");
                wasSwitchedRef.current = true;
            }
        } else if (setTheme) {
            // When paused/stopped, revert only if we switched it
            if (wasSwitchedRef.current) {
                setTheme("light");
                wasSwitchedRef.current = false;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, setTheme]);

    // Resume AudioContext when tab becomes visible again
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const initializeAudio = useCallback(() => {
        if (!audioRef.current || sourceRef.current) return; // Already initialized

        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;

            const analyserNode = ctx.createAnalyser();
            analyserNode.fftSize = 64; // Low bin count for performance & bass focus

            const source = ctx.createMediaElementSource(audioRef.current);
            source.connect(analyserNode);
            analyserNode.connect(ctx.destination);

            sourceRef.current = source;
            setAnalyser(analyserNode);
        } catch (error) {
            console.error("Failed to initialize Web Audio API:", error);
        }
    }, []);

    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;

        initializeAudio(); // Ensure context is ready on interaction

        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
    }, [isPlaying, initializeAudio]);

    const nextSong = useCallback((forcePlay = false) => {
        setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);

        if (forcePlay) {
            setIsPlaying(true);
        }
    }, []);

    const prevSong = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    }, []);

    // Auto-play when index changes if it was already playing or triggered by next
    useEffect(() => {
        if (audioRef.current && isPlaying) {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
    }, [currentIndex, isPlaying]);

    const currentSong = PLAYLIST[currentIndex];

    return (
        <AudioContext.Provider value={{ isPlaying, togglePlay, nextSong, prevSong, currentSong, analyser, audioRef }}>
            <audio
                ref={audioRef}
                crossOrigin="anonymous"
                src={currentSong.audioUrl}
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => nextSong(true)}
                onError={(e) => {
                    console.error("Audio error:", e);
                    // Try next song on error? Or just stop.
                    setIsPlaying(false);
                }}
            />
            {children}
        </AudioContext.Provider>
    );
}
