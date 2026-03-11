"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ArrowLeft, X, Loader2, FileText, Clock,
    ChevronRight, Flame, BookOpen, Hash,
    Brain, Rocket, Coffee, Zap, TrendingUp, Sparkles,
    Star, CheckCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Constants ───

const CATEGORIES = [
    { name: "AI & Tech", icon: Brain },
    { name: "Wealth & Business", icon: Rocket },
    { name: "Philosophy & Psychology", icon: Coffee },
    { name: "Productivity & Deep Work", icon: Zap },
    { name: "Growth & Systems", icon: TrendingUp },
];

const READING_LISTS = [
    { title: "Mastering Focus", desc: "Deep work essentials", category: "Productivity & Deep Work", icon: Zap },
    { title: "Naval's Anthology", desc: "Philosophy & wealth", category: "Philosophy & Psychology", icon: Coffee },
    { title: "Agentic Future", desc: "AI tools & agents", category: "AI & Tech", icon: Brain },
    { title: "Growth Vault", desc: "Systems thinking", category: "Growth & Systems", icon: TrendingUp },
    { title: "Wealth Wisdom", desc: "Strategy & finance", category: "Wealth & Business", icon: Rocket },
    { title: "Mind & Meaning", desc: "Stoicism & clarity", category: "Philosophy & Psychology", icon: BookOpen },
];

// ─── Helpers ───

function getReadingStats() {
    try {
        const vs = JSON.parse(localStorage.getItem("curation_visitor_state") || '{"read":{},"bookmarked":{}}');
        const readIds = new Set(Object.keys(vs.read || {}).filter((k: string) => vs.read[k]));
        const savedIds = new Set(Object.keys(vs.bookmarked || {}).filter((k: string) => vs.bookmarked[k]));
        return { readCount: readIds.size, bookmarkCount: savedIds.size, readIds, savedIds };
    } catch { return { readCount: 0, bookmarkCount: 0, readIds: new Set<string>(), savedIds: new Set<string>() }; }
}

function getTopCategoryFromHistory(articles: any[]): string | null {
    const c: Record<string, number> = {};
    articles.forEach(a => { if (a.category) c[a.category] = (c[a.category] || 0) + 1; });
    let top: string | null = null, max = 0;
    for (const [k, v] of Object.entries(c)) { if (v > max) { max = v; top = k; } }
    return top;
}

function readTime(content?: string): number {
    if (!content) return 5;
    return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}

// ─── Component ───

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [activeSort, setActiveSort] = useState<"popularity" | "latest">("popularity");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const [forYouArticles, setForYouArticles] = useState<any[]>([]);
    const [trendingArticles, setTrendingArticles] = useState<any[]>([]);
    const [latestArticles, setLatestArticles] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [allCount, setAllCount] = useState(0);
    const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [isSearchingApi, setIsSearchingApi] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [readStats, setReadStats] = useState<{ readCount: number; bookmarkCount: number; readIds: Set<string>; savedIds: Set<string> }>({ readCount: 0, bookmarkCount: 0, readIds: new Set(), savedIds: new Set() });

    const searchRef = useRef<HTMLInputElement>(null);
    const isShowingSearch = searchQuery.trim().length > 0 || activeCategory !== null;

    // ─── Fetch ───

    useEffect(() => {
        setMounted(true);
        setReadStats(getReadingStats());
        (async () => {
            try {
                const [tR, lR, aR] = await Promise.all([
                    fetch("/api/curation?limit=8&sort=popularity"),
                    fetch("/api/curation?limit=5&sort=latest"),
                    fetch("/api/curation?limit=100&sort=latest"),
                ]);
                const tD = tR.ok ? await tR.json() : { articles: [] };
                const lD = lR.ok ? await lR.json() : { articles: [] };
                const aD = aR.ok ? await aR.json() : { articles: [] };
                const trending = tD.articles || [], latest = lD.articles || [], all = aD.articles || [];
                setTrendingArticles(trending);
                setLatestArticles(latest);
                setAllCount(aD.totalCount || all.length);
                const stats: Record<string, number> = {};
                all.forEach((a: any) => { if (a.category) stats[a.category] = (stats[a.category] || 0) + 1; });
                setCategoryStats(stats);
                try {
                    const history: any[] = JSON.parse(localStorage.getItem("curation_read_history") || "[]");
                    const readIds = new Set(history.map((h: any) => h.id));
                    const readArticles = all.filter((a: any) => readIds.has(a.id));
                    const favCat = getTopCategoryFromHistory(readArticles);
                    if (favCat) {
                        const unread = all.filter((a: any) => a.category === favCat && !readIds.has(a.id));
                        setForYouArticles(unread.length >= 3 ? unread.slice(0, 4) : trending.slice(0, 4));
                    } else { setForYouArticles(trending.slice(0, 4)); }
                } catch { setForYouArticles(trending.slice(0, 4)); }
            } catch (err) { console.error("Explore fetch error:", err); }
            finally { setIsLoading(false); }
        })();
    }, []);

    // ─── Search ───

    useEffect(() => {
        if (!searchQuery.trim() && !activeCategory) { setSearchResults([]); return; }
        const t = setTimeout(async () => {
            setIsSearchingApi(true);
            try {
                let url = `/api/curation?limit=20&sort=${activeSort}`;
                if (searchQuery.trim()) url += `&q=${encodeURIComponent(searchQuery)}`;
                if (activeCategory) url += `&category=${encodeURIComponent(activeCategory)}`;
                const data = await (await fetch(url)).json();
                if (data.articles) setSearchResults(data.articles);
            } catch { } finally { setIsSearchingApi(false); }
        }, 250);
        return () => clearTimeout(t);
    }, [searchQuery, activeCategory, activeSort]);

    // Completion percentage
    const completionPct = useMemo(() => {
        if (!allCount) return 0;
        return Math.round((readStats.readCount / allCount) * 100);
    }, [readStats.readCount, allCount]);

    // ─── Renderers ───

    const ArticleRow = ({ article, i, rank }: { article: any; i: number; rank?: boolean }) => {
        const isRead = readStats.readIds.has(article.id);
        const isSaved = readStats.savedIds.has(article.id);
        return (
            <motion.div key={article.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.02 }}>
                <Link href={`/curation/${article.id}`} className={`group flex items-center gap-2.5 py-2 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 transition-colors ${isRead ? "opacity-60" : ""}`}>
                    {rank && <span className="text-[15px] font-bold text-zinc-200 dark:text-zinc-800 w-5 text-center shrink-0 tabular-nums">{i + 1}</span>}
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800/80 shrink-0 relative">
                        {article.imageUrl ? <Image src={article.imageUrl} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-400"><FileText size={14} /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">{article.title}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-zinc-500">{article.category || "General"}</span>
                            <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                            <span className="text-[10px] text-zinc-400">{readTime(article.content)}m</span>
                            {article.qualityScore != null && article.qualityScore >= 70 && (
                                <>
                                    <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                                    <span className="text-[10px] text-zinc-400 flex items-center gap-0.5"><Star size={8} />{article.qualityScore}</span>
                                </>
                            )}
                            {isRead && (
                                <>
                                    <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                                    <span className="text-[10px] text-zinc-400 flex items-center gap-0.5"><CheckCheck size={9} />read</span>
                                </>
                            )}
                        </div>
                    </div>
                    <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-700 shrink-0" />
                </Link>
            </motion.div>
        );
    };

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
                    <div className="flex items-center gap-3">
                        <Link href="/curation" className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all shrink-0">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="relative flex-1">
                            <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? "text-zinc-600 dark:text-zinc-300" : "text-zinc-400"}`} />
                            <input ref={searchRef} type="text" placeholder="Search articles, topics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} className="w-full h-9 pl-9 pr-8 bg-zinc-100 dark:bg-zinc-900 border-none rounded-lg text-[13px] outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700 transition-all placeholder:text-zinc-400" />
                            {searchQuery && <button onClick={() => { setSearchQuery(""); setActiveCategory(null); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"><X size={13} /></button>}
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-4 overflow-x-auto no-scrollbar">
                        {[{ key: "popularity" as const, label: "Popular", Icon: Flame }, { key: "latest" as const, label: "Latest", Icon: Clock }].map(s => (
                            <button key={s.key} onClick={() => setActiveSort(s.key)} className={`flex items-center gap-1 px-2.5 py-1 shrink-0 rounded-full text-[10.5px] font-medium transition-all ${activeSort === s.key ? "bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500"}`}>
                                <s.Icon size={10} /> {s.label}
                            </button>
                        ))}
                        <div className="w-px h-3.5 bg-zinc-200 dark:bg-zinc-800 mx-0.5 shrink-0" />
                        {CATEGORIES.map(cat => (
                            <button key={cat.name} onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)} className={`flex items-center gap-1 px-2.5 py-1 shrink-0 rounded-full text-[10.5px] font-medium transition-all whitespace-nowrap ${activeCategory === cat.name ? "bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500"}`}>
                                <cat.icon size={10} /> {cat.name.split(" & ")[0]}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* ═══ CONTENT ═══ */}
            <main className="max-w-2xl mx-auto px-4 pt-6 pb-32">
                <AnimatePresence mode="wait">
                    {isShowingSearch ? (
                        <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {activeCategory && <button onClick={() => setActiveCategory(null)} className="text-[10px] bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-900 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">{activeCategory} <X size={9} /></button>}
                                    <span className="text-[11px] text-zinc-400">{isSearchingApi ? "Searching..." : `${searchResults.length} results`}</span>
                                </div>
                                <button onClick={() => { setSearchQuery(""); setActiveCategory(null); }} className="text-[10px] text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">Clear</button>
                            </div>
                            {isSearchingApi ? <Skeleton n={5} /> : searchResults.length > 0 ? (
                                <div>{searchResults.map((a, i) => <ArticleRow key={a.id} article={a} i={i} />)}</div>
                            ) : (
                                <div className="py-16 text-center"><Search size={24} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-2" /><p className="text-[12px] text-zinc-500">No articles found</p></div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-8">

                            {/* Reading Pulse — stats row style */}
                            <div className="flex items-center bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 divide-x divide-zinc-200/60 dark:divide-zinc-800/60">
                                <div className="flex-1 text-center py-0.5">
                                    <span className="text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{allCount}</span>
                                    <span className="text-[9px] text-zinc-500 ml-1.5">articles</span>
                                </div>
                                <div className="flex-1 text-center py-0.5">
                                    <span className="text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{readStats.readCount}</span>
                                    <span className="text-[9px] text-zinc-500 ml-1.5">read</span>
                                </div>
                                <div className="flex-1 text-center py-0.5">
                                    <span className="text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{readStats.bookmarkCount}</span>
                                    <span className="text-[9px] text-zinc-500 ml-1.5">saved</span>
                                </div>
                                <div className="flex-1 text-center py-0.5">
                                    <span className="text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{completionPct}%</span>
                                    <span className="text-[9px] text-zinc-500 ml-1.5">done</span>
                                </div>
                            </div>

                            {/* Picked For You */}
                            <section>
                                <div className="flex items-center justify-between mb-2">
                                    <Label><Sparkles size={11} className="inline mr-1 -mt-px" />Picked For You</Label>
                                    <span className="text-[10px] text-zinc-400">personalized</span>
                                </div>
                                {isLoading ? <Skeleton n={3} /> : <div>{forYouArticles.map((a, i) => <ArticleRow key={a.id} article={a} i={i} />)}</div>}
                            </section>

                            {/* Latest */}
                            <section>
                                <div className="flex items-center justify-between mb-2">
                                    <Label><Clock size={11} className="inline mr-1 -mt-px" />Newly Added</Label>
                                    <span className="text-[10px] text-zinc-400">recent</span>
                                </div>
                                {isLoading ? <Skeleton n={4} /> : <div>{latestArticles.map((a, i) => <ArticleRow key={a.id} article={a} i={i} />)}</div>}
                            </section>

                            {/* Trending */}
                            <section>
                                <div className="flex items-center justify-between mb-2">
                                    <Label><Flame size={11} className="inline mr-1 -mt-px" />Trending</Label>
                                    <span className="text-[10px] text-zinc-400">by popularity</span>
                                </div>
                                {isLoading ? <Skeleton n={5} /> : <div>{trendingArticles.map((a, i) => <ArticleRow key={a.id} article={a} i={i} rank />)}</div>}
                            </section>

                            {/* Topics — compact inline rows */}
                            <section>
                                <Label><Hash size={11} className="inline mr-1 -mt-px" />Topics</Label>
                                <div className="space-y-0">
                                    {CATEGORIES.map(cat => {
                                        const count = categoryStats[cat.name] || 0;
                                        return (
                                            <button
                                                key={cat.name}
                                                onClick={() => setActiveCategory(cat.name)}
                                                className="w-full flex items-center gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors text-left"
                                            >
                                                <div className="w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center shrink-0 text-zinc-500 dark:text-zinc-400">
                                                    <cat.icon size={15} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100">{cat.name}</p>
                                                </div>
                                                <span className="text-[10.5px] text-zinc-400 tabular-nums shrink-0">{count} articles</span>
                                                <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-700 shrink-0" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Reading Lists — compact horizontal scroll */}
                            <section>
                                <Label><BookOpen size={11} className="inline mr-1 -mt-px" />Reading Lists</Label>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5 -mx-1 px-1">
                                    {READING_LISTS.map(list => (
                                        <button
                                            key={list.title}
                                            onClick={() => setSearchQuery(list.category)}
                                            className="shrink-0 w-[130px] rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 text-left hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                                        >
                                            <div className="w-6 h-6 rounded bg-zinc-200/60 dark:bg-zinc-800 flex items-center justify-center mb-2 text-zinc-500 dark:text-zinc-400">
                                                <list.icon size={12} />
                                            </div>
                                            <h3 className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5 leading-tight">{list.title}</h3>
                                            <p className="text-[9.5px] text-zinc-500 line-clamp-1">{list.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </section>

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
