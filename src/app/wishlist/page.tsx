"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Plus, Diamond, ExternalLink, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type WishlistItem = {
    id: string;
    name: string;
    price: string | null;
    url: string | null;
    priority: "Low" | "Medium" | "High" | string;
    createdAt: string;
};

export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/wishlist")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setItems(data);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    // Helper to parse price string to number for the tally
    const parsePrice = (priceStr: string | null) => {
        if (!priceStr) return 0;
        const cleaned = priceStr.replace(/[^0-9]/g, '');
        return parseInt(cleaned, 10) || 0;
    };

    const totalCost = items.reduce((sum, item) => sum + parsePrice(item.price), 0);
    const formattedTotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalCost);

    // Glass-Neumorphism Design Tokens (MATCHING /curation and /bookshelf)
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

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' };
            case 'medium': return { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20' };
            default: return { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20' };
        }
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
                        The Vault
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
                        Wishlist
                    </h1>
                    <p className="text-sm font-medium" style={{ color: textSecondary }}>
                        {items.length > 0 ? `${items.length} artifacts secured in the vault.` : "No items have been added yet."}
                    </p>
                </div>

                {/* Receipt Aggregation Panel */}
                <motion.div
                    initial={{ opacity: 1, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden"
                    style={{
                        ...glassNeuExtruded,
                        border: "1px solid rgba(255, 255, 255, 0.7)",
                        boxShadow: "10px 10px 20px rgba(163,177,198,0.4), -10px -10px 20px rgba(255,255,255, 0.9), inset 1px 1px 2px rgba(255,255,255,0.8)",
                    }}
                >
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: textSecondary }}>Estimated Total</span>
                        <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: textPrimary }}>
                            {isLoading ? "..." : formattedTotal}
                        </h2>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/50 shadow-inner">
                        <Diamond size={24} className="text-[#8b9bb4]" strokeWidth={1.5} />
                    </div>
                </motion.div>

                {/* Wishlist Items Stream */}
                <div className="flex flex-col gap-6 relative">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-28 w-full animate-pulse" style={glassNeuExtruded}></div>
                        ))
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <Tag size={48} className="mb-4 text-[#8b9bb4]" strokeWidth={1.5} />
                            <p className="text-lg font-medium tracking-tight">The vault is empty.</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {items.map((item, index) => {
                                const pColor = getPriorityColor(item.priority);
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 1, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <div
                                            className="p-5 sm:p-6 relative overflow-hidden flex flex-col sm:flex-row gap-5 items-start sm:items-center"
                                            style={glassNeuExtruded}
                                        >
                                            {/* Inner shiny highlight */}
                                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-60"></div>

                                            {/* Thumbnail Area */}
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-[12px] overflow-hidden shadow-inner ring-1 ring-black/5 bg-white/40 flex items-center justify-center relative">
                                                {item.url ? (
                                                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Diamond size={24} className="text-[#8b9bb4]/50" />
                                                )}
                                            </div>

                                            <div className="flex-grow flex flex-col gap-2 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <h2 className="text-[17px] sm:text-lg font-bold tracking-tight leading-tight" style={{ color: textPrimary }}>
                                                        {item.name}
                                                    </h2>

                                                    {/* Link Out Button */}
                                                    {item.url && (
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform hover:bg-white/20"
                                                            style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                                                        >
                                                            <ExternalLink size={14} className="text-[#8b9bb4]" />
                                                        </a>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="text-[15px] font-extrabold tracking-tight" style={{ color: textPrimary }}>
                                                        {item.price || "TBA"}
                                                    </span>
                                                    <div className="w-1 h-1 rounded-full bg-[#8b9bb4]/30" />
                                                    <div className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-widest ${pColor.bg} ${pColor.text} ${pColor.border}`}>
                                                        {item.priority}
                                                    </div>
                                                </div>

                                                <span className="text-[11px] font-bold tracking-widest uppercase mt-1" style={{ color: textSecondary }}>
                                                    Logged {formatDistanceToNow(new Date(item.createdAt))} ago
                                                </span>
                                            </div>

                                        </div>
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
