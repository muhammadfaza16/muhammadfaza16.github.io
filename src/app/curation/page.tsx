"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, Bookmark, FileText, Plus, Loader2 } from "lucide-react";
import { Toaster, toast } from 'react-hot-toast';
import { createToReadArticle } from "@/app/master/actions";
import { uploadImageToSupabase } from "@/lib/uploadImage";
import { getSupabase } from "@/lib/supabase";
import { BottomSheet, ImagePicker, QuickPasteInput, RichTextEditor } from "@/components/sanctuary";

type ArticleMeta = {
    id: string;
    title: string;
    url?: string | null;
    imageUrl?: string | null;
    createdAt: string;
    isRead: boolean;
};

type FilterType = "all" | "unread" | "read";

const LABEL_CLASS = "text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1";






export default function CurationList() {
    const [articles, setArticles] = useState<ArticleMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>("all");
    const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
    const PAGE_SIZE = 10;
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // Form State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formUrl, setFormUrl] = useState("");
    const [formNotes, setFormNotes] = useState("");
    const [formImageFile, setFormImageFile] = useState<File | null>(null);
    const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
    const [formPublishedTime, setFormPublishedTime] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "saving">("idle");
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
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

    useEffect(() => {
        if (!isSheetOpen) {
            setFormTitle(""); setFormUrl(""); setFormNotes("");
            setFormImageFile(null); setFormImagePreview(null);
            setFormPublishedTime("");
            setUploadStatus("idle");
        }
    }, [isSheetOpen]);

    const handleSave = async () => {
        if (!formTitle || !formUrl) {
            toast.error("Title and URL are required");
            return;
        }
        setIsSubmitting(true);
        let imageUrl: string | undefined = formImagePreview || undefined;
        if (formImageFile) {
            setUploadStatus("uploading");
            const uploadedUrl = await uploadImageToSupabase(formImageFile);
            if (!uploadedUrl) {
                toast.error("Image upload failed");
                setIsSubmitting(false); setUploadStatus("idle");
                return;
            }
            imageUrl = uploadedUrl;
        } else if (!formImageFile && formImagePreview && formImagePreview.startsWith("http")) { // Handle scrape image fallback
            imageUrl = formImagePreview;
        }

        setUploadStatus("saving");
        const res = await createToReadArticle(formTitle, formUrl, formNotes, imageUrl, formPublishedTime);

        setIsSubmitting(false); setUploadStatus("idle");

        if (res.success && res.data) {
            toast.success("Saved to Curation!");
            setArticles(prev => [{ ...res.data, createdAt: res.data.createdAt.toISOString() }, ...prev]);
            setIsSheetOpen(false);
            setFormTitle(""); setFormUrl(""); setFormNotes("");
            setFormImageFile(null); setFormImagePreview(null);
            setFormPublishedTime("");
        } else {
            toast.error(res.error || "Failed to save");
        }
    };

    useEffect(() => {
        fetch("/api/curation", { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setArticles(data);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const filteredArticles = articles
        .filter(a => {
            if (filter === "unread") return !a.isRead;
            if (filter === "read") return a.isRead;
            return true;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const visibleArticles = filteredArticles.slice(0, visibleCount);
    const hasMore = visibleCount < filteredArticles.length;

    const handleFilterChange = (f: FilterType) => {
        setFilter(f);
        setVisibleCount(PAGE_SIZE);
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
                    ) : filteredArticles.length === 0 ? (
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
                            {visibleArticles.map((article, index) => {
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
                                                            {!article.isRead && (
                                                                <div className="w-[6px] h-[6px] rounded-full bg-blue-400 shrink-0" />
                                                            )}
                                                            {domain && (
                                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">
                                                                    {domain}
                                                                </span>
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
                                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                                {!article.isRead && (
                                                                    <div className="w-[5px] h-[5px] rounded-full bg-blue-500 shrink-0" />
                                                                )}
                                                                {domain && (
                                                                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 truncate">
                                                                        {domain}
                                                                    </span>
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

                            {/* Load More / Count */}
                            <div className="flex flex-col items-center gap-3 pt-2 pb-4">
                                <span className="text-[11px] font-medium text-zinc-400">
                                    Showing {visibleArticles.length} of {filteredArticles.length}
                                </span>
                                {hasMore && (
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                                        className="px-6 py-2.5 bg-white border border-gray-200 rounded-full text-[13px] font-bold text-zinc-700 active:scale-[0.96] active:bg-gray-50 transition-all shadow-sm"
                                    >
                                        Load More
                                    </button>
                                )}
                            </div>
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
