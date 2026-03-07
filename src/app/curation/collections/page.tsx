"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, FolderOpen, X, ChevronRight } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

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
    const [collections, setCollections] = useState<Collection[]>([]);
    const [articleMap, setArticleMap] = useState<Map<string, ArticleInfo>>(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

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
        <div className="min-h-screen bg-[#fafaf8] text-zinc-900 font-sans antialiased selection:bg-amber-100">
            <Toaster position="bottom-center" />
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />

            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf8]/80 border-b border-zinc-200/50">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
                    <Link href="/curation" className="p-2 -ml-2 rounded-full hover:bg-zinc-100 active:scale-95 transition-all">
                        <ArrowLeft size={20} className="text-zinc-600" />
                    </Link>
                    <h1 className="text-[16px] font-bold tracking-tight">Collections</h1>
                    <button
                        onClick={() => { setIsCreating(true); setTimeout(() => nameInputRef.current?.focus(), 100); }}
                        className="ml-auto p-2 rounded-full hover:bg-zinc-100 active:scale-95 transition-all"
                    >
                        <Plus size={20} className="text-zinc-600" />
                    </button>
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
                                    placeholder="Short description (optional)"
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
                                            <p className="text-[11px] text-zinc-300 mt-0.5">{collection.articleIds.length} article{collection.articleIds.length !== 1 ? 's' : ''}</p>
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
                                                            No articles yet. Add articles from the article detail page.
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
                                                                            {info?.title || aid}
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
        </div>
    );
}
