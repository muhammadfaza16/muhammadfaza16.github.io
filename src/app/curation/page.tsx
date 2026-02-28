"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, Bookmark, FileText, Plus, X, Camera, Clipboard } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { Toaster, toast } from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { createToReadArticle } from "@/app/master/actions";

type ArticleMeta = {
    id: string;
    title: string;
    url?: string | null;
    coverImage: string | null;
    imageUrl?: string | null;
    createdAt: string;
    isRead: boolean;
};

type FilterType = "all" | "unread" | "read";

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
    } catch (err) { return null; }
}

const ImagePicker = ({ preview, onSelect, onClear }: { preview: string | null; onSelect: (f: File) => void; onClear: () => void; }) => {
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
        <div className="flex flex-col gap-2 w-full">
            <label className={LABEL_CLASS}>Cover Image</label>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onSelect(f); e.target.value = ''; }} />
            {preview ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={onClear} className="absolute top-3 right-3 w-9 h-9 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"><X size={16} /></button>
                    <button onClick={() => inputRef.current?.click()} className="absolute bottom-3 right-3 px-4 py-2.5 bg-black/50 backdrop-blur-md rounded-full text-white text-[13px] font-semibold active:scale-95 flex items-center gap-1.5"><Camera size={14} /> Replace</button>
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

const BottomSheet = ({ isOpen, onClose, title, children, footer }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/25 z-[60] backdrop-blur-sm" />
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }} drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.15} onDragEnd={(_, { offset, velocity }) => { if (offset.y > 100 || velocity.y > 500) onClose(); }} className="fixed bottom-0 left-0 right-0 h-[88vh] bg-white rounded-t-[2rem] z-[70] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.1)] max-w-2xl mx-auto">
                    <div className="w-full flex justify-center py-4 shrink-0 cursor-grab active:cursor-grabbing"><div className="w-10 h-[5px] bg-gray-300 rounded-full" /></div>
                    <div className="px-7 pb-3 shrink-0"><h2 className="text-[22px] font-bold text-zinc-900 tracking-tight">{title}</h2></div>
                    <div className="flex-1 overflow-y-auto px-7 pb-8 pt-2 flex flex-col gap-5 no-scrollbar">{children}</div>
                    {footer && (
                        <div className="shrink-0 px-7 pb-8 pt-4 bg-white border-t border-gray-100">{footer}</div>
                    )}
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
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: { class: 'w-full bg-gray-50 rounded-2xl min-h-[112px] p-5 text-[16px] font-medium text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all prose prose-sm max-w-none [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-2' },
            handlePaste: (_view, event) => {
                const items = event.clipboardData?.items;
                if (!items) return false;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.kind === 'file' && item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (!file) continue;
                        event.preventDefault();
                        const toastId = toast.loading("Uploading image…");
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

    // Keep ref in sync with editor instance
    useEffect(() => { editorRef.current = editor; }, [editor]);
    useEffect(() => { if (editor && value !== editor.getHTML()) { if (value === "") editor.commands.setContent(""); } }, [value, editor]);
    if (!editor) return <div className="w-full bg-gray-50 rounded-2xl h-28 p-5 animate-pulse" />;

    const handleQuickPaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && editor) { editor.commands.insertContent(text); toast.success("Pasted to editor", { icon: "📋", duration: 1500 }); }
            else toast.error("Clipboard is empty");
        } catch (err) { toast.error("Clipboard access denied"); }
    };

    return (
        <div className="relative w-full group">
            <EditorContent editor={editor} />
            {editor.isEmpty && <div className="absolute top-8 left-5 pointer-events-none text-zinc-400 font-medium text-[16px]">{placeholder}</div>}
            <button type="button" onClick={handleQuickPaste} tabIndex={-1} className="absolute top-3 right-3 p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 active:scale-90 transition-all rounded-lg z-10" title="Paste from clipboard">
                <Clipboard size={18} strokeWidth={2.5} />
            </button>
        </div>
    );
};

export default function CurationList() {
    const [articles, setArticles] = useState<ArticleMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>("all");

    // Form State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formUrl, setFormUrl] = useState("");
    const [formNotes, setFormNotes] = useState("");
    const [formImageFile, setFormImageFile] = useState<File | null>(null);
    const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "saving">("idle");

    // Initialize Supabase once so we can generate public URLs
    const supabase = getSupabase();

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
        }

        setUploadStatus("saving");
        const res = await createToReadArticle(formTitle, formUrl, formNotes, imageUrl);

        setIsSubmitting(false); setUploadStatus("idle");

        if (res.success && res.data) {
            toast.success("Saved to Curation!");
            setArticles(prev => [{ ...res.data, createdAt: res.data.createdAt.toISOString() }, ...prev]);
            setIsSheetOpen(false);
            setFormTitle(""); setFormUrl(""); setFormNotes("");
            setFormImageFile(null); setFormImagePreview(null);
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

    const filteredArticles = articles.filter(a => {
        if (filter === "unread") return !a.isRead;
        if (filter === "read") return a.isRead;
        return true;
    });

    return (
        <div className="h-screen w-full flex flex-col bg-white text-zinc-900 font-sans antialiased overflow-hidden relative selection:bg-zinc-200">
            <Toaster
                position="bottom-center"
                toastOptions={{
                    style: { background: '#1a1a1a', color: '#fff', borderRadius: '100px', fontSize: '14px', fontWeight: '600', padding: '12px 20px' },
                    duration: 2500,
                }}
            />
            {/* Ambient Background (Fixed) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-100/60 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-100/50 blur-[100px]" />
            </div>

            {/* Glass Header */}
            <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-xl border-b border-gray-200/50 shrink-0 pb-3 pt-5 px-5 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <Link href="/" className="w-11 h-11 flex items-center justify-center text-zinc-900 active:bg-gray-100 active:scale-90 rounded-full transition-all bg-white/50 backdrop-blur-md shadow-sm border border-gray-100">
                        <ChevronLeft size={24} />
                    </Link>
                    <h2 className="text-[18px] font-bold tracking-tight text-zinc-900">Curation</h2>
                    <div className="w-11" /> {/* Spacer for centering */}
                </div>

                {/* Premium Segmented Control */}
                <div className="flex bg-gray-100/70 p-1 rounded-xl w-full">
                    <button
                        onClick={() => setFilter("all")}
                        className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all active:scale-[0.98] ${filter === "all" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter("unread")}
                        className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all active:scale-[0.98] ${filter === "unread" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
                    >
                        Unread
                    </button>
                    <button
                        onClick={() => setFilter("read")}
                        className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all active:scale-[0.98] ${filter === "read" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
                    >
                        Read
                    </button>
                </div>
            </header>

            {/* Scrollable List Container */}
            <main className="flex-1 overflow-y-auto px-5 pt-4 pb-32 relative z-10 w-full max-w-2xl mx-auto">
                <div className="flex flex-col gap-3">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="skeleton"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col gap-3 w-full"
                            >
                                <div className="flex flex-col items-center justify-center py-[20vh] w-full min-h-[50vh] gap-6">
                                    <div className="relative flex items-center justify-center">
                                        <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-xl animate-pulse-slow" />
                                        <div className="w-16 h-16 bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl flex items-center justify-center shadow-sm relative z-10">
                                            <Bookmark size={24} className="text-zinc-400 animate-pulse" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-[14px] font-bold tracking-widest uppercase text-zinc-400">
                                            Curating Sanctuary
                                        </p>
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : filteredArticles.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20 opacity-50 text-zinc-400 w-full"
                            >
                                <Bookmark size={48} className="mb-4" strokeWidth={1.5} />
                                <p className="text-lg font-medium tracking-tight">No articles found.</p>
                            </motion.div>
                        ) : (
                            <AnimatePresence>
                                {filteredArticles.map((article, index) => {
                                    // 1. Extract domain for metadata from actual URL
                                    let domain = "";
                                    if (article.url) {
                                        try {
                                            domain = new URL(article.url).hostname.replace('www.', '');
                                        } catch (_) {
                                            domain = article.url.substring(0, 30); // fallback if malformed
                                        }
                                    }

                                    // 2. Determine valid image url from Supabase
                                    let validImageUrl: string | null = null;
                                    const activeImage = article.imageUrl || article.coverImage;

                                    if (activeImage) {
                                        // Make sure we have a full public URL, not just a filename
                                        if (activeImage.startsWith('http')) {
                                            validImageUrl = activeImage;
                                        } else if (supabase) {
                                            const { data } = supabase.storage.from('images').getPublicUrl(activeImage);
                                            validImageUrl = data.publicUrl;
                                        }
                                    }

                                    const isLast = index === filteredArticles.length - 1;

                                    return (
                                        <motion.div
                                            key={article.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                                        >
                                            <Link
                                                href={`/curation/${article.id}`}
                                                className={`block active:bg-gray-50/80 transition-colors ${!isLast ? 'border-b border-gray-200/50' : ''}`}
                                            >
                                                <div className="flex items-center justify-between py-4 pr-1 min-h-[90px]">

                                                    {/* Text Content */}
                                                    <div className="flex flex-col flex-1 pr-6 min-w-0 justify-center">
                                                        {(domain || !article.isRead) && (
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                {!article.isRead && (
                                                                    <div className="w-[6px] h-[6px] rounded-full bg-blue-500 shrink-0" />
                                                                )}
                                                                {domain && (
                                                                    <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-400 truncate">
                                                                        {domain}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        <h3 className="text-[16px] font-bold tracking-tight text-zinc-900 leading-tight mb-2 line-clamp-2">
                                                            {article.title}
                                                        </h3>
                                                        <span className="text-[12px] font-medium text-zinc-400">
                                                            {formatDistanceToNow(new Date(article.createdAt))} ago
                                                        </span>
                                                    </div>

                                                    {/* Thumbnail or Fallback */}
                                                    {validImageUrl && (
                                                        <div className="w-16 h-16 rounded-[14px] overflow-hidden bg-gray-50 shrink-0 border border-gray-200/60 relative">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={validImageUrl}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                                    if (fallback) fallback.style.display = 'flex';
                                                                }}
                                                            />
                                                            {/* Graceful Fallback (Hidden by Default) */}
                                                            <div className="w-full h-full hidden flex-col items-center justify-center absolute inset-0 text-gray-300">
                                                                <FileText size={20} strokeWidth={1.5} />
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                    </AnimatePresence>
                </div>
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
                <ImagePicker preview={formImagePreview} onSelect={(f) => { setFormImageFile(f); setFormImagePreview(URL.createObjectURL(f)); }} onClear={() => { setFormImageFile(null); setFormImagePreview(null); }} />
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
            </BottomSheet>
        </div>
    );
}
