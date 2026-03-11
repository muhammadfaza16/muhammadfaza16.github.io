"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, TrendingUp, ChevronRight, Zap, Brain, Rocket, Coffee,
    ArrowLeft, X, Loader2, FileText, Clock, Sparkles, Flame,
    BookOpen, Eye, Hash, BarChart3, Star
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Constants ───

const CATEGORIES = [
    { name: "AI & Tech", icon: Brain, color: "text-sky-500" },
    { name: "Wealth & Business", icon: Rocket, color: "text-emerald-500" },
    { name: "Philosophy & Psychology", icon: Coffee, color: "text-amber-500" },
    { name: "Productivity & Deep Work", icon: Zap, color: "text-blue-500" },
    { name: "Growth & Systems", icon: TrendingUp, color: "text-purple-500" },
];

const READING_LISTS = [
    { title: "Mastering Focus", desc: "Deep work & productivity essentials", category: "Productivity & Deep Work", icon: Zap, gradient: "from-blue-600/30 to-indigo-600/10" },
    { title: "Naval's Anthology", desc: "Philosophy, happiness & wealth", category: "Philosophy & Psychology", icon: Coffee, gradient: "from-amber-600/30 to-orange-600/10" },
    { title: "Agentic Future", desc: "AI tools, agents & automation", category: "AI & Tech", icon: Brain, gradient: "from-sky-600/30 to-cyan-600/10" },
    { title: "Growth Vault", desc: "Systems thinking & self-improvement", category: "Growth & Systems", icon: TrendingUp, gradient: "from-purple-600/30 to-pink-600/10" },
    { title: "Wealth Wisdom", desc: "Business strategy & finance", category: "Wealth & Business", icon: Rocket, gradient: "from-emerald-600/30 to-green-600/10" },
    { title: "Mind & Meaning", desc: "Psychology, stoicism & self-awareness", category: "Philosophy & Psychology", icon: BookOpen, gradient: "from-rose-600/30 to-red-600/10" },
];

// ─── Helpers ───

function getReadingStats() {
    try {
        const vs = JSON.parse(localStorage.getItem("curation_visitor_state") || '{"read":{},"bookmarked":{}}');
        const history: { id: string; ts: number }[] = JSON.parse(localStorage.getItem("curation_read_history") || "[]");
        const readCount = Object.keys(vs.read || {}).length;
        const bookmarkCount = Object.keys(vs.bookmarked || {}).length;
        return { readCount, bookmarkCount, history };
    } catch {
        return { readCount: 0, bookmarkCount: 0, history: [] };
    }
}

function getTopCategory(articles: any[]): string | null {
    const catCount: Record<string, number> = {};
    articles.forEach(a => {
        if (a.category) catCount[a.category] = (catCount[a.category] || 0) + 1;
    });
    let top: string | null = null;
    let max = 0;
    for (const [cat, count] of Object.entries(catCount)) {
        if (count > max) { max = count; top = cat; }
    }
    return top;
}

function estimateReadTime(content?: string): number {
    if (!content) return 5;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}

// ─── Component ───

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [activeSort, setActiveSort] = useState<"popularity" | "latest">("popularity");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Data
    const [forYouArticles, setForYouArticles] = useState<any[]>([]);
    const [trendingArticles, setTrendingArticles] = useState<any[]>([]);
    const [latestArticles, setLatestArticles] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [allArticlesCount, setAllArticlesCount] = useState(0);
    const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

    // UI
    const [isLoading, setIsLoading] = useState(true);
    const [isSearchingApi, setIsSearchingApi] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [readStats, setReadStats] = useState({ readCount: 0, bookmarkCount: 0, history: [] as any[] });

    const searchRef = useRef<HTMLInputElement>(null);
    const isShowingSearch = searchQuery.trim().length > 0 || activeCategory !== null;

    // ─── Data Fetching ───

    useEffect(() => {
        setMounted(true);
        setReadStats(getReadingStats());

        const fetchAll = async () => {
            try {
                const [trendRes, latestRes, allRes] = await Promise.all([
                    fetch("/api/curation?limit=8&sort=popularity"),
                    fetch("/api/curation?limit=5&sort=latest"),
                    fetch("/api/curation?limit=100&sort=latest"), // for stats
                ]);

                const [trendData, latestData, allData] = await Promise.all([
                    trendRes.json(), latestRes.json(), allRes.json(),
                ]);

                const trending = trendData.articles || [];
                const latest = latestData.articles || [];
                const all = allData.articles || [];

                setTrendingArticles(trending);
                setLatestArticles(latest);
                setAllArticlesCount(all.length);

                // Build category stats from all articles
                const stats: Record<string, number> = {};
                all.forEach((a: any) => {
                    if (a.category) stats[a.category] = (stats[a.category] || 0) + 1;
                });
                setCategoryStats(stats);

                // Build "For You" based on reading history
                const { history } = getReadingStats();
                if (history.length > 0) {
                    // Find favorite category from read history
                    const readIds = new Set(history.map((h: any) => h.id));
                    const readArticles = all.filter((a: any) => readIds.has(a.id));
                    const favCat = getTopCategory(readArticles);

                    if (favCat) {
                        // Get unread articles from favorite category
                        const unread = all.filter((a: any) => a.category === favCat && !readIds.has(a.id));
                        setForYouArticles(unread.slice(0, 4));
                    } else {
                        setForYouArticles(trending.slice(0, 4));
                    }
                } else {
                    // No history = show trending as "For You"
                    setForYouArticles(trending.slice(0, 4));
                }
            } catch (err) {
                console.error("Failed to fetch explore data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, []);

    // ─── Search / Category Filter ───

    useEffect(() => {
        if (!searchQuery.trim() && !activeCategory) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearchingApi(true);
            try {
                let url = `/api/curation?limit=20&sort=${activeSort}`;
                if (searchQuery.trim()) url += `&q=${encodeURIComponent(searchQuery)}`;
                if (activeCategory) url += `&category=${encodeURIComponent(activeCategory)}`;

                const res = await fetch(url);
                const data = await res.json();
                if (data.articles) setSearchResults(data.articles);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsSearchingApi(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [searchQuery, activeCategory, activeSort]);

    // ─── Render Helpers ───

    const renderArticleRow = (article: any, i: number, showRank = false) => (
        <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
        >
            <Link
                href={`/curation/${article.id}`}
                className="group flex items-center gap-3 py-2.5 px-1 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 -mx-1 rounded-lg transition-colors"
            >
                {showRank && (
                    <span className="text-[18px] font-bold text-zinc-200 dark:text-zinc-800 w-6 text-center shrink-0 tabular-nums">
                        {i + 1}
                    </span>
                )}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 relative">
                    {article.imageUrl ? (
                        <Image src={article.imageUrl} alt="" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                            <FileText size={16} />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                        {article.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-500">
                            {article.category || "General"}
                        </span>
                        <span className="text-zinc-300 dark:text-zinc-700 text-[8px]">•</span>
                        <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                            <Clock size={9} /> {estimateReadTime(article.content)} min
                        </span>
                        {article.socialScore > 0 && (
                            <>
                                <span className="text-zinc-300 dark:text-zinc-700 text-[8px]">•</span>
                                <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                                    <Flame size={9} /> {article.socialScore}
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700 shrink-0 group-hover:text-zinc-500 transition-colors" />
            </Link>
        </motion.div>
    );

    const renderSkeleton = (count: number) => (
        Array(count).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 px-1">
                <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-3/4" />
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-1/2" />
                </div>
            </div>
        ))
    );

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] flex items-center justify-center">
                <Loader2 className="animate-spin text-zinc-400" size={24} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100">

            {/* ═══ STICKY HEADER ═══ */}
            <header className="sticky top-0 z-50 bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40">
                <div className="px-4 pt-4 pb-3 max-w-2xl mx-auto">
                    {/* Search Row */}
                    <div className="flex items-center gap-3">
                        <Link href="/curation" className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all shrink-0">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="relative flex-1">
                            <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`} />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search articles, topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="w-full h-10 pl-10 pr-8 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-700 transition-all placeholder:text-zinc-400"
                            />
                            {searchQuery && (
                                <button onClick={() => { setSearchQuery(""); setActiveCategory(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sort + Category Pills */}
                    <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar pb-0.5">
                        {/* Sort Pills */}
                        <button
                            onClick={() => setActiveSort("popularity")}
                            className={`flex items-center gap-1 px-3 h-7 shrink-0 rounded-full text-[11px] font-medium transition-all ${activeSort === "popularity" ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
                        >
                            <Flame size={11} /> Popular
                        </button>
                        <button
                            onClick={() => setActiveSort("latest")}
                            className={`flex items-center gap-1 px-3 h-7 shrink-0 rounded-full text-[11px] font-medium transition-all ${activeSort === "latest" ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
                        >
                            <Clock size={11} /> Latest
                        </button>

                        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-0.5 shrink-0" />

                        {/* Category Pills */}
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                                className={`flex items-center gap-1 px-3 h-7 shrink-0 rounded-full text-[11px] font-medium transition-all ${activeCategory === cat.name ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* ═══ MAIN CONTENT ═══ */}
            <main className="max-w-2xl mx-auto px-4 pt-5 pb-32">

                <AnimatePresence mode="wait">
                    {isShowingSearch ? (
                        /* ═══ SEARCH / FILTER RESULTS ═══ */
                        <motion.div
                            key="search"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-3 px-1">
                                <div className="flex items-center gap-2">
                                    {activeCategory && (
                                        <button
                                            onClick={() => setActiveCategory(null)}
                                            className="text-[11px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2.5 py-1 rounded-full font-medium flex items-center gap-1"
                                        >
                                            {activeCategory} <X size={10} />
                                        </button>
                                    )}
                                    <span className="text-[12px] text-zinc-500">
                                        {isSearchingApi ? "Searching..." : `${searchResults.length} results`}
                                    </span>
                                </div>
                                <button onClick={() => { setSearchQuery(""); setActiveCategory(null); }} className="text-[11px] text-blue-500 hover:text-blue-600">
                                    Clear
                                </button>
                            </div>

                            {isSearchingApi ? renderSkeleton(5) : (
                                searchResults.length > 0 ? (
                                    <div>{searchResults.map((a, i) => renderArticleRow(a, i))}</div>
                                ) : (
                                    <div className="py-20 text-center">
                                        <Search size={28} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
                                        <p className="text-[13px] text-zinc-500">No articles found</p>
                                    </div>
                                )
                            )}
                        </motion.div>
                    ) : (
                        /* ═══ DISCOVER HOME ═══ */
                        <motion.div
                            key="discover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-7"
                        >
                            {/* ── Your Reading Pulse ── */}
                            {readStats.readCount > 0 && (
                                <section className="flex items-center gap-3 p-3 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/60">
                                    <div className="w-9 h-9 rounded-full bg-yellow-500/10 dark:bg-yellow-500/20 flex items-center justify-center shrink-0">
                                        <BarChart3 size={16} className="text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100">
                                            {readStats.readCount} articles read · {readStats.bookmarkCount} bookmarked
                                        </p>
                                        <p className="text-[10px] text-zinc-500 mt-0.5">
                                            Keep exploring to refine your recommendations
                                        </p>
                                    </div>
                                </section>
                            )}

                            {/* ── Picked For You ── */}
                            <section>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <h2 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-yellow-500" />
                                        Picked For You
                                    </h2>
                                    <span className="text-[10px] text-zinc-400">Based on your reads</span>
                                </div>
                                {isLoading ? renderSkeleton(3) : (
                                    <div>{forYouArticles.map((a, i) => renderArticleRow(a, i))}</div>
                                )}
                            </section>

                            {/* ── Browse by Topic ── */}
                            <section>
                                <h2 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 mb-3 px-1 flex items-center gap-1.5">
                                    <Hash size={14} className="text-zinc-400" />
                                    Browse by Topic
                                </h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {CATEGORIES.map(cat => {
                                        const count = categoryStats[cat.name] || 0;
                                        const CatIcon = cat.icon;
                                        return (
                                            <button
                                                key={cat.name}
                                                onClick={() => setActiveCategory(cat.name)}
                                                className="group flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left"
                                            >
                                                <div className={`w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 ${cat.color}`}>
                                                    <CatIcon size={15} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{cat.name.split(" & ")[0]}</p>
                                                    <p className="text-[10px] text-zinc-400">{count} articles</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* ── Reading Lists ── */}
                            <section>
                                <h2 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 mb-3 px-1 flex items-center gap-1.5">
                                    <BookOpen size={14} className="text-zinc-400" />
                                    Reading Lists
                                </h2>
                                <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
                                    {READING_LISTS.map(list => {
                                        const ListIcon = list.icon;
                                        return (
                                            <button
                                                key={list.title}
                                                onClick={() => setSearchQuery(list.category)}
                                                className="group shrink-0 w-[160px] relative overflow-hidden rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-3.5 text-left hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br ${list.gradient} opacity-60`} />
                                                <div className="relative z-10">
                                                    <div className="w-7 h-7 rounded-lg bg-white/80 dark:bg-zinc-800/80 flex items-center justify-center mb-3 text-zinc-600 dark:text-zinc-300">
                                                        <ListIcon size={14} />
                                                    </div>
                                                    <h3 className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5 leading-tight">{list.title}</h3>
                                                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">{list.desc}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* ── Trending Now ── */}
                            <section>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <h2 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                        <Flame size={14} className="text-orange-500" />
                                        Trending Now
                                    </h2>
                                    <span className="text-[10px] text-zinc-400">{allArticlesCount} total articles</span>
                                </div>
                                {isLoading ? renderSkeleton(5) : (
                                    <div>{trendingArticles.map((a, i) => renderArticleRow(a, i, true))}</div>
                                )}
                            </section>

                            {/* ── Latest Additions ── */}
                            <section>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <h2 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                        <Clock size={14} className="text-zinc-400" />
                                        Latest Additions
                                    </h2>
                                </div>
                                {isLoading ? renderSkeleton(4) : (
                                    <div>{latestArticles.map((a, i) => renderArticleRow(a, i))}</div>
                                )}
                            </section>

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
