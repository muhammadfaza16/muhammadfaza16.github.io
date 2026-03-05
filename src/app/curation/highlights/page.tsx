"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, Trash2, X } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

type Highlight = { text: string; ts: number };
type ArticleHighlights = { articleId: string; title: string; highlights: Highlight[] };

export default function HighlightsPage() {
    const [allHighlights, setAllHighlights] = useState<ArticleHighlights[]>([]);

    useEffect(() => {
        try {
            const results: ArticleHighlights[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('curation_highlights_')) {
                    const articleId = key.replace('curation_highlights_', '');
                    const highlights: Highlight[] = JSON.parse(localStorage.getItem(key) || '[]');
                    if (highlights.length > 0) {
                        results.push({ articleId, title: '', highlights });
                    }
                }
            }

            // Fetch article titles
            if (results.length > 0) {
                fetch('/api/curation?limit=100&sort=latest')
                    .then(r => r.json())
                    .then(data => {
                        if (data.articles) {
                            const titleMap = new Map<string, string>();
                            data.articles.forEach((a: any) => titleMap.set(a.id, a.title));
                            results.forEach(r => r.title = titleMap.get(r.articleId) || 'Untitled');
                        }
                        setAllHighlights(results.sort((a, b) =>
                            Math.max(...b.highlights.map(h => h.ts)) - Math.max(...a.highlights.map(h => h.ts))
                        ));
                    })
                    .catch(() => setAllHighlights(results));
            }
        } catch { }
    }, []);

    const removeHighlight = (articleId: string, index: number) => {
        setAllHighlights(prev => {
            const updated = prev.map(a => {
                if (a.articleId !== articleId) return a;
                const newHighlights = a.highlights.filter((_, i) => i !== index);
                try { localStorage.setItem(`curation_highlights_${articleId}`, JSON.stringify(newHighlights)); } catch { }
                return { ...a, highlights: newHighlights };
            }).filter(a => a.highlights.length > 0);
            return updated;
        });
        toast.success('Highlight removed');
    };

    const clearArticleHighlights = (articleId: string) => {
        try { localStorage.removeItem(`curation_highlights_${articleId}`); } catch { }
        setAllHighlights(prev => prev.filter(a => a.articleId !== articleId));
        toast.success('All highlights cleared');
    };

    const totalCount = allHighlights.reduce((sum, a) => sum + a.highlights.length, 0);

    return (
        <div className="min-h-screen bg-[#fafaf8] text-zinc-900 font-sans antialiased selection:bg-amber-100">
            <Toaster position="bottom-center" />
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />

            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf8]/80 border-b border-zinc-200/50">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
                    <Link href="/curation" className="p-2 -ml-2 rounded-full hover:bg-zinc-100 active:scale-95 transition-all">
                        <ArrowLeft size={20} className="text-zinc-600" />
                    </Link>
                    <h1 className="text-[16px] font-bold tracking-tight">Your Highlights</h1>
                    <span className="ml-auto text-[12px] font-medium text-zinc-400">{totalCount} total</span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8 pb-32">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h2 className="text-[28px] font-bold tracking-[-0.03em] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        <Sparkles size={24} className="inline-block mr-2 text-amber-500" />
                        Highlights & Notes
                    </h2>
                    <p className="text-[15px] text-zinc-500">All your saved highlights across articles, in one place.</p>
                </motion.div>

                {allHighlights.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                        <Sparkles size={48} className="text-zinc-200 mx-auto mb-4" strokeWidth={1.5} />
                        <p className="text-[16px] font-semibold text-zinc-400 mb-2">No highlights yet</p>
                        <p className="text-[14px] text-zinc-400 mb-6">Select text while reading an article to highlight it.</p>
                        <Link href="/curation" className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-full active:scale-95 transition-all">
                            Browse Articles
                        </Link>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {allHighlights.map((article) => (
                            <motion.div
                                key={article.articleId}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden"
                            >
                                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                                    <Link
                                        href={`/curation/${article.articleId}`}
                                        className="text-[15px] font-bold text-zinc-800 hover:text-blue-600 transition-colors truncate flex-1 mr-3"
                                    >
                                        {article.title}
                                    </Link>
                                    <button
                                        onClick={() => clearArticleHighlights(article.articleId)}
                                        className="p-1.5 rounded-full hover:bg-red-50 text-zinc-300 hover:text-red-500 transition-all shrink-0"
                                        title="Clear all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    {article.highlights.map((h, i) => (
                                        <div key={i} className="flex gap-3 group">
                                            <div className="w-1 rounded-full bg-amber-300 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14px] text-zinc-700 leading-relaxed italic">
                                                    &ldquo;{h.text}&rdquo;
                                                </p>
                                                <p className="text-[11px] text-zinc-400 mt-1">
                                                    {new Date(h.ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeHighlight(article.articleId, i)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-zinc-100 transition-all shrink-0 self-start"
                                            >
                                                <X size={14} className="text-zinc-400" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
