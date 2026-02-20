"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudSun, Sun, CloudRain, Calendar as CalIcon, GitBranch, Quote, Thermometer, Droplets, Wind, Disc, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useAudio } from "@/components/AudioContext";
import { useLyrics } from "@/hooks/useLyrics";

const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function CleanHomeHero() {
    const [now, setNow] = useState(new Date());
    const { isPlaying, togglePlay, currentSong, hasInteracted, currentTime, duration, nextSong, prevSong } = useAudio();
    const songParts = currentSong.title.split("—");
    const artist = songParts[0]?.trim() || "Unknown";
    const song = songParts[1]?.trim() || currentSong.title;
    const { lyrics } = useLyrics(currentSong.title);
    const lyricsContainerRef = useRef<HTMLDivElement>(null);

    // Find current lyric index
    const activeLyricIndex = useMemo(() => {
        if (!lyrics || lyrics.length === 0) return -1;
        let idx = -1;
        for (let i = 0; i < lyrics.length; i++) {
            if (currentTime >= lyrics[i].time) idx = i;
            else break;
        }
        return idx;
    }, [lyrics, currentTime]);

    // Auto-scroll lyrics
    useEffect(() => {
        if (activeLyricIndex >= 0 && lyricsContainerRef.current) {
            const activeEl = lyricsContainerRef.current.children[activeLyricIndex] as HTMLElement;
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [activeLyricIndex]);

    // Widget system: N-widget slider
    const WIDGETS = ['calendar', 'music', 'news', 'crypto', 'movies'] as const;
    const [widgetIndex, setWidgetIndex] = useState(0);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const [swipeDirection, setSwipeDirection] = useState<1 | -1>(1);

    // Swipe handlers for widget toggling
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!touchStartRef.current) return;
        const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
            setSwipeDirection(deltaX < 0 ? 1 : -1);
            setWidgetIndex(prev => deltaX < 0 ? Math.min(prev + 1, WIDGETS.length - 1) : Math.max(prev - 1, 0));
        }
        touchStartRef.current = null;
    }, []);


    // Auto-switch to music when user first interacts
    useEffect(() => {
        if (hasInteracted) { setWidgetIndex(1); setSwipeDirection(1); }
    }, [hasInteracted]);

    const showNowPlaying = WIDGETS[widgetIndex] === 'music' && hasInteracted;

    // API data states
    const [weather, setWeather] = useState<{ temp: number; label: string; icon: string; humidity: number; wind: number } | null>(null);
    const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
    const [github, setGithub] = useState<{ repos: number; streak: number; todayActive: boolean; pushDates: string[] } | null>(null);
    const [holidays, setHolidays] = useState<{ date: string; name: string; localName: string }[]>([]);
    const [tooltipInfo, setTooltipInfo] = useState<{ day: number; text: string } | null>(null);
    const [greeting, setGreeting] = useState<string>('');
    const [prayer, setPrayer] = useState<{ prayers: { name: string; time: string }[]; next: { name: string; time: string } | null; hijriDate: string | null } | null>(null);
    const [football, setFootball] = useState<{ matches: { home: string; homeAbbr: string; away: string; awayAbbr: string; date: string; time: string; league: string; leagueEmoji: string; status: string; state: string; homeScore?: string; awayScore?: string; isBigMatch: boolean }[] } | null>(null);
    const [showMatchesPopup, setShowMatchesPopup] = useState(false);
    const [matchPage, setMatchPage] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [news, setNews] = useState<{ articles: any[] } | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [movies, setMovies] = useState<{ movies: any[] } | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cryptoData, setCryptoData] = useState<{ prices: any[] } | null>(null);

    // Typewriter greeting
    const [displayedGreeting, setDisplayedGreeting] = useState('');
    const [greetingDone, setGreetingDone] = useState(false);
    useEffect(() => {
        if (!greeting) { setDisplayedGreeting(''); setGreetingDone(false); return; }
        let idx = 0;
        setDisplayedGreeting('');
        setGreetingDone(false);
        const id = setInterval(() => {
            idx++;
            if (idx >= greeting.length) { setDisplayedGreeting(greeting); setGreetingDone(true); clearInterval(id); return; }
            setDisplayedGreeting(greeting.slice(0, idx));
        }, 30);
        return () => clearInterval(id);
    }, [greeting]);

    // Update clock every second for live time display
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    // Fetch API data
    useEffect(() => {
        fetch('/api/weather').then(r => r.json()).then(setWeather).catch(() => { });
        fetch('/api/quote').then(r => r.json()).then(setQuote).catch(() => { });
        fetch('/api/github').then(r => r.json()).then(setGithub).catch(() => { });
        fetch(`/api/holidays?year=${new Date().getFullYear()}`).then(r => r.json()).then(d => setHolidays(d.holidays || [])).catch(() => { });
        fetch('/api/prayer').then(r => r.json()).then(setPrayer).catch(() => { });
        fetch('/api/football').then(r => r.json()).then(setFootball).catch(() => { });
        fetch('/api/news').then(r => r.json()).then(setNews).catch(() => { });
        fetch('/api/crypto').then(r => r.json()).then(d => setCryptoData(d)).catch(() => { });
        fetch('/api/movies').then(r => r.json()).then(setMovies).catch(() => { });
    }, []);

    // Fetch AI greeting after weather loads (to pass weather context)
    useEffect(() => {
        if (!weather) return;
        const h = new Date().getHours();
        const dayN = DAYS_FULL[new Date().getDay()];
        fetch(`/api/greeting?weather=${encodeURIComponent(weather.label)}&temp=${weather.temp}&day=${dayN}&hour=${h}`)
            .then(r => r.json())
            .then(d => setGreeting(d.greeting || ''))
            .catch(() => { });
    }, [weather]);

    // Build event lookup maps for current month
    const currentMonth = now.getMonth(); // 0-indexed
    const currentYear = now.getFullYear();

    const holidayMap = useMemo(() => {
        const map = new Map<number, string>();
        for (const h of holidays) {
            const [y, m, d] = h.date.split('-').map(Number);
            if (y === currentYear && m === currentMonth + 1) {
                map.set(d, h.localName || h.name);
            }
        }
        return map;
    }, [holidays, currentMonth, currentYear]);

    const githubPushDays = useMemo(() => {
        if (!github?.pushDates) return new Set<number>();
        const set = new Set<number>();
        for (const date of github.pushDates) {
            const [y, m, d] = date.split('-').map(Number);
            if (y === currentYear && m === currentMonth + 1) {
                set.add(d);
            }
        }
        return set;
    }, [github, currentMonth, currentYear]);

    // Dynamic next prayer — recomputed client-side every tick + countdown
    const dynamicNextPrayer = useMemo(() => {
        if (!prayer?.prayers || prayer.prayers.length === 0) return prayer?.next || null;
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        for (const p of prayer.prayers) {
            const [h, m] = p.time.split(':').map(Number);
            if (h * 60 + m > nowMinutes) return p;
        }
        // All prayers passed → show tomorrow's Subuh
        return prayer.prayers[0] || null;
    }, [prayer, now]);

    // Prayer countdown string
    const prayerCountdown = useMemo(() => {
        if (!dynamicNextPrayer) return '';
        const [h, m] = dynamicNextPrayer.time.split(':').map(Number);
        let diffMin = (h * 60 + m) - (now.getHours() * 60 + now.getMinutes());
        if (diffMin < 0) diffMin += 24 * 60; // wraps to next day
        const hours = Math.floor(diffMin / 60);
        const mins = diffMin % 60;
        if (hours > 0) return `in ${hours}h ${mins}m`;
        return `in ${mins}m`;
    }, [dynamicNextPrayer, now]);

    // Rolling football match page — cycle every 10s
    const bigMatches = useMemo(() => {
        if (!football) return [];
        return football.matches.filter(m => m.isBigMatch);
    }, [football]);

    useEffect(() => {
        if (bigMatches.length <= 3) return;
        const id = setInterval(() => {
            setMatchPage(prev => {
                const totalPages = Math.ceil(bigMatches.length / 3);
                return (prev + 1) % totalPages;
            });
        }, 10000);
        return () => clearInterval(id);
    }, [bigMatches.length]);

    const visibleMatches = useMemo(() => {
        if (bigMatches.length === 0) return [];
        const start = (matchPage * 3) % bigMatches.length;
        return bigMatches.slice(start, start + 3);
    }, [bigMatches, matchPage]);

    const dayName = DAYS_FULL[now.getDay()];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = `${now.getDate()} ${MONTHS_SHORT[now.getMonth()]}`;

    // Calendar Generation
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const calendarGrid: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarGrid.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarGrid.push(i);

    // Row count for aspect ratio tuning
    const totalCells = calendarGrid.length;
    const rowCount = Math.ceil(totalCells / 7);

    // Wallpaper scheduling — time-of-day based
    const wallpaper = useMemo(() => {
        const hour = now.getHours();
        if (hour >= 6 && hour < 14) return '/wallpapers/morning.jpg';       // Morning: forest cycling
        if (hour >= 14 && hour < 18) return '/wallpapers/afternoon.webp';   // Afternoon: lone tree field
        return '/wallpapers/evening.jpg';                                    // Evening/Night: coastal sunset
    }, [now]);

    return (
        <section style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "0 1.5rem",
            paddingTop: "1rem",
            paddingBottom: "1.5rem",
            width: "100%",
            maxWidth: "460px",
            margin: "0 auto",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
            color: "#fff",
        }}>
            {/* Wallpaper Background — covers full viewport */}
            <div style={{
                position: "fixed",
                inset: 0,
                backgroundImage: `url(${wallpaper})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "background-image 1s ease-in-out",
                zIndex: -2,
            }} />
            {/* Dark overlay for readability */}
            <div style={{
                position: "fixed",
                inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.55) 100%)",
                zIndex: -1,
            }} />

            {/* Ambient Bokeh Particles */}
            {useMemo(() => {
                const particles = Array.from({ length: 10 }, (_, i) => ({
                    id: i,
                    w: 6 + (((i * 7 + 3) % 11) / 11) * 16,
                    left: ((i * 17 + 5) % 100),
                    top: ((i * 23 + 11) % 100),
                    opacity: 0.08 + (((i * 13 + 2) % 7) / 7) * 0.12,
                    yDrift: -30 - (((i * 11 + 4) % 8) / 8) * 40,
                    xDrift: (((i * 19 + 1) % 10) / 10 - 0.5) * 30,
                    dur: 15 + (((i * 9 + 6) % 9) / 9) * 20,
                    delay: ((i * 14 + 3) % 10),
                }));
                return particles.map(p => (
                    <motion.div
                        key={`bokeh-${p.id}`}
                        style={{
                            position: 'fixed',
                            width: `${p.w}px`,
                            height: `${p.w}px`,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, rgba(255,255,255,${p.opacity}) 0%, transparent 70%)`,
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            zIndex: -1,
                            pointerEvents: 'none',
                        }}
                        animate={{
                            y: [0, p.yDrift, 0],
                            x: [0, p.xDrift, 0],
                            opacity: [0.15, 0.3, 0.15],
                        }}
                        transition={{
                            duration: p.dur,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: p.delay,
                        }}
                    />
                ));
            }, [])}
            {/* Content */}
            {/* ── Header Area ── */}
            <div style={{ marginBottom: "1rem" }}>
                {/* Top: Date left, Weather right */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.1rem",
                }}>
                    <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
                        {dateStr} · {timeStr}
                    </span>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.95)",
                        textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                    }}>
                        {weather ? (
                            <>
                                <span style={{ fontSize: "1rem" }}>{weather.icon}</span>
                                <span>{weather.temp}°C</span>
                            </>
                        ) : (
                            <>
                                <CloudSun size={18} strokeWidth={2.5} />
                                <span>···</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Big Day Name */}
                <div style={{
                    fontSize: "clamp(2.2rem, 9vw, 3rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color: "#fff",
                    marginBottom: "0.35rem",
                    textShadow: "0 2px 16px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)",
                }}>
                    {dayName}
                </div>

                {/* Double Separator (Solid + Striped) — pixel match */}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div style={{ height: "2px", background: "rgba(255,255,255,0.6)", opacity: 0.7 }} />
                    <div style={{
                        height: "6px",
                        background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 2px, transparent 2px, transparent 5px)",
                        opacity: 0.35
                    }} />
                </div>

                {/* Weather label + Next prayer */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0.25rem",
                }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                        {weather ? `${weather.label} · Jaksel` : '···'}
                    </span>
                    {dynamicNextPrayer && (
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                            🕌 {dynamicNextPrayer.name} <span style={{ fontWeight: 500, fontSize: "0.68rem", opacity: 0.8 }}>{prayerCountdown}</span>
                        </span>
                    )}
                </div>

                {/* AI Generated Greeting — Typewriter */}
                {greeting && (
                    <div
                        style={{
                            fontSize: "0.78rem",
                            fontStyle: "italic",
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.7)",
                            marginTop: "0.35rem",
                            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                            lineHeight: 1.4,
                        }}
                    >
                        "{displayedGreeting}"
                        {!greetingDone && (
                            <span style={{
                                display: 'inline-block',
                                width: '2px',
                                height: '0.85em',
                                background: 'rgba(255,255,255,0.7)',
                                marginLeft: '2px',
                                verticalAlign: 'text-bottom',
                                animation: 'blink-cursor 0.8s steps(2) infinite',
                            }} />
                        )}
                        <style>{`@keyframes blink-cursor { 0%,100%{opacity:1} 50%{opacity:0} } @keyframes today-pulse { 0%,100%{box-shadow:0 0 6px rgba(255,59,48,0.4)} 50%{box-shadow:0 0 14px rgba(255,59,48,0.7)} }`}</style>
                    </div>
                )}
            </div>

            {/* ── Main Widget Area — Premium Frosted Glass ── */}
            <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)",
                    backdropFilter: "blur(40px) saturate(160%) brightness(105%)",
                    WebkitBackdropFilter: "blur(40px) saturate(160%) brightness(105%)",
                    borderRadius: "24px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    boxShadow: `
                    0 2px 0 rgba(255,255,255,0.15) inset,
                    0 -1px 0 rgba(0,0,0,0.04) inset,
                    0 20px 60px -10px rgba(0,0,0,0.15),
                    0 4px 20px rgba(0,0,0,0.06)
                `,
                    padding: "1.1rem",
                    position: "relative",
                    overflow: "hidden",
                    touchAction: "pan-y",
                }}>
                {/* Layer 1: Gradient border — soft edge that catches light */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "32px",
                    padding: "1px",
                    background: "linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 40%, transparent 60%, rgba(255,255,255,0.04) 100%)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor" as any,
                    maskComposite: "exclude" as any,
                    pointerEvents: "none",
                    zIndex: 3,
                }} />

                {/* Layer 2: Specular highlight — bright focused shine at top */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: "10%",
                    right: "10%",
                    height: "1px",
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.5) 70%, transparent 100%)",
                    pointerEvents: "none",
                    zIndex: 4,
                    filter: "blur(0.5px)",
                }} />

                {/* Layer 3: Glossy sheen — smooth light sweep across surface */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "55%",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)",
                    borderRadius: "32px 32px 0 0",
                    pointerEvents: "none",
                    zIndex: 2,
                }} />

                <AnimatePresence mode="wait" initial={false}>
                    {showNowPlaying ? (
                        <motion.div
                            key="now-playing"
                            initial={{ opacity: 0, x: swipeDirection * 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: swipeDirection * -60 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ position: "relative", zIndex: 1 }}
                        >
                            {/* Now Playing Header */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                {/* Rotating Disc */}
                                <div style={{
                                    width: "48px", height: "48px", borderRadius: "50%",
                                    background: "linear-gradient(135deg, #FFD60A 0%, #FF9F0A 100%)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                    boxShadow: isPlaying ? "0 0 20px rgba(255,214,10,0.35)" : "none",
                                }}>
                                    <motion.div
                                        animate={{ rotate: isPlaying ? 360 : 0 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                        <Disc size={22} color="rgba(0,0,0,0.6)" />
                                    </motion.div>
                                </div>

                                {/* Song Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: "0.9rem", fontWeight: 700,
                                        color: "rgba(255,255,255,0.95)",
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                        marginBottom: "2px",
                                    }}>{song}</div>
                                    <div style={{
                                        fontSize: "0.75rem", fontWeight: 500,
                                        color: "rgba(255,255,255,0.55)",
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                        display: "flex", alignItems: "center", gap: "6px",
                                    }}>
                                        {artist}
                                        {isPlaying && (
                                            <span style={{ display: "flex", alignItems: "flex-end", gap: "1.5px", height: "12px" }}>
                                                {[0, 1, 2].map(b => (
                                                    <motion.span
                                                        key={b}
                                                        style={{ width: "2px", borderRadius: "1px", background: "#FFD60A" }}
                                                        animate={{ height: ["3px", `${8 + b * 3}px`, "4px", `${10 - b * 2}px`, "3px"] }}
                                                        transition={{ duration: 0.8 + b * 0.15, repeat: Infinity, ease: "easeInOut", delay: b * 0.12 }}
                                                    />
                                                ))}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Controls */}
                                <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
                                    <div onClick={prevSong} style={{ padding: "6px", cursor: "pointer", display: "flex" }}>
                                        <SkipBack size={15} fill="rgba(255,255,255,0.95)" color="rgba(255,255,255,0.95)" />
                                    </div>
                                    <div onClick={togglePlay} style={{
                                        width: "34px", height: "34px", borderRadius: "50%",
                                        background: "rgba(0,0,0,0.08)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer",
                                    }}>
                                        {isPlaying
                                            ? <Pause size={15} fill="rgba(255,255,255,0.95)" color="rgba(255,255,255,0.95)" />
                                            : <Play size={15} fill="rgba(255,255,255,0.95)" color="rgba(255,255,255,0.95)" style={{ marginLeft: "2px" }} />
                                        }
                                    </div>
                                    <div onClick={() => nextSong()} style={{ padding: "6px", cursor: "pointer", display: "flex" }}>
                                        <SkipForward size={15} fill="rgba(255,255,255,0.95)" color="rgba(255,255,255,0.95)" />
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div style={{
                                width: "100%", height: "3px", borderRadius: "2px",
                                background: "rgba(0,0,0,0.08)", marginBottom: "0.65rem",
                                overflow: "hidden",
                            }}>
                                <div style={{
                                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
                                    height: "100%", borderRadius: "2px",
                                    background: "linear-gradient(90deg, #FFD60A, #FF9F0A)",
                                    transition: "width 0.3s linear",
                                }} />
                            </div>

                            {/* Lyrics Area */}
                            <div
                                ref={lyricsContainerRef}
                                style={{
                                    maxHeight: "120px",
                                    overflowY: "auto",
                                    scrollbarWidth: "none",
                                    WebkitMaskImage: "linear-gradient(transparent 0%, black 15%, black 85%, transparent 100%)",
                                    maskImage: "linear-gradient(transparent 0%, black 15%, black 85%, transparent 100%)",
                                }}
                            >
                                {lyrics && lyrics.length > 0 ? (
                                    lyrics.map((line, i) => (
                                        <div key={i} style={{
                                            padding: "3px 0",
                                            fontSize: i === activeLyricIndex ? "0.82rem" : "0.72rem",
                                            fontWeight: i === activeLyricIndex ? 700 : 400,
                                            color: i === activeLyricIndex
                                                ? "rgba(255,255,255,0.95)"
                                                : "rgba(255,255,255,0.55)",
                                            opacity: i === activeLyricIndex ? 1 : 0.5,
                                            transition: "all 0.3s ease",
                                            textAlign: "center",
                                            lineHeight: 1.5,
                                        }}>
                                            {line.text || "♪"}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{
                                        textAlign: "center", padding: "1.5rem 0",
                                        fontSize: "0.78rem", color: "rgba(255,255,255,0.55)",
                                        fontStyle: "italic",
                                    }}>♪ No lyrics available ♪</div>
                                )}
                            </div>
                        </motion.div>
                    ) : WIDGETS[widgetIndex] === 'news' ? (
                        <motion.div
                            key="news"
                            initial={{ opacity: 0, x: swipeDirection * 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: swipeDirection * -60 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ position: "relative", zIndex: 1 }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem", textTransform: "uppercase" as const, letterSpacing: "0.03em" }}>
                                📰 Headlines
                            </div>
                            {news && news.articles.length > 0 ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {news.articles.slice(0, 4).map((a: { url: string; title: string; source: string; timeAgo: string }, i: number) => (
                                        <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "1px", padding: "5px 6px", borderRadius: "8px", background: "rgba(255,255,255,0.06)" }}>
                                            <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                                                {a.title}
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.52rem", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                                                <span>{a.source}</span>
                                                <span>{a.timeAgo}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "1.5rem 0" }}>Loading news···</div>
                            )}
                        </motion.div>
                    ) : WIDGETS[widgetIndex] === 'crypto' ? (
                        <motion.div
                            key="crypto"
                            initial={{ opacity: 0, x: swipeDirection * 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: swipeDirection * -60 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ position: "relative", zIndex: 1 }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem", textTransform: "uppercase" as const, letterSpacing: "0.03em" }}>
                                💱 Crypto
                            </div>
                            {cryptoData && cryptoData.prices.length > 0 ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {cryptoData.prices.map((c: { id: string; symbol: string; name: string; emoji: string; usd: number; change24h: number }) => (
                                        <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", borderRadius: "10px", background: "rgba(255,255,255,0.06)" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <span style={{ fontSize: "1.1rem" }}>{c.emoji}</span>
                                                <div>
                                                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.95)" }}>{c.symbol}</div>
                                                    <div style={{ fontSize: "0.52rem", color: "rgba(255,255,255,0.45)" }}>{c.name}</div>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "right" as const }}>
                                                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", fontVariantNumeric: "tabular-nums" }}>
                                                    ${c.usd >= 1000 ? c.usd.toLocaleString('en-US', { maximumFractionDigits: 0 }) : c.usd.toFixed(2)}
                                                </div>
                                                <div style={{ fontSize: "0.55rem", fontWeight: 600, color: c.change24h >= 0 ? "#4ade80" : "#f87171" }}>
                                                    {c.change24h >= 0 ? "▲" : "▼"} {Math.abs(c.change24h).toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "1.5rem 0" }}>Loading crypto···</div>
                            )}
                        </motion.div>
                    ) : WIDGETS[widgetIndex] === 'movies' ? (
                        <motion.div
                            key="movies"
                            initial={{ opacity: 0, x: swipeDirection * 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: swipeDirection * -60 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ position: "relative", zIndex: 1 }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem", textTransform: "uppercase" as const, letterSpacing: "0.03em" }}>
                                🎬 Trending
                            </div>
                            {movies && movies.movies.length > 0 ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                    {movies.movies.slice(0, 4).map((m: { id: number; title: string; poster: string | null; rating: number; year: string }) => (
                                        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 6px", borderRadius: "8px", background: "rgba(255,255,255,0.06)" }}>
                                            {m.poster ? (
                                                <img src={m.poster} alt={m.title} style={{ width: "28px", height: "40px", borderRadius: "4px", objectFit: "cover" as const, flexShrink: 0 }} />
                                            ) : (
                                                <div style={{ width: "28px", height: "40px", borderRadius: "4px", background: "rgba(255,255,255,0.1)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>🎬</div>
                                            )}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {m.title}
                                                </div>
                                                <div style={{ fontSize: "0.52rem", color: "rgba(255,255,255,0.5)" }}>
                                                    ⭐ {m.rating} · {m.year}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "1.5rem 0" }}>No movies data</div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="calendar-stats"
                            initial={{ opacity: 0, x: swipeDirection * -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: swipeDirection * 60 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "auto 1fr",
                                gap: "1rem",
                                alignItems: "start",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            {/* ── Calendar Card (inset within glass) ── */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                background: "rgba(0, 0, 0, 0.12)",
                                borderRadius: "18px",
                                padding: "0.9rem 0.85rem",
                                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                width: "170px",
                            }}>
                                {/* Month header */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                    fontSize: "0.82rem",
                                    fontWeight: 600,
                                    color: "rgba(255,255,255,0.85)",
                                    marginBottom: "0.5rem",
                                }}>
                                    <CalIcon size={13} strokeWidth={2} />
                                    {MONTHS_FULL[now.getMonth()]}
                                </div>

                                {/* Weekday Headers */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(7, 1fr)",
                                    textAlign: "center",
                                    fontSize: "0.55rem",
                                    fontWeight: 600,
                                    color: "rgba(255,255,255,0.4)",
                                    marginBottom: "3px",
                                    letterSpacing: "0.02em",
                                }}>
                                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                        <div key={i}>{d}</div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(7, 1fr)",
                                    gap: "1px",
                                    fontSize: "0.68rem",
                                    fontWeight: 500,
                                    color: "rgba(255,255,255,0.8)",
                                    textAlign: "center",
                                }}>
                                    {calendarGrid.map((d, i) => {
                                        const isToday = d === now.getDate();
                                        const isHoliday = d ? holidayMap.has(d) : false;
                                        const isGithubDay = d ? githubPushDays.has(d) : false;
                                        const hasDots = isHoliday || isGithubDay;
                                        const holidayName = d ? holidayMap.get(d) : undefined;

                                        // Build tooltip text
                                        const tooltipParts: string[] = [];
                                        if (holidayName) tooltipParts.push(`🔴 ${holidayName}`);
                                        if (isGithubDay) tooltipParts.push('🟢 GitHub push');
                                        const tooltipText = tooltipParts.join(' · ');

                                        return (
                                            <div
                                                key={i}
                                                onClick={() => d && hasDots ? setTooltipInfo(tooltipInfo?.day === d ? null : { day: d, text: tooltipText }) : setTooltipInfo(null)}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    padding: "2px 0",
                                                    borderRadius: "6px",
                                                    color: isToday ? "white" : isHoliday ? "#ff6b6b" : (d ? "rgba(255,255,255,0.85)" : "transparent"),
                                                    backgroundColor: isToday ? "var(--accent-red)" : "transparent",
                                                    boxShadow: isToday ? "0 0 8px rgba(255,59,48,0.5)" : "none",
                                                    animation: isToday ? "today-pulse 2.5s ease-in-out infinite" : "none",
                                                    fontWeight: isToday ? 700 : isHoliday ? 600 : 400,
                                                    fontSize: "0.65rem",
                                                    cursor: hasDots ? "pointer" : "default",
                                                    lineHeight: 1.2,
                                                }}>
                                                <span>{d}</span>
                                                {d && hasDots && (
                                                    <div style={{
                                                        display: "flex",
                                                        gap: "1.5px",
                                                        marginTop: "1px",
                                                    }}>
                                                        {isHoliday && <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#ff6b6b" }} />}
                                                        {isGithubDay && <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#4ade80" }} />}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Tooltip overlay */}
                                {tooltipInfo && (
                                    <div style={{
                                        marginTop: "0.3rem",
                                        padding: "4px 8px",
                                        background: "rgba(0,0,0,0.6)",
                                        borderRadius: "8px",
                                        fontSize: "0.6rem",
                                        color: "white",
                                        textAlign: "center",
                                        fontWeight: 500,
                                        backdropFilter: "blur(10px)",
                                    }}>
                                        {tooltipInfo.text}
                                    </div>
                                )}

                                {/* Upcoming Matches */}
                                {football && football.matches.length > 0 && (
                                    <div style={{ marginTop: "0.4rem" }}>
                                        <div
                                            onClick={() => setShowMatchesPopup(true)}
                                            style={{
                                                fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" as const,
                                                letterSpacing: "0.04em", color: "rgba(255,255,255,0.5)",
                                                marginBottom: "0.25rem",
                                                display: "flex", alignItems: "center", gap: "0.3rem",
                                                cursor: "pointer",
                                                justifyContent: "space-between",
                                            }}>
                                            <span>⚽ Upcoming</span>
                                            <span style={{ fontSize: "0.5rem", opacity: 0.6 }}>See all →</span>
                                        </div>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={matchPage}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{ duration: 0.35 }}
                                                style={{ display: "flex", flexDirection: "column", gap: "3px" }}
                                            >
                                                {visibleMatches.map((m, i) => (
                                                    <div key={`${matchPage}-${i}`} style={{
                                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                                        fontSize: "0.58rem",
                                                        padding: "3px 5px",
                                                        borderRadius: "6px",
                                                        background: "rgba(255,255,255,0.06)",
                                                    }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                                                            <span style={{ fontSize: "0.52rem" }}>{m.leagueEmoji}</span>
                                                            <span>{m.homeAbbr}</span>
                                                            <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: "0.5rem" }}>vs</span>
                                                            <span>{m.awayAbbr}</span>
                                                        </div>
                                                        <div style={{
                                                            color: "rgba(255,255,255,0.5)",
                                                            fontSize: "0.52rem",
                                                            fontWeight: 500,
                                                            textAlign: "right",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "flex-end",
                                                            lineHeight: 1.1,
                                                            minWidth: "40px",
                                                        }}>
                                                            {m.state === "in" ? (
                                                                <span style={{ color: "#4ade80", fontWeight: 700 }}>LIVE<br />{m.homeScore}-{m.awayScore}</span>
                                                            ) : m.state === "post" ? (
                                                                <span>{m.homeScore}-{m.awayScore}<br /><span style={{ fontSize: "0.45rem", opacity: 0.8 }}>FT</span></span>
                                                            ) : (
                                                                <>
                                                                    <span style={{ whiteSpace: "nowrap" }}>{m.date}</span>
                                                                    <span style={{ whiteSpace: "nowrap" }}>{m.time}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            {/* ── Live Stats (Right — API-powered) ── */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.6rem",
                                paddingTop: "0.15rem",
                                minWidth: 0,
                            }}>
                                {/* Weather details */}
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <Droplets size={15} strokeWidth={2.5} color="rgba(255,255,255,0.95)" style={{ opacity: 0.7, flexShrink: 0 }} />
                                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap" }}>
                                        {weather ? `${weather.humidity}%` : '··'}
                                    </span>
                                    <Wind size={15} strokeWidth={2.5} color="rgba(255,255,255,0.95)" style={{ opacity: 0.7, flexShrink: 0, marginLeft: "0.3rem" }} />
                                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap" }}>
                                        {weather ? `${weather.wind} km/h` : '··'}
                                    </span>
                                </div>

                                {/* GitHub Streak */}
                                <div style={{
                                    background: "rgba(0,0,0,0.08)",
                                    borderRadius: "12px",
                                    padding: "0.55rem 0.7rem",
                                }}>
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: "0.35rem",
                                        fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" as const,
                                        letterSpacing: "0.03em", color: "rgba(255,255,255,0.95)",
                                        marginBottom: "0.3rem",
                                    }}>
                                        <GitBranch size={13} strokeWidth={2.5} />
                                        GitHub
                                    </div>
                                    {github ? (
                                        <>
                                            <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                                                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "rgba(255,255,255,0.95)", lineHeight: 1 }}>
                                                    {github.streak}
                                                </span>
                                                <span style={{ fontSize: "0.68rem", fontWeight: 500, color: "rgba(255,255,255,0.55)" }}>
                                                    day streak 🔥
                                                </span>
                                            </div>
                                            <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.55)", marginTop: "0.15rem" }}>
                                                {github.repos} repos · {github.todayActive ? '✅ active today' : '⏳ no push today'}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)" }}>Loading···</div>
                                    )}
                                </div>

                                {/* Daily Quote */}
                                <div style={{ marginTop: "0.1rem" }}>
                                    <div style={{
                                        fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" as const,
                                        letterSpacing: "0.03em", color: "rgba(255,255,255,0.95)",
                                        marginBottom: "0.2rem",
                                        display: "flex", alignItems: "center", gap: "0.3rem",
                                    }}>
                                        <Quote size={12} strokeWidth={2.5} />
                                        Today
                                    </div>
                                    {quote ? (
                                        <>
                                            <div style={{
                                                fontSize: "0.72rem", fontWeight: 500, fontStyle: "italic",
                                                color: "rgba(255,255,255,0.75)", lineHeight: 1.4,
                                            }}>
                                                &quot;{quote.text}&quot;
                                            </div>
                                            <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.55)", marginTop: "0.15rem" }}>
                                                — {quote.author}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ fontSize: "0.72rem", fontStyle: "italic", color: "rgba(255,255,255,0.55)" }}>Loading···</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Widget Toggle — iOS page dots */}
                {hasInteracted && (
                    <>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "6px",
                            marginTop: "0.6rem",
                            position: "relative",
                            zIndex: 5,
                        }}>
                            {WIDGETS.map((w, i) => (
                                <div
                                    key={w}
                                    onClick={() => { setSwipeDirection(i > widgetIndex ? 1 : -1); setWidgetIndex(i); }}
                                    style={{
                                        width: widgetIndex === i ? "20px" : "7px",
                                        height: "7px",
                                        borderRadius: "4px",
                                        background: widgetIndex === i
                                            ? "rgba(255,255,255,0.95)"
                                            : "rgba(0,0,0,0.15)",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Swipe hint — subtle animated indicator */}
                        {widgetIndex === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.6, 0.6, 0] }}
                                transition={{ duration: 3, times: [0, 0.15, 0.7, 1], delay: 0.5 }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    marginTop: "0.4rem",
                                    fontSize: "0.58rem",
                                    fontWeight: 500,
                                    color: "rgba(255,255,255,0.55)",
                                    letterSpacing: "0.05em",
                                    pointerEvents: "none",
                                }}
                            >
                                <motion.span
                                    animate={{ x: [0, -3, 0] }}
                                    transition={{ duration: 1.2, repeat: 2, ease: "easeInOut" }}
                                >‹</motion.span>
                                <span>swipe</span>
                                <motion.span
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{ duration: 1.2, repeat: 2, ease: "easeInOut" }}
                                >›</motion.span>
                            </motion.div>
                        )}
                    </>
                )}
            </div>


            {/* ── Football Matches Popup ── */}
            <AnimatePresence>
                {showMatchesPopup && football && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowMatchesPopup(false)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 9999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(0,0,0,0.35)",
                            backdropFilter: "blur(6px)",
                            padding: "1rem",
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            data-scrollable="true"
                            style={{
                                background: "linear-gradient(135deg, rgba(30,35,50,0.92) 0%, rgba(20,25,40,0.95) 100%)",
                                backdropFilter: "blur(40px)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: "24px",
                                padding: "1.2rem 1.4rem",
                                maxWidth: "380px",
                                width: "100%",
                                maxHeight: "70vh",
                                overflowY: "auto",
                                WebkitOverflowScrolling: "touch" as React.CSSProperties['WebkitOverflowScrolling'],
                                color: "rgba(255,255,255,0.95)",
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                <div style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                                    ⚽ Upcoming Matches
                                </div>
                                <div
                                    onClick={() => setShowMatchesPopup(false)}
                                    style={{
                                        width: "28px", height: "28px", borderRadius: "50%",
                                        background: "rgba(255,255,255,0.1)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer", fontSize: "0.8rem", color: "rgba(255,255,255,0.55)",
                                    }}
                                >
                                    ✕
                                </div>
                            </div>

                            {/* Match List */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {football.matches
                                    .filter(m => m.isBigMatch)
                                    .map((m, i) => (
                                        <div key={i} style={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            padding: "8px 10px",
                                            borderRadius: "12px",
                                            background: "rgba(255,255,255,0.08)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                        }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700 }}>
                                                    <span>{m.leagueEmoji}</span>
                                                    <span>{m.home}</span>
                                                    <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 400, fontSize: "0.7rem" }}>vs</span>
                                                    <span>{m.away}</span>
                                                </div>
                                                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                                                    {m.league}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                {m.state === "in" ? (
                                                    <div style={{ color: "#4ade80", fontWeight: 800, fontSize: "0.85rem" }}>
                                                        LIVE<br />{m.homeScore} - {m.awayScore}
                                                    </div>
                                                ) : m.state === "post" ? (
                                                    <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>
                                                        {m.homeScore} - {m.awayScore}
                                                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.55)" }}>FT</div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>{m.time}</div>
                                                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.55)" }}>{m.date}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                {football.matches.filter(m => m.isBigMatch).length === 0 && (
                                    <div style={{ textAlign: "center", padding: "1rem", color: "rgba(255,255,255,0.55)", fontSize: "0.8rem" }}>
                                        No big team matches today
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section >
    );
}
