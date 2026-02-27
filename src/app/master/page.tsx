"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
    Search, ChevronLeft, Lock, Plus, Edit2, Trash2,
    Book, ShoppingBag, FileText, Bookmark, Link2,
    CheckCircle2, Clock, Globe, ChevronRight
} from "lucide-react";
import Link from "next/link";

// ============================================================================
// TYPES & STORE
// ============================================================================
type ViewState = "auth" | "dashboard" | "category";
type CategoryId = "writing" | "toread" | "books" | "wishlist";

interface CategoryInfo {
    id: CategoryId;
    label: string;
    icon: React.ReactNode;
    desc: string;
    type: "list" | "grid";
}

const CATEGORIES: CategoryInfo[] = [
    { id: "writing", label: "Writing", icon: <FileText size={22} strokeWidth={2.5} className="text-zinc-700" />, desc: "12 Published, 3 Drafts", type: "list" },
    { id: "toread", label: "To Read", icon: <Bookmark size={22} strokeWidth={2.5} className="text-zinc-700" />, desc: "24 Unread links", type: "list" },
    { id: "books", label: "Books", icon: <Book size={22} strokeWidth={2.5} className="text-zinc-700" />, desc: "4 Reading now, 12 Completed", type: "grid" },
    { id: "wishlist", label: "Wishlist", icon: <ShoppingBag size={22} strokeWidth={2.5} className="text-zinc-700" />, desc: "8 Items saved", type: "grid" },
];

const DUMMY_DATA: Record<CategoryId, any[]> = {
    writing: [
        { id: 1, title: "The Architecture of Sanctuary", status: "Published", date: "Oct 12" },
        { id: 2, title: "Minimalism in UI Design", status: "Draft", date: "Nov 05" },
        { id: 3, title: "On Learning Framer Motion", status: "Draft", date: "Dec 01" }
    ],
    toread: [
        { id: 4, title: "Stripe's Design Engineering", status: "Unread", domain: "medium.com" },
        { id: 5, title: "Refactoring UI Patterns", status: "Read", domain: "twitter.com" },
        { id: 6, title: "The End of Localhost", status: "Unread", domain: "vercel.com" }
    ],
    books: [
        { id: 7, title: "Steve Jobs", author: "Walter Isaacson", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200&h=300" },
        { id: 8, title: "The Design of Everyday Things", author: "Don Norman", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=200&h=300" },
        { id: 9, title: "Atomic Habits", author: "James Clear", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=200&h=300" }
    ],
    wishlist: [
        { id: 10, title: "Sony WH-1000XM5", price: "$398", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200&h=200" },
        { id: 11, title: "Herman Miller Aeron", price: "$1,200", img: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0d1?auto=format&fit=crop&q=80&w=200&h=200" }
    ]
};

// ============================================================================
// REUSABLE UI COMPONENTS
// ============================================================================

// 1. Swipe-to-Action List Item (Mobile Pattern)
const SwipeableRow = ({ item, type }: { item: any, type: CategoryId }) => {
    const dragX = useMotionValue(0);
    const scale = useTransform(dragX, [-80, 0], [1, 0.8]);
    const opacity = useTransform(dragX, [-80, 0], [1, 0]);

    return (
        <div className="relative w-full mb-2 rounded-2xl overflow-hidden touch-pan-y">
            {/* Background Actions */}
            <div className="absolute inset-0 flex items-center justify-end px-5 gap-3">
                <motion.button style={{ scale, opacity }} className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-zinc-700">
                    <Edit2 size={18} />
                </motion.button>
                <motion.button style={{ scale, opacity }} className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <Trash2 size={18} />
                </motion.button>
            </div>

            {/* Foreground Card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -120, right: 0 }}
                dragElastic={0.1}
                style={{ x: dragX }}
                whileTap={{ cursor: "grabbing" }}
                className="relative bg-transparent hover:bg-gray-50 transition-colors p-4 rounded-2xl flex items-center justify-between cursor-pointer"
            >
                <div className="flex items-center gap-4 truncate pr-4">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-zinc-400 flex-shrink-0">
                        {type === 'writing' ? <FileText size={20} /> : <Globe size={20} />}
                    </div>
                    <div className="flex flex-col truncate">
                        <h3 className="text-[16px] font-bold tracking-tight text-zinc-900 truncate">{item.title}</h3>
                        <span className="text-[13px] text-zinc-500 font-medium truncate mt-0.5">
                            {type === 'writing' ? item.date : item.domain}
                        </span>
                    </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide flex-shrink-0
                    ${item.status === 'Published' || item.status === 'Read' ? 'bg-zinc-100 text-zinc-600' : 'bg-gray-100 text-gray-400'}`}>
                    {item.status}
                </div>
            </motion.div>
        </div>
    );
};

// 2. Visually-Heavy Grid Card
const GridCard = ({ item }: { item: any }) => (
    <div className="flex flex-col gap-3 group">
        <div className="w-full aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100 relative border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)] pointer-events-none" />
        </div>
        <div className="px-2 flex flex-col gap-0.5">
            <h3 className="text-[15px] font-bold tracking-tight text-zinc-900 leading-tight line-clamp-2">{item.title}</h3>
            <span className="text-[13px] text-zinc-500 font-medium truncate">{item.author || item.price}</span>
        </div>
    </div>
);

// 3. Bottom Sheet UI (Universal Create/Update)
const BottomSheet = ({ isOpen, onClose, title }: { isOpen: boolean, onClose: () => void, title: string }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 220 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, { offset, velocity }) => {
                            if (offset.y > 100 || velocity.y > 500) onClose();
                        }}
                        className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[2rem] z-50 flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.08)]"
                    >
                        <div className="w-full flex justify-center py-5 flex-shrink-0 cursor-grab active:cursor-grabbing">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        </div>
                        <div className="px-8 py-2 flex-shrink-0 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{title}</h2>
                        </div>
                        <div className="flex-grow overflow-y-auto px-8 pb-32 pt-6 flex flex-col gap-6 no-scrollbar">
                            {/* Dummy Input Form to simulate flow */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Title</label>
                                <input type="text" placeholder="Enter title" className="w-full bg-gray-50 rounded-[1.5rem] h-14 px-5 text-[16px] font-semibold text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all placeholder:text-zinc-400 placeholder:font-medium" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1">URL / Link</label>
                                <input type="url" placeholder="https://" className="w-full bg-gray-50 rounded-[1.5rem] h-14 px-5 text-[16px] font-semibold text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all placeholder:text-zinc-400 placeholder:font-medium" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Notes</label>
                                <textarea placeholder="Add your thoughts..." className="w-full bg-gray-50 rounded-[1.5rem] h-32 p-5 text-[16px] font-medium text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all resize-none placeholder:text-zinc-400" />
                            </div>

                            <button className="w-full h-14 bg-black text-white rounded-full font-bold text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] mt-6 active:scale-[0.98] transition-transform">
                                Save Entry
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function PersonalCMS() {
    const [view, setView] = useState<ViewState>("auth");
    const [activeCategory, setActiveCategory] = useState<CategoryId>("writing");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [authPin, setAuthPin] = useState("");

    useEffect(() => {
        setMounted(true);
        if (localStorage.getItem("cms_auth") === "true") setView("dashboard");
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (authPin === "161616") {
            localStorage.setItem("cms_auth", "true");
            setView("dashboard");
        } else {
            alert("Incorrect PIN");
        }
    };

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 w-full min-h-svh flex flex-col items-center bg-zinc-50 tracking-tight text-zinc-900 selection:bg-zinc-200 overflow-hidden antialiased">
            <div className="w-full max-w-[500px] h-full flex flex-col relative bg-zinc-50 shadow-2xl">

                <AnimatePresence mode="wait">
                    {/* --- VIEW: AUTHENTICATION --- */}
                    {view === "auth" && (
                        <motion.div
                            key="auth"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col p-8 items-center justify-center -mt-20"
                        >
                            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-center mb-8">
                                <Lock size={28} className="text-zinc-900" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight mb-3">Workspace</h1>
                            <p className="text-zinc-500 text-[15px] font-medium mb-12 text-center">Enter your verification PIN to access the sanctuary backend.</p>

                            <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    placeholder="PIN"
                                    value={authPin}
                                    onChange={e => setAuthPin(e.target.value)}
                                    className="w-full h-14 bg-white rounded-full px-6 text-center text-xl font-bold tracking-widest outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                                />
                                <button type="submit" className="w-full h-14 bg-black text-white rounded-full font-bold text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] mt-2 active:scale-[0.98] transition-transform">
                                    Authenticate
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* --- VIEW: MASTER DASHBOARD --- */}
                    {view === "dashboard" && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex-1 overflow-y-auto no-scrollbar pb-32"
                        >
                            <div className="pt-20 px-8 pb-8 w-full flex items-center justify-between">
                                <div className="flex flex-col">
                                    <h1 className="text-[32px] font-bold tracking-tight leading-tight text-zinc-900">Welcome, Faza</h1>
                                    <p className="text-[15px] text-zinc-500 font-medium mt-1">12 unread articles, 3 wishlist items.</p>
                                </div>
                                <Link href="/">
                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-zinc-500 active:scale-95 transition-transform">
                                        <Globe size={20} />
                                    </div>
                                </Link>
                            </div>

                            {/* True Bento Grid (Asymmetrical) */}
                            <div className="px-6 grid grid-cols-2 gap-5">
                                {CATEGORIES.map((cat, idx) => (
                                    <motion.div
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            setView("category");
                                        }}
                                        key={cat.id}
                                        className={`bg-white rounded-[2rem] p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer flex flex-col justify-between 
                                            ${idx === 0 ? "col-span-2 aspect-[2.2/1]" // Writing: Full Width Row
                                                : idx === 1 || idx === 2 ? "col-span-1 aspect-square" // To Read & Books: Square
                                                    : "col-span-2 aspect-[2.5/1]"}`} // Wishlist: Full Width lower
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700">
                                                {cat.icon}
                                            </div>
                                            <ChevronRight size={20} className="text-gray-300" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-[18px] font-bold tracking-tight text-zinc-900">{cat.label}</h3>
                                            <p className="text-[14px] text-zinc-500 font-medium mt-0.5">{cat.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Recent Activity (Pill Cards) */}
                            <div className="mt-14 w-full">
                                <h2 className="px-8 text-[16px] font-bold text-zinc-900 tracking-tight mb-4">Recent Activity</h2>
                                <div className="flex overflow-x-auto gap-3 px-6 pb-8 no-scrollbar touch-pan-x">
                                    {[
                                        { title: "The Architecture of Sanctuary", type: "Publish" },
                                        { title: "Refactoring UI Patterns", type: "Save" },
                                        { title: "Atomic Habits", type: "Log" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex-shrink-0 bg-white rounded-full px-5 py-3.5 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-zinc-400">
                                                <Clock size={14} />
                                            </div>
                                            <div className="flex flex-col justify-center pr-2">
                                                <h4 className="text-[14px] font-bold text-zinc-900 truncate max-w-[150px]">{item.title}</h4>
                                                <span className="text-[12px] text-zinc-500 font-medium">{item.type}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- VIEW: CATEGORY (SUB-PAGE) --- */}
                    {view === "category" && (
                        <motion.div
                            key="category"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 bg-white overflow-hidden flex flex-col"
                        // Use a solid white background for sub-pages to contrast the gray lists
                        >
                            {/* Sticky Header */}
                            <div className="pt-16 px-5 pb-4 bg-white/90 backdrop-blur-2xl z-20 flex flex-col gap-5">
                                <div className="flex items-center justify-between">
                                    <button onClick={() => setView("dashboard")} className="w-12 h-12 flex items-center justify-center text-zinc-900 active:bg-gray-100 rounded-full transition-colors">
                                        <ChevronLeft size={28} />
                                    </button>
                                    <h2 className="text-[20px] font-bold tracking-tight text-zinc-900">
                                        {CATEGORIES.find(c => c.id === activeCategory)?.label}
                                    </h2>
                                    <div className="w-12" /> {/* Spacer */}
                                </div>

                                {/* Filter Chips */}
                                <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-1 pb-1">
                                    <div className="px-5 py-2 bg-black text-white rounded-full text-[14px] font-bold flex-shrink-0 cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.1)]">All</div>
                                    <div className="px-5 py-2 bg-gray-50 text-zinc-500 rounded-full text-[14px] font-bold flex-shrink-0 cursor-pointer">Drafts</div>
                                    <div className="px-5 py-2 bg-gray-50 text-zinc-500 rounded-full text-[14px] font-bold flex-shrink-0 cursor-pointer">Published</div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto w-full p-5 pb-32 no-scrollbar">
                                {CATEGORIES.find(c => c.id === activeCategory)?.type === 'list' ? (
                                    <div className="flex flex-col w-full">
                                        {DUMMY_DATA[activeCategory].map(item => (
                                            <SwipeableRow key={item.id} item={item} type={activeCategory} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="columns-2 gap-5 pb-12">
                                        {DUMMY_DATA[activeCategory].map(item => (
                                            <div key={item.id} className="mb-5 inline-block w-full">
                                                <GridCard item={item} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- GLOBAL FAB LAYER --- */}
                {view !== "auth" && (
                    <div className="absolute bottom-8 right-8 z-30">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsSheetOpen(true)}
                            className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.15)] shrink-0"
                        >
                            <Plus size={28} strokeWidth={2.5} />
                        </motion.button>
                    </div>
                )}

                {/* --- BOTTOM SHEET PORTAL --- */}
                <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title="New Entry" />

            </div>
        </div>
    );
}
