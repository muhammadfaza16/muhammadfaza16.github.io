"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Plus, Star, X, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Book = {
    id: string;
    title: string;
    author: string;
    coverImage: string | null;
    review: string | null;
    rating: number;
    createdAt: string;
};

export default function BookshelfPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/bookshelf")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setBooks(data);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const selectedBook = books.find(b => b.id === selectedId);

    // Disable body scroll when modal is open
    useEffect(() => {
        if (selectedId) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [selectedId]);

    // Glass-Neumorphism Design Tokens (MATCHING /curation)
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

    const glassNeuPill = {
        background: "rgba(235, 240, 245, 0.3)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderTop: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.7), 4px 4px 12px rgba(163,177,198,0.4), -4px -4px 12px rgba(255,255,255, 0.8), -1px -2px 10px rgba(255,255,255, 0.9)",
        borderRadius: "9999px",
        transition: "all 0.2s ease",
    };

    // Modal Specific Extruded Float
    const glassNeuModal = {
        background: "rgba(235, 240, 245, 0.85)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: "1px solid rgba(255, 255, 255, 0.9)",
        boxShadow: "20px 20px 60px rgba(163,177,198,0.4), -20px -20px 60px rgba(255,255,255, 0.9)",
        borderRadius: "32px",
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
            {/* Ambient Glassmorphism Blobs (MATCHING /curation) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[0%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-300/30 blur-[80px]" />
                <div className="absolute top-[20%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-purple-300/20 blur-[90px]" />
                <div className="absolute bottom-[-10%] left-[15%] w-[50vw] h-[50vw] rounded-full bg-teal-200/30 blur-[100px]" />
            </div>

            <div className="w-full max-w-5xl flex-grow flex flex-col relative z-10 pb-20">
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
                        Bookshelf
                    </div>
                    <Link
                        href="/master"
                        className="flex items-center justify-center w-12 h-12 active:scale-95 transition-transform"
                        style={glassNeuButton}
                    >
                        <Plus size={24} className="text-[#4a4a4a]" />
                    </Link>
                </div>

                {/* Title Section based on Reference UI */}
                <div className="px-2 mb-8 relative">
                    <div className="flex items-start justify-between w-full mb-6">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: textPrimary }}>
                                The Library
                            </h1>
                            <p className="text-sm font-medium" style={{ color: textSecondary }}>
                                {books.length > 0 ? `${books.length} Books` : "No books have been shelved yet."}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#1a1c23] flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.15)] cursor-pointer hover:scale-105 transition-transform shrink-0" title="Search">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-3 overflow-x-auto py-4 -my-4 px-2 -mx-2 scrollbar-none" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                        <button className="px-5 py-2.5 rounded-full text-[13px] font-extrabold bg-[#1a1c23] text-white whitespace-nowrap shadow-md hover:scale-105 transition-transform">All</button>
                        <button className="px-5 py-2.5 rounded-full text-[13px] font-bold text-[#8b9bb4] whitespace-nowrap hover:bg-white/50 transition-colors" style={glassNeuPill}>Reading</button>
                        <button className="px-5 py-2.5 rounded-full text-[13px] font-bold text-[#8b9bb4] whitespace-nowrap hover:bg-white/50 transition-colors" style={glassNeuPill}>Favorites</button>
                    </div>
                </div>

                {/* Grid Layout */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[2/3] animate-pulse rounded-[24px]" style={glassNeuExtruded}></div>
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <BookOpen size={48} className="mb-4 text-[#8b9bb4]" strokeWidth={1.5} />
                        <p className="text-lg font-medium tracking-tight">The shelves are empty.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-2 pb-20 items-start">
                        {books.map((book, idx) => (
                            <div key={book.id} className="w-full h-fit">
                                <motion.div
                                    layoutId={`card-${book.id}`}
                                    onClick={() => setSelectedId(book.id)}
                                    className="group cursor-pointer relative h-fit w-full"
                                    style={{
                                        ...glassNeuExtruded,
                                        padding: "16px 16px 8px 16px",
                                    }}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ ease: "easeOut", duration: 0.2 }}
                                >
                                    {/* Overlay Star top right (Reference App Style) */}
                                    {book.rating >= 4 && (
                                        <div className="absolute -top-3 -right-3 z-10 w-8 h-8 drop-shadow-md">
                                            <svg viewBox="0 0 24 24" fill="#facc15" stroke="#1a1c23" strokeWidth="1.5" strokeLinejoin="round">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        </div>
                                    )}

                                    <motion.div layoutId={`image-${book.id}`} className="w-full aspect-[2/3] relative overflow-hidden rounded-[12px] shadow-[0_8px_16px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.4)]">
                                        {book.coverImage ? (
                                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
                                                <span className="font-serif text-2xl font-bold text-[#8b9bb4]/50 truncate w-full px-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                                    {book.title}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-80" />
                                    </motion.div>

                                    <motion.div layoutId={`content-${book.id}`} className="px-1 text-center mt-3 pb-0">
                                        <h3 className="font-serif text-sm font-semibold tracking-tight leading-tight line-clamp-2 mb-0.5" style={{ color: textPrimary }}>
                                            {book.title}
                                        </h3>
                                        <p className="text-xs font-medium opacity-80 m-0" style={{ color: textSecondary }}>
                                            {book.author}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[55] pointer-events-none">
                <Link
                    href="/master"
                    className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1a1c23] text-white shadow-[0_16px_32px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition-all pointer-events-auto border border-white/10"
                >
                    <span className="font-bold text-[14px] tracking-wide">Add Book</span>
                </Link>
            </div>

            {/* Expanded Shared Layout view */}
            <AnimatePresence>
                {selectedId && selectedBook && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedId(null)}
                            className="fixed inset-0 z-[60] bg-white/30"
                            style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                        />

                        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 pointer-events-none">
                            <motion.div
                                layoutId={`card-${selectedBook.id}`}
                                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto flex flex-col md:flex-row relative"
                                style={glassNeuModal}
                            >
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                                    style={glassNeuButton}
                                >
                                    <X size={20} className="text-[#8b9bb4]" />
                                </button>

                                {/* Cover Side */}
                                <motion.div layoutId={`image-${selectedBook.id}`} className="w-full md:w-[45%] shrink-0 relative bg-white/50 p-6 md:p-8">
                                    <div className="w-full aspect-[2/3] rounded-[16px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
                                        {selectedBook.coverImage ? (
                                            <img src={selectedBook.coverImage} alt={selectedBook.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
                                                <span className="font-serif text-3xl font-bold text-[#8b9bb4] px-6">
                                                    {selectedBook.title}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Info / Review Side */}
                                <motion.div layoutId={`content-${selectedBook.id}`} className="p-8 md:p-12 md:pl-6 flex flex-col gap-6 w-full">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-2" style={{ color: textPrimary }}>{selectedBook.title}</h2>
                                        <p className="text-lg font-medium" style={{ color: textSecondary }}>{selectedBook.author}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={glassNeuExtruded}>
                                            <Star size={16} className="text-amber-500 fill-amber-500" />
                                            <span className="text-sm font-bold" style={{ color: textPrimary }}>{selectedBook.rating || 0} / 5</span>
                                        </div>
                                        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: textSecondary }}>
                                            Logged {formatDistanceToNow(new Date(selectedBook.createdAt))} ago
                                        </span>
                                    </div>

                                    <div className="w-full h-[1px] my-2" style={{ background: "rgba(139, 155, 180, 0.2)" }}></div>

                                    <div className="flex-grow">
                                        <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: textSecondary }}>Review Notes</h3>
                                        <div className="prose prose-p:leading-relaxed max-w-none text-[15px]" style={{ color: textPrimary }}>
                                            {selectedBook.review ? (
                                                <p className="whitespace-pre-wrap">{selectedBook.review}</p>
                                            ) : (
                                                <p className="italic opacity-60">No review has been written for this volume yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
