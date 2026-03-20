"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ArrowLeft, X, FileText, Clock,
    ChevronRight, Flame, BookOpen, Hash, Bookmark,
    Brain, Rocket, Coffee, Zap, TrendingUp, Sparkles,
    Star, CheckCheck, Heart, Repeat, MessageCircle, Info,
    Sun, Moon, Menu
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getVisitorState, getReadHistoryAsync } from "@/lib/storage";
import { formatTitle, formatMetric } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useTheme } from "@/components/ThemeProvider";

// ─── Constants ───

const TOPIC_INSIGHTS: Record<string, string> = {
    "AI & Tech": "Eksplorasi pergeseran fundamental dari era 'Software as a Service' menuju kebangkitan AI Agents. Di sini gue kurasi blueprint teknis dan strategis: cara membangun autonomous systems, optimasi model bahasa untuk business logic, hingga framework adaptasi skill untuk navigasi di tengah akselerasi teknologi yang tak terelakkan.",
    "Wealth & Business": "Kumpulan strategi membangun asymmetric scale, memahami leverage, dan navigasi dunia startup/SaaS. Fokus pada capital allocation dan mindset membangun wealth jangka panjang.",
    "Philosophy & Psychology": "Framework mental untuk kejernihan berpikir. Dari Stoicisme sampe psikologi perilaku, artikel di sini ngebantu lo 'rewire' perspektif dalam menghadapi chaos di kehidupan modern.",
    "Productivity & Deep Work": "Sistem praktis untuk kerja elite. Bukan sekadar tips manajemen waktu, tapi metode deep work, optimasi energi, dan cara membangun habit yang sustain secara jangka panjang.",
    "Growth & Systems": "Panduan skalasi audience dan compounding systems. Pelajari teknik marketing modern, SEO, conversion funnel, sampe sistem akuisisi yang bisa jalan secara autopilot."
};

const CATEGORIES = [
    { name: "AI & Tech", icon: Brain },
    { name: "Wealth & Business", icon: Rocket },
    { name: "Philosophy & Psychology", icon: Coffee },
    { name: "Productivity & Deep Work", icon: Zap },
    { name: "Growth & Systems", icon: TrendingUp },
];

const READING_LISTS = [
    { title: "Mastering Focus", desc: "The essence of deep work", category: "Productivity & Deep Work", icon: Zap },
    { title: "Naval Anthology", desc: "Wealth & philosophy", category: "Philosophy & Psychology", icon: Coffee },
    { title: "Future of Agents", desc: "AI tools & agents", category: "AI & Tech", icon: Brain },
    { title: "Growth Vault", desc: "Systems thinking", category: "Growth & Systems", icon: TrendingUp },
    { title: "Wealth Wisdom", desc: "Strategy & finance", category: "Wealth & Business", icon: Rocket },
    { title: "Mind & Meaning", desc: "Stoicism & clarity", category: "Philosophy & Psychology", icon: BookOpen },
];

// ─── Helpers ───

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
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                <div className="w-24 h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
            </div>
        }>
            <ExploreContent />
        </Suspense>
    );
}

function ExploreContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category");

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [activeSort, setActiveSort] = useState<"popularity" | "date">("popularity");
    const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);

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
    const resultsRef = useRef<HTMLDivElement>(null);
    const isShowingSearch = searchQuery.trim().length > 0 || activeCategory !== null;

    const { theme, setTheme } = useTheme();
    const [isAtlasMenuOpen, setIsAtlasMenuOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const VERTICALS = [
        { key: "books", label: "Books", href: "/curation/books" },
        { key: "skills", label: "Skills Lab", href: "/curation/skills" },
        { key: "frameworks", label: "Frameworks", href: "/curation/frameworks" },
        { key: "codex", label: "Codex", href: "/curation/codex" },
        { key: "collections", label: "Collections", href: "/curation/collections" },
        { key: "highlights", label: "Highlights", href: "/curation/highlights" },
    ];

    // ─── Fetch ───

    useEffect(() => {
        setMounted(true);
        (async () => {
            try {
                const vs = await getVisitorState();
                const readIds = new Set(Object.keys(vs.read || {}).filter(k => vs.read[k]));
                const savedIds = new Set(Object.keys(vs.bookmarked || {}).filter(k => vs.bookmarked[k]));
                setReadStats({ readCount: readIds.size, bookmarkCount: savedIds.size, readIds, savedIds });

                const [tR, lR, aR] = await Promise.all([
                    fetch("/api/curation?limit=8&sortBy=popularity"),
                    fetch("/api/curation?limit=5&sortBy=date"),
                    fetch("/api/curation?limit=100&sortBy=date"),
                ]);
                const tD = tR.ok ? await tR.json() : { articles: [] };
                const lD = lR.ok ? await lR.json() : { articles: [] };
                const aD = aR.ok ? await aR.json() : { articles: [] };
                
                if (!tR.ok || !lR.ok || !aR.ok) {
                    const tText = !tR.ok ? await tR.text() : "";
                    const lText = !lR.ok ? await lR.text() : "";
                    const aText = !aR.ok ? await aR.text() : "";
                    console.error("Initial fetch failed:", { 
                        trending: { status: tR.status, error: tText.slice(0, 100) }, 
                        latest: { status: lR.status, error: lText.slice(0, 100) }, 
                        all: { status: aR.status, error: aText.slice(0, 100) } 
                    });
                }
                const trending = tD.articles || [], latest = lD.articles || [], all = aD.articles || [];
                setTrendingArticles(trending);
                setLatestArticles(latest);
                setAllCount(aD.totalCount || all.length);
                const stats: Record<string, number> = {};
                all.forEach((a: any) => { if (a.category) stats[a.category] = (stats[a.category] || 0) + 1; });
                setCategoryStats(stats);
                
                try {
                    const history = await getReadHistoryAsync();
                    const readHistIds = new Set(history.map(h => h.id));
                    const readArticles = all.filter((a: any) => readHistIds.has(a.id));
                    const favCat = getTopCategoryFromHistory(readArticles);
                    if (favCat) {
                        const unread = all.filter((a: any) => a.category === favCat && !readHistIds.has(a.id));
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

        // Scroll to results when search/filter changed
        if (mounted) {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const t = setTimeout(async () => {
            setIsSearchingApi(true);
            try {
                let url = `/api/curation?limit=20&sortBy=${activeSort}`;
                if (searchQuery.trim()) url += `&q=${encodeURIComponent(searchQuery)}`;
                if (activeCategory) url += `&category=${encodeURIComponent(activeCategory)}`;
                const res = await fetch(url);
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error(`Search fetch error ${res.status}:`, errorText.slice(0, 100));
                    throw new Error(`API error ${res.status}`);
                }
                const data = await res.json();
                if (data.articles) setSearchResults(data.articles);
            } catch { } finally { setIsSearchingApi(false); }
        }, 250);
        return () => clearTimeout(t);
    }, [searchQuery, activeCategory, activeSort, mounted]);

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
                        <h3 className="text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">{formatTitle(article.title)}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-zinc-400">
                                {new Date(article.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </span>
                            <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                            <span className="text-[10px] text-zinc-400">{readTime(article.content)} min read</span>
                            
                            {(article.likes || article.reposts || article.replies) && (
                                <>
                                    <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                                    <div className="flex items-center gap-2">
                                        {article.replies > 0 && (
                                            <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                                                <MessageCircle size={8} className="text-zinc-400" />
                                                {formatMetric(article.replies)}
                                            </span>
                                        )}
                                        {article.reposts > 0 && (
                                            <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                                                <Repeat size={8} className="text-zinc-400" />
                                                {formatMetric(article.reposts)}
                                            </span>
                                        )}
                                        {article.likes > 0 && (
                                            <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                                                <Heart size={8} className="text-zinc-400" />
                                                {formatMetric(article.likes)}
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}

                            {isSaved && (
                                <>
                                    <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                                    <span className="text-[10px] text-blue-500 flex items-center gap-0.5 font-medium">
                                        <Bookmark size={9} className="fill-blue-500/20" />
                                        saved
                                    </span>
                                </>
                            )}
                            {isRead && (
                                <>
                                    <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                                    <span className="text-[10px] text-emerald-500 flex items-center gap-0.5 font-medium">
                                        <CheckCheck size={9} />
                                        read
                                    </span>
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

    const Label = ({ children, color = "blue" }: { children: React.ReactNode, color?: "blue" | "emerald" | "zinc" }) => (
        <div className="flex items-center gap-2 mb-3">
            <div className={`w-[3px] h-3 rounded-full ${color === "blue" ? "bg-blue-500" : color === "emerald" ? "bg-emerald-500" : "bg-zinc-400"}`} />
            <h2 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-[0.2em]">{children}</h2>
        </div>
    );

    if (!mounted) return (
        <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] flex flex-col items-center justify-center gap-4 animate-pulse">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
            <div className="w-24 h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100">
            {/* ═══ HEADER ═══ */}
            <header className="sticky top-0 z-[110] bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 shrink-0 h-16 flex items-center px-4 transition-colors duration-500">
                {/* Search Only Header */}
                <div className="flex-1 flex justify-center px-2">
                    <div className="w-full max-w-[800px]">
                        <div className="relative group max-w-4xl mx-auto">
                            <Search size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? "text-zinc-600 dark:text-zinc-300" : "text-zinc-400"}`} />
                            <input 
                                ref={searchRef} 
                                type="text" 
                                placeholder="Search articles, topics..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                onFocus={() => setIsSearchFocused(true)} 
                                onBlur={() => setIsSearchFocused(false)} 
                                className="w-full h-9 bg-zinc-100/60 dark:bg-zinc-800/60 border border-transparent focus:bg-white dark:focus:bg-zinc-900/50 focus:border-zinc-200 dark:focus:border-zinc-700/50 rounded-full pl-9 pr-9 text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500/80 transition-all outline-none" 
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => { setSearchQuery(""); setActiveCategory(null); }} 
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                                >
                                    <X size={14} className="text-zinc-400" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Sub-header Filter Row (Sticky below Search) */}
            {!isShowingSearch && (
                <div className="sticky top-16 z-[105] bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 py-2 transition-colors duration-500 overflow-hidden">
                    <div className="max-w-2xl mx-auto px-4">
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                            {[{ key: "popularity" as const, label: "Popular", Icon: Flame }, { key: "date" as const, label: "Latest", Icon: Clock }].map(s => (
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
                </div>
            )}

            {/* ═══ CONTENT ═══ */}
            <main className="max-w-2xl mx-auto px-4 pt-6 pb-32">
                <AnimatePresence mode="wait">
                    {isShowingSearch ? (
                        <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="min-h-[400px]">
                            {/* Topic Insight Guide */}
                            {activeCategory && TOPIC_INSIGHTS[activeCategory] && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Info size={40} className="text-zinc-400" />
                                    </div>
                                    <div className="flex flex-col gap-2 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-3.5 bg-blue-500 rounded-full" />
                                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{activeCategory}</h4>
                                        </div>
                                        <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium italic">
                                            &quot;{TOPIC_INSIGHTS[activeCategory]}&quot;
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                            
                            <div ref={resultsRef} className="flex items-center justify-between mb-2 scroll-mt-24">
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
                                <div className="flex items-center justify-between">
                                    <Label color="blue">Picked For You</Label>
                                    <span className="text-[10px] text-zinc-400 -mt-3">personal</span>
                                </div>
                                {isLoading ? <Skeleton n={3} /> : readStats.readCount === 0 ? (
                                    <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-500/5 dark:to-indigo-500/5 border border-blue-100/50 dark:border-blue-500/10 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Brain size={64} className="text-blue-500 transform rotate-12" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 border border-zinc-100 dark:border-zinc-700">
                                                <Sparkles size={16} className="text-blue-500" />
                                            </div>
                                            <h3 className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">Your feed is waiting</h3>
                                            <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400 mb-4 max-w-[240px] mx-auto leading-relaxed">
                                                Read a few articles to train the algorithm on what you like. I'll curate the best pieces for you.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    const trendingSection = document.getElementById('trending-section');
                                                    if (trendingSection) {
                                                        const y = trendingSection.getBoundingClientRect().top + window.scrollY - 100;
                                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                                    }
                                                }}
                                                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-[11.5px] font-bold px-4 py-2 rounded-full transition-colors active:scale-95"
                                            >
                                                Explore Trending <ChevronRight size={14} className="ml-0.5 -mr-1" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>{forYouArticles.map((a, i) => <ArticleRow key={a.id} article={a} i={i} />)}</div>
                                )}
                            </section>

                            {/* Latest */}
                            <section>
                                <div className="flex items-center justify-between">
                                    <Label color="emerald">Recently Added</Label>
                                    <span className="text-[10px] text-zinc-400 -mt-3">latest</span>
                                </div>
                                {isLoading ? <Skeleton n={4} /> : <div>{latestArticles.map((a, i) => <ArticleRow key={a.id} article={a} i={i} />)}</div>}
                            </section>

                            {/* Trending */}
                            <section id="trending-section">
                                <div className="flex items-center justify-between">
                                    <Label color="blue">Trending Now</Label>
                                    <span className="text-[10px] text-zinc-400 -mt-3">popular</span>
                                </div>
                                {isLoading ? <Skeleton n={5} /> : <div>{trendingArticles.map((a, i) => <ArticleRow key={a.id} article={a} i={i} rank />)}</div>}
                            </section>

                            {/* Topics — compact inline rows */}
                            <section>
                                <Label color="zinc">Topics</Label>
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
                                <Label color="blue">Reading Lists</Label>
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

            {/* ═══ ATLAS MENU ═══ */}
            <AnimatePresence>
                {isAtlasMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[100] bg-[#fafaf8]/95 dark:bg-[#050505]/95 backdrop-blur-3xl flex flex-col pt-14"
                    >
                        <nav className="flex-1 px-10 flex flex-col pt-[18vh] gap-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6 opacity-60">Knowledge Archives</p>
                            {VERTICALS.map((v, i) => (
                                <motion.div
                                    key={v.key}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link
                                        href={v.href}
                                        onClick={() => setIsAtlasMenuOpen(false)}
                                        className="group py-2.5 block"
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className="text-[11px] font-bold text-zinc-300 dark:text-zinc-700 tabular-nums">0{i + 1}</span>
                                            <span
                                                className="text-[36px] md:text-[52px] font-light tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:italic transition-all duration-300"
                                                style={{ fontFamily: "'Playfair Display', serif" }}
                                            >
                                                {v.label}
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
