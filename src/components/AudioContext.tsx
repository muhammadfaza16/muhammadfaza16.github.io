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
    hasInteracted: boolean;
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
    // 1. Heroes
    {
        title: "Janji — Heroes Tonight",
        audioUrl: "/audio/Janji%20-%20Heroes%20Tonight%20(feat.%20Johnning)%20%20Progressive%20House%20%20NCS%20-%20Copyright%20Free%20Music.mp3"
    },
    // 2. Play
    {
        title: "Alan Walker, K-391, Tungevaag, Mangoo — Play",
        audioUrl: "/audio/Alan%20Walker%20-%20Play%20(Lyrics)%20ft.%20K-391,%20Tungevaag,%20Mangoo.mp3"
    },
    // 3. Save Your Tears
    {
        title: "The Weeknd & Ariana Grande — Save Your Tears",
        audioUrl: "/audio/The%20Weeknd%20&%20Ariana%20Grande%20-%20Save%20Your%20Tears%20(Remix)%20(Lyrics).mp3"
    },

    // ==================== RANDOM MIX ====================
    {
        title: "Alan Walker — The Spectre",
        audioUrl: "/audio/Alan%20Walker%20-%20The%20Spectre.mp3"
    },
    {
        title: "Camila Cabello — Shameless",
        audioUrl: "/audio/Camila%20Cabello%20-%20Shameless.mp3"
    },
    {
        title: "Alan Walker — Darkside",
        audioUrl: "/audio/Alan%20Walker%20-%20Darkside%20(feat.%20AuRa....mp3"
    },
    {
        title: "Arash feat. Helena — Broken Angel",
        audioUrl: "/audio/Arash%20feat.%20Helena%20-%20Broken%20Angel%20(Official%20Video).mp3"
    },
    {
        title: "John Newman — Love Me Again",
        audioUrl: "/audio/John%20Newman%20-%20Love%20Me%20Again.mp3"
    },
    {
        title: "Alan Walker — Alone",
        audioUrl: "/audio/Alan%20Walker%20-%20Alone.mp3"
    },
    {
        title: "Edward Maya — Stereo Love",
        audioUrl: "/audio/Edward%20Maya,%20Vika%20Jigulina%20-%20Stereo%20love%20(Radio%20Edit)%20(Lyrics).mp3"
    },
    {
        title: "Gym Class Heroes — Stereo Hearts",
        audioUrl: "/audio/Gym%20Class%20Heroes%20-%20Stereo%20Hearts%20(Lyrics)%20%20Heart%20Stereo.mp3"
    },
    {
        title: "Martin Garrix & Bebe Rexha — In The Name Of Love",
        audioUrl: "/audio/Martin%20Garrix%20&%20Bebe%20Rexha%20-%20In%20The%20Name%20Of%20Love%20(Official%20Video).mp3"
    },
    {
        title: "Alan Walker — Lily",
        audioUrl: "/audio/Alan%20Walker%20-%20Lily.mp3"
    },
    {
        title: "Alan Walker — Sing Me To Sleep",
        audioUrl: "/audio/Alan%20Walker%20-%20Sing%20Me%20To%20Sleep.mp3"
    },
    {
        title: "Arash feat. Helena — One Day",
        audioUrl: "/audio/ARASH%20feat%20Helena%20-%20ONE%20DAY%20(Official%20Video).mp3"
    },
    {
        title: "Alan Walker — Faded",
        audioUrl: "/audio/Alan%20Walker%20-%20Faded.mp3"
    },
    {
        title: "Avicii — The Nights",
        audioUrl: "/audio/Avicii%20-%20The%20Nights%20(Lyrics)%20my%20father%20told%20me.mp3"
    },
    {
        title: "Alan Walker — On My Way",
        // Assuming path exists or using closest match. Wait, 'On My Way' wasn't in original file list?
        // Let me re-check file list. It was NOT in the file list I saw earlier (step 64).
        // I will remove it to avoid 404 if it's not there, OR I made a mistake.
        // Re-reading step 64... 'Alan Walker - On My Way.mp3' IS NOT THERE.
        // It was in themes, but not files. I will exclude it to be safe, or map to 'Alone Pt II' as placeholder?
        // Better to exclude if file missing.
        // WAIT. I saw "Alan Walker - Alone Pt II" and others.
        // I will exclude 'On My Way' from this list to avoid breaking the player.
        // But wait, the user had it in themes. I will check file list again carefully. step 64.
        // ...
        // No 'On My Way' in step 64.
        // I will SKIP it in the playlist to avoid errors.
        audioUrl: "/audio/Alan%20Walker%20-%20Faded.mp3" // Fallback or skip? I'll skip it.
    },
    {
        title: "Fun. — We Are Young",
        audioUrl: "/audio/Fun.%20-%20We%20Are%20Young%20(Lyrics)%20ft.%20Janelle%20Monáe.mp3"
    },
    {
        title: "Bruno Mars — Locked Out Of Heaven",
        audioUrl: "/audio/Bruno%20Mars%20-%20Locked%20Out%20Of%20Heaven.mp3"
    },
    {
        title: "Bruno Mars — It Will Rain",
        audioUrl: "/audio/Bruno%20Mars%20-%20It%20Will%20Rain.mp3"
    },
    {
        title: "Alan Walker — Alone Pt II",
        audioUrl: "/audio/Alan%20Walker%20-%20Alone%20Pt%20II.mp3"
    },
    {
        title: "Kygo & Selena Gomez — It Ain't Me",
        audioUrl: "/audio/Kygo%20&%20Selena%20Gomez%20-%20It%20Ain't%20Me%20(Audio).mp3"
    },
    {
        title: "Mike Posner — I Took A Pill In Ibiza",
        audioUrl: "/audio/Mike%20Posner%20-%20I%20Took%20A%20Pill%20In%20Ibiza%20(SeeB%20Remix).mp3"
    },
    {
        title: "Loreen — Tattoo",
        audioUrl: "/audio/Loreen%20-%20Tattoo.mp3"
    },

    // ==================== END SEQUENCE ====================
    {
        title: "Ellie Goulding — Love Me Like You Do",
        audioUrl: "/audio/Ellie%20Goulding%20-%20Love%20Me%20Like%20You%20Do.mp3"
    },
    {
        title: "Lukas Graham — 7 Years",
        audioUrl: "/audio/Lukas%20Graham%20-%207%20Years.mp3"
    },
    {
        title: "Astrid S — Hurts So Good",
        audioUrl: "/audio/Astrid%20S%20-%20Hurts%20So%20Good.mp3"
    },
    {
        title: "Harry Styles — Sign of the Times",
        audioUrl: "/audio/Harry%20Styles%20-%20Sign%20of%20the%20Times.mp3"
    },
    {
        title: "Lord Huron — The Night We Met",
        audioUrl: "/audio/Lord%20Huron%20-%20The%20Night%20We%20Met.mp3"
    },
    {
        title: "Peterpan — Ku Katakan Dengan Indah",
        audioUrl: "/audio/Peterpan%20-%20Ku%20Katakan%20Dengan%20Indah.mp3"
    },
    {
        title: "Keane — Somewhere Only We Know",
        audioUrl: "/audio/Keane%20-%20Somewhere%20Only%20We%20Know%20(Official%20Music%20Video).mp3"
    },
    {
        title: "Conan Gray — Memories",
        audioUrl: "/audio/Conan%20Gray%20-%20Memories.mp3"
    },
    {
        title: "Hoobastank — The Reason",
        audioUrl: "/audio/Hoobastank%20-%20The%20Reason.mp3"
    },
    {
        title: "Halsey — Without Me",
        audioUrl: "/audio/Halsey%20-%20Without%20Me.mp3"
    },
    {
        title: "James Arthur — Impossible",
        audioUrl: "/audio/James%20Arthur%20-%20Impossible.mp3"
    },
    {
        title: "The Script — The Man Who...",
        audioUrl: "/audio/The%20Script%20-%20The%20Man%20Who....mp3"
    },
    {
        title: "Bruno Mars — Talking To The Moon",
        audioUrl: "/audio/Bruno%20Mars%20-%20Talking%20To%20The%20Moon.mp3"
    },
    {
        title: "Selena Gomez — Love You Like a Love Song",
        audioUrl: "/audio/Selena%20Gomez%20-%20Love%20You%20Like%20a%20Love%20Song%20(Lyrics)%20no%20one%20compares%20you%20stand%20alone.mp3"
    },
    {
        title: "One Direction — Night Changes",
        audioUrl: "/audio/One%20Direction%20-%20Night%20Changes%20(Lyrics)%20(1).mp3"
    },
    {
        title: "One Direction — Story of My Life",
        audioUrl: "/audio/Story%20of%20my%20Life%20-%20ONE%20DIRECTION%20(Lyrics%20Video).mp3"
    }
].filter(song => song.title !== "Alan Walker — On My Way"); // Filter out invalid entries if any

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

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



    const initializeAudio = useCallback(() => {
        // DISABLED for Mobile Reliability (Background Play)
        // Connecting MediaElementSource hijacks the audio stream into Web Audio API,
        // which gets suspended by iOS/Android in background.
        // We strictly use native <audio> behavior now.
        return;

        /* 
        if (!audioRef.current || sourceRef.current) return; // Already initialized

        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;

            // Keep Alive Logic: Force resume if browser suspends context (critical for background play)
            ctx.onstatechange = () => {
                if (ctx.state === 'suspended' && audioRef.current && !audioRef.current.paused) {
                   ctx.resume();
                }
            };

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
        */
    }, []);

    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;

        initializeAudio(); // Ensure context is ready on interaction
        setHasInteracted(true);

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

    // Media Session API (Lock Screen Controls)
    useEffect(() => {
        if (!currentSong || !("mediaSession" in navigator)) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: currentSong.title.split("—")[1]?.trim() || currentSong.title,
            artist: currentSong.title.split("—")[0]?.trim() || "Faza's Playlist",
            album: "Taman Langit",
            artwork: [
                { src: "/icon.png", sizes: "192x192", type: "image/png" }
            ]
        });

        navigator.mediaSession.setActionHandler("play", () => {
            togglePlay();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
            togglePlay();
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => prevSong());
        navigator.mediaSession.setActionHandler("nexttrack", () => nextSong());

        return () => {
            if ("mediaSession" in navigator) {
                navigator.mediaSession.setActionHandler("play", null);
                navigator.mediaSession.setActionHandler("pause", null);
                navigator.mediaSession.setActionHandler("previoustrack", null);
                navigator.mediaSession.setActionHandler("nexttrack", null);
            }
        };
    }, [currentSong, togglePlay, nextSong, prevSong]);

    return (
        <AudioContext.Provider value={{ isPlaying, togglePlay, nextSong, prevSong, currentSong, analyser, audioRef, hasInteracted }}>
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
