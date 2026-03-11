"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ArrowLeft, X, Loader2, FileText, Clock,
    ChevronRight, Flame, Hash, BookOpen, BarChart3
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Constants (emoji system matching /curation) ───

const CATEGORIES = [
    { name: "AI & Tech", emoji: "🤖" },
    { name: "Wealth & Business", emoji: "💰" },
    { name: "Philosophy & Psychology", emoji: "🧠" },
    { name: "Productivity & Deep Work", emoji: "⚡" },
    { name: "Growth & Systems", emoji: "📈" },
];

const READING_LISTS = [
    { title: "Mastering Focus", desc: "Deep work essentials", category: "Productivity & Deep Work", emoji: "⚡" },
    { title: "Naval's Anthology", desc: "Philosophy & wealth", category: "Philosophy & Psychology", emoji: "🧠" },
    { title: "Agentic Future", desc: "AI tools & agents", category: "AI & Tech", emoji: "🤖" },
    { title: "Growth Vault", desc: "Systems & self-improvement", category: "Growth & Systems", emoji: "📈" },
    { title: "Wealth Wisdom", desc: "Strategy & finance", category: "Wealth & Business", emoji: "💰" },
    { title: "Mind & Meaning", desc: "Stoicism & clarity", category: "Philosophy & Psychology", emoji: "🧠" },
];

// ─── Helpers ───

function getReadingStats() {
    try {
        const vs = JSON.parse(localStorage.getItem("curation_visitor_state") || '{"read":{},"bookmarked":{}}');
        return { readCount: Object.keys(vs.read || {}).length, bookmarkCount: Object.keys(vs.bookmarked || {}).length };
    } catch {
        return { readCount: 0, bookmarkCount: 0 };
    }
}

function getTopCategoryFromHistory(articles: any[]): string | null {
    const catCount: Record<string, number> = {};
    articles.forEach(a => { if (a.category) catCount[a.category] = (catCount[a.category] || 0) + 1; });
    let top: string | null = null, max = 0;
    for (const [cat, count] of Object.entries(catCount)) { if (count > max) { max = count; top = cat; } }
    return top;
}

function estimateReadTime(content?: string): number {
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
    const [readStats, setReadStats] = useState({ readCount: 0, bookmarkCount: 0 });

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
                const [tD, lD, aD] = await Promise.all([tR.json(), lR.json(), aR.json()]);
                const trending = tD.articles || [], latest = lD.articles || [], all = aD.articles || [];

                setTrendingArticles(trending);
                setLatestArticles(latest);
                setAllCount(all.length);

                const stats: Record<string, number> = {};
                all.forEach((a: any) => { if (a.category) stats[a.category] = (stats[a.category] || 0) + 1; });
                setCategoryStats(stats);

                // Personalized "For You"
                try {
                    const history: any[] = JSON.parse(localStorage.getItem("curation_read_history") || "[]");
                    const readIds = new Set(history.map((h: any) => h.id));
                    const readArticles = all.filter((a: any) => readIds.has(a.id));
                    const favCat = getTopCategoryFromHistory(readArticles);
                    if (favCat) {
                        const unread = all.filter((a: any) => a.category === favCat && !readIds.has(a.id));
                        setForYouArticles(unread.length >= 3 ? unread.slice(0, 4) : trending.slice(0, 4));
                    } else {
                        setForYouArticles(trending.slice(0, 4));
                    }
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

    // ─── Renderers ───

    const ArticleRow = ({ article, i, rank }: { article: any; i: number; rank?: boolean }) => (
        <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.02 }}
        >
            <Link
                href={`/curation/${article.id}`}
                className="group flex items-center gap-2.5 py-2 px-0.5 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 rounded-md transition-colors"
            >
                {rank && (
                    <span className="text-[16px] font-bold text-zinc-200 dark:text-zinc-800 w-5 text-center shrink-0 tabular-nums">{i + 1}</span>
                )}
                <div className="w-10 h-10 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800/80 shrink-0 relative">
                    {article.imageUrl ? (
                        <Image src={article.imageUrl} alt="" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400"><FileText size={14} /></div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">{article.title}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-zinc-500">{article.category || "General"}</span>
                        <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">•</span>
                        <span className="text-[10px] text-zinc-400">{estimateReadTime(article.content)}m</span>
                        {article.socialScore > 0 && (
                            <>
                                <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">•</span>
                                <span className="text-[10px] text-zinc-400">🔥 {article.socialScore}</span>
                            </>
                        )}
                    </div>
                </div>
                <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-700 shrink-0" />
            </Link>
        </motion.div>
    );

    const Skeleton = ({ n }: { n: number }) => (
        <>{Array(n).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2">
                <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-3/4" />
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-1/2" />
                </div>
            </div>
        ))}</>
    );

    const SectionHeader = ({ icon, title, right }: { icon: React.ReactNode; title: string; right?: React.ReactNode }) => (
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                {icon}{title}
            </h2>
            {right}
        </div>
    );

    if (!mounted) {
        return <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-zinc-400" size={24} /></div>;
    }

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
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search articles, topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="w-full h-9 pl-9 pr-8 bg-zinc-100 dark:bg-zinc-900 border-none rounded-lg text-[13px] outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700 transition-all placeholder:text-zinc-400"
                            />
                            {searchQuery && (
                                <button onClick={() => { setSearchQuery(""); setActiveCategory(null); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
                        <button onClick={() => setActiveSort("popularity")} className={`flex items-center gap-1 px-2.5 h-6.5 shrink-0 rounded-full text-[10.5px] font-medium transition-all ${activeSort === "popularity" ? "bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-500"}`}>
                            🔥 Popular
                        </button>
                        <button onClick={() => setActiveSort("latest")} className={`flex items-center gap-1 px-2.5 h-6.5 shrink-0 rounded-full text-[10.5px] font-medium transition-all ${activeSort === "latest" ? "bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-500"}`}>
                            🕐 Latest
                        </button>
                        <div className="w-px h-3.5 bg-zinc-200 dark:bg-zinc-800 mx-0.5 shrink-0" />
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                                className={`flex items-center gap-1 px-2.5 h-6.5 shrink-0 rounded-full text-[10.5px] font-medium transition-all whitespace-nowrap ${activeCategory === cat.name ? "bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-500"}`}
                            >
                                {cat.emoji} {cat.name.split(" & ")[0]}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* ═══ CONTENT ═══ */}
            <main className="max-w-2xl mx-auto px-4 pt-4 pb-32">
                <AnimatePresence mode="wait">
                    {isShowingSearch ? (
                        <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {activeCategory && (
                                        <button onClick={() => setActiveCategory(null)} className="text-[10px] bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-900 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                            {activeCategory} <X size={9} />
                                        </button>
                                    )}
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
                        <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-5">

                            {/* Reading Pulse */}
                            {readStats.readCount > 0 && (
                                <div className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/60 text-[11px]">
                                    <span className="text-zinc-500">📊</span>
                                    <span className="text-zinc-600 dark:text-zinc-400">{readStats.readCount} read · {readStats.bookmarkCount} saved</span>
                                    <span className="text-zinc-400 ml-auto text-[10px]">{allCount} total</span>
                                </div>
                            )}

                            {/* Picked For You */}
                            <section>
                                <SectionHeader icon={<span className="text-[11px]">✨</span>} title="Picked For You" right={<span className="text-[10px] text-zinc-400 font-normal normal-case tracking-normal">personalized</span>} />
                                {isLoading ? <Skeleton n={3} /> : <div>{forYouArticles.map((a, i) => <ArticleRow key={a.id} article={a} i={i} />)}</div>}
                            </section>

                            {/* Browse by Topic */}
                            <section>
                                <SectionHeader icon={<span className="text-[11px]">#</span>} title="Topics" />
                                <div className="grid grid-cols-2 gap-1.5">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.name}
                                            onClick={() => setActiveCategory(cat.name)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left"
                                        >
                                            <span className="text-[14px]">{cat.emoji}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11.5px] font-medium text-zinc-900 dark:text-zinc-100 truncate">{cat.name.split(" & ")[0]}</p>
                                                <p className="text-[10px] text-zinc-400">{categoryStats[cat.name] || 0}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Reading Lists */}
                            <section>
                                <SectionHeader icon={<span className="text-[11px]">📚</span>} title="Reading Lists" />
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5 -mx-1 px-1">
                                    {READING_LISTS.map(list => (
                                        <button
                                            key={list.title}
                                            onClick={() => setSearchQuery(list.category)}
                                            className="shrink-0 w-[140px] rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 text-left hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                                        >
                                            <span className="text-[16px] mb-1.5 block">{list.emoji}</span>
                                            <h3 className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5 leading-tight">{list.title}</h3>
                                            <p className="text-[9.5px] text-zinc-500 dark:text-zinc-500 line-clamp-1">{list.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Trending */}
                            <section>
                                <SectionHeader icon={<span className="text-[11px]">🔥</span>} title="Trending" right={<span className="text-[10px] text-zinc-400 font-normal normal-case tracking-normal">by popularity</span>} />
                                {isLoading ? <Skeleton n={5} /> : <div>{trendingArticles.map((a, i) => <ArticleRow key={a.id} article={a} i={i} rank />)}</div>}
                            </section>

                            {/* Latest */}
                            <section>
                                <SectionHeader icon={<span className="text-[11px]">🕐</span>} title="Latest Additions" />
                                {isLoading ? <Skeleton n={4} /> : <div>{latestArticles.map((a, i) => <ArticleRow key={a.id} article={a} i={i} />)}</div>}
                            </section>

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
