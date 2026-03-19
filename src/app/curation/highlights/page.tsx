"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Sparkles,
    MessageSquareQuote,
    Calendar,
    ArrowUpRight,
    Share2,
    Bookmark,
    Search,
    Filter,
    ArrowLeft,
    Sun,
    Moon,
    Menu,
    X
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { AtlasMenu } from "@/components/AtlasMenu";

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
    const { theme, setTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isAtlasMenuOpen, setIsAtlasMenuOpen] = useState(false);

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    const VERTICALS = [
        { label: "Books", href: "/curation/books" },
        { label: "Skills Lab", href: "/curation/skills" },
        { label: "Frameworks", href: "/curation/frameworks" },
        { label: "Codex", href: "/curation/codex" },
        { label: "Collections", href: "/curation/collections" },
        { label: "Recap", href: "/curation/recap" },
        { label: "Highlights", href: "/curation/highlights" },
    ];

    const filtered = MOCK_HIGHLIGHTS.filter(h => 
        !searchQuery || h.text.toLowerCase().includes(searchQuery.toLowerCase()) || h.source.toLowerCase().includes(searchQuery.toLowerCase()) || h.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] pb-32">
            {/* Header */}
            <header className="sticky top-0 z-[110] bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 shrink-0 transition-colors duration-500">
                <div className="h-16 flex items-center px-4">
                    {/* Left: Back */}
                    <motion.div 
                        animate={{ width: searchQuery || isSearchFocused ? 0 : 48, opacity: searchQuery || isSearchFocused ? 0 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        className="flex items-center overflow-hidden"
                    >
                        <AnimatePresence mode="popLayout">
                            {!isSearchFocused && !searchQuery && (
                                <motion.div
                                    key="back-button"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        href="/curation"
                                        className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all"
                                    >
                                        <ArrowLeft size={18} />
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Center: Search */}
                    <div className="flex-1 flex justify-center px-2">
                        <motion.div 
                            layout
                            className="w-full"
                            animate={{ maxWidth: searchQuery || isSearchFocused ? "800px" : "240px" }}
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        >
                            <div className="relative group max-w-4xl mx-auto">
                                <Search
                                    size={14}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors"
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    placeholder="Search highlights..."
                                    className="w-full h-9 bg-zinc-100/60 dark:bg-zinc-800/60 border border-transparent focus:bg-white dark:focus:bg-zinc-900/50 focus:border-zinc-200 dark:focus:border-zinc-700/50 rounded-full pl-9 pr-9 text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500/80 transition-all outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                                    >
                                        <X size={14} className="text-zinc-400" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Actions */}
                    <motion.div 
                        animate={{ width: searchQuery || isSearchFocused ? 0 : 80, opacity: searchQuery || isSearchFocused ? 0 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        className="flex items-center justify-end overflow-hidden"
                    >
                        <AnimatePresence mode="popLayout">
                            {!isSearchFocused && !searchQuery && (
                                <motion.div
                                    key="header-actions"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-0.5"
                                >
                                    <button
                                        onClick={toggleTheme}
                                        className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all relative overflow-hidden"
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.div
                                                key={theme}
                                                initial={{ y: -20, opacity: 0, scale: 0.5, rotate: -90 }}
                                                animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                                                exit={{ y: 20, opacity: 0, scale: 0.5, rotate: 90 }}
                                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                                className="absolute flex items-center justify-center"
                                            >
                                                {theme === "dark" ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
                                            </motion.div>
                                        </AnimatePresence>
                                    </button>
                                    <button
                                        onClick={() => setIsAtlasMenuOpen(!isAtlasMenuOpen)}
                                        className="w-9 h-9 flex items-center justify-center text-zinc-900 dark:text-zinc-100 active:scale-90 rounded-full transition-all relative z-[110]"
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={isAtlasMenuOpen ? "close" : "menu"}
                                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {isAtlasMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
                                            </motion.div>
                                        </AnimatePresence>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 font-[serif]">Highlights</h1>
                    <p className="text-zinc-500 text-sm font-medium italic underline underline-offset-4 decoration-purple-200 mb-10">
                        Where your readings turn into wisdom.
                    </p>
                </div>
            </div>

            {/* Highlights Flow */}
            <div className="space-y-8 pb-32 px-6">
                <AnimatePresence>
                    {filtered.map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className={`bg-white dark:bg-zinc-900 border-l-[6px] ${h.color} p-8 rounded-r-[2.5rem] rounded-l-md shadow-sm border-y border-r border-zinc-100 dark:border-zinc-800 relative group max-w-2xl mx-auto`}
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
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{h.author}</p>
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
                </AnimatePresence>
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
                                <h5 className="text-sm font-bold">Insight Engine</h5>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Synthesizing: Systems Thinking</p>
                            </div>
                        </div>
                        <button className="px-6 py-2.5 bg-blue-600 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-xs font-bold active:scale-95 transition-all">
                            Generate Insights
                        </button>
                    </div>
                </div>
            </motion.div>
            {/* ═══ ATLAS MENU ═══ */}
            <AtlasMenu items={VERTICALS} isOpen={isAtlasMenuOpen} onClose={() => setIsAtlasMenuOpen(false)} />
        </div>
    );
}
