"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, Flame, Trophy, Clock, TrendingUp } from "lucide-react";

type ReadEntry = { id: string; ts: number };
type VisitorState = { read: Record<string, boolean>; bookmarked: Record<string, boolean> };

const CATEGORIES = [
    { name: "AI & Tools", emoji: "🤖" },
    { name: "Wealth & Business", emoji: "💰" },
    { name: "Mindset & Philosophy", emoji: "🧠" },
    { name: "Self-Improvement & Productivity", emoji: "⚡" },
    { name: "Career & Skills", emoji: "🎯" },
    { name: "Marketing & Growth", emoji: "📈" },
    { name: "Building & Design", emoji: "🔨" },
    { name: "Health & Lifestyle", emoji: "🌱" },
];

export default function CurationRecapPage() {
    const [weeklyReads, setWeeklyReads] = useState(0);
    const [totalReads, setTotalReads] = useState(0);
    const [totalBookmarks, setTotalBookmarks] = useState(0);
    const [streak, setStreak] = useState(0);
    const [topCategories, setTopCategories] = useState<{ name: string; emoji: string; count: number }[]>([]);
    const [recentReads, setRecentReads] = useState<{ id: string; title: string; ts: number }[]>([]);
    const [totalReadingTimeMins, setTotalReadingTimeMins] = useState(0);

    useEffect(() => {
        // Load all data from localStorage
        try {
            const vs: VisitorState = JSON.parse(localStorage.getItem('curation_visitor_state') || '{"read":{},"bookmarked":{}}');
            const history: ReadEntry[] = JSON.parse(localStorage.getItem('curation_read_history') || '[]');

            // Total stats
            setTotalReads(Object.keys(vs.read).length);
            setTotalBookmarks(Object.keys(vs.bookmarked).length);

            // Weekly reads
            const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            const recentHistory = history.filter(h => h.ts > oneWeekAgo);
            setWeeklyReads(recentHistory.length);

            // Streak calculation (consecutive days with reads)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let currentStreak = 0;
            const dayMs = 24 * 60 * 60 * 1000;
            for (let i = 0; i < 365; i++) {
                const dayStart = today.getTime() - i * dayMs;
                const dayEnd = dayStart + dayMs;
                const hasRead = history.some(h => h.ts >= dayStart && h.ts < dayEnd);
                if (hasRead) {
                    currentStreak++;
                } else if (i > 0) {
                    break; // streak broken
                }
            }
            setStreak(currentStreak);

            // Fetch article details for category analysis
            fetch('/api/curation?limit=100&sort=latest')
                .then(r => r.json())
                .then(data => {
                    if (!data.articles) return;
                    const articleMap = new Map<string, any>();
                    data.articles.forEach((a: any) => articleMap.set(a.id, a));

                    // Top categories from read articles
                    const catCounts: Record<string, number> = {};
                    Object.keys(vs.read).forEach(aid => {
                        const art = articleMap.get(aid);
                        if (art?.category) {
                            catCounts[art.category] = (catCounts[art.category] || 0) + 1;
                        }
                    });

                    const sorted = Object.entries(catCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 4)
                        .map(([name, count]) => {
                            const cat = CATEGORIES.find(c => c.name === name);
                            return { name, emoji: cat?.emoji || "📄", count };
                        });
                    setTopCategories(sorted);

                    // Recent reads with titles
                    const recent = history
                        .sort((a, b) => b.ts - a.ts)
                        .slice(0, 10)
                        .map(h => {
                            const art = articleMap.get(h.id);
                            return { id: h.id, title: art?.title || 'Untitled', ts: h.ts };
                        });
                    setRecentReads(recent);

                    // Estimate total reading time (average 5 min per article)
                    setTotalReadingTimeMins(Object.keys(vs.read).length * 5);
                })
                .catch(() => { });
        } catch { }
    }, []);

    const formatRelativeTime = (ts: number) => {
        const diff = Date.now() - ts;
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div className="min-h-screen bg-[#fafaf8] text-zinc-900 font-sans antialiased selection:bg-amber-100">
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />

            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf8]/80 border-b border-zinc-200/50">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
                    <Link href="/curation" className="p-2 -ml-2 rounded-full hover:bg-zinc-100 active:scale-95 transition-all">
                        <ArrowLeft size={20} className="text-zinc-600" />
                    </Link>
                    <h1 className="text-[16px] font-bold tracking-tight">Your Reading Recap</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8 pb-32">
                {/* Hero Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h2 className="text-[32px] font-bold tracking-[-0.03em] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Reading Recap
                    </h2>
                    <p className="text-[15px] text-zinc-500 mb-8">Your personal reading journey at a glance.</p>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-zinc-200/80 p-5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                    <BookOpen size={16} className="text-blue-500" />
                                </div>
                            </div>
                            <p className="text-[28px] font-bold tracking-tight text-zinc-900">{totalReads}</p>
                            <p className="text-[12px] font-medium text-zinc-400 uppercase tracking-wider">Articles Read</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl border border-zinc-200/80 p-5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                                    <Flame size={16} className="text-orange-500" />
                                </div>
                            </div>
                            <p className="text-[28px] font-bold tracking-tight text-zinc-900">{weeklyReads}</p>
                            <p className="text-[12px] font-medium text-zinc-400 uppercase tracking-wider">This Week</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl border border-zinc-200/80 p-5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                                    <Trophy size={16} className="text-purple-500" />
                                </div>
                            </div>
                            <p className="text-[28px] font-bold tracking-tight text-zinc-900">{streak}</p>
                            <p className="text-[12px] font-medium text-zinc-400 uppercase tracking-wider">Day Streak</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white rounded-2xl border border-zinc-200/80 p-5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                    <Clock size={16} className="text-emerald-500" />
                                </div>
                            </div>
                            <p className="text-[28px] font-bold tracking-tight text-zinc-900">~{totalReadingTimeMins}</p>
                            <p className="text-[12px] font-medium text-zinc-400 uppercase tracking-wider">Min Read</p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Top Categories */}
                {topCategories.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-10"
                    >
                        <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase mb-4 flex items-center gap-2">
                            <TrendingUp size={14} />
                            Your Top Topics
                        </h3>
                        <div className="flex flex-col gap-2">
                            {topCategories.map((cat, i) => (
                                <div key={cat.name} className="flex items-center gap-3 bg-white rounded-xl border border-zinc-200/80 p-4">
                                    <span className="text-2xl">{cat.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[14px] font-bold text-zinc-800 truncate">{cat.name}</p>
                                        <p className="text-[12px] text-zinc-400">{cat.count} article{cat.count !== 1 ? 's' : ''} read</p>
                                    </div>
                                    <span className="text-[12px] font-bold text-zinc-300">#{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Recent Reads */}
                {recentReads.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase mb-4">Recent Reading History</h3>
                        <div className="flex flex-col gap-1">
                            {recentReads.map((entry, i) => (
                                <Link
                                    key={`${entry.id}-${i}`}
                                    href={`/curation/${entry.id}`}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
                                >
                                    <span className="text-[13px] font-bold text-zinc-200 w-6 text-right shrink-0">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[14px] font-semibold text-zinc-700 truncate group-hover:text-blue-600 transition-colors">
                                            {entry.title}
                                        </p>
                                    </div>
                                    <span className="text-[11px] text-zinc-400 shrink-0">
                                        {formatRelativeTime(entry.ts)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {totalReads === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <BookOpen size={48} className="text-zinc-200 mx-auto mb-4" strokeWidth={1.5} />
                        <p className="text-[16px] font-semibold text-zinc-400 mb-2">No reading history yet</p>
                        <p className="text-[14px] text-zinc-400 mb-6">Start reading articles and your stats will appear here.</p>
                        <Link
                            href="/curation"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-full active:scale-95 transition-all"
                        >
                            Browse Articles
                        </Link>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
