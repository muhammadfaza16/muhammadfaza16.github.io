"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, Lock, Plus, Edit2, Trash2,
    Book, ShoppingBag, FileText, Bookmark,
    Clock, Globe, ChevronRight, Camera, X, Image as ImageIcon, Clipboard
} from "lucide-react";
import Link from "next/link";
import {
    getToReadArticles, createToReadArticle, toggleReadStatus, deleteToReadArticle, updateToReadArticle,
    getWritingArticles, createWritingArticle, togglePublishStatus, deleteWritingArticle, updateWritingArticle,
    getBooks, createBook, deleteBook, updateBook,
    getWishlistItems, createWishlistItem, deleteWishlistItem, updateWishlistItem
} from "./actions";
import { Toaster, toast } from 'react-hot-toast';
import { getSupabase } from "@/lib/supabase";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// ============================================================================
// TYPES & CONSTANTS
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
}

const CATEGORIES: CategoryInfo[] = [
    { id: "writing", label: "Writing", icon: <FileText className="w-5 h-5 text-blue-600" strokeWidth={2.5} />, desc: "Articles & Essays", type: "list", iconBg: "bg-blue-50" },
    { id: "toread", label: "To Read", icon: <Bookmark className="w-5 h-5 text-amber-600" strokeWidth={2.5} />, desc: "Saved links", type: "list", iconBg: "bg-amber-50" },
    { id: "books", label: "Books", icon: <Book className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />, desc: "Library", type: "grid", iconBg: "bg-emerald-50" },
    { id: "wishlist", label: "Wishlist", icon: <ShoppingBag className="w-5 h-5 text-purple-600" strokeWidth={2.5} />, desc: "Saved items", type: "grid", iconBg: "bg-purple-50" },
];

const INPUT_CLASS = "w-full bg-gray-50 rounded-2xl h-13 px-5 py-3.5 text-[16px] font-semibold text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all placeholder:text-zinc-400 placeholder:font-medium";
const LABEL_CLASS = "text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1";

// ============================================================================
// IMAGE UPLOAD HELPER
// ============================================================================
async function uploadImageToSupabase(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `cms/${fileName}`;

    try {
        const client = getSupabase();

        const { error } = await client.storage
            .from('images')
            .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (error) {
            console.error('Upload error:', error);
            return null;
        }

        const { data } = client.storage.from('images').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (err: any) {
        console.error('Supabase not configured:', err.message);
        return null;
    }
}

// ============================================================================
// REUSABLE UI COMPONENTS
// ============================================================================

// --- Image Picker with Clipboard Paste ---
const ImagePicker = ({ preview, onSelect, onClear }: {
    preview: string | null;
    onSelect: (file: File) => void;
    onClear: () => void;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    onSelect(file);
                    e.preventDefault();
                    return;
                }
            }
        }
    };

    const handleQuickPasteImage = async () => {
        try {
            const items = await navigator.clipboard.read();
            for (const item of items) {
                if (item.types.some(type => type.startsWith('image/'))) {
                    // Try to get png first, then jpeg
                    const typeToGet = item.types.includes('image/png') ? 'image/png' : item.types.find(t => t.startsWith('image/'));
                    if (typeToGet) {
                        const blob = await item.getType(typeToGet);
                        // Convert blob to file so the upstream handler treats it exactly like a file upload
                        const file = new File([blob], `pasted-image-${Date.now()}.${typeToGet.split('/')[1]}`, { type: typeToGet });
                        onSelect(file);
                        toast.success("Image pasted from clipboard");
                        return;
                    }
                }
            }
            toast.error("No image found in clipboard");
        } catch (err) {
            console.error("Paste error:", err);
            toast.error("Clipboard access denied or nothing to paste");
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className={LABEL_CLASS}>Cover Image</label>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onSelect(file);
                    e.target.value = '';
                }}
            />
            {preview ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                        onClick={onClear}
                        className="absolute top-3 right-3 w-9 h-9 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                    >
                        <X size={16} />
                    </button>
                    <button
                        onClick={() => inputRef.current?.click()}
                        className="absolute bottom-3 right-3 px-4 py-2.5 bg-black/50 backdrop-blur-md rounded-full text-white text-[13px] font-semibold active:scale-95 transition-transform flex items-center gap-1.5"
                    >
                        <Camera size={14} /> Replace
                    </button>
                </div>
            ) : (
                <div
                    tabIndex={0}
                    onPaste={handlePaste}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full aspect-video rounded-2xl border-2 border-dashed bg-gray-50/50 flex items-center justify-center gap-4 transition-all outline-none
                        ${isFocused ? 'border-blue-400 bg-blue-50/30' : 'border-gray-200'}`}
                >
                    {/* Action A: Browse */}
                    <button
                        onClick={() => inputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-2 group active:scale-95 transition-transform"
                    >
                        <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                            <Camera size={24} className="text-zinc-500 group-hover:text-blue-500" />
                        </div>
                        <span className="text-[13px] font-bold text-zinc-500">Browse</span>
                    </button>

                    <div className="w-[1px] h-12 bg-gray-200 rounded-full" />

                    {/* Action B: Paste Image */}
                    <button
                        onClick={handleQuickPasteImage}
                        className="flex flex-col items-center justify-center gap-2 group active:scale-95 transition-transform"
                    >
                        <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-purple-200 group-hover:bg-purple-50 transition-colors">
                            <Clipboard size={24} className="text-zinc-500 group-hover:text-purple-500" />
                        </div>
                        <span className="text-[13px] font-bold text-zinc-500">Paste Image</span>
                    </button>
                </div>
            )}
        </div>
    );
};

// --- List Item (Writing / To Read) ---
const ListRow = ({ item, type, onToggle, onEdit, onDelete }: {
    item: any;
    type: CategoryId;
    onToggle?: (id: string, status: boolean) => void;
    onEdit?: (item: any) => void;
    onDelete?: (id: string) => void;
}) => {
    const imageSrc = item.imageUrl || item.coverImage;

    return (
        <div className="relative w-full mb-3 rounded-2xl overflow-hidden">
            <div className="relative bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgb(0,0,0,0.04)] flex items-center gap-4 transition-colors">

                {/* Thumbnail or Icon */}
                {imageSrc ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageSrc} alt="" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-zinc-400 shrink-0">
                        {type === 'writing' ? <FileText size={20} /> : <Globe size={20} />}
                    </div>
                )}

                {/* Text */}
                <div className="flex flex-col truncate flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold tracking-tight text-zinc-900 truncate">{item.title || item.name}</h3>
                    <span className="text-[13px] text-zinc-500 font-medium truncate mt-0.5">
                        {type === 'writing' ? item.date : item.domain}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggle && onToggle(item.id, item.isRead || item.status === 'Read'); }}
                        className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide shrink-0 active:scale-95 transition-transform
                        ${item.status === 'Published' || item.isRead || item.status === 'Read' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}
                    >
                        {type === 'toread' ? (item.isRead ? 'Read' : 'Unread') : item.status}
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit && onEdit(item); }}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 active:bg-zinc-100 active:scale-90 transition-all"
                    >
                        <Edit2 size={15} />
                    </button>

                    {onDelete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 active:bg-red-50 active:text-red-500 active:scale-90 transition-all"
                        >
                            <Trash2 size={15} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Grid Card (Books / Wishlist) ---
const GridCard = ({ item, type, onEdit, onDelete }: {
    item: any;
    type: CategoryId;
    onEdit?: (item: any) => void;
    onDelete?: (id: string) => void;
}) => {
    const imageSrc = item.imageUrl || item.img || item.coverImage;
    const aspectClass = type === 'books' ? 'aspect-[3/4]' : 'aspect-square';

    return (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] overflow-hidden relative">
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 z-10 flex gap-1.5">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit && onEdit(item); }}
                    className="w-9 h-9 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform shadow-sm"
                >
                    <Edit2 size={13} />
                </button>
                {onDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        className="w-9 h-9 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 active:bg-red-500 transition-all shadow-sm"
                    >
                        <Trash2 size={13} />
                    </button>
                )}
            </div>

            {/* Image */}
            {imageSrc ? (
                <div className={`w-full ${aspectClass} overflow-hidden bg-gray-100`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageSrc} alt={item.title || item.name} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className={`w-full ${aspectClass} bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center`}>
                    <ImageIcon size={32} className="text-gray-300" />
                </div>
            )}

            {/* Info */}
            <div className="p-3.5">
                <h3 className="text-[14px] font-bold tracking-tight text-zinc-900 leading-tight line-clamp-2">{item.title || item.name}</h3>
                <span className="text-[12px] text-zinc-500 font-medium truncate block mt-0.5">{item.author || item.price}</span>
            </div>
        </div>
    );
};

// --- Bottom Sheet ---
const BottomSheet = ({ isOpen, onClose, title, children }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/25 z-40 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 28, stiffness: 260 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(_, { offset, velocity }) => {
                        if (offset.y > 100 || velocity.y > 500) onClose();
                    }}
                    className="fixed bottom-0 left-0 right-0 h-[88vh] bg-white rounded-t-[2rem] z-50 flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.1)]"
                >
                    {/* Grab Handle */}
                    <div className="w-full flex justify-center py-4 shrink-0 cursor-grab active:cursor-grabbing">
                        <div className="w-10 h-[5px] bg-gray-300 rounded-full" />
                    </div>
                    <div className="px-7 pb-3 shrink-0">
                        <h2 className="text-[22px] font-bold text-zinc-900 tracking-tight">{title}</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto px-7 pb-32 pt-2 flex flex-col gap-5 no-scrollbar">
                        {children}
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

// --- Quick Paste Input ---
const QuickPasteInput = ({ value, onChange, placeholder, type = "text" }: { value: string, onChange: (v: string) => void, placeholder: string, type?: string }) => {
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                onChange(text);
                toast.success("Pasted", { icon: "📋", duration: 1500 });
            } else {
                toast.error("Clipboard is empty");
            }
        } catch (err) {
            console.error(err);
            toast.error("Clipboard access denied");
        }
    };

    return (
        <div className="relative w-full">
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                type={type}
                placeholder={placeholder}
                className={`${INPUT_CLASS} pr-12`}
            />
            <button
                type="button"
                onClick={handlePaste}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 active:scale-90 transition-all rounded-lg"
                title="Paste from clipboard"
            >
                <Clipboard size={18} strokeWidth={2.5} />
            </button>
        </div>
    );
};

// ============================================================================
// CONTEXT-AWARE FORM FIELDS
// ============================================================================
const MinimalRichTextEditor = ({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder: string }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'w-full bg-gray-50 rounded-2xl min-h-[112px] p-5 pt-8 text-[16px] font-medium text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all prose prose-sm max-w-none',
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            if (value === "") editor.commands.setContent("");
        }
    }, [value, editor]);

    if (!editor) {
        return <div className="w-full bg-gray-50 rounded-2xl h-28 p-5 animate-pulse" />;
    }

    const handleQuickPaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && editor) {
                // If the user pastes into the editor via button, we probably want to insert it at cursor
                // or just append if no selection. For simplicity, we can insert text at current position.
                editor.commands.insertContent(text);
                toast.success("Pasted to editor", { icon: "📋", duration: 1500 });
            } else {
                toast.error("Clipboard is empty");
            }
        } catch (err) {
            console.error(err);
            toast.error("Clipboard access denied");
        }
    };

    return (
        <div className="relative w-full group">
            <EditorContent editor={editor} />
            {editor.isEmpty && (
                <div className="absolute top-8 left-5 pointer-events-none text-zinc-400 font-medium text-[16px]">
                    {placeholder}
                </div>
            )}
            {/* Minimalist Floating Toolbar/Paste Button inside the editor bounds */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-1 bg-white/80 backdrop-blur border border-zinc-200 rounded-lg shadow-sm p-1 z-10">
                <button
                    type="button"
                    onClick={handleQuickPaste}
                    tabIndex={-1}
                    className="p-1.5 text-zinc-400 hover:text-purple-500 hover:bg-purple-50 active:scale-90 transition-all rounded-md"
                    title="Quick Paste"
                >
                    <Clipboard size={16} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

const FormFields = ({
    category,
    formTitle, setFormTitle,
    formExtra, setFormExtra,
    formUrl, setFormUrl,
    formNotes, setFormNotes,
}: {
    category: CategoryId;
    formTitle: string; setFormTitle: (v: string) => void;
    formExtra: string; setFormExtra: (v: string) => void;
    formUrl: string; setFormUrl: (v: string) => void;
    formNotes: string; setFormNotes: (v: string) => void;
}) => {
    if (category === "writing" || category === "toread") {
        return (
            <>
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
            </>
        );
    }

    if (category === "books") {
        return (
            <>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Book Title</label>
                    <QuickPasteInput value={formTitle} onChange={setFormTitle} placeholder="Enter book title" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Author</label>
                    <QuickPasteInput value={formExtra} onChange={setFormExtra} placeholder="Author name" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Review / Notes</label>
                    <MinimalRichTextEditor value={formNotes} onChange={setFormNotes} placeholder="Your thoughts on this book…" />
                </div>
            </>
        );
    }

    // wishlist
    return (
        <>
            <div className="flex flex-col gap-1.5">
                <label className={LABEL_CLASS}>Item Name</label>
                <QuickPasteInput value={formTitle} onChange={setFormTitle} placeholder="What do you want?" />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className={LABEL_CLASS}>Price / Link</label>
                <QuickPasteInput value={formExtra} onChange={setFormExtra} placeholder="$0.00 or https://…" />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className={LABEL_CLASS}>Notes</label>
                <MinimalRichTextEditor value={formNotes} onChange={setFormNotes} placeholder="Why do you want this…" />
            </div>
        </>
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
    const [formExtra, setFormExtra] = useState(""); // Author (books) or Price (wishlist)
    const [formImageFile, setFormImageFile] = useState<File | null>(null);
    const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "saving">("idle");

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

    // --- Loaders ---
    const loadWriting = async () => { setIsFetching(true); const r = await getWritingArticles(); if (r.success && r.data) setWritingItems(r.data); setIsFetching(false); };
    const loadToRead = async () => { setIsFetching(true); const r = await getToReadArticles(); if (r.success && r.data) setToreadItems(r.data); setIsFetching(false); };
    const loadBooks = async () => { setIsFetching(true); const r = await getBooks(); if (r.success && r.data) setBookItems(r.data); setIsFetching(false); };
    const loadWishlist = async () => { setIsFetching(true); const r = await getWishlistItems(); if (r.success && r.data) setWishlistItems(r.data); setIsFetching(false); };

    // --- Form Handlers ---
    const resetForm = () => {
        setFormTitle(""); setFormUrl(""); setFormNotes(""); setFormExtra("");
        setFormImageFile(null); setFormImagePreview(null);
        setEditItemId(null); setUploadStatus("idle");
    };

    const handleOpenCreateForm = () => { resetForm(); setIsSheetOpen(true); };

    const handleEditClick = (item: any) => {
        setEditItemId(item.id);
        setFormTitle(item.title || item.name || "");
        setFormNotes(item.content || item.review || "");
        setFormImageFile(null);
        setFormImagePreview(item.imageUrl || null);

        // Context-aware field mapping for Edit
        if (activeCategory === "writing" || activeCategory === "toread") {
            setFormUrl(item.coverImage || item.url || "");
            setFormExtra("");
        } else if (activeCategory === "books") {
            setFormExtra(item.author || "");
            setFormUrl("");
        } else {
            // wishlist: formExtra = price, formUrl unused
            setFormExtra(item.price || "");
            setFormUrl(item.url || "");
        }

        setIsSheetOpen(true);
    };

    const handleImageSelect = (file: File) => {
        setFormImageFile(file);
        setFormImagePreview(URL.createObjectURL(file));
    };

    const handleImageClear = () => {
        setFormImageFile(null);
        setFormImagePreview(null);
    };

    const handleSave = async () => {
        if (!formTitle) return;
        setIsSubmitting(true);

        // Step 1: Upload image if new file selected
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

        // Step 2: Save to DB with context-aware payloads
        setUploadStatus("saving");
        let success = false;
        let data = null;
        let errorMsg = "Failed";

        if (activeCategory === "toread") {
            if (!formUrl) { toast.error("URL is required"); setIsSubmitting(false); setUploadStatus("idle"); return; }
            const res = editItemId
                ? await updateToReadArticle(editItemId, formTitle, formUrl, formNotes, imageUrl)
                : await createToReadArticle(formTitle, formUrl, formNotes, imageUrl);
            success = res.success; data = res.data; errorMsg = res.error || errorMsg;
        } else if (activeCategory === "writing") {
            const res = editItemId
                ? await updateWritingArticle(editItemId, formTitle, formNotes, formUrl, imageUrl)
                : await createWritingArticle(formTitle, formNotes, formUrl, imageUrl);
            success = res.success; data = res.data; errorMsg = res.error || errorMsg;
        } else if (activeCategory === "books") {
            if (!formExtra) { toast.error("Author is required"); setIsSubmitting(false); setUploadStatus("idle"); return; }
            const res = editItemId
                ? await updateBook(editItemId, formTitle, formExtra, "", formNotes, imageUrl)
                : await createBook(formTitle, formExtra, "", formNotes, imageUrl);
            success = res.success; data = res.data; errorMsg = res.error || errorMsg;
        } else if (activeCategory === "wishlist") {
            const res = editItemId
                ? await updateWishlistItem(editItemId, formTitle, formExtra, formUrl, imageUrl)
                : await createWishlistItem(formTitle, formExtra, formUrl, imageUrl);
            success = res.success; data = res.data; errorMsg = res.error || errorMsg;
        }

        setIsSubmitting(false); setUploadStatus("idle");

        if (success && data) {
            toast.success(editItemId ? "Updated!" : "Created!");
            const updateList = (list: any[]) => editItemId ? list.map(i => i.id === editItemId ? data : i) : [data, ...list];
            if (activeCategory === "toread") setToreadItems(updateList(toreadItems));
            else if (activeCategory === "writing") setWritingItems(updateList(writingItems));
            else if (activeCategory === "books") setBookItems(updateList(bookItems));
            else if (activeCategory === "wishlist") setWishlistItems(updateList(wishlistItems));
            setIsSheetOpen(false); resetForm();
        } else {
            toast.error(errorMsg);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean, category: CategoryId) => {
        if (category === "toread") {
            setToreadItems(prev => prev.map(i => i.id === id ? { ...i, isRead: !currentStatus } : i));
            await toggleReadStatus(id, currentStatus);
        } else if (category === "writing") {
            setWritingItems(prev => prev.map(i => i.id === id ? { ...i, published: !currentStatus } : i));
            await togglePublishStatus(id, currentStatus);
        }
    };

    const handleDelete = async (id: string, category: CategoryId) => {
        const toastId = toast.loading("Deleting...");
        let success = false; let errorMsg = "Failed";
        if (category === "toread") { const r = await deleteToReadArticle(id); if (r.success) { success = true; setToreadItems(p => p.filter(i => i.id !== id)); } else errorMsg = r.error || errorMsg; }
        else if (category === "writing") { const r = await deleteWritingArticle(id); if (r.success) { success = true; setWritingItems(p => p.filter(i => i.id !== id)); } else errorMsg = r.error || errorMsg; }
        else if (category === "books") { const r = await deleteBook(id); if (r.success) { success = true; setBookItems(p => p.filter(i => i.id !== id)); } else errorMsg = r.error || errorMsg; }
        else if (category === "wishlist") { const r = await deleteWishlistItem(id); if (r.success) { success = true; setWishlistItems(p => p.filter(i => i.id !== id)); } else errorMsg = r.error || errorMsg; }
        if (success) toast.success("Deleted", { id: toastId }); else toast.error(errorMsg, { id: toastId });
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (authPin === "161616") { toast.success("Welcome back"); localStorage.setItem("cms_auth", "true"); setView("dashboard"); }
        else toast.error("Incorrect PIN");
    };

    const saveButtonLabel = () => {
        if (uploadStatus === "uploading") return "Uploading…";
        if (uploadStatus === "saving") return "Saving…";
        return editItemId ? "Update Entry" : "Save Entry";
    };

    const isSaveDisabled = () => {
        if (isSubmitting || !formTitle) return true;
        if (activeCategory === "toread" && !formUrl) return true;
        if (activeCategory === "books" && !formExtra) return true;
        return false;
    };

    if (!mounted) return null;

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-[#F7F7F9] tracking-tight text-zinc-900 selection:bg-zinc-200 antialiased">
            <Toaster
                position="bottom-center"
                toastOptions={{
                    style: { background: '#1a1a1a', color: '#fff', borderRadius: '100px', fontSize: '14px', fontWeight: '600', padding: '12px 20px' },
                    duration: 2500,
                }}
            />
            <div className="w-full max-w-[500px] min-h-screen flex flex-col relative bg-[#F7F7F9] shadow-2xl">

                <AnimatePresence mode="wait">
                    {/* ============================================ */}
                    {/* AUTH VIEW                                     */}
                    {/* ============================================ */}
                    {view === "auth" && (
                        <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col p-8 items-center justify-center min-h-[80vh]">
                            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-center mb-8">
                                <Lock size={28} className="text-zinc-900" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight mb-3">Workspace</h1>
                            <p className="text-zinc-500 text-[15px] font-medium mb-12 text-center">Enter your verification PIN to continue.</p>
                            <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                                <input type="password" inputMode="numeric" placeholder="PIN" value={authPin} onChange={e => setAuthPin(e.target.value)}
                                    className="w-full h-14 bg-white rounded-full px-6 text-center text-xl font-bold tracking-widest outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-[0_2px_12px_rgb(0,0,0,0.04)]" />
                                <button type="submit" className="w-full h-14 bg-black text-white rounded-full font-bold text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] mt-2 active:scale-[0.98] transition-transform">
                                    Authenticate
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* ============================================ */}
                    {/* DASHBOARD VIEW                                */}
                    {/* ============================================ */}
                    {view === "dashboard" && (
                        <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="flex-1 w-full flex flex-col pb-32">
                            <div className="pt-16 px-7 pb-6 w-full flex items-center justify-between">
                                <div className="flex flex-col">
                                    <h1 className="text-[28px] font-bold tracking-tight leading-tight text-zinc-900">Workspace</h1>
                                    <p className="text-[14px] text-zinc-500 font-medium mt-1">Manage your content.</p>
                                </div>
                                <Link href="/">
                                    <div className="w-11 h-11 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-zinc-500 active:scale-95 transition-transform">
                                        <Globe size={18} />
                                    </div>
                                </Link>
                            </div>

                            <div className="px-5 grid grid-cols-2 gap-4">
                                {CATEGORIES.map((cat, idx) => (
                                    <motion.div whileTap={{ scale: 0.97 }}
                                        onClick={() => { setActiveCategory(cat.id); setView("category"); }}
                                        key={cat.id}
                                        className={`bg-white rounded-[1.5rem] p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)] active:scale-[0.98] transition-transform cursor-pointer flex flex-col justify-between 
                                            ${idx === 0 ? "col-span-2 aspect-[2.4/1]" : idx === 1 || idx === 2 ? "col-span-1 aspect-square" : "col-span-2 aspect-[2.8/1]"}`}>
                                        <div className="flex justify-between items-start">
                                            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${cat.iconBg}`}>{cat.icon}</div>
                                            <ChevronRight className="w-5 h-5 text-gray-300" />
                                        </div>
                                        <div className="flex flex-col mt-auto">
                                            <h3 className="text-[17px] font-bold tracking-tight text-zinc-900">{cat.label}</h3>
                                            <p className="text-[13px] text-zinc-500 font-medium mt-0.5">{cat.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-10 w-full">
                                <h2 className="px-7 text-[15px] font-bold text-zinc-900 tracking-tight mb-3">Recent Activity</h2>
                                <div className="flex overflow-x-auto gap-2.5 px-5 pb-6 no-scrollbar touch-pan-x">
                                    {[{ title: "The Architecture of Sanctuary", type: "Published" }, { title: "Refactoring UI Patterns", type: "Saved" }, { title: "Atomic Habits", type: "Logged" }].map((item, i) => (
                                        <div key={i} className="shrink-0 bg-white rounded-full px-4 py-3 shadow-[0_2px_12px_rgb(0,0,0,0.04)] active:scale-[0.98] transition-transform cursor-pointer flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-zinc-400"><Clock size={12} /></div>
                                            <div className="flex flex-col justify-center pr-1">
                                                <h4 className="text-[13px] font-bold text-zinc-900 truncate max-w-[140px]">{item.title}</h4>
                                                <span className="text-[11px] text-zinc-500 font-medium">{item.type}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ============================================ */}
                    {/* CATEGORY SUB-PAGE                             */}
                    {/* ============================================ */}
                    {view === "category" && (
                        <motion.div key="category" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="h-screen flex flex-col bg-[#F7F7F9]">

                            {/* Glass Header */}
                            <header className="sticky top-0 z-50 bg-[#F7F7F9]/85 backdrop-blur-xl border-b border-gray-200/50 shrink-0 pb-3 pt-5 px-5 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <button onClick={() => setView("dashboard")} className="w-11 h-11 flex items-center justify-center text-zinc-900 active:bg-gray-100 active:scale-90 rounded-full transition-all">
                                        <ChevronLeft size={26} />
                                    </button>
                                    <h2 className="text-[18px] font-bold tracking-tight text-zinc-900">{CATEGORIES.find(c => c.id === activeCategory)?.label}</h2>
                                    <button onClick={handleOpenCreateForm} className="w-11 h-11 flex items-center justify-center text-zinc-900 active:bg-gray-100 active:scale-90 rounded-full transition-all">
                                        <Plus size={24} />
                                    </button>
                                </div>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar px-0.5 pb-0.5">
                                    <div className="px-4 py-1.5 bg-black text-white rounded-full text-[13px] font-bold shrink-0 active:scale-95 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.12)]">All</div>
                                    <div className="px-4 py-1.5 bg-white text-zinc-500 rounded-full text-[13px] font-bold shrink-0 active:scale-95 transition-transform shadow-sm">Drafts</div>
                                    <div className="px-4 py-1.5 bg-white text-zinc-500 rounded-full text-[13px] font-bold shrink-0 active:scale-95 transition-transform shadow-sm">Published</div>
                                </div>
                            </header>

                            {/* Scrollable Content */}
                            <main className="flex-1 overflow-y-auto p-5 pb-32 w-full">
                                {CATEGORIES.find(c => c.id === activeCategory)?.type === 'list' ? (
                                    <div className="flex flex-col w-full">
                                        {isFetching ? (
                                            <div className="w-full flex justify-center py-16"><div className="animate-spin w-7 h-7 border-[3px] border-gray-200 border-t-black rounded-full" /></div>
                                        ) : (activeCategory === "toread" ? toreadItems : writingItems).length === 0 ? (
                                            <div className="w-full flex flex-col items-center py-20 gap-3">
                                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"><FileText size={24} className="text-gray-400" /></div>
                                                <p className="text-zinc-500 font-medium text-[15px]">No items yet</p>
                                            </div>
                                        ) : (
                                            (activeCategory === "toread" ? toreadItems : writingItems).map(item => {
                                                let domain = "Link";
                                                try { if (item.coverImage) domain = new URL(item.coverImage).hostname.replace('www.', ''); } catch (_) { }
                                                const formattedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
                                                return (
                                                    <ListRow key={item.id}
                                                        item={{ ...item, domain, date: formattedDate, status: activeCategory === "writing" ? (item.published ? 'Published' : 'Draft') : item.status }}
                                                        type={activeCategory}
                                                        onToggle={(id, s) => handleToggleStatus(id, s, activeCategory)}
                                                        onEdit={handleEditClick}
                                                        onDelete={(id) => handleDelete(id, activeCategory)}
                                                    />
                                                );
                                            })
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        {isFetching ? (
                                            <div className="col-span-2 w-full flex justify-center py-16"><div className="animate-spin w-7 h-7 border-[3px] border-gray-200 border-t-black rounded-full" /></div>
                                        ) : (activeCategory === "books" ? bookItems : wishlistItems).length === 0 ? (
                                            <div className="col-span-2 w-full flex flex-col items-center py-20 gap-3">
                                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"><ImageIcon size={24} className="text-gray-400" /></div>
                                                <p className="text-zinc-500 font-medium text-[15px]">No items yet</p>
                                            </div>
                                        ) : (
                                            (activeCategory === "books" ? bookItems : wishlistItems).map(item => (
                                                <GridCard key={item.id} item={item} type={activeCategory}
                                                    onEdit={handleEditClick}
                                                    onDelete={(id) => handleDelete(id, activeCategory)}
                                                />
                                            ))
                                        )}
                                    </div>
                                )}
                            </main>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ============================================ */}
                {/* BOTTOM SHEET — CONTEXT-AWARE FORM             */}
                {/* ============================================ */}
                <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title={editItemId ? "Edit Entry" : "New Entry"}>
                    {/* Image Picker (all categories) */}
                    <ImagePicker preview={formImagePreview} onSelect={handleImageSelect} onClear={handleImageClear} />

                    {/* Context-Aware Fields */}
                    <FormFields
                        category={activeCategory}
                        formTitle={formTitle} setFormTitle={setFormTitle}
                        formExtra={formExtra} setFormExtra={setFormExtra}
                        formUrl={formUrl} setFormUrl={setFormUrl}
                        formNotes={formNotes} setFormNotes={setFormNotes}
                    />

                    {/* Save Button */}
                    <button onClick={handleSave} disabled={isSaveDisabled()}
                        className="w-full h-14 bg-black text-white rounded-full flex items-center justify-center appearance-none shrink-0 font-bold text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] mt-4 active:scale-[0.98] transition-transform disabled:opacity-40 disabled:active:scale-100">
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                <span>{saveButtonLabel()}</span>
                            </div>
                        ) : saveButtonLabel()}
                    </button>
                </BottomSheet>
            </div>
        </div>
    );
}
