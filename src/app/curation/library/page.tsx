"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bookmark, BookOpen, ChevronRight, Clock, FileText,
    Flame, Hash, Loader2, ArrowLeft, TrendingUp,
    Brain, Rocket, Coffee, Zap, Eye, BarChart3, Calendar,
    Star, Award
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Types ───

type ReadEntry = { id: string; ts: number };
type VisitorState = { read: Record<string, boolean>; bookmarked: Record<string, boolean> };

const CATEGORIES: Record<string, { icon: React.ComponentType<any> }> = {
    "AI & Tech": { icon: Brain },
    "Wealth & Business": { icon: Rocket },
    "Philosophy & Psychology": { icon: Coffee },
    "Productivity & Deep Work": { icon: Zap },
    "Growth & Systems": { icon: TrendingUp },
};

// ─── Helpers ───

function getLocalState(): VisitorState {
    try { return JSON.parse(localStorage.getItem("curation_visitor_state") || '{"read":{},"bookmarked":{}}'); }
    catch { return { read: {}, bookmarked: {} }; }
}

function getReadHistory(): ReadEntry[] {
    try { return JSON.parse(localStorage.getItem("curation_read_history") || "[]"); }
    catch { return []; }
}

function calcStreak(history: ReadEntry[]): number {
    if (!history.length) return 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const dayMs = 86400000;
    let streak = 0;
    for (let i = 0; i < 365; i++) {
        const dayStart = today.getTime() - i * dayMs;
        const dayEnd = dayStart + dayMs;
        const hasRead = history.some(h => h.ts >= dayStart && h.ts < dayEnd);
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
        days.push(history.filter(h => h.ts >= dayStart && h.ts < dayEnd).length);
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

    const [localState, setLocalState] = useState<VisitorState>({ read: {}, bookmarked: {} });
    const [history, setHistory] = useState<ReadEntry[]>([]);

    useEffect(() => {
        setMounted(true);
        const vs = getLocalState();
        const hist = getReadHistory();
        setLocalState(vs);
        setHistory(hist);

        (async () => {
            try {
                const res = await fetch("/api/curation?limit=999&sort=latest");
                const data = await res.json();
                if (data.articles) setAllArticles(data.articles);
            } catch (err) { console.error("Library fetch error:", err); }
            finally { setIsLoading(false); }
        })();
    }, []);

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
    const historyMap = useMemo(() => new Map(history.map(h => [h.id, h.ts])), [history]);
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

    const ArticleRow = ({ article, i, showTime }: { article: any; i: number; showTime?: boolean }) => (
        <motion.div key={article.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.02 }}>
            <Link href={`/curation/${article.id}`} className="group flex items-center gap-2.5 py-2 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 transition-colors">
                <div className="w-10 h-10 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800/80 shrink-0 relative">
                    {article.imageUrl ? <Image src={article.imageUrl} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-400"><FileText size={14} /></div>}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">{article.title}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-zinc-500">{article.category || "General"}</span>
                        <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                        <span className="text-[10px] text-zinc-400">{readTime(article.content)}m</span>
                        {showTime && historyMap.has(article.id) && (
                            <>
                                <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                                <span className="text-[10px] text-zinc-400">{timeAgo(historyMap.get(article.id)!)}</span>
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
                <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-700 shrink-0" />
            </Link>
        </motion.div>
    );

    const Skeleton = ({ n }: { n: number }) => (<>{Array(n).fill(0).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5 py-2">
            <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5"><div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-3/4" /><div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-1/2" /></div>
        </div>
    ))}</>);

    const Label = ({ children }: { children: React.ReactNode }) => (
        <h2 className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2.5">{children}</h2>
    );

    if (!mounted) return <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-zinc-400" size={24} /></div>;

    return (
        <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100">

            {/* ═══ HEADER ═══ */}
            <header className="sticky top-0 z-50 bg-[#fafaf8]/85 dark:bg-[#050505]/85 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40">
                <div className="px-4 pt-3 pb-2.5 max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-3">
                        <Link href="/curation" className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all shrink-0">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-[16px] font-semibold">Library</h1>
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
            </header>

            {/* ═══ CONTENT ═══ */}
            <main className="max-w-2xl mx-auto px-4 pt-4 pb-32">
                <AnimatePresence mode="wait">
                    {tab === "activity" ? (
                        <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-8">

                            {/* ── Stats Row ── */}
                            <div className="flex items-center bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 divide-x divide-zinc-200/60 dark:divide-zinc-800/60">
                                {[
                                    { label: "articles", value: readIds.size },
                                    { label: "day streak", value: streak },
                                    { label: "this week", value: weeklyTotal },
                                    { label: "min read", value: totalReadingMins },
                                ].map(stat => (
                                    <div key={stat.label} className="flex-1 text-center py-0.5">
                                        <span className="text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{stat.value}</span>
                                        <span className="text-[9px] text-zinc-500 ml-1.5">{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* ── Weekly Activity ── */}
                            <section>
                                <Label><Calendar size={11} className="inline mr-1 -mt-px" />This Week</Label>
                                <div className="flex items-end gap-1.5 px-1">
                                    {weeklyActivity.map((count, i) => {
                                        const maxCount = Math.max(...weeklyActivity, 1);
                                        const heightPct = Math.max(10, (count / maxCount) * 100);
                                        const today = new Date().getDay();
                                        const dayIdx = (today - 6 + i + 7) % 7;
                                        const isToday = i === 6;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                {count > 0 && (
                                                    <span className="text-[8px] text-zinc-500 tabular-nums font-medium">{count}</span>
                                                )}
                                                <div className="w-full flex items-end justify-center" style={{ height: "32px" }}>
                                                    <div
                                                        className={`w-full rounded-[3px] transition-all ${count > 0 ? (isToday ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-600 dark:bg-zinc-400") : "bg-zinc-200 dark:bg-zinc-800"}`}
                                                        style={{ height: `${heightPct}%`, minHeight: "4px" }}
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
                                    <Label><Award size={11} className="inline mr-1 -mt-px" />Highest Rated Read</Label>
                                    <Link href={`/curation/${bestArticle.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 relative">
                                            {bestArticle.imageUrl ? <Image src={bestArticle.imageUrl} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-400"><FileText size={16} /></div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">{bestArticle.title}</h3>
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
                                    <div>{sortedReadArticles.slice(0, 20).map((a, i) => <ArticleRow key={a.id} article={a} i={i} showTime />)}</div>
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

                            {/* Saved summary */}
                            <div className="flex items-center bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 divide-x divide-zinc-200/60 dark:divide-zinc-800/60">
                                <div className="flex-1 text-center py-0.5">
                                    <span className="text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{savedArticles.length}</span>
                                    <span className="text-[9px] text-zinc-500 ml-1.5">saved</span>
                                </div>
                                <div className="flex-1 text-center py-0.5">
                                    <span className="text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{savedByCategory.length}</span>
                                    <span className="text-[9px] text-zinc-500 ml-1.5">categories</span>
                                </div>
                                <div className="flex-1 text-center py-0.5">
                                    <span className="text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{savedArticles.reduce((s, a) => s + readTime(a.content), 0)}</span>
                                    <span className="text-[9px] text-zinc-500 ml-1.5">min total</span>
                                </div>
                            </div>

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
                                    <p className="text-[12px] text-zinc-500">No saved articles yet</p>
                                    <p className="text-[10px] text-zinc-400 mt-1">Bookmark articles while reading to save them here</p>
                                    <Link href="/curation/discover" className="text-[11px] text-blue-500 hover:text-blue-600 mt-2 inline-block">Discover articles →</Link>
                                </div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
