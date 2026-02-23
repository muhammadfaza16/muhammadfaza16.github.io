"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudSun, Sun, CloudRain, Calendar as CalIcon, GitBranch, Quote, Thermometer, Droplets, Wind, Disc, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import Link from "next/link";
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
    const WIDGETS = ['calendar', 'music', 'news', 'crypto', 'pulse'] as const;
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
            setWidgetIndex(prev => deltaX < 0 ? (prev + 1) % WIDGETS.length : (prev - 1 + WIDGETS.length) % WIDGETS.length);
        }
        touchStartRef.current = null;
    }, []);


    // Auto-switch to music when user first interacts
    useEffect(() => {
        if (hasInteracted) { setWidgetIndex(1); setSwipeDirection(1); }
    }, [hasInteracted]);

    // Deprecated: const showNowPlaying = WIDGETS[widgetIndex] === 'music' && hasInteracted;

    // API data states
    const [weather, setWeather] = useState<{ temp: number; feelsLike: number; precip: number; uv: number; label: string; icon: string; humidity: number; wind: number; location?: string } | null>(null);
    const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
    const [github, setGithub] = useState<{ repos: number; currentMonthActiveDays: number; currentMonthTotalDays: number; currentMonthPushCount: number; todayActive: boolean; pushDates: string[]; recentRepo: string | null; } | null>(null);
    const [holidays, setHolidays] = useState<{ date: string; name: string; localName: string }[]>([]);
    const [tooltipInfo, setTooltipInfo] = useState<{ day: number; text: string } | null>(null);
    const [greeting, setGreeting] = useState<string>('');
    const [prayer, setPrayer] = useState<{ prayers: { name: string; time: string }[]; next: { name: string; time: string } | null; hijriDate: string | null; imsak: string | null; midnight: string | null; tahajjud: string | null; firstThird: string | null; } | null>(null);
    const [football, setFootball] = useState<{ matches: { home: string; homeAbbr: string; away: string; awayAbbr: string; date: string; time: string; league: string; leagueEmoji: string; status: string; state: string; homeScore?: string; awayScore?: string; homeScorers: { name: string; time: string }[]; awayScorers: { name: string; time: string }[]; isBigMatch: boolean }[] } | null>(null);
    const [showMatchesPopup, setShowMatchesPopup] = useState(false);
    const [matchTab, setMatchTab] = useState<"upcoming" | "completed">("upcoming");
    const [expandedMatchIndex, setExpandedMatchIndex] = useState<number | null>(null);
    const [matchPage, setMatchPage] = useState(0);
    const [curationReminder, setCurationReminder] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [news, setNews] = useState<{ articles: any[] } | null>(null);
    const [newsPage, setNewsPage] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [pulse, setPulse] = useState<{ post: any; book: any; article: any; wishlist: any } | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cryptoData, setCryptoData] = useState<{ crypto: any[]; global: any; forex: any } | null>(null);
    const [hoveredCoin, setHoveredCoin] = useState<string | null>(null);

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
        fetch('/api/pulse').then(r => r.json()).then(setPulse).catch(() => { });
    }, []);

    // Fetch AI greeting after weather loads (to pass weather context)
    useEffect(() => {
        if (!weather) return;
        const h = new Date().getHours();
        const m = new Date().getMinutes();
        const dayN = DAYS_FULL[new Date().getDay()];
        const bust = new Date().getTime(); // Anti-cache mechanism to prevent stale old prompts
        fetch(`/api/greeting?weather=${encodeURIComponent(weather.label)}&temp=${weather.temp}&day=${dayN}&hour=${h}&minute=${m}&t=${bust}`)
            .then(r => r.json())
            .then(d => setGreeting(d.greeting || ''))
            .catch(() => { });
    }, [weather]);

    // Fetch Curation Reminder
    useEffect(() => {
        const h = new Date().getHours();
        fetch(`/api/curation/reminder?hour=${h}`)
            .then(res => res.json())
            .then(data => {
                if (data.active) setCurationReminder(data);
            })
            .catch(() => { });
    }, []);

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

        // Inject helper times
        const fullBreakdown = [...prayer.prayers];
        if (prayer.imsak) fullBreakdown.push({ name: "Imsak", time: prayer.imsak });
        if (prayer.tahajjud) fullBreakdown.push({ name: "Tahajjud", time: prayer.tahajjud });
        if (prayer.midnight) fullBreakdown.push({ name: "Midnight", time: prayer.midnight });
        if (prayer.firstThird) fullBreakdown.push({ name: "First Third", time: prayer.firstThird });

        // Sort literally by minutes from start of day (0-1439)
        fullBreakdown.sort((a, b) => {
            const [hA, mA] = a.time.split(':').map(Number);
            const [hB, mB] = b.time.split(':').map(Number);
            return (hA * 60 + mA) - (hB * 60 + mB);
        });

        // Find the very first event that is > now
        for (const p of fullBreakdown) {
            const [h, m] = p.time.split(':').map(Number);
            if (h * 60 + m > nowMinutes) return p;
        }

        // All prayers passed → show tomorrow's Imsak/Subuh
        return fullBreakdown[0] || null;
    }, [prayer, now]);

    // Prayer countdown string
    const prayerCountdown = useMemo(() => {
        if (!dynamicNextPrayer) return '';
        const [h, m] = dynamicNextPrayer.time.split(':').map(Number);
        const targetMins = h * 60 + m;
        let diffMin = targetMins - (now.getHours() * 60 + now.getMinutes());

        // Handle next-day wrapping (all events have passed for today)
        if (diffMin < 0) {
            diffMin += 24 * 60;
        }

        const hours = Math.floor(diffMin / 60);
        const mins = diffMin % 60;
        if (hours > 0) return `in ${hours}h ${mins}m`;
        return `in ${mins}m`;
    }, [dynamicNextPrayer, now]);

    // Rolling football match page — cycle every 10s (only upcoming/live matches)
    const bigMatches = useMemo(() => {
        if (!football) return [];
        return football.matches.filter(m => m.isBigMatch && m.state !== 'post');
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

    // Auto-rolling news - 3 articles per page, changing every 15s
    useEffect(() => {
        if (!news?.articles || news.articles.length <= 3) return;
        const id = setInterval(() => {
            setNewsPage(prev => {
                const totalPages = Math.ceil(news.articles.length / 3);
                return (prev + 1) % totalPages;
            });
        }, 15000);
        return () => clearInterval(id);
    }, [news]);

    const visibleNews = useMemo(() => {
        if (!news?.articles) return [];
        const start = newsPage * 3;
        return news.articles.slice(start, start + 3);
    }, [news, newsPage]);

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
            paddingTop: "0.4rem",
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
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                style={{ marginBottom: "0.5rem" }}
            >
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
                    fontSize: "clamp(1.8rem, 8vw, 2.4rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color: "#fff",
                    marginBottom: "0.2rem",
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
                        {weather ? `${weather.label} · ${weather.location || 'Jakarta Selatan, ID'}` : '···'}
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
                            marginTop: "0.2rem",
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
                        <style>{`
                            @keyframes blink-cursor { 0%,100%{opacity:1} 50%{opacity:0} } 
                            @keyframes today-pulse { 0%,100%{box-shadow:0 0 6px rgba(255,59,48,0.4)} 50%{box-shadow:0 0 14px rgba(255,59,48,0.7)} }
                            .custom-scrollbar::-webkit-scrollbar {
                                width: 4px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-track {
                                background: transparent;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb {
                                background: rgba(255, 255, 255, 0.15);
                                borderRadius: 10px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                background: rgba(255, 255, 255, 0.25);
                            }
                        `}</style>
                    </div>
                )}

                {curationReminder && (
                    <Link href={`/curation/${curationReminder.article.id}`} style={{ display: "block", width: "fit-content", marginBottom: "0.8rem", marginTop: "0.8rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(231,231,231,0.1)", border: "1px solid rgba(231,231,231,0.2)", backdropFilter: "blur(12px)", padding: "0.625rem 1rem", borderRadius: "1rem", transition: "all 0.3s ease" }}>
                            <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "#f87171", animation: "pulse 1.5s infinite" }} />
                            <div>
                                <p style={{ color: "white", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.125rem" }}>{curationReminder.message}</p>
                                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>Read: {curationReminder.article.title}</p>
                            </div>
                        </div>
                    </Link>
                )}
            </motion.div>

            {/* ── Main Widget Area — Premium Frosted Glass ── */}
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, type: "spring", bounce: 0.35 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                    background: "rgba(255, 255, 255, 0.02)", // Extremely thin, clear glass
                    backdropFilter: "blur(24px) saturate(150%) brightness(105%)",
                    WebkitBackdropFilter: "blur(24px) saturate(150%) brightness(105%)",
                    borderRadius: "28px", // Refined iOS curve
                    border: "1px solid rgba(255,255,255,0.08)", // Subtle white stroke
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15), inset 0 1px 0.5px rgba(255,255,255,0.2)", // Crisp shadow + thin specular highlight
                    padding: "1rem",
                    position: "relative",
                    overflow: "hidden",
                    touchAction: "pan-y",
                }}>
                {/* Layer 1: Gradient border — soft edge that catches light */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "28px", // MUST EXACTLY MATCH CONTAINER
                    padding: "1px",
                    background: "linear-gradient(160deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, transparent 60%, rgba(255,255,255,0.02) 100%)",
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
                    left: "20%",
                    right: "20%",
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

                <AnimatePresence mode="wait" initial={false} custom={swipeDirection}>
                    {WIDGETS[widgetIndex] === 'music' ? (
                        <motion.div
                            key="now-playing"
                            custom={swipeDirection}
                            variants={{
                                initial: (d: number) => ({ opacity: 0, x: d * 60 }),
                                animate: { opacity: 1, x: 0 },
                                exit: (d: number) => ({ opacity: 0, x: d * -60 })
                            }}
                            initial="initial"
                            animate="animate"
                            exit="exit"
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
                            custom={swipeDirection}
                            variants={{
                                initial: (d: number) => ({ opacity: 0, x: d * 60 }),
                                animate: { opacity: 1, x: 0 },
                                exit: (d: number) => ({ opacity: 0, x: d * -60 })
                            }}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ position: "relative", zIndex: 1 }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem", textTransform: "uppercase" as const, letterSpacing: "0.03em" }}>
                                📰 Headlines
                            </div>
                            {news && news.articles.length > 0 ? (
                                <div style={{ position: "relative", minHeight: "220px" }}>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={`newspage-${newsPage}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "8px",
                                            }}
                                        >
                                            {visibleNews.map((a: { url: string; title: string; source: string; timeAgo: string; excerpt: string }, i: number) => (
                                                <a
                                                    key={`news-${i}`}
                                                    href={a.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "2px", padding: "6px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", transition: "background 0.2s ease" }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                                                >
                                                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                                                        {a.title}
                                                    </div>
                                                    {a.excerpt && (
                                                        <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.55)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", lineHeight: 1.35, marginBottom: "2px" }}>
                                                            {a.excerpt}
                                                        </div>
                                                    )}
                                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.5rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                                                        <span>{a.source}</span>
                                                        <span>{a.timeAgo}</span>
                                                    </div>
                                                </a>
                                            ))}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "1.5rem 0" }}>Loading news···</div>
                            )}
                        </motion.div>
                    ) : WIDGETS[widgetIndex] === 'crypto' ? (
                        <motion.div
                            key="crypto"
                            custom={swipeDirection}
                            variants={{
                                initial: (d: number) => ({ opacity: 0, x: d * 60 }),
                                animate: { opacity: 1, x: 0 },
                                exit: (d: number) => ({ opacity: 0, x: d * -60 })
                            }}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ position: "relative", zIndex: 1 }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem", textTransform: "uppercase" as const, letterSpacing: "0.03em" }}>
                                📊 Markets
                            </div>
                            {cryptoData && cryptoData.crypto.length > 0 ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

                                    {/* Macro Dashboard */}
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "2px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                            <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Forex / USD</div>
                                            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", fontVariantNumeric: "tabular-nums" }}>
                                                Rp {(cryptoData.forex.IDR || 0).toLocaleString('id-ID')}
                                                <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.4)", marginLeft: "4px", fontWeight: 500 }}>IDR</span>
                                            </div>
                                            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", fontVariantNumeric: "tabular-nums" }}>
                                                € {(cryptoData.forex.EUR || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.4)", marginLeft: "4px", fontWeight: 500 }}>EUR</span>
                                            </div>
                                        </div>

                                        <div style={{ width: "1px", background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />

                                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "right" }}>
                                            <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Crypto Macro</div>
                                            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", fontVariantNumeric: "tabular-nums" }}>
                                                ${((cryptoData.global.totalMarketCap || 0) / 1e12).toFixed(2)}T
                                                <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.4)", marginLeft: "4px", fontWeight: 500 }}>Global Cap</span>
                                            </div>
                                            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", fontVariantNumeric: "tabular-nums" }}>
                                                {(cryptoData.global.btcDominance || 0).toFixed(1)}%
                                                <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.4)", marginLeft: "4px", fontWeight: 500 }}>BTC Dom</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Top Assets */}
                                    {cryptoData.crypto.map((c: { id: string; symbol: string; name: string; emoji: string; usd: number; change24h: number; vol24h: number; marketCap: number; }) => (
                                        <div
                                            key={c.id}
                                            onMouseEnter={() => setHoveredCoin(c.id)}
                                            onMouseLeave={() => setHoveredCoin(null)}
                                            style={{ display: "flex", flexDirection: "column", padding: "6px 8px", borderRadius: "10px", background: hoveredCoin === c.id ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)", cursor: "default", transition: "background 0.2s ease" }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between" }}>
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
                                            <AnimatePresence>
                                                {hoveredCoin === c.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        animate={{ height: "auto", opacity: 1, marginTop: "4px" }}
                                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        style={{ overflow: "hidden", display: "flex", justifyContent: "space-between", fontSize: "0.55rem", color: "rgba(255,255,255,0.55)", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "4px" }}
                                                    >
                                                        <span>Vol: ${(c.vol24h / 1e9).toFixed(1)}B</span>
                                                        <span>Cap: ${(c.marketCap / 1e9).toFixed(1)}B</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "1.5rem 0" }}>Loading markets···</div>
                            )}
                        </motion.div>
                    ) : WIDGETS[widgetIndex] === 'pulse' ? (
                        <motion.div
                            key="pulse"
                            custom={swipeDirection}
                            variants={{
                                initial: (d: number) => ({ opacity: 0, x: d * 60 }),
                                animate: { opacity: 1, x: 0 },
                                exit: (d: number) => ({ opacity: 0, x: d * -60 })
                            }}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ position: "relative", zIndex: 1 }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem", textTransform: "uppercase" as const, letterSpacing: "0.03em" }}>
                                📋 Pulse
                            </div>
                            {pulse ? (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", height: "180px" }}>
                                    {/* Left Panel: Latest Post (Full Height, Cover Background) */}
                                    <Link href={pulse.post?.slug ? `/blog/${pulse.post.slug}` : "/blog"} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                                        <div style={{
                                            position: "relative",
                                            height: "100%",
                                            borderRadius: "14px",
                                            background: pulse.post?.coverImage ? `url(${pulse.post.coverImage}) center/cover no-repeat` : "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.15)",
                                            transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                                            cursor: "pointer",
                                            overflow: "hidden"
                                        }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 16px rgba(0,0,0,0.3)"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.15)"; }}
                                        >
                                            {/* Gradient Overlay for Legibility */}
                                            <div style={{ position: "absolute", inset: 0, background: pulse.post?.coverImage ? "linear-gradient(to top, rgba(15,20,30,0.95) 0%, rgba(15,20,30,0.4) 50%, rgba(15,20,30,0.1) 100%)" : "transparent" }} />

                                            <div style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "4px 8px", borderRadius: "20px", fontSize: "0.5rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em", border: "1px solid rgba(255,255,255,0.1)" }}>NEWEST POST</div>

                                            <div style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                    {pulse.post?.title || "No posts yet"}
                                                </div>
                                                <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Read Article →</div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Right Panel: Split into Two Rows */}
                                    <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "8px", height: "100%" }}>

                                        {/* Top Right: Latest Book */}
                                        <Link href="/bookshelf" style={{ textDecoration: "none" }}>
                                            <div style={{
                                                position: "relative", height: "100%", padding: "10px", borderRadius: "14px",
                                                background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
                                                border: "1px solid rgba(255,255,255,0.06)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                                                transition: "all 0.3s ease", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px"
                                            }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                                            >
                                                {pulse.book?.coverImage ? (
                                                    <img src={pulse.book.coverImage} alt="Cover" style={{ width: "45px", height: "65px", borderRadius: "6px", objectFit: "cover", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", flexShrink: 0 }} />
                                                ) : (
                                                    <div style={{ width: "45px", height: "65px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>📘</div>
                                                )}
                                                <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
                                                    <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>CURRENT READ</div>
                                                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.95)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.2 }}>{pulse.book?.title || "No logs"}</div>
                                                    <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pulse.book?.author || "—"}</div>
                                                    {pulse.book?.rating > 0 && (
                                                        <div style={{ fontSize: "0.5rem", color: "#fbbf24", marginTop: "2px" }}>{"★".repeat(pulse.book.rating)}{"☆".repeat(5 - pulse.book.rating)}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Bottom Right: Latest Curation */}
                                        <Link href="/curation" style={{ textDecoration: "none" }}>
                                            <div style={{
                                                position: "relative", height: "100%", padding: "10px", borderRadius: "14px",
                                                background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
                                                border: "1px solid rgba(255,255,255,0.06)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                                                transition: "all 0.3s ease", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden"
                                            }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(145deg, rgba(52, 211, 153, 0.1) 0%, rgba(255,255,255,0.02) 100%)"; e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.3)"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                                            >
                                                <div style={{ position: "absolute", bottom: "-10px", right: "-10px", width: "40px", height: "40px", background: "rgba(52, 211, 153, 0.2)", filter: "blur(15px)", borderRadius: "50%" }} />
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", position: "relative", zIndex: 1 }}>
                                                    <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>SAVED ARTICLE</div>
                                                    {pulse.article?.isRead === false && (
                                                        <div style={{ fontSize: "0.45rem", fontWeight: 800, color: "#ef4444", background: "rgba(239, 68, 68, 0.15)", padding: "2px 5px", borderRadius: "4px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>UNREAD</div>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", position: "relative", zIndex: 1 }}>
                                                    {pulse.article?.title ? `"${pulse.article.title}"` : "No saves yet"}
                                                </div>
                                            </div>
                                        </Link>

                                    </div>
                                </div>
                            ) : (
                                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "1.5rem 0" }}>Loading pulse···</div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="calendar-stats"
                            custom={swipeDirection}
                            variants={{
                                initial: (d: number) => ({ opacity: 0, x: d * 60 }),
                                animate: { opacity: 1, x: 0 },
                                exit: (d: number) => ({ opacity: 0, x: d * -60 })
                            }}
                            initial="initial"
                            animate="animate"
                            exit="exit"
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
                                <div
                                    title={prayer?.hijriDate || undefined}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.35rem",
                                        fontSize: "0.82rem",
                                        fontWeight: 600,
                                        color: "rgba(255,255,255,0.85)",
                                        marginBottom: "0.5rem",
                                        cursor: prayer?.hijriDate ? "help" : "default"
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
                                    <div style={{ marginTop: "0.2rem" }}>
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
                                gap: "0.45rem",
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
                                {weather && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.62rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginTop: "-0.2rem" }}>
                                        <span>Feels like {weather.feelsLike}°</span>
                                        <span>UV: {weather.uv}</span>
                                        <span>Rain: {weather.precip}%</span>
                                    </div>
                                )}

                                {/* GitHub Benchmark */}
                                <Link href="https://github.com/muhammadfaza16" target="_blank">
                                    <div style={{
                                        background: "rgba(0,0,0,0.08)",
                                        borderRadius: "12px",
                                        padding: "0.55rem 0.7rem",
                                        transition: "background 0.2s ease",
                                        cursor: "pointer",
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
                                                    <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "rgba(255,255,255,0.95)", lineHeight: 1 }}>
                                                        {github.currentMonthActiveDays}<span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>/{github.currentMonthTotalDays}</span>
                                                    </span>
                                                    <span style={{ fontSize: "0.65rem", fontWeight: 500, color: "rgba(255,255,255,0.65)" }}>
                                                        days active
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.55)", marginTop: "0.2rem", display: "flex", alignItems: "center", gap: "4px" }}>
                                                    <span style={{ color: "#4ade80", fontWeight: 700 }}>{github.currentMonthPushCount}</span> commits/pushes
                                                </div>
                                                {github.recentRepo && (
                                                    <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.45)", marginTop: "0.3rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontStyle: "italic" }}>
                                                        <span style={{ fontWeight: 600 }}>Last touched:</span> {github.recentRepo}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)" }}>Loading···</div>
                                        )}
                                    </div>
                                </Link>

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
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    gap: "4px",
                    marginTop: "0.8rem",
                    height: "12px",
                    position: "relative",
                    zIndex: 5,
                }}>
                    {WIDGETS.map((w, i) => (
                        <div
                            key={w}
                            onClick={() => { setSwipeDirection(i > widgetIndex ? 1 : -1); setWidgetIndex(i); }}
                            style={{
                                width: "3px",
                                borderRadius: "2px",
                                background: widgetIndex === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
                                height: widgetIndex === i ? "12px" : "4px",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                        />
                    ))}
                </div>
            </motion.div>

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
                            {/* Header & Tabs */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                                <div style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                                    ⚽ Matches
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

                            {/* Tabs */}
                            <div style={{ display: "flex", gap: "10px", marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem" }}>
                                <div
                                    onClick={() => setMatchTab("upcoming")}
                                    style={{ fontSize: "0.75rem", fontWeight: matchTab === "upcoming" ? 700 : 500, color: matchTab === "upcoming" ? "white" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.2s ease" }}>
                                    Upcoming & Live
                                </div>
                                <div
                                    onClick={() => setMatchTab("completed")}
                                    style={{ fontSize: "0.75rem", fontWeight: matchTab === "completed" ? 700 : 500, color: matchTab === "completed" ? "white" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.2s ease" }}>
                                    Completed
                                </div>
                            </div>

                            {/* Match List */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {football.matches
                                    .filter(m => m.isBigMatch && (matchTab === "upcoming" ? m.state !== "post" : m.state === "post"))
                                    .map((m, i) => {
                                        const isExpanded = expandedMatchIndex === (matchTab === "upcoming" ? i : i + 1000);
                                        const hasScorers = m.homeScorers?.length > 0 || m.awayScorers?.length > 0;
                                        return (
                                            <div key={i}
                                                onClick={() => hasScorers && setExpandedMatchIndex(isExpanded ? null : (matchTab === "upcoming" ? i : i + 1000))}
                                                style={{
                                                    display: "flex", flexDirection: "column",
                                                    padding: "10px 12px",
                                                    borderRadius: "12px",
                                                    background: "rgba(255,255,255,0.08)",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    cursor: hasScorers ? "pointer" : "default",
                                                    transition: "background 0.2s ease",
                                                }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700 }}>
                                                            <span>{m.leagueEmoji}</span>
                                                            <span>{m.home}</span>
                                                            <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 400, fontSize: "0.7rem", margin: "0 2px" }}>vs</span>
                                                            <span>{m.away}</span>
                                                        </div>
                                                        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                                                            {m.league}
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: "right", paddingLeft: "10px" }}>
                                                        {m.state === "in" ? (
                                                            <div style={{ color: "#4ade80", fontWeight: 800, fontSize: "0.85rem", lineHeight: 1.1 }}>
                                                                LIVE<br />{m.homeScore} - {m.awayScore}
                                                            </div>
                                                        ) : m.state === "post" ? (
                                                            <div style={{ fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.1 }}>
                                                                {m.homeScore} - {m.awayScore}
                                                                <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>FT</div>
                                                            </div>
                                                        ) : (
                                                            <div style={{ lineHeight: 1.1 }}>
                                                                <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>{m.time}</div>
                                                                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>{m.date}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expandable Scorer Details */}
                                                <AnimatePresence>
                                                    {isExpanded && hasScorers && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                            animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                            style={{ overflow: "hidden" }}
                                                        >
                                                            <div style={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                paddingTop: "8px",
                                                                borderTop: "1px dashed rgba(255,255,255,0.15)",
                                                                fontSize: "0.65rem",
                                                                color: "rgba(255,255,255,0.75)"
                                                            }}>
                                                                <div style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}>
                                                                    {m.homeScorers?.map((s, idx) => (
                                                                        <div key={idx}>⚽ {s.name} <span style={{ opacity: 0.6 }}>{s.time}</span></div>
                                                                    ))}
                                                                </div>
                                                                <div style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1, textAlign: "right" }}>
                                                                    {m.awayScorers?.map((s, idx) => (
                                                                        <div key={idx}><span style={{ opacity: 0.6 }}>{s.time}</span> {s.name} ⚽</div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )
                                    })}
                                {football.matches.filter(m => m.isBigMatch && (matchTab === "upcoming" ? m.state !== "post" : m.state === "post")).length === 0 && (
                                    <div style={{ textAlign: "center", padding: "1.5rem", color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>
                                        No {matchTab} matches found.
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
