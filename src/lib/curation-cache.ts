/**
 * Global Curation Cache (Singleton)
 * 
 * Provides an in-memory storage for curation articles and counts.
 * This ensures that navigating between Home, Discover, and Library
 * is "instant" if the data has been loaded previously in the same session.
 */

type CacheEntry = {
    articles: any[];
    totalCount: number;
    nextCursor: string | null;
    timestamp: number;
};

class GlobalCurationCache {
    private static instance: GlobalCurationCache;
    private cache: Record<string, CacheEntry> = {};

    private constructor() {}

    public static getInstance(): GlobalCurationCache {
        if (!GlobalCurationCache.instance) {
            GlobalCurationCache.instance = new GlobalCurationCache();
        }
        return GlobalCurationCache.instance;
    }

    /**
     * Get data from cache
     * @param key Unique key for the query/filter/sort combination
     * @param ttl Time to live in milliseconds (default 5 minutes)
     */
    public get(key: string, ttl: number = 300000): CacheEntry | null {
        const entry = this.cache[key];
        if (!entry) return null;

        // Optional: Check if entry is stale
        if (Date.now() - entry.timestamp > ttl) {
            // We can return it but also trigger a refresh in the component
            return entry; 
        }

        return entry;
    }

    /**
     * Set data into cache
     */
    public set(key: string, articles: any[], totalCount: number, nextCursor: string | null = null): void {
        this.cache[key] = {
            articles,
            totalCount,
            nextCursor,
            timestamp: Date.now(),
        };
    }

    /**
     * Clear specific key or entire cache
     */
    public clear(key?: string): void {
        if (key) {
            delete this.cache[key];
        } else {
            this.cache = {};
        }
    }
}

export const curationCache = GlobalCurationCache.getInstance();
