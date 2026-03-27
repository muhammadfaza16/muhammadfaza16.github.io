"use client";

import React from "react";

export default function Loading() {
    return (
        <div className="h-[100svh] flex flex-col bg-[#fafaf8] dark:bg-[#050505] overflow-hidden">
            {/* Header / Tab Switcher Skeleton */}
            <div className="sticky top-0 z-50 bg-[#fafaf8]/85 dark:bg-[#050505]/85 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 px-4 pt-3 pb-2.5">
                <div className="max-w-2xl mx-auto">
                    <div className="h-8 w-full bg-zinc-100 dark:bg-zinc-900 rounded-lg animate-pulse relative overflow-hidden p-0.5">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-hidden p-4">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Stats Row Skeleton */}
                    <div className="h-14 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 flex divide-x divide-zinc-200/60 dark:divide-zinc-800/60 overflow-hidden animate-pulse relative">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex-1" />
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                    </div>

                    {/* Chart/Activity Section Skeleton */}
                    <section className="space-y-3">
                        <div className="w-32 h-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-full animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                        <div className="h-24 w-full bg-zinc-50 dark:bg-zinc-900/40 rounded-xl animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                    </section>

                    {/* List Section Skeleton */}
                    <section className="space-y-4">
                        <div className="w-24 h-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-full animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
                                <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800/60 animate-pulse shrink-0 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-zinc-100 dark:bg-zinc-800/60 rounded animate-pulse w-3/4 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                                    </div>
                                    <div className="h-2 bg-zinc-50 dark:bg-zinc-800/40 rounded animate-pulse w-1/2 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </main>
        </div>
    );
}
