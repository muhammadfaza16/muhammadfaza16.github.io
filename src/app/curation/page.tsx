"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, Bookmark, FileText } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

type ArticleMeta = {
    id: string;
    title: string;
    url?: string | null;
    coverImage: string | null;
    imageUrl?: string | null;
    createdAt: string;
    isRead: boolean;
};

type FilterType = "all" | "unread" | "read";

export default function CurationList() {
    const [articles, setArticles] = useState<ArticleMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>("all");

    // Initialize Supabase once so we can generate public URLs
    const supabase = getSupabase();

    useEffect(() => {
        fetch("/api/curation", { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setArticles(data);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const filteredArticles = articles.filter(a => {
        if (filter === "unread") return !a.isRead;
        if (filter === "read") return a.isRead;
        return true;
    });

    return (
        <div className="h-screen w-full flex flex-col bg-white text-zinc-900 font-sans antialiased overflow-hidden relative selection:bg-zinc-200">

            {/* Ambient Background (Fixed) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-100/60 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-100/50 blur-[100px]" />
            </div>

            {/* Glass Header */}
            <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-xl border-b border-gray-200/50 shrink-0 pb-3 pt-5 px-5 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <Link href="/" className="w-11 h-11 flex items-center justify-center text-zinc-900 active:bg-gray-100 active:scale-90 rounded-full transition-all bg-white/50 backdrop-blur-md shadow-sm border border-gray-100">
                        <ChevronLeft size={24} />
                    </Link>
                    <h2 className="text-[18px] font-bold tracking-tight text-zinc-900">Curation</h2>
                    <div className="w-11" /> {/* Spacer for centering */}
                </div>

                {/* Premium Segmented Control */}
                <div className="flex bg-gray-100/70 p-1 rounded-xl w-full">
                    <button
                        onClick={() => setFilter("all")}
                        className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all active:scale-[0.98] ${filter === "all" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter("unread")}
                        className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all active:scale-[0.98] ${filter === "unread" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
                    >
                        Unread
                    </button>
                    <button
                        onClick={() => setFilter("read")}
                        className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all active:scale-[0.98] ${filter === "read" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
                    >
                        Read
                    </button>
                </div>
            </header>

            {/* Scrollable List Container */}
            <main className="flex-1 overflow-y-auto px-5 pt-4 pb-32 relative z-10 w-full max-w-2xl mx-auto">
                <div className="flex flex-col gap-3">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="skeleton"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col gap-3 w-full"
                            >
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="relative overflow-hidden w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between min-h-[90px]"
                                    >
                                        {/* Shimmer Effect */}
                                        <div
                                            className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                        />

                                        {/* Text Content Skeleton */}
                                        <div className="flex flex-col flex-1 pr-6 gap-3">
                                            {/* Domain Label */}
                                            <div className="h-3 w-16 bg-white/10 rounded-full" />
                                            {/* Title Lines */}
                                            <div className="flex flex-col gap-2">
                                                <div className="h-4 w-3/4 bg-white/20 rounded-full" />
                                                <div className="h-4 w-1/2 bg-white/20 rounded-full" />
                                            </div>
                                        </div>

                                        {/* Thumbnail Skeleton (3:4 aspect ratio) */}
                                        <div className="w-16 h-[85px] rounded-[14px] bg-white/10 shrink-0" />
                                    </div>
                                ))}
                            </motion.div>
                        ) : filteredArticles.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20 opacity-50 text-zinc-400 w-full"
                            >
                                <Bookmark size={48} className="mb-4" strokeWidth={1.5} />
                                <p className="text-lg font-medium tracking-tight">No articles found.</p>
                            </motion.div>
                        ) : (
                            <AnimatePresence>
                                {filteredArticles.map((article, index) => {
                                    // 1. Extract domain for metadata from actual URL
                                    let domain = "";
                                    if (article.url) {
                                        try {
                                            domain = new URL(article.url).hostname.replace('www.', '');
                                        } catch (_) {
                                            domain = article.url.substring(0, 30); // fallback if malformed
                                        }
                                    }

                                    // 2. Determine valid image url from Supabase
                                    let validImageUrl: string | null = null;
                                    const activeImage = article.imageUrl || article.coverImage;

                                    if (activeImage) {
                                        // Make sure we have a full public URL, not just a filename
                                        if (activeImage.startsWith('http')) {
                                            validImageUrl = activeImage;
                                        } else if (supabase) {
                                            const { data } = supabase.storage.from('images').getPublicUrl(activeImage);
                                            validImageUrl = data.publicUrl;
                                        }
                                    }

                                    const isLast = index === filteredArticles.length - 1;

                                    return (
                                        <motion.div
                                            key={article.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                                        >
                                            <Link
                                                href={`/curation/${article.id}`}
                                                className={`block active:bg-gray-50/80 transition-colors ${!isLast ? 'border-b border-gray-200/50' : ''}`}
                                            >
                                                <div className="flex items-center justify-between py-4 pr-1 min-h-[90px]">

                                                    {/* Text Content */}
                                                    <div className="flex flex-col flex-1 pr-6 min-w-0 justify-center">
                                                        {(domain || !article.isRead) && (
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                {!article.isRead && (
                                                                    <div className="w-[6px] h-[6px] rounded-full bg-blue-500 shrink-0" />
                                                                )}
                                                                {domain && (
                                                                    <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-400 truncate">
                                                                        {domain}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        <h3 className="text-[16px] font-bold tracking-tight text-zinc-900 leading-tight mb-2 line-clamp-2">
                                                            {article.title}
                                                        </h3>
                                                        <span className="text-[12px] font-medium text-zinc-400">
                                                            {formatDistanceToNow(new Date(article.createdAt))} ago
                                                        </span>
                                                    </div>

                                                    {/* Thumbnail or Fallback */}
                                                    {validImageUrl && (
                                                        <div className="w-16 h-16 rounded-[14px] overflow-hidden bg-gray-50 shrink-0 border border-gray-200/60 relative">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={validImageUrl}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                                    if (fallback) fallback.style.display = 'flex';
                                                                }}
                                                            />
                                                            {/* Graceful Fallback (Hidden by Default) */}
                                                            <div className="w-full h-full hidden flex-col items-center justify-center absolute inset-0 text-gray-300">
                                                                <FileText size={20} strokeWidth={1.5} />
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
