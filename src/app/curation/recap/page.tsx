"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, Flame, Trophy, Clock, TrendingUp, Search, X, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { AnimatePresence } from "framer-motion";
import { formatTitle } from "@/lib/utils";
import { AtlasMenu } from "@/components/AtlasMenu";

type ReadEntry = { id: string; ts: number };
type VisitorState = { read: Record<string, boolean>; bookmarked: Record<string, boolean> };

const CATEGORIES = [
    { name: "AI & Tech" },
    { name: "Wealth & Business" },
    { name: "Philosophy & Psychology" },
    { name: "Productivity & Deep Work" },
    { name: "Growth & Systems" },
];

export default function CurationRecapPage() {
    const { theme, setTheme } = useTheme();
    const [weeklyReads, setWeeklyReads] = useState(0);
    const [totalReads, setTotalReads] = useState(0);
    const [streak, setStreak] = useState(0);
    const [topCategories, setTopCategories] = useState<{ name: string; count: number }[]>([]);
    const [recentReads, setRecentReads] = useState<{ id: string; title: string; ts: number }[]>([]);
    const [totalReadingTimeMins, setTotalReadingTimeMins] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isAtlasMenuOpen, setIsAtlasMenuOpen] = useState(false);

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");


    useEffect(() => {
        const cacheKey = "curation_recap_cache";
        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                setWeeklyReads(parsed.weeklyReads);
                setTotalReads(parsed.totalReads);
                setStreak(parsed.streak);
                setTopCategories(parsed.topCategories);
                setRecentReads(parsed.recentReads);
                setTotalReadingTimeMins(parsed.totalReadingTimeMins);
                setIsLoading(false);
                return;
            }
        } catch { }

        setIsLoading(true);
        // Load all data from localStorage
        try {
            const vs: VisitorState = JSON.parse(localStorage.getItem('curation_visitor_state') || '{"read":{},"bookmarked":{}}');
            const history: ReadEntry[] = JSON.parse(localStorage.getItem('curation_read_history') || '[]');

            // Total stats
            setTotalReads(Object.keys(vs.read).length);

            // Weekly reads
            const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            const recentHistory = history.filter(h => h.ts > oneWeekAgo);
            setWeeklyReads(recentHistory.length);

            // Streak calculation (consecutive days with reads)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let currentStreak = 0;
            const dayMs = 24 * 60 * 60 * 1000;
            for (let i = 0; i < 365; i++) {
                const dayStart = today.getTime() - i * dayMs;
                const dayEnd = dayStart + dayMs;
                const hasRead = history.some(h => h.ts >= dayStart && h.ts < dayEnd);
                if (hasRead) {
                    currentStreak++;
                } else if (i > 0) {
                    break; // streak broken
                }
            }
            setStreak(currentStreak);

            // Fetch article details for category analysis
            fetch('/api/curation?limit=100&sort=latest')
                .then(r => r.json())
                .then(data => {
                    if (!data.articles) return;
                    const articleMap = new Map<string, any>();
                    data.articles.forEach((a: any) => articleMap.set(a.id, a));

                    // Top categories from read articles
                    const catCounts: Record<string, number> = {};
                    Object.keys(vs.read).forEach(aid => {
                        const art = articleMap.get(aid);
                        if (art?.category) {
                            catCounts[art.category] = (catCounts[art.category] || 0) + 1;
                        }
                    });

                    const sorted = Object.entries(catCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 4)
                        .map(([name, count]) => {
                            return { name, count };
                        });
                    setTopCategories(sorted);

                    // Recent reads with titles
                    const recent = history
                        .sort((a, b) => b.ts - a.ts)
                        .slice(0, 10)
                        .map(h => {
                            const art = articleMap.get(h.id);
                            return { id: h.id, title: art?.title || 'Untitled', ts: h.ts };
                        });
                    setRecentReads(recent);

                    // Estimate total reading time (average 5 min per article)
                    const readingMins = Object.keys(vs.read).length * 5;
                    setTotalReadingTimeMins(readingMins);

                    try {
                        sessionStorage.setItem(cacheKey, JSON.stringify({
                            weeklyReads: recentHistory.length,
                            totalReads: Object.keys(vs.read).length,
                            streak: currentStreak,
                            topCategories: sorted,
                            recentReads: recent,
                            totalReadingTimeMins: readingMins
                        }));
                    } catch { }
                })
                .catch(() => { })
                .finally(() => setIsLoading(false));
        } catch {
            setIsLoading(false);
        }
    }, []);

    const formatRelativeTime = (ts: number) => {
        const diff = Date.now() - ts;
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const VERTICALS = [
        { label: "Books", href: "/curation/books" },
        { label: "Skills Lab", href: "/curation/skills" },
        { label: "Frameworks", href: "/curation/frameworks" },
        { label: "Codex", href: "/curation/codex" },
        { label: "Collections", href: "/curation/collections" },
        { label: "Recap", href: "/curation/recap" },
        { label: "Highlights", href: "/curation/highlights" },
    ];

    return (
        <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] pb-24">
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />

            {/* Header */}
            <header className="sticky top-0 z-[110] bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 shrink-0 transition-colors duration-500">
                <div className="h-16 flex items-center px-4">
                    {/* Left: Back */}
                    <motion.div 
                        animate={{ width: searchQuery || isSearchFocused ? 0 : 48, opacity: searchQuery || isSearchFocused ? 0 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        className="flex items-center overflow-hidden"
                    >
                        <AnimatePresence mode="popLayout">
                            {!isSearchFocused && !searchQuery && (
                                <motion.div
                                    key="back-button"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        href="/curation"
                                        className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all"
                                    >
                                        <ArrowLeft size={18} />
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Center: Search */}
                    <div className="flex-1 flex justify-center px-2">
                        <motion.div 
                            layout
                            className="w-full"
                            animate={{ maxWidth: searchQuery || isSearchFocused ? "800px" : "240px" }}
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        >
                            <div className="relative group max-w-4xl mx-auto">
                                <Search
                                    size={14}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors"
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    placeholder="Search history..."
                                    className="w-full h-9 bg-zinc-100/60 dark:bg-zinc-800/60 border border-transparent focus:bg-white dark:focus:bg-zinc-900/50 focus:border-zinc-200 dark:focus:border-zinc-700/50 rounded-full pl-9 pr-9 text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500/80 transition-all outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                                    >
                                        <X size={14} className="text-zinc-400" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Actions */}
                    <motion.div 
                        animate={{ width: searchQuery || isSearchFocused ? 0 : 80, opacity: searchQuery || isSearchFocused ? 0 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        className="flex items-center justify-end overflow-hidden"
                    >
                        <AnimatePresence mode="popLayout">
                            {!isSearchFocused && !searchQuery && (
                                <motion.div
                                    key="header-actions"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-0.5"
                                >
                                    <button
                                        onClick={toggleTheme}
                                        className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all relative overflow-hidden"
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.div
                                                key={theme}
                                                initial={{ y: -20, opacity: 0, scale: 0.5, rotate: -90 }}
                                                animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                                                exit={{ y: 20, opacity: 0, scale: 0.5, rotate: 90 }}
                                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                                className="absolute flex items-center justify-center"
                                            >
                                                {theme === "dark" ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
                                            </motion.div>
                                        </AnimatePresence>
                                    </button>
                                    <button
                                        onClick={() => setIsAtlasMenuOpen(!isAtlasMenuOpen)}
                                        className="w-9 h-9 flex items-center justify-center text-zinc-900 dark:text-zinc-100 active:scale-90 rounded-full transition-all relative z-[110]"
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={isAtlasMenuOpen ? "close" : "menu"}
                                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {isAtlasMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
                                            </motion.div>
                                        </AnimatePresence>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8 pb-8">
                {/* Hero Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h2 className="text-[32px] font-semibold tracking-[-0.03em] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Reading Log
                    </h2>
                    <p className="text-[15px] text-zinc-500 mb-8">A look back at your reading journey.</p>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/60 p-5 rounded-2xl"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                    <BookOpen size={16} className="text-blue-500" />
                                </div>
                            </div>
                            {isLoading ? (
                                <div className="h-[34px] w-16 bg-zinc-100 rounded animate-pulse" />
                            ) : (
                                <p className="text-[28px] font-semibold tracking-tight text-zinc-900">{totalReads}</p>
                            )}
                            <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Entries Finished</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl border border-zinc-200/80 p-5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                                    <Flame size={16} className="text-orange-500" />
                                </div>
                            </div>
                            {isLoading ? (
                                <div className="h-[34px] w-16 bg-zinc-100 rounded animate-pulse" />
                            ) : (
                                <p className="text-[28px] font-semibold tracking-tight text-zinc-900">{weeklyReads}</p>
                            )}
                            <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">This Week</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl border border-zinc-200/80 p-5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                                    <Trophy size={16} className="text-purple-500" />
                                </div>
                            </div>
                            {isLoading ? (
                                <div className="h-[34px] w-12 bg-zinc-100 rounded animate-pulse" />
                            ) : (
                                <p className="text-[28px] font-semibold tracking-tight text-zinc-900">{streak}</p>
                            )}
                            <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Day Streak</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white rounded-2xl border border-zinc-200/80 p-5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                    <Clock size={16} className="text-emerald-500" />
                                </div>
                            </div>
                            {isLoading ? (
                                <div className="h-[34px] w-20 bg-zinc-100 rounded animate-pulse" />
                            ) : (
                                <p className="text-[28px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">~{totalReadingTimeMins}</p>
                            )}
                            <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Reading Time</p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Top Categories */}
                {isLoading ? (
                    <div className="mb-10 animate-pulse">
                        <div className="h-4 w-32 bg-zinc-200 rounded mb-4"></div>
                        <div className="space-y-2">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-zinc-100 rounded-xl"></div>)}
                        </div>
                    </div>
                ) : topCategories.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-10"
                    >
                        <h3 className="text-[11px] font-semibold tracking-widest text-zinc-500 dark:text-zinc-500 uppercase mb-4 flex items-center gap-2">
                            <TrendingUp size={14} />
                            Top Topics
                        </h3>
                        <div className="flex flex-col gap-2">
                            {topCategories.map((cat, i) => (
                                <div key={cat.name} className="flex items-center gap-3 bg-white rounded-xl border border-zinc-200/80 p-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[14px] font-semibold text-zinc-800 truncate">{cat.name}</p>
                                        <p className="text-[12px] text-zinc-500 dark:text-zinc-500">{cat.count} entries read</p>
                                    </div>
                                    <span className="text-[12px] font-semibold text-zinc-300">#{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Recent Reads */}
                {recentReads.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="text-[11px] font-semibold tracking-widest text-zinc-500 dark:text-zinc-500 uppercase mb-4">Recent Reading History</h3>
                        <div className="flex flex-col gap-1">
                            {recentReads.map((entry, i) => (
                                <Link
                                    key={`${entry.id}-${i}`}
                                    href={`/curation/${entry.id}`}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
                                >
                                    <span className="text-[13px] font-semibold text-zinc-200 w-6 text-right shrink-0">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[14px] font-semibold text-zinc-700 truncate group-hover:text-blue-600 transition-colors">
                                            {formatTitle(entry.title)}
                                        </p>
                                    </div>
                                    <span className="text-[11px] text-zinc-500 dark:text-zinc-500 shrink-0">
                                        {formatRelativeTime(entry.ts)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {totalReads === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <BookOpen size={48} className="text-zinc-200 mx-auto mb-4" strokeWidth={1.5} />
                        <p className="text-[16px] font-semibold text-zinc-500 dark:text-zinc-500 mb-2">No reading history yet</p>
                        <p className="text-[14px] text-zinc-500 dark:text-zinc-500 mb-6">Start exploring articles and your stats will appear here.</p>
                        <Link
                            href="/curation"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-full active:scale-95 transition-all"
                        >
                            Browse Articles
                        </Link>
                    </motion.div>
                )}
            </main>
            {/* ═══ ATLAS MENU ═══ */}
            <AtlasMenu items={VERTICALS} isOpen={isAtlasMenuOpen} onClose={() => setIsAtlasMenuOpen(false)} />
        </div>
    );
}
