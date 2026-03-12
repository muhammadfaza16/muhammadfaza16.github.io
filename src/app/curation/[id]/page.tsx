"use client";

import { use, useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence, useTransform } from "framer-motion";
import { ArrowLeft, ChevronLeft, Headphones, Clock, CheckCircle, Share, Trash2, Globe, Pencil, Loader2, Camera, X, Clipboard, ImageIcon, MessageSquareQuote, ChevronsUp, Maximize, Minimize, Type, Volume2, VolumeX, Pause, Play, FolderPlus, FolderCheck, Check, Sparkles, ChevronDown, ChevronUp, RefreshCw, MessageSquare, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { getSupabase } from "@/lib/supabase";
import DOMPurify from 'dompurify';
import { toggleReadStatus, updateToReadArticle, deleteToReadArticle, toggleBookmarkStatus } from "@/app/master/actions";
import { 
    getVisitorState, saveVisitorStateAsync, appendToReadHistoryAsync, updateToReadArticleAsync, toggleBookmarkedArticleAsync,
    getReaderSettingsAsync, saveReaderSettingsAsync, getCollectionsAsync, saveCollectionsAsync,
    getHighlightsAsync, saveHighlightsAsync 
} from "@/lib/storage";
import { toast } from "react-hot-toast";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { toPng } from 'html-to-image';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { cn, formatTitle } from "@/lib/utils";

type Article = {
    id: string;
    title: string;
    content: string;
    url?: string | null;
    imageUrl?: string | null;
    createdAt: string;
    isRead: boolean;
    isBookmarked: boolean;
    category?: string | null;
    summary?: string | null;
    toc?: any[] | null;
    likes?: number;
    reposts?: number;
    replies?: number;
};

type Comment = {
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
};

const THEMES = {
    white: { bg: '#FFFFFF', text: '#1A1A1A', name: 'White' },
    parchment: { bg: '#F4F1EA', text: '#2C2C2C', name: 'Parchment' },
    sepia: { bg: '#FBF0D2', text: '#433422', name: 'Sepia' },
    night: { bg: '#121212', text: '#E0E0E0', name: 'Night' }
};

type ThemeKey = keyof typeof THEMES;

const LABEL_CLASS = "text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1";

const CATEGORIES = [
    { name: "AI & Tech", emoji: "🤖" },
    { name: "Wealth & Business", emoji: "💰" },
    { name: "Philosophy & Psychology", emoji: "🧠" },
    { name: "Productivity & Deep Work", emoji: "⚡" },
    { name: "Growth & Systems", emoji: "📈" },
];

import { uploadImageToSupabase } from "@/lib/uploadImage";
import { BottomSheet, ImagePicker, QuickPasteInput, RichTextEditor } from "@/components/sanctuary";

const formatMetrics = (num: number | undefined): string | number => {
    if (num === undefined || num === 0) return 0;
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toLocaleString();
};



export default function CurationReaderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMarkingRead, setIsMarkingRead] = useState(false);
    const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Related articles
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
    const [isLoadingRelated, setIsLoadingRelated] = useState(false);

    // Appearance State — restore from localStorage
    const [isAppearanceSheetOpen, setIsAppearanceSheetOpen] = useState(false);
    const [readerSettings, setReaderSettings] = useState<{
        fontSize: number;
        lineHeight: number;
        theme: ThemeKey;
        fontFamily: 'serif' | 'sans' | 'mono';
    }>({ fontSize: 18, lineHeight: 1.8, theme: 'parchment' as ThemeKey, fontFamily: 'serif' as 'serif' | 'sans' | 'mono' });

    // Persist reader settings
    useEffect(() => {
        if (typeof window === 'undefined') return;
        getReaderSettingsAsync().then(settings => {
            if (settings) setReaderSettings(prev => ({ ...prev, ...settings as any }));
        });
    }, []);

    // Save settings when changed
    const mountedRef = useRef(false);
    useEffect(() => {
        if (!mountedRef.current) {
            mountedRef.current = true;
            return;
        }
        saveReaderSettingsAsync(readerSettings as any);
    }, [readerSettings]);

    // TTS State
    const [isTTSPlaying, setIsTTSPlaying] = useState(false);
    const [isTTSPaused, setIsTTSPaused] = useState(false);
    const [ttsSpeed, setTTSSpeed] = useState(1);
    const ttsUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const [ttsProgress, setTTSProgress] = useState(0); // 0-100
    const ttsTextRef = useRef<string>('');

    // Reading progress persistence
    const [hasRestoredScroll, setHasRestoredScroll] = useState(false);

    // Edit Sheet State
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formUrl, setFormUrl] = useState("");
    const [formNotes, setFormNotes] = useState("");
    const [formImageFile, setFormImageFile] = useState<File | null>(null);
    const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
    const [formPublishedTime, setFormPublishedTime] = useState("");
    const [formCategory, setFormCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "saving">("idle");
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
    const formFooterRef = useRef<HTMLDivElement>(null);

    // Comments State
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [newCommentName, setNewCommentName] = useState("");
    const [newCommentText, setNewCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Highlights State
    type Highlight = { text: string; ts: number };
    const [highlights, setHighlights] = useState<Highlight[]>([]);

    // Collections State
    type Collection = { id: string; name: string; description: string; articleIds: string[]; createdAt: number };
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isCollectionsSheetOpen, setIsCollectionsSheetOpen] = useState(false);
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");

    const openCollectionsSheet = async () => {
        const saved = await getCollectionsAsync();
        setCollections(saved as any);
        setIsCollectionsSheetOpen(true);
    };

    const toggleArticleInCollection = (collectionId: string) => {
        if (!article) return;
        const updated = collections.map(c => {
            if (c.id === collectionId) {
                const hasIt = c.articleIds.includes(article.id);
                return {
                    ...c,
                    articleIds: hasIt
                        ? c.articleIds.filter(id => id !== article.id)
                        : [...c.articleIds, article.id]
                };
            }
            return c;
        });
        setCollections(updated);
        saveCollectionsAsync(updated as any);
        toast.success('Collection updated');
    };
    const [selectionTooltip, setSelectionTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
    const [showHighlightsPanel, setShowHighlightsPanel] = useState(false);

    // Quote Card State
    const [quoteCardText, setQuoteCardText] = useState<string | null>(null);
    const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
    const quoteCardRef = useRef<HTMLDivElement>(null);

    const handleCreateQuoteCard = (text: string) => {
        setQuoteCardText(text);
        setSelectionTooltip(null);
        window.getSelection()?.removeAllRanges();
    };

    const downloadQuoteCard = async () => {
        if (!quoteCardRef.current) return;
        setIsGeneratingQuote(true);
        try {
            await new Promise(r => setTimeout(r, 150));
            const dataUrl = await toPng(quoteCardRef.current, { cacheBust: true, pixelRatio: 3, skipFonts: true });
            const link = document.createElement('a');
            link.download = `quote-${article?.id || 'card'}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Quote card saved!");
            setQuoteCardText(null);
        } catch (err) {
            console.error("Failed to generate quote card", err);
            toast.error("Failed to generate image");
        } finally {
            setIsGeneratingQuote(false);
        }
    };

    // Load highlights from IndexedDB
    useEffect(() => {
        getHighlightsAsync(id as string).then(saved => {
            if (saved && Array.isArray(saved)) setHighlights(saved);
        }).catch(() => {});
    }, [id]);

    const saveHighlight = (text: string) => {
        const newHighlight = { text, ts: Date.now() };
        const updated = [...highlights, newHighlight];
        setHighlights(updated);
        saveHighlightsAsync(id as string, updated);
        setSelectionTooltip(null);
        window.getSelection()?.removeAllRanges();
        toast.success('Highlighted!');
    };

    const removeHighlight = (index: number) => {
        const updated = highlights.filter((_, i) => i !== index);
        setHighlights(updated);
        saveHighlightsAsync(id as string, updated);
    };

    // Text selection listener for highlight tooltip
    useEffect(() => {
        const handleSelectionChange = () => {
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed || !sel.toString().trim()) {
                // Delay hiding to allow button click
                setTimeout(() => setSelectionTooltip(null), 200);
                return;
            }
            const text = sel.toString().trim();
            if (text.length < 5) return;
            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setSelectionTooltip({
                x: rect.left + rect.width / 2,
                y: rect.top - 8,
                text
            });
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, []);

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

    const [activeMetadataTab, setActiveMetadataTab] = useState<'tldr' | 'toc'>('toc');
    const [isMetadataExpanded, setIsMetadataExpanded] = useState(false);

    // Sync active tab when article data arrives
    useEffect(() => {
        if (article) {
            // Default to toc if available, otherwise tldr
            if (article.toc && article.toc.length > 0) setActiveMetadataTab('toc');
            else if (article.summary) setActiveMetadataTab('tldr');
        }
    }, [article]);

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
                setFormTitle(data.title || "");
                setFormUrl(data.url || "");
                setFormNotes(data.content || "");
                setFormImagePreview(data.imageUrl || null);
                setIsLoading(false);

                // Fetch related articles by same category
                if (data.category) {
                    setIsLoadingRelated(true);
                    fetch(`/api/curation?limit=5&category=${encodeURIComponent(data.category)}`)
                        .then(r => r.json())
                        .then(relData => {
                            if (relData.articles) {
                                setRelatedArticles(relData.articles.filter((a: any) => a.id !== id).slice(0, 4));
                            }
                            setIsLoadingRelated(false);
                        })
                        .catch(() => setIsLoadingRelated(false));
                }

                // Restore scroll position after article renders
                setTimeout(() => {
                    try {
                        const progress = localStorage.getItem(`curation_progress_${id}`);
                        if (progress) {
                            const pct = parseFloat(progress);
                            if (pct > 0.05 && pct < 0.95) {
                                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                                window.scrollTo({ top: maxScroll * pct, behavior: 'auto' });
                                toast('Resumed where you left off', { icon: '\ud83d\udcd6', duration: 2000 });
                            }
                        }
                    } catch { }
                    setHasRestoredScroll(true);
                }, 400);
            })
            .catch(error => {
                toast.error(error.message);
                setIsLoading(false);
            });

        // Check admin status via secure cookie
        fetch("/api/auth")
            .then(res => res.json())
            .then(data => setIsAdmin(data.isAdmin === true))
            .catch(() => setIsAdmin(false));

        // Fetch comments
        fetch(`/api/curation/comments?articleId=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setComments(data.data);
                }
                setIsLoadingComments(false);
            })
            .catch(() => {
                setIsLoadingComments(false);
                console.error("Failed to load comments");
            });

        // Save reading progress on scroll (debounced)
        let saveTimer: ReturnType<typeof setTimeout>;
        const handleProgressSave = () => {
            clearTimeout(saveTimer);
            saveTimer = setTimeout(() => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                if (maxScroll <= 0) return;
                const pct = window.scrollY / maxScroll;
                try { localStorage.setItem(`curation_progress_${id}`, pct.toFixed(3)); } catch { }
                // Auto-mark read at 90%
                if (pct > 0.9) {
                    const alreadyAutoMarked = sessionStorage.getItem(`auto_read_${id}`);
                    if (!alreadyAutoMarked) {
                        sessionStorage.setItem(`auto_read_${id}`, 'true');
                        updateToReadArticleAsync(id as string).then(() => appendToReadHistoryAsync(id as string));
                        // Also persist to DB (fire-and-forget)
                        toggleReadStatus(id, false).catch(() => { });
                    }
                }
            }, 500);
        };
        window.addEventListener('scroll', handleProgressSave, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleProgressSave);
            clearTimeout(saveTimer);
            if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
            document.body.style.overscrollBehaviorY = '';
        };
    }, [id]);

    // Apply Kindle-like scroll behavior and sync body background on mount
    useEffect(() => {
        // "ga licin tapi ga terlalu heavy" -> no overscroll rubber-banding
        document.body.style.overscrollBehaviorY = 'none';

        // Sync body bg to prevent "black blip" on fast overscroll
        const originalBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = THEMES[readerSettings.theme].bg;

        return () => {
            document.body.style.overscrollBehaviorY = '';
            document.body.style.backgroundColor = originalBg;
        };
    }, [readerSettings.theme]);

    // TTS Functions
    const startTTS = useCallback(() => {
        if (typeof speechSynthesis === 'undefined' || !article) return;
        if (ttsUtteranceRef.current) {
            ttsUtteranceRef.current.onend = null;
            ttsUtteranceRef.current.onerror = null;
        }
        speechSynthesis.cancel();

        setTimeout(() => {
            const div = document.createElement('div');
            div.innerHTML = article.content;
            const text = div.textContent || div.innerText || '';
            ttsTextRef.current = text;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = ttsSpeed;
            utterance.lang = 'en-US';
            const voices = speechSynthesis.getVoices();
            const preferred = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
                voices.find(v => v.lang.startsWith('en'));
            if (preferred) utterance.voice = preferred;
            utterance.onboundary = (e) => {
                if (e.charIndex && text.length) setTTSProgress(Math.round((e.charIndex / text.length) * 100));
            };
            utterance.onend = () => { setIsTTSPlaying(false); setIsTTSPaused(false); setTTSProgress(100); };
            utterance.onerror = () => { setIsTTSPlaying(false); setIsTTSPaused(false); };
            ttsUtteranceRef.current = utterance;
            speechSynthesis.speak(utterance);
            setIsTTSPlaying(true);
            setIsTTSPaused(false);
        }, 50);
    }, [article, ttsSpeed]);

    const toggleTTS = useCallback(() => {
        if (typeof speechSynthesis === 'undefined') return;
        if (isTTSPlaying && !isTTSPaused) {
            // Currently playing → pause
            speechSynthesis.pause();
            setIsTTSPaused(true);
        } else if (isTTSPlaying && isTTSPaused) {
            // Currently paused → resume
            speechSynthesis.resume();
            setIsTTSPaused(false);
        } else {
            // Stopped → start fresh
            startTTS();
        }
    }, [isTTSPlaying, isTTSPaused, startTTS]);

    const stopTTS = useCallback(() => {
        if (typeof speechSynthesis === 'undefined') return;
        speechSynthesis.cancel();
        setIsTTSPlaying(false);
        setIsTTSPaused(false);
        setTTSProgress(0);
    }, []);

    // Fetch related articles
    useEffect(() => {
        if (!article?.category) return;
        setIsLoadingRelated(true);
        fetch(`/api/curation?limit=4&category=${encodeURIComponent(article.category)}`)
            .then(res => res.json())
            .then(data => {
                if (data.articles) {
                    const filtered = data.articles.filter((a: any) => a.id !== article.id).slice(0, 2);
                    setRelatedArticles(filtered);
                }
                setIsLoadingRelated(false);
            })
            .catch(() => setIsLoadingRelated(false));
    }, [article?.category, article?.id]);

    const cycleTTSSpeed = useCallback(() => {
        const speeds = [0.75, 1, 1.25, 1.5, 2];
        const currentIdx = speeds.indexOf(ttsSpeed);
        const nextSpeed = speeds[(currentIdx + 1) % speeds.length];
        setTTSSpeed(nextSpeed);
        if (isTTSPlaying) {
            if (ttsUtteranceRef.current) {
                ttsUtteranceRef.current.onend = null;
                ttsUtteranceRef.current.onerror = null;
            }
            speechSynthesis.cancel();
            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(ttsTextRef.current);
                utterance.rate = nextSpeed;
                utterance.lang = 'en-US';
                utterance.onend = () => { setIsTTSPlaying(false); setIsTTSPaused(false); setTTSProgress(100); };
                utterance.onboundary = (e) => {
                    if (e.charIndex && ttsTextRef.current.length) setTTSProgress(Math.round((e.charIndex / ttsTextRef.current.length) * 100));
                };
                ttsUtteranceRef.current = utterance;
                speechSynthesis.speak(utterance);
                setIsTTSPaused(false);
            }, 100);
        }
    }, [ttsSpeed, isTTSPlaying]);

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

    const scrollToTop = useCallback(() => {
        const duration = 1500; // Deliberate duration for "don't rush"
        const startPosition = window.pageYOffset;
        const startTime = performance.now();

        const easeInOutCubic = (t: number) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            window.scrollTo(0, startPosition * (1 - easedProgress));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fafaf8] antialiased">
                {/* Hero skeleton */}
                <div className="w-full h-[55vh] bg-zinc-200 animate-pulse rounded-b-[2.5rem]" />

                {/* Content skeleton */}
                <div className="max-w-[65ch] mx-auto px-5 pt-10 space-y-6">
                    {/* Title */}
                    <div className="space-y-3">
                        <div className="h-8 bg-zinc-200 rounded-xl animate-pulse w-[90%]" />
                        <div className="h-8 bg-zinc-200 rounded-xl animate-pulse w-[60%]" />
                    </div>

                    {/* Meta bar */}
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-32 bg-zinc-100 rounded-full animate-pulse" />
                        <div className="h-5 w-20 bg-zinc-100 rounded-full animate-pulse" />
                    </div>

                    {/* Paragraph lines */}
                    <div className="space-y-3 pt-4">
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-full" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-[95%]" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-[88%]" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-full" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-[70%]" />
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-full" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-[92%]" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-[85%]" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-[50%]" />
                    </div>
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
        if (!isAdmin) {
            toast.error("Only admins can annotate articles.");
            return;
        }
        const selectedText = window.getSelection()?.toString().trim();

        if (selectedText) {
            const newNote = `<blockquote>${selectedText}</blockquote><p></p>`;

            if (article) {
                setFormTitle(article.title || "");
                setFormUrl(article.url || "");
                setFormImagePreview(article.imageUrl || null);
                setFormCategory(article.category || "");
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
            setFormCategory(article.category || "");
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

                if (!article.isRead) {
                    appendToReadHistoryAsync(article.id);
                }

                // Sync to visitor IndexedDB so feed page reflects this
                getVisitorState().then(vs => {
                    if (article.isRead) delete vs.read[article.id];
                    else vs.read[article.id] = true;
                    saveVisitorStateAsync(vs);
                });

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

    const handleToggleBookmark = async () => {
        if (!article || isTogglingBookmark) return;
        setIsTogglingBookmark(true);
        const toastId = toast.loading(article.isBookmarked ? "Removing from bookmarks..." : "Saving to bookmarks...");

        try {
            const res = await toggleBookmarkStatus(article.id, article.isBookmarked);
            if (res.success) {
                toast.success(article.isBookmarked ? "Removed from bookmarks" : "Saved to bookmarks", { id: toastId });

                // Sync to visitor IndexedDB so feed page reflects this
                toggleBookmarkedArticleAsync(article.id);

                setArticle({ ...article, isBookmarked: !article.isBookmarked } as Article);
            } else {
                throw new Error(res.error);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update bookmark", { id: toastId });
        } finally {
            setIsTogglingBookmark(false);
        }
    };

    const handleOpenWeb = () => {
        if (!article.url) {
            toast.error("No source URL available");
            return;
        }
        window.open(article.url, "_blank");
    };

    const handleShare = async () => {
        if (!article) return;
        const shareData = {
            title: article.title,
            text: article.content ? article.content.substring(0, 100) + '...' : 'Check out this article I saved in my curation.',
            url: window.location.href,
        };
        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch (err: any) {
            console.error(err);
        }
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
        const res = await updateToReadArticle(
            article.id,
            formTitle,
            formUrl,
            formNotes,
            updatedImageUrl,
            formCategory || undefined,
            formPublishedTime || undefined
        );

        if (res.success) {
            toast.success("Article updated");
            // Refresh local state to reflect edits immediately
            if (res.data) setArticle({ ...res.data, createdAt: String((res.data as any).createdAt) } as any);
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

    const getDisplayDomain = (url?: string | null) => {
        if (!url) return "";
        try {
            return new URL(url).hostname.replace("www.", "");
        } catch {
            return "Source";
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim() || !article) return;

        setIsSubmittingComment(true);
        try {
            const res = await fetch("/api/curation/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    articleId: article.id,
                    authorName: newCommentName.trim() || undefined,
                    content: newCommentText.trim(),
                }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setComments(prev => [data.comment, ...prev]);
                setNewCommentText("");
                toast.success("Comment posted!");
            } else {
                toast.error(data.error || "Failed to post comment");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <div
            className="min-h-screen transition-colors duration-500 selection:bg-blue-200 antialiased pb-8 overscroll-none"
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




            <motion.div 
                animate={{ filter: isZenMode ? "grayscale(30%) brightness(0.8)" : "grayscale(0%) brightness(1)" }} 
                transition={{ duration: 0.8 }} 
                className={isZenMode ? "pointer-events-none" : ""}
            >
                {/* Back Button Row - Balanced & Minimal */}
                <div className="max-w-3xl mx-auto px-5 md:px-12 py-3 flex items-center">
                    <Link
                        href="/curation"
                        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group"
                        title="Back to Feed"
                    >
                        <div className="w-8 h-8 flex items-center justify-center -ml-2">
                            <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Back</span>
                    </Link>
                </div>

                {/* 1. Pure Cover Image Banner (No Overlays) */}
                {validImageUrl ? (
                    <div className="w-full relative overflow-hidden bg-transparent mb-4 flex flex-col items-center group/cover">
                        <img 
                            src={validImageUrl} 
                            alt="" 
                            className="w-full h-auto opacity-0 invisible pointer-events-none" 
                            aria-hidden="true" 
                        />
                        <Image 
                            src={validImageUrl} 
                            alt="Cover" 
                            fill 
                            sizes="100vw" 
                            priority 
                            className="object-contain" 
                        />

                        {/* Floating TTS Control - Contextual on Cover (Mobile Polish) */}
                        <div className="absolute top-4 right-4 z-40 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300">
                            <button 
                                onClick={toggleTTS} 
                                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-xl transition-all active:scale-95 ring-1 ring-white/10 ${isTTSPlaying ? (isTTSPaused ? 'bg-blue-500/80 text-white' : 'bg-amber-500/80 text-white') : 'bg-black/40 text-white/80 hover:bg-black/60'}`}
                                title={isTTSPlaying ? (isTTSPaused ? 'Resume' : 'Pause') : 'Listen'}
                            >
                                {isTTSPlaying ? (isTTSPaused ? <Play size={20} /> : <Pause size={20} />) : <Headphones size={20} />}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="pt-24" />
                )}

                {/* 2. Separate Metadata "Label" Block Below */}
                <div 
                    className={`max-w-3xl mx-auto px-5 md:px-12 pb-4 transition-colors duration-500 relative`}
                >
                    {/* TTS Control for Non-Image articles (Contextual Mobile Polish) */}
                    {!validImageUrl && (
                        <div className="absolute top-0 right-5 md:right-12 z-40">
                            <button 
                                onClick={toggleTTS} 
                                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-xl border shadow-xl transition-all active:scale-95 ring-1 ${isTTSPlaying ? (isTTSPaused ? 'bg-blue-500/80 text-white border-blue-400 ring-blue-400/20' : 'bg-amber-500/80 text-white border-amber-400 ring-amber-400/20') : 'bg-zinc-100/60 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 border-zinc-200 dark:border-zinc-700 ring-zinc-500/5'}`}
                                title={isTTSPlaying ? (isTTSPaused ? 'Resume' : 'Pause') : 'Listen'}
                            >
                                {isTTSPlaying ? (isTTSPaused ? <Play size={20} /> : <Pause size={20} />) : <Headphones size={20} />}
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {/* Separated Title - Refined */}
                        <h1 
                            className="text-[32px] md:text-[40px] font-bold font-sans tracking-[-0.03em] leading-[1.1] mb-1"
                            style={{ color: THEMES[readerSettings.theme].text }}
                        >
                            {formatTitle(article.title)}
                        </h1>

                        <div className="flex flex-col gap-2.5">
                            {/* Category Highlight */}
                            {article.category && (
                                <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-500/80">
                                    {article.category}
                                </div>
                            )}

                            {/* Primary Meta Cluster */}
                            <div className="flex flex-wrap items-center gap-3 text-zinc-400 font-sans text-[10px] font-bold tracking-[0.2em] uppercase">
                                <span>
                                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                </span>
                                <span className="opacity-20">•</span>
                                <span>{readingTime} min read</span>

                            {article.url && (
                                <>
                                    <span className="opacity-30">•</span>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
                                    >
                                        <Globe size={11} className="stroke-[2.5]" />
                                        <span>{getDisplayDomain(article.url)}</span>
                                    </a>
                                </>
                            )}
                        </div>

                        {/* Engagement Metrics */}
                        {(article.likes !== undefined) && (
                            <div className="flex items-center gap-4 text-[12px] font-bold font-sans tracking-wide text-zinc-400">
                                <div className="flex items-center gap-1.5 opacity-60" title="Likes">
                                    <Heart size={14} className="stroke-[2.5]" />
                                    <span>{formatMetrics(article.likes)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-60" title="Reposts">
                                    <RefreshCw size={14} className="stroke-[2.5]" />
                                    <span>{formatMetrics(article.reposts)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-60" title="Replies">
                                    <MessageSquare size={14} className="stroke-[2.5]" />
                                    <span>{formatMetrics(article.replies)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

                {/* Subtle Near Full-Width Separator */}
                <div className="max-w-3xl mx-auto px-5 md:px-12">
                    <div 
                        className="w-full h-[1px] opacity-10 transition-colors duration-500" 
                        style={{ backgroundColor: THEMES[readerSettings.theme].text }}
                    />
                </div>
            </motion.div>

            {/* HTML / Rich Text Content */}
            <main
                className="max-w-3xl mx-auto px-5 relative z-20 select-text cursor-text touch-auto pt-4 md:px-12"
                style={{
                    WebkitUserSelect: 'text', userSelect: 'text', WebkitTouchCallout: 'default',
                    '--reader-font-size': `${readerSettings.fontSize}px`,
                    '--reader-line-height': readerSettings.lineHeight,
                    '--reader-font-family': readerSettings.fontFamily === 'serif' ? 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' : readerSettings.fontFamily === 'mono' ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' : 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    '--theme-text': THEMES[readerSettings.theme].text,
                    '--theme-quote-border': readerSettings.theme === 'night' ? '#333' : '#cbd5e1',
                    '--theme-quote-bg': readerSettings.theme === 'night' ? '#1e1e1e' : '#f8fafc',
                    '--theme-accent': readerSettings.theme === 'night' ? '#60a5fa' : '#2563eb'
                } as React.CSSProperties}
            >
                {/* Refined Sophisticated Metadata Section */}
                {article && (article.summary || (article.toc && article.toc.length > 0)) && (
                    <section className="mb-7 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Tab Header */}
                        <div
                            className="flex items-center justify-between border-b pb-3 mb-6 transition-colors duration-500"
                            style={{ borderColor: readerSettings.theme === 'night' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                        >
                            <div className="flex items-center gap-7">
                                {article.toc && article.toc.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setActiveMetadataTab('toc');
                                            if (!isMetadataExpanded) setIsMetadataExpanded(true);
                                        }}
                                        className="font-sans text-[11px] font-bold tracking-[0.18em] uppercase transition-all duration-300 relative py-1"
                                        style={{
                                            color: THEMES[readerSettings.theme].text,
                                            opacity: activeMetadataTab === 'toc' ? 1 : 0.25
                                        }}
                                    >
                                        Contents
                                        {activeMetadataTab === 'toc' && (
                                            <motion.div
                                                layoutId="activeMetadataUnderline"
                                                className="absolute -bottom-[13px] left-0 right-0 h-[1.5px] bg-blue-500"
                                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                )}
                                {article.summary && (
                                    <button
                                        onClick={() => {
                                            setActiveMetadataTab('tldr');
                                            if (!isMetadataExpanded) setIsMetadataExpanded(true);
                                        }}
                                        className="font-sans text-[11px] font-bold tracking-[0.18em] uppercase transition-all duration-300 relative py-1"
                                        style={{
                                            color: THEMES[readerSettings.theme].text,
                                            opacity: activeMetadataTab === 'tldr' ? 1 : 0.25
                                        }}
                                    >
                                        TL;DR
                                        {activeMetadataTab === 'tldr' && (
                                            <motion.div
                                                layoutId="activeMetadataUnderline"
                                                className="absolute -bottom-[13px] left-0 right-0 h-[1.5px] bg-blue-500"
                                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => setIsMetadataExpanded(!isMetadataExpanded)}
                                className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity"
                                style={{ color: THEMES[readerSettings.theme].text }}
                            >
                                <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase">
                                    {isMetadataExpanded ? "Hide" : "Show"}
                                </span>
                                <motion.div
                                    animate={{ rotate: isMetadataExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    <ChevronDown size={12} />
                                </motion.div>
                            </button>
                        </div>

                        {/* Content Area with smooth height and cross-fade */}
                        <motion.div
                            animate={{ height: isMetadataExpanded ? "auto" : 0, opacity: isMetadataExpanded ? 1 : 0 }}
                            initial={false}
                            className="overflow-hidden"
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeMetadataTab}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className="pt-1"
                                >
                                    {activeMetadataTab === 'tldr' && article.summary && (
                                        <div
                                            className="prose dark:prose-invert max-w-none font-serif text-[17px] leading-[1.8] opacity-90 prose-p:mb-5"
                                            style={{
                                                color: THEMES[readerSettings.theme].text,
                                                '--tw-prose-body': THEMES[readerSettings.theme].text,
                                                '--tw-prose-headings': THEMES[readerSettings.theme].text,
                                                '--tw-prose-links': '#3b82f6',
                                                '--tw-prose-bold': THEMES[readerSettings.theme].text,
                                                '--tw-prose-bullets': '#3b82f6'
                                            } as any}
                                        >
                                            <ReactMarkdown>{article.summary}</ReactMarkdown>
                                        </div>
                                    )}
                                    {activeMetadataTab === 'toc' && article.toc && (
                                        <ul className="space-y-3.5 font-serif text-[16px] leading-relaxed">
                                            {article.toc.map((t: any, idx: number) => (
                                                <li key={idx} className="grid grid-cols-[2rem_1fr] group items-start">
                                                    <span
                                                        className="font-sans text-[11px] font-bold opacity-20 pt-[6px] tracking-tighter"
                                                        style={{ color: THEMES[readerSettings.theme].text }}
                                                    >
                                                        {(idx + 1).toString().padStart(2, '0')}
                                                    </span>
                                                    <span
                                                        className="opacity-70 transition-all duration-300 leading-snug group-hover:opacity-100 group-hover:translate-x-1"
                                                        style={{ color: THEMES[readerSettings.theme].text }}
                                                    >
                                                        {formatTitle(t.title)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </section>
                )}

                <article
                    className="reader-content prose max-w-[65ch] mx-auto select-text touch-auto
                    prose-p:mb-7
                    prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight
                    prose-h2:text-[26px] prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-5
                    prose-h3:text-[22px] prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4
                    prose-a:transition-colors prose-a:underline-offset-4
                    prose-img:rounded-3xl prose-img:border prose-img:shadow-sm prose-img:my-8
                    prose-hr:my-8
                    prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:before:content-none prose-blockquote:after:content-none
                    prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-medium
                    prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl prose-pre:shadow-sm"
                    style={{
                        WebkitUserSelect: 'text',
                        userSelect: 'text',
                        fontSize: `${readerSettings.fontSize}px`,
                        lineHeight: readerSettings.lineHeight,
                        fontFamily: readerSettings.fontFamily === 'serif'
                            ? 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
                            : 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        color: THEMES[readerSettings.theme].text,
                        '--theme-accent': readerSettings.theme === 'night' ? '#60a5fa' : '#2563eb',
                    } as React.CSSProperties}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                />

                {/* Bookmark Button at bottom */}
                <div className="mt-8 mb-8 flex items-center justify-end gap-3">
                    {highlights.length > 0 && (
                        <button
                            onClick={() => setShowHighlightsPanel(!showHighlightsPanel)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-[13px] transition-all active:scale-95 border shadow-sm ${showHighlightsPanel
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50"
                                }`}
                        >
                            <span className="text-[14px]">✨</span>
                            {highlights.length} Highlight{highlights.length !== 1 ? 's' : ''}
                        </button>
                    )}
                    <button
                        onClick={openCollectionsSheet}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[13px] transition-all active:scale-95 border shadow-sm bg-white text-zinc-700 border-gray-200 hover:bg-gray-50`}
                    >
                        <FolderPlus size={16} /> Save to Collection
                    </button>
                    <button
                        onClick={handleToggleBookmark}
                        disabled={isTogglingBookmark}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[13px] transition-all active:scale-95 border shadow-sm ${article.isBookmarked
                            ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                            : "bg-white text-zinc-700 border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        {isTogglingBookmark ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Bookmark size={16} className={article.isBookmarked ? "fill-blue-600 border-blue-600" : ""} />
                        )}
                        {article.isBookmarked ? "Bookmarked" : "Bookmark"}
                    </button>
                </div>

                {/* Highlights Panel */}
                <AnimatePresence>
                    {showHighlightsPanel && highlights.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 overflow-hidden"
                        >
                            <div className="bg-amber-50/50 rounded-2xl border border-amber-200/50 p-5">
                                <h4 className="text-[12px] font-bold uppercase tracking-widest text-amber-700/60 mb-4">Your Highlights</h4>
                                <div className="flex flex-col gap-3">
                                    {highlights.map((h, i) => (
                                        <div key={i} className="flex gap-3 group">
                                            <div className="w-1 rounded-full bg-amber-300 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14px] leading-relaxed" style={{ color: THEMES[readerSettings.theme].text }}>
                                                    &ldquo;{h.text}&rdquo;
                                                </p>
                                                <p className="text-[11px] text-zinc-400 mt-1">
                                                    {new Date(h.ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeHighlight(i)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-amber-100 transition-all shrink-0 self-start"
                                            >
                                                <X size={14} className="text-amber-600" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Highlight Tooltip */}
                <AnimatePresence>
                    {selectionTooltip && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="fixed z-[100] pointer-events-auto"
                            style={{
                                left: `${Math.min(Math.max(selectionTooltip.x - 50, 16), window.innerWidth - 116)}px`,
                                top: `${selectionTooltip.y - 44}px`
                            }}
                        >
                            <div className="flex items-center bg-zinc-900 rounded-xl shadow-xl overflow-hidden divide-x divide-zinc-700 pointer-events-auto">
                                <button
                                    onMouseDown={(e) => { e.preventDefault(); saveHighlight(selectionTooltip.text); }}
                                    className="flex items-center gap-1.5 px-3.5 py-2 text-white text-[12px] font-bold hover:bg-zinc-800 active:bg-zinc-700 transition-all font-sans"
                                >
                                    <span>✨</span> Highlight
                                </button>
                                <button
                                    onMouseDown={(e) => { e.preventDefault(); handleCreateQuoteCard(selectionTooltip.text); }}
                                    className="flex items-center gap-1.5 px-3.5 py-2 text-white text-[12px] font-bold hover:bg-zinc-800 active:bg-zinc-700 transition-all font-sans"
                                >
                                    <span>📸</span> Quote
                                </button>
                            </div>
                            <div className="w-3 h-3 bg-zinc-900 rotate-45 mx-auto -mt-1.5" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Related Articles - Read Next */}
                {relatedArticles.length > 0 && (
                    <div className="mt-8 mb-4 border-t pt-10 snap-start scroll-my-24" style={{ borderColor: THEMES[readerSettings.theme].text + '20' }}>
                        <div className="flex items-center gap-2 mb-6">
                            <h3 className="text-[18px] font-bold tracking-tight font-sans" style={{ color: THEMES[readerSettings.theme].text }}>
                                Read Next
                            </h3>
                            <span className="bg-zinc-100 text-zinc-500 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ml-2 dark:bg-zinc-800 dark:text-zinc-400">
                                {article.category}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {relatedArticles.map((rel) => (
                                <Link href={`/curation/${rel.id}`} key={rel.id} className="block group h-full">
                                    <div className="flex flex-col gap-3 rounded-2xl p-4 transition-all bg-black/[0.02] hover:bg-black/[0.04] dark:bg-white/[0.02] dark:hover:bg-white/[0.04] border border-transparent hover:border-black/5 dark:hover:border-white/5 h-full">
                                        {rel.imageUrl && (
                                            <div className="w-full h-32 rounded-xl overflow-hidden relative bg-zinc-200 dark:bg-zinc-800 mb-1 shrink-0">
                                                <Image
                                                    src={rel.imageUrl.startsWith('http') ? rel.imageUrl : supabase ? supabase.storage.from('images').getPublicUrl(rel.imageUrl).data.publicUrl : ''}
                                                    alt={rel.title || "Related article"}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold font-sans text-[15px] leading-snug mb-2 transition-colors line-clamp-2" style={{ color: THEMES[readerSettings.theme].text }}>
                                                {formatTitle(rel.title)}
                                            </h4>
                                            <div className="text-[12px] text-zinc-500 flex items-center gap-1.5 font-medium">
                                                <Clock size={12} />
                                                {new Date(rel.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Community Section: Comments */}
                {/* Community Section: Comments */}
                <div className="mt-16 pt-16 border-t pb-10 snap-start scroll-my-24" style={{ borderColor: THEMES[readerSettings.theme].text + '20' }}>
                    <div className="flex items-center gap-3 mb-8">
                        <MessageSquareQuote size={24} className="text-zinc-400" />
                        <h3 className="text-[20px] font-bold tracking-tight text-zinc-900 font-sans" style={{ color: THEMES[readerSettings.theme].text }}>
                            Community Discussion
                        </h3>
                    </div>

                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="mb-12 bg-black/[0.02] dark:bg-white/[0.02] rounded-[1.5rem] p-5 md:p-6 border" style={{ borderColor: THEMES[readerSettings.theme].text + '10' }}>
                        <div className="flex flex-col gap-4">
                            <textarea
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder="Share your thoughts on this piece..."
                                rows={3}
                                className="w-full rounded-2xl px-5 py-4 text-[15px] placeholder:text-inherit placeholder:opacity-40 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                                style={{
                                    backgroundColor: THEMES[readerSettings.theme].text + '08',
                                    color: THEMES[readerSettings.theme].text,
                                    borderColor: THEMES[readerSettings.theme].text + '15',
                                    borderWidth: '1px'
                                }}
                            />
                            <div className="flex items-center justify-between gap-4">
                                <input
                                    type="text"
                                    value={newCommentName}
                                    onChange={(e) => setNewCommentName(e.target.value)}
                                    placeholder="Your Name (Optional)"
                                    className="w-[180px] rounded-full px-4 text-[13px] font-medium h-10 placeholder:text-inherit placeholder:opacity-40 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                                    style={{
                                        backgroundColor: THEMES[readerSettings.theme].text + '08',
                                        color: THEMES[readerSettings.theme].text,
                                        borderColor: THEMES[readerSettings.theme].text + '15',
                                        borderWidth: '1px'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={!newCommentText.trim() || isSubmittingComment}
                                    className="h-10 px-6 bg-blue-600 text-white rounded-full font-bold text-[13px] tracking-wide shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center min-w-[100px]"
                                >
                                    {isSubmittingComment ? <Loader2 size={16} className="animate-spin" /> : "Post"}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="flex flex-col gap-6">
                        {isLoadingComments ? (
                            <div className="flex justify-center py-8">
                                <Loader2 size={24} className="animate-spin text-zinc-400" />
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="py-8 text-center bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl border" style={{ borderColor: THEMES[readerSettings.theme].text + '10' }}>
                                <MessageSquareQuote size={32} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3" strokeWidth={1.5} />
                                <p className="text-[14px] text-zinc-500 font-medium tracking-tight">Be the first to leave a comment here.</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[14px] font-sans" style={{ color: THEMES[readerSettings.theme].text }}>
                                            {comment.authorName}
                                        </span>
                                        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
                                            {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p
                                        className="text-[15px] leading-relaxed font-serif"
                                        style={{ color: THEMES[readerSettings.theme].text, opacity: 0.85 }}
                                    >
                                        {comment.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="h-10 snap-end" />
            </main>

            {/* Bottom Action Bar */}
            <AnimatePresence>
                {!isZenMode && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center justify-between px-2 py-1.5 w-max max-w-[90%] bg-black/60 dark:bg-zinc-900/40 backdrop-blur-xl saturate-150 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10 dark:border-white/5 ring-1 ring-white/10 text-white gap-1 overflow-hidden"
                    >
                        {/* Top Edge Highlight for Glass Feel */}
                        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <Link
                            href="/curation"
                            className="p-2.5 active:scale-95 transition-transform text-white/80 hover:text-white flex items-center justify-center transform translate-y-[1px]"
                            title="Back to Feed"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div className="w-[1px] h-6 bg-white/10 mx-0.5" />

                        {/* Back to Top - Graceful Transition */}
                        <button 
                            onClick={scrollToTop} 
                            className="p-2.5 active:scale-95 transition-transform text-white/80 hover:text-white flex items-center justify-center" 
                            title="Back to Top"
                        >
                            <ChevronsUp size={18} />
                        </button>
                        <div className="w-[1px] h-6 bg-white/10 mx-0.5" />

                        <button onClick={() => setIsAppearanceSheetOpen(true)} className="p-2.5 active:scale-95 transition-transform text-white/80 hover:text-white flex items-center justify-center font-serif font-bold text-[18px] leading-none" title="Appearance">
                            Aa
                        </button>
                        <div className="w-[1px] h-6 bg-white/10 mx-0.5" />
                        <button onClick={() => setIsZenMode(true)} className="p-2.5 active:scale-95 transition-transform text-white/80 hover:text-white flex items-center justify-center" title="Zen Mode">
                            <Maximize size={18} />
                        </button>
                        <div className="w-[1px] h-6 bg-white/10 mx-0.5" />
                        <button onClick={handleShare} className="p-2.5 active:scale-95 transition-transform text-white/80 hover:text-white flex items-center justify-center" title="Share">
                            <Share size={18} />
                        </button>
                        <div className="w-[1px] h-6 bg-white/10 mx-0.5" />
                        <button
                            onClick={handleMarkAsRead}
                            disabled={isMarkingRead}
                            className={`p-2.5 active:scale-95 transition-transform flex items-center justify-center disabled:opacity-50 ${article.isRead ? "text-emerald-400" : "text-white/80 hover:text-white"}`}
                            title={article.isRead ? "Mark as unread" : "Mark as read"}
                        >
                            {isMarkingRead ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                        </button>

                        {/* Edit Button Back on Pill Float */}
                        {isAdmin && (
                            <>
                                <div className="w-[1px] h-6 bg-white/10 mx-0.5" />
                                <button
                                    onClick={() => setIsEditSheetOpen(true)}
                                    className="p-2.5 active:scale-95 transition-transform text-white/80 hover:text-blue-400 flex items-center justify-center"
                                    title="Edit Article"
                                >
                                    <Pencil size={18} />
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TTS Mini Player */}
            <AnimatePresence>
                {isTTSPlaying && !isZenMode && (
                    <motion.div
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-3 px-4 py-2.5 bg-zinc-900 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-zinc-700/50 text-white"
                    >
                        <button onClick={toggleTTS} className="p-1.5 active:scale-90 transition-transform text-blue-400 hover:text-blue-300">
                            {isTTSPaused ? <Play size={16} /> : <Pause size={16} />}
                        </button>
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${ttsProgress}%` }} />
                        </div>
                        <button onClick={cycleTTSSpeed} className="text-[11px] font-bold text-white/70 hover:text-white min-w-[32px] text-center">
                            {ttsSpeed}x
                        </button>
                        <button onClick={stopTTS} className="p-1.5 active:scale-90 transition-transform text-white/50 hover:text-red-400">
                            <VolumeX size={14} />
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
                            <button
                                onClick={() => setReaderSettings(prev => ({ ...prev, fontFamily: 'mono' }))}
                                className={`flex-1 py-3 text-[14px] font-mono rounded-xl transition-all ${readerSettings.fontFamily === 'mono' ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                Mono
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
                        setFormCategory(article.category || "");
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
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Category</label>
                    <select
                        value={formCategory}
                        onChange={e => setFormCategory(e.target.value)}
                        className="h-12 bg-zinc-50 rounded-xl border border-zinc-200/80 px-4 text-[14px] outline-none focus:border-zinc-300 appearance-none"
                    >
                        <option value="">None</option>
                        {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Published Date</label>
                    <input type="date" value={formPublishedTime} onChange={e => setFormPublishedTime(e.target.value)}
                        className="h-12 bg-zinc-50 rounded-xl border border-zinc-200/80 px-4 text-[14px] outline-none focus:border-zinc-300 appearance-none" />
                </div>
            </BottomSheet>

            {/* Collections Sheet */}
            <BottomSheet
                isOpen={isCollectionsSheetOpen}
                onClose={() => { setIsCollectionsSheetOpen(false); setIsCreatingCollection(false); setNewCollectionName(""); }}
                title="Save to Collection"
            >
                <div className="flex flex-col gap-3 py-2 pb-6">
                    {!isCreatingCollection && (
                        <button
                            onClick={() => setIsCreatingCollection(true)}
                            className="flex items-center justify-center p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all text-blue-500 font-bold text-[13px] active:scale-95"
                        >
                            <FolderPlus size={16} className="mr-2" />
                            Create New Folder
                        </button>
                    )}
                    {isCreatingCollection && (
                        <div className="flex flex-col p-4 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/5">
                            <input
                                autoFocus
                                value={newCollectionName}
                                onChange={e => setNewCollectionName(e.target.value)}
                                onKeyDown={async e => {
                                    if (e.key === 'Enter' && newCollectionName.trim()) {
                                        const newColl: Collection = {
                                            id: `coll_${Date.now()}`,
                                            name: newCollectionName.trim(),
                                            description: "",
                                            articleIds: article ? [article.id] : [],
                                            createdAt: Date.now()
                                        };
                                        const updated = [newColl, ...collections];
                                        setCollections(updated);
                                        await saveCollectionsAsync(updated as any);
                                        setNewCollectionName("");
                                        setIsCreatingCollection(false);
                                        toast.success('Folder created & article saved');
                                    } else if (e.key === 'Escape') {
                                        setIsCreatingCollection(false);
                                        setNewCollectionName("");
                                    }
                                }}
                                onBlur={() => { setIsCreatingCollection(false); setNewCollectionName(""); }}
                                placeholder="Folder Name..."
                                className="bg-transparent border-b border-blue-200 dark:border-blue-800 text-[14px] font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-blue-300 dark:placeholder:text-blue-700 outline-none pb-1 w-full"
                            />
                            <span className="text-[10px] text-blue-400 font-medium mt-2">Press Enter to save</span>
                        </div>
                    )}
                    {collections.length === 0 && !isCreatingCollection ? (
                        <div className="text-center py-6">
                            <p className="text-[13px] text-zinc-500">You don't have any folders yet.</p>
                        </div>
                    ) : (
                        collections.map(collection => {
                            const isSaved = article && collection.articleIds.includes(article.id);
                            return (
                                <button
                                    key={collection.id}
                                    onClick={() => toggleArticleInCollection(collection.id)}
                                    className="flex items-center justify-between p-4 rounded-xl border border-zinc-200/80 hover:bg-zinc-50 transition-all text-left group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSaved ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-zinc-100 text-zinc-400 group-hover:text-zinc-600'}`}>
                                            {isSaved ? <FolderCheck size={18} /> : <FolderPlus size={18} />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-bold text-zinc-900 leading-tight mb-0.5">{collection.name}</span>
                                            <span className="text-[12px] text-zinc-500">{collection.articleIds.length} article{collection.articleIds.length !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                    {isSaved && (
                                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </BottomSheet>

            {/* Quote Card Sheet */}
            <BottomSheet
                isOpen={!!quoteCardText}
                onClose={() => setQuoteCardText(null)}
                title="Create Quote Card"
                footer={
                    <div className="flex justify-center w-full">
                        <button
                            onClick={downloadQuoteCard}
                            disabled={isGeneratingQuote}
                            className="w-full max-w-[280px] h-12 bg-black rounded-full flex items-center justify-center text-white font-semibold text-base shadow-lg active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isGeneratingQuote ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Download size={18} /> Save Image
                                </span>
                            )}
                        </button>
                    </div>
                }
            >
                <div className="py-4 flex flex-col items-center justify-center min-h-[300px]">
                    {/* The Quote Card Canvas */}
                    <div
                        ref={quoteCardRef}
                        className="w-[320px] aspect-[4/5] rounded-3xl p-8 flex flex-col items-start justify-center relative overflow-hidden shadow-2xl"
                        style={{
                            backgroundColor: readerSettings.theme === 'night' ? '#111015' : THEMES[readerSettings.theme].bg,
                            color: THEMES[readerSettings.theme].text,
                            backgroundImage: `linear-gradient(135deg, ${THEMES[readerSettings.theme].text}05 0%, ${THEMES[readerSettings.theme].bg} 100%)`,
                        }}
                    >
                        {/* Decorative Quote Icon */}
                        <MessageSquareQuote size={40} className="mb-6 opacity-20" style={{ color: THEMES[readerSettings.theme].text }} />
                        
                        {/* Quote Text */}
                        <p
                            className={`text-[20px] leading-[1.6] mb-8 relative z-10 ${readerSettings.fontFamily === 'serif' ? 'font-serif' : readerSettings.fontFamily === 'mono' ? 'font-mono' : 'font-sans'}`}
                            style={{ fontWeight: readerSettings.fontFamily === 'serif' ? 500 : 700 }}
                        >
                            &ldquo;{quoteCardText}&rdquo;
                        </p>
                        
                        {/* Attribution / Article Info */}
                        <div className="mt-auto flex items-center gap-3 relative z-10 text-left w-full border-t pt-5" style={{ borderColor: `${THEMES[readerSettings.theme].text}22` }}>
                            {article?.imageUrl && (
                                <div className="w-9 h-9 rounded-full overflow-hidden relative shrink-0 shadow-sm">
                                    <Image
                                        src={article.imageUrl.startsWith('http') ? article.imageUrl : supabase ? supabase.storage.from('images').getPublicUrl(article.imageUrl).data.publicUrl : ''}
                                        alt="Thumbnail"
                                        fill
                                        sizes="36px"
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className={`text-[12px] font-bold truncate line-clamp-1 leading-snug ${readerSettings.fontFamily === 'serif' ? 'font-serif' : readerSettings.fontFamily === 'mono' ? 'font-mono' : 'font-sans'}`}>
                                    {formatTitle(article?.title)}
                                </span>
                                <span className="text-[9px] uppercase tracking-widest font-bold opacity-40 font-sans mt-0.5">
                                    {article?.category || 'Curation'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </BottomSheet>
        </div>
    );
}
