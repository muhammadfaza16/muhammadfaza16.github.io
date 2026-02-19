"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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

    // Widget toggle: 'music' or 'calendar'
    const [activeWidget, setActiveWidget] = useState<'music' | 'calendar'>('calendar');

    // Auto-switch to music when user first interacts
    useEffect(() => {
        if (hasInteracted) setActiveWidget('music');
    }, [hasInteracted]);

    const showNowPlaying = activeWidget === 'music' && hasInteracted;

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

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60000);
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

    const dayName = DAYS_FULL[now.getDay()];
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
        // Morning/Daytime (6am - 5pm): bright nature scene
        if (hour >= 6 && hour < 17) return '/wallpapers/morning.jpg';
        // Evening/Night (5pm - 6am): sunset street scene
        return '/wallpapers/afternoon.jpg';
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
                background: "linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.45) 100%)",
                zIndex: -1,
            }} />
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
                    <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                        {dateStr}
                    </span>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.95)",
                    }}>
                        {weather ? (
                            <>
                                <span style={{ fontSize: "1.2rem" }}>{weather.icon}</span>
                                <span>{weather.temp}°C</span>
                            </>
                        ) : (
                            <>
                                <CloudSun size={22} strokeWidth={2.5} />
                                <span>···</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Big Day Name */}
                <div style={{
                    fontSize: "clamp(2.8rem, 11vw, 3.6rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color: "#fff",
                    marginBottom: "0.35rem",
                    textShadow: "0 2px 12px rgba(0,0,0,0.3)",
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
                    <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>
                        {weather ? `${weather.label} · Jaksel` : '···'}
                    </span>
                    {prayer?.next && (
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                            🕌 {prayer.next.name} {prayer.next.time}
                        </span>
                    )}
                </div>

                {/* AI Generated Greeting */}
                {greeting && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            fontSize: "0.78rem",
                            fontStyle: "italic",
                            fontWeight: 400,
                            color: "rgba(255,255,255,0.6)",
                            marginTop: "0.35rem",
                            lineHeight: 1.4,
                        }}
                    >
                        "{greeting}"
                    </motion.div>
                )}
            </div>

            {/* ── Main Widget Area — Premium Frosted Glass ── */}
            <div style={{
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

                <AnimatePresence mode="wait">
                    {showNowPlaying ? (
                        <motion.div
                            key="now-playing"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
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
                                        color: "var(--ink-primary, #1c211a)",
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                        marginBottom: "2px",
                                    }}>{song}</div>
                                    <div style={{
                                        fontSize: "0.75rem", fontWeight: 500,
                                        color: "var(--ink-muted, #5e6b5a)",
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                    }}>{artist}</div>
                                </div>

                                {/* Controls */}
                                <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
                                    <div onClick={prevSong} style={{ padding: "6px", cursor: "pointer", display: "flex" }}>
                                        <SkipBack size={15} fill="var(--ink-primary, #1c211a)" color="var(--ink-primary, #1c211a)" />
                                    </div>
                                    <div onClick={togglePlay} style={{
                                        width: "34px", height: "34px", borderRadius: "50%",
                                        background: "rgba(0,0,0,0.08)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer",
                                    }}>
                                        {isPlaying
                                            ? <Pause size={15} fill="var(--ink-primary, #1c211a)" color="var(--ink-primary, #1c211a)" />
                                            : <Play size={15} fill="var(--ink-primary, #1c211a)" color="var(--ink-primary, #1c211a)" style={{ marginLeft: "2px" }} />
                                        }
                                    </div>
                                    <div onClick={() => nextSong()} style={{ padding: "6px", cursor: "pointer", display: "flex" }}>
                                        <SkipForward size={15} fill="var(--ink-primary, #1c211a)" color="var(--ink-primary, #1c211a)" />
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
                                                ? "var(--ink-primary, #1c211a)"
                                                : "var(--ink-muted, #5e6b5a)",
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
                                        fontSize: "0.78rem", color: "var(--ink-muted, #5e6b5a)",
                                        fontStyle: "italic",
                                    }}>♪ No lyrics available ♪</div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="calendar-stats"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
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
                                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                            {football.matches
                                                .filter(m => m.isBigMatch)
                                                .slice(0, 3)
                                                .map((m, i) => (
                                                    <div key={i} style={{
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
                                                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.52rem", fontWeight: 500 }}>
                                                            {m.state === "in" ? (
                                                                <span style={{ color: "#4ade80", fontWeight: 700 }}>LIVE {m.homeScore}-{m.awayScore}</span>
                                                            ) : m.state === "post" ? (
                                                                <span>{m.homeScore}-{m.awayScore} FT</span>
                                                            ) : (
                                                                <span>{m.date} · {m.time}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
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
                                    <Droplets size={15} strokeWidth={2.5} color="var(--ink-primary)" style={{ opacity: 0.7, flexShrink: 0 }} />
                                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--ink-secondary)", whiteSpace: "nowrap" }}>
                                        {weather ? `${weather.humidity}%` : '··'}
                                    </span>
                                    <Wind size={15} strokeWidth={2.5} color="var(--ink-primary)" style={{ opacity: 0.7, flexShrink: 0, marginLeft: "0.3rem" }} />
                                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--ink-secondary)", whiteSpace: "nowrap" }}>
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
                                        letterSpacing: "0.03em", color: "var(--ink-primary)",
                                        marginBottom: "0.3rem",
                                    }}>
                                        <GitBranch size={13} strokeWidth={2.5} />
                                        GitHub
                                    </div>
                                    {github ? (
                                        <>
                                            <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                                                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--ink-primary)", lineHeight: 1 }}>
                                                    {github.streak}
                                                </span>
                                                <span style={{ fontSize: "0.68rem", fontWeight: 500, color: "var(--ink-muted)" }}>
                                                    day streak 🔥
                                                </span>
                                            </div>
                                            <div style={{ fontSize: "0.65rem", color: "var(--ink-muted)", marginTop: "0.15rem" }}>
                                                {github.repos} repos · {github.todayActive ? '✅ active today' : '⏳ no push today'}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>Loading···</div>
                                    )}
                                </div>

                                {/* Daily Quote */}
                                <div style={{ marginTop: "0.1rem" }}>
                                    <div style={{
                                        fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" as const,
                                        letterSpacing: "0.03em", color: "var(--ink-primary)",
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
                                                color: "var(--ink-secondary)", lineHeight: 1.4,
                                            }}>
                                                &quot;{quote.text}&quot;
                                            </div>
                                            <div style={{ fontSize: "0.62rem", color: "var(--ink-muted)", marginTop: "0.15rem" }}>
                                                — {quote.author}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ fontSize: "0.72rem", fontStyle: "italic", color: "var(--ink-muted)" }}>Loading···</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Widget Toggle — iOS page dots */}
                {hasInteracted && (
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "6px",
                        marginTop: "0.6rem",
                        position: "relative",
                        zIndex: 5,
                    }}>
                        {[
                            { key: 'music' as const, label: '♪' },
                            { key: 'calendar' as const, label: '▦' },
                        ].map((item) => (
                            <div
                                key={item.key}
                                onClick={() => setActiveWidget(item.key)}
                                style={{
                                    width: activeWidget === item.key ? "20px" : "7px",
                                    height: "7px",
                                    borderRadius: "4px",
                                    background: activeWidget === item.key
                                        ? "var(--ink-primary, #1c211a)"
                                        : "rgba(0,0,0,0.15)",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                }}
                            />
                        ))}
                    </div>
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
                            background: "rgba(0,0,0,0.5)",
                            backdropFilter: "blur(8px)",
                            padding: "1rem",
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                                backdropFilter: "blur(40px)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "24px",
                                padding: "1.2rem 1.4rem",
                                maxWidth: "380px",
                                width: "100%",
                                maxHeight: "70vh",
                                overflowY: "auto",
                                color: "var(--ink-primary)",
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
                                        cursor: "pointer", fontSize: "0.8rem", color: "var(--ink-muted)",
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
                                            background: "rgba(255,255,255,0.06)",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                        }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700 }}>
                                                    <span>{m.leagueEmoji}</span>
                                                    <span>{m.home}</span>
                                                    <span style={{ color: "var(--ink-muted)", fontWeight: 400, fontSize: "0.7rem" }}>vs</span>
                                                    <span>{m.away}</span>
                                                </div>
                                                <div style={{ fontSize: "0.65rem", color: "var(--ink-muted)", fontWeight: 500 }}>
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
                                                        <div style={{ fontSize: "0.6rem", color: "var(--ink-muted)" }}>FT</div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>{m.time}</div>
                                                        <div style={{ fontSize: "0.6rem", color: "var(--ink-muted)" }}>{m.date}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                {football.matches.filter(m => m.isBigMatch).length === 0 && (
                                    <div style={{ textAlign: "center", padding: "1rem", color: "var(--ink-muted)", fontSize: "0.8rem" }}>
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
