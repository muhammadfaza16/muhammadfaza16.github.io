"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence, useTransform } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, Share, Trash2, Globe, Pencil, Loader2, Camera, X, Clipboard, ImageIcon, MessageSquareQuote, ChevronsDown, Maximize, Minimize, Minus, Plus, Type } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getSupabase } from "@/lib/supabase";
import DOMPurify from 'dompurify';
import { toggleReadStatus, updateToReadArticle, deleteToReadArticle } from "@/app/master/actions";
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
    const [isZenMode, setIsZenMode] = useState(false);

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
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-zinc-900 rounded-full animate-spin"></div>
                    <p className="text-zinc-500 font-medium tracking-tight">Loading article...</p>
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

    const handleOpenWeb = () => {
        if (!article.url) {
            toast.error("No source URL available");
            return;
        }
        window.open(article.url, "_blank");
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
            if (res.data) setArticle({ ...res.data, createdAt: String(res.data.createdAt) } as Article);
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
                    <div className="w-full aspect-[16/9] max-h-[40vh] relative overflow-hidden bg-zinc-900 mb-8 rounded-b-[2.5rem] shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={validImageUrl} alt="Cover" className="w-full h-full object-cover object-top" />
                        {/* Gradient Overlay for Text Readability - Always Above Image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10"></div>

                        {/* Title overlay inside the image */}
                        <div className="absolute bottom-0 left-0 w-full px-5 pb-8 md:px-12 md:pb-12 max-w-3xl mx-auto right-0 z-20">
                            <h1 className="text-[32px] md:text-5xl font-bold font-sans tracking-tight leading-tight mb-4 text-white drop-shadow-md">
                                {article.title}
                            </h1>
                            <div className="flex items-center gap-4 text-white/90 font-medium text-[13px] tracking-wide">
                                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                    <Clock size={14} />
                                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                    <span className="mx-1 text-white/50">•</span>
                                    {readingTime} min read
                                </span>
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
                        <div className="flex items-center gap-4 text-zinc-500 font-medium text-[13px] tracking-wide">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                                <Clock size={14} />
                                {new Date(article.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric'
                                })}
                                <span className="mx-1 text-zinc-300">•</span>
                                {readingTime} min read
                            </span>
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
                    className="reader-content prose max-w-none select-text touch-auto
                    prose-p:text-[18px] prose-p:leading-[1.8] prose-p:mb-6 prose-p:font-serif prose-p:text-slate-800
                    prose-li:text-[18px] prose-li:leading-[1.8] prose-li:font-serif prose-li:text-slate-800
                    prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900
                    prose-h2:text-[24px] prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-[20px] prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4
                    prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-a:transition-colors prose-a:underline-offset-4
                    prose-img:rounded-3xl prose-img:border prose-img:border-gray-100 prose-img:shadow-sm prose-img:my-8
                    prose-hr:border-gray-100 prose-hr:my-8
                    prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:px-6 prose-blockquote:py-3 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-zinc-700
                    prose-code:text-rose-600 prose-code:bg-rose-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-medium
                    prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl prose-pre:shadow-sm"
                    style={{ WebkitUserSelect: 'text', userSelect: 'text' } as React.CSSProperties}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                />
            </main>

            {/* Bottom Action Bar — 4 Buttons: Back, Zen, Open Web, Mark as Read */}
            <AnimatePresence>
                {isNavVisible && !isZenMode && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-sm h-14 bg-black/90 backdrop-blur-xl rounded-full text-white shadow-2xl flex items-center justify-evenly z-50"
                    >
                        <button onClick={() => router.push("/curation")} className="p-2 active:scale-90 transition-transform text-white/80 hover:text-white flex items-center justify-center">
                            <ArrowLeft size={22} />
                        </button>
                        <div className="w-[1px] h-6 bg-white/10" />
                        <button onClick={() => setIsAppearanceSheetOpen(true)} className="p-2 active:scale-90 transition-transform text-white/80 hover:text-white flex items-center justify-center font-serif font-bold text-[18px] leading-none" title="Appearance">
                            Aa
                        </button>
                        <div className="w-[1px] h-6 bg-white/10" />
                        <button onClick={() => setIsZenMode(true)} className="p-2 active:scale-90 transition-transform text-white/80 hover:text-white flex items-center justify-center" title="Zen Mode">
                            <Maximize size={20} />
                        </button>
                        <div className="w-[1px] h-6 bg-white/10" />
                        <button onClick={handleOpenWeb} className="p-2 active:scale-90 transition-transform text-white/80 hover:text-white flex items-center justify-center">
                            <Globe size={20} />
                        </button>
                        <div className="w-[1px] h-6 bg-white/10" />
                        <button
                            onClick={handleMarkAsRead}
                            disabled={isMarkingRead}
                            className={`p-2 active:scale-90 transition-transform flex items-center justify-center disabled:opacity-50 ${article.isRead ? "text-emerald-400" : "text-white/80 hover:text-white"}`}
                        >
                            {isMarkingRead ? <Loader2 size={22} className="animate-spin" /> : <CheckCircle size={22} />}
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
