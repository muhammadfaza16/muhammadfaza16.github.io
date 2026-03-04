"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence, useTransform } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, Share, Trash2, Globe, Pencil, Loader2, Camera, X, Clipboard, ImageIcon, MessageSquareQuote, ChevronsDown, Maximize, Minimize, Minus, Plus, Type, Bookmark } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getSupabase } from "@/lib/supabase";
import DOMPurify from 'dompurify';
import { toggleReadStatus, updateToReadArticle, deleteToReadArticle, toggleBookmarkStatus } from "@/app/master/actions";
import { toast } from "react-hot-toast";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image as TiptapImage } from '@tiptap/extension-image';

type Article = {
    id: string;
    title: string;
    content: string;
    url?: string | null;
    imageUrl?: string | null;
    createdAt: string;
    isRead: boolean;
    isBookmarked: boolean;
    category?: string | null;
};

type Comment = {
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
};

const THEMES = {
    white: { bg: '#FFFFFF', text: '#1A1A1A', name: 'White' },
    parchment: { bg: '#F4F1EA', text: '#2C2C2C', name: 'Parchment' },
    sepia: { bg: '#FBF0D2', text: '#433422', name: 'Sepia' },
    night: { bg: '#121212', text: '#E0E0E0', name: 'Night' }
};

type ThemeKey = keyof typeof THEMES;

const LABEL_CLASS = "text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1";

import { uploadImageToSupabase } from "@/lib/uploadImage";
import { BottomSheet, ImagePicker, QuickPasteInput, RichTextEditor } from "@/components/sanctuary";



export default function CurationReaderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMarkingRead, setIsMarkingRead] = useState(false);
    const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Appearance State
    const [isAppearanceSheetOpen, setIsAppearanceSheetOpen] = useState(false);
    const [readerSettings, setReaderSettings] = useState({
        fontSize: 18,
        lineHeight: 1.8,
        theme: 'parchment' as ThemeKey,
        fontFamily: 'serif' as 'serif' | 'sans'
    });

    // Edit Sheet State
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formUrl, setFormUrl] = useState("");
    const [formNotes, setFormNotes] = useState("");
    const [formImageFile, setFormImageFile] = useState<File | null>(null);
    const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
    const [formPublishedTime, setFormPublishedTime] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "saving">("idle");
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
    const formFooterRef = useRef<HTMLDivElement>(null);

    // Comments State
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [newCommentName, setNewCommentName] = useState("");
    const [newCommentText, setNewCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const supabase = getSupabase();

    // 1. Scroll Progress & Hide-On-Scroll Logic (Must be above early returns)
    const { scrollY, scrollYProgress } = useScroll();
    const topMaskOpacity = useTransform(scrollY, [100, 300], [0, 1]);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const lastYRef = useRef(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = lastYRef.current;
        const diff = latest - previous;

        if (Math.abs(diff) > 10) {
            if (latest > previous && latest > 150) {
                setIsNavVisible(false);
            } else {
                setIsNavVisible(true);
            }
            lastYRef.current = latest;
        }
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        if (!id) return;

        fetch(`/api/curation/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Article not found");
                return res.json();
            })
            .then(data => {
                setArticle(data);
                // Pre-populate form state for edit action
                setFormTitle(data.title || "");
                setFormUrl(data.url || ""); // Schema mapping: url is stored in url
                setFormNotes(data.content || "");
                setFormImagePreview(data.imageUrl || null);
                setIsLoading(false);
            })
            .catch(error => {
                toast.error(error.message);
                setIsLoading(false);
            });

        // Check admin status via secure cookie
        fetch("/api/auth")
            .then(res => res.json())
            .then(data => setIsAdmin(data.isAdmin === true))
            .catch(() => setIsAdmin(false));

        // Fetch comments
        fetch(`/api/curation/comments?articleId=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setComments(data.data);
                }
                setIsLoadingComments(false);
            })
            .catch(() => {
                setIsLoadingComments(false);
                console.error("Failed to load comments");
            });
    }, [id]);

    // Auto-fetch metadata
    useEffect(() => {
        // Skip fetch if form hasn't been modified yet or isn't a valid url
        if (!formUrl || !formUrl.startsWith("http")) return;
        // Don't auto-fetch if we're just rendering the initial value from the DB
        if (article && article.url === formUrl) return;

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
                    // Note: Edit form already has a preview likely from DB, so only overwrite if empty
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fafaf8] antialiased">
                {/* Hero skeleton */}
                <div className="w-full h-[55vh] bg-zinc-200 animate-pulse rounded-b-[2.5rem]" />

                {/* Content skeleton */}
                <div className="max-w-[65ch] mx-auto px-5 pt-10 space-y-6">
                    {/* Title */}
                    <div className="space-y-3">
                        <div className="h-8 bg-zinc-200 rounded-xl animate-pulse w-[90%]" />
                        <div className="h-8 bg-zinc-200 rounded-xl animate-pulse w-[60%]" />
                    </div>

                    {/* Meta bar */}
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-32 bg-zinc-100 rounded-full animate-pulse" />
                        <div className="h-5 w-20 bg-zinc-100 rounded-full animate-pulse" />
                    </div>

                    {/* Paragraph lines */}
                    <div className="space-y-3 pt-4">
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-full" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-[95%]" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-[88%]" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-full" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-[70%]" />
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-full" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-[92%]" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-[85%]" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-[50%]" />
                    </div>
                </div>
            </div>
        );
    }

    if (!article) return null;

    let validImageUrl: string | null = null;
    const activeImage = article.imageUrl;

    if (activeImage) {
        if (activeImage.startsWith('http')) {
            validImageUrl = activeImage;
        } else if (supabase) {
            const { data } = supabase.storage.from('images').getPublicUrl(activeImage);
            validImageUrl = data.publicUrl;
        }
    }

    // 2. Reading Time Calculation
    const WORDS_PER_MINUTE = 225;
    const wordCount = article.content ? article.content.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

    // 3. Action Handlers
    const handleAnnotateClick = () => {
        const selectedText = window.getSelection()?.toString().trim();

        if (selectedText) {
            const newNote = `<blockquote>${selectedText}</blockquote><p></p>`;

            if (article) {
                setFormTitle(article.title || "");
                setFormUrl(article.url || "");
                setFormImagePreview(article.imageUrl || null);
                const existingNotes = article.content || "";
                setFormNotes(existingNotes ? `${existingNotes}<br>${newNote}` : newNote);
            }

            window.getSelection()?.removeAllRanges();
            setIsEditSheetOpen(true);
        } else {
            toast.error("Select text in the article first to annotate.");
        }
    };

    const handleEditClick = () => {
        if (article) {
            setFormTitle(article.title || "");
            setFormUrl(article.url || "");
            setFormNotes(article.content || "");
            setFormImagePreview(article.imageUrl || null);
            setFormImageFile(null); // Fix: Reset any lingering file selection
        }
        setIsEditSheetOpen(true);
    };

    const handleMarkAsRead = async () => {
        if (!article || isMarkingRead) return;
        setIsMarkingRead(true);
        const toastId = toast.loading(article.isRead ? "Marking as unread..." : "Marking as read...");

        try {
            const res = await toggleReadStatus(article.id, article.isRead);
            if (res.success) {
                toast.success(article.isRead ? "Marked as unread" : "Marked as read", { id: toastId });
                setArticle({ ...article, isRead: !article.isRead } as Article);
            } else {
                throw new Error(res.error);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update status", { id: toastId });
        } finally {
            setIsMarkingRead(false);
        }
    };

    const handleToggleBookmark = async () => {
        if (!article || isTogglingBookmark) return;
        setIsTogglingBookmark(true);
        const toastId = toast.loading(article.isBookmarked ? "Removing from bookmarks..." : "Saving to bookmarks...");

        try {
            const res = await toggleBookmarkStatus(article.id, article.isBookmarked);
            if (res.success) {
                toast.success(article.isBookmarked ? "Removed from bookmarks" : "Saved to bookmarks", { id: toastId });
                setArticle({ ...article, isBookmarked: !article.isBookmarked } as Article);
            } else {
                throw new Error(res.error);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update bookmark", { id: toastId });
        } finally {
            setIsTogglingBookmark(false);
        }
    };

    const handleOpenWeb = () => {
        if (!article.url) {
            toast.error("No source URL available");
            return;
        }
        window.open(article.url, "_blank");
    };

    const handleShare = async () => {
        if (!article) return;
        const shareData = {
            title: article.title,
            text: article.content ? article.content.substring(0, 100) + '...' : 'Check out this article I saved in my curation.',
            url: window.location.href,
        };
        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleEditSave = async () => {
        if (!formTitle || !formUrl || !article) {
            toast.error("Title and URL are required");
            return;
        }

        setIsSubmitting(true);
        let updatedImageUrl: string | undefined = undefined;

        if (formImageFile) {
            setUploadStatus("uploading");
            const uploadedUrl = await uploadImageToSupabase(formImageFile);
            if (!uploadedUrl) {
                toast.error("Image upload failed");
                setIsSubmitting(false);
                setUploadStatus("idle");
                return;
            }
            updatedImageUrl = uploadedUrl;
        } else if (formImagePreview) {
            updatedImageUrl = formImagePreview;
        }

        setUploadStatus("saving");
        const res = await updateToReadArticle(article.id, formTitle, formUrl, formNotes, updatedImageUrl, formPublishedTime);

        if (res.success) {
            toast.success("Article updated");
            // Refresh local state to reflect edits immediately
            if (res.data) setArticle({ ...res.data, createdAt: String((res.data as any).createdAt) } as any);
            setIsEditSheetOpen(false);
        } else {
            toast.error(res.error || "Failed to update article");
        }
        setIsSubmitting(false);
        setUploadStatus("idle");
    };

    const handleDelete = async () => {
        if (!article) return;
        if (!confirm("Are you sure you want to delete this article?")) return;

        setIsSubmitting(true);
        const res = await deleteToReadArticle(article.id);

        if (res.success) {
            toast.success("Article deleted");
            router.push("/curation");
        } else {
            toast.error(res.error || "Failed to delete article");
            setIsSubmitting(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim() || !article) return;

        setIsSubmittingComment(true);
        try {
            const res = await fetch("/api/curation/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    articleId: article.id,
                    authorName: newCommentName.trim() || undefined,
                    content: newCommentText.trim(),
                }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setComments(prev => [data.comment, ...prev]);
                setNewCommentText("");
                toast.success("Comment posted!");
            } else {
                toast.error(data.error || "Failed to post comment");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <div
            className="min-h-screen transition-colors duration-500 selection:bg-blue-200 antialiased pb-32 scroll-smooth overscroll-contain"
            style={{ backgroundColor: THEMES[readerSettings.theme].bg, color: THEMES[readerSettings.theme].text }}
        >
            {/* Top Reading Progress Bar */}
            <AnimatePresence>
                {!isZenMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 right-0 h-[3px] bg-blue-600 origin-left z-[60]"
                        style={{ scaleX }}
                    />
                )}
            </AnimatePresence>

            {/* Zen Mode Fade-Out Masks */}
            <AnimatePresence>
                {isZenMode && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className="fixed top-0 left-0 right-0 h-[10vh] z-[40] pointer-events-none"
                        >
                            <motion.div
                                style={{
                                    opacity: topMaskOpacity,
                                    background: `linear-gradient(to bottom, ${THEMES[readerSettings.theme].bg} 20%, transparent 100%)`
                                }}
                                className="w-full h-full"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className="fixed bottom-0 left-0 right-0 h-[10vh] z-[40] pointer-events-none"
                            style={{ background: `linear-gradient(to top, ${THEMES[readerSettings.theme].bg} 20%, transparent 100%)` }}
                        />
                    </>
                )}
            </AnimatePresence>

            {/* Exit Zen Mode Toggle */}
            <AnimatePresence>
                {isZenMode && (
                    <motion.button
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        onClick={() => setIsZenMode(false)}
                        className="fixed bottom-8 right-8 w-12 h-12 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 opacity-40 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 z-[70] cursor-pointer"
                        title="Exit Zen Mode"
                    >
                        <Minimize size={20} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Floating Back Button (Hide on Scroll Down) */}
            <AnimatePresence>
                {isNavVisible && !isZenMode && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-5 left-5 z-50"
                    >
                        <Link
                            href="/curation"
                            className="w-11 h-11 flex items-center justify-center text-zinc-900 active:scale-90 rounded-full transition-all bg-white/70 backdrop-blur-xl shadow-sm border border-gray-200/50"
                        >
                            <ArrowLeft size={24} />
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Header */}
            <motion.div animate={{ filter: isZenMode ? "grayscale(30%) brightness(0.8)" : "grayscale(0%) brightness(1)" }} transition={{ duration: 0.8 }} className={isZenMode ? "pointer-events-none" : ""}>
                {validImageUrl ? (
                    <div className="w-full min-h-[50vh] sm:min-h-[60vh] relative overflow-hidden bg-zinc-900 mb-8 rounded-b-[2.5rem] shadow-sm flex flex-col justify-end">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={validImageUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover object-top" />
                        {/* Gradient Overlay for Text Readability - Always Above Image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20 pointer-events-none z-10"></div>

                        {/* Title overlay inside the image */}
                        <div className="relative z-20 w-full px-5 pb-8 pt-28 md:px-12 md:pb-12 max-w-3xl mx-auto mt-auto">
                            <h1 className="text-[32px] md:text-5xl font-bold font-sans tracking-tight leading-tight mb-4 text-white drop-shadow-lg">
                                {article.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-white/90 font-medium text-[13px] tracking-wide">
                                <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                    <Clock size={14} />
                                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                    <span className="mx-1 text-white/50">•</span>
                                    {readingTime} min read
                                </span>
                                {article.category && (
                                    <span className="flex items-center gap-1.5 bg-blue-500/20 text-blue-50 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-400/30">
                                        <Bookmark size={14} />
                                        {article.category}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className="w-full px-5 pt-24 pb-8 md:px-12 md:pt-32 md:pb-12 max-w-3xl mx-auto border-b transition-colors duration-500"
                        style={{ borderColor: readerSettings.theme === 'night' ? '#333' : '#f3f4f6' }}
                    >
                        <h1
                            className="text-[32px] md:text-5xl font-bold font-sans tracking-tight leading-tight mb-6 transition-colors duration-500"
                            style={{ color: THEMES[readerSettings.theme].text }}
                        >
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-zinc-500 font-medium text-[13px] tracking-wide">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                                <Clock size={14} />
                                {new Date(article.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric'
                                })}
                                <span className="mx-1 text-zinc-300">•</span>
                                {readingTime} min read
                            </span>
                            {article.category && (
                                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100">
                                    <Bookmark size={14} />
                                    {article.category}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* HTML / Rich Text Content */}
            <main
                className="max-w-3xl mx-auto px-5 relative z-20 select-text cursor-text touch-auto pt-8 md:px-12"
                style={{
                    WebkitUserSelect: 'text', userSelect: 'text', WebkitTouchCallout: 'default',
                    '--reader-font-size': `${readerSettings.fontSize}px`,
                    '--reader-line-height': readerSettings.lineHeight,
                    '--reader-font-family': readerSettings.fontFamily === 'serif' ? 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' : 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    '--theme-text': THEMES[readerSettings.theme].text,
                    '--theme-quote-border': readerSettings.theme === 'night' ? '#333' : '#cbd5e1',
                    '--theme-quote-bg': readerSettings.theme === 'night' ? '#1e1e1e' : '#f8fafc',
                    '--theme-accent': readerSettings.theme === 'night' ? '#60a5fa' : '#2563eb'
                } as React.CSSProperties}
            >
                <article
                    className="reader-content prose max-w-[65ch] mx-auto select-text touch-auto
                    prose-p:text-[19px] prose-p:leading-[1.9] prose-p:mb-7 prose-p:font-serif prose-p:text-slate-800
                    prose-li:text-[19px] prose-li:leading-[1.9] prose-li:font-serif prose-li:text-slate-800
                    prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900
                    prose-h2:text-[26px] prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-5
                    prose-h3:text-[22px] prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4
                    prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-a:transition-colors prose-a:underline-offset-4
                    prose-img:rounded-3xl prose-img:border prose-img:border-gray-100 prose-img:shadow-sm prose-img:my-8
                    prose-hr:border-gray-100 prose-hr:my-8
                    prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-zinc-700
                    prose-code:text-rose-600 prose-code:bg-rose-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-medium
                    prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl prose-pre:shadow-sm"
                    style={{ WebkitUserSelect: 'text', userSelect: 'text' } as React.CSSProperties}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                />

                {/* Bookmark Button at bottom */}
                <div className="mt-8 mb-24 flex justify-end">
                    <button
                        onClick={handleToggleBookmark}
                        disabled={isTogglingBookmark}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[13px] transition-all active:scale-95 border shadow-sm ${article.isBookmarked
                            ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                            : "bg-white text-zinc-700 border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        {isTogglingBookmark ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Bookmark size={16} className={article.isBookmarked ? "fill-blue-600 border-blue-600" : ""} />
                        )}
                        {article.isBookmarked ? "Bookmarked" : "Bookmark"}
                    </button>
                </div>

                {/* Legacy Community Section: Comments */}
                <div className="mt-16 mb-40 pt-16 border-t pb-10" style={{ borderColor: THEMES[readerSettings.theme].text + '20' }}>
                    <div className="flex items-center gap-3 mb-8">
                        <MessageSquareQuote size={24} className="text-zinc-400" />
                        <h3 className="text-[20px] font-bold tracking-tight text-zinc-900 font-sans" style={{ color: THEMES[readerSettings.theme].text }}>
                            Community Legacy
                        </h3>
                    </div>

                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="mb-12 bg-black/[0.02] dark:bg-white/[0.02] rounded-[1.5rem] p-5 md:p-6 border" style={{ borderColor: THEMES[readerSettings.theme].text + '10' }}>
                        <div className="flex flex-col gap-4">
                            <textarea
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder="Share your thoughts or legacy on this piece..."
                                rows={3}
                                className="w-full bg-white dark:bg-zinc-900/50 rounded-2xl px-5 py-4 text-[15px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 border border-transparent outline-none focus:border-blue-500/50 focus:bg-white transition-all resize-none shadow-sm"
                            />
                            <div className="flex items-center justify-between gap-4">
                                <input
                                    type="text"
                                    value={newCommentName}
                                    onChange={(e) => setNewCommentName(e.target.value)}
                                    placeholder="Your Name (Optional)"
                                    className="w-[180px] bg-white dark:bg-zinc-900/50 rounded-full px-4 text-[13px] font-medium h-10 border border-transparent outline-none focus:border-zinc-300 transition-all shadow-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!newCommentText.trim() || isSubmittingComment}
                                    className="h-10 px-6 bg-blue-600 text-white rounded-full font-bold text-[13px] tracking-wide shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center min-w-[100px]"
                                >
                                    {isSubmittingComment ? <Loader2 size={16} className="animate-spin" /> : "Post"}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="flex flex-col gap-6">
                        {isLoadingComments ? (
                            <div className="flex justify-center py-8">
                                <Loader2 size={24} className="animate-spin text-zinc-400" />
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-[14px] text-zinc-500 font-medium tracking-tight">Be the first to leave a legacy here.</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[14px] font-sans" style={{ color: THEMES[readerSettings.theme].text }}>
                                            {comment.authorName}
                                        </span>
                                        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
                                            {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-[15px] leading-relaxed font-serif text-zinc-700 dark:text-zinc-300">
                                        {comment.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Bottom Action Bar — 4 Buttons: Back, Zen, Open Web, Mark as Read */}
            <AnimatePresence>
                {isNavVisible && !isZenMode && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center justify-between px-2 py-1.5 w-[90%] max-w-[340px] bg-black/85 dark:bg-white/10 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/15 text-white"
                    >
                        <button onClick={() => setIsAppearanceSheetOpen(true)} className="p-2 active:scale-90 transition-transform text-white/80 hover:text-white flex items-center justify-center font-serif font-bold text-[18px] leading-none" title="Appearance">
                            Aa
                        </button>
                        <div className="w-[1px] h-6 bg-white/15" />
                        <button onClick={() => setIsZenMode(true)} className="p-2 active:scale-90 transition-transform text-white/80 hover:text-white flex items-center justify-center" title="Zen Mode">
                            <Maximize size={18} />
                        </button>
                        {isAdmin && (
                            <>
                                <div className="w-[1px] h-6 bg-white/15" />
                                <button onClick={handleEditClick} className="p-2 active:scale-90 transition-transform text-white/80 hover:text-white flex items-center justify-center" title="Edit Article">
                                    <Pencil size={18} />
                                </button>
                            </>
                        )}
                        <div className="w-[1px] h-6 bg-white/15" />
                        <button onClick={handleShare} className="p-2 active:scale-90 transition-transform text-white/80 hover:text-white flex items-center justify-center" title="Share">
                            <Share size={18} />
                        </button>
                        <div className="w-[1px] h-6 bg-white/15" />
                        <button onClick={handleOpenWeb} className="p-2 active:scale-90 transition-transform text-white/80 hover:text-white flex items-center justify-center" title="Open Source">
                            <Globe size={18} />
                        </button>
                        <div className="w-[1px] h-6 bg-white/15" />
                        <button
                            onClick={handleMarkAsRead}
                            disabled={isMarkingRead}
                            className={`p-2 active:scale-90 transition-transform flex items-center justify-center disabled:opacity-50 ${article.isRead ? "text-emerald-400" : "text-white/80 hover:text-white"}`}
                            title={article.isRead ? "Mark as unread" : "Mark as read"}
                        >
                            {isMarkingRead ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Appearance Settings Sheet */}
            <BottomSheet isOpen={isAppearanceSheetOpen} onClose={() => setIsAppearanceSheetOpen(false)} title="Appearance">
                <div className="flex flex-col gap-8 pb-4">

                    {/* Font Size Row */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Font Size ({readerSettings.fontSize}px)</label>
                        <div className="flex items-center gap-3 w-full bg-gray-50 rounded-2xl p-2 border border-gray-100">
                            <button
                                onClick={() => setReaderSettings(prev => ({ ...prev, fontSize: Math.max(16, prev.fontSize - 1) }))}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-zinc-600"
                            >
                                <Minus size={20} />
                            </button>
                            <div className="flex-1 flex justify-center text-zinc-800 font-semibold text-lg">{readerSettings.fontSize}</div>
                            <button
                                onClick={() => setReaderSettings(prev => ({ ...prev, fontSize: Math.min(24, prev.fontSize + 1) }))}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-zinc-600"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Line Spacing */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Line Spacing</label>
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                            {[
                                { label: 'Tight', value: 1.4 },
                                { label: 'Normal', value: 1.8 },
                                { label: 'Wide', value: 2.2 }
                            ].map(sp => (
                                <button
                                    key={sp.label}
                                    onClick={() => setReaderSettings(prev => ({ ...prev, lineHeight: sp.value }))}
                                    className={`flex-1 py-3 text-[14px] font-semibold rounded-xl transition-all ${readerSettings.lineHeight === sp.value ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                                >
                                    {sp.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Family */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Typography</label>
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                            <button
                                onClick={() => setReaderSettings(prev => ({ ...prev, fontFamily: 'serif' }))}
                                className={`flex-1 py-3 text-[15px] font-serif rounded-xl transition-all ${readerSettings.fontFamily === 'serif' ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                Serif
                            </button>
                            <button
                                onClick={() => setReaderSettings(prev => ({ ...prev, fontFamily: 'sans' }))}
                                className={`flex-1 py-3 text-[15px] font-sans rounded-xl transition-all ${readerSettings.fontFamily === 'sans' ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                Sans
                            </button>
                        </div>
                    </div>

                    {/* Theme Picker */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1">Theme</label>
                        <div className="flex items-center justify-around bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            {(Object.entries(THEMES) as [ThemeKey, typeof THEMES[ThemeKey]][]).map(([key, themeInfo]) => (
                                <button
                                    key={key}
                                    onClick={() => setReaderSettings(prev => ({ ...prev, theme: key as ThemeKey }))}
                                    className={`w-12 h-12 rounded-full transition-all border shadow-sm flex items-center justify-center ${readerSettings.theme === key ? 'ring-4 ring-blue-500/30 scale-110 border-transparent' : 'border-gray-200 hover:scale-105'}`}
                                    style={{ backgroundColor: themeInfo.bg }}
                                    title={themeInfo.name}
                                >
                                    <span style={{ color: themeInfo.text }} className="font-serif font-bold text-[15px]">Aa</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </BottomSheet>

            {/* Edit Article Sheet */}
            <BottomSheet
                isOpen={isEditSheetOpen}
                onClose={() => {
                    setIsEditSheetOpen(false);
                    // Reset to original article values to clear any unsaved edits/image selections
                    if (article) {
                        setFormTitle(article.title || "");
                        setFormUrl(article.url || "");
                        setFormNotes(article.content || "");
                        setFormImagePreview(article.imageUrl || null);
                        setFormPublishedTime(article.createdAt ? String(article.createdAt) : "");
                        setFormImageFile(null);
                    }
                }}
                title="Edit Article"
                footer={
                    <div ref={formFooterRef} className="flex flex-row justify-between items-center gap-x-3">
                        <button
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-inner border border-red-100 active:scale-90 transition-transform"
                            title="Delete Article"
                        >
                            <Trash2 size={24} />
                        </button>
                        <button
                            onClick={handleEditSave}
                            disabled={isSubmitting || !formTitle || !formUrl}
                            className="flex-1 h-12 bg-black rounded-full flex items-center justify-center text-white font-semibold text-base shadow-lg active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <span className="flex items-center justify-center">
                                    Save Changes
                                </span>
                            )}
                        </button>
                    </div>
                }
            >
                <div className="mt-2" />
                <div className="flex flex-col gap-1.5 mt-2">
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
                <ImagePicker
                    preview={formImagePreview}
                    onSelect={(file) => {
                        setFormImageFile(file);
                        setFormImagePreview(URL.createObjectURL(file));
                    }}
                    onClear={() => {
                        setFormImageFile(null);
                        setFormImagePreview(null);
                    }}
                />
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
