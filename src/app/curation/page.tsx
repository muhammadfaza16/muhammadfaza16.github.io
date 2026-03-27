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
  ChevronsLeft,
  ChevronsRight,
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
import { curationCache } from "@/lib/curation-cache";

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

interface CacheEntry {
  articles: ArticleMeta[];
  nextCursor: string | null;
  totalCount: number;
}

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
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
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
  const [inProgressArticles, setInProgressArticles] = useState<ArticleMeta[]>([]);

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
          setNextCursor(data.nextCursor);
          if (data.totalCount != null) setTotalCount(data.totalCount);

          // Update global cache with full metadata
          const cacheKey = `home_${currentSortBy}_${currentSortOrder}_${currentCategories.join(",")}_${currentQ}_${page}`;
          curationCache.set(cacheKey, data.articles, data.totalCount ?? totalCount, data.nextCursor);
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
    [],
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

  // Auto-scrolling Hero Carousel with focus on boutique stability
  useEffect(() => {
    if (topArticles.length <= 1) return;

    let isPaused = false;
    let currentIndex = 0;
    let resumeTimeout: NodeJS.Timeout;
    const carousel = heroCarouselRef.current;

    const handlePause = () => { isPaused = true; if (resumeTimeout) clearTimeout(resumeTimeout); };
    const handleResume = () => { isPaused = false; };
    const handleTouchEnd = () => {
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => { isPaused = false; }, 4000);
    };

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };

    if (carousel) {
      carousel.addEventListener('mouseenter', handlePause);
      carousel.addEventListener('mouseleave', handleResume);
      carousel.addEventListener('touchstart', handlePause, { passive: true });
      carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    const smoothScroll = (element: HTMLElement, targetLeft: number, duration: number) => {
      const startLeft = element.scrollLeft;
      const distance = targetLeft - startLeft;
      let startTime: number | null = null;
      element.style.scrollSnapType = 'none';

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        element.scrollLeft = startLeft + distance * ease;

        if (timeElapsed < duration) requestAnimationFrame(animation);
        else element.style.scrollSnapType = 'x mandatory';
      };
      requestAnimationFrame(animation);
    };

    const interval = setInterval(() => {
      const currentCarousel = heroCarouselRef.current;
      if (!currentCarousel || isPaused || document.hidden) return;

      // Update current index based on actual scroll position to catch manual swipes
      const { scrollLeft, scrollWidth, clientWidth } = currentCarousel;
      const cardWidth = currentCarousel.children[0] ? (currentCarousel.children[0] as HTMLElement).offsetWidth + 16 : clientWidth;
      
      // Calculate current index from scroll position
      currentIndex = Math.round(scrollLeft / cardWidth);
      
      // Move to next or reset if at end
      if (currentIndex >= topArticles.length - 1) {
        currentIndex = 0;
        smoothScroll(currentCarousel, 0, 1500);
      } else {
        currentIndex++;
        smoothScroll(currentCarousel, currentIndex * cardWidth, 1200);
      }
    }, 5500); 

    return () => {
      clearInterval(interval);
      if (resumeTimeout) clearTimeout(resumeTimeout);
      if (carousel) {
        carousel.removeEventListener('mouseenter', handlePause);
        carousel.removeEventListener('mouseleave', handleResume);
        carousel.removeEventListener('touchstart', handlePause);
        carousel.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
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

  // Reset to page 1 when filters change
  useEffect(() => {
    if (mounted) {
      setCurrentPage(1);
    }
  }, [sortBy, sortOrder, categoryFilter, debouncedSearchQuery, mounted]);

  useEffect(() => {
    // Keep refs in sync so IntersectionObserver always reads current values
    sortByRef.current = sortBy;
    sortOrderRef.current = sortOrder;
    categoryFilterRef.current = categoryFilter;
    searchQueryRef.current = debouncedSearchQuery;

    if (mounted) {
      const cacheKey = `home_${sortBy}_${sortOrder}_${categoryFilter.join(",")}_${debouncedSearchQuery}_${currentPage}`;
      const cached = curationCache.get(cacheKey);

      if (cached) {
        console.log(`[Curation] Cache hit for:`, cacheKey);
        setArticles(cached.articles);
        setNextCursor(cached.nextCursor);
        setTotalCount(cached.totalCount);
        setIsLoading(false);
        setIsTransitioning(false);
        // SKIP FETCH
      } else {
        console.log(`[Curation] Cache miss for:`, cacheKey);
        // Soft reset: don't white-flash if we have content, just transition
        if (articles.length === 0) {
          setIsLoading(true);
        } else {
          setIsTransitioning(true);
        }
        
        fetchArticles(5, currentPage);
      }
    }
  }, [
    sortBy,
    sortOrder,
    categoryFilter,
    debouncedSearchQuery,
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
      searchQuery: debouncedSearchQuery,
      totalCount,
      scrollY: scrollYRef.current || 0
    }));
  }, [articles, nextCursor, sortBy, sortOrder, categoryFilter, debouncedSearchQuery, totalCount]);

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
          setSearchQuery(parsed.searchQuery || "");
          setTotalCount(parsed.totalCount || parsed.articles.length);
          hasRestoredCache.current = true;
          setIsLoading(false);

          // Populate curationCache so subsequent filter changes can use it
          // We assume page 1 for the main CACHE_KEY restoration
          const cacheKey = `home_${parsed.sortBy || "date"}_${parsed.sortOrder || "desc"}_${(parsed.categoryFilter || []).join(",")}_${parsed.searchQuery || ""}_${1}`;
          curationCache.set(
            cacheKey, 
            parsed.articles, 
            parsed.totalCount || parsed.articles.length,
            parsed.nextCursor || null
          );

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

      // Hydrate in-progress articles
      const inProgressIds = Object.keys(progressMap);
      if (inProgressIds.length > 0) {
        fetch(`/api/curation?ids=${inProgressIds.join(",")}`)
          .then(res => res.json())
          .then(data => {
            if (data.articles) setInProgressArticles(data.articles);
          })
          .catch(console.error);
      }
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

  const getSmartInfo = () => {
    let mainLabel = "";
    let Icon = Compass;

    let sortLabel = "";
    if (sortBy === "popularity") {
      sortLabel = sortOrder === "desc" ? "Trending highlights" : "Hidden gems";
      Icon = Zap;
    } else {
      sortLabel = sortOrder === "desc" ? "Latest additions" : "Vintage archive";
      Icon = HistoryIcon;
    }

    if (debouncedSearchQuery) {
      mainLabel = `Searching for "${debouncedSearchQuery}"`;
      Icon = Search;
    } else if (categoryFilter.length === 1) {
      mainLabel = `${sortLabel} in ${categoryFilter[0]}`;
    } else if (categoryFilter.length > 1) {
      mainLabel = `${sortLabel} across ${categoryFilter.length} topics`;
    } else {
      mainLabel = `${sortLabel} in the archive`;
    }

    return (
      <div className="flex items-start gap-2 max-w-full">
        <Icon size={10} className="text-zinc-500 dark:text-zinc-600 shrink-0 mt-[2px]" strokeWidth={2.5} />
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 leading-tight">
          <span className="font-bold">{mainLabel}</span>
          <span className="text-zinc-300 dark:text-zinc-700 opacity-50 select-none">·</span>
          <span className="text-zinc-400 dark:text-zinc-500 whitespace-nowrap">{totalCount} {totalCount === 1 ? "entry" : "entries"}</span>
        </div>
      </div>
    );
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
      return true;
    });
  }, [articles, categoryFilter]);

  // Category count
  const categoryCount = CATEGORIES.length;
  const isFiltering =
    categoryFilter.length > 0 ||
    debouncedSearchQuery.length > 0;

  return (
    <div className="h-[100svh] w-full flex flex-col bg-[#fcfcfc] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 font-sans antialiased overflow-hidden relative selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-700">
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
      <header className="sticky top-0 z-[110] bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 shrink-0 h-[72px] flex items-center px-4 transition-colors duration-500">
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

        {/* Center: Spacer/Title (Optional) */}
        <div className="flex-1" />

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
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all relative overflow-hidden"
                  aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                >
                  {/* Sun Icon */}
                  <svg
                    className={`absolute w-5 h-5 transition-all duration-[2500ms] ease-[cubic-bezier(0.4,0,0,1)] ${theme === "light"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 rotate-90 scale-0"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
                    <path
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                    />
                  </svg>
                  {/* Moon Icon */}
                  <svg
                    className={`absolute w-5 h-5 transition-all duration-[2500ms] ease-[cubic-bezier(0.4,0,0,1)] ${theme === "dark"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-0"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    />
                  </svg>
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
        className="flex-1 overflow-y-auto overflow-x-hidden pt-2 pb-8 relative z-10 w-full max-w-4xl md:max-w-6xl mx-auto"
        style={
          {
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorY: "none",
            overflowAnchor: "auto",
            scrollbarGutter: "stable",
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
          className="px-5 pt-20 pb-12 md:pt-28 md:pb-20 overflow-hidden"
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
          {isLoadingTop ? (
            <motion.div
              key="trending-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 mb-10 mt-4 overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-[4px] h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full shrink-0 relative overflow-hidden">
                  {/* Indicator shimmer removed for less noise */}
                </div>
                <div className="w-24 h-5 bg-zinc-200 dark:bg-zinc-800 rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                </div>
              </div>
              <div className="flex gap-4 overflow-hidden pr-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`shrink-0 w-[75vw] md:w-[480px] bg-white dark:bg-[#0a0a0a] rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/50 relative overflow-hidden flex flex-col ${i > 2 ? 'hidden lg:flex' : ''}`}>
                    {/* Image Skeleton */}
                    <div className="relative w-full aspect-[16/6] md:aspect-[21/9] bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                    </div>
                    {/* Content Skeleton */}
                    <div className="px-6 pt-7 pb-4 md:px-8 md:pt-8 md:pb-4 flex flex-col gap-3 h-full">
                      <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-24 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                      </div>
                      <div className="h-5 bg-zinc-200/60 dark:bg-zinc-800/80 rounded-lg w-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                      </div>
                      <div className="h-5 bg-zinc-200/60 dark:bg-zinc-800/80 rounded-lg w-2/3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                      </div>
                      <div className="mt-auto flex justify-between">
                        <div className="h-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-full w-20 relative overflow-hidden">
                          {/* Footer metric shimmers removed for less noise */}
                        </div>
                        <div className="h-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-full w-16 relative overflow-hidden">
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : !searchQuery && topArticles.length > 0 && (
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
                  className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pr-5"
                >
                  {topArticles.map((featuredArticle) => {
                    const postDate = new Date(featuredArticle.createdAt);
                    const readTime = estimateReadTime(featuredArticle.content);
                    const validImageUrl = getImageUrl(featuredArticle);

                    return (
                      <motion.div
                        key={featuredArticle.id}
                        whileHover={{ y: -4, scale: 1.002 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="shrink-0 w-[75vw] md:w-[480px] snap-start group relative rounded-[2rem] overflow-hidden bg-white dark:bg-[#0a0a0a] border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-[0.99] transition-all duration-500 flex flex-col"
                      >
                        <Link
                          href={`/curation/${featuredArticle.id}`}
                          onClick={() => {
                            setNavigatingId(featuredArticle.id);
                          }}
                          className="flex flex-col h-full"
                        >
                          {/* Top Image Section */}
                          <div className="relative w-full aspect-[16/6] md:aspect-[21/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                            {validImageUrl && !imgErrors[featuredArticle.id] ? (
                              <Image
                                src={validImageUrl}
                                alt=""
                                fill
                                priority={true}
                                sizes="(max-width: 768px) 100vw, 600px"
                                className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                onError={() =>
                                  setImgErrors((prev) => ({
                                    ...prev,
                                    [featuredArticle.id]: true,
                                  }))
                                }
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] z-20" />
                          </div>

                          <div className="px-6 pt-7 pb-4 md:px-8 md:pt-8 md:pb-4 flex flex-col relative z-20 h-full">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2 py-0.5 rounded-[4px] shadow-sm">
                                TRENDING
                              </span>
                              {(() => {
                                const catData = CATEGORIES.find(c => c.name === featuredArticle.category);
                                return featuredArticle.category ? (
                                  <span className={`text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-md ml-1 truncate max-w-[100px] ${catData ? `${catData.color.bg} ${catData.color.text} ${catData.color.darkBg} ${catData.color.darkText}` : "text-zinc-500 bg-zinc-100 dark:bg-zinc-800 opacity-80"}`}>
                                    {featuredArticle.category}
                                  </span>
                                ) : null;
                              })()}
                            </div>

                            <h3
                              className="text-[18px] md:text-[22px] font-bold tracking-[-0.01em] text-zinc-900 dark:text-zinc-100 leading-[1.3] line-clamp-2 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                              {formatTitle(featuredArticle.title)}
                            </h3>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-2 text-[12px] font-medium text-zinc-400 dark:text-zinc-500">
                                <span>
                                  {postDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                <span>{readTime}m read</span>
                              </div>

                              {(featuredArticle.likes || featuredArticle.reposts || featuredArticle.replies) ? (
                                <div className="flex items-center gap-3.5">
                                  {featuredArticle.likes ? (
                                    <div className="flex items-center gap-1.5 group/metric">
                                      <Heart size={12} strokeWidth={2.5} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                                      <span className="text-[11px] tabular-nums font-bold text-zinc-500 dark:text-zinc-400">{formatMetric(featuredArticle.likes)}</span>
                                    </div>
                                  ) : null}
                                  {featuredArticle.reposts ? (
                                    <div className="flex items-center gap-1.5 group/metric">
                                      <Repeat size={12} strokeWidth={2.5} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                                      <span className="text-[11px] tabular-nums font-bold text-zinc-500 dark:text-zinc-400">{formatMetric(featuredArticle.reposts)}</span>
                                    </div>
                                  ) : null}
                                  {featuredArticle.replies ? (
                                    <div className="flex items-center gap-1.5 group/metric">
                                      <MessageCircle size={12} strokeWidth={2.5} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                                      <span className="text-[11px] tabular-nums font-bold text-zinc-500 dark:text-zinc-400">{formatMetric(featuredArticle.replies)}</span>
                                    </div>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </Link>

                        {navigatingId === featuredArticle.id && (
                          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] z-50 animate-pulse rounded-[2rem]" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ CONTINUE READING ═══ */}
        {(() => {
          const inProgress = inProgressArticles.filter((a) => {
            const pct = readingProgress[a.id];
            return pct && pct > 0.05 && pct < 0.95;
          });
          if (inProgress.length === 0) return null;
          if (searchQuery) return null;
          return (
            <div className="mb-10 px-5 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[4px] h-6 bg-gradient-to-b from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-400 rounded-full shrink-0" />
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
        {(!isLoadingTop || articles.length > 0) && (
          <div ref={resultsRef} className={`px-5 mb-4 scroll-mt-24 flex items-center gap-3 transition-all ${searchQuery ? "mt-2" : "mt-8"}`}>
            {!searchQuery && <div className="w-[4px] h-6 bg-gradient-to-b from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-400 rounded-full shrink-0 shadow-sm" />}
            <h3 className="text-[17px] font-bold tracking-tight text-zinc-800 dark:text-zinc-200" style={{ fontFamily: "'Playfair Display', serif" }}>
              {debouncedSearchQuery
                ? "Search Results"
                : categoryFilter.length > 0
                  ? "Category View"
                  : "All Entries"}
            </h3>
          </div>
        )}

        {/* ═══ MAIN FILTERS (Sort & Category Dropdown) ═══ */}
        {(!isLoadingTop || articles.length > 0) && (
          <div className="flex items-center gap-3 px-5 pb-4 mb-2 overflow-visible relative">
            {/* Sort toggler */}
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

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border shadow-sm active:scale-95 ${categoryFilter.length > 0
                  ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
                  : "bg-white dark:bg-[#0a0a0a] text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
              >
                <Compass size={12} className={categoryFilter.length > 0 ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-400 opacity-60"} />
                <span className="truncate max-w-[120px]">
                  {categoryFilter.length === 1 ? categoryFilter[0] : categoryFilter.length > 1 ? `${categoryFilter.length} Selected` : "Categories"}
                </span>
                <ChevronRight size={10} className={`opacity-40 transition-transform ${isCategoryMenuOpen ? "rotate-90" : ""}`} />
              </button>

              <AnimatePresence>
                {isCategoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-52 bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-[150] overflow-hidden p-1 backdrop-blur-xl"
                  >
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Select Category</span>
                    </div>
                    {CATEGORIES.map((cat) => {
                      const isActive = categoryFilter.includes(cat.name);
                      return (
                        <button
                          key={cat.name}
                          onClick={() => {
                            handleCategoryToggle(cat.name);
                            setIsCategoryMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold rounded-xl transition-colors ${isActive
                            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                            }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cat.color.bg.split(' ')[0]}`} />
                            <span className="truncate">{cat.name}</span>
                          </div>
                          {isActive && <CheckCircle size={10} className="opacity-60" />}
                        </button>
                      );
                    })}
                    {categoryFilter.length > 0 && (
                      <button
                        onClick={() => {
                          setCategoryFilter([]);
                          setIsCategoryMenuOpen(false);
                        }}
                        className="w-full mt-1 border-t border-zinc-100 dark:border-zinc-800 px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-left transition-colors"
                      >
                        Reset Filter
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ═══ SMART INFO ═══ */}
        {(!isLoadingTop || articles.length > 0) && (
          <div className="px-5 mb-5 -mt-1 min-h-[14px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${sortBy}_${categoryFilter.join(",")}_${debouncedSearchQuery}_${totalCount}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 flex items-center"
              >
                {getSmartInfo()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* ═══ ARTICLE FEED ═══ */}
        <div className="min-h-[60vh] relative">
          {isLoading || isTransitioning ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col px-5 mb-10"
            >
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#0a0a0a] rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800/60 p-4 flex items-center gap-4 min-h-[120px] relative overflow-hidden"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                    </div>
                    <div className="flex-1 space-y-2.5">
                      <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full relative overflow-hidden w-1/3">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                      </div>
                      <div className="h-4 bg-zinc-200/60 dark:bg-zinc-800/80 rounded-lg relative overflow-hidden w-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                      </div>
                      <div className="h-4 bg-zinc-200/60 dark:bg-zinc-800/80 rounded-lg relative overflow-hidden w-2/3">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              {!debouncedSearchQuery && (
                <div className="flex justify-center mt-2 mb-8">
                  <div className="h-10 w-64 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-full animate-pulse" />
                </div>
              )}
            </motion.div>
          ) : !isLoading && !isTransitioning && filteredArticles.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center pt-24 pb-32 text-center px-10"
            >
              <div className="mb-6 text-zinc-200 dark:text-zinc-800">
                {debouncedSearchQuery ? (
                  <Search size={48} strokeWidth={1} />
                ) : (
                  <Library size={48} strokeWidth={1} />
                )}
              </div>
              <h3 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">
                {debouncedSearchQuery ? "No entries found" : "Your collection is empty"}
              </h3>
              <p className="text-[14px] text-zinc-500 dark:text-zinc-400 max-w-[280px] leading-relaxed">
                {debouncedSearchQuery
                  ? `We couldn't find any articles matching "${debouncedSearchQuery}".`
                  : "Start adding interesting reads to your personal curation to see them here."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                debouncedSearchQuery || !debouncedSearchQuery
                  ? "flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4 px-5 mb-10"
                  : "flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4 px-5 mb-10"
              }
            >
              {filteredArticles.map((article: ArticleMeta, index: number) => {
                const validImageUrl = getImageUrl(article);

                // The article will render normally below the Hero Carousel.

                const postDate = new Date(article.createdAt);
                const readTime = estimateReadTime(article.content);
                const rawSummary = aiData[article.id]?.summary || article.content.substring(0, 160);
                const isVisitorRead = visitorState.read[article.id];
                const isVisitorBookmarked = visitorState.bookmarked[article.id];

                if (debouncedSearchQuery) {
                  return (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(index * 0.04, 0.4),
                      }}
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
                        readTime={readTime}
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
                }
                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.04, 0.4),
                    }}
                  >
                    {/* ═══ SWIPEABLE ARTICLE CARD ═══ */}
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
                      readTime={readTime}
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
                <div className="flex items-center justify-center mt-2 mb-8">
                  <div className="flex items-center gap-2 p-1.5 bg-zinc-50/50 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-full shadow-sm">
                    <button
                      disabled={currentPage === 1 || isLoading || isTransitioning}
                      onClick={() => handlePageChange(1)}
                      className="flex items-center justify-center w-8 h-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all disabled:opacity-10 active:scale-90 rounded-full"
                      title="First Page"
                    >
                      <ChevronsLeft size={14} strokeWidth={2.5} />
                    </button>

                    <button
                      disabled={currentPage === 1 || isLoading || isTransitioning}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="flex items-center gap-1 px-3 h-8 text-[10px] font-bold tracking-widest uppercase text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all disabled:opacity-20 active:scale-95 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm"
                    >
                      <ChevronLeft size={12} strokeWidth={3} />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    <div className="flex items-center min-w-[50px] justify-center px-1">
                      <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {currentPage} <span className="text-zinc-300 dark:text-zinc-700 font-medium mx-0.5">/</span> {Math.ceil(totalCount / 5)}
                      </span>
                    </div>

                    <button
                      disabled={currentPage >= Math.ceil(totalCount / 5) || isLoading || isTransitioning}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="flex items-center gap-1 px-3 h-8 text-[10px] font-bold tracking-widest uppercase text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all disabled:opacity-20 active:scale-95 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={12} strokeWidth={3} />
                    </button>

                    <button
                      disabled={currentPage >= Math.ceil(totalCount / 5) || isLoading || isTransitioning}
                      onClick={() => handlePageChange(Math.ceil(totalCount / 5))}
                      className="flex items-center justify-center w-8 h-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all disabled:opacity-10 active:scale-90 rounded-full"
                      title="Last Page"
                    >
                      <ChevronsRight size={14} strokeWidth={2.5} />
                    </button>
                  </div>
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

// ═══ SWIPEABLE ARTICLE CARD ═══

interface SwipeableArticleCardProps {
  id: string;
  title: string;
  category: string | null;
  socialScore?: number;
  likes?: number;
  reposts?: number;
  replies?: number;
  validImageUrl: string | null;
  createdAt: string;
  readTime: number;
  isVisitorRead: boolean;
  isVisitorBookmarked: boolean;
  imgError: boolean;
  onImgError: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onClick: (id: string) => void;
  onRead: (id: string) => void;
  onBookmark: (id: string) => void;
  isNavigating?: boolean;
  progress?: number;
  onShare?: (article: ArticleMeta) => void;
  articleRaw: ArticleMeta;
}

const SwipeableArticleCard = memo(({
  id,
  title,
  category,
  socialScore,
  likes,
  reposts,
  replies,
  validImageUrl,
  createdAt,
  readTime,
  isVisitorRead,
  isVisitorBookmarked,
  imgError,
  onImgError,
  onClick,
  onRead,
  onBookmark,
  isNavigating,
  progress = 0,
  onShare,
  articleRaw,
}: SwipeableArticleCardProps) => {
  const postDate = new Date(createdAt);
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const bgRightOpacity = useTransform(x, [0, 60], [0, 1]);
  const bgLeftOpacity = useTransform(x, [0, -60], [0, 1]);
  const scaleRightIcon = useTransform(x, [20, 70], [0.5, 1.2]);
  const scaleLeftIcon = useTransform(x, [-20, -70], [0.5, 1.2]);

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);

    // Swipe activation constants
    const THRESHOLD = 65;
    const MIN_VELOCITY = 150;

    // Check for trigger via distance OR fast flick
    if (info.offset.x > THRESHOLD || (info.velocity.x > MIN_VELOCITY && info.offset.x > 20)) {
      onRead(id);
    } else if (info.offset.x < -THRESHOLD || (info.velocity.x < -MIN_VELOCITY && info.offset.x < -20)) {
      onBookmark(id);
    }
  };

  return (
    <div className="relative group/card touch-pan-y">
      {/* Action Backgrounds */}
      <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 w-1/2 flex items-center pl-6 font-bold text-white shadow-inner ${isVisitorRead ? "bg-amber-500" : "bg-emerald-500"}`}
          style={{ opacity: bgRightOpacity }}
        >
          <motion.div
            style={{ scale: scaleRightIcon }}
            className="flex items-center gap-2 drop-shadow-md"
          >
            <CheckCircle size={22} />
            <span className="text-sm tracking-wide">
              {isVisitorRead ? "Undo" : "Done"}
            </span>
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-end pr-6 font-bold text-white bg-blue-500 shadow-inner"
          style={{ opacity: bgLeftOpacity }}
        >
          <motion.div
            style={{ scale: scaleLeftIcon }}
            className="flex items-center gap-2 drop-shadow-md"
          >
            <span className="text-sm tracking-wide">
              {isVisitorBookmarked ? "Remove" : "Save"}
            </span>
            <Bookmark
              fill={isVisitorBookmarked ? "none" : "white"}
              size={22}
              className={isVisitorBookmarked ? "" : "fill-white"}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Foreground Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileTap={{ cursor: "grabbing" }}
        className="bg-white dark:bg-[#0a0a0a] rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800/60 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-4 relative z-10 cursor-grab touch-pan-y min-h-[120px] flex flex-col justify-center"
      >
        <Link
          href={`/curation/${id}`}
          onClick={(e) => {
            if (isDragging) {
              e.preventDefault();
              e.stopPropagation();
            } else {
              onClick(id);
            }
          }}
          className="flex items-center gap-4 outline-none w-full relative"
          draggable={false}
        >
          {isNavigating && (
            <div
              className="absolute inset-0 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-[2px] z-50 animate-pulse rounded-xl"
              style={{ margin: "-8px", padding: "8px" }}
            />
          )}
          {/* Thumbnail */}
          <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 shrink-0 border border-zinc-100/60 dark:border-zinc-700/60 relative pointer-events-none">
            {validImageUrl && !imgError ? (
              <Image
                src={validImageUrl}
                alt=""
                fill
                sizes="80px"
                draggable={false}
                className="object-cover"
                onError={() => onImgError(prev => ({ ...prev, [id]: true }))}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-200 dark:text-zinc-700 bg-gradient-to-br from-zinc-50 dark:from-zinc-800 to-zinc-100 dark:to-zinc-900">
                <FileText size={22} strokeWidth={1.5} />
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 rounded-2xl" />
          </div>
          {/* Text */}
          <div className="flex-1 min-w-0 py-0.5 pointer-events-none">
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {isVisitorRead ? (
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 px-1.5 py-[2px] rounded">
                  READ
                </span>
              ) : (Date.now() - postDate.getTime() <= 7 * 24 * 60 * 60 * 1000) ? (
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 px-1.5 py-[2px] rounded">
                  NEW
                </span>
              ) : null}
              {typeof socialScore === 'number' && socialScore >= 1000 && (
                <>
                  <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 px-1.5 py-[2px] rounded">
                    ⭐ TOP
                  </span>
                </>
              )}
              {category && (
                <>
                  <div className="w-[3px] h-[3px] rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 truncate max-w-[80px]">
                    {category}
                  </span>
                </>
              )}
              {isVisitorBookmarked && (
                <>
                  <Bookmark
                    size={11}
                    className="fill-blue-500 text-blue-500 dark:fill-blue-400 dark:text-blue-400 ml-0.5"
                  />
                </>
              )}
            </div>
            <h3 className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.35] line-clamp-2 mb-1.5 group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">
              {formatTitle(title)}
            </h3>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                <span>
                  {postDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  {postDate.getFullYear() !== new Date().getFullYear() &&
                    `, ${postDate.getFullYear()}`}
                </span>
                <span>{readTime}m read</span>
              </div>

              {/* Subtle Metrics (Strict Monochrome, Right-aligned) */}
              {(likes || reposts || replies) ? (
                <div className="flex items-center gap-3">
                  {likes ? (
                    <div className="flex items-center gap-1 group/metric">
                      <Heart size={10} className="text-zinc-400 group-hover/metric:text-zinc-900 dark:group-hover/metric:text-zinc-200 transition-colors" />
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 tabular-nums">{formatMetric(likes)}</span>
                    </div>
                  ) : null}
                  {reposts ? (
                    <div className="flex items-center gap-1 group/metric">
                      <Repeat size={10} className="text-zinc-400 group-hover/metric:text-zinc-900 dark:group-hover/metric:text-zinc-200 transition-colors" />
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 tabular-nums">{formatMetric(reposts)}</span>
                    </div>
                  ) : null}
                  {replies ? (
                    <div className="flex items-center gap-1 group/metric">
                      <MessageCircle size={10} className="text-zinc-400 group-hover/metric:text-zinc-900 dark:group-hover/metric:text-zinc-200 transition-colors" />
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 tabular-nums">{formatMetric(replies)}</span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </Link>

        {/* Share button */}
        {onShare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(articleRaw);
            }}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 dark:bg-zinc-800/90 border border-zinc-100 dark:border-zinc-700 shadow-sm opacity-0 group-hover/card:opacity-100 transition-opacity active:scale-90 pointer-events-auto"
            aria-label="Share"
          >
            <Share2 size={14} className="text-zinc-500 dark:text-zinc-400" />
          </button>
        )}

        {/* Reading progress bar */}
        {progress > 0.05 && (
          <div className="mt-2 w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progress >= 0.95 ? "bg-emerald-400" : "bg-gradient-to-r from-blue-400 to-blue-500"}`}
              style={{ width: `${Math.min(Math.round(progress * 100), 100)}%` }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
});

SwipeableArticleCard.displayName = "SwipeableArticleCard";
