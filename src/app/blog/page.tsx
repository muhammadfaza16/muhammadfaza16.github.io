"use client";

import React from "react";
import Link from "next/link";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const BLOG_POSTS = [
    {
        title: "Building Digital Sanctuaries",
        date: "Feb 10, 2026",
        excerpt: "Why we need calmer, more intentional spaces on the internet.",
        slug: "building-digital-sanctuaries"
    },
    {
        title: "The Art of Subtracting",
        date: "Jan 24, 2026",
        excerpt: "How removing features can actually increase value and focus.",
        slug: "art-of-subtracting"
    },
    {
        title: "Next.js at the Edge",
        date: "Dec 15, 2025",
        excerpt: "Exploring the performance benefits of edge computing.",
        slug: "nextjs-edge"
    },
    {
        title: "Designing for Sunlight",
        date: "Nov 02, 2025",
        excerpt: "Using natural light metaphors in interface design.",
        slug: "designing-for-sunlight"
    }
];

export default function BlogPage() {
    return (
        <AtmosphericBackground variant="sage">
            <main className="min-h-screen p-6 md:p-12 relative">

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="fixed top-6 left-6 z-20"
                >
                    <Link href="/portfolio" className="text-sm font-medium text-ink-secondary hover:text-ink-primary transition-colors no-underline">
                        ← portfolio
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto pt-20 md:pt-32"
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-ink-primary mb-2 tracking-tight">Writing</h1>
                    <p className="text-ink-secondary mb-12 italic opacity-80">Thoughts on building, design, and life.</p>

                    <div className="flex flex-col gap-10">
                        {BLOG_POSTS.map((post, i) => (
                            <motion.article
                                key={post.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (i * 0.1) }}
                                className="group cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-2">
                                    <h2 className="text-xl font-semibold text-ink-primary group-hover:text-accent-red transition-colors">
                                        {post.title}
                                    </h2>
                                    <span className="text-sm text-ink-muted font-mono opacity-70 whitespace-nowrap">
                                        {post.date}
                                    </span>
                                </div>
                                <p className="text-ink-secondary leading-relaxed max-w-lg">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-sm font-medium text-ink-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                    Read more <ArrowUpRight size={14} />
                                </div>
                            </motion.article>
                        ))}
                    </div>

                </motion.div>
            </main>
        </AtmosphericBackground>
    );
}
