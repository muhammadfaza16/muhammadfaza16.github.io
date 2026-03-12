"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
  Bookmark,
  FileText,
  Loader2,
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
} from "lucide-react";
import { formatTitle } from "@/lib/utils";
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
import { predictCategory } from "@/lib/scoring";
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
  { name: "AI & Tech", emoji: "🤖", desc: "Frameworks & future of computing" },
  { name: "Wealth & Business", emoji: "💰", desc: "Strategies for asymmetric scale" },
  { name: "Philosophy & Psychology", emoji: "🧠", desc: "Mental frames for clarity" },
  { name: "Productivity & Deep Work", emoji: "⚡", desc: "Systems for deep elite work" },
  { name: "Growth & Systems", emoji: "📈", desc: "Acquisition & compounding systems" },
];

const LABEL_CLASS =
  "text-[12px] font-bold uppercase tracking-wider text-zinc-500 ml-1";
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

const formatMetric = (count?: number): string => {
  if (!count) return "0";
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return count.toString();
};

// ─── Main Component ───

export default function CurationList() {
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
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [visitorState, setVisitorState] = useState<{
    read: Record<string, boolean>;
    bookmarked: Record<string, boolean>;
  }>({ read: {}, bookmarked: {} });
  const [isTopicsExpanded, setIsTopicsExpanded] = useState(false);
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

  // Live refs so IntersectionObserver always reads current values
  const sortByRef = useRef(sortBy);
  const sortOrderRef = useRef(sortOrder);
  const categoryFilterRef = useRef(categoryFilter);
  const searchQueryRef = useRef(debouncedSearchQuery);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const heroCarouselRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadingMoreRef = useRef(false);

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
                toast.success(`Category auto-filled: ${predicted}`);
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
          toast.success("Suggestion sent! It'll be reviewed shortly.");
          handleCloseSheet();
        } else {
          toast.error(json.error || "Failed to send suggestion");
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
            toast.success("Article updated");
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
            toast.success("Saved to Curation");
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

  // Data Fetching
  const fetchArticles = async (
    currentCursor: string | null,
    currentSortBy: SortBy,
    currentSortOrder: SortOrder,
    categories: string[],
    q: string,
    isLoadMore = false,
  ) => {
    // Cancel any in-flight request for non-loadMore fetches
    if (!isLoadMore && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    if (!isLoadMore) abortControllerRef.current = controller;

    // Track what we're fetching so isLoadMore can verify it's still relevant
    if (!isLoadMore) {
      lastFetchParamsRef.current = { sortBy: currentSortBy, sortOrder: currentSortOrder, cats: categories, q };
    }

    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
        isLoadingMoreRef.current = true;
      } else {
        // Only set loading if we don't have results yet (SWR style)
        if (articles.length === 0) setIsLoading(true);
      }

      let url = `/api/curation?limit=5&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`;
      if (categories.length > 0) {
        url += `&category=${encodeURIComponent(categories.join(","))}`;
      }
      if (q.trim()) {
        url += `&q=${encodeURIComponent(q.trim())}`;
      }
      if (currentCursor) url += `&cursor=${currentCursor}`;

      const res = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
      });
      const data = await res.json();

      // Guard: if filters changed while this loadMore was in-flight, discard the results
      if (isLoadMore) {
        const current = lastFetchParamsRef.current;
        if (
          current.sortBy !== currentSortBy ||
          current.sortOrder !== currentSortOrder ||
          current.q !== q ||
          JSON.stringify(current.cats) !== JSON.stringify(categories)
        ) {
          return; // stale loadMore — discard
        }
      }

      if (data.articles) {
        if (isLoadMore) {
          setArticles((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newUnique = data.articles.filter(
              (a: any) => !existingIds.has(a.id),
            );
            return [...prev, ...newUnique];
          });
        } else {
          setArticles(data.articles);
          // Store in cache
          const cacheKey = `${currentSortBy}_${currentSortOrder}_${categories.join(",")}_${q}`;
          fetchCacheRef.current[cacheKey] = data.articles;
        }
        setNextCursor(data.nextCursor);
        if (data.totalCount != null) setTotalCount(data.totalCount);
      }
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        console.error("Fetch failed:", error);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  };

  useEffect(() => {
    if (hasRestoredCache.current) {
      hasRestoredCache.current = false;
      // Don't return here! We want to proceed and trigger a background fetch (SWR pattern)
      // but we skip the "instant clear" below if we have restored data.
    }
    // Keep refs in sync so IntersectionObserver always reads current values
    sortByRef.current = sortBy;
    sortOrderRef.current = sortOrder;
    categoryFilterRef.current = categoryFilter;
    searchQueryRef.current = debouncedSearchQuery;

    // Simplified: No automatic scrolling or gimmicks. Persisting user coordinate naturally.
    if (mounted && !hasRestoredCache.current) {
        // We no longer force a scroll to resultsRef. 
        // This keeps the user at their current scroll position even when filters change.
    }

    const cacheKey = `${sortBy}_${sortOrder}_${categoryFilter.join(",")}_${debouncedSearchQuery}`;
    const cachedData = fetchCacheRef.current[cacheKey];

    if (cachedData) {
      setArticles(cachedData);
      setIsLoading(false);
    } else {
      // Clear articles and show skeleton for a fresh re-fetch
      setArticles([]);
      setIsLoading(true);
    }

    // Instant for sort/category, debounced by useDebounce for search
    fetchArticles(null, sortBy, sortOrder, categoryFilter, debouncedSearchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder, categoryFilter, debouncedSearchQuery, statusFilter]);

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

  // Infinite scroll using IntersectionObserver
  useEffect(() => {
    if (!nextCursor || isLoadingMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !isLoadingMoreRef.current) {
          // Read from refs to avoid stale closure values
          fetchArticles(nextCursor, sortByRef.current, sortOrderRef.current, categoryFilterRef.current, searchQueryRef.current, true);
        }
      },
      { root: scrollContainerRef.current, rootMargin: "600px" }
    );

    const currentLoadMore = loadMoreRef.current;
    if (currentLoadMore) {
      observer.observe(currentLoadMore);
    }

    return () => {
      if (currentLoadMore) observer.unobserve(currentLoadMore);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextCursor, sortBy, sortOrder, categoryFilter, debouncedSearchQuery]);

  // Visitor state actions
  const toggleVisitorRead = (articleId: string) => {
    const wasRead = !!visitorState.read[articleId];
    setVisitorState((prev) => {
      const updated = {
        ...prev,
        read: { ...prev.read, [articleId]: !prev.read[articleId] },
      };
      if (!updated.read[articleId]) delete updated.read[articleId];
      saveVisitorStateAsync(updated);
      return updated;
    });
    try {
      if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
    } catch { }
    toast.success(wasRead ? "Marked unread" : "Marked read");
  };

  const toggleVisitorBookmark = (articleId: string) => {
    const wasBookmarked = !!visitorState.bookmarked[articleId];
    setVisitorState((prev) => {
      const updated = {
        ...prev,
        bookmarked: {
          ...prev.bookmarked,
          [articleId]: !prev.bookmarked[articleId],
        },
      };
      if (!updated.bookmarked[articleId]) delete updated.bookmarked[articleId];
      saveVisitorStateAsync(updated);
      return updated;
    });
    try {
      if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
    } catch { }
    toast.success(wasBookmarked ? "Removed bookmark" : "Bookmarked!");
  };

  // Share handler
  const handleShareArticle = async (article: ArticleMeta) => {
    const shareUrl = `${window.location.origin}/curation/${article.id}`;
    const shareData = { title: article.title, url: shareUrl };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied!");
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied!");
      }
    }
  };

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
    }).catch(() => {});

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
    <div className="h-screen w-full flex flex-col bg-[#fafaf8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased overflow-hidden relative selection:bg-amber-100 dark:selection:bg-amber-900/30 transition-colors duration-500">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            borderRadius: "100px",
            fontSize: "14px",
            fontWeight: "600",
            padding: "12px 20px",
          },
          duration: 2500,
        }}
      />

      {/* ═══ MINIMAL HEADER ═══ */}
      <header className="sticky top-0 z-50 bg-[#fafaf8]/15 dark:bg-[#050505]/20 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 shrink-0 px-5 py-4 flex items-center justify-between transition-colors duration-500">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="flex items-center gap-2">
          <h2
            className="text-[16px] text-zinc-900 dark:text-zinc-100 italic font-medium leading-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Curated by Faza
          </h2>
          <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 text-[9px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase leading-none transform translate-y-[2px]">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all relative overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -24, opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                exit={{ y: 24, opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="absolute flex items-center justify-center"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
            </AnimatePresence>
          </button>
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (!isSearchOpen)
                setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-90 rounded-full transition-all"
          >
            {isSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
        </div>
      </header>

      {/* ═══ SEARCH BAR (expandable) ═══ */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-[#fafaf8]/15 dark:bg-[#050505]/20 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 px-5 z-40"
          >
            <div className="py-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-300"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 bg-white dark:bg-zinc-900/40 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 pl-10 pr-10 text-[14px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors flex items-center justify-center group"
                  >
                    <X
                      size={14}
                      strokeWidth={2.5}
                      className="opacity-70 group-hover:opacity-100"
                    />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SCROLLABLE CONTENT ═══ */}
      <div
        id="curation-scroll-container"
        ref={scrollContainerRef}
        onScroll={(e) => (scrollYRef.current = e.currentTarget.scrollTop)}
        className="flex-1 overflow-y-auto overflow-x-hidden pt-20 md:pt-24 pb-8 relative z-10 w-full max-w-2xl md:max-w-5xl mx-auto"
        style={
          {
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorY: "auto",
          } as React.CSSProperties
        }
      >
        {/* ═══ DASHBOARD INDEX (Consistently Visible) ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
            {/* Hero Zone */}
            <div className="mb-14 px-5">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative inline-block mb-8"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 blur-2xl rounded-full opacity-50 dark:opacity-30" />
                <h1
                  className="text-[44px] md:text-[56px] leading-[1.1] tracking-[-0.03em] text-zinc-900 dark:text-zinc-100 relative"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Curated Knowledge
                  <br />
                  <span
                    className="italic text-zinc-400/80 dark:text-zinc-500/80 font-serif font-light"
                  >
                    & Perspectives.
                  </span>
                </h1>
              </motion.div>
              
              <p className="text-[17px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[42ch]">
                The definitive index of high-signal frameworks, essays, and deep-dives — 
                <span className="text-zinc-900 dark:text-zinc-200 font-medium"> hand-picked for the modern mind.</span>
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-12 md:mt-16 flex-wrap">
                <span className="text-[12px] font-medium text-zinc-400 dark:text-zinc-500">
                  {totalCount > 0 ? `${totalCount} entries` : ""}{" "}
                  {categoryCount > 0 && totalCount > 0
                    ? `• ${categoryCount} topics`
                    : ""}
                </span>

                {weeklyReads > 0 && (
                  <Link
                    href="/curation/recap"
                    className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-full border border-orange-100 dark:border-orange-500/20 shadow-[0_2px_10px_-4px_rgba(234,88,12,0.3)] hover:shadow-md transition-all active:scale-95"
                  >
                    <span className="text-[13px] inline-block animate-[bounce_2s_infinite]">
                      🔥
                    </span>
                    <span className="text-[11px] font-bold tracking-wider uppercase">
                      {weeklyReads} Read{weeklyReads !== 1 && "s"} This Week
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* ═══ HERO CAROUSEL HEADER ═══ */}
            <div className="mb-6 px-5">
              <h2 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.25em] mb-1">
                YEARLY PICKS
              </h2>
              <p className="text-[14px] text-zinc-400/80 dark:text-zinc-500/80 font-medium">
                The most definitive insights and frameworks of the year.
              </p>
            </div>

            {/* ═══ HERO CAROUSEL (Top 5 Articles Globally) ═══ */}
            {(() => {
              if (isLoadingTop) {
                return (
                  <div className="mb-14 pl-5">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 pr-5">
                      {[1, 2, 3].map((skeleton) => (
                        <div key={skeleton} className="shrink-0 w-[85vw] md:w-[600px] h-[450px] bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse rounded-[2rem]" />
                      ))}
                    </div>
                  </div>
                )
              }

              if (topArticles.length === 0) return null;

              return (
                <div className="mb-14 pl-5">
                  <div
                    ref={heroCarouselRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar pb-6 snap-x snap-mandatory pr-5"
                  >
                    {topArticles.map((featuredArticle) => {
                      const postDate = new Date(featuredArticle.createdAt);
                      const readTime = estimateReadTime(featuredArticle.content);
                      const validImageUrl = getImageUrl(featuredArticle);
                      const rawSummary = aiData[featuredArticle.id]?.summary || featuredArticle.content || "";
                      const plainSummary = rawSummary.replace(/<[^>]+>/g, "").trim();

                      return (
                        <Link
                          key={featuredArticle.id}
                          href={`/curation/${featuredArticle.id}`}
                          onClick={() => {
                            setNavigatingId(featuredArticle.id);
                          }}
                          className="shrink-0 w-[85vw] md:w-[600px] snap-start group relative rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-[0.98] transition-all duration-400 flex flex-col"
                        >
                          {/* Top Image Section */}
                          <div className="relative w-full h-[240px] md:h-[280px] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
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
                            {/* Subtle Inner Shadow overlay on image */}
                            <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] z-10" />
                          </div>

                          {/* Bottom Content Section */}
                          <div className="p-6 md:p-8 flex flex-col relative z-20 h-full">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-[0.15em] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2 py-0.5 rounded-sm">
                                TOP PICK
                              </span>
                              {featuredArticle.category && (
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-600 dark:text-blue-400 ml-1">
                                  {featuredArticle.category}
                                </span>
                              )}
                            </div>

                            <h3
                              className="text-[24px] md:text-[28px] font-bold tracking-[-0.02em] text-zinc-900 dark:text-zinc-100 leading-[1.2] line-clamp-3 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                              style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                              }}
                            >
                              {formatTitle(featuredArticle.title)}
                            </h3>

                            {/* Only show summary if it exists to add more context */}
                            {plainSummary && (
                              <p className="text-[14px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-2">
                                {plainSummary}
                              </p>
                            )}
                            {!plainSummary && <div className="mb-2" />}

                            {/* Removed mt-auto so it doesn't push the date way far down if the card is tall */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2 text-[12px] font-medium text-zinc-400 dark:text-zinc-500">
                                <span>
                                  {postDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                <span className="text-zinc-200 dark:text-zinc-800">•</span>
                                <span>{readTime}m read</span>
                              </div>

                              {/* Hero Metrics (Monochrome, Right-aligned) */}
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

                          {/* Navigation overlay */}
                          {navigatingId === featuredArticle.id && (
                            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                              <div className="flex flex-col items-center gap-3">
                                <Loader2
                                  size={36}
                                  className="animate-spin text-zinc-800 dark:text-white"
                                />
                                <span className="text-zinc-800 dark:text-white text-xs font-bold tracking-widest uppercase">
                                  Opening
                                </span>
                              </div>
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ═══ CONTINUE READING ═══ */}
            {(() => {
              const inProgress = articles.filter((a) => {
                const pct = readingProgress[a.id];
                return pct && pct > 0.05 && pct < 0.95;
              });
              if (inProgress.length === 0) return null;
              return (
                <div className="mb-10 px-5">
                  <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4">
                    📖 Continue Reading
                  </h3>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {inProgress.map((article) => (
                      <Link
                        key={article.id}
                        href={`/curation/${article.id}`}
                        onClick={() => setNavigatingId(article.id)}
                        className="shrink-0 w-[220px] bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-3.5 active:scale-[0.97] transition-all hover:shadow-sm group"
                      >
                        <h4 className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {formatTitle(article.title)}
                        </h4>
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                            {Math.round(
                              (readingProgress[article.id] || 0) * 100,
                            )}
                            % read
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all"
                            style={{
                              width: `${Math.round((readingProgress[article.id] || 0) * 100)}%`,
                            }}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ═══ READING ROOM (Quick Access) ═══ */}
            <div className="px-5 mb-10">
              <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4">
                Reading Room
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Link
                  href="/curation/highlights"
                  onClick={() => setNavigatingId("highlights")}
                  className="flex flex-col p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm active:scale-[0.98] transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-transparent blur-xl rounded-bl-full pointer-events-none" />
                  <Highlighter size={20} className="text-yellow-500 mb-3" />
                  <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">Highlights</span>
                  <span className="text-[11px] text-zinc-500">Saved snippets</span>
                </Link>
                <Link
                  href="/curation/collections"
                  onClick={() => setNavigatingId("collections")}
                  className="flex flex-col p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm active:scale-[0.98] transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent blur-xl rounded-bl-full pointer-events-none" />
                  <Library size={20} className="text-blue-500 mb-3" />
                  <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">Collections</span>
                  <span className="text-[11px] text-zinc-500">Your folders</span>
                </Link>
              </div>
              <Link
                href="/curation/recap"
                onClick={() => setNavigatingId("recap")}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                    <Flame size={16} className="text-orange-500 dark:text-orange-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">Weekly Recap</span>
                    <span className="text-[11px] text-zinc-500">Your reading history</span>
                  </div>
                </div>
                <ChevronLeft size={16} className="text-zinc-400 dark:text-zinc-500 rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* ═══ LIBRARY SHELVES (Topics) ═══ */}
            <div className="px-5 mb-10">
              <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4 flex items-center gap-2">
                Library Shelves
                <div className="h-px bg-zinc-200/60 dark:bg-zinc-800/60 flex-1 ml-2" />
              </h3>

              <div>
                <div className="flex flex-col gap-3">
                  {CATEGORIES.slice(0, 3).map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryToggle(cat.name)}
                      className="flex items-center w-full p-3.5 bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[1.25rem] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm active:scale-[0.98] transition-colors text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200/50 dark:border-zinc-700/50 group-hover:scale-105 transition-transform">
                        <span className="text-2xl grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                          {cat.emoji}
                        </span>
                      </div>
                      <div className="ml-4 flex flex-col justify-center">
                        <span className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-1">
                          {cat.name}
                        </span>
                        <span className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-1">
                          {cat.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <AnimatePresence initial={false}>
                  {isTopicsExpanded && (
                    <motion.div
                      key="topics-expander"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.7, ease: [0.19, 1.0, 0.22, 1.0] },
                        opacity: { duration: 0.5 }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-3 pt-3">
                        {CATEGORIES.slice(3).map((cat) => (
                          <button
                            key={cat.name}
                            onClick={() => handleCategoryToggle(cat.name)}
                            className="flex items-center w-full p-3.5 bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[1.25rem] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm active:scale-[0.98] transition-colors text-left group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200/50 dark:border-zinc-700/50 group-hover:scale-105 transition-transform">
                              <span className="text-2xl grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                {cat.emoji}
                              </span>
                            </div>
                            <div className="ml-4 flex flex-col justify-center">
                              <span className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-1">
                                {cat.name}
                              </span>
                              <span className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-1">
                                {cat.desc}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setIsTopicsExpanded(!isTopicsExpanded)}
                  className="w-full mt-2 py-3.5 rounded-[1.25rem] border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 text-[13px] font-bold text-zinc-500 dark:text-zinc-400 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {isTopicsExpanded ? "Show Less" : "Explore All Topics"}
                  <ArrowDown
                    size={14}
                    className={`transition-transform duration-300 ${isTopicsExpanded ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

        {/* ═══ ARCHIVE LIST SECTION ═══ */}
        <div ref={resultsRef} className="flex items-end justify-between px-5 mb-2 mt-2 scroll-mt-24">
          <h3
            className="text-[20px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {debouncedSearchQuery
              ? "Search Results"
              : categoryFilter.length > 0
                ? `${categoryFilter.join(", ")}`
                : statusFilter !== "all"
                  ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Articles`
                  : "All Entries"}
          </h3>

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
                  className={`flex items-center gap-2 px-4 py-1.5 text-[12px] font-bold rounded-full transition-all whitespace-nowrap z-10 active:scale-95 ${isActive
                    ? "bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 bg-transparent"
                    }`}
                >
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
            { key: "bookmarked" as const, label: "Saved" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1.5 text-[12px] font-bold rounded-full transition-all active:scale-[0.96] whitespace-nowrap shrink-0 ${statusFilter === f.key
                ? "bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80"
                }`}
            >
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
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-full transition-all active:scale-[0.96] whitespace-nowrap shrink-0 border ${isActive
                            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm"
                            : "bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 border-zinc-200/60 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                            }`}
                    >
                        {isActive ? "✓" : cat.emoji} {cat.name}
                    </button>
                );
            })}
        </motion.div>

        {/* Separator Line (Almost Full Width) */}
        <div className="px-5 mb-5 mt-1">
          <div className="h-px bg-zinc-200/60 dark:bg-zinc-800/60 w-full" />
        </div>

        {/* ═══ ARTICLE FEED ═══ */}
        <div className="min-h-[100vh]">
          {isLoading ? (
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
          ) : filteredArticles.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 w-full"
            >
              <FileText
                size={44}
                className="mb-4 text-zinc-300 dark:text-zinc-700"
                strokeWidth={1.5}
              />
              <p className="text-base font-semibold tracking-tight text-zinc-400 dark:text-zinc-500">
                {debouncedSearchQuery
                  ? "No matching articles."
                  : "Nothing here yet."}
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

                // The article will render normally below the Hero Carousel.

                const postDate = new Date(article.createdAt);
                const readTime = estimateReadTime(article.content);
                const rawSummary = aiData[article.id]?.summary || article.content.substring(0, 160);
                const isVisitorRead = visitorState.read[article.id];
                const isVisitorBookmarked = visitorState.bookmarked[article.id];

                if (debouncedSearchQuery) {
                  // ═══ COMPACT SEARCH RESULT ROW ═══
                  const rawSummary =
                    (article as any).summary || article.content || "";
                  const plainSummary = rawSummary
                    .replace(/<[^>]+>/g, "")
                    .trim();

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
                      <Link
                        href={`/curation/${article.id}`}
                        onClick={() => setNavigatingId(article.id)}
                        className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-[0.98] transition-all group/row relative overflow-hidden"
                      >
                        {/* Left Thumbnail (Optional but nice) */}
                        {validImageUrl && !imgErrors[article.id] ? (
                          <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden relative bg-zinc-100 dark:bg-zinc-800">
                            <Image
                              src={validImageUrl}
                              alt=""
                              fill
                              sizes="96px"
                              className="object-cover opacity-90 group-hover/row:opacity-100 group-hover/row:scale-105 transition-all duration-500"
                              onError={() =>
                                setImgErrors((prev) => ({
                                  ...prev,
                                  [article.id]: true,
                                }))
                              }
                            />
                          </div>
                        ) : (
                          <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <FileText
                              size={24}
                              className="text-zinc-300 dark:text-zinc-700"
                            />
                          </div>
                        )}

                        {/* Right Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              {article.category && (
                                <>
                                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-600 dark:text-blue-400 shrink-0">
                                    {article.category}
                                  </span>
                                  <div className="w-[3px] h-[3px] rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                                </>
                              )}
                              <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
                                {postDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              <div className="w-[3px] h-[3px] rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                              <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
                                {readTime}m
                              </span>
                            </div>

                            {/* Search Result Metrics (Monochrome, Right-aligned) */}
                            {(article.likes || article.reposts || article.replies) ? (
                              <div className="flex items-center gap-2.5">
                                {article.likes ? (
                                  <div className="flex items-center gap-1 group/metric">
                                    <Heart size={9} className="text-zinc-400 group-hover/metric:text-zinc-900 dark:group-hover/metric:text-zinc-100 transition-colors" />
                                    <span className="text-[10px] text-zinc-400 tabular-nums">{formatMetric(article.likes)}</span>
                                  </div>
                                ) : null}
                                {article.reposts ? (
                                  <div className="flex items-center gap-1 group/metric">
                                    <Repeat size={9} className="text-zinc-400 group-hover/metric:text-zinc-900 dark:group-hover/metric:text-zinc-100 transition-colors" />
                                    <span className="text-[10px] text-zinc-400 tabular-nums">{formatMetric(article.reposts)}</span>
                                  </div>
                                ) : null}
                                {article.replies ? (
                                  <div className="flex items-center gap-1 group/metric">
                                    <MessageCircle size={9} className="text-zinc-400 group-hover/metric:text-zinc-900 dark:group-hover/metric:text-zinc-100 transition-colors" />
                                    <span className="text-[10px] text-zinc-400 tabular-nums">{formatMetric(article.replies)}</span>
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                          <h4 className="text-[15px] md:text-[17px] font-bold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2 mb-1 group-hover/row:text-blue-600 dark:group-hover/row:text-blue-400 transition-colors">
                            <HighlightText
                              text={formatTitle(article.title)}
                              query={searchQuery}
                            />
                          </h4>
                          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            <HighlightText
                              text={plainSummary}
                              query={searchQuery}
                            />
                          </p>
                        </div>

                        {navigatingId === article.id && (
                          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                            <Loader2
                              size={24}
                              className="animate-spin text-zinc-800 dark:text-white"
                            />
                          </div>
                        )}
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
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.04, 0.4),
                    }}
                  >
                    {/* ═══ SWIPEABLE ARTICLE CARD ═══ */}
                    <SwipeableArticleCard
                      article={article}
                      validImageUrl={validImageUrl}
                      postDate={postDate}
                      readTime={readTime}
                      isVisitorRead={!!isVisitorRead}
                      isVisitorBookmarked={!!isVisitorBookmarked}
                      imgError={!!imgErrors[article.id]}
                      onImgError={() =>
                        setImgErrors((prev) => ({
                          ...prev,
                          [article.id]: true,
                        }))
                      }
                      onClick={() => {
                        setNavigatingId(article.id);
                      }}
                      onSwipeRight={() => toggleVisitorRead(article.id)}
                      onSwipeLeft={() => toggleVisitorBookmark(article.id)}
                      isNavigating={navigatingId === article.id}
                      progress={readingProgress[article.id] || 0}
                      onShare={() => handleShareArticle(article)}
                    />
                  </motion.div>
                );
              })}

              {/* Load More Indicator */}
              {nextCursor && (
                <div ref={loadMoreRef} className="flex justify-center py-6 w-full h-20">
                  {isLoadingMore ? (
                    <Loader2 className="animate-spin text-zinc-400 w-5 h-5" />
                  ) : (
                    <div className="h-5" />
                  )}
                </div>
              )}

              {/* ═══ END OF FEED — SUGGEST CTA ═══ */}
              {!nextCursor && filteredArticles.length > 0 && (
                <div className="text-center py-10 space-y-4">
                  <span className="text-[11px] font-medium text-zinc-300 block">
                    You&apos;ve reached the end
                  </span>
                  {!isAdmin && (
                    <button
                      onClick={() => setIsSheetOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-500 text-[13px] font-semibold rounded-full border border-zinc-200/80 hover:border-zinc-300 hover:text-zinc-700 active:scale-[0.97] transition-all"
                    >
                      <Send size={14} />
                      Know something we should read? Suggest it.
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
            : "Suggest an Article"
        }
        footer={
          <button
            onClick={handleSave}
            disabled={isSubmitting || !formTitle || !formUrl}
            className="w-full h-14 bg-zinc-900 text-white rounded-full flex items-center justify-center appearance-none shrink-0 font-bold text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:active:scale-100"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>
                  {uploadStatus === "uploading" ? "Uploading…" : "Saving…"}
                </span>
              </div>
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
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className={LABEL_CLASS}>URL / Link</label>
            {isFetchingMetadata && (
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> Fetching…
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
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Article title"
            className="h-12 bg-zinc-50 rounded-xl border border-zinc-200/80 px-4 text-[14px] outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100 transition-all"
          />
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Published Date</label>
            <input
              type="date"
              value={formPublishedTime}
              onChange={(e) => setFormPublishedTime(e.target.value)}
              className="h-12 bg-zinc-50 rounded-xl border border-zinc-200/80 px-4 text-[14px] outline-none focus:border-zinc-300 appearance-none"
            />
          </div>
        )}

        {isAdmin && (
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={LABEL_CLASS}>Likes</label>
              <input
                type="number"
                value={formLikes || ""}
                onChange={(e) => setFormLikes(parseInt(e.target.value) || 0)}
                className="h-12 bg-zinc-50 rounded-xl border border-zinc-200/80 px-4 text-[14px] outline-none focus:border-zinc-300 transition-all font-mono"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL_CLASS}>Reposts</label>
              <input
                type="number"
                value={formReposts || ""}
                onChange={(e) => setFormReposts(parseInt(e.target.value) || 0)}
                className="h-12 bg-zinc-50 rounded-xl border border-zinc-200/80 px-4 text-[14px] outline-none focus:border-zinc-300 transition-all font-mono"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL_CLASS}>Replies</label>
              <input
                type="number"
                value={formReplies || ""}
                onChange={(e) => setFormReplies(parseInt(e.target.value) || 0)}
                className="h-12 bg-zinc-50 rounded-xl border border-zinc-200/80 px-4 text-[14px] outline-none focus:border-zinc-300 transition-all font-mono"
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
              className="h-12 bg-zinc-50 rounded-xl border border-zinc-200/80 px-4 text-[14px] outline-none focus:border-zinc-300 appearance-none"
            >
              <option value="">None</option>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className={LABEL_CLASS}>Content</label>
          <RichTextEditor
            value={formNotes}
            onChange={setFormNotes}
            placeholder={isAdmin ? "Add the article content here..." : "Why are you suggesting this?"}
          />
        </div>
      </BottomSheet>

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

function SwipeableArticleCard({
  article,
  validImageUrl,
  postDate,
  readTime,
  isVisitorRead,
  isVisitorBookmarked,
  imgError,
  onImgError,
  onClick,
  onSwipeRight,
  onSwipeLeft,
  isNavigating,
  progress = 0,
  onShare,
}: {
  article: ArticleMeta;
  validImageUrl: string | null;
  postDate: Date;
  readTime: number;
  isVisitorRead: boolean;
  isVisitorBookmarked: boolean;
  imgError: boolean;
  onImgError: () => void;
  onClick: () => void;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  isNavigating?: boolean;
  progress?: number;
  onShare?: () => void;
}) {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const bgRightOpacity = useTransform(x, [0, 60], [0, 1]);
  const bgLeftOpacity = useTransform(x, [0, -60], [0, 1]);
  const scaleRightIcon = useTransform(x, [20, 70], [0.5, 1.2]);
  const scaleLeftIcon = useTransform(x, [-20, -70], [0.5, 1.2]);

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const swipeThreshold = 80;
    if (info.offset.x > swipeThreshold) {
      onSwipeRight();
    } else if (info.offset.x < -swipeThreshold) {
      onSwipeLeft();
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
              {isVisitorRead ? "Unread" : "Read"}
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
        className="bg-white dark:bg-zinc-900 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-300 p-4 relative z-10 cursor-grab touch-pan-y"
      >
        <Link
          href={`/curation/${article.id}`}
          onClick={(e) => {
            if (isDragging) {
              e.preventDefault();
              e.stopPropagation();
            } else {
              onClick();
            }
          }}
          className="flex items-center gap-4 outline-none w-full relative"
          draggable={false}
        >
          {isNavigating && (
            <div
              className="absolute inset-0 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-xl"
              style={{ margin: "-8px", padding: "8px" }}
            >
              <Loader2
                size={24}
                className="animate-spin text-blue-600 dark:text-blue-400"
              />
            </div>
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
                onError={onImgError}
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
              {typeof article.socialScore === 'number' && article.socialScore >= 1000 && (
                <>
                  <div className="w-[3px] h-[3px] rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 px-1.5 py-[2px] rounded">
                    ⭐ TOP
                  </span>
                </>
              )}
              {article.category && (
                <>
                  <div className="w-[3px] h-[3px] rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 truncate">
                    {article.category}
                  </span>
                </>
              )}
              {isVisitorBookmarked && (
                <>
                  <div className="w-[3px] h-[3px] rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
                  <Bookmark
                    size={11}
                    className="fill-blue-500 text-blue-500 dark:fill-blue-400 dark:text-blue-400"
                  />
                </>
              )}
            </div>
            <h3 className="text-[15px] font-bold tracking-[-0.01em] text-zinc-900 dark:text-zinc-100 leading-[1.3] line-clamp-2 mb-1.5 group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">
              {formatTitle(article.title)}
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
                <div className="w-[3px] h-[3px] rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                <span>{readTime}m read</span>
              </div>

              {/* Subtle Metrics (Strict Monochrome, Right-aligned) */}
              {(article.likes || article.reposts || article.replies) ? (
                <div className="flex items-center gap-3">
                  {article.likes ? (
                    <div className="flex items-center gap-1 group/metric">
                      <Heart size={10} className="text-zinc-400 group-hover/metric:text-zinc-900 dark:group-hover/metric:text-zinc-200 transition-colors" />
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 tabular-nums">{formatMetric(article.likes)}</span>
                    </div>
                  ) : null}
                  {article.reposts ? (
                    <div className="flex items-center gap-1 group/metric">
                      <Repeat size={10} className="text-zinc-400 group-hover/metric:text-zinc-900 dark:group-hover/metric:text-zinc-200 transition-colors" />
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 tabular-nums">{formatMetric(article.reposts)}</span>
                    </div>
                  ) : null}
                  {article.replies ? (
                    <div className="flex items-center gap-1 group/metric">
                      <MessageCircle size={10} className="text-zinc-400 group-hover/metric:text-zinc-900 dark:group-hover/metric:text-zinc-200 transition-colors" />
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 tabular-nums">{formatMetric(article.replies)}</span>
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
              onShare();
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
}
