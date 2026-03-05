"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { Search, ChevronLeft, Bookmark, FileText, Plus, Loader2, CheckCircle, Send, X, ArrowUpRight, ArrowDown, ArrowUp, Share2 } from "lucide-react";
import { Toaster, toast } from 'react-hot-toast';
import { createToReadArticle, updateToReadArticle } from "@/app/master/actions";
import { uploadImageToSupabase } from "@/lib/uploadImage";
import { getSupabase } from "@/lib/supabase";
import { BottomSheet, ImagePicker, QuickPasteInput, RichTextEditor } from "@/components/sanctuary";

// ─── Types ───

interface ArticleMeta {
    id: string;
    title: string;
    content: string;
    url: string | null;
    imageUrl: string | null;
    category: string | null;
    isRead: boolean;
    isBookmarked: boolean;
    createdAt: string;
    qualityScore: number | null;
    substanceScore: number | null;
}

type SortType = "latest" | "oldest";

// ─── Constants ───

const CATEGORIES = [
    { name: "AI & Tools", emoji: "🤖" },
    { name: "Wealth & Business", emoji: "💰" },
    { name: "Mindset & Philosophy", emoji: "🧠" },
    { name: "Self-Improvement & Productivity", emoji: "⚡" },
    { name: "Career & Skills", emoji: "🎯" },
    { name: "Marketing & Growth", emoji: "📈" },
    { name: "Building & Design", emoji: "🔨" },
    { name: "Health & Lifestyle", emoji: "🌱" },
];

const LABEL_CLASS = "text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1";
const CACHE_KEY = "curationTabsPerFeedCache";
const VISITOR_STATE_KEY = "curation_visitor_state";

// ─── Visitor State (localStorage) ───

function getVisitorState(): { read: Record<string, boolean>; bookmarked: Record<string, boolean> } {
    if (typeof window === "undefined") return { read: {}, bookmarked: {} };
    try {
        const raw = localStorage.getItem(VISITOR_STATE_KEY);
        return raw ? JSON.parse(raw) : { read: {}, bookmarked: {} };
    } catch { return { read: {}, bookmarked: {} }; }
}

function saveVisitorState(state: { read: Record<string, boolean>; bookmarked: Record<string, boolean> }) {
    if (typeof window === "undefined") return;
    localStorage.setItem(VISITOR_STATE_KEY, JSON.stringify(state));
}

// ─── Main Component ───

export default function CurationList() {
    const [articles, setArticles] = useState<ArticleMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sort, setSort] = useState<SortType>("latest");
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "bookmarked">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [visitorState, setVisitorState] = useState<{ read: Record<string, boolean>; bookmarked: Record<string, boolean> }>({ read: {}, bookmarked: {} });

    const [weeklyReads, setWeeklyReads] = useState(0);
    const [navigatingId, setNavigatingId] = useState<string | null>(null);
    const [readingProgress, setReadingProgress] = useState<Record<string, number>>({});

    // Refs
    const hasRestoredCache = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const lastFetchParamsRef = useRef({ sort: "latest", cats: [] as string[], q: "" });
    const scrollYRef = useRef(0);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Form State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formUrl, setFormUrl] = useState("");
    const [formNotes, setFormNotes] = useState("");
    const [formImageFile, setFormImageFile] = useState<File | null>(null);
    const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
    const [formPublishedTime, setFormPublishedTime] = useState("");
    const [formCategory, setFormCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "saving">("idle");
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const supabase = getSupabase();

    // Auto-fetch metadata
    useEffect(() => {
        if (!formUrl || !formUrl.startsWith("http")) return;

        const timer = setTimeout(async () => {
            setIsFetchingMetadata(true);
            try {
                const res = await fetch(`/api/curation/metadata?url=${encodeURIComponent(formUrl)}`);
                const json = await res.json();

                if (json.success && json.data) {
                    const { title, description, image, publishedTime } = json.data;
                    if (!formTitle && title) setFormTitle(title);
                    if (!formNotes && description) {
                        const notesHtml = description.trim().startsWith("<") ? description : `<p>${description}</p>`;
                        setFormNotes(notesHtml);
                    }
                    if (!formImageFile && !formImagePreview && image) setFormImagePreview(image);
                    if (!formPublishedTime && publishedTime) setFormPublishedTime(publishedTime);
                }
            } catch (error) {
                console.error("Failed to fetch metadata:", error);
            } finally {
                setIsFetchingMetadata(false);
            }
        }, 600);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formUrl]);

    const handleEditArticle = (article: ArticleMeta) => {
        setEditingId(article.id);
        setFormTitle(article.title);
        setFormUrl(article.url || "");
        setFormNotes(article.content || "");
        setFormImagePreview(article.imageUrl || null);
        setFormCategory(article.category || "");
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setEditingId(null);
        setFormTitle("");
        setFormUrl("");
        setFormNotes("");
        setFormImageFile(null);
        setFormImagePreview(null);
        setFormPublishedTime("");
        setFormCategory("");
    };

    // Save handler
    const handleSave = async () => {
        if (!formTitle || !formUrl) return;
        setIsSubmitting(true);

        try {
            let imageUrl = formImagePreview;

            if (formImageFile && supabase) {
                setUploadStatus("uploading");
                const uploaded = await uploadImageToSupabase(formImageFile);
                if (uploaded) imageUrl = uploaded;
            }

            setUploadStatus("saving");

            const payload = {
                title: formTitle,
                url: formUrl,
                notes: formNotes,
                imageUrl,
                category: formCategory || null,
                createdAt: formPublishedTime ? new Date(formPublishedTime) : undefined,
            };

            if (!isAdmin) {
                // GUEST FLOW — Suggest
                const res = await fetch("/api/curation/suggestions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: payload.title,
                        notes: payload.notes || "No description",
                        url: payload.url,
                        imageUrl: payload.imageUrl,
                        category: payload.category,
                    }),
                });
                const json = await res.json();
                if (json.success) {
                    toast.success("Suggestion sent! It'll be reviewed shortly.");
                    handleCloseSheet();
                } else {
                    toast.error(json.error || "Failed to send suggestion");
                }
            } else {
                // ADMIN FLOW
                if (editingId) {
                    const res = await updateToReadArticle(editingId, payload.title, payload.url, payload.notes, payload.imageUrl ?? undefined, payload.category ?? undefined, payload.createdAt?.toISOString());
                    if (res.success && res.data) {
                        toast.success("Article updated");
                        setArticles(prev => prev.map(a => a.id === editingId ? { ...(res.data as any), createdAt: res.data!.createdAt.toISOString() } : a));
                        handleCloseSheet();
                    } else {
                        toast.error(res.error || "Failed to update");
                    }
                } else {
                    const res = await createToReadArticle(payload.title, payload.url, payload.notes, payload.imageUrl ?? undefined, payload.category ?? undefined, payload.createdAt?.toISOString());
                    if (res.success && res.data) {
                        toast.success("Saved to Curation");
                        setArticles(prev => [{ ...(res.data as any), createdAt: res.data!.createdAt.toISOString() }, ...prev]);
                        handleCloseSheet();
                    } else {
                        toast.error(res.error || "Failed to save");
                    }
                }
            }
        } catch (error) {
            console.error("Save failed:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
            setUploadStatus("idle");
        }
    };

    // Data Fetching
    const fetchArticles = async (currentCursor: string | null, currentSort: string, categories: string[], q: string, isLoadMore = false) => {
        // Cancel any in-flight request for non-loadMore fetches
        if (!isLoadMore && abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        if (!isLoadMore) abortControllerRef.current = controller;

        // Track what we're fetching so isLoadMore can verify it's still relevant
        if (!isLoadMore) {
            lastFetchParamsRef.current = { sort: currentSort, cats: categories, q };
        }

        try {
            if (isLoadMore) setIsLoadingMore(true);
            else setIsLoading(true);

            let url = `/api/curation?limit=10&sort=${currentSort}`;
            if (categories.length > 0) {
                url += `&category=${encodeURIComponent(categories.join(","))}`;
            }
            if (q.trim()) {
                url += `&q=${encodeURIComponent(q.trim())}`;
            }
            if (currentCursor) url += `&cursor=${currentCursor}`;

            const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
            const data = await res.json();

            // Guard: if filters changed while this loadMore was in-flight, discard the results
            if (isLoadMore) {
                const current = lastFetchParamsRef.current;
                if (current.sort !== currentSort || current.q !== q ||
                    JSON.stringify(current.cats) !== JSON.stringify(categories)) {
                    return; // stale loadMore — discard
                }
            }

            if (data.articles) {
                if (isLoadMore) {
                    setArticles(prev => {
                        const existingIds = new Set(prev.map(a => a.id));
                        const newUnique = data.articles.filter((a: any) => !existingIds.has(a.id));
                        return [...prev, ...newUnique];
                    });
                } else {
                    setArticles(data.articles);
                }
                setNextCursor(data.nextCursor);
            }
        } catch (error: any) {
            if (error?.name !== 'AbortError') {
                console.error("Fetch failed:", error);
            }
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        // Debounce search queries, instant for sort/category changes
        const delay = searchQuery ? 300 : 0;
        const timeoutId = setTimeout(() => {
            fetchArticles(null, sort, categoryFilter, searchQuery);
        }, delay);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, categoryFilter, searchQuery]);

    // Infinite scroll & Auto-fetch for sparse filtered views
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const checkAndFetchMore = () => {
            if (!nextCursor || isLoadingMore) return;
            const { scrollTop, scrollHeight, clientHeight } = container;
            // Fetch if within 400px of bottom, OR if the content is entirely visible (not scrollable)
            if (scrollHeight <= clientHeight || scrollHeight - scrollTop - clientHeight < 400) {
                fetchArticles(nextCursor, sort, categoryFilter, searchQuery, true);
            }
        };

        // Check immediately on render/filter changes
        checkAndFetchMore();

        container.addEventListener('scroll', checkAndFetchMore, { passive: true });
        return () => container.removeEventListener('scroll', checkAndFetchMore);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextCursor, isLoadingMore, sort, categoryFilter, articles.length, searchQuery]);

    // Visitor state actions
    const toggleVisitorRead = (articleId: string) => {
        const wasRead = !!visitorState.read[articleId];
        setVisitorState(prev => {
            const updated = { ...prev, read: { ...prev.read, [articleId]: !prev.read[articleId] } };
            if (!updated.read[articleId]) delete updated.read[articleId];
            saveVisitorState(updated);
            return updated;
        });
        try { if (navigator.vibrate) navigator.vibrate([10, 30, 10]); } catch { }
        toast.success(wasRead ? "Marked unread" : "Marked read");
    };

    const toggleVisitorBookmark = (articleId: string) => {
        const wasBookmarked = !!visitorState.bookmarked[articleId];
        setVisitorState(prev => {
            const updated = { ...prev, bookmarked: { ...prev.bookmarked, [articleId]: !prev.bookmarked[articleId] } };
            if (!updated.bookmarked[articleId]) delete updated.bookmarked[articleId];
            saveVisitorState(updated);
            return updated;
        });
        try { if (navigator.vibrate) navigator.vibrate([15, 30, 15]); } catch { }
        toast.success(wasBookmarked ? "Removed bookmark" : "Bookmarked!");
    };

    // Share handler
    const handleShareArticle = async (article: ArticleMeta) => {
        const shareUrl = `${window.location.origin}/curation/${article.id}`;
        const shareData = { title: article.title, url: shareUrl };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareUrl);
                toast.success('Link copied!');
            }
        } catch (err: any) {
            if (err?.name !== 'AbortError') {
                await navigator.clipboard.writeText(shareUrl);
                toast.success('Link copied!');
            }
        }
    };

    // Init
    useEffect(() => {
        setVisitorState(getVisitorState());

        // Load reading progress from localStorage
        try {
            const progressMap: Record<string, number> = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('curation_progress_')) {
                    const articleId = key.replace('curation_progress_', '');
                    const pct = parseFloat(localStorage.getItem(key) || '0');
                    if (pct > 0.05) progressMap[articleId] = pct;
                }
            }
            setReadingProgress(progressMap);
        } catch { }

        // Calculate weekly reads streak
        try {
            const history = JSON.parse(localStorage.getItem('curation_read_history') || '[]');
            const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            const recentReads = history.filter((h: any) => h.ts > oneWeekAgo);
            setWeeklyReads(recentReads.length);
        } catch { }

        // Check admin status via secure cookie
        fetch("/api/auth")
            .then(res => res.json())
            .then(data => setIsAdmin(data.isAdmin === true))
            .catch(() => setIsAdmin(false));
    }, []);

    const handleSortChange = (s: SortType) => {
        if (s === sort) return;
        setSort(s);
    };

    const handleCategoryToggle = (catName: string) => {
        setCategoryFilter(prev =>
            prev.includes(catName)
                ? prev.filter(c => c !== catName)
                : [...prev, catName]
        );
    };

    // Helpers
    const getImageUrl = (article: ArticleMeta): string | null => {
        if (!article.imageUrl) return null;
        const img = article.imageUrl;
        if (img.startsWith("http")) return img;
        if (supabase) {
            const { data } = supabase.storage.from('images').getPublicUrl(img);
            return data.publicUrl;
        }
        return null;
    };

    const getDomain = (url?: string | null): string => {
        try { return url ? new URL(url).hostname.replace("www.", "") : ""; }
        catch { return ""; }
    };

    const estimateReadTime = (content?: string) => {
        if (!content) return 1;
        const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        return Math.max(1, Math.ceil(text.split(/\s+/).length / 225));
    };

    // Client-side filtering (category safety net + status)
    const filteredArticles = articles.filter(a => {
        // Strict category filter for instant UI reactivity before API fetch resolves
        if (categoryFilter.length > 0 && (!a.category || !categoryFilter.includes(a.category))) {
            return false;
        }
        // Status filter (against localStorage visitor state)
        if (statusFilter === "unread" && visitorState.read[a.id]) return false;
        if (statusFilter === "bookmarked" && !visitorState.bookmarked[a.id]) return false;
        return true;
    });

    // Category count
    const categoryCount = CATEGORIES.length;
    const isFiltering = categoryFilter.length > 0 || searchQuery.length > 0 || statusFilter !== "all";

    return (
        <div className="h-screen w-full flex flex-col bg-[#fafaf8] text-zinc-900 font-sans antialiased overflow-hidden relative selection:bg-amber-100">
            <Toaster
                position="bottom-center"
                toastOptions={{
                    style: { background: '#1a1a1a', color: '#fff', borderRadius: '100px', fontSize: '14px', fontWeight: '600', padding: '12px 20px' },
                    duration: 2500,
                }}
            />

            {/* ═══ MINIMAL HEADER ═══ */}
            <header className="sticky top-0 z-50 bg-[#fafaf8]/80 backdrop-blur-xl border-b border-zinc-200/40 shrink-0 px-5 py-3.5 flex items-center justify-between">
                <Link href="/" className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 active:scale-90 rounded-full transition-all">
                    <ChevronLeft size={20} />
                </Link>
                <h2 className="text-[16px] text-zinc-900 italic font-medium" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Curated by Faza</h2>
                <button
                    onClick={() => {
                        setIsSearchOpen(!isSearchOpen);
                        if (!isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
                    }}
                    className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 active:scale-90 rounded-full transition-all"
                >
                    {isSearchOpen ? <X size={18} /> : <Search size={18} />}
                </button>
            </header>

            {/* ═══ SEARCH BAR (expandable) ═══ */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-[#fafaf8] border-b border-zinc-200/40 px-5 z-40"
                    >
                        <div className="py-3">
                            <div className="relative">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-300" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full h-11 bg-white rounded-xl border border-zinc-200/80 pl-10 pr-4 text-[14px] text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100 transition-all"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══ SCROLLABLE CONTENT ═══ */}
            <main
                id="curation-scroll-container"
                ref={scrollContainerRef}
                onScroll={(e) => scrollYRef.current = e.currentTarget.scrollTop}
                className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-6 pb-32 relative z-10 w-full max-w-2xl md:max-w-5xl mx-auto"
                style={{ WebkitOverflowScrolling: "touch", overscrollBehaviorY: "auto" } as React.CSSProperties}
            >
                {/* ═══ DASHBOARD INDEX (Hidden when filtering) ═══ */}
                {!isFiltering && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        {/* Hero Zone */}
                        <div className="mb-8 px-1">
                            <h1 className="text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.03em] text-zinc-900 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                Curated Knowledge<br />
                                <span className="italic text-zinc-400" style={{ fontWeight: 400 }}>& Perspectives.</span>
                            </h1>
                            <p className="text-[15px] text-zinc-500 leading-relaxed max-w-[44ch]">
                                A carefully assembled library of essays, frameworks, and ideas — for the curious mind. Explore, discover, contribute.
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-3 mt-5 flex-wrap">
                                <span className="text-[12px] font-medium text-zinc-400">
                                    {articles.length > 0 ? `${articles.length}+ entries` : ""} {categoryCount > 0 && articles.length > 0 ? `• ${categoryCount} topics` : ""}
                                </span>

                                {weeklyReads > 0 && (
                                    <Link
                                        href="/curation/recap"
                                        className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2.5 py-0.5 rounded-full border border-orange-100 shadow-[0_2px_10px_-4px_rgba(234,88,12,0.3)] hover:shadow-md transition-all active:scale-95"
                                    >
                                        <span className="text-[13px] inline-block animate-[bounce_2s_infinite]">🔥</span>
                                        <span className="text-[11px] font-bold tracking-wider uppercase">{weeklyReads} Read{weeklyReads !== 1 && 's'} This Week</span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* ═══ CONTINUE READING ═══ */}
                        {(() => {
                            const inProgress = articles.filter(a => {
                                const pct = readingProgress[a.id];
                                return pct && pct > 0.05 && pct < 0.95;
                            });
                            if (inProgress.length === 0) return null;
                            return (
                                <div className="mb-10 px-1">
                                    <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase mb-4">📖 Continue Reading</h3>
                                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                        {inProgress.map(article => (
                                            <Link
                                                key={article.id}
                                                href={`/curation/${article.id}`}
                                                onClick={() => setNavigatingId(article.id)}
                                                className="shrink-0 w-[220px] bg-white border border-zinc-200/80 rounded-2xl p-3.5 active:scale-[0.97] transition-all hover:shadow-sm group"
                                            >
                                                <h4 className="text-[13px] font-bold text-zinc-800 leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {article.title}
                                                </h4>
                                                <div className="flex items-center gap-2 mb-2.5">
                                                    <span className="text-[10px] font-medium text-zinc-400">
                                                        {Math.round((readingProgress[article.id] || 0) * 100)}% read
                                                    </span>
                                                </div>
                                                <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all"
                                                        style={{ width: `${Math.round((readingProgress[article.id] || 0) * 100)}%` }}
                                                    />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Topic Grid */}
                        <div className="px-1">
                            <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase mb-4">Browse by Topic</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.name}
                                        onClick={() => handleCategoryToggle(cat.name)}
                                        className="flex flex-col items-start p-4 bg-white border border-zinc-200/80 rounded-[1.25rem] hover:border-zinc-300 hover:shadow-sm active:scale-[0.98] transition-all text-left"
                                    >
                                        <span className="text-2xl mb-2 grayscale opacity-90">{cat.emoji}</span>
                                        <span className="text-[13px] font-bold text-zinc-800 leading-tight">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ═══ ARCHIVE LIST SECTION ═══ */}
                <div className="flex items-end justify-between px-1 mb-4 mt-2">
                    <h3 className="text-[20px] font-bold tracking-tight text-zinc-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {searchQuery ? "Search Results" :
                            categoryFilter.length > 0 ? `${categoryFilter.join(', ')}` :
                                statusFilter !== "all" ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Articles` :
                                    "All Entries"}
                    </h3>

                    {isFiltering && (
                        <button
                            onClick={() => { setCategoryFilter([]); setSearchQuery(''); setStatusFilter('all'); }}
                            className="text-[12px] font-bold text-blue-600 hover:text-blue-700 active:scale-95 transition-all bg-blue-50 px-3 py-1.5 rounded-full"
                        >
                            Clear View
                        </button>
                    )}
                </div>

                {/* Utility Action Bar (Sort & Status) */}
                <div className="flex items-center gap-2 overflow-x-auto px-1 pb-4 no-scrollbar mb-2 border-b border-zinc-200/60 w-full">
                    {/* Sort Toggle */}
                    <button
                        onClick={() => handleSortChange(sort === "latest" ? "oldest" : "latest")}
                        className="px-3 py-1.5 text-[12px] font-bold rounded-full transition-all active:scale-[0.96] whitespace-nowrap bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 flex items-center gap-1.5 shrink-0 shadow-sm"
                    >
                        {sort === "latest" ? <ArrowDown size={14} className="text-zinc-400" strokeWidth={2.5} /> : <ArrowUp size={14} className="text-zinc-400" strokeWidth={2.5} />}
                        {sort === "latest" ? "Latest" : "Oldest"}
                    </button>

                    <div className="w-[1px] h-4 bg-zinc-200 mx-1 shrink-0" />

                    {/* Status Filter Pills */}
                    {([
                        { key: "all" as const, label: "All" },
                        { key: "unread" as const, label: "Unread" },
                        { key: "bookmarked" as const, label: "Saved" },
                    ]).map(f => (
                        <button
                            key={f.key}
                            onClick={() => setStatusFilter(f.key)}
                            className={`px-3 py-1.5 text-[12px] font-bold rounded-full transition-all active:scale-[0.96] whitespace-nowrap shrink-0 ${statusFilter === f.key
                                ? "bg-zinc-800 text-white shadow-sm"
                                : "text-zinc-400 hover:text-zinc-700 bg-white border border-zinc-200/50"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* ═══ ACTIVE CATEGORY PILLS (Only shown when browsing feed) ═══ */}
                {isFiltering && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex gap-2 overflow-x-auto px-1 no-scrollbar pb-5 mb-1"
                    >
                        {CATEGORIES.map(cat => {
                            const isActive = categoryFilter.includes(cat.name);
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => handleCategoryToggle(cat.name)}
                                    className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition-all active:scale-[0.96] whitespace-nowrap shrink-0 border ${isActive
                                        ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                                        : "bg-white text-zinc-400 border-zinc-200/60 hover:border-zinc-300"
                                        }`}
                                >
                                    {isActive ? "✓" : cat.emoji} {cat.name}
                                </button>
                            );
                        })}
                    </motion.div>
                )}

                {/* ═══ ARTICLE FEED ═══ */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-4"
                        >
                            {/* Hero skeleton */}
                            <div className="rounded-[2rem] bg-zinc-300/60 h-[280px] animate-pulse" />
                            {/* Card skeletons */}
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-[1.5rem] border border-zinc-200 p-4 flex items-center gap-4">
                                    <div className="w-[80px] h-[80px] rounded-2xl bg-zinc-200 animate-pulse shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-zinc-200 rounded animate-pulse w-1/3" />
                                        <div className="h-4 bg-zinc-300/50 rounded animate-pulse w-full" />
                                        <div className="h-4 bg-zinc-300/50 rounded animate-pulse w-2/3" />
                                        <div className="h-3 bg-zinc-200 rounded animate-pulse w-1/4 mt-1" />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : filteredArticles.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 text-zinc-300 w-full"
                        >
                            <FileText size={44} className="mb-4" strokeWidth={1.5} />
                            <p className="text-base font-semibold tracking-tight text-zinc-400">
                                {searchQuery ? "No matching articles." : "Nothing here yet."}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-5"
                        >
                            {filteredArticles.map((article, index) => {
                                const validImageUrl = getImageUrl(article);
                                const isHero = index === 0 && validImageUrl;
                                const postDate = new Date(article.createdAt);
                                const readTime = estimateReadTime(article.content);
                                const isVisitorRead = visitorState.read[article.id];
                                const isVisitorBookmarked = visitorState.bookmarked[article.id];

                                return (
                                    <motion.div
                                        key={article.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.97 }}
                                        transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                                        className={isHero ? "md:col-span-2" : ""}
                                    >
                                        {isHero ? (
                                            /* ═══ HERO CARD ═══ */
                                            <Link
                                                href={`/curation/${article.id}`}
                                                onClick={() => { setNavigatingId(article.id); }}
                                                className="block group"
                                            >
                                                <div className="relative rounded-[2rem] overflow-hidden bg-zinc-900 shadow-lg active:scale-[0.97] transition-all duration-300 ease-out group/hero">
                                                    {!imgErrors[article.id] ? (
                                                        <img
                                                            src={validImageUrl!}
                                                            alt=""
                                                            className="w-full h-[300px] md:h-[380px] object-cover object-top opacity-80 group-hover/hero:opacity-90 transition-opacity duration-500"
                                                            onError={() => setImgErrors(prev => ({ ...prev, [article.id]: true }))}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-[300px] md:h-[380px] bg-gradient-to-br from-zinc-800 to-zinc-900" />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                                                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                            {article.qualityScore && article.qualityScore >= 75 && (
                                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-sm">
                                                                    ⭐ Top Read
                                                                </span>
                                                            )}
                                                            {article.category && (
                                                                <>
                                                                    <span className="text-white/30">•</span>
                                                                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200/80">
                                                                        {article.category}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <h3 className="text-[22px] md:text-[26px] font-bold tracking-[-0.02em] text-white leading-[1.2] line-clamp-2 md:line-clamp-3 mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                                            {article.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-[12px] font-medium text-white/50">
                                                            <span>{postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                            <span className="w-1 h-1 rounded-full bg-white/25" />
                                                            <span>{readTime} min read</span>
                                                        </div>
                                                    </div>
                                                    {navigatingId === article.id && (
                                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                                                            <Loader2 size={36} className="animate-spin text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        ) : (
                                            /* ═══ SWIPEABLE ARTICLE CARD ═══ */
                                            <SwipeableArticleCard
                                                article={article}
                                                validImageUrl={validImageUrl}
                                                postDate={postDate}
                                                readTime={readTime}
                                                isVisitorRead={!!isVisitorRead}
                                                isVisitorBookmarked={!!isVisitorBookmarked}
                                                imgError={!!imgErrors[article.id]}
                                                onImgError={() => setImgErrors(prev => ({ ...prev, [article.id]: true }))}
                                                onClick={() => { setNavigatingId(article.id); }}
                                                onSwipeRight={() => toggleVisitorRead(article.id)}
                                                onSwipeLeft={() => toggleVisitorBookmark(article.id)}
                                                isNavigating={navigatingId === article.id}
                                                progress={readingProgress[article.id] || 0}
                                                onShare={() => handleShareArticle(article)}
                                            />
                                        )}
                                    </motion.div>
                                );
                            })}

                            {/* Load More Indicator */}
                            {nextCursor && (
                                <div className="flex justify-center py-6">
                                    {isLoadingMore ? (
                                        <Loader2 className="animate-spin text-zinc-400 w-5 h-5" />
                                    ) : (
                                        <div className="h-5" />
                                    )}
                                </div>
                            )}

                            {/* ═══ END OF FEED — SUGGEST CTA ═══ */}
                            {!nextCursor && filteredArticles.length > 0 && (
                                <div className="text-center py-10 space-y-4">
                                    <span className="text-[11px] font-medium text-zinc-300 block">
                                        You&apos;ve reached the end
                                    </span>
                                    {/* Hiding Suggest CTA for now
                                    {!isAdmin && (
                                        <button
                                            onClick={() => setIsSheetOpen(true)}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-500 text-[13px] font-semibold rounded-full border border-zinc-200/80 hover:border-zinc-300 hover:text-zinc-700 active:scale-[0.97] transition-all"
                                        >
                                            <Send size={14} />
                                            Know something we should read? Suggest it.
                                        </button>
                                    )} */}
                                </div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ═══ FAB — Admin: Add, Visitor: Suggest ═══ */}
            {isAdmin ? (
                <button
                    onClick={() => setIsSheetOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.15)] active:scale-90 transition-transform z-40"
                >
                    <Plus size={24} />
                </button>
            ) : null}

            {/* ═══ BOTTOM SHEET ═══ */}
            <BottomSheet isOpen={isSheetOpen} onClose={handleCloseSheet} title={isAdmin ? (editingId ? "Edit Entry" : "Add to Curation") : "Suggest an Article"} footer={
                <button onClick={handleSave} disabled={isSubmitting || !formTitle || !formUrl}
                    className="w-full h-14 bg-zinc-900 text-white rounded-full flex items-center justify-center appearance-none shrink-0 font-bold text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:active:scale-100">
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            <span>{uploadStatus === "uploading" ? "Uploading…" : "Saving…"}</span>
                        </div>
                    ) : (isAdmin ? (editingId ? "Update Article" : "Save Article") : "Send Suggestion")}
                </button>
            }>
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className={LABEL_CLASS}>URL / Link</label>
                        {isFetchingMetadata && (
                            <span className="text-[10px] text-zinc-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Fetching…</span>
                        )}
                    </div>
                    <QuickPasteInput value={formUrl} onChange={setFormUrl} placeholder="Paste link here..." />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Title</label>
                    <input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Article title"
                        className="h-12 bg-zinc-50 rounded-xl border border-zinc-200/80 px-4 text-[14px] outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100 transition-all" />
                </div>

                {isAdmin && (
                    <>
                        <div className="flex flex-col gap-1.5">
                            <label className={LABEL_CLASS}>Notes / Summary</label>
                            <RichTextEditor value={formNotes} onChange={setFormNotes} placeholder="Add a summary..." />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={LABEL_CLASS}>Cover Image</label>
                            <ImagePicker
                                preview={formImagePreview}
                                onSelect={(file: File) => { setFormImageFile(file); setFormImagePreview(URL.createObjectURL(file)); }}
                                onClear={() => { setFormImageFile(null); setFormImagePreview(null); }}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={LABEL_CLASS}>Category</label>
                            <select
                                value={formCategory}
                                onChange={e => setFormCategory(e.target.value)}
                                className="h-12 bg-zinc-50 rounded-xl border border-zinc-200/80 px-4 text-[14px] outline-none focus:border-zinc-300 appearance-none"
                            >
                                <option value="">None</option>
                                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={LABEL_CLASS}>Published Date</label>
                            <input type="date" value={formPublishedTime} onChange={e => setFormPublishedTime(e.target.value)}
                                className="h-12 bg-zinc-50 rounded-xl border border-zinc-200/80 px-4 text-[14px] outline-none focus:border-zinc-300 appearance-none" />
                        </div>
                    </>
                )}
            </BottomSheet>

            {/* ═══ GOOGLE FONTS ═══ */}
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />
        </div>
    );
}

// ═══ SWIPEABLE ARTICLE CARD ═══

function SwipeableArticleCard({
    article,
    validImageUrl,
    postDate,
    readTime,
    isVisitorRead,
    isVisitorBookmarked,
    imgError,
    onImgError,
    onClick,
    onSwipeRight,
    onSwipeLeft,
    isNavigating,
    progress = 0,
    onShare
}: {
    article: ArticleMeta,
    validImageUrl: string | null,
    postDate: Date,
    readTime: number,
    isVisitorRead: boolean,
    isVisitorBookmarked: boolean,
    imgError: boolean,
    onImgError: () => void,
    onClick: () => void,
    onSwipeRight: () => void,
    onSwipeLeft: () => void,
    isNavigating?: boolean,
    progress?: number,
    onShare?: () => void
}) {
    const x = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);

    const bgRightOpacity = useTransform(x, [0, 60], [0, 1]);
    const bgLeftOpacity = useTransform(x, [0, -60], [0, 1]);
    const scaleRightIcon = useTransform(x, [20, 70], [0.5, 1.2]);
    const scaleLeftIcon = useTransform(x, [-20, -70], [0.5, 1.2]);

    const handleDragEnd = (event: any, info: any) => {
        setIsDragging(false);
        const swipeThreshold = 80;
        if (info.offset.x > swipeThreshold) {
            onSwipeRight();
        } else if (info.offset.x < -swipeThreshold) {
            onSwipeLeft();
        }
    };

    return (
        <div className="relative group/card touch-pan-y">
            {/* Action Backgrounds */}
            <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden">
                <motion.div
                    className={`absolute inset-y-0 left-0 w-1/2 flex items-center pl-6 font-bold text-white shadow-inner ${isVisitorRead ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ opacity: bgRightOpacity }}
                >
                    <motion.div style={{ scale: scaleRightIcon }} className="flex items-center gap-2 drop-shadow-md">
                        <CheckCircle size={22} />
                        <span className="text-sm tracking-wide">{isVisitorRead ? "Unread" : "Read"}</span>
                    </motion.div>
                </motion.div>
                <motion.div
                    className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-end pr-6 font-bold text-white bg-blue-500 shadow-inner"
                    style={{ opacity: bgLeftOpacity }}
                >
                    <motion.div style={{ scale: scaleLeftIcon }} className="flex items-center gap-2 drop-shadow-md">
                        <span className="text-sm tracking-wide">{isVisitorBookmarked ? "Remove" : "Save"}</span>
                        <Bookmark fill={isVisitorBookmarked ? "none" : "white"} size={22} className={isVisitorBookmarked ? "" : "fill-white"} />
                    </motion.div>
                </motion.div>
            </div>

            {/* Foreground Card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                style={{ x }}
                whileTap={{ cursor: "grabbing" }}
                className="bg-white rounded-[1.5rem] border border-zinc-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-300 p-4 relative z-10 cursor-grab touch-pan-y"
            >
                <Link
                    href={`/curation/${article.id}`}
                    onClick={(e) => {
                        if (isDragging) { e.preventDefault(); e.stopPropagation(); } else { onClick(); }
                    }}
                    className="flex items-center gap-4 outline-none w-full relative"
                    draggable={false}
                >
                    {isNavigating && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-xl" style={{ margin: '-8px', padding: '8px' }}>
                            <Loader2 size={24} className="animate-spin text-blue-600" />
                        </div>
                    )}
                    {/* Thumbnail */}
                    <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden bg-zinc-50 shrink-0 border border-zinc-100/60 relative pointer-events-none">
                        {validImageUrl && !imgError ? (
                            <img src={validImageUrl} alt="" draggable={false} className="w-full h-full object-cover" onError={onImgError} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100">
                                <FileText size={22} strokeWidth={1.5} />
                            </div>
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0 py-0.5 pointer-events-none">
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                            {isVisitorRead ? (
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-zinc-100 text-zinc-400 px-1.5 py-[2px] rounded">
                                    READ
                                </span>
                            ) : (
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-blue-50 text-blue-500 px-1.5 py-[2px] rounded">
                                    NEW
                                </span>
                            )}
                            {article.qualityScore && article.qualityScore >= 75 && (
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-amber-50 text-amber-600 px-1.5 py-[2px] rounded">
                                    ⭐ TOP
                                </span>
                            )}
                            {article.category && (
                                <>
                                    <span className="text-zinc-200">•</span>
                                    <span className="text-[10px] font-semibold text-zinc-400 truncate">
                                        {article.category}
                                    </span>
                                </>
                            )}
                            {isVisitorBookmarked && (
                                <>
                                    <span className="text-zinc-200">•</span>
                                    <Bookmark size={11} className="fill-blue-500 text-blue-500" />
                                </>
                            )}
                        </div>
                        <h3 className="text-[15px] font-bold tracking-[-0.01em] text-zinc-900 leading-[1.3] line-clamp-2 mb-1.5 group-hover/card:text-blue-600 transition-colors">
                            {article.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                            <span>
                                {postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                {postDate.getFullYear() !== new Date().getFullYear() && `, ${postDate.getFullYear()}`}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-200" />
                            <span>{readTime} min</span>
                        </div>
                    </div>
                </Link>

                {/* Share button */}
                {onShare && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onShare(); }}
                        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 border border-zinc-100 shadow-sm opacity-0 group-hover/card:opacity-100 transition-opacity active:scale-90 pointer-events-auto"
                        aria-label="Share"
                    >
                        <Share2 size={14} className="text-zinc-500" />
                    </button>
                )}

                {/* Reading progress bar */}
                {progress > 0.05 && (
                    <div className="mt-2 w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${progress >= 0.95 ? 'bg-emerald-400' : 'bg-gradient-to-r from-blue-400 to-blue-500'}`}
                            style={{ width: `${Math.min(Math.round(progress * 100), 100)}%` }}
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
}
