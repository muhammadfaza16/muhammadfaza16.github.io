"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
    Search, ChevronLeft, Lock, Plus, Edit2, Trash2,
    Book, ShoppingBag, FileText, Bookmark, Link2,
    CheckCircle2, Clock, Globe, ChevronRight
} from "lucide-react";
import Link from "next/link";
import {
    getToReadArticles, createToReadArticle, toggleReadStatus, deleteToReadArticle, updateToReadArticle,
    getWritingArticles, createWritingArticle, togglePublishStatus, deleteWritingArticle, updateWritingArticle,
    getBooks, createBook, deleteBook, updateBook,
    getWishlistItems, createWishlistItem, deleteWishlistItem, updateWishlistItem
} from "./actions";
import { Toaster, toast } from 'react-hot-toast';

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
    iconBg: string;
    iconColor: string;
}

const CATEGORIES: CategoryInfo[] = [
    { id: "writing", label: "Writing", icon: <FileText className="w-5 h-5 text-blue-600" strokeWidth={2.5} />, desc: "12 Published, 3 Drafts", type: "list", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { id: "toread", label: "To Read", icon: <Bookmark className="w-5 h-5 text-amber-600" strokeWidth={2.5} />, desc: "24 Unread links", type: "list", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { id: "books", label: "Books", icon: <Book className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />, desc: "4 Reading now, 12 Completed", type: "grid", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { id: "wishlist", label: "Wishlist", icon: <ShoppingBag className="w-5 h-5 text-purple-600" strokeWidth={2.5} />, desc: "8 Items saved", type: "grid", iconBg: "bg-purple-50", iconColor: "text-purple-600" },
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

// 1. Static List Item (Mobile Pattern)
const SwipeableRow = ({ item, type, onToggle, onEdit, onDelete }: { item: any, type: CategoryId, onToggle?: (id: string, status: boolean) => void, onEdit?: (item: any) => void, onDelete?: (id: string) => void }) => {
    return (
        <div className="relative w-full mb-3 rounded-2xl overflow-hidden">
            {/* Foreground Card */}
            <div className="relative bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-between transition-colors hover:bg-gray-50">

                {/* Left Group (Icon + Text) */}
                <div className="flex items-center gap-4 truncate pr-4 max-w-[50%] xs:max-w-[60%]">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-zinc-400 flex-shrink-0">
                        {type === 'writing' ? <FileText size={20} /> : <Globe size={20} />}
                    </div>
                    <div className="flex flex-col truncate">
                        <h3 className="text-[16px] font-bold tracking-tight text-zinc-900 truncate">{item.title || item.name}</h3>
                        <span className="text-[13px] text-zinc-500 font-medium truncate mt-0.5">
                            {type === 'writing' ? item.date : item.domain}
                        </span>
                    </div>
                </div>

                {/* RightActionGroup */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggle && onToggle(item.id, item.isRead || item.status === 'Read'); }}
                        className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide flex-shrink-0 cursor-pointer active:scale-95 transition-transform
                        ${item.status === 'Published' || item.isRead || item.status === 'Read' ? 'bg-zinc-100 text-zinc-600' : 'bg-gray-100 text-gray-400'}`}>
                        {type === 'toread' ? (item.isRead ? 'Read' : 'Unread') : item.status}
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit && onEdit(item); }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-zinc-900 hover:bg-zinc-100 active:scale-95 transition-all"
                    >
                        <Edit2 size={16} />
                    </button>

                    {onDelete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// 2. Visually-Heavy Grid Card
const GridCard = ({ item, onEdit, onDelete }: { item: any; onEdit?: (item: any) => void; onDelete?: (id: string) => void }) => (
    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-3 flex flex-col gap-3 group relative overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-auto indicator-group">
            <button
                onClick={(e) => { e.stopPropagation(); onEdit && onEdit(item); }}
                className="w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-sm"
            >
                <Edit2 size={14} />
            </button>
            {onDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="w-8 h-8 bg-black/40 hover:bg-red-500 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-sm"
                >
                    <Trash2 size={14} />
                </button>
            )}
        </div>
        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.img || item.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200&h=300"} alt={item.title || item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)] pointer-events-none" />
        </div>
        <div className="px-1 flex flex-col gap-0.5">
            <h3 className="text-[15px] font-bold tracking-tight text-zinc-900 leading-tight line-clamp-2">{item.title || item.name}</h3>
            <span className="text-[13px] text-zinc-500 font-medium truncate">{item.author || item.price}</span>
            {item.review && <p className="text-[12px] text-zinc-400 truncate mt-1">{item.review}</p>}
        </div>
    </div>
);

// 3. Bottom Sheet UI (Universal Create/Update)
const BottomSheet = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
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
                            {children}
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

    // --- DB State ---
    const [writingItems, setWritingItems] = useState<any[]>([]);
    const [toreadItems, setToreadItems] = useState<any[]>([]);
    const [bookItems, setBookItems] = useState<any[]>([]);
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    // --- Form State ---
    const [editItemId, setEditItemId] = useState<string | null>(null);
    const [formTitle, setFormTitle] = useState("");
    const [formUrl, setFormUrl] = useState("");
    const [formNotes, setFormNotes] = useState("");
    const [formExtra, setFormExtra] = useState(""); // For Author or Price
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (localStorage.getItem("cms_auth") === "true") setView("dashboard");
    }, []);

    useEffect(() => {
        if (view === "category") {
            if (activeCategory === "toread") loadToRead();
            else if (activeCategory === "writing") loadWriting();
            else if (activeCategory === "books") loadBooks();
            else if (activeCategory === "wishlist") loadWishlist();
        }
    }, [view, activeCategory]);

    const loadWriting = async () => {
        setIsFetching(true);
        const res = await getWritingArticles();
        if (res.success && res.data) setWritingItems(res.data);
        setIsFetching(false);
    };

    const loadToRead = async () => {
        setIsFetching(true);
        const res = await getToReadArticles();
        if (res.success && res.data) setToreadItems(res.data);
        setIsFetching(false);
    };

    const loadBooks = async () => {
        setIsFetching(true);
        const res = await getBooks();
        if (res.success && res.data) setBookItems(res.data);
        setIsFetching(false);
    };

    const loadWishlist = async () => {
        setIsFetching(true);
        const res = await getWishlistItems();
        if (res.success && res.data) setWishlistItems(res.data);
        setIsFetching(false);
    };

    const handleOpenCreateForm = () => {
        setEditItemId(null);
        setFormTitle(""); setFormUrl(""); setFormNotes(""); setFormExtra("");
        setIsSheetOpen(true);
    };

    const handleEditClick = (item: any) => {
        setEditItemId(item.id);
        setFormTitle(item.title || item.name || "");
        setFormUrl(item.coverImage || item.url || item.img || "");
        setFormNotes(item.content || item.review || "");
        setFormExtra(item.author || item.price || "");
        setIsSheetOpen(true);
    };

    const handleSave = async () => {
        if (!formTitle) return;
        setIsSubmitting(true);
        let success = false;
        let data = null;
        let errorMsg = "Failed";

        if (activeCategory === "toread") {
            if (!formUrl) { setIsSubmitting(false); return; }
            const res = editItemId
                ? await updateToReadArticle(editItemId, formTitle, formUrl, formNotes)
                : await createToReadArticle(formTitle, formUrl, formNotes);
            success = res.success; data = res.data; errorMsg = res.error || "Failed";
        } else if (activeCategory === "writing") {
            const res = editItemId
                ? await updateWritingArticle(editItemId, formTitle, formNotes, formUrl)
                : await createWritingArticle(formTitle, formNotes, formUrl);
            success = res.success; data = res.data; errorMsg = res.error || "Failed";
        } else if (activeCategory === "books") {
            if (!formExtra) { setIsSubmitting(false); alert("Author is required"); return; }
            const res = editItemId
                ? await updateBook(editItemId, formTitle, formExtra, formUrl, formNotes)
                : await createBook(formTitle, formExtra, formUrl, formNotes);
            success = res.success; data = res.data; errorMsg = res.error || "Failed";
        } else if (activeCategory === "wishlist") {
            const res = editItemId
                ? await updateWishlistItem(editItemId, formTitle, formExtra, formUrl)
                : await createWishlistItem(formTitle, formExtra, formUrl);
            success = res.success; data = res.data; errorMsg = res.error || "Failed";
        }

        setIsSubmitting(false);

        if (success && data) {
            toast.success("Successfully saved!");
            const updateList = (list: any[]) => editItemId ? list.map(i => i.id === editItemId ? data : i) : [data, ...list];

            if (activeCategory === "toread") setToreadItems(updateList(toreadItems));
            else if (activeCategory === "writing") setWritingItems(updateList(writingItems));
            else if (activeCategory === "books") setBookItems(updateList(bookItems));
            else if (activeCategory === "wishlist") setWishlistItems(updateList(wishlistItems));

            setIsSheetOpen(false);
            setFormTitle(""); setFormUrl(""); setFormNotes(""); setFormExtra("");
            setEditItemId(null);
        } else {
            toast.error(errorMsg);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean, category: CategoryId) => {
        if (category === "toread") {
            setToreadItems(prev => prev.map(item => item.id === id ? { ...item, isRead: !currentStatus } : item));
            await toggleReadStatus(id, currentStatus);
        } else if (category === "writing") {
            setWritingItems(prev => prev.map(item => item.id === id ? { ...item, published: !currentStatus } : item));
            await togglePublishStatus(id, currentStatus);
        }
    };

    const handleDelete = async (id: string, category: CategoryId) => {
        const toastId = toast.loading("Deleting...");
        let success = false;
        let errorMsg = "Failed to delete item.";

        if (category === "toread") {
            const res = await deleteToReadArticle(id);
            if (res.success) { success = true; setToreadItems(prev => prev.filter(item => item.id !== id)); }
            else { errorMsg = res.error || errorMsg; }
        } else if (category === "writing") {
            const res = await deleteWritingArticle(id);
            if (res.success) { success = true; setWritingItems(prev => prev.filter(item => item.id !== id)); }
            else { errorMsg = res.error || errorMsg; }
        } else if (category === "books") {
            const res = await deleteBook(id);
            if (res.success) { success = true; setBookItems(prev => prev.filter(item => item.id !== id)); }
            else { errorMsg = res.error || errorMsg; }
        } else if (category === "wishlist") {
            const res = await deleteWishlistItem(id);
            if (res.success) { success = true; setWishlistItems(prev => prev.filter(item => item.id !== id)); }
            else { errorMsg = res.error || errorMsg; }
        }

        if (success) toast.success("Deleted successfully", { id: toastId });
        else toast.error(errorMsg, { id: toastId });
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (authPin === "161616") {
            toast.success("Authenticated");
            localStorage.setItem("cms_auth", "true");
            setView("dashboard");
        } else {
            toast.error("Incorrect PIN");
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-[#F7F7F9] tracking-tight text-zinc-900 selection:bg-zinc-200 antialiased">
            <Toaster position="bottom-center" toastOptions={{ style: { background: '#333', color: '#fff', borderRadius: '100px', fontSize: '14px', fontWeight: 'bold' } }} />
            <div className="w-full max-w-[500px] min-h-screen flex flex-col relative bg-[#F7F7F9] shadow-2xl pb-32">

                <AnimatePresence mode="wait">
                    {/* --- VIEW: AUTHENTICATION --- */}
                    {view === "auth" && (
                        <motion.div
                            key="auth"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col p-8 items-center justify-center min-h-[80vh]"
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
                            className="flex-1 w-full flex flex-col"
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
                                        className={`bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer flex flex-col justify-between 
                                            ${idx === 0 ? "col-span-2 aspect-[2.2/1]" // Writing: Full Width Row
                                                : idx === 1 || idx === 2 ? "col-span-1 aspect-square" // To Read & Books: Square
                                                    : "col-span-2 aspect-[2.5/1]"}`} // Wishlist: Full Width lower
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${cat.iconBg}`}>
                                                {cat.icon}
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300" />
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
                                        <div key={i} className="flex-shrink-0 bg-white rounded-full px-5 py-3.5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer flex items-center gap-3">
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
                            className="flex-1 bg-[#F7F7F9] flex flex-col min-h-screen pb-32"
                        >
                            {/* Sticky Header */}
                            <div className="sticky top-0 z-20 bg-[#F7F7F9] pb-4 pt-6 px-5 flex flex-col gap-5">
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
                            <div className="flex-1 w-full p-5 pt-16">
                                {CATEGORIES.find(c => c.id === activeCategory)?.type === 'list' ? (
                                    <div className="flex flex-col w-full">
                                        {isFetching ? (
                                            <div className="w-full flex justify-center py-10">
                                                <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-black rounded-full" />
                                            </div>
                                        ) : (activeCategory === "toread" ? toreadItems : writingItems).length === 0 ? (
                                            <div className="w-full flex justify-center py-10">
                                                <p className="text-zinc-500 font-medium">Your {activeCategory} list is empty.</p>
                                            </div>
                                        ) : (
                                            (activeCategory === "toread" ? toreadItems : writingItems).map(item => {
                                                let domain = "Link";
                                                try { if (item.coverImage) domain = new URL(item.coverImage).hostname.replace('www.', ''); } catch (_) { }
                                                let formattedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
                                                return (
                                                    <SwipeableRow
                                                        key={item.id}
                                                        item={{
                                                            ...item,
                                                            domain,
                                                            date: formattedDate,
                                                            status: activeCategory === "writing" ? (item.published ? 'Published' : 'Draft') : item.status
                                                        }}
                                                        type={activeCategory}
                                                        onToggle={(id, status) => handleToggleStatus(id, status, activeCategory)}
                                                        onEdit={handleEditClick}
                                                        onDelete={(id) => handleDelete(id, activeCategory)}
                                                    />
                                                );
                                            })
                                        )}
                                    </div>
                                ) : (
                                    <div className="columns-2 gap-5 pb-12">
                                        {isFetching ? (
                                            <div className="w-full flex justify-center py-10 col-span-2">
                                                <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-black rounded-full" />
                                            </div>
                                        ) : (activeCategory === "books" ? bookItems : wishlistItems).length === 0 ? (
                                            <div className="w-full flex justify-center py-10 col-span-2">
                                                <p className="text-zinc-500 font-medium">Your {activeCategory} list is empty.</p>
                                            </div>
                                        ) : (
                                            (activeCategory === "books" ? bookItems : wishlistItems).map(item => (
                                                <div key={item.id} className="mb-5 inline-block w-full">
                                                    <GridCard
                                                        item={item}
                                                        onEdit={handleEditClick}
                                                        onDelete={(id) => handleDelete(id, activeCategory)}
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- GLOBAL FAB LAYER --- */}
                {view !== "auth" && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[500px] z-30 flex justify-end px-8 pointer-events-none">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleOpenCreateForm}
                            className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.2)] shrink-0 pointer-events-auto"
                        >
                            <Plus size={28} strokeWidth={2.5} />
                        </motion.button>
                    </div>
                )}

                {/* --- BOTTOM SHEET PORTAL --- */}
                <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title={editItemId ? "Edit Entry" : "New Entry"}>
                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                            {activeCategory === "toread" || activeCategory === "writing" || activeCategory === "books" ? "Title" : "Item Name"}
                        </label>
                        <input value={formTitle} onChange={e => setFormTitle(e.target.value)} type="text" placeholder="Enter title or name" className="w-full bg-gray-50 rounded-[1.5rem] h-14 px-5 text-[16px] font-semibold text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all placeholder:text-zinc-400 placeholder:font-medium" />
                    </div>

                    {(activeCategory === "books" || activeCategory === "wishlist") && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                                {activeCategory === "books" ? "Author" : "Price"}
                            </label>
                            <input value={formExtra} onChange={e => setFormExtra(e.target.value)} type="text" placeholder={activeCategory === "books" ? "Author name" : "$0.00"} className="w-full bg-gray-50 rounded-[1.5rem] h-14 px-5 text-[16px] font-semibold text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all placeholder:text-zinc-400 placeholder:font-medium" />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                            {activeCategory === "books" || activeCategory === "wishlist" ? "Cover/Image URL" : "URL / Link"}
                        </label>
                        <input value={formUrl} onChange={e => setFormUrl(e.target.value)} type="url" placeholder="https://" className="w-full bg-gray-50 rounded-[1.5rem] h-14 px-5 text-[16px] font-semibold text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all placeholder:text-zinc-400 placeholder:font-medium" />
                    </div>

                    {(activeCategory === "toread" || activeCategory === "writing" || activeCategory === "books") && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                                {activeCategory === "books" ? "Review / Thoughts" : "Notes / Content"}
                            </label>
                            <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Add your thoughts..." className="w-full bg-gray-50 rounded-[1.5rem] h-32 p-5 text-[16px] font-medium text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all resize-none placeholder:text-zinc-400" />
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={isSubmitting || !formTitle || (activeCategory === "toread" && !formUrl) || (activeCategory === "books" && !formExtra)}
                        className="w-full h-14 bg-black text-white rounded-full flex items-center justify-center appearance-none shrink-0 font-bold text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] mt-6 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isSubmitting ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : "Save Entry"}
                    </button>
                </BottomSheet>

            </div>
        </div>
    );
}
