"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Plus, Feather } from "lucide-react";

type PostPartial = {
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
    createdAt: string;
};

export default function JournalFeedPage() {
    const [posts, setPosts] = useState<PostPartial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/writing")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPosts(data);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    // Glass-Neumorphism Design Tokens
    const baseBg = "#e0e5ec";
    const textPrimary = "#4a4a4a";
    const textSecondary = "#8b9bb4";

    const glassNeuExtruded = {
        background: "rgba(224, 229, 236, 0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "9px 9px 16px rgba(163,177,198,0.5), -9px -9px 16px rgba(255,255,255, 0.8)",
        borderRadius: "24px",
    };

    const glassNeuButton = {
        background: "rgba(224, 229, 236, 0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "5px 5px 10px rgba(163,177,198,0.5), -5px -5px 10px rgba(255,255,255, 0.8)",
        borderRadius: "16px",
        transition: "all 0.2s ease",
    };

    return (
        <div
            className="min-h-[100svh] w-full font-sans antialiased flex flex-col items-center p-4 md:p-12 relative z-50 overflow-hidden"
            style={{
                backgroundColor: baseBg,
                color: textPrimary,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            }}
        >
            {/* Ambient Glassmorphism Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[0%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-300/30 blur-[80px]" />
                <div className="absolute top-[20%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-purple-300/20 blur-[90px]" />
                <div className="absolute bottom-[-10%] left-[15%] w-[50vw] h-[50vw] rounded-full bg-teal-200/30 blur-[100px]" />
            </div>

            <div className="w-full max-w-2xl flex-grow flex flex-col relative z-10 pb-20">
                {/* Header Navigation */}
                <div className="w-full flex items-center justify-between mb-10 pt-4 sticky top-0 z-20">
                    <Link
                        href="/"
                        className="flex items-center justify-center w-12 h-12 active:scale-95 transition-transform"
                        style={glassNeuButton}
                    >
                        <ChevronLeft size={24} className="text-[#8b9bb4] -ml-1" />
                    </Link>
                    <div className="text-sm font-bold tracking-widest uppercase text-[#8b9bb4] px-4 py-2 rounded-full" style={glassNeuExtruded}>
                        Journal
                    </div>
                    <Link
                        href="/master"
                        className="flex items-center justify-center w-12 h-12 active:scale-95 transition-transform"
                        style={glassNeuButton}
                    >
                        <Plus size={24} className="text-[#4a4a4a]" />
                    </Link>
                </div>

                {/* Title Section */}
                <div className="px-2 mb-10 relative text-center">
                    <Feather size={48} className="mx-auto mb-6 text-[#8b9bb4]" strokeWidth={1} />
                    <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-4" style={{ color: textPrimary, fontWeight: 400 }}>
                        Writings
                    </h1>
                    <p className="text-[15px] font-medium max-w-md mx-auto leading-relaxed" style={{ color: textSecondary }}>
                        Thoughts, essays, and technical deep dives. Documented for clarity and future reflection.
                    </p>
                </div>

                {/* Feed List */}
                <div className="flex flex-col gap-6 relative px-2">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-32 w-full animate-pulse opacity-50" style={glassNeuExtruded}></div>
                        ))
                    ) : posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <p className="text-lg font-medium tracking-tight">The ink is dry. No recordings exist yet.</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {posts.map((post, index) => {
                                const dateObj = new Date(post.createdAt);
                                const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                const year = dateObj.getFullYear();

                                return (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <Link href={`/journal/${post.slug}`} className="block group">
                                            <div
                                                className="p-6 md:p-8 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:scale-[1.01] active:scale-[0.99] transition-transform duration-300"
                                                style={glassNeuExtruded}
                                            >
                                                {/* Date Badge */}
                                                <div className="flex flex-col items-center justify-center shrink-0 w-16 h-16 rounded-[12px] bg-white/40 shadow-inner ring-1 ring-black/5">
                                                    <span className="text-[10px] font-bold tracking-widest text-[#8b9bb4]">{month}</span>
                                                    <span className="text-lg font-extrabold text-[#4a4a4a] leading-none">{dateObj.getDate()}</span>
                                                </div>

                                                <div className="flex-grow flex flex-col gap-2 min-w-0">
                                                    <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight leading-snug group-hover:text-blue-900 transition-colors" style={{ color: textPrimary }}>
                                                        {post.title}
                                                    </h2>
                                                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: textSecondary }}>
                                                        {year} • Essay
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
