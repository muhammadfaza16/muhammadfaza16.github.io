"use client";

import React, { useState } from "react";
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

// --- Consolidated Mock Data ---
const MOCK_COLLECTIONS = [
    { name: "Frameworks & Logic", count: 12, color: "bg-blue-500" },
    { name: "Market Wisdom", count: 8, color: "bg-amber-500" },
    { name: "Stoic Practicum", count: 15, color: "bg-emerald-500" },
];

const MOCK_HIGHLIGHTS = [
    {
        text: "The best way to predict the future is to invent it.",
        source: "On Digital Invention",
        author: "Alan Kay",
        color: "border-blue-500"
    },
    {
        text: "Complexity is a tax on your future agility.",
        source: "The Lean Architect",
        author: "Software Zen",
        color: "border-purple-500"
    }
];

export default function MyLibraryPage() {
    const [activeSegment, setActiveSegment] = useState<'stats' | 'vault' | 'highlights'>('stats');

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
                    { id: 'highlights', label: 'Highlights', icon: Sparkles },
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

            <div className="mb-8 mt-2 px-1">
                <DevPlaceholder />
            </div>

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
                                    <span className="text-3xl font-medium text-zinc-900 dark:text-white">12</span>
                                    <span className="text-[10px] font-medium text-zinc-400 uppercase">Days</span>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-none">
                                <Sparkles size={16} className="text-zinc-400 mb-3" />
                                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400">Total</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-medium text-zinc-900 dark:text-white">142</span>
                                    <span className="text-[10px] font-medium text-zinc-400 uppercase">Items</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <section>
                            <h2 className="text-[12px] font-medium text-zinc-400 mb-4 ml-0.5">
                                Recent Reading
                            </h2>
                            <div className="space-y-2.5">
                                {[
                                    { title: "Building a Digital Garden", progress: "80%", time: "2h ago" },
                                    { title: "The Art of Doing Science", progress: "100%", time: "Yesterday" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400">
                                            <BookOpen size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[14px] font-medium text-zinc-800 dark:text-zinc-200 truncate">{item.title}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="h-0.5 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-zinc-400 dark:bg-zinc-500" style={{ width: item.progress }} />
                                                </div>
                                                <span className="text-[10px] font-medium text-zinc-400 uppercase">{item.time}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className="text-zinc-300" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                )}

                {activeSegment === 'vault' && (
                    <motion.div
                        key="vault"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 gap-4"
                    >
                        {MOCK_COLLECTIONS.map((col) => (
                            <div key={col.name} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer">
                                <div className={`w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400`}>
                                    <Folder size={18} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-[14px] font-medium text-zinc-800 dark:text-zinc-200">{col.name}</h4>
                                    <p className="text-[10px] font-medium text-zinc-400 tracking-wider mt-0.5">{col.count} Items</p>
                                </div>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {activeSegment === 'highlights' && (
                    <motion.div
                        key="highlights"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {MOCK_HIGHLIGHTS.map((h, i) => (
                            <div key={i} className={`bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 relative`}>
                                <blockquote className="text-[17px] font-medium italic text-zinc-800 dark:text-zinc-200 mb-5 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    "{h.text}"
                                </blockquote>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                                            {h.author} — {h.source}
                                        </span>
                                    </div>
                                    <button className="p-1.5 text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
