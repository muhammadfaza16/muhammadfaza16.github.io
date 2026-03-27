"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bookmark, BookOpen, ChevronRight, Clock, FileText,
    Hash, ArrowLeft, TrendingUp,
    Brain, Rocket, Coffee, Zap, BarChart3, Calendar,
    Star, Award, X, FolderPlus, FolderCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getVisitorState, getReadHistoryAsync, removeFromReadHistoryAsync, getCollectionsAsync, saveCollectionsAsync, VisitorState, ReadEntry, Collection } from "@/lib/storage";
import { formatTitle } from "@/lib/utils";
import { curationCache } from "@/lib/curation-cache";
import { useTheme } from "@/components/ThemeProvider";

// ─── Types ───

const CATEGORIES: Record<string, { icon: React.ComponentType<any> }> = {
    "AI & Tech": { icon: Brain },
    "Wealth & Business": { icon: Rocket },
    "Philosophy & Psychology": { icon: Coffee },
    "Productivity & Deep Work": { icon: Zap },
    "Growth & Systems": { icon: TrendingUp },
};

// ─── Helpers ───

function calcStreak(history: ReadEntry[]): number {
    if (!history.length) return 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const dayMs = 86400000;
    let streak = 0;
    for (let i = 0; i < 365; i++) {
        const dayStart = today.getTime() - i * dayMs;
        const dayEnd = dayStart + dayMs;
        const hasRead = history.some(h => h.timestamp >= dayStart && h.timestamp < dayEnd);
        if (hasRead) streak++;
        else if (i > 0) break;
    }
    return streak;
}

function getWeeklyActivity(history: ReadEntry[]): number[] {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const dayMs = 86400000;
    const days: number[] = [];
    for (let i = 6; i >= 0; i--) {
        const dayStart = today.getTime() - i * dayMs;
        const dayEnd = dayStart + dayMs;
        days.push(history.filter(h => h.timestamp >= dayStart && h.timestamp < dayEnd).length);
    }
    return days;
}

function readTime(content?: string): number {
    if (!content) return 5;
    return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}

function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Component ───
export default function LibraryPage() {
    const [tab, setTab] = useState<"activity" | "saved">("activity");
    const [allArticles, setAllArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const [localState, setLocalState] = useState<VisitorState>({ read: {}, bookmarked: {} });
    const [history, setHistory] = useState<ReadEntry[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        setMounted(true);

        // Load persisted state
        const savedTab = sessionStorage.getItem("curation_library_tab") as "activity" | "saved" | null;
        const savedScroll = sessionStorage.getItem("curation_library_scroll");
        if (savedTab) setTab(savedTab);
        if (savedScroll) scrollYRef.current = parseInt(savedScroll, 10);

        // Global Cache Check
        const cached = curationCache.get("library");
        if (cached) {
            setAllArticles(cached.articles);
            setTotalCount(cached.totalCount);
            setIsLoading(false);
        }

        (async () => {
            const vs = await getVisitorState();
            const hist = await getReadHistoryAsync();
            const colls = await getCollectionsAsync();
            setLocalState(vs);
            setHistory(hist);
            setCollections(colls);
        })();

        (async () => {
            try {
                const res = await fetch("/api/curation?limit=100&sort=latest");
                if (!res.ok) throw new Error(`API ${res.status}`);
                const data = await res.json();
                if (data.articles) {
                    setAllArticles(data.articles);
                    curationCache.set("library", data.articles, data.totalCount || 0);
                }
                if (data.totalCount != null) setTotalCount(data.totalCount);
            } catch (err) { console.error("Library fetch error:", err); }
            finally { setIsLoading(false); }
        })();
    }, []);

    // Restore scroll position
    useEffect(() => {
        if (!isLoading && mounted && scrollContainerRef.current && scrollYRef.current > 0) {
            scrollContainerRef.current.scrollTop = scrollYRef.current;
        }
    }, [isLoading, mounted]);

    // ─── Actions ───
    const handleTabChange = (t: "activity" | "saved") => {
        setTab(t);
        sessionStorage.setItem("curation_library_tab", t);
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            sessionStorage.setItem("curation_library_scroll", scrollContainerRef.current.scrollTop.toString());
        }
    };

    const handleRemoveHistory = async (id: string) => {
        setHistory(prev => prev.filter(h => h.id !== id));
        await removeFromReadHistoryAsync(id);
    };

    // ─── Derived Data ───

    const readIds = useMemo(() => new Set(Object.keys(localState.read).filter(k => localState.read[k])), [localState]);
    const savedIds = useMemo(() => new Set(Object.keys(localState.bookmarked).filter(k => localState.bookmarked[k])), [localState]);

    const readArticles = useMemo(() => allArticles.filter(a => readIds.has(a.id)), [allArticles, readIds]);
    const savedArticles = useMemo(() => allArticles.filter(a => savedIds.has(a.id)), [allArticles, savedIds]);

    const streak = useMemo(() => calcStreak(history), [history]);
    const weeklyActivity = useMemo(() => getWeeklyActivity(history), [history]);
    const weeklyTotal = useMemo(() => weeklyActivity.reduce((a, b) => a + b, 0), [weeklyActivity]);

    const categoryBreakdown = useMemo(() => {
        const counts: Record<string, number> = {};
        readArticles.forEach(a => { if (a.category) counts[a.category] = (counts[a.category] || 0) + 1; });
        return Object.entries(counts).sort(([, a], [, b]) => b - a);
    }, [readArticles]);

    const totalReadingMins = useMemo(() => {
        return readArticles.reduce((sum, a) => sum + readTime(a.content), 0);
    }, [readArticles]);

    // Sort read articles by read timestamp (most recent first)
    const historyMap = useMemo(() => new Map(history.map(h => [h.id, h.timestamp])), [history]);
    const sortedReadArticles = useMemo(() => {
        return [...readArticles].sort((a, b) => (historyMap.get(b.id) || 0) - (historyMap.get(a.id) || 0));
    }, [readArticles, historyMap]);

    // Best article (highest quality score read)
    const bestArticle = useMemo(() => {
        if (!readArticles.length) return null;
        return readArticles.reduce((best, a) => (a.qualityScore || 0) > (best.qualityScore || 0) ? a : best, readArticles[0]);
    }, [readArticles]);

    // Group saved by category
    const savedByCategory = useMemo(() => {
        const grouped: Record<string, any[]> = {};
        savedArticles.forEach(a => {
            const cat = a.category || "General";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(a);
        });
        return Object.entries(grouped).sort(([, a], [, b]) => b.length - a.length);
    }, [savedArticles]);

    // ─── Renderers ───

    const ArticleRow = ({ article, i, showTime, onRemove }: { article: any; i: number; showTime?: boolean; onRemove?: (id: string) => void }) => (
        <motion.div 
            key={article.id} 
            initial={{ opacity: 0, y: 6 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.2, delay: i * 0.02 }} 
            className="group relative min-h-[72px] flex flex-col justify-center"
        >
            <Link href={`/curation/${article.id}`} className="flex items-center gap-2.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 transition-all duration-300 pr-6 group-hover:bg-zinc-50/50 dark:group-hover:bg-zinc-900/40">
                <div className="w-10 h-10 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800/80 shrink-0 relative aspect-square">
                    {article.imageUrl ? (
                        <Image 
                            src={article.imageUrl} 
                            alt="" 
                            fill 
                            sizes="40px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                            <FileText size={14} />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{formatTitle(article.title)}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter tabular-nums">{article.category || "General"}</span>
                        <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                        <span className="text-[10px] text-zinc-400 tabular-nums">{readTime(article.content)}m</span>
                        {showTime && historyMap.has(article.id) && (
                            <>
                                <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                                <span className="text-[10px] text-zinc-400 tabular-nums">{timeAgo(historyMap.get(article.id)!)}</span>
                            </>
                        )}
                        {article.qualityScore != null && article.qualityScore >= 70 && (
                            <>
                                <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                                <span className="text-[10px] text-zinc-400 flex items-center gap-0.5"><Star size={8} />{article.qualityScore}</span>
                            </>
                        )}
                    </div>
                </div>
                {!onRemove && <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-700 shrink-0 transition-transform group-hover:translate-x-0.5" />}
            </Link>
            {onRemove && (
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(article.id); }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    title="Remove from history"
                >
                    <X size={14} />
                </button>
            )}
        </motion.div>
    );

    const Skeleton = ({ n }: { n: number }) => (
        <>
            {Array(n).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2.5 min-h-[72px] border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
                    <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800/60 animate-pulse shrink-0 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-zinc-100 dark:bg-zinc-800/60 rounded animate-pulse w-3/4 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                        <div className="h-2 bg-zinc-50 dark:bg-zinc-800/40 rounded animate-pulse w-1/2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );

    const Label = ({ children }: { children: React.ReactNode }) => (
        <h2 className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2.5">{children}</h2>
    );

    if (!mounted) return (
        <div className="h-[100dvh] bg-[#fafaf8] dark:bg-[#050505] flex flex-col items-center justify-center gap-4 transition-colors duration-500">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse" />
        </div>
    );

    return (
        <div className="h-[100svh] flex flex-col bg-[#fafaf8] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors duration-500">

            {/* ═══ HEADER ═══ */}
            <header className="sticky top-0 z-50 bg-[#fafaf8]/85 dark:bg-[#050505]/85 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40">
                <div className="px-4 pt-3 pb-2.5 max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center h-2 mb-2">
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5">
                            {[
                                { key: "activity" as const, label: "Activity", icon: BarChart3 },
                                { key: "saved" as const, label: "Saved", icon: Bookmark },
                            ].map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    className={`flex-1 flex items-center justify-center gap-[5px] py-1.5 rounded-md text-[11px] font-medium transition-all ${tab === t.key ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                                >
                                    <t.icon size={11} /> {t.label}
                                    {t.key === "saved" && savedIds.size > 0 && (
                                        <span className="text-[9px] bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-1.5 py-px rounded-full">{savedIds.size}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all relative overflow-hidden shrink-0"
                        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    >
                        {/* Sun Icon */}
                        <svg
                            className={`absolute w-5 h-5 transition-all duration-[2500ms] ease-[cubic-bezier(0.4,0,0,1)] ${theme === "light"
                                ? "opacity-100 rotate-0 scale-100"
                                : "opacity-0 rotate-90 scale-0"
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
                            <path
                                strokeLinecap="round"
                                strokeWidth="1.5"
                                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                            />
                        </svg>
                        {/* Moon Icon */}
                        <svg
                            className={`absolute w-5 h-5 transition-all duration-[2500ms] ease-[cubic-bezier(0.4,0,0,1)] ${theme === "dark"
                                ? "opacity-100 rotate-0 scale-100"
                                : "opacity-0 -rotate-90 scale-0"
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                            />
                        </svg>
                    </button>
                </div>
            </header>

            {/* ═══ CONTENT ═══ */}
            <main 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto overflow-x-hidden pt-4 pb-32"
                style={{
                    WebkitOverflowScrolling: "touch",
                    overscrollBehaviorY: "none",
                    overflowAnchor: "auto",
                    scrollbarGutter: "stable",
                } as React.CSSProperties}
            >
                <div className="max-w-2xl mx-auto px-4">
                <AnimatePresence mode="wait">
                    {tab === "activity" ? (
                        <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-8">

                            {/* ── Stats Row ── */}
                            <div className="flex items-center bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 divide-x divide-zinc-200/60 dark:divide-zinc-800/60 min-h-[48px] overflow-hidden">
                                {[
                                    { label: "read", value: readIds.size },
                                    { label: "streak", value: streak },
                                    { label: "this week", value: weeklyTotal },
                                    { label: "mins read", value: totalReadingMins },
                                ].map(stat => (
                                    <div key={stat.label} className="flex-1 text-center py-1.5 px-1">
                                        <span className="text-[14px] md:text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{stat.value}</span>
                                        <span className="text-[9px] text-zinc-500 ml-1.5 inline">{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* ── Weekly Activity ── */}
                            <section>
                                <Label><Calendar size={11} className="inline mr-1 -mt-px" />Weekly Activity</Label>
                                <div className="flex items-end gap-1.5 px-1 min-h-[64px]">
                                    {weeklyActivity.map((count, i) => {
                                        const maxCount = Math.max(...weeklyActivity, 1);
                                        const heightPct = Math.max(10, (count / maxCount) * 100);
                                        const today = new Date().getDay();
                                        const dayIdx = (today - 6 + i + 7) % 7;
                                        const isToday = i === 6;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                <div className="h-4 flex items-center justify-center">
                                                    {count > 0 && (
                                                        <span className="text-[8px] text-zinc-500 tabular-nums font-medium mb-0.5">{count}</span>
                                                    )}
                                                </div>
                                                <div className="w-full flex items-end justify-center" style={{ height: "32px" }}>
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${heightPct}%` }}
                                                        transition={{ duration: 0.5, delay: i * 0.05 }}
                                                        className={`w-full rounded-[3px] transition-colors ${count > 0 ? (isToday ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-600 dark:bg-zinc-400") : "bg-zinc-200 dark:bg-zinc-800"}`}
                                                        style={{ minHeight: "4px" }}
                                                    />
                                                </div>
                                                <span className={`text-[8px] uppercase ${isToday ? "text-zinc-900 dark:text-zinc-100 font-semibold" : "text-zinc-400"}`}>{DAY_LABELS[dayIdx]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* ── Best Read ── */}
                            {bestArticle && bestArticle.qualityScore >= 50 && (
                                <section>
                                    <Label><Award size={11} className="inline mr-1 -mt-px" />Top Rated Read</Label>
                                    <Link href={`/curation/${bestArticle.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 relative aspect-square">
                                            {bestArticle.imageUrl ? <Image src={bestArticle.imageUrl} alt="" fill sizes="48px" className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center text-zinc-400"><FileText size={16} /></div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">{formatTitle(bestArticle.title)}</h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-[10px] text-zinc-500">{bestArticle.category || "General"}</span>
                                                <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                                                <span className="text-[10px] text-zinc-400 flex items-center gap-0.5"><Star size={8} /> {bestArticle.qualityScore} quality</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700 shrink-0" />
                                    </Link>
                                </section>
                            )}

                            {/* ── Category Breakdown ── */}
                            {categoryBreakdown.length > 0 && (
                                <section>
                                    <Label><Hash size={11} className="inline mr-1 -mt-px" />Reading Breakdown</Label>
                                    <div className="space-y-0">
                                        {categoryBreakdown.map(([cat, count]) => {
                                            const total = readArticles.length;
                                            const pct = Math.round((count / total) * 100);
                                            const CatIcon = CATEGORIES[cat]?.icon || BookOpen;
                                            return (
                                                <div key={cat} className="flex items-center gap-2.5 py-2 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
                                                    <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center shrink-0 text-zinc-500 dark:text-zinc-400">
                                                        <CatIcon size={13} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-[11.5px] font-medium text-zinc-900 dark:text-zinc-100">{cat}</span>
                                                            <span className="text-[10px] text-zinc-400 tabular-nums">{count} · {pct}%</span>
                                                        </div>
                                                        <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${pct}%` }}
                                                                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                                                className="h-full bg-zinc-700 dark:bg-zinc-300 rounded-full"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {/* ── Reading History ── */}
                            <section>
                                <Label><BookOpen size={11} className="inline mr-1 -mt-px" />Reading History</Label>
                                {isLoading ? <Skeleton n={5} /> : sortedReadArticles.length > 0 ? (
                                    <div>{sortedReadArticles.slice(0, 20).map((a, i) => <ArticleRow key={a.id} article={a} i={i} showTime onRemove={handleRemoveHistory} />)}</div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <BookOpen size={24} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-2" />
                                        <p className="text-[12px] text-zinc-500">No reading history yet</p>
                                        <Link href="/curation/discover" className="text-[11px] text-blue-500 hover:text-blue-600 mt-1 inline-block">Start exploring →</Link>
                                    </div>
                                )}
                            </section>

                        </motion.div>
                    ) : (
                        <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-6">
                            {activeCollection ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                                    <div className="flex items-center justify-between pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50 pt-2">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setActiveCollection(null)} className="p-1.5 -ml-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-full transition-colors active:scale-90">
                                                <ArrowLeft size={16} />
                                            </button>
                                            <h2 className="text-[16px] font-bold text-zinc-900 dark:text-zinc-100">{activeCollection.name}</h2>
                                        </div>
                                        <span className="text-[10px] text-zinc-500 font-medium">
                                            {activeCollection.articleIds.length} item
                                        </span>
                                    </div>
                                    <div className="space-y-0">
                                        {activeCollection.articleIds.length === 0 ? (
                                            <div className="py-16 text-center">
                                                <FolderCheck size={28} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
                                                <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">This collection is empty</p>
                                                <p className="text-[11px] text-zinc-500 mt-1">Save articles from the reader to add them here.</p>
                                            </div>
                                        ) : (
                                            activeCollection.articleIds.map((id, i) => {
                                                const a = allArticles.find(x => x.id === id);
                                                if (!a) return null;
                                                return <ArticleRow key={id} article={a} i={i} />;
                                            })
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Saved summary */}
                                    <div className="flex items-center bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 divide-x divide-zinc-200/60 dark:divide-zinc-800/60 min-h-[48px] overflow-hidden">
                                        <div className="flex-1 text-center py-1.5 px-1">
                                            <span className="text-[14px] md:text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{savedArticles.length}</span>
                                            <span className="text-[9px] text-zinc-500 ml-1.5 inline">saved</span>
                                        </div>
                                        <div className="flex-1 text-center py-1.5 px-1">
                                            <span className="text-[14px] md:text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{savedByCategory.length}</span>
                                            <span className="text-[9px] text-zinc-500 ml-1.5 inline">categories</span>
                                        </div>
                                        <div className="flex-1 text-center py-1.5 px-1">
                                            <span className="text-[14px] md:text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{savedArticles.reduce((s, a) => s + readTime(a.content), 0)}</span>
                                            <span className="text-[9px] text-zinc-500 ml-1.5 inline">total mins</span>
                                        </div>
                                    </div>

                                    {/* Collections Folders */}
                                    <section className="mb-8">
                                        <div className="flex items-center justify-between mb-3">
                                            <Label><FolderCheck size={11} className="inline mr-1 -mt-px" /> Collections</Label>
                                            <button onClick={() => setIsCreatingCollection(true)} className="text-[9px] text-blue-500 font-bold hover:text-blue-600 uppercase tracking-widest active:scale-95 transition-all">+ New Folder</button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {collections.map(c => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => setActiveCollection(c)}
                                                    className="flex flex-col text-left p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <FolderCheck size={16} />
                                                    </div>
                                                    <h3 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-0.5 leading-snug">{c.name}</h3>
                                                    <span className="text-[10px] text-zinc-500 font-medium">{c.articleIds.length} item</span>
                                                </button>
                                            ))}
                                            {isCreatingCollection && (
                                                <div className="flex flex-col text-left p-4 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-500/30 bg-blue-50/30 dark:bg-blue-500/5">
                                                    <input
                                                        autoFocus
                                                        value={newCollectionName}
                                                        onChange={e => setNewCollectionName(e.target.value)}
                                                        onKeyDown={async e => {
                                                            if (e.key === 'Enter' && newCollectionName.trim()) {
                                                                const newColl: Collection = {
                                                                    id: `coll_${Date.now()}`,
                                                                    name: newCollectionName.trim(),
                                                                    description: "",
                                                                    articleIds: [],
                                                                    createdAt: Date.now()
                                                                };
                                                                const updated = [newColl, ...collections];
                                                                setCollections(updated);
                                                                await saveCollectionsAsync(updated);
                                                                setNewCollectionName("");
                                                                setIsCreatingCollection(false);
                                                            } else if (e.key === 'Escape') {
                                                                setIsCreatingCollection(false);
                                                                setNewCollectionName("");
                                                            }
                                                        }}
                                                        onBlur={() => { setIsCreatingCollection(false); setNewCollectionName(""); }}
                                                        placeholder="Name..."
                                                        className="bg-transparent border-b border-blue-200 dark:border-blue-800 text-[13px] font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-blue-300/60 outline-none pb-1 w-full"
                                                    />
                                                    <span className="text-[9px] text-blue-400 font-medium mt-2">Press Enter to save</span>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                            {/* Saved articles grouped by category */}
                            {isLoading ? <Skeleton n={5} /> : savedArticles.length > 0 ? (
                                savedByCategory.map(([cat, articles]) => (
                                    <section key={cat}>
                                        <div className="flex items-center justify-between mb-2">
                                            <Label>
                                                {CATEGORIES[cat] ? React.createElement(CATEGORIES[cat].icon, { size: 11, className: "inline mr-1 -mt-px" }) : null}
                                                {cat}
                                            </Label>
                                            <span className="text-[10px] text-zinc-400 tabular-nums">{articles.length}</span>
                                        </div>
                                        <div>{articles.map((a: any, i: number) => <ArticleRow key={a.id} article={a} i={i} />)}</div>
                                    </section>
                                ))
                            ) : (
                                <div className="py-16 text-center">
                                    <Bookmark size={24} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-2" />
                                    <p className="text-[12px] text-zinc-500">No articles saved yet</p>
                                    <p className="text-[10px] text-zinc-400 mt-1">Save articles while reading to see them here</p>
                                    <Link href="/curation/discover" className="text-[11px] text-blue-500 hover:text-blue-600 mt-2 inline-block">Find articles →</Link>
                                </div>
                            )}

                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
