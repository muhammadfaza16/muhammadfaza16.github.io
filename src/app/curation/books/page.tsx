"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, Star, BookOpen, Search,
  Edit2, Trash2, X, Filter, Bookmark, Radio, CheckCircle2, XCircle,
  Sun, Moon, Menu
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { CATEGORIES, BOOK_STATUSES } from "@/lib/curation-config";
import { AtlasMenu } from "@/components/AtlasMenu";
import type { BookEntry } from "@/types/curation";
import { Toaster, toast } from "react-hot-toast";
import { BottomSheet, ImagePicker, QuickPasteInput, RichTextEditor } from "@/components/sanctuary";
import { uploadImageToSupabase } from "@/lib/uploadImage";

const STATUS_COLORS: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  "want-to-read": { bg: "bg-amber-50", text: "text-amber-700", darkBg: "dark:bg-amber-900/30", darkText: "dark:text-amber-300" },
  "reading": { bg: "bg-blue-50", text: "text-blue-700", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300" },
  "finished": { bg: "bg-emerald-50", text: "text-emerald-700", darkBg: "dark:bg-emerald-900/30", darkText: "dark:text-emerald-300" },
  "abandoned": { bg: "bg-zinc-100", text: "text-zinc-500", darkBg: "dark:bg-zinc-800", darkText: "dark:text-zinc-400" },
};

export default function BooksPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isAtlasMenuOpen, setIsAtlasMenuOpen] = useState(false);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const VERTICALS = [
    { key: "books", label: "Books", href: "/curation/books" },
    { key: "skills", label: "Skills Lab", href: "/curation/skills" },
    { key: "frameworks", label: "Frameworks", href: "/curation/frameworks" },
    { key: "codex", label: "Codex", href: "/curation/codex" },
    { key: "collections", label: "Collections", href: "/curation/collections" },
    { key: "highlights", label: "Highlights", href: "/curation/highlights" },
  ];
  const [books, setBooks] = useState<BookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Form state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editBook, setEditBook] = useState<BookEntry | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formReview, setFormReview] = useState("");
  const [formVerdict, setFormVerdict] = useState("");
  const [formTakeaways, setFormTakeaways] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formStatus, setFormStatus] = useState("want-to-read");
  const [formRating, setFormRating] = useState(0);
  const [formUrl, setFormUrl] = useState("");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeStatus !== "all") params.set("status", activeStatus);
      if (activeCategory !== "all") params.set("category", activeCategory);
      const res = await fetch(`/api/curation/books?${params}`);
      const data = await res.json();
      setBooks(data.items || []);
    } catch { toast.error("Failed to load books"); }
    setLoading(false);
  }, [activeStatus, activeCategory]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);
  useEffect(() => {
    fetch("/api/auth").then(r => r.json()).then(d => { if (d.isAdmin) setIsAdmin(true); }).catch(() => {});
  }, []);

  const filteredBooks = books.filter(b =>
    !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormTitle(""); setFormAuthor(""); setFormReview(""); setFormVerdict("");
    setFormTakeaways(""); setFormCategory(""); setFormStatus("want-to-read");
    setFormRating(0); setFormUrl(""); setFormImageFile(null); setFormImagePreview(null);
    setEditBook(null);
  };

  const openCreate = () => { resetForm(); setIsSheetOpen(true); };

  const openEdit = (book: BookEntry) => {
    setEditBook(book);
    setFormTitle(book.title); setFormAuthor(book.author);
    setFormReview(book.review || ""); setFormVerdict(book.verdict || "");
    setFormTakeaways(book.takeaways || ""); setFormCategory(book.category || "");
    setFormStatus(book.status || "want-to-read"); setFormRating(book.rating || 0);
    setFormUrl(book.url || ""); setFormImagePreview(book.imageUrl || null);
    setIsSheetOpen(true);
  };

  const handleSave = async () => {
    if (!formTitle || !formAuthor) { toast.error("Title and author are required"); return; }
    setIsSubmitting(true);

    let imageUrl = formImagePreview || undefined;
    if (formImageFile) {
      const uploaded = await uploadImageToSupabase(formImageFile);
      if (!uploaded) { toast.error("Failed to upload image"); setIsSubmitting(false); return; }
      imageUrl = uploaded;
    }

    const body = {
      title: formTitle, author: formAuthor, review: formReview || null,
      verdict: formVerdict || null, takeaways: formTakeaways || null,
      category: formCategory || null, status: formStatus, rating: formRating,
      url: formUrl || null, imageUrl: imageUrl || null,
    };

    try {
      const url = editBook ? `/api/curation/books/${editBook.id}` : "/api/curation/books";
      const method = editBook ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success || data.data) {
        toast.success(editBook ? "Updated!" : "Book added!");
        setIsSheetOpen(false); resetForm(); fetchBooks();
      } else { toast.error(data.error || "Failed"); }
    } catch { toast.error("Failed to save"); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/curation/books/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { toast.success("Deleted"); setBooks(prev => prev.filter(b => b.id !== id)); }
      else toast.error(data.error || "Failed");
    } catch { toast.error("Failed to delete"); }
  };

  const renderStars = (rating: number, size = 12) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} className={i <= rating ? "text-amber-400 fill-amber-400" : "text-zinc-200 dark:text-zinc-700"} />
      ))}
    </div>
  );

  const statusCounts = {
    all: books.length,
    "want-to-read": books.filter(b => b.status === "want-to-read" || b.status === "want-to-read").length,
    reading: books.filter(b => b.status === "reading").length,
    finished: books.filter(b => b.status === "finished").length,
    abandoned: books.filter(b => b.status === "abandoned").length,
  };

  return (
    <>
      <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] pb-24">
      <Toaster position="bottom-center" toastOptions={{
        style: { background: '#1a1a1a', color: '#fff', borderRadius: '100px', fontSize: '14px', fontWeight: '600', padding: '12px 20px' },
        duration: 2500,
      }} />

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-[110] bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 shrink-0 h-16 flex items-center px-4 transition-colors duration-500">
        {/* Left: Back */}
        <div className="w-12 flex items-center">
          <AnimatePresence mode="popLayout">
            {!isSearchFocused && !searchQuery && (
              <motion.div
                key="back-button"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/curation"
                  className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all"
                >
                  <ArrowLeft size={18} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center px-2">
          <motion.div 
            layout
            className="w-full"
            animate={{ maxWidth: searchQuery || isSearchFocused ? "800px" : "240px" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            <div className="relative group max-w-4xl mx-auto">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search books, authors..."
                className="w-full h-9 bg-zinc-100/60 dark:bg-zinc-800/60 border border-transparent focus:bg-white dark:focus:bg-zinc-900/50 focus:border-zinc-200 dark:focus:border-zinc-700/50 rounded-full pl-9 pr-9 text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500/80 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                >
                  <X size={14} className="text-zinc-400" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right: Actions */}
        <div className="w-24 flex items-center justify-end">
          <AnimatePresence mode="popLayout">
            {!isSearchFocused && !searchQuery && (
              <motion.div
                key="header-actions"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-0.5"
              >
                {isAdmin && (
                  <button
                    onClick={openCreate}
                    className="w-9 h-9 flex items-center justify-center text-zinc-900 dark:text-zinc-100 active:scale-90 rounded-full transition-all"
                  >
                    <Plus size={20} strokeWidth={2.5} />
                  </button>
                )}
                <button
                  onClick={toggleTheme}
                  className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all relative overflow-hidden"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ y: -20, opacity: 0, scale: 0.5, rotate: -90 }}
                      animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ y: 20, opacity: 0, scale: 0.5, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="absolute flex items-center justify-center"
                    >
                      {theme === "dark" ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
                <button
                  onClick={() => setIsAtlasMenuOpen(!isAtlasMenuOpen)}
                  className="w-9 h-9 flex items-center justify-center text-zinc-900 dark:text-zinc-100 active:scale-90 rounded-full transition-all relative z-[110]"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isAtlasMenuOpen ? "close" : "menu"}
                      initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isAtlasMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Status filter pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-3 bg-[#fafaf8] dark:bg-[#050505]">
        {[{ key: "all", label: "All" }, ...BOOK_STATUSES.map(s => ({ key: s.key, label: s.label }))].map(s => (
          <button key={s.key} onClick={() => setActiveStatus(s.key)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all active:scale-95 ${
              activeStatus === s.key
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                : "bg-white dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 shadow-sm"
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Book Grid */}
      <main className="px-5">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-7 h-7 border-[3px] border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-20 gap-4">
            <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <BookOpen size={32} className="text-zinc-400" />
            </div>
            <div className="text-center">
              <p className="text-zinc-900 dark:text-zinc-100 font-bold text-[17px]">No books yet</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[14px] mt-1">
                {isAdmin ? "Tap + to add your first book" : "Books will appear here once added"}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredBooks.map((book, i) => {
              const sc = STATUS_COLORS[book.status] || STATUS_COLORS["want-to-read"];
              return (
                <motion.div key={book.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  whileTap={{ scale: 0.97 }}
                  className="relative group">

                  {/* Admin actions */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(book); }}
                        className="w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(book.id); }}
                        className="w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500/80">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}

                  <Link href={`/curation/books/${book.id}`}>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-none dark:border dark:border-zinc-800/80 overflow-hidden">
                      {/* Cover */}
                      {book.imageUrl ? (
                        <div className="aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="aspect-[3/4] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex flex-col items-center justify-center gap-2 px-4">
                          <BookOpen size={28} className="text-zinc-400 dark:text-zinc-600" />
                          <p className="text-[11px] text-zinc-400 dark:text-zinc-600 font-medium text-center line-clamp-2">{book.title}</p>
                        </div>
                      )}

                      {/* Info */}
                      <div className="p-3.5 space-y-2">
                        <h3 className="text-[14px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight line-clamp-2">{book.title}</h3>
                        <p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-medium truncate">{book.author}</p>
                        <div className="flex items-center justify-between">
                          {book.rating > 0 ? renderStars(book.rating) : <span className="text-[11px] text-zinc-400">No rating yet</span>}
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} ${sc.darkBg} ${sc.darkText}`}>
                            {BOOK_STATUSES.find(s => s.key === book.status)?.label || book.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create/Edit Form */}
      <BottomSheet isOpen={isSheetOpen} onClose={() => { setIsSheetOpen(false); resetForm(); }}
        title={editBook ? "Edit Book" : "Add Book"} footer={
          <button onClick={handleSave} disabled={isSubmitting || !formTitle || !formAuthor}
            className="w-full h-14 bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-bold text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all disabled:opacity-40">
            {isSubmitting ? "Saving..." : editBook ? "Save Changes" : "Add Book"}
          </button>
        }>
        <ImagePicker preview={formImagePreview} onSelect={(f) => { setFormImageFile(f); setFormImagePreview(URL.createObjectURL(f)); }}
          onClear={() => { setFormImageFile(null); setFormImagePreview(null); }} />

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500/80 dark:text-zinc-400/80 ml-1">Book Title</label>
          <QuickPasteInput value={formTitle} onChange={setFormTitle} placeholder="Enter book title" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500/80 dark:text-zinc-400/80 ml-1">Author</label>
          <QuickPasteInput value={formAuthor} onChange={setFormAuthor} placeholder="Author name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500/80 dark:text-zinc-400/80 ml-1">Status</label>
          <div className="flex gap-2 flex-wrap">
            {BOOK_STATUSES.map(s => (
              <button key={s.key} onClick={() => setFormStatus(s.key)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                  formStatus === s.key ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500/80 dark:text-zinc-400/80 ml-1">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i} onClick={() => setFormRating(formRating === i ? 0 : i)} className="p-1">
                <Star size={24} className={i <= formRating ? "text-amber-400 fill-amber-400" : "text-zinc-300 dark:text-zinc-700"} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500/80 dark:text-zinc-400/80 ml-1">Category</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c =>                <button key={c.name} onClick={() => setFormCategory(formCategory === c.name ? "" : c.name)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                    formCategory === c.name ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                  {c.name}
                </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500/80 dark:text-zinc-400/80 ml-1">Brief Verdict</label>
          <QuickPasteInput value={formVerdict} onChange={setFormVerdict} placeholder="Why is this book worth reading?" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500/80 dark:text-zinc-400/80 ml-1">Key Takeaways</label>
          <RichTextEditor value={formTakeaways} onChange={setFormTakeaways} placeholder="Top lessons from this book..." />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500/80 dark:text-zinc-400/80 ml-1">Review / Notes</label>
          <RichTextEditor value={formReview} onChange={setFormReview} placeholder="Write your full review here..." />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500/80 dark:text-zinc-400/80 ml-1">Reference Link</label>
          <QuickPasteInput value={formUrl} onChange={setFormUrl} placeholder="https://..." />
        </div>
      </BottomSheet>
      {/* ═══ ATLAS MENU ═══ */}
      <AtlasMenu items={VERTICALS} isOpen={isAtlasMenuOpen} onClose={() => setIsAtlasMenuOpen(false)} />
    </div>

    </>
  );
}
