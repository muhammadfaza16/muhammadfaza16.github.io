"use client";

import { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  FileText,
  CheckCircle,
  Send,
  X,
  ArrowDown,
  Share2,
  Sun,
  Moon,
  Flame,
  Highlighter,
  Library,
  Heart,
  Repeat,
  MessageCircle,
  Plus,
  Star,
  Menu,
  Book,
  Zap,
  LayoutGrid,
  Wrench,
  ScrollText,
  History as HistoryIcon,
  Sparkles,
  Compass,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatTitle, formatMetric } from "@/lib/utils";
import { Toaster, toast } from "react-hot-toast";
import { 
  SwipeableArticleCard, 
  SectionLabel, 
  SkeletonRow,
  getReadTime 
} from "@/components/curation/CurationComponents";
import { updateToReadArticle, createToReadArticle } from "@/app/master/actions";
import { getVisitorState, saveVisitorStateAsync, getReadHistoryAsync } from "@/lib/storage";
import { uploadImageToSupabase } from "@/lib/uploadImage";
import { getSupabase } from "@/lib/supabase";
import {
  BottomSheet,
  ImagePicker,
  QuickPasteInput,
  RichTextEditor,
} from "@/components/sanctuary";
import { useTheme } from "@/components/ThemeProvider";
import { AtlasMenu } from "@/components/AtlasMenu";
import { predictCategory } from "@/lib/scoring";
import { VERTICALS } from "@/lib/curation-config";
import aiDataRaw from "@/data/curation_ai.json";

const aiData: Record<string, { summary?: string, toc?: any[] }> = aiDataRaw;

// ─── Types ───

interface ArticleMeta {
  id: string;
  title: string;
  content: string;
  url: string | null;
  imageUrl: string | null;
  category: string | null;
  isRead: boolean;
  isBookmarked: boolean;
  createdAt: string;
  qualityScore: number | null;
  substanceScore: number | null;
  socialScore?: number;
  score?: {
    engagement: number;
    actionability: number;
    specificity: number;
  } | null;
  likes?: number;
  reposts?: number;
  replies?: number;
}

type SortBy = "date" | "popularity";
type SortOrder = "asc" | "desc";

// ─── Constants ───

const CATEGORIES = [
  { name: "AI & Tech", color: { bg: "bg-blue-50/50", text: "text-blue-600", darkBg: "dark:bg-blue-500/10", darkText: "dark:text-blue-400" } },
  { name: "Wealth & Business", color: { bg: "bg-amber-50/50", text: "text-amber-600", darkBg: "dark:bg-amber-500/10", darkText: "dark:text-amber-400" } },
  { name: "Philosophy & Psychology", color: { bg: "bg-indigo-50/50", text: "text-indigo-600", darkBg: "dark:bg-indigo-500/10", darkText: "dark:text-indigo-400" } },
  { name: "Productivity & Deep Work", color: { bg: "bg-emerald-50/50", text: "text-emerald-600", darkBg: "dark:bg-emerald-500/10", darkText: "dark:text-emerald-400" } },
  { name: "Growth & Systems", color: { bg: "bg-orange-50/50", text: "text-orange-600", darkBg: "dark:bg-orange-500/10", darkText: "dark:text-orange-400" } },
];

const LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-wider text-zinc-500/80 dark:text-zinc-400/80 ml-1";
const CACHE_KEY = "curationFeedCache_v2";
const VISITOR_STATE_KEY = "curation_visitor_state";

// ─── Helpers ───

// ─── Helpers ───
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span
            key={i}
            className="bg-orange-200/50 dark:bg-orange-500/30 text-orange-800 dark:text-orange-200 font-semibold rounded-[2px] px-0.5"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};


// ─── Main Component ───

export default function CurationList() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [topArticles, setTopArticles] = useState<ArticleMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTop, setIsLoadingTop] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "unread" | "bookmarked"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [visitorState, setVisitorState] = useState<{
    read: Record<string, boolean>;
    bookmarked: Record<string, boolean>;
  }>({ read: {}, bookmarked: {} });
  const [isAtlasMenuOpen, setIsAtlasMenuOpen] = useState(false);
  const [stats, setStats] = useState<{ [key: string]: number }>({});
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [weeklyReads, setWeeklyReads] = useState(0);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState<
    Record<string, number>
  >({});

  // Refs
  const hasRestoredCache = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchParamsRef = useRef({
    sortBy: "date",
    sortOrder: "desc" as SortOrder,
    cats: [] as string[],
    q: "",
  });
  const scrollYRef = useRef(0);
  const fetchCacheRef = useRef<Record<string, ArticleMeta[]>>({});
  const fetchGenRef = useRef(0);

  // Live refs so IntersectionObserver always reads current values
  const sortByRef = useRef(sortBy);
  const sortOrderRef = useRef(sortOrder);
  const categoryFilterRef = useRef(categoryFilter);
  const searchQueryRef = useRef(debouncedSearchQuery);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const heroCarouselRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadingMoreRef = useRef(false);

  // Define critical handlers early for dependency stability
  const toggleVisitorRead = useCallback(async (id: string) => {
    setVisitorState((prev) => {
      const isRead = !!prev.read[id];
      const newState = {
        ...prev,
        read: { ...prev.read, [id]: !isRead },
      };
      saveVisitorStateAsync(newState);
      return newState;
    });
  }, []);

  const toggleVisitorBookmark = useCallback(async (id: string) => {
    setVisitorState((prev) => {
      const isBookmarked = !!prev.bookmarked[id];
      const newState = {
        ...prev,
        bookmarked: { ...prev.bookmarked, [id]: !isBookmarked },
      };
      saveVisitorStateAsync(newState);
      toast.success(!isBookmarked ? "Saved to collection" : "Removed from collection", {
        icon: !isBookmarked ? "🔖" : "🗑️",
      });
      return newState;
    });
  }, []);

  const handleShareArticle = useCallback(async (article: ArticleMeta) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          url: article.url || window.location.href,
        });
      } catch { }
    } else {
      const url = article.url || window.location.href;
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  }, []);

  const fetchArticles = useCallback(
    async (
      limit = 5,
      page = 1,
    ) => {
      const currentSortBy = sortByRef.current;
      const currentSortOrder = sortOrderRef.current;
      const currentCategories = categoryFilterRef.current;
      const currentQ = searchQueryRef.current;

      // Calculate offset for regular pagination
      const offset = (page - 1) * limit;

      // Abort in-flight request if starting a fresh fetch
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Track what we're fetching
      lastFetchParamsRef.current = { sortBy: currentSortBy, sortOrder: currentSortOrder, cats: currentCategories, q: currentQ };

      // Generation counter
      const localGen = fetchGenRef.current + 1;
      fetchGenRef.current = localGen;

      if (articles.length > 0) {
        setIsTransitioning(true);
      } else {
        setIsLoading(true);
      }

      try {
        let url = `/api/curation?limit=${limit}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}&offset=${offset}`;
        if (currentCategories.length > 0) url += `&category=${encodeURIComponent(currentCategories.join(","))}`;
        if (currentQ.trim()) url += `&q=${encodeURIComponent(currentQ.trim())}`;

        const res = await fetch(url, { cache: "no-store", signal: controller.signal });
        if (!res.ok) {
          const text = await res.text();
          console.error(`Fetch error ${res.status}:`, text.slice(0, 200));
          throw new Error(`Server returned ${res.status}`);
        }
        const data = await res.json();

        if (data.articles) {
          setArticles(data.articles);
          const cacheKey = `${currentSortBy}_${currentSortOrder}_${currentCategories.join(",")}_${currentQ}_${page}`;
          fetchCacheRef.current[cacheKey] = data.articles;

          setNextCursor(data.nextCursor);
          if (data.totalCount != null) setTotalCount(data.totalCount);
        }
      } catch (error: any) {
        if (error?.name !== "AbortError") console.error("Fetch failed:", error);
      } finally {
        if (localGen === fetchGenRef.current) {
          setIsLoading(false);
          setIsTransitioning(false);
        }
      }
    },
    [articles.length],
  );

  // Form State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
  const [formPublishedTime, setFormPublishedTime] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formLikes, setFormLikes] = useState(0);
  const [formReposts, setFormReposts] = useState(0);
  const [formReplies, setFormReplies] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "saving"
  >("idle");
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const supabase = getSupabase();

  // Theme
  const { theme, toggleTheme } = useTheme();

  // Auto-fetch metadata
  useEffect(() => {
    if (!formUrl || !formUrl.startsWith("http")) return;

    const timer = setTimeout(async () => {
      setIsFetchingMetadata(true);
      try {
        const res = await fetch(
          `/api/curation/metadata?url=${encodeURIComponent(formUrl)}`,
        );
        const json = await res.json();

        if (json.success && json.data) {
          const { title, description, image, publishedTime } = json.data;
          if (!formTitle && title) setFormTitle(title);
          if (!formNotes && description) {
            const notesHtml = description.trim().startsWith("<")
              ? description
              : `<p>${description}</p>`;
            setFormNotes(notesHtml);
          }
          if (!formImageFile && !formImagePreview && image)
            setFormImagePreview(image);
          if (!formPublishedTime && publishedTime) {
            const d = new Date(publishedTime);
            if (!isNaN(d.getTime())) setFormPublishedTime(d.toISOString().split('T')[0]);
          }

          // Auto-Category Prediction
          if (!formCategory && (title || description)) {
            try {
              const predicted = predictCategory(title || "", description || "");
              if (predicted) {
                setFormCategory(predicted);
                toast.success(`Auto-categorized: ${predicted}`);
              }
            } catch (e) {
              console.error("Auto-category failed:", e);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      } finally {
        setIsFetchingMetadata(false);
      }
    }, 600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formUrl]);

  // Auto-scrolling Hero Carousel
  useEffect(() => {
    if (topArticles.length <= 1) return;

    let isPaused = false;
    let resumeTimeout: NodeJS.Timeout;
    const carousel = heroCarouselRef.current;

    const handlePause = () => {
      isPaused = true;
      clearTimeout(resumeTimeout);
    };

    const handleResume = () => {
      isPaused = false;
    };

    const handleTouchEnd = () => {
      // Give users a 3-second grace period on mobile after swiping before auto-scroll takes over again
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isPaused = false;
      }, 3000);
    };

    if (carousel) {
      carousel.addEventListener('mouseenter', handlePause);
      carousel.addEventListener('mouseleave', handleResume);
      carousel.addEventListener('touchstart', handlePause, { passive: true });
      carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    // Easing function for a luxurious, slow swipe (easeInOutCubic)
    const smoothScroll = (element: HTMLElement, targetLeft: number, duration: number) => {
      const startLeft = element.scrollLeft;
      const distance = targetLeft - startLeft;
      let startTime: number | null = null;

      // Disable disruptive CSS snap physics during the JS animation
      element.style.scrollSnapType = 'none';

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // easeInOutCubic formula
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        element.scrollLeft = startLeft + distance * ease;

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          // Restore snap physics immediately after frame completes
          element.style.scrollSnapType = 'x mandatory';
        }
      };

      requestAnimationFrame(animation);
    };

    const interval = setInterval(() => {
      if (!carousel || isPaused) return;

      const { scrollLeft, scrollWidth, clientWidth } = carousel;
      // Buffer of 10px to account for rounding errors
      const isEnd = scrollLeft + clientWidth >= scrollWidth - 10;

      if (isEnd) {
        // Slow rewind to start (1.5 seconds)
        smoothScroll(carousel, 0, 1500);
      } else {
        // Dynamically get the width of the first card + gap
        const firstCard = carousel.children[0] as HTMLElement;
        const scrollAmount = firstCard ? firstCard.offsetWidth + 16 : 400; // 16px is gap-4
        // Slow cinematic swipe to next card (1.2 seconds)
        smoothScroll(carousel, scrollLeft + scrollAmount, 1200);
      }
    }, 5000); // 5 seconds duration between slides

    return () => {
      clearInterval(interval);
      clearTimeout(resumeTimeout);
      if (carousel) {
        carousel.removeEventListener('mouseenter', handlePause);
        carousel.removeEventListener('mouseleave', handleResume);
        carousel.removeEventListener('touchstart', handlePause);
        carousel.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [topArticles]);

  const handleEditArticle = (article: ArticleMeta) => {
    setEditingId(article.id);
    setFormTitle(article.title);
    setFormUrl(article.url || "");
    setFormNotes(article.content || "");
    setFormImagePreview(article.imageUrl || null);
    setFormCategory(article.category || "");
    if (article.createdAt) {
      setFormPublishedTime(new Date(article.createdAt).toISOString().split('T')[0]);
    } else {
      setFormPublishedTime("");
    }
    setFormLikes(article.score?.engagement || 0);
    setFormReposts(article.score?.actionability || 0);
    setFormReplies(article.score?.specificity || 0);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingId(null);
    setFormTitle("");
    setFormUrl("");
    setFormNotes("");
    setFormImageFile(null);
    setFormImagePreview(null);
    setFormPublishedTime("");
    setFormCategory("");
    setFormLikes(0);
    setFormReposts(0);
    setFormReplies(0);
  };

  // Save handler
  const handleSave = async () => {
    if (!formTitle || !formUrl) return;
    setIsSubmitting(true);

    try {
      let imageUrl = formImagePreview;

      if (formImageFile && supabase) {
        setUploadStatus("uploading");
        const uploaded = await uploadImageToSupabase(formImageFile);
        if (uploaded) imageUrl = uploaded;
      }

      setUploadStatus("saving");

      const payload = {
        title: formTitle,
        url: formUrl,
        notes: formNotes,
        imageUrl,
        category: formCategory || null,
        createdAt: formPublishedTime ? new Date(formPublishedTime) : undefined,
      };

      if (!isAdmin) {
        // GUEST FLOW — Suggest
        const res = await fetch("/api/curation/suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: payload.title,
            notes: payload.notes || "No description",
            url: payload.url,
            imageUrl: payload.imageUrl,
            category: payload.category,
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success("Usulan terkirim! Bakal segera gue tinjau.");
          handleCloseSheet();
        } else {
          toast.error(json.error || "Gagal mengirim usulan");
        }
      } else {
        // ADMIN FLOW
        if (editingId) {
          const res = await updateToReadArticle(
            editingId,
            payload.title,
            payload.url,
            payload.notes,
            payload.imageUrl ?? undefined,
            payload.category ?? undefined,
            payload.createdAt?.toISOString(),
            formLikes,
            formReposts,
            formReplies
          );
          if (res.success && res.data) {
            toast.success("Artikel diperbarui");
            setArticles((prev) =>
              prev.map((a) =>
                a.id === editingId
                  ? {
                    ...(res.data as any),
                    createdAt: res.data!.createdAt.toISOString(),
                  }
                  : a,
              ),
            );
            handleCloseSheet();
          } else {
            toast.error(res.error || "Failed to update");
          }
        } else {
          const res = await createToReadArticle(
            payload.title,
            payload.url,
            payload.notes,
            payload.imageUrl ?? undefined,
            payload.category ?? undefined,
            payload.createdAt?.toISOString(),
            formLikes,
            formReposts,
            formReplies
          );
          if (res.success && res.data) {
            toast.success("Berhasil disimpan");
            setArticles((prev) => [
              {
                ...(res.data as any),
                createdAt: res.data!.createdAt.toISOString(),
              },
              ...prev,
            ]);
            handleCloseSheet();
          } else {
            toast.error(res.error || "Failed to save");
          }
        }
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
      setUploadStatus("idle");
    }
  };

  // No changes here, just capturing for move

  useEffect(() => {
    // Keep refs in sync so IntersectionObserver always reads current values
    sortByRef.current = sortBy;
    sortOrderRef.current = sortOrder;
    categoryFilterRef.current = categoryFilter;
    searchQueryRef.current = debouncedSearchQuery;

    if (mounted) {
      const cacheKey = `${sortBy}_${sortOrder}_${categoryFilter.join(",")}_${debouncedSearchQuery}`;
      const cachedData = fetchCacheRef.current[cacheKey];

      if (cachedData) {
        setArticles(cachedData);
        setIsLoading(false);
        setIsTransitioning(false);
      } else {
        // Soft reset: don't white-flash if we have content, just transition
        if (articles.length === 0) {
          setIsLoading(true);
        } else {
          setIsTransitioning(true);
        }
      }

      setCurrentPage(1);
      fetchArticles(5, 1);
    }
  }, [
    sortBy,
    sortOrder,
    categoryFilter,
    debouncedSearchQuery,
    statusFilter, // Added statusFilter to dependencies
    mounted,
    fetchArticles,
  ]);

  // Stable handlers for memoized cards
  const handleCardClick = useCallback((id: string) => {
    setNavigatingId(id);
  }, []);

  const handleCardRead = useCallback((id: string) => {
    toggleVisitorRead(id);
  }, [toggleVisitorRead]);

  const handleCardBookmark = useCallback((id: string) => {
    toggleVisitorBookmark(id);
  }, [toggleVisitorBookmark]);

  const handleCardShare = useCallback((article: ArticleMeta) => {
    handleShareArticle(article);
  }, [handleShareArticle]);

  // Save cache when data changes
  useEffect(() => {
    if (articles.length === 0 && !nextCursor) return; // Ignore initial empty state
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      articles,
      nextCursor,
      sortBy,
      sortOrder,
      categoryFilter,
      scrollY: scrollYRef.current || 0
    }));
  }, [articles, nextCursor, sortBy, sortOrder, categoryFilter]);

  // Save scroll position on unmount before navigating away
  useEffect(() => {
    return () => {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          parsed.scrollY = scrollYRef.current;
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
        }
      } catch { }
    };
  }, []);

  // Handle Page Change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchArticles(5, newPage);
  };

  // Initial definition was moved to the top for dependency stability

  // Init
  useEffect(() => {
    setMounted(true);
    // Restore primary cache scroll position if we loaded from cache
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.articles?.length > 0) {
          abortControllerRef.current?.abort(); // Cancel the initial latest fetch
          setArticles(parsed.articles);
          setNextCursor(parsed.nextCursor || null);
          setSortBy(parsed.sortBy || "date");
          setSortOrder(parsed.sortOrder || "desc");
          setCategoryFilter(parsed.categoryFilter || []);
          hasRestoredCache.current = true;
          setIsLoading(false);

          // Populate fetchCacheRef so subsequent filter changes can use it
          const cacheKey = `${parsed.sortBy || "date"}_${parsed.sortOrder || "desc"}_${(parsed.categoryFilter || []).join(",")}_${""}`;
          fetchCacheRef.current[cacheKey] = parsed.articles;

          if (parsed.scrollY) {
            setTimeout(() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = parsed.scrollY;
                scrollYRef.current = parsed.scrollY;
              }
            }, 100);
          }
        }
      }
    } catch { }

    // Load visitor state
    getVisitorState().then(setVisitorState);

    // Load reading progress from localStorage (Keep progress in local storage for now as it updates very rapidly on scroll)
    try {
      const progressMap: Record<string, number> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("curation_progress_")) {
          const articleId = key.replace("curation_progress_", "");
          const pct = parseFloat(localStorage.getItem(key) || "0");
          if (pct > 0.05) progressMap[articleId] = pct;
        }
      }
      setReadingProgress(progressMap);
    } catch { }

    // Calculate weekly reads streak
    getReadHistoryAsync().then(history => {
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recentReads = history.filter(h => h.timestamp > oneWeekAgo);
      setWeeklyReads(recentReads.length);
    }).catch(() => { });

    // Check admin status via secure cookie
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin === true))
      .catch(() => setIsAdmin(false));

    // Fetch Top Articles specifically for the Hero Carousel (cached)
    const topCacheKey = "curation_hero_top_cache_v4";
    try {
      const cachedTop = sessionStorage.getItem(topCacheKey);
      if (cachedTop) {
        setTopArticles(JSON.parse(cachedTop));
        setIsLoadingTop(false);
        return; // Skip fetch if cached
      }
    } catch { }

    fetch("/api/curation/top")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTopArticles(data.articles);
          try {
            sessionStorage.setItem(topCacheKey, JSON.stringify(data.articles));
          } catch { }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingTop(false));

    // Fetch Cross-Vertical Stats
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const [books, skills, frameworks, codex] = await Promise.all([
          fetch("/api/curation/books?limit=0").then(r => r.json()),
          fetch("/api/curation/skills?limit=0").then(r => r.json()),
          fetch("/api/curation/frameworks?limit=0").then(r => r.json()),
          fetch("/api/curation/codex?limit=0").then(r => r.json()),
        ]);
        setStats({
          books: books.totalCount || 0,
          skills: skills.totalCount || 0,
          frameworks: frameworks.totalCount || 0,
          codex: codex.totalCount || 0,
        });
      } catch (e) {
        console.error("Failed to fetch cross-vertical stats", e);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const handleSortDimensionClick = useCallback((dim: SortBy) => {
    if (sortBy === dim) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(dim);
      setSortOrder("desc"); // Default to desc when switching dimensions
    }
  }, [sortBy]);

  const handleCategoryToggle = useCallback((catName: string) => {
    setCategoryFilter((prev) =>
      prev.includes(catName)
        ? prev.filter((c) => c !== catName)
        : [...prev, catName],
    );
  }, []);

  // Helpers
  const getImageUrl = (article: ArticleMeta): string | null => {
    if (!article.imageUrl) return null;
    const img = article.imageUrl;
    if (img.startsWith("http")) return img;
    if (supabase) {
      const { data } = supabase.storage.from("images").getPublicUrl(img);
      return data.publicUrl;
    }
    return null;
  };

  const getDomain = (url?: string | null): string => {
    try {
      return url ? new URL(url).hostname.replace("www.", "") : "";
    } catch {
      return "";
    }
  };

  const estimateReadTime = (content?: string) => {
    if (!content) return 1;
    const text = content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return Math.max(1, Math.ceil(text.split(/\s+/).length / 225));
  };

  // Client-side filtering (category safety net + status)
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      // Strict category filter for instant UI reactivity before API fetch resolves
      if (
        categoryFilter.length > 0 &&
        (!a.category || !categoryFilter.includes(a.category))
      ) {
        return false;
      }
      // Status filter (against localStorage visitor state)
      if (statusFilter === "unread" && visitorState.read[a.id]) return false;
      if (statusFilter === "bookmarked" && !visitorState.bookmarked[a.id])
        return false;
      return true;
    });
  }, [articles, categoryFilter, statusFilter, visitorState]);

  // Category count
  const categoryCount = CATEGORIES.length;
  const isFiltering =
    categoryFilter.length > 0 ||
    debouncedSearchQuery.length > 0 ||
    statusFilter !== "all";

  return (
    <div className="flex-1 w-full flex flex-col bg-[#fcfcfc] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 font-sans antialiased relative selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-700">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            borderRadius: "100px",
            fontSize: "13px",
            fontWeight: "500",
            padding: "10px 18px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          },
          duration: 2500,
        }}
      />

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-[110] bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 shrink-0 h-16 flex items-center px-4 transition-colors duration-500">
        {/* Left: Close/Back */}
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
                  href="/"
                  className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all"
                >
                  <ChevronLeft size={20} />
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
            animate={{ maxWidth: searchQuery || isSearchFocused ? "800px" : "420px" }}
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search articles, books, topics..."
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
      </header>



      {/* ═══ SCROLLABLE CONTENT ═══ */}
      <div
        id="curation-scroll-container"
        ref={scrollContainerRef}
        onScroll={(e) => (scrollYRef.current = e.currentTarget.scrollTop)}
        className="flex-1 overflow-y-auto overflow-x-hidden pt-2 pb-8 relative z-10 w-full max-w-7xl mx-auto"
        style={
          {
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorY: "auto",
          } as React.CSSProperties
        }
      >

        {/* ═══ HERO ENTRANCE ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ 
            opacity: searchQuery ? 0 : 1,
            height: searchQuery ? 0 : "auto",
            marginTop: searchQuery ? -20 : 0,
            marginBottom: searchQuery ? -40 : 0,
            y: searchQuery ? -20 : 0
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="px-5 pt-12 pb-8 md:pt-16 md:pb-12 overflow-hidden"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-400 opacity-60">ARCHIVE VOL. I</span>
              <div className="w-[3px] h-[3px] rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0 -translate-y-[1px]" />
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-400 opacity-60">
                {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex flex-col">
              <h1 
                className="text-[48px] md:text-[72px] font-bold tracking-tighter text-zinc-900 dark:text-zinc-100 leading-[1.05]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Curation.
              </h1>
              <p className="text-[16px] md:text-[18px] text-zinc-400 dark:text-zinc-500 font-medium tracking-tight max-w-2xl mt-2 leading-relaxed">
                A highly refined collection of human knowledge, mental models, and excellence. Curated to help you think better, build faster, and live more intentionally.
              </p>
            </div>
          </div>
        </motion.div>


          {/* ═══ HERO CAROUSEL ═══ */}
          <AnimatePresence mode="wait">
            {!searchQuery && !isLoadingTop && topArticles.length > 0 && (
              <motion.div
                initial={{ opacity: 1, height: "auto" }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0, marginTop: -20, marginBottom: 0 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="overflow-hidden"
              >
                <div className="px-5 mb-5 mt-4 flex items-center gap-3">
                  <div className="w-[4px] h-6 bg-gradient-to-b from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-400 rounded-full shrink-0" />
                  <h3 className="text-[17px] font-bold tracking-tight text-zinc-800 dark:text-zinc-200" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Trending Article
                  </h3>
                </div>
                <div className="mb-6 pl-5">
                  <div
                    ref={heroCarouselRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar pb-6 snap-x snap-mandatory pr-5"
                  >
                    {topArticles.map((featuredArticle) => (
                      <FeaturedArticleCard
                        key={featuredArticle.id}
                        featuredArticle={featuredArticle}
                        navigatingId={navigatingId}
                        onArticleClick={setNavigatingId}
                        imgErrors={imgErrors}
                        setImgErrors={setImgErrors}
                      />
                    ))}
                  </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

          {/* ═══ CONTINUE READING ═══ */}
          {(() => {
            const inProgress = articles.filter((a) => {
              const pct = readingProgress[a.id];
              return pct && pct > 0.05 && pct < 0.95;
            });
            if (inProgress.length === 0) return null;
            if (searchQuery) return null;
            return (
              <div className="mb-10 px-5 mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-[4px] h-6 bg-gradient-to-b from-orange-600 to-orange-400 dark:from-orange-500 dark:to-orange-400 rounded-full shrink-0" />
                  <h3 className="text-[17px] font-bold tracking-tight text-zinc-800 dark:text-zinc-200" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Recent Reads
                  </h3>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {inProgress.map((article) => (
                    <motion.div
                      key={article.id}
                      whileHover={{ y: -2 }}
                      className="shrink-0 w-[240px]"
                    >
                      <Link
                        href={`/curation/${article.id}`}
                        onClick={() => setNavigatingId(article.id)}
                        className="block bg-white dark:bg-[#0a0a0a] border border-zinc-200/50 dark:border-zinc-800/60 rounded-2xl p-4 active:scale-[0.98] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] group"
                      >
                        <h4 className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 leading-snug line-clamp-2 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {formatTitle(article.title)}
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 tracking-wider">
                            {Math.round((readingProgress[article.id] || 0) * 100)}% COMPLETE
                          </span>
                        </div>
                        <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all"
                            style={{
                              width: `${Math.round((readingProgress[article.id] || 0) * 100)}%`,
                            }}
                          />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ═══ (Library Shelves Removed for Minimalist UI) ═══ */}

        {/* ═══ ATLAS MENU ═══ */}
        <AtlasMenu items={[...VERTICALS]} isOpen={isAtlasMenuOpen} onClose={() => setIsAtlasMenuOpen(false)} />

        {/* ═══ ARCHIVE LIST SECTION ═══ */}
        <div ref={resultsRef} className={`px-5 mb-1 scroll-mt-24 transition-all ${searchQuery ? "mt-2" : "mt-8"}`}>
          <SectionLabel color="zinc">
            {debouncedSearchQuery
              ? "Search Results"
              : categoryFilter.length > 0
                ? "Category View"
                : statusFilter !== "all"
                  ? "Status View"
                  : "All Entries"}
          </SectionLabel>
        </div>

        {/* ═══ MAIN PILLS (Sort & Status) ═══ */}
        <div className="flex items-center gap-2 overflow-x-auto px-5 pb-2 no-scrollbar mb-1 w-full">
          {/* Integrated Sort Dimension & Order Toggles */}
          <div className="flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden shrink-0 shadow-sm p-0.5 relative">
            {[
              { id: "date" as const, label: "Date" },
              { id: "popularity" as const, label: "Popularity" }
            ].map((dim) => {
              const isActive = sortBy === dim.id;
              return (
                <button
                  key={dim.id}
                  onClick={() => handleSortDimensionClick(dim.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full transition-all whitespace-nowrap z-10 active:scale-95 relative ${isActive
                    ? "text-white dark:text-zinc-900"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 bg-transparent"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSort"
                      className="absolute inset-0 bg-zinc-800 dark:bg-zinc-100 rounded-full -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span>{dim.label}</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, rotate: sortOrder === "asc" ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center justify-center ml-0.5"
                    >
                      <ArrowDown size={14} strokeWidth={2.5} />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-1 shrink-0" />

          {/* Status Filter Pills */}
          {[
            { key: "all" as const, label: "All" },
            { key: "unread" as const, label: "Unread" },
            { key: "bookmarked" as const, label: "Bookmarked" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1 text-[11px] font-semibold tracking-wide rounded-full transition-all active:scale-[0.96] whitespace-nowrap shrink-0 relative ${statusFilter === f.key
                ? "text-white dark:text-zinc-900"
                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-transparent"
                }`}
            >
              {statusFilter === f.key && (
                <motion.div
                  layoutId="activeStatus"
                  className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 rounded-full -z-10 shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {f.label}
            </button>
          ))}
        </div>
        {/* ═══ CATEGORY PILLS (Always Available) ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-1.5 overflow-x-auto px-5 no-scrollbar pb-2 mb-1"
        >
          {CATEGORIES.map((cat) => {
            const isActive = categoryFilter.includes(cat.name);
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryToggle(cat.name)}
                className={`px-3 py-1 text-[11px] font-semibold tracking-wide rounded-full transition-all active:scale-[0.96] whitespace-nowrap shrink-0 border ${isActive
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm"
                  : `${cat.color.bg} ${cat.color.text} ${cat.color.darkBg} ${cat.color.darkText} border-transparent opacity-60 hover:opacity-100`
                  }`}
              >
                {cat.name}
              </button>
            );
          })}
        </motion.div>

        {/* Separator Line (Almost Full Width) */}
        <div className="px-5 mb-5 mt-1">
          <div className="h-px bg-zinc-200/60 dark:bg-zinc-800/60 w-full" />
        </div>

        {/* ═══ ARTICLE FEED ═══ */}
        <div className="min-h-fit relative">
          {(isLoading || isTransitioning) && filteredArticles.length === 0 ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={
                debouncedSearchQuery
                  ? "flex flex-col gap-3 px-5 mb-10"
                  : "flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4 px-5 mb-10"
              }
            >
              {!debouncedSearchQuery && (
                <div className="md:col-span-2 rounded-[2rem] bg-zinc-200/50 dark:bg-zinc-800/40 h-[280px] animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              )}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800/60 p-4 flex items-center gap-4 h-[120px]"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2.5">
                    <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse w-1/3" />
                    <div className="h-4 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-lg animate-pulse w-full" />
                    <div className="h-4 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-lg animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (isLoading || isTransitioning) && filteredArticles.length > 0 ? (
            <motion.div
              key="transition-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                debouncedSearchQuery
                  ? "flex flex-col gap-3 px-5 mb-10 opacity-50 animate-pulse"
                  : "flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4 px-5 mb-10 opacity-50 animate-pulse"
              }
            >
              {filteredArticles.map((article: ArticleMeta, index: number) => (
                <div
                  key={`skeleton-${article.id}-${index}`}
                  className="bg-white dark:bg-zinc-900 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800/60 p-4 flex items-center gap-4 h-[120px]"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 shrink-0" />
                  <div className="flex-1 space-y-2.5">
                    <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full w-1/3" />
                    <div className="h-4 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-lg w-full" />
                    <div className="h-4 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-lg w-2/3" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : !isLoading && !isTransitioning && filteredArticles.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center pt-24 pb-32 text-center px-10"
            >
              <div className="w-16 h-16 bg-zinc-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 border border-zinc-100 dark:border-white/5">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">
                {debouncedSearchQuery ? "No results" : "Collection Empty"}
              </h3>
              <h3 className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">
                {debouncedSearchQuery ? "No results" : "Collection Empty"}
              </h3>
              <p className="text-[14px] text-zinc-400 dark:text-zinc-500 max-w-[240px] leading-relaxed">
                {debouncedSearchQuery
                  ? `No articles match the search "${debouncedSearchQuery}".`
                  : "No collections here yet. Start adding your interesting reads."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                debouncedSearchQuery
                  ? "flex flex-col gap-3 px-5 mb-10"
                  : "flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4 px-5 mb-10"
              }
            >
              {filteredArticles.map((article: ArticleMeta, index: number) => {
                const validImageUrl = getImageUrl(article);
                const isVisitorRead = visitorState.read[article.id];
                const isVisitorBookmarked = visitorState.bookmarked[article.id];

                if (debouncedSearchQuery) {
                  // Compact Search Result Row (Optional: could also use SwipeableArticleCard if desired, but keeping search result distinct)
                  const rawSummary = (article as any).summary || article.content || "";
                  const plainSummary = rawSummary.replace(/<[^>]+>/g, "").trim();

                  return (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                    >
                      <Link
                        href={`/curation/${article.id}`}
                        onClick={() => setNavigatingId(article.id)}
                        className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-[0.98] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] shadow-sm group/row relative overflow-hidden"
                      >
                        {validImageUrl && !imgErrors[article.id] ? (
                          <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden relative bg-zinc-100 dark:bg-zinc-800">
                            <Image src={validImageUrl} alt="" fill sizes="96px" className="object-cover opacity-90 group-hover/row:opacity-100 group-hover/row:scale-105 transition-all duration-500" onError={() => setImgErrors((prev) => ({ ...prev, [article.id]: true }))} />
                          </div>
                        ) : (
                          <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <FileText size={24} className="text-zinc-300 dark:text-zinc-700" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="text-[15px] md:text-[17px] font-bold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2 mb-1 group-hover/row:text-blue-600 dark:group-hover/row:text-blue-400 transition-colors">
                            <HighlightText text={formatTitle(article.title)} query={searchQuery} />
                          </h4>
                          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            <HighlightText text={plainSummary} query={searchQuery} />
                          </p>
                        </div>
                        {navigatingId === article.id && <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] z-50 animate-pulse rounded-2xl" />}
                      </Link>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                  >
                    <SwipeableArticleCard
                      id={article.id}
                      title={article.title}
                      category={article.category}
                      socialScore={article.socialScore}
                      likes={article.likes}
                      reposts={article.reposts}
                      replies={article.replies}
                      validImageUrl={validImageUrl}
                      createdAt={article.createdAt}
                      readTime={getReadTime(article.content)}
                      isVisitorRead={!!isVisitorRead}
                      isVisitorBookmarked={!!isVisitorBookmarked}
                      imgError={!!imgErrors[article.id]}
                      onImgError={setImgErrors}
                      onClick={handleCardClick}
                      onRead={handleCardRead}
                      onBookmark={handleCardBookmark}
                      isNavigating={navigatingId === article.id}
                      progress={readingProgress[article.id] || 0}
                      onShare={handleCardShare}
                      articleRaw={article}
                    />
                  </motion.div>
                );
              })}

              {/* Pagination Controls */}
              {totalCount > 5 && (
                <div className="flex items-center justify-center gap-10 md:gap-20 px-5 py-6 mt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                  <button
                    disabled={currentPage === 1 || isLoading || isTransitioning}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all disabled:opacity-20 active:scale-95"
                  >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                    <span>Prev</span>
                  </button>

                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[9px] font-bold text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.25em]">
                      Page
                    </span>
                    <span className="text-[11px] md:text-[13px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      {currentPage} <span className="text-zinc-300 dark:text-zinc-700 mx-0.5">/</span> {Math.ceil(totalCount / 5)}
                    </span>
                  </div>

                  <button
                    disabled={currentPage >= Math.ceil(totalCount / 5) || isLoading || isTransitioning}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all disabled:opacity-20 active:scale-95"
                  >
                    <span>Next</span>
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {/* ═══ END OF FEED — SUGGEST CTA ═══ */}
              {!nextCursor && filteredArticles.length > 0 && (
                <div className="text-center py-10 space-y-4">
                  <span className="text-[11px] font-medium text-zinc-300 dark:text-zinc-700 block">
                    You've reached the end of the library
                  </span>
                  {!isAdmin && (
                    <button
                      onClick={() => setIsSheetOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 text-[13px] font-semibold rounded-full border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200 active:scale-[0.97] transition-all"
                    >
                      <Send size={14} />
                      Have a great read? Suggest it here.
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>



      {/* ═══ BOTTOM SHEET ═══ */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        title={
          isAdmin
            ? editingId
              ? "Edit Entry"
              : "Add to Curation"
            : "Suggest Article"
        }
        footer={
          <button
            onClick={handleSave}
            disabled={isSubmitting || !formTitle || !formUrl}
            className="w-full h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center font-bold text-[15px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.97] transition-all disabled:opacity-40 disabled:active:scale-100"
          >
            {isSubmitting ? (
              <span className="animate-pulse">
                {uploadStatus === "uploading" ? "Uploading…" : "Saving…"}
              </span>
            ) : isAdmin ? (
              editingId ? (
                "Update Article"
              ) : (
                "Save Article"
              )
            ) : (
              "Send Suggestion"
            )}
          </button>
        }
      >
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className={LABEL_CLASS}>URL / Link</label>
            {isFetchingMetadata && (
              <span className="text-[10px] text-zinc-400 animate-pulse">
                Fetching…
              </span>
            )}
          </div>
          <QuickPasteInput
            value={formUrl}
            onChange={setFormUrl}
            placeholder="Paste link here..."
          />
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-1.5">
            <ImagePicker
              preview={formImagePreview}
              onSelect={(file: File) => {
                setFormImageFile(file);
                setFormImagePreview(URL.createObjectURL(file));
              }}
              onClear={() => {
                setFormImageFile(null);
                setFormImagePreview(null);
              }}
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className={LABEL_CLASS}>Title</label>
          <QuickPasteInput
            value={formTitle}
            onChange={setFormTitle}
            placeholder="Article or page title"
          />
        </div>

        {isAdmin && (
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={LABEL_CLASS}>Likes</label>
              <input
                type="number"
                value={formLikes || ""}
                onChange={(e) => setFormLikes(parseInt(e.target.value) || 0)}
                className="h-11 bg-zinc-50/50 rounded-xl border border-zinc-100/50 px-4 text-[14px] font-medium text-zinc-900 outline-none focus:bg-white focus:border-blue-200/50 focus:shadow-sm transition-all font-mono"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL_CLASS}>Reposts</label>
              <input
                type="number"
                value={formReposts || ""}
                onChange={(e) => setFormReposts(parseInt(e.target.value) || 0)}
                className="h-11 bg-zinc-50/50 rounded-xl border border-zinc-100/50 px-4 text-[14px] font-medium text-zinc-900 outline-none focus:bg-white focus:border-blue-200/50 focus:shadow-sm transition-all font-mono"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL_CLASS}>Replies</label>
              <input
                type="number"
                value={formReplies || ""}
                onChange={(e) => setFormReplies(parseInt(e.target.value) || 0)}
                className="h-11 bg-zinc-50/50 rounded-xl border border-zinc-100/50 px-4 text-[14px] font-medium text-zinc-900 outline-none focus:bg-white focus:border-blue-200/50 focus:shadow-sm transition-all font-mono"
                placeholder="0"
              />
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Category</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="h-11 bg-zinc-50/50 rounded-xl border border-zinc-100/50 px-4 text-[14px] font-medium text-zinc-900 outline-none focus:bg-white focus:border-blue-200/50 focus:shadow-sm transition-all appearance-none"
            >
              <option value="">No Category</option>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className={LABEL_CLASS}>Content / Notes</label>
          <RichTextEditor
            value={formNotes}
            onChange={setFormNotes}
            placeholder={isAdmin ? "Add article content here..." : "Why do you recommend this?"}
          />
        </div>
      </BottomSheet>

      {/* ═══ ADMIN FLOATING ACTION BUTTON ═══ */}
      {mounted && isAdmin && !isSheetOpen && !isAtlasMenuOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSheetOpen(true)}
          className="fixed bottom-24 right-5 z-[60] w-12 h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.2)] border border-white/10 dark:border-black/10 transition-all"
        >
          <Plus size={20} strokeWidth={2.0} />
        </motion.button>
      )}

      {/* ═══ GOOGLE FONTS ═══ */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}


// ═══ FEATURED MINI CARD (Local for Carousel) ═══

const FeaturedArticleCard = memo(({ featuredArticle, navigatingId, onArticleClick, imgErrors, setImgErrors }: any) => {
    const postDate = new Date(featuredArticle.createdAt);
    const readTime = getReadTime(featuredArticle.content);
    const validImageUrl = featuredArticle.imageUrl || (featuredArticle.content && featuredArticle.content.match(/src="([^"]+)"/)?.[1]);

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.002 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="shrink-0 w-[75vw] md:w-[480px] snap-start group relative rounded-[2rem] overflow-hidden bg-white dark:bg-[#0a0a0a] border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-[0.99] transition-all duration-500 flex flex-col"
        >
            <Link
                href={`/curation/${featuredArticle.id}`}
                onClick={() => onArticleClick(featuredArticle.id)}
                className="flex flex-col h-full"
            >
                <div className="relative w-full h-[180px] md:h-[200px] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    {validImageUrl && !imgErrors[featuredArticle.id] ? (
                        <Image
                            src={validImageUrl}
                            alt=""
                            fill
                            priority={true}
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            onError={() => setImgErrors((prev: any) => ({ ...prev, [featuredArticle.id]: true }))}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900" />
                    )}
                </div>
                <div className="px-5 pt-5 pb-2 md:px-6 md:pt-6 md:pb-2 flex flex-col relative z-20 h-full">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2 py-0.5 rounded-[4px] shadow-sm">
                            TRENDING
                        </span>
                        {featuredArticle.category && (
                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-md ml-1 text-zinc-500 bg-zinc-100 dark:bg-zinc-800 opacity-80">
                                {featuredArticle.category}
                            </span>
                        )}
                    </div>
                    <h3
                        className="text-[18px] md:text-[22px] font-bold tracking-[-0.01em] text-zinc-900 dark:text-zinc-100 leading-[1.3] line-clamp-2 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        {formatTitle(featuredArticle.title)}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-[12px] font-medium text-zinc-400 dark:text-zinc-500">
                            <span>{postDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                            <span className="text-zinc-200 dark:text-zinc-800">•</span>
                            <span>{readTime}m read</span>
                        </div>
                    </div>
                </div>
            </Link>
            {navigatingId === featuredArticle.id && (
                <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] z-50 animate-pulse rounded-[2rem]" />
            )}
        </motion.div>
    );
});
FeaturedArticleCard.displayName = "FeaturedArticleCard";
