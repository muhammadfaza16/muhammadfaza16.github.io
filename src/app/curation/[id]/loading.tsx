"use client";

import React from "react";

export default function Loading() {
    return (
        <div className="h-[100svh] flex flex-col bg-white dark:bg-[#030303] antialiased overflow-hidden">
            <div className="h-[3px] w-full" />
            <div className="flex-1 overflow-y-auto">
                {/* Back button skeleton */}
                <div className="max-w-3xl mx-auto px-5 md:px-12 pt-4 pb-1 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                    </div>
                </div>

                {/* Cover Image skeleton */}
                <div className="w-full aspect-[2.4/1] bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden mb-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer" />
                </div>

                {/* Content skeleton */}
                <div className="max-w-3xl mx-auto px-5 md:px-12 pt-2 space-y-8">
                    <div className="space-y-4">
                        {/* Category tag */}
                        <div className="h-3 w-20 bg-blue-100/50 dark:bg-blue-900/20 rounded-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                        {/* Title lines */}
                        <div className="space-y-3">
                            <div className="h-9 bg-zinc-100 dark:bg-zinc-900 rounded-xl relative overflow-hidden w-[95%]">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                            </div>
                            <div className="h-9 bg-zinc-100 dark:bg-zinc-900 rounded-xl relative overflow-hidden w-[70%]">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer" />
                            </div>
                        </div>
                    </div>

                    {/* Metadata line */}
                    <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-8">
                        <div className="h-4 w-32 bg-zinc-50 dark:bg-zinc-900/50 rounded-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                        <div className="h-1 w-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-4 w-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                    </div>

                    {/* Body text paragraphs */}
                    <div className="space-y-4 pt-2">
                        <div className="h-4 bg-zinc-50 dark:bg-zinc-900/40 rounded relative overflow-hidden w-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                        <div className="h-4 bg-zinc-50 dark:bg-zinc-900/40 rounded relative overflow-hidden w-[96%]">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                    </div>
                    <div className="space-y-4 pt-4">
                        <div className="h-4 bg-zinc-50 dark:bg-zinc-900/40 rounded relative overflow-hidden w-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                        <div className="h-4 bg-zinc-50 dark:bg-zinc-900/40 rounded relative overflow-hidden w-[30%]">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
