"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Sparkles,
    MessageSquareQuote,
    Calendar,
    ArrowUpRight,
    Share2,
    Bookmark,
    Search,
    Filter
} from "lucide-react";

// Mock since user wants visual prototype focus, but integrated into live route
const MOCK_HIGHLIGHTS = [
    {
        text: "The best way to predict the future is to invent it. This requires not just foresight, but the courage to build in public and iterate through failure.",
        source: "On Digital Invention",
        author: "Alan Kay (re-interpreted)",
        date: "Collected 2d ago",
        color: "border-blue-500"
    },
    {
        text: "Complexity is a tax on your future agility. Every unnecessary abstraction is a mortgage you'll pay for with velocity.",
        source: "The Lean Architect",
        author: "Software Zen",
        date: "Collected 1w ago",
        color: "border-purple-500"
    },
    {
        text: "Your attention is your most scarce resource. Protect it like your capital.",
        source: "Deep Work Praxis",
        author: "Cal Newport",
        date: "Collected 1 month ago",
        color: "border-amber-500"
    }
];

export default function CurationHighlightsPage() {
    return (
        <div className="max-w-2xl mx-auto px-6 pt-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Mind Palace</h1>
                    <p className="text-zinc-500 text-sm font-medium italic underline underline-offset-4 decoration-purple-200">
                        Where your readings turn into wisdom.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                        <Search size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Highlights Flow */}
            <div className="space-y-8 pb-32">
                {MOCK_HIGHLIGHTS.map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className={`bg-white dark:bg-zinc-900 border-l-[6px] ${h.color} p-8 rounded-r-[2.5rem] rounded-l-md shadow-sm border-y border-r border-zinc-100 dark:border-zinc-800 relative group`}
                    >
                        <div className="absolute top-4 right-4 text-zinc-100 dark:text-zinc-800/20 group-hover:text-purple-500/10 transition-colors">
                            <MessageSquareQuote size={48} strokeWidth={1} />
                        </div>

                        <blockquote className="text-xl font-medium leading-relaxed text-zinc-800 dark:text-zinc-200 mb-8 relative z-10 font-[serif] italic">
                            "{h.text}"
                        </blockquote>

                        <div className="flex flex-col gap-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                                        <Sparkles size={18} className="text-purple-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{h.source}</h4>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{h.author}</p>
                                    </div>
                                </div>
                                <button className="p-3 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
                                    <ArrowUpRight size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-zinc-50 dark:border-zinc-900/50">
                                <div className="flex items-center gap-1.5 text-zinc-400">
                                    <Calendar size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{h.date}</span>
                                </div>
                                <div className="flex-1" />
                                <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                    <Share2 size={16} />
                                </button>
                                <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                    <Bookmark size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Floating Insight Card (Personified Element) */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-44 left-0 right-0 px-6 z-40 pointer-events-none"
            >
                <div className="max-w-2xl mx-auto pointer-events-auto">
                    <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-6 rounded-[2rem] shadow-2xl flex items-center justify-between border border-zinc-200 dark:border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center animate-pulse">
                                <Sparkles size={20} className="text-blue-500" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold">Deep Synthesizer</h5>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Mastering: Systems Thinking</p>
                            </div>
                        </div>
                        <button className="px-6 py-2.5 bg-blue-600 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-xs font-bold active:scale-95 transition-all">
                            Generate Insights
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
