"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ArrowLeft, X, FileText, Clock,
    ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft,
    Flame, BookOpen, Hash, Bookmark, ArrowDown,
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
import { curationCache } from "@/lib/curation-cache";

// ─── Constants ───

const TOPIC_INSIGHTS: Record<string, string> = {
    "AI & Tech": "Eksplorasi pergeseran fundamental dari era 'Software as a Service' menuju kebangkitan AI Agents. Di sini gue kurasi blueprint teknis dan strategis: cara membangun autonomous systems, optimasi model bahasa untuk business logic, hingga framework adaptasi skill untuk navigasi di tengah akselerasi teknologi yang tak terelakkan.",
    "Wealth & Business": "Kumpulan strategi membangun asymmetric scale, memahami leverage, dan navigasi dunia startup/SaaS. Fokus pada capital allocation dan mindset membangun wealth jangka panjang.",
    "Philosophy & Psychology": "Framework mental untuk kejernihan berpikir. Dari Stoicisme sampe psikologi perilaku, artikel di sini ngebantu lo 'rewire' perspektif dalam menghadapi chaos di kehidupan modern.",
    "Productivity & Deep Work": "Sistem praktis untuk kerja elite. Bukan sekadar tips manajemen waktu, tapi metode deep work, optimasi energi, dan cara membangun habit yang sustain secara jangka panjang.",
    "Growth & Systems": "Panduan skalasi audience dan compounding systems. Pelajari teknik marketing modern, SEO, conversion funnel, sampe sistem akuisisi yang bisa jalan secara autopilot.",
    "All Entries": "Selamat datang di repositori lengkap. Di sini lo bisa nemuin semua artikel, blueprint, dan framework yang udah gue kurasi lintas kategori. Gunakan filter untuk nemuin spesifik apa yang lo cari buat asahan otak hari ini."
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
            <div className="h-[100dvh] w-full bg-[#fafaf8] dark:bg-[#050505] flex flex-col items-center justify-center gap-4 transition-colors duration-500">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse" />
                <div className="w-24 h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
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
    const [allArticles, setAllArticles] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [allCount, setAllCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeOrder, setActiveOrder] = useState<"asc" | "desc">("desc");
    const [isSearchingMore, setIsSearchingMore] = useState(false);
    const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [isSearchingApi, setIsSearchingApi] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [readStats, setReadStats] = useState<{ readCount: number; bookmarkCount: number; readIds: Set<string>; savedIds: Set<string> }>({ readCount: 0, bookmarkCount: 0, readIds: new Set(), savedIds: new Set() });

    // Cache & Persistence
    const isFirstLoadRef = useRef(true);

    const searchRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollYRef = useRef(0);
    const [isSeeAllActive, setIsSeeAllActive] = useState(false);
    const isShowingSearch = searchQuery.trim().length > 0 || activeCategory !== null || isSeeAllActive;

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

        // Load persisted state
        const savedQuery = sessionStorage.getItem("curation_explore_query");
        const savedCat = sessionStorage.getItem("curation_explore_category");
        const savedSort = sessionStorage.getItem("curation_explore_sort") as "popularity" | "date" | null;
        const savedOrder = sessionStorage.getItem("curation_explore_order") as "asc" | "desc" | null;
        const savedScroll = sessionStorage.getItem("curation_explore_scroll");

        if (savedQuery) setSearchQuery(savedQuery);
        if (savedCat) setActiveCategory(savedCat);
        if (savedSort) setActiveSort(savedSort);
        if (savedOrder) setActiveOrder(savedOrder);
        if (savedScroll) scrollYRef.current = parseInt(savedScroll, 10);

        (async () => {
            try {
                const vs = await getVisitorState();
                const readIds = new Set(Object.keys(vs.read || {}).filter(k => vs.read[k]));
                const savedIds = new Set(Object.keys(vs.bookmarked || {}).filter(k => vs.bookmarked[k]));
                setReadStats({ readCount: readIds.size, bookmarkCount: savedIds.size, readIds, savedIds });

                const [tR, lR, aR] = await Promise.all([
                    fetch("/api/curation?limit=8&sortBy=popularity"),
                    fetch("/api/curation?limit=5&sortBy=date"),
                    fetch("/api/curation?limit=10&sortBy=date"),
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

    // Restore scroll position
    useEffect(() => {
        if (!isLoading && mounted && scrollContainerRef.current && scrollYRef.current > 0) {
            scrollContainerRef.current.scrollTop = scrollYRef.current;
        }
    }, [isLoading, mounted]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            sessionStorage.setItem("curation_explore_scroll", scrollContainerRef.current.scrollTop.toString());
        }
    };

    // Unified Fetch for Search/Filter/Home
    const fetchArticles = async (page = 1) => {
        const isSearch = searchQuery.trim().length > 0 || activeCategory !== null || isSeeAllActive;
        const limit = 10;
        const offset = (page - 1) * limit;

        // Global Cache Check
        const cacheKey = `discover_${activeSort}_${activeOrder}_${activeCategory || 'all'}_${searchQuery.trim() || 'none'}_${page}`;
        const cached = curationCache.get(cacheKey);
        
        if (cached) {
            if (isSearch) setSearchResults(cached.articles);
            else setAllArticles(cached.articles);
            setAllCount(cached.totalCount);
            setCurrentPage(page);
            setIsSearchingApi(false);
            return;
        }

        setIsSearchingApi(true);

        try {
            let url = `/api/curation?limit=${limit}&sortBy=${activeSort}&sortOrder=${activeOrder}&offset=${offset}`;
            if (searchQuery.trim()) url += `&q=${encodeURIComponent(searchQuery)}`;
            if (activeCategory) url += `&category=${encodeURIComponent(activeCategory)}`;
            
            const res = await fetch(url);
            if (!res.ok) throw new Error(`API error ${res.status}`);
            const data = await res.json();
            
            // Save to global cache
            curationCache.set(cacheKey, data.articles || [], data.totalCount || 0);

            if (isSearch) {
                setSearchResults(data.articles || []);
            } else {
                setAllArticles(data.articles || []);
            }
            setAllCount(data.totalCount || 0);
            setCurrentPage(page);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setIsSearchingApi(false);
            setIsSearchingMore(false);
        }
    };

    useEffect(() => {
        const isSearch = searchQuery.trim().length > 0 || activeCategory !== null;
        
        // Persistence
        if (mounted) {
            sessionStorage.setItem("curation_explore_query", searchQuery);
            sessionStorage.setItem("curation_explore_category", activeCategory || "");
            sessionStorage.setItem("curation_explore_sort", activeSort);
            sessionStorage.setItem("curation_explore_order", activeOrder);
        }

        // Cache check for immediate skeleton prevention
        const cacheKey = `discover_${activeSort}_${activeOrder}_${activeCategory || 'all'}_${searchQuery.trim() || 'none'}_1`;
        const hasCache = !!curationCache.get(cacheKey);

        if (!hasCache && (!searchQuery.trim() || isSeeAllActive)) {
            setIsSearchingApi(true);
        }

        const t = setTimeout(() => {
            fetchArticles(1);
        }, isSearch && !isSeeAllActive && !hasCache ? 250 : 0);
        return () => clearTimeout(t);
    }, [searchQuery, activeCategory, activeSort, activeOrder, isSeeAllActive, mounted]);

    // Completion percentage
    const completionPct = useMemo(() => {
        if (!allCount) return 0;
        return Math.round((readStats.readCount / allCount) * 100);
    }, [readStats.readCount, allCount]);

    // ─── Renderers ───

    const CATEGORY_COLORS: Record<string, { bg: string, text: string, darkBg: string, darkText: string }> = {
        "AI & Tech": { bg: "bg-blue-50/50", text: "text-blue-600", darkBg: "dark:bg-blue-500/10", darkText: "dark:text-blue-400" },
        "Wealth & Business": { bg: "bg-amber-50/50", text: "text-amber-600", darkBg: "dark:bg-amber-500/10", darkText: "dark:text-amber-400" },
        "Philosophy & Psychology": { bg: "bg-indigo-50/50", text: "text-indigo-600", darkBg: "dark:bg-indigo-500/10", darkText: "dark:text-indigo-400" },
        "Productivity & Deep Work": { bg: "bg-emerald-50/50", text: "text-emerald-600", darkBg: "dark:bg-emerald-500/10", darkText: "dark:text-emerald-400" },
        "Growth & Systems": { bg: "bg-orange-50/50", text: "text-orange-600", darkBg: "dark:bg-orange-500/10", darkText: "dark:text-orange-400" },
    };

    const CategoryPills = () => {
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const showSorting = activeCategory !== null || isSeeAllActive || searchQuery.trim().length > 0;
        
        return (
            <div className="flex items-center gap-2 py-3 mb-2 flex-wrap">
                {/* Home Feed style sorting for Result Views */}
                {showSorting && (
                    <div className="flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden shrink-0 shadow-sm p-0.5 relative">
                        {[
                            { id: "date" as const, label: "Date" },
                            { id: "popularity" as const, label: "Popularity" }
                        ].map((dim) => {
                            const isActive = activeSort === dim.id;
                            const handleSortClick = (id: "date" | "popularity") => {
                                setIsSearchingApi(true); // Immediate skeleton
                                if (id === activeSort) {
                                    setActiveOrder(prev => prev === "desc" ? "asc" : "desc");
                                } else {
                                    setActiveSort(id);
                                    setActiveOrder("desc");
                                    // Hard clear lists to prevent blip
                                    setAllArticles([]);
                                    setSearchResults([]);
                                }
                            };
                            return (
                                <button
                                    key={dim.id}
                                    onClick={() => handleSortClick(dim.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full transition-all whitespace-nowrap z-10 active:scale-95 relative ${isActive
                                        ? "text-white dark:text-zinc-900"
                                        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 bg-transparent"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeSort"
                                            className="absolute inset-0 bg-zinc-800 dark:bg-zinc-100 rounded-full -z-10 shadow-sm"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span>{dim.label}</span>
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1, rotate: activeOrder === "asc" ? 180 : 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="flex items-center justify-center ml-0.5"
                                        >
                                            <ArrowDown size={14} strokeWidth={2.5} />
                                        </motion.div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Category Dropdown Trigger */}
                <div className="relative">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border shadow-sm active:scale-95 ${activeCategory 
                            ? "bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900 border-transparent" 
                            : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                    >
                        <Hash size={12} className={activeCategory ? "text-zinc-300 dark:text-zinc-700" : "text-zinc-400"} />
                        <span>{activeCategory || "Categories"}</span>
                        <ChevronRight size={10} className={`opacity-60 transition-transform ${isMenuOpen ? "rotate-90" : ""}`} />
                    </button>
                    
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-[150] overflow-hidden p-1 backdrop-blur-xl"
                            >
                                    {CATEGORIES.map(cat => (
                                        <button 
                                            key={cat.name}
                                            onClick={() => { 
                                                setIsSearchingApi(true); // Immediate skeleton
                                                if (activeCategory === cat.name) {
                                                    setActiveCategory(null);
                                                } else {
                                                    setActiveCategory(cat.name);
                                                }
                                                setSearchResults([]); // Hard clear search to prevent blip
                                                setIsMenuOpen(false); 
                                            }}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold rounded-lg transition-colors ${activeCategory === cat.name ? "bg-zinc-100 dark:bg-zinc-800 text-blue-600" : "text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"}`}
                                        >
                                            <cat.icon size={12} className={activeCategory === cat.name ? "text-blue-500" : "text-zinc-500"} />
                                            {cat.name}
                                        </button>
                                    ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    };

    const Pagination = ({ current, total, onPage }: { current: number; total: number; onPage: (p: number) => void }) => {
        const totalPages = Math.ceil(total / 10);
        if (totalPages <= 1) return null;
        
        return (
            <div className="flex items-center justify-center mt-6 mb-6">
                <div className="flex items-center gap-2 p-1.5 bg-zinc-50/50 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-full shadow-sm">
                    <button
                        disabled={current === 1}
                        onClick={() => { onPage(1); resultsRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="flex items-center justify-center w-8 h-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all disabled:opacity-10 active:scale-90 rounded-full"
                    >
                        <ChevronsLeft size={14} strokeWidth={2.5} />
                    </button>

                    <button
                        disabled={current === 1}
                        onClick={() => { onPage(current - 1); resultsRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="flex items-center gap-1 px-3 h-8 text-[10px] font-bold tracking-widest uppercase text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all disabled:opacity-20 active:scale-95 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm"
                    >
                        <ChevronLeft size={12} strokeWidth={3} />
                        <span className="hidden sm:inline">Prev</span>
                    </button>

                    <div className="flex items-center min-w-[50px] justify-center px-1">
                        <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
                            {current} <span className="text-zinc-300 dark:text-zinc-700 font-medium mx-0.5">/</span> {totalPages}
                        </span>
                    </div>

                    <button
                        disabled={current >= totalPages}
                        onClick={() => { onPage(current + 1); resultsRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="flex items-center gap-1 px-3 h-8 text-[10px] font-bold tracking-widest uppercase text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all disabled:opacity-20 active:scale-95 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={12} strokeWidth={3} />
                    </button>

                    <button
                        disabled={current >= totalPages}
                        onClick={() => { onPage(totalPages); resultsRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="flex items-center justify-center w-8 h-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all disabled:opacity-10 active:scale-90 rounded-full"
                    >
                        <ChevronsRight size={14} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        );
    };

    const ArticleRow = ({ article, i, rank }: { article: any; i: number; rank?: boolean }) => {
        const isRead = readStats.readIds.has(article.id);
        const isSaved = readStats.savedIds.has(article.id);
        return (
            <motion.div 
                key={article.id} 
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.2, delay: i * 0.02 }} 
                className="min-h-[72px] flex flex-col justify-center"
            >
                <Link href={`/curation/${article.id}`} className={`group flex items-center gap-2.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 transition-all duration-300 ${isRead ? "opacity-60" : ""}`}>
                    {rank && <span className="text-[15px] font-bold text-zinc-200 dark:text-zinc-800 w-5 text-center shrink-0 tabular-nums">{i + 1}</span>}
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
                            <span className="text-[10px] text-zinc-400 tabular-nums">
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

    const Skeleton = ({ n }: { n: number }) => (
        <>
            {Array(n).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2.5 min-h-[72px] border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
                    <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 shrink-0 animate-pulse" />
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
        <div className="flex items-center gap-2 mb-3">
            <div className="w-[3px] h-3 rounded-full bg-blue-500" />
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
        <div className="h-[100svh] flex flex-col bg-[#fafaf8] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors duration-500">
            {/* ═══ HEADER ═══ */}
            <header className="sticky top-0 z-[110] bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 shrink-0 h-16 flex items-center px-4 transition-colors duration-500">
                {/* Search Header */}
                <div className="flex-1 flex items-center gap-3">
                    <Link href="/curation" className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-full transition-colors active:scale-90">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex-1">
                        <div className="relative group max-w-2xl">
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

                {/* Right: Toggle */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all relative overflow-hidden"
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
                className="flex-1 overflow-y-auto overflow-x-hidden pt-2 pb-16"
                style={{
                    WebkitOverflowScrolling: "touch",
                    overscrollBehaviorY: "none",
                    overflowAnchor: "auto",
                    scrollbarGutter: "stable",
                } as React.CSSProperties}
            >
                <div className="max-w-2xl mx-auto px-4">
                <AnimatePresence mode="wait">
                    {isShowingSearch ? (
                        <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="min-h-[400px]">
                            {/* Topic Insight Guide */}
                            <div className="min-h-0">
                                <AnimatePresence mode="wait">
                                    {(activeCategory || isSeeAllActive) ? (
                                        <motion.div 
                                            key={activeCategory || "all"}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            className="mb-6 p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl relative overflow-hidden group h-auto"
                                        >
                                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <Info size={40} className="text-zinc-400" />
                                            </div>
                                            <div className="flex flex-col gap-2 relative z-10">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1 h-3.5 bg-blue-500 rounded-full" />
                                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{activeCategory || "EXPLORE ALL"}</h4>
                                                </div>
                                                <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium italic m-0">
                                                    {TOPIC_INSIGHTS[activeCategory || "All Entries"]}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                                <CategoryPills />
                            </div>
                            
                            <div ref={resultsRef} className="flex items-center justify-between mb-2 scroll-mt-24">
                                <div className="flex items-center gap-2">
                                    {(activeCategory || isSeeAllActive) && (
                                        <button 
                                            onClick={() => { setActiveCategory(null); setIsSeeAllActive(false); }} 
                                            className="text-[10px] bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-900 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                                        >
                                            {activeCategory || "All Entries"} <X size={9} />
                                        </button>
                                    )}
                                    <span className="text-[11px] text-zinc-400">
                                        {isSearchingApi ? "Searching..." : `${allCount > 0 ? allCount : searchResults.length} articles found`}
                                    </span>
                                </div>
                                <button onClick={() => { setSearchQuery(""); setActiveCategory(null); setIsSeeAllActive(false); }} className="text-[10px] text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">Clear</button>
                            </div>
                             <AnimatePresence mode="wait">
                                {isSearchingApi ? (
                                    <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Skeleton n={5} />
                                    </motion.div>
                                ) : searchResults.length > 0 ? (
                                    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
                                        <div>{searchResults.map((a, i) => <ArticleRow key={a.id} article={a} i={i} rank={true} />)}</div>
                                        <Pagination current={currentPage} total={allCount} onPage={fetchArticles} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="py-16 text-center">
                                        <Search size={24} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-2" />
                                        <p className="text-[12px] text-zinc-500">No articles found</p>
                                    </motion.div>
                                )}
                             </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-8">

                            {/* Reading Pulse — stats row style */}
                            <div className="flex items-center bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 divide-x divide-zinc-200/60 dark:divide-zinc-800/60 min-h-[48px] overflow-hidden">
                                <div className="flex-1 text-center py-1.5 px-1">
                                    <span className="text-[14px] md:text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{allCount}</span>
                                    <span className="text-[9px] text-zinc-500 ml-1.5 inline">articles</span>
                                </div>
                                <div className="flex-1 text-center py-1.5 px-1">
                                    <span className="text-[14px] md:text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{readStats.readCount}</span>
                                    <span className="text-[9px] text-zinc-500 ml-1.5 inline">read</span>
                                </div>
                                <div className="flex-1 text-center py-1.5 px-1">
                                    <span className="text-[14px] md:text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{readStats.bookmarkCount}</span>
                                    <span className="text-[9px] text-zinc-500 ml-1.5 inline">saved</span>
                                </div>
                                <div className="flex-1 text-center py-1.5 px-1">
                                    <span className="text-[14px] md:text-[16px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{completionPct}%</span>
                                    <span className="text-[9px] text-zinc-500 ml-1.5 inline">done</span>
                                </div>
                            </div>

                             {/* All Entries — The primary feed */}
                            <section>
                                <div className="flex items-center justify-between mb-1">
                                    <Label>All Entries</Label>
                                    <button 
                                        onClick={() => {
                                            setIsSearchingApi(true); // Immediate skeleton
                                            setActiveSort(activeSort === 'date' ? 'popularity' : 'date');
                                            setAllArticles([]); // Hard clear list to prevent blip
                                        }}
                                        className="flex items-center gap-1 -mt-3 group transition-opacity"
                                    >
                                        <span className="text-[10px] text-zinc-400 group-hover:text-zinc-500 transition-colors">sorted by</span>
                                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                                            {activeSort === 'popularity' ? 'Popularity' : 'Latest'}
                                        </span>
                                    </button>
                                </div>
                                <div className="min-h-[300px]">
                                    <AnimatePresence mode="wait">
                                        {isSearchingApi ? (
                                            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                                <Skeleton n={10} />
                                            </motion.div>
                                        ) : allArticles.length > 0 ? (
                                            <motion.div key="all-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                                <div>
                                                    {allArticles.map((a, i) => (
                                                        <ArticleRow key={a.id} article={a} i={i} rank={true} />
                                                    ))}
                                                </div>
                                                <div className="pt-2 pb-1 border-t border-zinc-100 dark:border-zinc-800/50 mt-2">
                                                    <button 
                                                        onClick={() => setIsSeeAllActive(true)}
                                                        className="w-full py-2 text-[10px] font-bold text-blue-500 dark:text-blue-400 hover:underline transition-colors uppercase tracking-[0.1em] flex items-center justify-center gap-1.5"
                                                    >
                                                        See All Entries <ChevronRight size={11} className="inline" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="all-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="py-20 text-center opacity-40">No entries yet.</motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </section>

                            {/* Picked For You */}
                            <section>
                                <div className="flex items-center justify-between">
                                    <Label>Picked For You</Label>
                                    <span className="text-[10px] text-zinc-400 -mt-3">personal</span>
                                </div>
                                <div className="min-h-[200px]">
                                    {isLoading ? (
                                        <Skeleton n={3} />
                                    ) : readStats.readCount === 0 ? (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-500/5 dark:to-indigo-500/5 border border-blue-100/50 dark:border-blue-500/10 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group"
                                        >
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
                                        </motion.div>
                                    ) : (
                                        <div>{forYouArticles.map((a, i) => <ArticleRow key={a.id} article={a} i={i} rank={true} />)}</div>
                                    )}
                                </div>
                            </section>

                            {/* Trending */}
                            <section id="trending-section">
                                <div className="flex items-center justify-between">
                                    <Label>Trending Now</Label>
                                    <span className="text-[10px] text-zinc-400 -mt-3">popular</span>
                                </div>
                                {isLoading ? <Skeleton n={4} /> : <div>{trendingArticles.slice(0, 4).map((a, i) => <ArticleRow key={a.id} article={a} i={i} rank={true} />)}</div>}
                            </section>

                            {/* Latest */}
                            <section>
                                <div className="flex items-center justify-between">
                                    <Label>Recently Added</Label>
                                    <span className="text-[10px] text-zinc-400 -mt-3">latest</span>
                                </div>
                                {isLoading ? <Skeleton n={4} /> : <div>{latestArticles.slice(0, 4).map((a, i) => <ArticleRow key={a.id} article={a} i={i} rank={true} />)}</div>}
                            </section>

                            {/* Topics — compact inline rows */}
                            <section>
                                <Label>Topics</Label>
                                <div className="space-y-1">
                                    {CATEGORIES.map(cat => {
                                        const count = categoryStats[cat.name] || 0;
                                        return (
                                            <button
                                                key={cat.name}
                                                onClick={() => setActiveCategory(cat.name)}
                                                className="w-full flex items-center gap-4 p-3 rounded-2xl border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-900/50 transition-all group text-left active:scale-[0.985]"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-blue-500/20">
                                                    <cat.icon size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-0.5">{cat.name}</p>
                                                    <span className="text-[10px] text-zinc-400 font-medium tabular-nums">{count} articles</span>
                                                </div>
                                                <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700 group-hover:text-blue-500 transition-colors" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Reading Lists — compact horizontal scroll */}
                            <section>
                                <Label>Reading Lists</Label>
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
                </div>
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
                        <nav className="flex-1 px-10 flex flex-col pt-[18svh] gap-3">
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
