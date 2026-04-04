"use client";

import React from "react";

export default function Loading() {
    return (
        <div className="h-[100svh] flex flex-col bg-[#fafaf8] dark:bg-[#050505] overflow-hidden">
            {/* Header Skeleton */}
            <div className="h-14 border-b border-zinc-200/40 dark:border-zinc-800/40 flex items-center px-4 shrink-0">
                <div className="w-24 h-4 bg-zinc-100 dark:bg-zinc-800/60 rounded-full animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                </div>
            </div>

            <main className="flex-1 overflow-hidden p-4 space-y-8">
                {/* Hero Carousel Skeleton */}
                <div className="aspect-[16/10] md:aspect-[21/9] rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                </div>

                {/* Filter Bar Skeleton */}
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-8 w-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-full animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                    ))}
                </div>

                {/* Article List Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex gap-3 py-2 border-b border-zinc-100 dark:border-zinc-800/40 last:border-0">
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 animate-pulse shrink-0 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800/60 rounded animate-pulse relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                                </div>
                                <div className="h-2 w-1/2 bg-zinc-50 dark:bg-zinc-800/40 rounded animate-pulse relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
