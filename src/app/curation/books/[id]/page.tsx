"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Star, BookOpen, Calendar, ExternalLink,
  Edit2, Trash2, Lightbulb, Quote, FileText
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { BOOK_STATUSES, CATEGORIES } from "@/lib/curation-config";
import type { BookEntry } from "@/types/curation";
import { Toaster, toast } from "react-hot-toast";
import { BottomSheet, ImagePicker, QuickPasteInput, RichTextEditor } from "@/components/sanctuary";
import { uploadImageToSupabase } from "@/lib/uploadImage";

const STATUS_COLORS: Record<string, string> = {
  "want-to-read": "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "reading": "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "finished": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "abandoned": "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const [book, setBook] = useState<BookEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Edit form
  const [isSheetOpen, setIsSheetOpen] = useState(false);
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

  useEffect(() => {
    if (!id) return;
    fetch(`/api/curation/books/${id}`)
      .then(r => r.json())
      .then(d => { if (d.data) setBook(d.data); else toast.error("Book not found"); })
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetch("/api/auth").then(r => r.json()).then(d => { if (d.isAdmin) setIsAdmin(true); }).catch(() => {});
  }, []);

  const openEdit = () => {
    if (!book) return;
    setFormTitle(book.title); setFormAuthor(book.author);
    setFormReview(book.review || ""); setFormVerdict(book.verdict || "");
    setFormTakeaways(book.takeaways || ""); setFormCategory(book.category || "");
    setFormStatus(book.status || "want-to-read"); setFormRating(book.rating || 0);
    setFormUrl(book.url || ""); setFormImagePreview(book.imageUrl || null);
    setIsSheetOpen(true);
  };

  const handleSave = async () => {
    if (!formTitle || !formAuthor) { toast.error("Title and author required"); return; }
    setIsSubmitting(true);
    let imageUrl = formImagePreview || undefined;
    if (formImageFile) {
      const uploaded = await uploadImageToSupabase(formImageFile);
      if (!uploaded) { toast.error("Image upload failed"); setIsSubmitting(false); return; }
      imageUrl = uploaded;
    }
    try {
      const res = await fetch(`/api/curation/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle, author: formAuthor, review: formReview || null,
          verdict: formVerdict || null, takeaways: formTakeaways || null,
          category: formCategory || null, status: formStatus, rating: formRating,
          url: formUrl || null, imageUrl: imageUrl || null,
        }),
      });
      const data = await res.json();
      if (data.success || data.data) {
        toast.success("Updated!"); setBook(data.data); setIsSheetOpen(false);
      } else toast.error(data.error || "Failed");
    } catch { toast.error("Failed"); }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/curation/books/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { toast.success("Deleted"); router.push("/curation/books"); }
      else toast.error(data.error || "Failed");
    } catch { toast.error("Failed"); }
  };

  const renderStars = (rating: number, size = 16) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} className={i <= rating ? "text-amber-400 fill-amber-400" : "text-zinc-300 dark:text-zinc-600"} />
      ))}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] flex items-center justify-center">
      <div className="animate-spin w-7 h-7 border-[3px] border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full" />
    </div>
  );

  if (!book) return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] flex flex-col items-center justify-center gap-4">
      <BookOpen size={48} className="text-zinc-300 dark:text-zinc-600" />
      <p className="text-zinc-500 font-medium">Book not found</p>
      <Link href="/curation/books" className="text-zinc-900 dark:text-zinc-100 font-bold underline">← Back to Books</Link>
    </div>
  );

  const statusLabel = BOOK_STATUSES.find(s => s.key === book.status)?.label || book.status;
  const statusColor = STATUS_COLORS[book.status] || STATUS_COLORS["want-to-read"];
  const finishedDate = book.finishedAt ? new Date(book.finishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : null;

  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505]">
      <Toaster position="bottom-center" toastOptions={{
        style: { background: '#1a1a1a', color: '#fff', borderRadius: '100px', fontSize: '14px', fontWeight: '600', padding: '12px 20px' },
      }} />

      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 pt-14 pb-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft size={20} className="text-zinc-900 dark:text-zinc-100" />
          </button>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button onClick={openEdit} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <Edit2 size={16} className="text-zinc-500" />
              </button>
              <button onClick={handleDelete} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 size={16} className="text-zinc-500 hover:text-red-500" />
              </button>
            </div>
          )}
        </div>
      </header>

      <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="px-5 pb-20">

        {/* Cover + Title section */}
        <div className="flex flex-col items-center text-center mb-8">
          {book.imageUrl ? (
            <div className="w-40 h-56 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-40 h-56 rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center mb-6 shadow-lg">
              <BookOpen size={40} className="text-zinc-400 dark:text-zinc-500" />
            </div>
          )}

          <h1 className="text-[24px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight max-w-sm">{book.title}</h1>
          <p className="text-[16px] text-zinc-500 dark:text-zinc-400 font-medium mt-1">{book.author}</p>

          <div className="flex items-center gap-3 mt-4">
            {book.rating > 0 && renderStars(book.rating, 18)}
            <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${statusColor}`}>
              {statusLabel}
            </span>
          </div>

          {book.category && (
            <div className="mt-3 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[12px] font-bold text-zinc-600 dark:text-zinc-400">
              {book.category}
            </div>
          )}

          {finishedDate && (
            <div className="flex items-center gap-1.5 mt-3 text-[13px] text-zinc-500 dark:text-zinc-400">
              <Calendar size={14} />
              <span>Finished {finishedDate}</span>
            </div>
          )}
        </div>

        {/* Verdict */}
        {book.verdict && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-6 bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:border dark:border-zinc-800/80">
            <div className="flex items-center gap-2 mb-3">
              <Quote size={16} className="text-amber-500" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-zinc-400">Verdict</span>
            </div>
            <p className="text-[16px] font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed italic">
              &ldquo;{book.verdict}&rdquo;
            </p>
          </motion.div>
        )}

        {/* Key Takeaways */}
        {book.takeaways && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mb-6 bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:border dark:border-zinc-800/80">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-yellow-500" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-zinc-400">Key Takeaways</span>
            </div>
            <div className="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: book.takeaways }} />
          </motion.div>
        )}

        {/* Full Review */}
        {book.review && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mb-6 bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:border dark:border-zinc-800/80">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-blue-500" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-zinc-400">Review</span>
            </div>
            <div className="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: book.review }} />
          </motion.div>
        )}

        {/* External link */}
        {book.url && (
          <a href={book.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 text-[14px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <ExternalLink size={16} />
            View on web
          </a>
        )}
      </motion.main>

      {/* Edit Sheet */}
      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title="Edit Book" footer={
        <button onClick={handleSave} disabled={isSubmitting || !formTitle || !formAuthor}
          className="w-full h-14 bg-black text-white rounded-full font-bold text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-transform disabled:opacity-40">
          {isSubmitting ? "Saving..." : "Update Book"}
        </button>
      }>
        <ImagePicker preview={formImagePreview}
          onSelect={(f) => { setFormImageFile(f); setFormImagePreview(URL.createObjectURL(f)); }}
          onClear={() => { setFormImageFile(null); setFormImagePreview(null); }} />
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Title</label><QuickPasteInput value={formTitle} onChange={setFormTitle} placeholder="Book title" /></div>
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Author</label><QuickPasteInput value={formAuthor} onChange={setFormAuthor} placeholder="Author" /></div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Status</label>
          <div className="flex gap-2 flex-wrap">
            {BOOK_STATUSES.map(s => (<button key={s.key} onClick={() => setFormStatus(s.key)} className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all ${formStatus === s.key ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"}`}>{s.label}</button>))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Rating</label>
          <div className="flex gap-1">{[1,2,3,4,5].map(i => (<button key={i} onClick={() => setFormRating(formRating === i ? 0 : i)} className="p-1"><Star size={24} className={i <= formRating?"text-amber-400 fill-amber-400":"text-zinc-300"}/></button>))}</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Category</label>
          <div className="flex gap-2 flex-wrap">{CATEGORIES.map(c => (<button key={c.name} onClick={() => setFormCategory(formCategory === c.name ? "" : c.name)} className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${formCategory === c.name ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"}`}>{c.name}</button>))}</div>
        </div>
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Verdict</label><QuickPasteInput value={formVerdict} onChange={setFormVerdict} placeholder="One-liner verdict" /></div>
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Key Takeaways</label><RichTextEditor value={formTakeaways} onChange={setFormTakeaways} placeholder="Top lessons..." /></div>
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Review</label><RichTextEditor value={formReview} onChange={setFormReview} placeholder="Full review..." /></div>
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">URL</label><QuickPasteInput value={formUrl} onChange={setFormUrl} placeholder="https://..." /></div>
      </BottomSheet>
    </div>
  );
}
