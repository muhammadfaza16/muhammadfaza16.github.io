/**
 * Curation Super App — Shared TypeScript Types
 *
 * These types mirror the Prisma models but are safe for client-side use.
 * They use string dates instead of Date objects for JSON serialization.
 */

// ─── Articles (existing, unchanged) ───

export interface ArticleMeta {
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

// ─── Books ───

export interface BookEntry {
  id: string;
  title: string;
  author: string;
  status: string;
  rating: number;
  verdict: string | null;
  review: string | null;
  takeaways: string | null;
  category: string | null;
  imageUrl: string | null;
  url: string | null;
  finishedAt: string | null;
  createdAt: string;
}

// ─── Skills Lab (Course) ───

export interface SkillEntry {
  id: string;
  title: string;
  content: string | null;
  source: string | null;
  sourceType: string | null;
  category: string | null;
  difficulty: string | null;
  imageUrl: string | null;
  url: string | null;
  createdAt: string;
}

// ─── Frameworks ───

export interface FrameworkEntry {
  id: string;
  name: string;
  type: string;
  summary: string | null;
  content: string | null;
  source: string | null;
  whenToUse: string | null;
  category: string | null;
  imageUrl: string | null;
  createdAt: string;
}

// ─── Codex ───

export interface CodexEntry {
  id: string;
  title: string;
  domain: string | null;
  content: string | null;
  conviction: string | null;
  status: string;
  category: string | null;
  createdAt: string;
}

// ─── Generic API Response Shapes ───

export interface ListResponse<T> {
  items: T[];
  nextCursor: string | null;
  totalCount?: number;
}

export interface SingleResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MutationResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
