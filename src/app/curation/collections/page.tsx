"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, FolderOpen, X, ChevronRight, Search, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { toast, Toaster } from "react-hot-toast";
import { formatTitle } from "@/lib/utils";
import { AtlasMenu } from "@/components/AtlasMenu";

type Collection = { id: string; name: string; description: string; articleIds: string[]; createdAt: number };
type ArticleInfo = { id: string; title: string; imageUrl?: string | null };

const STORAGE_KEY = 'curation_collections';

function getCollections(): Collection[] {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveCollections(collections: Collection[]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(collections)); } catch { }
}

export default function CollectionsPage() {
    const { theme, setTheme } = useTheme();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [articleMap, setArticleMap] = useState<Map<string, ArticleInfo>>(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isAtlasMenuOpen, setIsAtlasMenuOpen] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
        setCollections(getCollections());

        const cacheKey = "curation_collections_articles_cache";
        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                const map = new Map<string, ArticleInfo>();
                parsed.forEach((a: any) => map.set(a.id, a));
                setArticleMap(map);
                setIsLoading(false);
                return;
            }
        } catch { }

        setIsLoading(true);
        // Fetch article data for display
        fetch('/api/curation?limit=100&sort=latest')
            .then(r => r.json())
            .then(data => {
                if (data.articles) {
                    const map = new Map<string, ArticleInfo>();
                    const arrayToCache: ArticleInfo[] = [];
                    data.articles.forEach((a: any) => {
                        const info = { id: a.id, title: a.title, imageUrl: a.imageUrl };
                        map.set(a.id, info);
                        arrayToCache.push(info);
                    });
                    setArticleMap(map);
                    try { sessionStorage.setItem(cacheKey, JSON.stringify(arrayToCache)); } catch { }
                }
            })
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    const createCollection = () => {
        if (!newName.trim()) return;
        const collection: Collection = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            name: newName.trim(),
            description: newDesc.trim(),
            articleIds: [],
            createdAt: Date.now()
        };
        const updated = [collection, ...collections];
        setCollections(updated);
        saveCollections(updated);
        setNewName('');
        setNewDesc('');
        setIsCreating(false);
        toast.success('Collection created!');
    };

    const deleteCollection = (id: string) => {
        const updated = collections.filter(c => c.id !== id);
        setCollections(updated);
        saveCollections(updated);
        toast.success('Collection deleted');
    };

    const removeArticle = (collectionId: string, articleId: string) => {
        const updated = collections.map(c =>
            c.id === collectionId ? { ...c, articleIds: c.articleIds.filter(a => a !== articleId) } : c
        );
        setCollections(updated);
        saveCollections(updated);
    };

    return (
        <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-amber-100">
            <Toaster position="bottom-center" />
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />

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
                                    placeholder="Search collections..."
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
                                    <button
                                        onClick={() => { setIsCreating(true); setTimeout(() => nameInputRef.current?.focus(), 100); }}
                                        className="w-9 h-9 flex items-center justify-center text-zinc-900 dark:text-zinc-100 active:scale-90 rounded-full transition-all"
                                    >
                                        <Plus size={20} strokeWidth={2.5} />
                                    </button>
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
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8 pb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h2 className="text-[28px] font-bold tracking-[-0.03em] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Your Collections
                    </h2>
                    <p className="text-[15px] text-zinc-500">Group articles into themed collections for easy reference.</p>
                </motion.div>

                {/* Create Collection Form */}
                <AnimatePresence>
                    {isCreating && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 overflow-hidden"
                        >
                            <div className="bg-white rounded-2xl border border-zinc-200/80 p-5">
                                <input
                                    ref={nameInputRef}
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    placeholder="Collection name..."
                                    className="w-full text-[16px] font-bold text-zinc-900 placeholder:text-zinc-300 outline-none mb-3"
                                    onKeyDown={e => e.key === 'Enter' && createCollection()}
                                />
                                <input
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                    placeholder="Brief description (optional)"
                                    className="w-full text-[14px] text-zinc-600 placeholder:text-zinc-300 outline-none mb-4"
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setIsCreating(false)}
                                        className="px-4 py-2 text-[13px] font-semibold text-zinc-500 rounded-full hover:bg-zinc-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={createCollection}
                                        disabled={!newName.trim()}
                                        className="px-5 py-2 text-[13px] font-bold text-white bg-zinc-900 rounded-full active:scale-95 transition-all disabled:opacity-30"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {collections.length === 0 && !isCreating ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                        <FolderOpen size={48} className="text-zinc-200 mx-auto mb-4" strokeWidth={1.5} />
                        <p className="text-[16px] font-semibold text-zinc-400 mb-2">No collections yet</p>
                        <p className="text-[14px] text-zinc-400 mb-6">Create your first collection to organize articles.</p>
                        <button
                            onClick={() => { setIsCreating(true); setTimeout(() => nameInputRef.current?.focus(), 100); }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-full active:scale-95 transition-all"
                        >
                            <Plus size={16} /> Create Collection
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {collections.map(collection => {
                            const isExpanded = expandedId === collection.id;
                            return (
                                <motion.div
                                    key={collection.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : collection.id)}
                                        className="w-full flex items-center gap-3 p-5 text-left hover:bg-zinc-50/50 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100/50 flex items-center justify-center shrink-0">
                                            <FolderOpen size={18} className="text-blue-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[15px] font-bold text-zinc-800 truncate">{collection.name}</p>
                                            {collection.description && (
                                                <p className="text-[12px] text-zinc-400 truncate">{collection.description}</p>
                                            )}
                                            <p className="text-[11px] text-zinc-300 mt-0.5">{collection.articleIds.length} entries</p>
                                        </div>
                                        <ChevronRight size={18} className={`text-zinc-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 border-t border-zinc-100">
                                                    {collection.articleIds.length === 0 ? (
                                                        <p className="text-[13px] text-zinc-400 py-4 text-center">
                                                            Empty collection. Add articles from detail pages.
                                                        </p>
                                                    ) : (
                                                        <div className="flex flex-col gap-2 pt-3">
                                                            {collection.articleIds.map(aid => {
                                                                const info = articleMap.get(aid);
                                                                return (
                                                                    <div key={aid} className="flex items-center gap-3 group">
                                                                        <Link
                                                                            href={`/curation/${aid}`}
                                                                            className="flex-1 text-[14px] font-medium text-zinc-700 hover:text-blue-600 transition-colors truncate"
                                                                        >
                                                                            {info?.title ? formatTitle(info.title) : aid}
                                                                        </Link>
                                                                        <button
                                                                            onClick={() => removeArticle(collection.id, aid)}
                                                                            className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-zinc-100 transition-all"
                                                                        >
                                                                            <X size={14} className="text-zinc-400" />
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                    <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-end">
                                                        <button
                                                            onClick={() => deleteCollection(collection.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-red-500 rounded-lg hover:bg-red-50 transition-all"
                                                        >
                                                            <Trash2 size={12} /> Delete Collection
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>
            {/* ═══ ATLAS MENU ═══ */}
            <AtlasMenu items={VERTICALS} isOpen={isAtlasMenuOpen} onClose={() => setIsAtlasMenuOpen(false)} />
        </div>
    );
}
