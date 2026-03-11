"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    Search,
    TrendingUp,
    ChevronRight,
    Zap,
    Brain,
    Rocket,
    Coffee,
    ArrowLeft,
    X,
    Loader2,
    FileText,
    SlidersHorizontal,
    BookOpen,
    Clock,
    Sparkles,
    Flame
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const TOPICS = [
    { name: "AI & Tech", icon: Brain },
    { name: "Wealth & Business", icon: Rocket },
    { name: "Philosophy & Psychology", icon: Coffee },
    { name: "Productivity & Deep Work", icon: Zap },
    { name: "Growth & Systems", icon: TrendingUp },
];

const STARTER_PACKS = [
    { title: "Mastering Focus", category: "Productivity & Deep Work", color: "from-blue-500/20 to-indigo-500/20", icon: Zap },
    { title: "Naval's Anthology", category: "Philosophy & Psychology", color: "from-amber-500/20 to-orange-500/20", icon: Coffee },
    { title: "Agentic Future", category: "AI & Tech", color: "from-emerald-500/20 to-teal-500/20", icon: Brain },
    { title: "Growth Vault", category: "Growth & Systems", color: "from-purple-500/20 to-pink-500/20", icon: TrendingUp },
    { title: "Wealth Wisdom", category: "Wealth & Business", icon: Rocket, color: "from-emerald-600/20 to-green-600/20" },
    { title: "Deep Work", category: "Productivity & Deep Work", icon: BookOpen, color: "from-cyan-500/20 to-blue-500/20" },
];

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Data States
    const [forYouArticles, setForYouArticles] = useState<any[]>([]);
    const [trendingArticles, setTrendingArticles] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);

    // UI States
    const [isLoadingInit, setIsLoadingInit] = useState(true);
    const [isSearchingApi, setIsSearchingApi] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'popularity' | 'latest'>('popularity');

    const searchRef = useRef<HTMLInputElement>(null);

    // Initial Data Fetch (For You)
    useEffect(() => {
        setMounted(true);
        const fetchInitialData = async () => {
            try {
                // 1. Check Local Storage for tastes
                let topCategory = "Wealth & Business"; // Default fallback
                const raw = localStorage.getItem("curation_visitor_state");
                if (raw) {
                    const state = JSON.parse(raw);
                    // Mocking simple category pref logic for now. 
                    // If they have reads, assume they like the default or we could hit an API that calculates it. 
                    // For the sake of this UI, we just fetch popular items and label them "For You" based on a generic check, or we literally pass a category.
                    // Let's just fetch top popularity for now to simulate personalized top picks
                }

                // 2. Fetch "For You" and "Trending" concurrently
                const [topRes, trendingRes] = await Promise.all([
                    fetch(`/api/curation?limit=3&sort=latest`),
                    fetch(`/api/curation?limit=5&sort=popularity`)
                ]);

                const topData = await topRes.json();
                const trendingData = await trendingRes.json();

                if (topData.articles) setForYouArticles(topData.articles);
                if (trendingData.articles) setTrendingArticles(trendingData.articles);
            } catch (err) {
                console.error("Failed to fetch initial explore data:", err);
            } finally {
                setIsLoadingInit(false);
            }
        };
        fetchInitialData();
    }, []);

    // Search Logic
    useEffect(() => {
        if (!searchQuery.trim() && activeFilter === 'popularity') {
            // If empty and default filter, no need to show search results over original UI
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearchingApi(true);
            try {
                const isTopic = TOPICS.some(t => t.name.toLowerCase() === searchQuery.toLowerCase()) ||
                    searchQuery.startsWith("AI") || searchQuery.startsWith("Wealth") || searchQuery.startsWith("Philosophy") || searchQuery.startsWith("Productivity") || searchQuery.startsWith("Growth");

                let url = `/api/curation?limit=10&sort=${activeFilter}`;
                if (searchQuery.trim()) {
                    if (isTopic) {
                        url += `&category=${encodeURIComponent(searchQuery)}`;
                    } else {
                        url += `&q=${encodeURIComponent(searchQuery)}`;
                    }
                }

                const res = await fetch(url);
                const data = await res.json();
                if (data.articles) setSearchResults(data.articles);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsSearchingApi(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, activeFilter]);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    // Helper to render compact article cards
    const renderCompactArticle = (article: any, i: number) => (
        <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
        >
            <Link
                href={`/curation/${article.id}`}
                className="group flex gap-4 p-3 m-1 bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all active:scale-[0.99]"
            >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 relative border border-zinc-200/40 dark:border-zinc-700/40">
                    {article.imageUrl ? (
                        <Image src={article.imageUrl} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                            <FileText size={20} />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1.5 line-clamp-1">
                        <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.05em] text-blue-600 dark:text-blue-400">
                            {article.category || "General"}
                        </span>
                        <span className="text-zinc-300 dark:text-zinc-700">•</span>
                        <span className="text-[9px] sm:text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                            <Clock size={10} /> 5 min read
                        </span>
                    </div>
                    <h3 className="text-[14px] sm:text-[15px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {article.title}
                    </h3>
                </div>
            </Link>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 selection:bg-blue-100 dark:selection:bg-blue-900/30">
            {/* ═══ TOP STICKY SEARCH BAR + FILTERS ═══ */}
            <header className="sticky top-0 z-50 bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 pb-2">
                <div className="px-5 pt-3 max-w-2xl mx-auto flex items-center gap-4">
                    <Link href="/curation" className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="relative flex-1 group">
                        <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearching ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`} />
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Explore ideas, articles, tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearching(true)}
                            onBlur={() => setIsSearching(false)}
                            className="w-full h-11 pl-11 pr-4 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[14px] outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-400 shadow-sm"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Chips - Horizontal Scroll */}
                <div className="px-5 mt-2 max-w-2xl mx-auto flex gap-2 overflow-x-auto no-scrollbar mask-linear-right pb-1">
                    <button className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        <SlidersHorizontal size={14} />
                    </button>
                    <button
                        onClick={() => setActiveFilter('popularity')}
                        className={`flex items-center gap-1.5 px-3.5 h-8 shrink-0 rounded-full text-[12px] font-medium transition-colors border ${activeFilter === 'popularity' ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white' : 'bg-white text-zinc-600 border-zinc-200 dark:bg-zinc-900/50 dark:text-zinc-400 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                    >
                        <Flame size={12} className={activeFilter === 'popularity' ? 'animate-pulse' : ''} /> Popular
                    </button>
                    <button
                        onClick={() => setActiveFilter('latest')}
                        className={`flex items-center gap-1.5 px-3.5 h-8 shrink-0 rounded-full text-[12px] font-medium transition-colors border ${activeFilter === 'latest' ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white' : 'bg-white text-zinc-600 border-zinc-200 dark:bg-zinc-900/50 dark:text-zinc-400 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                    >
                        <Clock size={12} /> Latest
                    </button>
                    <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 my-auto mx-1 shrink-0" />
                    {TOPICS.map(topic => (
                        <button key={topic.name} onClick={() => setSearchQuery(topic.name)} className="flex items-center gap-1.5 px-3.5 h-8 shrink-0 rounded-full bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-[12px] font-medium">
                            {topic.name}
                        </button>
                    ))}
                </div>
            </header>

            {!mounted ? (
                <div className="min-h-[50vh] flex items-center justify-center">
                    <Loader2 className="animate-spin text-zinc-400" size={24} />
                </div>
            ) : (
                <main className="max-w-2xl mx-auto px-5 py-5 space-y-8">

                    {/* SEARCH RESULTS MODE vs DISCOVER MODE */}
                    {searchQuery.trim() || activeFilter !== 'popularity' ? (
                        <motion.section initial="hidden" animate="visible" variants={containerVariants as any} className="space-y-4">
                            <h2 className="text-[13px] font-medium text-zinc-500 px-1 mb-2 flex items-center justify-between">
                                <span>Search Results</span>
                                <span className="text-[11px] font-normal text-zinc-400">{searchResults.length} articles</span>
                            </h2>
                            {isSearchingApi ? (
                                Array(4).fill(0).map((_, i) => <div key={i} className="h-24 m-1 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 animate-pulse" />)
                            ) : searchResults.length > 0 ? (
                                searchResults.map(renderCompactArticle)
                            ) : (
                                <div className="py-16 text-center text-zinc-500 text-[14px] flex flex-col items-center gap-3">
                                    <Search size={32} className="text-zinc-300 dark:text-zinc-700" />
                                    No results found for "{searchQuery}"
                                </div>
                            )}
                        </motion.section>
                    ) : (
                        <motion.div initial="hidden" animate="visible" variants={containerVariants as any} className="space-y-12">

                            {/* ═══ FOR YOU / PERSONALIZED ═══ */}
                            <section>
                                <h2 className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 px-1 mb-1 flex items-center gap-2">
                                    <Sparkles size={16} className="text-yellow-500" />
                                    Picked For You
                                </h2>
                                <p className="text-[11px] text-zinc-500 px-1 mb-3">Based on your recent activity and reading history</p>
                                <div className="space-y-2">
                                    {isLoadingInit ? (
                                        Array(3).fill(0).map((_, i) => <div key={i} className="h-24 m-1 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 animate-pulse" />)
                                    ) : (
                                        forYouArticles.map(renderCompactArticle)
                                    )}
                                </div>
                            </section>

                            {/* ═══ CURATED COLLECTIONS ═══ */}
                            <section>
                                <h2 className="text-[13px] font-medium text-zinc-500 px-1 mb-4">
                                    Curated Collections
                                </h2>
                                <div className="grid grid-cols-2 gap-2 px-1">
                                    {STARTER_PACKS.map((pack, i) => (
                                        <button
                                            key={pack.title}
                                            onClick={() => setSearchQuery(pack.category)}
                                            className="group relative overflow-hidden rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 p-3 text-left transition-all hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-sm flex items-center gap-3"
                                        >
                                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${pack.color} rounded-full blur-2xl -mr-8 -mt-8 opacity-40 group-hover:opacity-100 transition-opacity`} />
                                            <div className="relative z-10 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-300">
                                                <pack.icon size={14} />
                                            </div>
                                            <div className="relative z-10 flex-1 min-w-0 pr-1">
                                                <h3 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5 truncate">{pack.title}</h3>
                                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{pack.category}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* ═══ POPULAR IN NETWORK ═══ */}
                            <section>
                                <h2 className="text-[13px] font-medium text-zinc-500 px-1 mb-4 flex items-center justify-between">
                                    Trending Now
                                    <button onClick={() => setActiveFilter('popularity')} className="text-[11px] text-blue-500 hover:text-blue-600">See All</button>
                                </h2>
                                <div className="space-y-2">
                                    {!isLoadingInit && trendingArticles.map(renderCompactArticle)}
                                </div>
                            </section>

                        </motion.div>
                    )}
                </main>
            )}

            {/* Empty space for dock */}
            <div className="h-28" />
        </div>
    );
}
