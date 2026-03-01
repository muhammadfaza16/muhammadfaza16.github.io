"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, Bookmark, FileText, Plus, Loader2 } from "lucide-react";
import { Toaster, toast } from 'react-hot-toast';
import { createToReadArticle, updateToReadArticle } from "@/app/master/actions";
import { uploadImageToSupabase } from "@/lib/uploadImage";
import { getSupabase } from "@/lib/supabase";
import { BottomSheet, ImagePicker, QuickPasteInput, RichTextEditor } from "@/components/sanctuary";

interface ArticleMeta {
    id: string;
    title: string;
    content: string;
    url: string | null;
    imageUrl: string | null;
    category: string | null;
    isRead: boolean;
    createdAt: string;
}

type FilterType = "all" | "unread" | "read";

const LABEL_CLASS = "text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1";

const CATEGORIES = [
    "AI & Tools",
    "Wealth & Business",
    "Mindset & Philosophy",
    "Self-Improvement & Productivity",
    "Career & Skills",
    "Marketing & Growth",
    "Building & Design",
    "Health & Lifestyle"
];

export default function CurationList() {
    const [articles, setArticles] = useState<ArticleMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>("all");
    const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);

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

                    // Conditional autofill: only if empty
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
        }, 800);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formUrl]);

    const handleEditArticle = (article: ArticleMeta) => {
        if (article) {
            setEditingId(article.id);
            setFormTitle(article.title);
            setFormUrl(article.url || "");
            setFormNotes(article.content);
            setFormImagePreview(article.imageUrl);
            setFormPublishedTime(new Date(article.createdAt).toISOString().slice(0, 16));
            setFormCategory(article.category || "");
            setFormImageFile(null);
            setIsSheetOpen(true);
        }
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

    useEffect(() => {
        if (!isSheetOpen) {
            setFormTitle(""); setFormUrl(""); setFormNotes("");
            setFormImageFile(null); setFormImagePreview(null);
            setFormPublishedTime("");
            setFormCategory("");
            setUploadStatus("idle");
            setEditingId(null);
        }
    }, [isSheetOpen]);

    const handleSave = async () => {
        if (!formTitle || !formUrl) {
            toast.error("Title and URL are required");
            return;
        }
        setIsSubmitting(true);
        try {
            let finalImageUrl = formImagePreview;

            if (formImageFile) {
                setUploadStatus("uploading");
                const uploadedUrl = await uploadImageToSupabase(formImageFile);
                if (uploadedUrl) {
                    finalImageUrl = uploadedUrl;
                } else {
                    toast.error("Failed to upload image");
                    setIsSubmitting(false);
                    setUploadStatus("idle");
                    return;
                }
            }

            const payload = {
                title: formTitle,
                url: formUrl,
                notes: formNotes,
                imageUrl: finalImageUrl || undefined,
                createdAt: formPublishedTime || undefined,
                category: formCategory || undefined,
            };

            setUploadStatus("saving");
            if (editingId) {
                const res = await updateToReadArticle(editingId, payload.title, payload.url, payload.notes, payload.imageUrl, payload.category, payload.createdAt);
                if (res.success && res.data) {
                    toast.success("Article updated");
                    setArticles(prev => prev.map(a => a.id === editingId ? { ...(res.data as any), createdAt: res.data!.createdAt.toISOString() } : a));
                    setIsSheetOpen(false);
                } else {
                    toast.error(res.error || "Failed to update");
                }
            } else {
                const res = await createToReadArticle(payload.title, payload.url, payload.notes, payload.imageUrl, payload.category, payload.createdAt);
                if (res.success && res.data) {
                    toast.success("Saved to Curation");
                    setArticles(prev => [{ ...(res.data as any), createdAt: res.data!.createdAt.toISOString() }, ...prev]);
                    setIsSheetOpen(false);
                } else {
                    toast.error(res.error || "Failed to save");
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

    // Data Fetching logic
    const fetchArticles = async (currentCursor: string | null, currentFilter: string, isLoadMore = false) => {
        try {
            if (isLoadMore) setIsLoadingMore(true);
            else setIsLoading(true);

            let url = `/api/curation?limit=10&filter=${currentFilter}`;
            if (currentCursor) url += `&cursor=${currentCursor}`;

            const res = await fetch(url, { cache: 'no-store' });
            const data = await res.json();

            if (data.articles) {
                if (isLoadMore) {
                    setArticles(prev => [...prev, ...data.articles]);
                } else {
                    setArticles(data.articles);
                }
                setNextCursor(data.nextCursor);
            }
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Initial load and on filter change
    useEffect(() => {
        setNextCursor(null);
        setArticles([]); // clear existing items immediately on filter change for better UX
        fetchArticles(null, filter, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Intersection Observer for Infinite Scroll
    const observer = useRef<IntersectionObserver | null>(null);
    const loaderRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading || isLoadingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && nextCursor) {
                fetchArticles(nextCursor, filter, true);
            }
        }, { threshold: 0.1 });

        if (node) observer.current.observe(node);
    }, [isLoading, isLoadingMore, nextCursor, filter]);

    const handleFilterChange = (f: FilterType) => {
        setFilter(f);
    };

    // Helper to resolve image URLs
    const getImageUrl = (article: ArticleMeta): string | null => {
        const activeImage = article.imageUrl;
        if (!activeImage) return null;
        if (activeImage.startsWith('http')) return activeImage;
        const { data } = supabase.storage.from('images').getPublicUrl(activeImage);
        return data.publicUrl;
    };

    const getDomain = (url?: string | null): string => {
        if (!url) return "";
        try { return new URL(url).hostname.replace('www.', ''); } catch { return url.substring(0, 30); }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-[#fafafa] text-zinc-900 font-sans antialiased overflow-hidden relative selection:bg-zinc-200">
            <Toaster
                position="bottom-center"
                toastOptions={{
                    style: { background: '#1a1a1a', color: '#fff', borderRadius: '100px', fontSize: '14px', fontWeight: '600', padding: '12px 20px' },
                    duration: 2500,
                }}
            />

            {/* Glass Header */}
            <header className="sticky top-0 z-50 bg-[#fafafa]/80 backdrop-blur-xl border-b border-gray-200/50 shrink-0 pb-3 pt-5 px-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="w-10 h-10 flex items-center justify-center text-zinc-900 active:bg-gray-100 active:scale-90 rounded-full transition-all">
                        <ChevronLeft size={22} />
                    </Link>
                    <h2 className="text-[17px] font-bold tracking-tight text-zinc-900">Curation</h2>
                    <div className="w-10" />
                </div>

                {/* Pill Tabs */}
                <div className="flex gap-2">
                    {(["all", "unread", "read"] as FilterType[]).map(f => (
                        <button
                            key={f}
                            onClick={() => handleFilterChange(f)}
                            className={`px-4 py-1.5 text-[12px] font-bold rounded-full transition-all active:scale-[0.96] capitalize ${filter === f
                                ? "bg-zinc-900 text-white shadow-sm"
                                : "bg-white text-zinc-500 border border-gray-200"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            {/* Scrollable Card Feed */}
            <main className="flex-1 overflow-y-auto px-4 pt-5 pb-32 relative z-10 w-full max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center justify-center py-[20vh] w-full gap-5"
                        >
                            <div className="relative w-10 h-10">
                                <div className="absolute inset-0 border-[3px] border-gray-200 border-t-zinc-900 rounded-full animate-spin" />
                            </div>
                            <p className="text-[13px] font-medium text-zinc-400 tracking-wide">Loading your feed…</p>
                        </motion.div>
                    ) : articles.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 text-zinc-300 w-full"
                        >
                            <Bookmark size={44} className="mb-4" strokeWidth={1.5} />
                            <p className="text-base font-semibold tracking-tight text-zinc-400">Nothing here yet.</p>
                            <p className="text-[13px] text-zinc-400 mt-1">Tap + to save your first article.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-4"
                        >
                            {articles.map((article, index) => {
                                const domain = getDomain(article.url);
                                const validImageUrl = getImageUrl(article);
                                const isHero = index === 0 && validImageUrl;
                                const postDate = new Date(article.createdAt);

                                return (
                                    <motion.div
                                        key={article.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.97 }}
                                        transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                                    >
                                        <Link
                                            href={`/curation/${article.id}`}
                                            className="block group"
                                        >
                                            {isHero ? (
                                                /* ═══ HERO CARD (first article with image) ═══ */
                                                <div className="relative rounded-3xl overflow-hidden bg-zinc-900 shadow-sm active:scale-[0.98] transition-transform">
                                                    {!imgErrors[article.id] ? (
                                                        <img
                                                            src={validImageUrl!}
                                                            alt=""
                                                            className="w-full aspect-[16/10] object-cover"
                                                            onError={() => setImgErrors(prev => ({ ...prev, [article.id]: true }))}
                                                        />
                                                    ) : (
                                                        <div className="w-full aspect-[16/10] bg-gradient-to-br from-zinc-800 to-zinc-900" />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                                        <div className="flex items-center gap-2 mb-2.5">
                                                            {article.isRead ? (
                                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] bg-zinc-800/80 text-zinc-400 px-2 py-0.5 rounded-md backdrop-blur-sm">
                                                                    READ
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] bg-blue-500/90 text-white px-2 py-0.5 rounded-md shadow-sm backdrop-blur-sm">
                                                                    UNREAD
                                                                </span>
                                                            )}
                                                            {article.category && (
                                                                <>
                                                                    <span className="text-white/30">•</span>
                                                                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-300">
                                                                        {article.category}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <h3 className="text-[20px] font-bold tracking-tight text-white leading-snug line-clamp-2 mb-2">
                                                            {article.title}
                                                        </h3>
                                                        <span className="text-[11px] font-medium text-white/50">
                                                            {postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.98] active:bg-gray-50 transition-all p-4">
                                                    <div className="flex items-center gap-3">
                                                        {/* Thumbnail */}
                                                        <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                                            {validImageUrl && !imgErrors[article.id] ? (
                                                                <img
                                                                    src={validImageUrl}
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                    onError={() => setImgErrors(prev => ({ ...prev, [article.id]: true }))}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                    <FileText size={22} strokeWidth={1.5} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Text */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 mb-1.5 mt-0.5">
                                                                {article.isRead ? (
                                                                    <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-slate-100/80 text-slate-500 px-1.5 py-[2px] rounded border border-slate-200">
                                                                        READ
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-blue-100 text-blue-700 px-1.5 py-[2px] rounded border border-blue-200">
                                                                        UNREAD
                                                                    </span>
                                                                )}
                                                                {article.category && (
                                                                    <>
                                                                        <span className="text-zinc-300">•</span>
                                                                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-500 truncate">
                                                                            {article.category}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <h3 className="text-[15px] font-bold tracking-tight text-zinc-900 leading-snug line-clamp-2">
                                                                {article.title}
                                                            </h3>
                                                            <span className="text-[11px] font-medium text-zinc-400 mt-1 block">
                                                                {postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                {postDate.getFullYear() !== new Date().getFullYear() && `, ${postDate.getFullYear()}`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}

                            {/* Infinite Scroll Sentinel */}
                            {nextCursor && (
                                <div ref={loaderRef} className="flex justify-center py-6">
                                    {isLoadingMore ? (
                                        <Loader2 className="animate-spin text-zinc-400 w-5 h-5" />
                                    ) : (
                                        <div className="h-5" /> // Empty space for observer to hit
                                    )}
                                </div>
                            )}
                            {!nextCursor && articles.length > 0 && (
                                <div className="text-center py-8">
                                    <span className="text-[11px] font-medium text-zinc-400">
                                        You&apos;ve reached the end
                                    </span>
                                </div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Floating Add Button */}
            <button
                onClick={() => setIsSheetOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.15)] active:scale-90 transition-transform z-40"
            >
                <Plus size={24} />
            </button>

            <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title="Add to Curation" footer={
                <button onClick={handleSave} disabled={isSubmitting || !formTitle || !formUrl}
                    className="w-full h-14 bg-black text-white rounded-full flex items-center justify-center appearance-none shrink-0 font-bold text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:active:scale-100">
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            <span>{uploadStatus === "uploading" ? "Uploading…" : "Saving…"}</span>
                        </div>
                    ) : "Save Article"}
                </button>
            }>
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className={LABEL_CLASS}>URL / Link</label>
                        {isFetchingMetadata && (
                            <div className="flex items-center gap-1.5 text-zinc-400">
                                <Loader2 size={12} className="animate-spin" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Scanning...</span>
                            </div>
                        )}
                    </div>
                    <QuickPasteInput value={formUrl} onChange={setFormUrl} placeholder="https://example.com" type="url" />
                </div>
                <ImagePicker preview={formImagePreview} onSelect={(f) => { setFormImageFile(f); setFormImagePreview(URL.createObjectURL(f)); }} onClear={() => { setFormImageFile(null); setFormImagePreview(null); }} />
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Title</label>
                    <QuickPasteInput value={formTitle} onChange={setFormTitle} placeholder="Article or page title" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Notes</label>
                    <RichTextEditor value={formNotes} onChange={setFormNotes} placeholder="Quick notes or summary…" />
                </div>
            </BottomSheet>
        </div>
    );
}
