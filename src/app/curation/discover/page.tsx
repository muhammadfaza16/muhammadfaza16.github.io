"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    TrendingUp,
    Sparkles,
    ChevronRight,
    Hash,
    Zap,
    Brain,
    Rocket,
    Globe,
    Coffee,
    ArrowLeft,
    X,
    Loader2,
    FileText
} from "lucide-react";
import { DevPlaceholder } from "@/components/curation/DevPlaceholder";
import Link from "next/link";
import Image from "next/image";

const TOPICS = [
    { name: "AI & Future", icon: Brain },
    { name: "Deep Work", icon: Zap },
    { name: "Philosophy", icon: Coffee },
    { name: "Strategy", icon: Rocket },
    { name: "Economy", icon: Globe },
];

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [trendingArticles, setTrendingArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Mock fetch trending
        const fetchTrending = async () => {
            try {
                const res = await fetch("/api/curation?limit=4&sort=latest");
                const data = await res.json();
                if (data.articles) setTrendingArticles(data.articles);
            } catch (err) {
                console.error("Failed to fetch trending:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrending();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 selection:bg-blue-100 dark:selection:bg-blue-900/30">
            {/* ═══ TOP STICKY SEARCH BAR ═══ */}
            <header className="sticky top-0 z-50 bg-[#fafaf8]/15 dark:bg-[#050505]/20 backdrop-blur-xl px-5 py-4 border-b border-zinc-200/40 dark:border-zinc-800/40">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <Link
                        href="/curation"
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="relative flex-1 group">
                        <Search
                            size={18}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearching ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`}
                        />
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Explore ideas, articles, tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearching(true)}
                            onBlur={() => setIsSearching(false)}
                            className="w-full h-11 pl-11 pr-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[14px] outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-5 py-8 space-y-12">
                <DevPlaceholder />
                {/* ═══ TRENDING TOPICS (Horizontal Scroll) ═══ */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants as any}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-[13px] font-medium text-zinc-500 flex items-center gap-2 px-1">
                            Discover Topics
                        </h2>
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear">
                        {TOPICS.map((topic, i) => (
                            <motion.button
                                key={topic.name}
                                variants={itemVariants as any}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSearchQuery(topic.name)}
                                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl whitespace-nowrap border border-zinc-200/60 dark:border-zinc-800/60 transition-all bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-800`}
                            >
                                <topic.icon size={16} className="text-zinc-400" />
                                <span className="text-[14px] font-medium text-zinc-800 dark:text-zinc-200">{topic.name}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.section>

                {/* ═══ RECENTLY CURATED ═══ */}
                <section className="space-y-5">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-[13px] font-medium text-zinc-500">
                            Recently Curated
                        </h2>
                        <Link href="/curation" className="text-[12px] font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 group transition-colors">
                            View all <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-24 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 animate-pulse" />
                            ))
                        ) : (
                            trendingArticles.map((article, i) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={`/curation/${article.id}`}
                                        className="group block p-3.5 bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all relative overflow-hidden active:scale-[0.99]"
                                    >
                                        <div className="flex gap-5 items-center">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 relative border border-zinc-200/40 dark:border-zinc-700/40">
                                                {article.imageUrl ? (
                                                    <Image
                                                        src={article.imageUrl}
                                                        alt=""
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                                        <FileText size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                                                        {article.category || "General"}
                                                    </span>
                                                    <span className="text-zinc-200 dark:text-zinc-800">•</span>
                                                    <span className="text-[10px] font-medium text-zinc-400">
                                                        {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                                                    {article.title}
                                                </h3>
                                            </div>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                                <ChevronRight className="text-zinc-400" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* ═══ QUICK TAGS ═══ */}
                <section className="space-y-4">
                    <h2 className="text-[13px] font-medium text-zinc-500 px-1">
                        Quick Browse
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {["Automation", "Self-Improvement", "Intelligence", "Leverage", "Flow", "Mental Models", "Wealth", "Productivity"].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSearchQuery(tag)}
                                className="px-3.5 py-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 text-[12px] font-medium text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors active:scale-95"
                            >
                                # {tag}
                            </button>
                        ))}
                    </div>
                </section>
            </main>

            {/* Empty space for dock */}
            <div className="h-24" />
        </div>
    );
}
