"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudSun, Sun, CloudRain, Calendar as CalIcon, GitBranch, Quote, Thermometer, Droplets, Wind, Disc, Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAudio, useTime } from "@/components/AudioContext";

import { CalendarStatsWidget } from "./widgets/CalendarStatsWidget";
import { MusicWidget } from "./widgets/MusicWidget";
import { NewsWidget } from "./widgets/NewsWidget";
import { CryptoWidget } from "./widgets/CryptoWidget";
import { AnimatedNumber } from "./AnimatedNumber";

const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function CleanHomeHero() {
    const router = useRouter();
    const [now, setNow] = useState(new Date());
    const [isMobile, setIsMobile] = useState(false);
    const { isPlaying, togglePlay, currentSong, hasInteracted, nextSong, prevSong, seekTo, activePlaylistId, setIsPlayerExpanded } = useAudio();
    const { currentTime, duration } = useTime();
    
    // WC-4: Robust null-checks for when DB is down
    const songParts = currentSong?.title?.split("—") || [];
    const artist = songParts[0]?.trim() || "Unknown Artist";
    const song = songParts[1]?.trim() || currentSong?.title || "No Audio Loaded";
    
    const lyricsContainerRef = useRef<HTMLDivElement>(null);

    // Find current lyric index
    

    // Auto-scroll lyrics
    

    // Widget system: N-widget slider
    const WIDGETS = ['calendar', 'music', 'news', 'crypto'] as const;
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


    // WC-3: Removed auto-switch to music — let users stay on their preferred widget

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [news, setNews] = useState<{ articles: any[] } | null>(null);
    const [newsPage, setNewsPage] = useState(0);
    const [newsHovered, setNewsHovered] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [pulse, setPulse] = useState<{ post: any; book: any; article: any; wishlist: any } | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cryptoData, setCryptoData] = useState<{ crypto: any[]; global: any; forex: any } | null>(null);
    const [hoveredCoin, setHoveredCoin] = useState<string | null>(null);

    // Typography Definitions for Premium Aesthetic
    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";

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

        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            clearInterval(id);
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Helper for 5-minute client-side API caching
    const fetchCached = async (url: string, setter: (data: any) => void, expiryMs = 300000) => {
        try {
            const cacheKey = `hero_api_cache_${url.split('?')[0]}`;
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < expiryMs) {
                    setter(data);
                    return;
                }
            }
            const res = await fetch(url);
            const data = await res.json();
            setter(data);
            sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
        } catch { }
    };

    // Fetch API data with 5-min caching to prevent back-navigation freezes
    useEffect(() => {
        fetchCached('/api/weather', setWeather);
        fetchCached('/api/quote', setQuote);
        fetchCached('/api/github', setGithub);
        fetchCached(`/api/holidays?year=${new Date().getFullYear()}`, (d) => setHolidays(d.holidays || []));
        fetchCached('/api/prayer', setPrayer);
        fetchCached('/api/news', setNews);
        fetchCached('/api/crypto', setCryptoData);
        fetchCached('/api/pulse', setPulse);
    }, []);

    // Live Football Polling - sync every 15s
    useEffect(() => {
        let isMounted = true;
        let controller = new AbortController();

        const fetchFootball = async () => {
            try {
                // Bust browser cache but also ensure server-side freshness
                const res = await fetch(`/api/football?t=${Date.now()}`, { signal: controller.signal });
                const data = await res.json();
                if (isMounted) setFootball(data);
            } catch (err: any) {
                if (err.name !== 'AbortError' && isMounted) {
                    console.error('Football fetch error:', err);
                }
            }
        };

        fetchFootball(); // Initial load
        const id = setInterval(fetchFootball, 15000); // Poll every 15s

        return () => {
            isMounted = false;
            controller.abort();
            clearInterval(id);
        };
    }, []);

    // Fetch AI greeting after weather loads (30 min cache to save LLM tokens and prevent UI freezes)
    useEffect(() => {
        if (!weather) return;
        const cacheKey = "hero_greeting_cache";
        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const { text, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < 30 * 60 * 1000) {
                    setGreeting(text);
                    return;
                }
            }
        } catch { }

        const h = new Date().getHours();
        const m = new Date().getMinutes();
        const dayN = DAYS_FULL[new Date().getDay()];
        const bust = new Date().getTime(); // Anti-API-cache, but client caches it below
        fetch(`/api/greeting?weather=${encodeURIComponent(weather.label)}&temp=${weather.temp}&day=${dayN}&hour=${h}&minute=${m}&t=${bust}`)
            .then(r => r.json())
            .then(d => {
                const text = d.greeting || '';
                setGreeting(text);
                sessionStorage.setItem(cacheKey, JSON.stringify({ text, timestamp: Date.now() }));
            })
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

        const fullBreakdown = [...prayer.prayers];

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

    // Auto-rolling news - 3 articles per page, changing every 12s
    useEffect(() => {
        if (!news?.articles || news.articles.length <= 3) return;
        if (WIDGETS[widgetIndex] !== 'news') return;
        setNewsPage(prev => {
            const totalPages = Math.ceil(news.articles.length / 3);
            return prev % totalPages;
        });
        const id = setInterval(() => {
            setNewsPage(prev => {
                const totalPages = Math.ceil(news.articles.length / 3);
                return (prev + 1) % totalPages;
            });
        }, 15000);
        return () => clearInterval(id);
    }, [news, widgetIndex]);

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
        return '/wallpapers/night.jpg';                                     // Evening/Night: uploaded cloud tree reflection
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
                style={{ marginBottom: "1rem" }}
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
                                <span style={{ fontSize: "0.68rem", fontWeight: 500, color: "rgba(255,255,255,0.6)", marginLeft: "0.15rem" }}>
                                    {weather.humidity}% · {weather.wind}km/h
                                </span>
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

                <style>{`
                    @keyframes sheen {
                        0% { transform: translateX(-150%) skewX(-25deg); opacity: 0; }
                        20% { opacity: 0.3; }
                        40% { transform: translateX(150%) skewX(-25deg); opacity: 0; }
                        100% { transform: translateX(150%) skewX(-25deg); opacity: 0; }
                    }
                    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.85); } }
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

            </motion.div>

            {/* ── Main Widget Area — Premium Frosted Glass ── */}
            <motion.div
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.8, delay: 0.15, type: "spring", bounce: 0.35,
                    layout: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
                whileHover={{ scale: 1.015, y: -4, transition: { type: "spring", stiffness: 400, damping: 30 } }}
                whileTap={{ scale: 0.985, y: 2, transition: { type: "spring", stiffness: 500, damping: 40 } }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                    // High-End Liquid Material (iOS/visionOS blend) - Adjusted for more transparency
                    background: "linear-gradient(165deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 40%, transparent 100%)",
                    // Refractive Depth
                    backdropFilter: "blur(16px) saturate(140%) brightness(105%)",
                    WebkitBackdropFilter: "blur(16px) saturate(140%) brightness(105%)",
                    borderRadius: "32px",
                    // Specular Reflection Border (v2)
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderTop: "1.5px solid rgba(255,255,255,0.35)",
                    borderLeft: "1px solid rgba(255,255,255,0.15)",
                    // Multi-layer Depth Shadow
                    boxShadow: `
                        0 24px 48px -12px rgba(0,0,0,0.35), 
                        inset 0 0 0 1px rgba(255,255,255,0.06),
                        inset 0 1px 2px rgba(255,255,255,0.1)
                    `,
                    padding: "1rem",
                    position: "relative",
                    overflow: "hidden",
                    touchAction: "pan-y",
                    cursor: "pointer",
                }}>
                {/* Dynamic Ambient Aura - Remains the same to provide color bleed */}
                <motion.div
                    animate={{
                        background:
                            WIDGETS[widgetIndex] === 'music' ? "radial-gradient(circle at 50% 120%, rgba(255, 159, 10, 0.18) 0%, transparent 70%)" :
                                WIDGETS[widgetIndex] === 'crypto' ? "radial-gradient(circle at 80% 100%, rgba(52, 211, 153, 0.15) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 80%)" :
                                    WIDGETS[widgetIndex] === 'news' ? "radial-gradient(circle at 20% 110%, rgba(147, 197, 253, 0.18) 0%, transparent 75%)" :
                                        "radial-gradient(circle at 50% 100%, rgba(167, 139, 250, 0.15) 0%, transparent 70%)",
                        scale: [1, 1.05, 1],
                        opacity: [0.8, 1, 0.8],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        position: "absolute",
                        inset: "-30%",
                        filter: "blur(80px)",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />

                {/* Physical Sheen (Glass Reflection Sweep) */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                    animation: "sheen 6s infinite ease-in-out",
                    zIndex: 2,
                    pointerEvents: "none",
                }} />

                {/* Glass Noise Texture (Organic Refraction) */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    opacity: 0.1,
                    pointerEvents: "none",
                    mixBlendMode: "soft-light",
                    zIndex: 1,
                }} />

                {/* HIGHLIGHT EDGE (Efek Cahaya Menyala saat Hover) */}
                <div
                    className="absolute inset-0 rounded-[32px] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        boxShadow: "inset 0px 1px 1px rgba(255, 255, 255, 0.5), inset 0px 0px 24px rgba(255, 255, 255, 0.08)",
                        zIndex: 3
                    }}
                />

                {/* Layer 2: Specular highlight peak */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: "20%",
                    right: "20%",
                    height: "1px",
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.4) 70%, transparent 100%)",
                    pointerEvents: "none",
                    zIndex: 4,
                    filter: "blur(0.5px)",
                }} />

                <AnimatePresence mode="popLayout" initial={false} custom={swipeDirection}>
                    {WIDGETS[widgetIndex] === 'calendar' && (
                        <CalendarStatsWidget
                            swipeDirection={swipeDirection}
                            prayer={prayer}
                            now={now}
                            isMobile={isMobile}
                            holidayMap={holidayMap}
                            githubPushDays={githubPushDays}
                            tooltipInfo={tooltipInfo}
                            setTooltipInfo={setTooltipInfo}
                            football={football}
                            setShowMatchesPopup={setShowMatchesPopup}
                            matchPage={matchPage}
                            visibleMatches={visibleMatches}
                            MONTHS_FULL={MONTHS_FULL}
                            DAYS_FULL={DAYS_FULL}
                            calendarGrid={calendarGrid}
                            github={github}
                        />
                    )}
                    {WIDGETS[widgetIndex] === 'music' && (
                        <MusicWidget
                            swipeDirection={swipeDirection}
                            isPlaying={isPlaying}
                            currentSong={currentSong}
                            song={currentSong?.title ? currentSong.title : "Select a track"}
                            artist={(currentSong as any)?.artist || ""}
                            currentTime={currentTime}
                            duration={duration}
                            togglePlay={togglePlay}
                            prevSong={prevSong}
                            nextSong={nextSong}
                            seekTo={seekTo}
                        />
                    )}
                    {WIDGETS[widgetIndex] === 'crypto' && (
                        <CryptoWidget
                            cryptoData={cryptoData}
                            swipeDirection={swipeDirection}
                        />
                    )}
                    {WIDGETS[widgetIndex] === 'news' && (
                        <NewsWidget
                            news={news}
                            swipeDirection={swipeDirection}
                            newsPage={newsPage}
                            visibleNews={visibleNews}
                            onMouseEnter={() => setNewsHovered(true)}
                            onMouseLeave={() => setNewsHovered(false)}
                        />
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
                    {/* WC-2: Desktop navigation arrows */}
                    <div
                        onClick={() => { setSwipeDirection(-1); setWidgetIndex(prev => (prev - 1 + WIDGETS.length) % WIDGETS.length); }}
                        style={{ padding: "4px", cursor: "pointer", opacity: 0.3, transition: "opacity 0.2s" }}
                        className="hover:opacity-80"
                    >
                        <ChevronLeft size={12} color="white" />
                    </div>
                    {/* WC-1: Improved dot indicators */}
                    {WIDGETS.map((w, i) => (
                        <div
                            key={w}
                            onClick={() => { setSwipeDirection(i > widgetIndex ? 1 : -1); setWidgetIndex(i); }}
                            style={{
                                width: widgetIndex === i ? "16px" : "5px",
                                height: "5px",
                                borderRadius: "3px",
                                background: widgetIndex === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
                                cursor: "pointer",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                        />
                    ))}
                    <div
                        onClick={() => { setSwipeDirection(1); setWidgetIndex(prev => (prev + 1) % WIDGETS.length); }}
                        style={{ padding: "4px", cursor: "pointer", opacity: 0.3, transition: "opacity 0.2s" }}
                        className="hover:opacity-80"
                    >
                        <ChevronRight size={12} color="white" />
                    </div>
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
                                    .filter((m: any) => m.isBigMatch && (matchTab === "upcoming" ? m.state !== "post" : m.state === "post"))
                                    .sort((a: any, b: any) => matchTab === "completed" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp)
                                    .map((m: any, i: number) => {
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
                                                            <div style={{ color: "#4ade80", fontWeight: 800, fontSize: "0.85rem", lineHeight: 1.1, whiteSpace: "nowrap" }}>
                                                                {m.liveMinute || "LIVE"}<br />{m.homeScore} - {m.awayScore}
                                                            </div>
                                                        ) : m.state === "post" ? (
                                                            <div style={{ fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.1 }}>
                                                                {m.homeScore} - {m.awayScore}
                                                                <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>FT • {m.date}</div>
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
                                                                    {m.homeScorers?.map((s: any, idx: number) => (
                                                                        <div key={idx}>⚽ {s.name} <span style={{ opacity: 0.6 }}>{s.time}</span></div>
                                                                    ))}
                                                                </div>
                                                                <div style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1, textAlign: "right" }}>
                                                                    {m.awayScorers?.map((s: any, idx: number) => (
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
