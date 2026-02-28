"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence } from "framer-motion";
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
    coverImage: string | null;
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

// ============================================================================
// REUSABLE UI COMPONENTS (Ported from Master CMS)
// ============================================================================
const INPUT_CLASS = "w-full bg-gray-50 rounded-2xl h-13 px-5 py-3.5 text-[16px] font-semibold text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all placeholder:text-zinc-400 placeholder:font-medium";
const LABEL_CLASS = "text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1";

async function uploadImageToSupabase(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `cms/${fileName}`;

    try {
        const client = getSupabase();
        const { error } = await client.storage.from('images').upload(filePath, file, { cacheControl: '3600', upsert: false });
        if (error) return null;
        const { data } = client.storage.from('images').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (err: any) {
        return null;
    }
}

const BottomSheet = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/25 z-[70] backdrop-blur-sm" />
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }} drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.15} onDragEnd={(_, { offset, velocity }) => { if (offset.y > 100 || velocity.y > 500) onClose(); }} className="fixed bottom-0 left-0 right-0 h-[88vh] bg-white rounded-t-[2rem] z-[80] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.1)]">
                    <div className="w-full flex justify-center py-4 shrink-0 cursor-grab active:cursor-grabbing"><div className="w-10 h-[5px] bg-gray-300 rounded-full" /></div>
                    <div className="px-7 pb-3 shrink-0"><h2 className="text-[22px] font-bold text-zinc-900 tracking-tight">{title}</h2></div>
                    <div className="flex-1 overflow-y-auto px-7 pb-32 pt-2 flex flex-col gap-5 no-scrollbar">{children}</div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

const QuickPasteInput = ({ value, onChange, placeholder, type = "text" }: { value: string, onChange: (v: string) => void, placeholder: string, type?: string }) => {
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) { onChange(text); toast.success("Pasted", { icon: "📋", duration: 1500 }); }
            else toast.error("Clipboard is empty");
        } catch (err) { toast.error("Clipboard access denied"); }
    };

    return (
        <div className="relative w-full">
            <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder} className={`${INPUT_CLASS} pr-12`} />
            <button type="button" onClick={handlePaste} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 active:scale-90 transition-all rounded-lg" title="Paste from clipboard">
                <Clipboard size={18} strokeWidth={2.5} />
            </button>
        </div>
    );
};

const MinimalRichTextEditor = ({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder: string }) => {
    const editorRef = useRef<ReturnType<typeof useEditor>>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TiptapImage.configure({ inline: false, allowBase64: false }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
        editorProps: {
            attributes: { class: 'w-full bg-gray-50 rounded-2xl min-h-[180px] p-5 pt-8 text-[16px] font-medium text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all prose prose-sm max-w-none [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-2' },
            handlePaste: (_view, event) => {
                const items = event.clipboardData?.items;
                if (!items) return false;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.kind === 'file' && item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (!file) continue;
                        event.preventDefault();
                        const toastId = toast.loading("Uploading image\u2026");
                        uploadImageToSupabase(file).then((url) => {
                            const ed = editorRef.current;
                            if (url && ed) {
                                ed.chain().focus().setImage({ src: url }).run();
                                toast.success("Image added!", { id: toastId });
                            } else {
                                toast.error("Upload failed", { id: toastId });
                            }
                        });
                        return true;
                    }
                }
                return false;
            },
        },
    });

    useEffect(() => { editorRef.current = editor; }, [editor]);
    useEffect(() => { if (editor && value !== editor.getHTML()) { editor.commands.setContent(value); } }, [value, editor]);

    if (!editor) return <div className="w-full bg-gray-50 rounded-2xl h-28 p-5 animate-pulse" />;

    const handleQuickPaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && editor) { editor.commands.insertContent(text); toast.success("Pasted to editor", { icon: "\ud83d\udccb", duration: 1500 }); }
            else toast.error("Clipboard is empty");
        } catch (err) { toast.error("Clipboard access denied"); }
    };

    return (
        <div className="relative w-full group">
            <EditorContent editor={editor} />
            {editor.isEmpty && (<div className="absolute top-8 left-5 pointer-events-none text-zinc-400 font-medium text-[16px]">{placeholder}</div>)}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-1 bg-white/80 backdrop-blur border border-zinc-200 rounded-lg shadow-sm p-1 z-10">
                <button type="button" onClick={handleQuickPaste} tabIndex={-1} className="p-1.5 text-zinc-400 hover:text-purple-500 hover:bg-purple-50 active:scale-90 transition-all rounded-md" title="Quick Paste">
                    <Clipboard size={16} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

const ImagePicker = ({ preview, onSelect, onClear }: { preview: string | null; onSelect: (file: File) => void; onClear: () => void; }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) { onSelect(file); e.preventDefault(); return; }
            }
        }
    };

    const handleQuickPasteImage = async () => {
        try {
            const items = await navigator.clipboard.read();
            for (const item of items) {
                if (item.types.some(type => type.startsWith('image/'))) {
                    const typeToGet = item.types.includes('image/png') ? 'image/png' : item.types.find(t => t.startsWith('image/'));
                    if (typeToGet) {
                        const blob = await item.getType(typeToGet);
                        const file = new File([blob], `pasted-image-${Date.now()}.${typeToGet.split('/')[1]}`, { type: typeToGet });
                        onSelect(file); toast.success("Image pasted from clipboard"); return;
                    }
                }
            }
            toast.error("No image found in clipboard");
        } catch (err) { toast.error("Clipboard access denied or nothing to paste"); }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className={LABEL_CLASS}>Cover Image</label>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) onSelect(file); e.target.value = ''; }} />
            {preview ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={onClear} className="absolute top-3 right-3 w-9 h-9 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"><X size={16} /></button>
                    <button onClick={() => inputRef.current?.click()} className="absolute bottom-3 right-3 px-4 py-2.5 bg-black/50 backdrop-blur-md rounded-full text-white text-[13px] font-semibold active:scale-95 transition-transform flex items-center gap-1.5"><Camera size={14} /> Replace</button>
                </div>
            ) : (
                <div tabIndex={0} onPaste={handlePaste} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className={`w-full aspect-video rounded-2xl border-2 border-dashed bg-gray-50/50 flex items-center justify-center gap-4 transition-all outline-none ${isFocused ? 'border-blue-400 bg-blue-50/30' : 'border-gray-200'}`}>
                    <button onClick={() => inputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 group active:scale-95 transition-transform">
                        <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors"><Camera size={24} className="text-zinc-500 group-hover:text-blue-500" /></div>
                        <span className="text-[13px] font-bold text-zinc-500">Browse</span>
                    </button>
                    <div className="w-[1px] h-12 bg-gray-200 rounded-full" />
                    <button onClick={handleQuickPasteImage} className="flex flex-col items-center justify-center gap-2 group active:scale-95 transition-transform">
                        <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-purple-200 group-hover:bg-purple-50 transition-colors"><Clipboard size={24} className="text-zinc-500 group-hover:text-purple-500" /></div>
                        <span className="text-[13px] font-bold text-zinc-500">Paste Image</span>
                    </button>
                </div>
            )}
        </div>
    );
};

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "saving">("idle");
    const formFooterRef = useRef<HTMLDivElement>(null);

    const supabase = getSupabase();

    // 1. Scroll Progress & Hide-On-Scroll Logic (Must be above early returns)
    const { scrollY, scrollYProgress } = useScroll();
    const [isNavVisible, setIsNavVisible] = useState(true);
    const lastYRef = useRef(0);

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

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
                setFormUrl(data.coverImage || ""); // Schema mapping: url is stored in coverImage
                setFormNotes(data.content || "");
                setFormImagePreview(data.imageUrl || data.coverImage || null);
            })
            .catch(() => router.push('/curation'))
            .finally(() => setIsLoading(false));
    }, [id, router]);

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
    const activeImage = article.imageUrl || article.coverImage;

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
                setFormUrl(article.coverImage || "");
                setFormImagePreview(article.imageUrl || article.coverImage || null);
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
            setFormUrl(article.coverImage || ""); // Schema mapping: url is stored in coverImage
            setFormNotes(article.content || "");
            setFormImagePreview(article.imageUrl || article.coverImage || null);
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
        if (!article.coverImage) {
            toast.error("No valid URL found for this article");
            return;
        }
        window.open(article.coverImage, "_blank");
    };

    const handleEditSave = async () => {
        if (!formTitle || !formUrl || !article) {
            toast.error("Title and URL are required");
            return;
        }

        setIsSubmitting(true);
        let finalImageUrl = formImagePreview;

        if (formImageFile) {
            setUploadStatus("uploading");
            const uploadedUrl = await uploadImageToSupabase(formImageFile);
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl;
            } else {
                toast.error("Failed to upload image. Saving without new image.");
            }
        }

        setUploadStatus("saving");
        const res = await updateToReadArticle(article.id, formTitle, formUrl, formNotes, finalImageUrl || undefined);

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
            <style dangerouslySetInnerHTML={{
                __html: `
                html, body {
                    scroll-behavior: smooth !important;
                    overscroll-behavior-y: contain !important;
                    scroll-snap-type: y proximity !important;
                }
                .reader-content p {
                    scroll-snap-align: start;
                    scroll-snap-stop: normal;
                }
                .reader-content p, .reader-content li {
                    font-size: ${readerSettings.fontSize}px !important;
                    line-height: ${readerSettings.lineHeight} !important;
                    font-family: ${readerSettings.fontFamily === 'serif' ? 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' : 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'} !important;
                    color: ${THEMES[readerSettings.theme].text} !important;
                    transition: font-size 0.3s ease, line-height 0.3s ease, color 0.5s ease;
                }
                .reader-content h1, .reader-content h2, .reader-content h3, .reader-content h4 {
                    font-family: ${readerSettings.fontFamily === 'serif' ? 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' : 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'};
                    color: ${THEMES[readerSettings.theme].text} !important;
                    transition: color 0.5s ease;
                }
                .reader-content blockquote {
                    color: ${THEMES[readerSettings.theme].text} !important;
                    border-left-color: ${readerSettings.theme === 'night' ? '#333' : '#cbd5e1'} !important;
                    background-color: ${readerSettings.theme === 'night' ? '#1e1e1e' : '#f8fafc'} !important;
                }
                .reader-content a {
                    color: ${readerSettings.theme === 'night' ? '#60a5fa' : '#2563eb'} !important;
                }
                .reader-content strong, .reader-content b {
                    color: ${THEMES[readerSettings.theme].text} !important;
                }
            `}} />

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
                            style={{ background: `linear-gradient(to bottom, ${THEMES[readerSettings.theme].bg} 20%, transparent 100%)` }}
                        />
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsZenMode(false)}
                        className="fixed top-6 right-6 w-10 h-10 bg-black/5 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 opacity-30 hover:opacity-100 transition-opacity z-[70] cursor-pointer"
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
            {validImageUrl ? (
                <div className="w-full h-[35vh] min-h-[300px] relative overflow-hidden bg-zinc-900 mb-8 rounded-b-[2.5rem] shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={validImageUrl} alt="Cover" className="w-full h-full object-cover" />
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

            {/* HTML / Rich Text Content */}
            <main
                className={`max-w-3xl mx-auto px-5 relative z-20 select-text cursor-text touch-auto transition-all duration-700 ease-in-out will-change-transform transform-gpu ${isZenMode ? "py-[20vh] md:py-[25vh] md:px-5" : "pt-8 md:px-12"}`}
                style={{ WebkitUserSelect: 'text', userSelect: 'text', WebkitTouchCallout: 'default' } as React.CSSProperties}
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
            <BottomSheet isOpen={isEditSheetOpen} onClose={() => setIsEditSheetOpen(false)} title="Edit Article">
                <button
                    onClick={() => formFooterRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="self-start text-slate-500 text-xs font-medium bg-slate-100/70 rounded-full px-3 py-1 flex items-center justify-center gap-1 active:scale-95 transition-all mb-2"
                >
                    <ChevronsDown size={12} /> Jump to Actions
                </button>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Title</label>
                    <QuickPasteInput value={formTitle} onChange={setFormTitle} placeholder="Article or page title" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>URL / Link</label>
                    <QuickPasteInput value={formUrl} onChange={setFormUrl} placeholder="https://example.com" type="url" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Notes</label>
                    <MinimalRichTextEditor value={formNotes} onChange={setFormNotes} placeholder="Quick notes or summary…" />
                </div>

                <div className="mt-2" />
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

                <div className="h-6" />

                <div ref={formFooterRef} className="flex flex-row justify-between items-center gap-x-3 border-t border-gray-100 mt-6 px-4 py-6">
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
            </BottomSheet>
        </div>
    );
}
