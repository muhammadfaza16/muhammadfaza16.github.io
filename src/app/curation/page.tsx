"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, FileText, ChevronLeft, Plus } from "lucide-react";

type ArticleMeta = {
    id: string;
    title: string;
    coverImage: string | null;
    createdAt: string;
    isRead: boolean;
};

export default function CurationList() {
    const [articles, setArticles] = useState<ArticleMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/curation")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setArticles(data);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const unreadCount = articles.filter(a => !a.isRead).length;

    // Glass-Neumorphism Design Tokens
    const baseBg = "#e0e5ec";
    const textPrimary = "#4a4a4a";
    const textSecondary = "#8b9bb4";

    // Glassy + Extruded (Cards)
    const glassNeuExtruded = {
        background: "rgba(224, 229, 236, 0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "9px 9px 16px rgba(163,177,198,0.5), -9px -9px 16px rgba(255,255,255, 0.8)",
        borderRadius: "24px",
    };

    // Glassy + Extruded (Buttons)
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
                        Curation
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
                <div className="px-2 mb-8 relative">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: textPrimary }}>
                        The Archive
                    </h1>
                    <p className="text-sm font-medium" style={{ color: textSecondary }}>
                        {unreadCount > 0 ? `${unreadCount} unread articles resting in the void.` : "You're completely caught up."}
                    </p>
                </div>

                {/* Article List */}
                <div className="flex flex-col gap-6 relative">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-24 w-full animate-pulse" style={glassNeuExtruded}></div>
                        ))
                    ) : articles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <FileText size={48} className="mb-4 text-[#8b9bb4]" strokeWidth={1.5} />
                            <p className="text-lg font-medium tracking-tight">Nothing here yet.</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {articles.map((article, index) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 1, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <Link
                                        href={`/curation/${article.id}`}
                                        className="block p-5 sm:p-6 active:scale-[0.98] transition-transform relative overflow-hidden"
                                        style={glassNeuExtruded}
                                    >
                                        {/* Inner shiny highlight */}
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-60"></div>

                                        <div className="flex items-start justify-between gap-4 relative z-10">
                                            <div className="flex flex-col gap-1.5 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    {!article.isRead && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)] flex-shrink-0" />
                                                    )}
                                                    <h2 className="text-[17px] font-bold tracking-tight truncate leading-tight" style={{ color: textPrimary }}>
                                                        {article.title}
                                                    </h2>
                                                </div>
                                                <span className="text-[11px] font-bold tracking-widest uppercase pl-4" style={{ color: textSecondary }}>
                                                    {formatDistanceToNow(new Date(article.createdAt))} ago
                                                </span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={glassNeuButton}>
                                                <ChevronRight size={18} className="text-[#8b9bb4]" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
