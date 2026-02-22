"use client";

import React, { use, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Post = {
    id: string;
    title: string;
    content: string;
    coverImage: string | null;
    createdAt: string;
};

export default function JournalReaderPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Scroll progress for header fade-out
    const { scrollY } = useScroll();
    const headerOpacity = useTransform(scrollY, [0, 150], [1, 0]);
    const headerY = useTransform(scrollY, [0, 150], [0, -20]);

    useEffect(() => {
        if (!slug) return;
        fetch(`/api/writing/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then(data => setPost(data))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [slug]);

    // Glass-Neumorphism Design Tokens
    const baseBg = "#e0e5ec";
    const textPrimary = "#4a4a4a";
    const textSecondary = "#8b9bb4";

    const glassNeuButton = {
        background: "rgba(224, 229, 236, 0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "5px 5px 10px rgba(163,177,198,0.5), -5px -5px 10px rgba(255,255,255, 0.8)",
        borderRadius: "16px",
        transition: "all 0.2s ease",
    };

    if (isLoading) {
        return (
            <div className="min-h-[100svh] w-full flex items-center justify-center p-4 transition-colors duration-1000" style={{ backgroundColor: baseBg }}>
                <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-[#8b9bb4] animate-spin"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-[100svh] w-full flex flex-col items-center justify-center p-4 text-center transition-colors duration-1000" style={{ backgroundColor: baseBg, color: textPrimary }}>
                <h1 className="font-serif text-4xl mb-4 text-[#8b9bb4]">Manuscript Lost</h1>
                <p className="text-sm font-medium opacity-70 mb-8 max-w-sm">The essay you are looking for does not exist in these archives.</p>
                <Link href="/journal" className="px-8 py-4 rounded-full text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-transform" style={glassNeuButton}>
                    Return to Feed
                </Link>
            </div>
        );
    }

    const dateObj = new Date(post.createdAt);
    const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div
            className="min-h-[100svh] w-full font-sans antialiased relative z-50 transition-colors duration-1000"
            style={{
                backgroundColor: baseBg,
                color: textPrimary,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            }}
        >
            {/* Ambient Lighting */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[0%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-blue-300/20 blur-[80px]" />
                <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-400/10 blur-[90px]" />
            </div>

            {/* Fading Header Navigation */}
            <motion.div
                className="fixed top-0 left-0 right-0 p-6 md:p-12 z-40 flex items-center justify-between pointer-events-none"
                style={{ opacity: headerOpacity, y: headerY }}
            >
                <div className="w-full max-w-3xl mx-auto flex items-center justify-between pointer-events-auto">
                    <Link
                        href="/journal"
                        className="flex items-center justify-center w-12 h-12 active:scale-95 transition-transform group"
                        style={glassNeuButton}
                    >
                        <ChevronLeft size={24} className="text-[#8b9bb4] -ml-1 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <article className="relative z-10 w-full max-w-3xl mx-auto px-6 py-32 md:py-48 flex flex-col items-center">
                {/* Immersive Title Unit */}
                <header className="w-full flex flex-col items-center text-center mb-24 cursor-default">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase mb-8 opacity-60" style={{ color: textSecondary }}>
                        {formattedDate} • Essay
                    </span>
                    <h1
                        className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-12"
                        style={{ color: textPrimary, fontWeight: 400 }}
                    >
                        {post.title}
                    </h1>
                    <div className="w-16 h-[1px] bg-[#8b9bb4]/30"></div>
                </header>

                {/* Typography Body */}
                <div
                    className="w-full prose prose-lg prose-slate max-w-none
                        prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight prose-headings:mb-6 prose-headings:text-[#4a4a4a]
                        prose-p:leading-relaxed prose-p:text-[#4a4a4a]/90
                        prose-a:text-blue-600 prose-a:underline-offset-4 hover:prose-a:text-blue-800
                        prose-blockquote:border-l-[#8b9bb4]/30 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-[#8b9bb4]
                        prose-strong:text-[#4a4a4a] prose-strong:font-bold
                        prose-hr:border-[#8b9bb4]/20
                        prose-li:text-[#4a4a4a]/90"
                    style={{
                        fontSize: '1.125rem', // 18px base for optimal reading
                    }}
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Footer Signature */}
                <footer className="w-full mt-32 pt-12 border-t border-[#8b9bb4]/20 flex items-center justify-between opacity-80 cursor-default">
                    <span className="font-serif text-[#8b9bb4] italic text-lg">Fin.</span>
                    <Link
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        href="#"
                        className="text-xs font-bold tracking-widest uppercase hover:underline underline-offset-4"
                        style={{ color: textSecondary }}
                    >
                        Return to Top
                    </Link>
                </footer>
            </article>
        </div>
    );
}
