"use client";

import React from "react";

export default function Loading() {
    return (
        <div className="h-[100svh] flex flex-col bg-[#fafaf8] dark:bg-[#050505] overflow-hidden">
            {/* Search Header Skeleton */}
            <div className="h-16 border-b border-zinc-200/40 dark:border-zinc-800/40 flex items-center px-4 shrink-0">
                <div className="w-full max-w-[800px] mx-auto">
                    <div className="h-9 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-full animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-hidden p-4 space-y-6">
                {/* Stats Grid Skeleton */}
                <div className="h-14 border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl flex divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden animate-pulse relative">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex-1" />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                </div>

                {/* Sub-Header + Filter Skeleton */}
                <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-zinc-100 dark:bg-zinc-800/60 rounded-full animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                    </div>
                    <div className="w-20 h-4 bg-zinc-100 dark:bg-zinc-800/60 rounded-full animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                    </div>
                </div>

                {/* Article List Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
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
