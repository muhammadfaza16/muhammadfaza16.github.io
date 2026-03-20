import React, { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { 
  FileText, 
  ChevronRight, 
  MessageCircle, 
  Repeat, 
  Heart, 
  Bookmark, 
  CheckCheck,
  CheckCircle,
  Share2
} from "lucide-react";
import { formatTitle, formatMetric } from "@/lib/utils";

// ─── Helpers ───

export function getReadTime(content?: string): number {
  if (!content) return 5;
  const text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 225));
}

export function getTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

// ─── Components ───

interface ArticleRowProps {
  article: any;
  index: number;
  isRead?: boolean;
  isBookmarked?: boolean;
  showRank?: boolean;
  showTime?: boolean;
  onRemove?: (id: string) => void;
  historyTimestamp?: number;
}

export const ArticleRow = memo(({
  article,
  index,
  isRead,
  isBookmarked,
  showRank,
  showTime,
  onRemove,
  historyTimestamp
}: ArticleRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.4) }}
      className="group relative"
    >
      <Link
        href={`/curation/${article.id}`}
        className={`group flex items-center gap-2.5 py-2 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 transition-colors ${isRead ? "opacity-60" : ""} ${onRemove ? "pr-8" : "pr-2"}`}
      >
        {showRank && (
          <span className="text-[15px] font-bold text-zinc-200 dark:text-zinc-800 w-5 text-center shrink-0 tabular-nums">
            {index + 1}
          </span>
        )}
        <div className="w-10 h-10 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800/80 shrink-0 relative">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              <FileText size={14} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
            {formatTitle(article.title)}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-zinc-400">
              {article.category || "General"}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
            <span className="text-[10px] text-zinc-400">
              {getReadTime(article.content)} min
            </span>

            {showTime && historyTimestamp && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                <span className="text-[10px] text-zinc-400">
                  {getTimeAgo(historyTimestamp)}
                </span>
              </>
            )}

            {(article.likes || article.reposts || article.replies) && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                <div className="flex items-center gap-2">
                  {article.replies > 0 && (
                    <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                      <MessageCircle size={8} className="text-zinc-400" />
                      {formatMetric(article.replies)}
                    </span>
                  )}
                  {article.reposts > 0 && (
                    <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                      <Repeat size={8} className="text-zinc-400" />
                      {formatMetric(article.reposts)}
                    </span>
                  )}
                  {article.likes > 0 && (
                    <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                      <Heart size={8} className="text-zinc-400" />
                      {formatMetric(article.likes)}
                    </span>
                  )}
                </div>
              </>
            )}

            {isBookmarked && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                <span className="text-[10px] text-blue-500 flex items-center gap-0.5 font-medium">
                  <Bookmark size={9} className="fill-blue-500/20" />
                  saved
                </span>
              </>
            )}
            {isRead && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700 text-[7px]">·</span>
                <span className="text-[10px] text-emerald-500 flex items-center gap-0.5 font-medium">
                  <CheckCheck size={9} />
                  read
                </span>
              </>
            )}
          </div>
        </div>
        <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-700 shrink-0" />
      </Link>

      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(article.id);
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
          title="Remove from history"
        >
          <ChevronRight size={14} className="rotate-90" />
        </button>
      )}
    </motion.div>
  );
});

ArticleRow.displayName = "ArticleRow";

export const SkeletonRow = memo(({ n = 1 }: { n?: number }) => (
  <>
    {Array(n).fill(0).map((_, i) => (
      <div key={i} className="flex items-center gap-2.5 py-2">
        <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-3/4" />
          <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-1/2" />
        </div>
      </div>
    ))}
  </>
));

SkeletonRow.displayName = "SkeletonRow";

export const SectionLabel = memo(({ 
  children, 
  color = "blue" 
}: { 
  children: React.ReactNode, 
  color?: "blue" | "emerald" | "zinc" 
}) => (
  <div className="flex items-center gap-2 mb-3">
    <div className={`w-[3px] h-3 rounded-full ${
      color === "blue" ? "bg-blue-500" : 
      color === "emerald" ? "bg-emerald-500" : 
      "bg-zinc-400"
    }`} />
    <h2 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-[0.2em]">
      {children}
    </h2>
  </div>
));

SectionLabel.displayName = "SectionLabel";

// ─── Swipeable Article Card (Home specific) ───

export interface SwipeableArticleCardProps {
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
    onShare?: (article: any) => void;
    articleRaw: any;
}

export const SwipeableArticleCard = memo(({
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
        const swipeThreshold = 80;
        if (info.offset.x > swipeThreshold) {
            onRead(id);
        } else if (info.offset.x < -swipeThreshold) {
            onBookmark(id);
        }
    };

    return (
        <div className="relative group/card touch-pan-y">
            <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden">
                <motion.div
                    className={`absolute inset-y-0 left-0 w-1/2 flex items-center pl-6 font-bold text-white shadow-inner ${isVisitorRead ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ opacity: bgRightOpacity }}
                >
                    <motion.div style={{ scale: scaleRightIcon }} className="flex items-center gap-2 drop-shadow-md">
                        <CheckCircle size={22} />
                        <span className="text-sm tracking-wide">{isVisitorRead ? "Undo" : "Done"}</span>
                    </motion.div>
                </motion.div>
                <motion.div
                    className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-end pr-6 font-bold text-white bg-blue-500 shadow-inner"
                    style={{ opacity: bgLeftOpacity }}
                >
                    <motion.div style={{ scale: scaleLeftIcon }} className="flex items-center gap-2 drop-shadow-md">
                        <span className="text-sm tracking-wide">{isVisitorBookmarked ? "Remove" : "Save"}</span>
                        <Bookmark fill={isVisitorBookmarked ? "none" : "white"} size={22} className={isVisitorBookmarked ? "" : "fill-white"} />
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                style={{ x }}
                whileTap={{ cursor: "grabbing" }}
                className="bg-white dark:bg-[#0a0a0a] rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800/60 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-500 p-4 relative z-10 cursor-grab touch-pan-y"
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
                    {isNavigating && <div className="absolute inset-0 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-[2px] z-50 animate-pulse rounded-xl" style={{ margin: "-8px", padding: "8px" }} />}
                    <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 shrink-0 border border-zinc-100/60 dark:border-zinc-700/60 relative pointer-events-none">
                        {validImageUrl && !imgError ? (
                            <Image src={validImageUrl} alt="" fill sizes="80px" draggable={false} className="object-cover" onError={() => onImgError(prev => ({ ...prev, [id]: true }))} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-200 dark:text-zinc-700 bg-gradient-to-br from-zinc-50 dark:from-zinc-800 to-zinc-100 dark:to-zinc-900">
                                <FileText size={22} strokeWidth={1.5} />
                            </div>
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 rounded-2xl" />
                    </div>
                    <div className="flex-1 min-w-0 py-0.5 pointer-events-none">
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                            {isVisitorRead ? (
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 px-1.5 py-[2px] rounded">READ</span>
                            ) : (Date.now() - postDate.getTime() <= 7 * 24 * 60 * 60 * 1000) ? (
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 px-1.5 py-[2px] rounded">NEW</span>
                            ) : null}
                            {typeof socialScore === 'number' && socialScore >= 1000 && (
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 px-1.5 py-[2px] rounded ml-1">⭐ TOP</span>
                            )}
                            {category && (
                                <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 truncate ml-1">{category}</span>
                            )}
                            {isVisitorBookmarked && (
                                <Bookmark size={11} className="fill-blue-500 text-blue-500 dark:fill-blue-400 dark:text-blue-400 ml-1" />
                            )}
                        </div>
                        <h3 className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.35] line-clamp-2 mb-1.5 group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">
                            {formatTitle(title)}
                        </h3>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                                <span>{postDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                <div className="w-[3px] h-[3px] rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                                <span>{getReadTime(articleRaw.content)}m read</span>
                            </div>
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
                {onShare && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onShare(articleRaw); }}
                        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 dark:bg-zinc-800/90 border border-zinc-100 dark:border-zinc-700 shadow-sm opacity-0 group-hover/card:opacity-100 transition-opacity active:scale-90 pointer-events-auto"
                    >
                        <Share2 size={14} className="text-zinc-500 dark:text-zinc-400" />
                    </button>
                )}
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
