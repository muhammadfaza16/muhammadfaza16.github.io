"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Plus, Search, X, Swords, ExternalLink, Edit2, Trash2, Sun, Moon, Menu
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { CATEGORIES, SOURCE_TYPES, DIFFICULTY_LEVELS } from "@/lib/curation-config";
import { AtlasMenu } from "@/components/AtlasMenu";
import type { SkillEntry } from "@/types/curation";
import { Toaster, toast } from "react-hot-toast";
import { BottomSheet, ImagePicker, QuickPasteInput, RichTextEditor } from "@/components/sanctuary";
import { uploadImageToSupabase } from "@/lib/uploadImage";

const DIFF_COLORS: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  intermediate: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  advanced: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export default function SkillsLabPage() {
  const { theme, setTheme } = useTheme();
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [activeSort, setActiveSort] = useState<"popularity" | "date">("date");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isSearchingMore, setIsSearchingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
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
    { key: "highlights", label: "Highlights", href: "/curation/highlights" },
  ];

  // Form
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editItem, setEditItem] = useState<SkillEntry | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formSource, setFormSource] = useState("");
  const [formSourceType, setFormSourceType] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDifficulty, setFormDifficulty] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSkills = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) setIsSearchingMore(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      if (activeDifficulty !== "all") params.set("difficulty", activeDifficulty);
      params.set("sortBy", activeSort);
      if (isLoadMore && nextCursor) params.set("cursor", nextCursor);
      params.set("limit", "12");

      const res = await fetch(`/api/curation/skills?${params}`);
      const data = await res.json();
      
      setSkills(prev => isLoadMore ? [...prev, ...(data.items || [])] : (data.items || []));
      setNextCursor(data.nextCursor || null);
      setTotalCount(data.totalCount || 0);
    } catch { toast.error("Failed to load skills"); }
    
    setLoading(false);
    setIsSearchingMore(false);
  }, [activeCategory, activeDifficulty, activeSort, nextCursor]);

  useEffect(() => { fetchSkills(false); }, [activeCategory, activeDifficulty, activeSort]);
  useEffect(() => { fetch("/api/auth").then(r => r.json()).then(d => { if (d.isAdmin) setIsAdmin(true); }).catch(() => {}); }, []);

  const filtered = skills.filter(s => !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const resetForm = () => {
    setFormTitle(""); setFormContent(""); setFormSource(""); setFormSourceType("");
    setFormCategory(""); setFormDifficulty(""); setFormUrl("");
    setFormImageFile(null); setFormImagePreview(null); setEditItem(null);
  };

  const openEdit = (item: SkillEntry) => {
    setEditItem(item); setFormTitle(item.title); setFormContent(item.content || "");
    setFormSource(item.source || ""); setFormSourceType(item.sourceType || "");
    setFormCategory(item.category || ""); setFormDifficulty(item.difficulty || "");
    setFormUrl(item.url || ""); setFormImagePreview(item.imageUrl || null);
    setIsSheetOpen(true);
  };

  const handleSave = async () => {
    if (!formTitle) { toast.error("Title is required"); return; }
    setIsSubmitting(true);
    let imageUrl = formImagePreview || undefined;
    if (formImageFile) {
      const uploaded = await uploadImageToSupabase(formImageFile);
      if (!uploaded) { toast.error("Failed to upload image"); setIsSubmitting(false); return; }
      imageUrl = uploaded;
    }
    const body = {
      title: formTitle, content: formContent || null, source: formSource || null,
      sourceType: formSourceType || null, category: formCategory || null,
      difficulty: formDifficulty || null, url: formUrl || null, imageUrl: imageUrl || null,
    };
    try {
      const url = editItem ? `/api/curation/skills/${editItem.id}` : "/api/curation/skills";
      const method = editItem ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success || data.data) {
        toast.success(editItem ? "Updated!" : "Added!"); setIsSheetOpen(false); resetForm(); fetchSkills();
      } else toast.error(data.error || "Failed to save");
    } catch { toast.error("Something went wrong"); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/curation/skills/${id}`, { method: "DELETE" });
      if ((await res.json()).success) { toast.success("Deleted"); setSkills(p => p.filter(s => s.id !== id)); }
    } catch { toast.error("Failed"); }
  };

  return (
    <>
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] pb-24">
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', borderRadius: '100px', fontSize: '14px', fontWeight: '600', padding: '12px 20px' }, duration: 2500 }} />

      {/* ═══ HEADER ═══ */}
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
                    className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all"
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search skills, techniques..."
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
                      onClick={() => { setEditItem(null); resetForm(); setIsSheetOpen(true); }}
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
          </motion.div>
        </div>

        <div className="flex flex-col gap-2 px-5 pb-3">
          {/* Main Sort Pills */}
          <div className="flex gap-1.5 items-center mb-1">
            <button onClick={() => setActiveSort("date")} className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${activeSort === "date" ? "bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>Latest</button>
            <button onClick={() => setActiveSort("popularity")} className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${activeSort === "popularity" ? "bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>Popular</button>
            <div className="w-px h-3 bg-zinc-200 dark:bg-zinc-800 mx-1" />
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">{totalCount} Resources</span>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button key="all" onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all active:scale-95 ${
                activeCategory === "all"
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                  : "bg-white dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 shadow-sm"}`}>
              All
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat.name} onClick={() => setActiveCategory(cat.name)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all active:scale-95 ${
                  activeCategory === cat.name
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                    : "bg-white dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 shadow-sm"}`}>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Difficulty pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
            {[{ key: "all", label: "All Levels" }, ...DIFFICULTY_LEVELS].map(d => (
              <button key={d.key} onClick={() => setActiveDifficulty(d.key)}
                className={`shrink-0 px-3.5 py-1 rounded-full text-[12px] font-bold transition-all active:scale-95 ${
                  activeDifficulty === d.key
                    ? "bg-zinc-700 dark:bg-zinc-300 text-white dark:text-zinc-900"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-5 pt-5">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin w-7 h-7 border-[3px] border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full" /></div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-20 gap-4">
            <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><Swords size={32} className="text-zinc-400" /></div>
            <p className="text-zinc-900 dark:text-zinc-100 font-bold text-[17px]">No skill resources yet</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-[14px]">{isAdmin ? "Tap + to add a resource" : "Resources will appear here"}</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((skill, i) => (
              <motion.div key={skill.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                <Link href={`/curation/skills/${skill.id}`}>
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:shadow-none dark:border dark:border-zinc-800/80 overflow-hidden flex group">
                    {skill.imageUrl && (
                      <div className="w-24 shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={skill.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 p-4 min-w-0">
                      <h3 className="text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight">{skill.title}</h3>
                      {skill.source && <p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-medium mt-1 truncate">via {skill.source}</p>}
                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        {skill.difficulty && (
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${DIFF_COLORS[skill.difficulty] || "bg-zinc-100 text-zinc-500"}`}>
                            {skill.difficulty}
                          </span>
                        )}
                        {skill.sourceType && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                            {skill.sourceType}
                          </span>
                        )}
                        {skill.category && (
                          <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">{skill.category}</span>
                        )}
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex flex-col justify-center gap-1 pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={e => { e.preventDefault(); openEdit(skill); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800"><Edit2 size={14} className="text-zinc-400" /></button>
                        <button onClick={e => { e.preventDefault(); handleDelete(skill.id); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={14} className="text-zinc-400" /></button>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
            
            {nextCursor && (
              <div className="py-8 flex justify-center">
                <button 
                  onClick={() => fetchSkills(true)}
                  disabled={isSearchingMore}
                  className="px-8 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[13px] font-bold rounded-full transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSearchingMore ? "Loading..." : "Load more resources"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomSheet isOpen={isSheetOpen} onClose={() => { setIsSheetOpen(false); resetForm(); }} title={editItem ? "Edit Resource" : "Add Resource"} footer={
        <button onClick={handleSave} disabled={isSubmitting || !formTitle}
          className="w-full h-14 bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-bold text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all disabled:opacity-40">
          {isSubmitting ? "Saving..." : editItem ? "Save Changes" : "Add Resource"}
        </button>
      }>
        <ImagePicker preview={formImagePreview} onSelect={f => { setFormImageFile(f); setFormImagePreview(URL.createObjectURL(f)); }} onClear={() => { setFormImageFile(null); setFormImagePreview(null); }} />
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Title</label><QuickPasteInput value={formTitle} onChange={setFormTitle} placeholder="Resource title" /></div>
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Source</label><QuickPasteInput value={formSource} onChange={setFormSource} placeholder="Where is this from?" /></div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Source Type</label>
          <div className="flex gap-2 flex-wrap">{SOURCE_TYPES.map(t => (<button key={t.key} onClick={() => setFormSourceType(formSourceType === t.key ? "" : t.key)} className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${formSourceType === t.key ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>{t.label}</button>))}</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Difficulty</label>
          <div className="flex gap-2 flex-wrap">{DIFFICULTY_LEVELS.map(d => (<button key={d.key} onClick={() => setFormDifficulty(formDifficulty === d.key ? "" : d.key)} className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${formDifficulty === d.key ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>{d.label}</button>))}</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Category</label>
          <div className="flex gap-2 flex-wrap">{CATEGORIES.map(c => (<button key={c.name} onClick={() => setFormCategory(formCategory === c.name ? "" : c.name)} className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${formCategory === c.name ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>{c.name}</button>))}</div>
        </div>
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Content</label><RichTextEditor value={formContent} onChange={setFormContent} placeholder="Paste or write content here..." /></div>
        <div className="flex flex-col gap-1.5"><label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1">Link</label><QuickPasteInput value={formUrl} onChange={setFormUrl} placeholder="https://..." /></div>
      </BottomSheet>
    </div>

    {/* ═══ ATLAS MENU ═══ */}
    <AtlasMenu items={VERTICALS} isOpen={isAtlasMenuOpen} onClose={() => setIsAtlasMenuOpen(false)} />
    </>
  );
}
