"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Plus, Search, X, ScrollText, Edit2, Trash2, Library, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { CATEGORIES, CODEX_STATUSES } from "@/lib/curation-config";
import { AtlasMenu } from "@/components/AtlasMenu";
import type { CodexEntry } from "@/types/curation";
import { Toaster, toast } from "react-hot-toast";
import { BottomSheet, QuickPasteInput, RichTextEditor } from "@/components/sanctuary";

const STATUS_STYLE: Record<string, { color: string; icon: string }> = {
  evolving: { color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", icon: "🌱" },
  solidified: { color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", icon: "💎" },
  deprecated: { color: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400", icon: "📦" },
};

export default function CodexPage() {
  const { theme, setTheme } = useTheme();
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAtlasMenuOpen, setIsAtlasMenuOpen] = useState(false);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const VERTICALS = [
    { key: "books", label: "Books", href: "/curation/books" },
    { key: "skills", label: "Skills Lab", href: "/curation/skills" },
    { key: "frameworks", label: "Frameworks", href: "/curation/frameworks" },
    { key: "codex", label: "Codex", href: "/curation/codex" },
    { key: "collections", label: "Collections", href: "/curation/collections" },
    { key: "recap", label: "Recap", href: "/curation/recap" },
    { key: "highlights", label: "Highlights", href: "/curation/highlights" },
  ];

  // Form
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editItem, setEditItem] = useState<CodexEntry | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDomain, setFormDomain] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formConviction, setFormConviction] = useState("");
  const [formStatus, setFormStatus] = useState("evolving");
  const [formCategory, setFormCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      const res = await fetch(`/api/curation/codex?${params}`);
      const data = await res.json();
      setEntries(data.items || []);
    } catch { toast.error("Failed to load doctrines"); }
    setLoading(false);
  }, [activeCategory]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);
  useEffect(() => { fetch("/api/auth").then(r => r.json()).then(d => { if (d.isAdmin) setIsAdmin(true); }).catch(() => {}); }, []);

  const filtered = entries.filter(e => !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || (e.conviction || "").toLowerCase().includes(searchQuery.toLowerCase()));

  const resetForm = () => {
    setFormTitle(""); setFormDomain(""); setFormContent(""); setFormConviction("");
    setFormStatus("evolving"); setFormCategory(""); setEditItem(null);
  };

  const openEdit = (item: CodexEntry) => {
    setEditItem(item); setFormTitle(item.title); setFormDomain(item.domain || "");
    setFormContent(item.content || ""); setFormConviction(item.conviction || "");
    setFormStatus(item.status || "evolving"); setFormCategory(item.category || "");
    setIsSheetOpen(true);
  };

  const handleSave = async () => {
    if (!formTitle) { toast.error("Title is required"); return; }
    setIsSubmitting(true);
    const body = {
      title: formTitle, domain: formDomain || null, content: formContent || null,
      conviction: formConviction || null, status: formStatus, category: formCategory || null,
    };
    try {
      const url = editItem ? `/api/curation/codex/${editItem.id}` : "/api/curation/codex";
      const method = editItem ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success || data.data) {
        toast.success(editItem ? "Updated!" : "Added!"); setIsSheetOpen(false); resetForm(); fetchEntries();
      } else toast.error(data.error || "Failed to save");
    } catch { toast.error("Something went wrong"); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/curation/codex/${id}`, { method: "DELETE" });
      if ((await res.json()).success) { toast.success("Deleted"); setEntries(p => p.filter(e => e.id !== id)); }
    } catch { toast.error("Something went wrong"); }
  };

  const statusCounts: Record<string, number> = { all: entries.length };
  CODEX_STATUSES.forEach(s => { statusCounts[s.key] = entries.filter(e => e.status === s.key).length; });

  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] pb-24">
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', borderRadius: '100px', fontSize: '14px', fontWeight: '600', padding: '12px 20px' }, duration: 2500 }} />

      <header className="sticky top-0 z-[110] bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 shrink-0 transition-colors duration-500">
        <div className="h-16 flex items-center px-4">
          {/* Left: Back */}
          <motion.div 
            animate={{ width: searchQuery || isSearchFocused ? 0 : 48, opacity: searchQuery || isSearchFocused ? 0 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="flex items-center overflow-hidden"
          >
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
                    className="w-9 h-9 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all"
                  >
                    <ArrowLeft size={18} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search doctrines, thesis..."
                  className="w-full h-9 bg-zinc-100/60 dark:bg-zinc-800/60 border border-transparent focus:bg-white dark:focus:bg-zinc-900/50 focus:border-zinc-200 dark:focus:border-zinc-700/50 rounded-full pl-9 pr-9 text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500/80 transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                  >
                    <X size={14} className="text-zinc-500 dark:text-zinc-400" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right: Actions */}
          <motion.div 
            animate={{ width: searchQuery || isSearchFocused ? 0 : 80, opacity: searchQuery || isSearchFocused ? 0 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="flex items-center justify-end overflow-hidden"
          >
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
                      onClick={() => { resetForm(); setIsSheetOpen(true); }}
                      className="w-9 h-9 flex items-center justify-center text-zinc-900 dark:text-zinc-100 active:scale-90 rounded-full transition-all"
                    >
                      <Plus size={20} strokeWidth={2.5} />
                    </button>
                  )}
                  <button
                    onClick={toggleTheme}
                    className="w-9 h-9 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all relative overflow-hidden"
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
          </motion.div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-3">
          <button key="all" onClick={() => setActiveCategory("all")}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all active:scale-95 ${
              activeCategory === "all"
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                : "bg-white dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-500 dark:text-zinc-400 shadow-sm"}`}>
            All
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat.name} onClick={() => setActiveCategory(cat.name)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all active:scale-95 ${
                activeCategory === cat.name
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                  : "bg-white dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-500 dark:text-zinc-400 shadow-sm"}`}>
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      <main className="px-5 pt-5">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin w-7 h-7 border-[3px] border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full" /></div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-20 gap-4">
            <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><ScrollText size={32} className="text-zinc-500 dark:text-zinc-400" /></div>
            <p className="text-zinc-900 dark:text-zinc-100 font-bold text-[17px]">No doctrines yet</p>
            <p className="text-zinc-500 dark:text-zinc-500 dark:text-zinc-400 text-[14px]">{isAdmin ? "Tap + to write your first doctrine" : "Doctrines will appear here"}</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((entry, i) => {
              const ss = STATUS_STYLE[entry.status] || STATUS_STYLE.evolving;
              return (
                <motion.div key={entry.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                  <Link href={`/curation/codex/${entry.id}`}>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-none dark:border dark:border-zinc-800/80 p-5 group relative">
                      {isAdmin && (
                        <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={e => { e.preventDefault(); openEdit(entry); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800"><Edit2 size={14} className="text-zinc-500 dark:text-zinc-400" /></button>
                          <button onClick={e => { e.preventDefault(); handleDelete(entry.id); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50"><Trash2 size={14} className="text-zinc-500 dark:text-zinc-400" /></button>
                        </div>
                      )}

                      <div className="flex items-start gap-1 mb-2">
                        <ScrollText size={16} className="text-zinc-500 dark:text-zinc-400 mt-1" />
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${ss.color} ml-1`}>
                          {CODEX_STATUSES.find(s => s.key === entry.status)?.label || entry.status}
                        </span>
                      </div>

                      <h3 className="text-[17px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight mb-1.5">{entry.title}</h3>

                      {entry.conviction && (
                        <p className="text-[14px] text-zinc-600 dark:text-zinc-300 italic leading-relaxed line-clamp-2">&ldquo;{entry.conviction}&rdquo;</p>
                      )}

                      <div className="flex items-center gap-2 mt-3">
                        {entry.domain && <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{entry.domain}</span>}
                        {entry.category && <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">· {entry.category}</span>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Form */}
      <BottomSheet isOpen={isSheetOpen} onClose={() => { setIsSheetOpen(false); resetForm(); }} title={editItem ? "Edit Doctrine" : "New Doctrine"} footer={
        <button onClick={handleSave} disabled={isSubmitting || !formTitle}
          className="w-full h-14 bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-bold text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all disabled:opacity-40">
          {isSubmitting ? "Saving..." : editItem ? "Save Changes" : "Save Doctrine"}
        </button>
      }>
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400/80 ml-1">Title</label><QuickPasteInput value={formTitle} onChange={setFormTitle} placeholder="Doctrine title" /></div>
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400/80 ml-1">Statement of Conviction</label><QuickPasteInput value={formConviction} onChange={setFormConviction} placeholder="A single thesis statement you firmly believe in" /></div>
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400/80 ml-1">Domain</label><QuickPasteInput value={formDomain} onChange={setFormDomain} placeholder="e.g. Career, Relationships, Finance" /></div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400/80 ml-1">Status</label>
          <div className="flex gap-2">{CODEX_STATUSES.map(s => (<button key={s.key} onClick={() => setFormStatus(s.key)} className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all ${formStatus === s.key ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>{s.label}</button>))}</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400/80 ml-1">Category</label>
          <div className="flex gap-2 flex-wrap">{CATEGORIES.map(c => (<button key={c.name} onClick={() => setFormCategory(formCategory === c.name ? "" : c.name)} className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${formCategory === c.name ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>{c.name}</button>))}</div>
        </div>
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400/80 ml-1">Full Doctrine Content</label><RichTextEditor value={formContent} onChange={setFormContent} placeholder="The full rationale, evolution of thought, and examples behind this belief..." /></div>
      </BottomSheet>
        {/* ═══ ATLAS MENU ═══ */}
        <AtlasMenu items={VERTICALS} isOpen={isAtlasMenuOpen} onClose={() => setIsAtlasMenuOpen(false)} />
    </div>
  );
}
