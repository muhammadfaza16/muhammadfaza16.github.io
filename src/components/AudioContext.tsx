"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "./ThemeProvider";
// import { getDynamicLyrics, LyricItem } from "@/data/songLyrics"; // OLD ENGINE

export interface LyricItem {
    time: number;
    text: string;
}

interface AudioContextType {
    isPlaying: boolean;
    togglePlay: () => void;
    nextSong: (forcePlay?: boolean) => void;
    prevSong: () => void;
    jumpToSong: (index: number) => void;
    currentSong: { title: string; audioUrl: string };
    analyser: AnalyserNode | null;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    hasInteracted: boolean;
    isBuffering: boolean;
    warmup: () => void;
    showLyrics: boolean;
    setShowLyrics: (v: boolean) => void;
    showMarquee: boolean;
    setShowMarquee: (v: boolean) => void;
    showNarrative: boolean;
    setShowNarrative: (v: boolean) => void;
    currentLyricText: string | null;
    activeLyrics: LyricItem[];
    playQueue: (songs: any[], startIndex?: number) => void;
    queue: { title: string; audioUrl: string }[];
    currentIndex: number;
    // Time tracking
    currentTime: number;
    duration: number;
    seekTo: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}
// Verified Playlist from public/audio (101 songs)
export const PLAYLIST = [
    { title: "Camila Cabello — Never Be the Same", audioUrl: "/audio/@camilacabello%20-%20Never%20Be%20the%20Same%20(Lyrics).mp3" },
    { title: "Henry Moodie — Drunk Text", audioUrl: "/audio/@HenryMoodie%20%20-%20drunk%20text%20(Lyrics).mp3" },
    { title: "Akon — Right Now Na Na Na", audioUrl: "/audio/Akon%20-%20Right%20Now%20Na%20Na%20Na%20(Lyrics).mp3" },
    { title: "Alan Walker & Emma Steinbakken — Not You", audioUrl: "/audio/Alan%20Walker%20%26%20Emma%20Steinbakken%20-%20Not%20You%20(Lyrics).mp3" },
    { title: "Alan Walker — Alone Pt II", audioUrl: "/audio/Alan%20Walker%20-%20Alone%20Pt%20II.mp3" },
    { title: "Alan Walker — Alone", audioUrl: "/audio/Alan%20Walker%20-%20Alone.mp3" },
    { title: "Alan Walker — Darkside", audioUrl: "/audio/Alan%20Walker%20-%20Darkside%20(feat.%20AuRa....mp3" },
    { title: "Alan Walker — Faded", audioUrl: "/audio/Alan%20Walker%20-%20Faded.mp3" },
    { title: "Alan Walker — Lily", audioUrl: "/audio/Alan%20Walker%20-%20Lily.mp3" },
    { title: "Alan Walker — Play", audioUrl: "/audio/Alan%20Walker%20-%20Play%20(Lyrics)%20ft.%20K-391,%20Tungevaag,%20Mangoo.mp3" },
    { title: "Alan Walker — Sing Me To Sleep", audioUrl: "/audio/Alan%20Walker%20-%20Sing%20Me%20To%20Sleep.mp3" },
    { title: "Alan Walker — The Spectre", audioUrl: "/audio/Alan%20Walker%20-%20The%20Spectre.mp3" },
    { title: "Kodaline — All I Want", audioUrl: "/audio/All%20I%20Want.mp3" },
    { title: "Cigarettes After Sex — Apocalypse", audioUrl: "/audio/Apocalypse.mp3" },
    { title: "Arash feat. Helena — One Day", audioUrl: "/audio/ARASH%20feat%20Helena%20-%20ONE%20DAY%20(Official%20Video).mp3" },
    { title: "Arash feat. Helena — Broken Angel", audioUrl: "/audio/Arash%20feat.%20Helena%20-%20Broken%20Angel%20(Official%20Video).mp3" },
    { title: "Armada — Apa Kabar Sayang", audioUrl: "/audio/Armada%20-%20Apa%20Kabar%20Sayang%20(Official%20Music%20Video).mp3" },
    { title: "Astrid S — Hurts So Good", audioUrl: "/audio/Astrid%20S%20-%20Hurts%20So%20Good.mp3" },
    { title: "Ava Max — Kings & Queens", audioUrl: "/audio/Ava%20Max%20-%20Kings%20%26%20Queens%20(Lyrics).mp3" },
    { title: "Ava Max — Sweet but Psycho", audioUrl: "/audio/Ava%20Max%20-%20Sweet%20but%20Psycho%20(Lyrics).mp3" },
    { title: "Avicii — The Nights", audioUrl: "/audio/Avicii%20-%20The%20Nights%20(Lyrics)%20my%20father%20told%20me.mp3" },
    { title: "Axwell Λ Ingrosso — More Than You Know", audioUrl: "/audio/Axwell%20%CE%9B%20Ingrosso%20-%20More%20Than%20You%20Know%20(Lyrics).mp3" },
    { title: "Benson Boone — In the Stars", audioUrl: "/audio/Benson%20Boone%20-%20In%20the%20Stars%20(Lyrics).mp3" },
    { title: "Bruno Mars — It Will Rain", audioUrl: "/audio/Bruno%20Mars%20-%20It%20Will%20Rain.mp3" },
    { title: "Bruno Mars — Locked Out Of Heaven", audioUrl: "/audio/Bruno%20Mars%20-%20Locked%20Out%20Of%20Heaven.mp3" },
    { title: "Bruno Mars — Talking To The Moon", audioUrl: "/audio/Bruno%20Mars%20-%20Talking%20To%20The%20Moon.mp3" },
    { title: "Camila Cabello — Shameless", audioUrl: "/audio/Camila%20Cabello%20-%20Shameless.mp3" },
    { title: "Mac DeMarco — Chamber Of Reflection", audioUrl: "/audio/Chamber%20Of%20Reflection.mp3" },
    { title: "Coldplay — Hymn For The Weekend", audioUrl: "/audio/Coldplay%20-%20Hymn%20For%20The%20Weekend%20(Lyrics).mp3" },
    { title: "Conan Gray — Memories", audioUrl: "/audio/Conan%20Gray%20-%20Memories.mp3" },
    { title: "Cigarettes After Sex — Cry", audioUrl: "/audio/Cry%20-%20Cigarettes%20After%20Sex.mp3" },
    { title: "d4vd — Romantic Homicide", audioUrl: "/audio/d4vd%20-%20Romantic%20Homicide%20(Official%20Audio).mp3" },
    { title: "David Guetta & Bebe Rexha — I'm Good (Blue)", audioUrl: "/audio/David%20Guetta,%20Bebe%20Rexha%20-%20I'm%20good%20(Blue)%20%20I'm%20good,%20yeah,%20I'm%20feelin'%20alright.mp3" },
    { title: "Dean Lewis — Be Alright", audioUrl: "/audio/Dean%20Lewis%20-%20Be%20Alright%20(Lyrics).mp3" },
    { title: "Demi Lovato — Heart Attack", audioUrl: "/audio/Demi%20Lovato%20-%20Heart%20Attack%20(Lyrics).mp3" },
    { title: "DJ Snake & Justin Bieber — Let Me Love You", audioUrl: "/audio/DJ%20Snake,%20Justin%20Bieber%20%20Let%20Me%20Love%20You%20(Lyrics).mp3" },
    { title: "Djo — End Of Beginning", audioUrl: "/audio/Djo%20-%20End%20Of%20Beginning%20(Lyrics).mp3" },
    { title: "Edward Maya & Vika Jigulina — Stereo Love", audioUrl: "/audio/Edward%20Maya,%20Vika%20Jigulina%20-%20Stereo%20love%20(Radio%20Edit)%20(Lyrics).mp3" },
    { title: "Elektronomia — Sky High", audioUrl: "/audio/Elektronomia%20-%20Sky%20High%20%20Progressive%20House%20%20NCS%20-%20Copyright%20Free%20Music.mp3" },
    { title: "Element — Rahasia Hati", audioUrl: "/audio/Element%20-%20Rahasia%20Hati%20%20Lirik%20Lagu.mp3" },
    { title: "Ellie Goulding — Love Me Like You Do", audioUrl: "/audio/Ellie%20Goulding%20-%20Love%20Me%20Like%20You%20Do.mp3" },
    { title: "Fun. ft. Janelle Monáe — We Are Young", audioUrl: "/audio/Fun.%20-%20We%20Are%20Young%20(Lyrics)%20ft.%20Janelle%20Mon%C3%A1e.mp3" },
    { title: "Gym Class Heroes — Stereo Hearts", audioUrl: "/audio/Gym%20Class%20Heroes%20-%20Stereo%20Hearts%20(Lyrics)%20%20Heart%20Stereo.mp3" },
    { title: "Seventeen — Hal Terindah", audioUrl: "/audio/Hal%20Terindah%20-%20Seventeen%20%20Lirik%20Lagu.mp3" },
    { title: "Halsey — Without Me", audioUrl: "/audio/Halsey%20-%20Without%20Me.mp3" },
    { title: "Harry Styles — As It Was", audioUrl: "/audio/Harry%20Styles%20-%20As%20It%20Was%20(Lyrics).mp3" },
    { title: "Harry Styles — Sign of the Times", audioUrl: "/audio/Harry%20Styles%20-%20Sign%20of%20the%20Times.mp3" },
    { title: "Hoobastank — The Reason", audioUrl: "/audio/Hoobastank%20-%20The%20Reason.mp3" },
    { title: "Imagine Dragons — Bad Liar", audioUrl: "/audio/Imagine%20Dragons%20-%20Bad%20Liar%20(Lyrics).mp3" },
    { title: "Imagine Dragons — Believer", audioUrl: "/audio/Imagine%20Dragons%20-%20Believer%20(Official%20Music%20Video).mp3" },
    { title: "James Arthur — Impossible", audioUrl: "/audio/James%20Arthur%20-%20Impossible.mp3" },
    { title: "Janji — Heroes Tonight", audioUrl: "/audio/Janji%20-%20Heroes%20Tonight%20(feat.%20Johnning)%20%20Progressive%20House%20%20NCS%20-%20Copyright%20Free%20Music.mp3" },
    { title: "John Newman — Love Me Again", audioUrl: "/audio/John%20Newman%20-%20Love%20Me%20Again.mp3" },
    { title: "Joji — Glimpse of Us", audioUrl: "/audio/Joji%20-%20%20Glimpse%20of%20Us.mp3" },
    { title: "Justin Bieber — Despacito", audioUrl: "/audio/Justin%20Bieber%20-%20Despacito%20(Lyrics%20%20Letra)%20ft.%20Luis%20Fonsi%20%26%20Daddy%20Yankee.mp3" },
    { title: "Justin Bieber — Ghost", audioUrl: "/audio/Justin%20Bieber%20-%20Ghost.mp3" },
    { title: "Keane — Somewhere Only We Know", audioUrl: "/audio/Keane%20-%20Somewhere%20Only%20We%20Know%20(Official%20Music%20Video).mp3" },
    { title: "Kerispatih — Mengenangmu", audioUrl: "/audio/Kerispatih%20-%20Mengenangmu%20%20Lirik%20Lagu.mp3" },
    { title: "Kerispatih — Tapi Bukan Aku", audioUrl: "/audio/Kerispatih%20-%20Tapi%20Bukan%20Aku%20(Official%20Music%20Video%20NAGASWARA).mp3" },
    { title: "Kygo & Selena Gomez — It Ain't Me", audioUrl: "/audio/Kygo%20%26%20Selena%20Gomez%20-%20It%20Ain't%20Me%20(Audio).mp3" },
    { title: "Lewis Capaldi — Before You Go", audioUrl: "/audio/Lewis%20Capaldi%20-%20Before%20You%20Go%20(Lyrics).mp3" },
    { title: "Lewis Capaldi — Someone You Loved", audioUrl: "/audio/Lewis%20Capaldi%20-%20Someone%20You%20Loved%20(Lyrics).mp3" },
    { title: "Lord Huron — The Night We Met", audioUrl: "/audio/Lord%20Huron%20-%20The%20Night%20We%20Met.mp3" },
    { title: "Loreen — Tattoo", audioUrl: "/audio/Loreen%20-%20Tattoo.mp3" },
    { title: "Lost Sky — Fearless pt.II", audioUrl: "/audio/Lost%20Sky%20-%20Fearless%20pt.II%20(feat.%20Chris%20Linton)%20%20Trap%20%20NCS%20-%20Copyright%20Free%20Music.mp3" },
    { title: "Lukas Graham — 7 Years", audioUrl: "/audio/Lukas%20Graham%20-%207%20Years.mp3" },
    { title: "Martin Garrix & Bebe Rexha — In The Name Of Love", audioUrl: "/audio/Martin%20Garrix%20%26%20Bebe%20Rexha%20-%20In%20The%20Name%20Of%20Love%20(Official%20Video).mp3" },
    { title: "Mike Posner — I Took A Pill In Ibiza", audioUrl: "/audio/Mike%20Posner%20-%20I%20Took%20A%20Pill%20In%20Ibiza%20(SeeB%20Remix).mp3" },
    { title: "NaFF — Kau Masih Kekasihku", audioUrl: "/audio/NaFF%20-%20Kau%20Masih%20Kekasihku%20(Lirik%20Video).mp3" },
    { title: "NaFF — Kenanglah Aku", audioUrl: "/audio/Naff%20-%20Kenanglah%20Aku%20%20Lirik.mp3" },
    { title: "NaFF — Tak Seindah Cinta Yang Semestinya", audioUrl: "/audio/Naff%20-%20Tak%20seindah%20Cinta%20Yang%20Semestinya%20(Lyrics).mp3" },
    { title: "NaFF — Terendap Laraku", audioUrl: "/audio/Naff%20-%20Terendap%20Laraku%20(Lyrics).mp3" },
    { title: "Olivia Rodrigo — Happier", audioUrl: "/audio/Olivia%20Rodrigo%20-%20Happier.mp3" },
    { title: "One Direction — Night Changes", audioUrl: "/audio/One%20Direction%20-%20Night%20Changes%20(Lyrics)%20(1).mp3" },
    { title: "Peterpan — Ku Katakan Dengan Indah", audioUrl: "/audio/Peterpan%20-%20Ku%20Katakan%20Dengan%20Indah.mp3" },
    { title: "James Arthur ft. Anne-Marie — Rewrite The Stars", audioUrl: "/audio/Rewrite%20The%20Stars%20-%20James%20Arthur%20ft.%20Anne-Marie%20(Lyrics)%20%20Ed%20Sheeran%20Shawn%20MendesThe%20Chainsmokers.mp3" },
    { title: "Gigi Perez — Sailor Song", audioUrl: "/audio/Sailor%20Song.mp3" },
    { title: "Phoebe Bridgers — Scott Street", audioUrl: "/audio/Scott%20Street.mp3" },
    { title: "Selena Gomez — Love You Like a Love Song", audioUrl: "/audio/Selena%20Gomez%20-%20Love%20You%20Like%20a%20Love%20Song%20(Lyrics)%20no%20one%20compares%20you%20stand%20alone.mp3" },
    { title: "Sheila On 7 — Sephia", audioUrl: "/audio/Sephia%20-%20shiela%20on%207%20(%20lyrics%20).mp3" },
    { title: "Shawn Mendes — There's Nothing Holding Me Back", audioUrl: "/audio/Shawn%20Mendes%20%20There's%20Nothing%20Holding%20Me%20Back%20(Lyrics).mp3" },
    { title: "Sheila On 7 — Dan", audioUrl: "/audio/Sheila%20On%207%20%20Dan...%20%20Lirik%20Lagu.mp3" },
    { title: "SLANDER — Love is Gone", audioUrl: "/audio/SLANDER%20-%20Love%20is%20Gone%20(Lyrics)%20ft.%20Dylan%20Matthew%20(Acoustic)%20I'm%20sorry%20don't%20leave%20me.mp3" },
    { title: "Sombr — Back to Friends", audioUrl: "/audio/sombr%20-%20back%20to%20friends%20(official%20audio).mp3" },
    { title: "Beach House — Space Song", audioUrl: "/audio/Space%20Song%20-%20Beach%20House%20(OFFICIAL%20AUDIO).mp3" },
    { title: "One Direction — Story of My Life", audioUrl: "/audio/Story%20of%20my%20Life%20-%20ONE%20DIRECTION%20(Lyrics%20Video).mp3" },
    { title: "Taio Cruz — Dynamite", audioUrl: "/audio/Taio%20Cruz%20-%20Dynamite%20(Lyrics).mp3" },
    { title: "The 1975 — About You", audioUrl: "/audio/The%201975%20-%20About%20You%20(Official).mp3" },
    { title: "The Chainsmokers & Coldplay — Something Just Like This", audioUrl: "/audio/The%20Chainsmokers%20%26%20Coldplay%20-%20Something%20Just%20Like%20This%20(Official%20Lyric%20Video).mp3" },
    { title: "The Chainsmokers — Closer", audioUrl: "/audio/The%20Chainsmokers%20-%20Closer%20(Lyrics)%20ft.%20Halsey%20(1).mp3" },
    { title: "The Chainsmokers — Don't Let Me Down", audioUrl: "/audio/The%20Chainsmokers%20-%20Don't%20Let%20Me%20Down%20(Lyrics)%20ft.%20Daya.mp3" },
    { title: "The Script — Hall Of Fame", audioUrl: "/audio/The%20Script%20-%20Hall%20Of%20Fame%20(Lyrics).mp3" },
    { title: "The Script — Superheroes", audioUrl: "/audio/The%20Script%20-%20Superheroes%20(Lyrics).mp3" },
    { title: "The Script — The Man Who...", audioUrl: "/audio/The%20Script%20-%20The%20Man%20Who....mp3" },
    { title: "The Weeknd & Ariana Grande — Save Your Tears", audioUrl: "/audio/The%20Weeknd%20%26%20Ariana%20Grande%20-%20Save%20Your%20Tears%20(Remix)%20(Lyrics).mp3" },
    { title: "The Weeknd & Ariana Grande — Save Your Tears (Video)", audioUrl: "/audio/The%20Weeknd%20%26%20Ariana%20Grande%20-%20Save%20Your%20Tears%20(Remix)%20(Official%20Video).mp3" },
    { title: "Timbaland — Apologize", audioUrl: "/audio/Timbaland%20feat.%20OneRepublic%20-%20Apologize%20(Lyrics).mp3" },
    { title: "Tove Lo — Habits", audioUrl: "/audio/Tove%20Lo%20-%20Habits%20(Stay%20High)%20(Lyrics).mp3" },
    { title: "Troye Sivan — Angel Baby", audioUrl: "/audio/Troye%20Sivan%20-%20Angel%20Baby%20(Lyrics).mp3" },
    { title: "Twenty One Pilots — Ride", audioUrl: "/audio/twenty%20one%20pilots%20-%20Ride%20(Official%20Video).mp3" },
    { title: "Witt Lowry — Into Your Arms", audioUrl: "/audio/Witt%20Lowry%20-%20Into%20Your%20Arms%20(Lyrics)%20ft.%20Ava%20Max%20-%20[No%20Rap].mp3" }
];

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false); // NEW: Track buffering state
    const [queue, setQueue] = useState(PLAYLIST); // NEW: Dynamic Queue
    const [currentIndex, setCurrentIndex] = useState(0);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    // UI Persisted State
    const [showLyrics, setShowLyrics] = useState(true);
    const [showMarquee, setShowMarquee] = useState(true);
    const [showNarrative, setShowNarrative] = useState(true);

    // Lyric State
    const [currentLyricText, setCurrentLyricText] = useState<string | null>(null);
    const [activeLyrics, setActiveLyrics] = useState<LyricItem[]>([]);

    // Time tracking (lightweight, updates throttled)
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

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
        // DISABLED for Mobile Reliability (Background Play) aka "The Native Way"
        return;
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
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Playback started successfully
                    })
                    .catch(e => {
                        console.error("Playback failed:", e);
                        setIsPlaying(false);
                    });
            }
        }
    }, [isPlaying, initializeAudio]);

    const playQueue = useCallback((newQueue: typeof PLAYLIST, startIndex = 0) => {
        setQueue(newQueue);
        setCurrentIndex(startIndex);
        setIsBuffering(false);
        setHasInteracted(true);
        setIsPlaying(true);
    }, []);

    const nextSong = useCallback((forcePlay = false) => {
        // OPTIMISTIC: Reset buffering immediately so UI shows title
        setIsBuffering(false);
        if (forcePlay) {
            setIsPlaying(true);
        }
        setCurrentIndex((prev) => (prev + 1) % queue.length);
        // Buffering will naturally trigger on source change
    }, [queue.length]);

    const prevSong = useCallback((forcePlay = false) => {
        setIsBuffering(false);
        if (forcePlay) {
            setIsPlaying(true);
        }
        setCurrentIndex((prev) => (prev - 1 + queue.length) % queue.length);
    }, [queue.length]);

    const jumpToSong = useCallback((index: number) => {
        setIsBuffering(false);
        setHasInteracted(true);
        setIsPlaying(true);
        setCurrentIndex(index);
    }, []);

    // Auto-play when index changes if it was already playing or triggered by next
    // Also triggers when queue changes (e.g., switching playlists)
    const queueId = queue[0]?.audioUrl || ""; // Unique identifier for current queue
    useEffect(() => {
        // If we are playing (or forcePlay was set to true which updated isPlaying),
        // we need to ensure the new track plays.
        if (audioRef.current && isPlaying) {
            // Mobile Auto-Play Fix: Small timeout to ensure DOM is ready and state is clean
            const timer = setTimeout(() => {
                const playPromise = audioRef.current?.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.error("Auto-playback failed:", e);
                        // If it failed because of "user interaction", we might need to revert isPlaying
                    });
                }
            }, 50); // 50ms ticks allowing browser event loop to catch up
            return () => clearTimeout(timer);
        }


    }, [currentIndex, isPlaying, queueId]); // Added queueId to detect playlist switches

    const currentSong = queue[currentIndex] || queue[0];

    // Detect Lyrics on Song Change
    useEffect(() => {
        let isMounted = true;
        setActiveLyrics([]);
        setCurrentLyricText(null);
        const fetchLyrics = async () => {
            try {
                const filename = `/lyrics/${encodeURIComponent(currentSong.title)}.json`;
                const res = await fetch(filename);
                if (res.ok) {
                    const data: LyricItem[] = await res.json();
                    if (isMounted) setActiveLyrics(data);
                } else {
                    if (isMounted) setActiveLyrics([]);
                }
            } catch (error) {
                console.error("Failed to fetch lyrics:", error);
            }
        };
        fetchLyrics();
        return () => { isMounted = false; };
    }, [currentSong.title]);

    // Throttle ref for performance (mobile-first)
    const lastTimeUpdateRef = useRef(0);

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const t = audioRef.current.currentTime;

        // Throttled time update for progress bar (every 500ms for performance)
        const now = Date.now();
        if (now - lastTimeUpdateRef.current > 500) {
            setCurrentTime(t);
            lastTimeUpdateRef.current = now;
        }

        // Lyric sync (existing logic)
        if (activeLyrics.length === 0) return;
        let activeLine: LyricItem | null = null;
        let nextLineTime = Infinity;
        for (let i = 0; i < activeLyrics.length; i++) {
            if (activeLyrics[i].time <= t) {
                activeLine = activeLyrics[i];
                if (i + 1 < activeLyrics.length) nextLineTime = activeLyrics[i + 1].time;
            } else { break; }
        }
        if (activeLine && t < nextLineTime) {
            if (currentLyricText !== activeLine.text) setCurrentLyricText(activeLine.text);
        } else {
            if (currentLyricText !== null) setCurrentLyricText(null);
        }
    };

    // Seek to time
    const seekTo = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

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

        navigator.mediaSession.setActionHandler("play", () => togglePlay());
        navigator.mediaSession.setActionHandler("pause", () => togglePlay());
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

    // Mobile/Smart Preloading Logic
    const warmup = useCallback(() => {
        // Just creating the audio object or setting src warms up the connection
        if (audioRef.current && audioRef.current.preload === 'none') {
            audioRef.current.preload = 'metadata'; // Upgrade to metadata on hover/touch
        }
    }, []);

    // Smart Strategy: "The Next Song" Prefetcher
    useEffect(() => {
        if (!isPlaying || isBuffering) return;

        // Wait for network to be "Idle" (simulated by timeout after stable play)
        // If playing smoothly for 10 seconds, assume bandwidth is free to fetch next song.
        const idleFetcher = setTimeout(() => {
            const nextIndex = (currentIndex + 1) % PLAYLIST.length;
            const nextUrl = PLAYLIST[nextIndex].audioUrl;

            // Check if already preloaded to avoid duplicates
            if (!document.querySelector(`link[rel="preload"][href="${nextUrl}"]`)) {
                // Std DOM way to prefetch audio
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'audio';
                link.href = nextUrl;
                // Suppress errors to avoid "Uncaught (in promise) Event" crashes
                link.onerror = () => {
                    console.warn(`[SmartLoader] Preload failed for: ${nextUrl}`);
                    link.remove();
                };
                document.head.appendChild(link);
                console.log(`[SmartLoader] Prefetching next song: ${PLAYLIST[nextIndex].title}`);
            }
        }, 10000); // 10s delay

        return () => clearTimeout(idleFetcher);
    }, [currentIndex, isPlaying, isBuffering]);

    return (
        <AudioContext.Provider value={{
            isPlaying, isBuffering, togglePlay, nextSong, prevSong, jumpToSong, currentSong, analyser, audioRef, hasInteracted, warmup,
            showLyrics, setShowLyrics, showMarquee, setShowMarquee, showNarrative, setShowNarrative,
            currentLyricText,
            activeLyrics,
            playQueue,
            queue,
            currentIndex,
            currentTime,
            duration,
            seekTo
        }}>
            <audio
                ref={audioRef}
                crossOrigin="anonymous"
                src={queue[currentIndex]?.audioUrl}
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => {
                    if (audioRef.current) {
                        setDuration(audioRef.current.duration || 0);
                    }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onWaiting={() => setIsBuffering(true)} // Buffer started
                onPlaying={() => setIsBuffering(false)} // Buffer finished, playing
                onCanPlay={() => setIsBuffering(false)} // Adequate data to start
                onLoadedData={() => setIsBuffering(false)} // First frame loaded
                onEnded={() => nextSong(true)}
                onError={(e) => {
                    console.error("Audio error:", e);
                    setIsPlaying(false);
                    setIsBuffering(false);
                }}
            />
            {children}
        </AudioContext.Provider>
    );
}
