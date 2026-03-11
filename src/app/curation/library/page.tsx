"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Flame,
    Sparkles,
    Library,
    Star,
    Folder,
    ChevronRight,
    Share2,
    LayoutGrid,
    BookOpen,
    Trophy,
    History
} from "lucide-react";
import { DevPlaceholder } from "@/components/curation/DevPlaceholder";

import Link from "next/link";
import Image from "next/image";

export default function MyLibraryPage() {
    const [activeSegment, setActiveSegment] = useState<'stats' | 'vault'>('stats');
    const [readArticles, setReadArticles] = useState<any[]>([]);
    const [savedArticles, setSavedArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                let localState = { read: {}, bookmarked: {} };
                const raw = localStorage.getItem("curation_visitor_state");
                if (raw) localState = JSON.parse(raw);

                const readIds = Object.keys(localState.read).filter(k => localState.read[k as keyof typeof localState.read]);
                const savedIds = Object.keys(localState.bookmarked).filter(k => localState.bookmarked[k as keyof typeof localState.bookmarked]);

                // Fetch all at once if we want, or just rely on API search
                // We will fetch Top 10 latest articles and filter, or hit our API (since we don't have an ID array query built-in, we just fetch 50 and filter for now)
                // Or better yet, we can't easily fetch IN(ids) without modifying API, so let's hit API without limit and filter locally for Library. (For scale, API needs updating, but works for now locally).
                const res = await fetch("/api/curation?limit=100");
                const data = await res.json();

                if (data.articles) {
                    const read = data.articles.filter((a: any) => readIds.includes(a.id));
                    const saved = data.articles.filter((a: any) => savedIds.includes(a.id));
                    setReadArticles(read);
                    setSavedArticles(saved);
                }
            } catch (err) {
                console.error("Failed to fetch library data", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    return (
        <div className="max-w-2xl mx-auto px-6 pt-12">
            <header className="mb-8">
                <h1 className="text-2xl font-medium tracking-tight mb-1 text-zinc-900 dark:text-zinc-100">Library</h1>
                <p className="text-zinc-400 text-[13px] font-medium">Activity, collections, and wisdom.</p>
            </header>

            {/* Segment Switcher */}
            <div className="flex p-1 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl mb-8 w-full">
                {[
                    { id: 'stats', label: 'Activity', icon: History },
                    { id: 'vault', label: 'Vault', icon: Library },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSegment(tab.id as any)}
                        className={`
              flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all flex-1
              ${activeSegment === tab.id
                                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                                : 'text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-400'}
            `}
                    >
                        <tab.icon size={12} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Removing dev placeholder */}

            <AnimatePresence mode="wait">
                {activeSegment === 'stats' && (
                    <motion.div
                        key="stats"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        {/* Stats Overview */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-none">
                                <History size={16} className="text-zinc-400 mb-3" />
                                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400">Streak</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-medium text-zinc-900 dark:text-white">1</span>
                                    <span className="text-[10px] font-medium text-zinc-400 uppercase">Days</span>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-none">
                                <Sparkles size={16} className="text-zinc-400 mb-3" />
                                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400">Total Read</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-medium text-zinc-900 dark:text-white">{readArticles.length}</span>
                                    <span className="text-[10px] font-medium text-zinc-400 uppercase">Items</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <section>
                            <h2 className="text-[12px] font-medium text-zinc-400 mb-4 ml-0.5">
                                Recently Read
                            </h2>
                            <div className="space-y-2.5">
                                {isLoading ? (
                                    <div className="text-[13px] text-zinc-500 py-4 text-center">Loading...</div>
                                ) : readArticles.length > 0 ? (
                                    readArticles.map((item) => (
                                        <Link href={`/curation/${item.id}`} key={item.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 group hover:border-zinc-300 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400 relative overflow-hidden">
                                                {item.imageUrl ? <Image src={item.imageUrl} alt="" fill className="object-cover" /> : <BookOpen size={16} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[14px] font-medium text-zinc-800 dark:text-zinc-200 truncate">{item.title}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-medium text-zinc-400 uppercase">{item.category || "General"}</span>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-500" />
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-[13px] text-zinc-500 py-4 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                                        No reading history yet.
                                    </div>
                                )}
                            </div>
                        </section>
                    </motion.div>
                )}

                {activeSegment === 'vault' && (
                    <motion.div
                        key="vault"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                    >
                        <h2 className="text-[12px] font-medium text-zinc-400 mb-4 ml-0.5">
                            Saved Articles
                        </h2>
                        {isLoading ? (
                            <div className="text-[13px] text-zinc-500 py-4 text-center">Loading...</div>
                        ) : savedArticles.length > 0 ? (
                            savedArticles.map((article) => (
                                <Link key={article.id} href={`/curation/${article.id}`} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer">
                                    <div className={`w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 relative overflow-hidden`}>
                                        {article.imageUrl ? <Image src={article.imageUrl} alt="" fill className="object-cover" /> : <Folder size={18} />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[14px] font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1">{article.title}</h4>
                                        <p className="text-[10px] font-medium text-zinc-400 tracking-wider mt-0.5">{article.category || "General"}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">
                                        <ChevronRight size={16} />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-[13px] text-zinc-500 py-10 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                                No saved articles found. <Link href="/curation" className="text-blue-500 hover:underline">Explore</Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
