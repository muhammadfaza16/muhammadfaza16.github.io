/**
 * Curation Super App — Shared Configuration
 *
 * Single source of truth for verticals, categories, and navigation.
 */

// ─── Verticals ───

export type VerticalKey = 'articles' | 'books' | 'skills' | 'frameworks' | 'codex';

export interface VerticalConfig {
  key: VerticalKey;
  label: string;
  href: string;
  description: string;
}

export const VERTICALS: readonly VerticalConfig[] = [
  {
    key: 'articles',
    label: 'Articles',
    href: '/curation',
    description: 'Insights & perspectives from curated sources',
  },
  {
    key: 'books',
    label: 'Books',
    href: '/curation/books',
    description: 'Digital bookshelf & personal reviews',
  },
  {
    key: 'skills',
    label: 'Skills Lab',
    href: '/curation/skills',
    description: 'Resources for skill acquisition & mastery',
  },
  {
    key: 'frameworks',
    label: 'Frameworks',
    href: '/curation/frameworks',
    description: 'Mental models & decision-making tools',
  },
  {
    key: 'codex',
    label: 'Codex',
    href: '/curation/codex',
    description: 'Principles, beliefs, & personal doctrine',
  },
] as const;

// ─── Categories (Unified across all verticals) ───

export interface CategoryConfig {
  name: string;
  desc: string;
}

export const CATEGORIES: readonly CategoryConfig[] = [
  { name: "AI & Tech", desc: "Blueprints for AI Agents and the future of computing" },
  { name: "Wealth & Business", desc: "Asymmetric scale strategies and capital allocation" },
  { name: "Philosophy & Psychology", desc: "Frameworks for clarity of thought amidst chaos" },
  { name: "Productivity & Deep Work", desc: "Elite workflow systems and energy optimization" },
  { name: "Growth & Systems", desc: "Guides for compounding systems and autopilot growth" },
] as const;

export const CATEGORY_NAMES = CATEGORIES.map(c => c.name);

// ─── Book Status Options ───

export type BookStatus = 'want-to-read' | 'reading' | 'finished' | 'abandoned';

export const BOOK_STATUSES: readonly { key: BookStatus; label: string }[] = [
  { key: 'want-to-read', label: 'Want to Read' },
  { key: 'reading', label: 'Reading' },
  { key: 'finished', label: 'Finished' },
  { key: 'abandoned', label: 'Dropped' },
] as const;

// ─── Course / Skills Lab ───

export type SourceType = 'blog' | 'thread' | 'tutorial' | 'documentation' | 'video' | 'other';

export const SOURCE_TYPES: readonly { key: SourceType; label: string }[] = [
  { key: 'blog', label: 'Blog Post' },
  { key: 'thread', label: 'Thread' },
  { key: 'tutorial', label: 'Tutorial' },
  { key: 'documentation', label: 'Documentation' },
  { key: 'video', label: 'Video' },
  { key: 'other', label: 'Other' },
] as const;

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export const DIFFICULTY_LEVELS: readonly { key: Difficulty; label: string; color: string }[] = [
  { key: 'beginner', label: 'Beginner', color: 'emerald' },
  { key: 'intermediate', label: 'Intermediate', color: 'amber' },
  { key: 'advanced', label: 'Advanced', color: 'rose' },
] as const;

// ─── Framework Types ───

export type FrameworkType = 'mental-model' | 'decision-framework' | 'playbook' | 'principle';

export const FRAMEWORK_TYPES: readonly { key: FrameworkType; label: string }[] = [
  { key: 'mental-model', label: 'Mental Model' },
  { key: 'decision-framework', label: 'Decision Framework' },
  { key: 'playbook', label: 'Playbook' },
  { key: 'principle', label: 'Principle' },
] as const;

// ─── Codex Status ───

export type CodexStatus = 'evolving' | 'solidified' | 'deprecated';

export const CODEX_STATUSES: readonly { key: CodexStatus; label: string }[] = [
  { key: 'evolving', label: 'Evolving' },
  { key: 'solidified', label: 'Solidified' },
  { key: 'deprecated', label: 'Deprecated' },
] as const;

// ─── Helpers ───

export function getVertical(key: VerticalKey): VerticalConfig | undefined {
  return VERTICALS.find(v => v.key === key);
}
