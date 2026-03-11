import localforage from 'localforage';

export interface VisitorState {
    read: Record<string, boolean>;
    bookmarked: Record<string, boolean>;
}

export interface ReadEntry {
    id: string;
    timestamp: number;
}

// Initialize stores
const stateStore = localforage.createInstance({
    name: 'CurationApp',
    storeName: 'curation_state'
});

const historyStore = localforage.createInstance({
    name: 'CurationApp',
    storeName: 'curation_history'
});

const VISITOR_STATE_KEY = 'visitor_state';
const HISTORY_KEY = 'read_history';

// Migration flag to ensure we only migrate once per session/device
let hasMigrated = false;

/**
 * Migrates data from localStorage to IndexedDB if present.
 * This runs transparently before any read/write operations.
 */
async function ensureMigration() {
    if (hasMigrated) return;
    hasMigrated = true;

    if (typeof window === 'undefined') return;

    try {
        // 1. Migrate Visitor State
        const oldStateStr = localStorage.getItem('curation_visitor_state');
        if (oldStateStr) {
            const oldState = JSON.parse(oldStateStr);
            const existingDbState = await stateStore.getItem(VISITOR_STATE_KEY);
            // Only migrate if DB is empty to avoid overwriting newer DB data with old localStorage data
            if (!existingDbState) {
                await stateStore.setItem(VISITOR_STATE_KEY, oldState);
                console.log("[Storage] Migrated visitor state to IndexedDB");
            }
            // Optional: localStorage.removeItem('curation_visitor_state');
        }

        // 2. Migrate Read History
        const oldHistoryStr = localStorage.getItem('curation_read_history');
        if (oldHistoryStr) {
            const oldHistory = JSON.parse(oldHistoryStr);
            const existingDbHistory = await historyStore.getItem(HISTORY_KEY);
            if (!existingDbHistory) {
                await historyStore.setItem(HISTORY_KEY, oldHistory);
                console.log("[Storage] Migrated read history to IndexedDB");
            }
            // Optional: localStorage.removeItem('curation_read_history');
        }
    } catch (e) {
        console.error("[Storage] Migration failed", e);
    }
}

// --- Visitor State API ---

export async function getVisitorState(): Promise<VisitorState> {
    await ensureMigration();
    try {
        const state = await stateStore.getItem<VisitorState>(VISITOR_STATE_KEY);
        return state || { read: {}, bookmarked: {} };
    } catch {
        return { read: {}, bookmarked: {} };
    }
}

export async function saveVisitorStateAsync(state: VisitorState): Promise<void> {
    await ensureMigration();
    try {
        await stateStore.setItem(VISITOR_STATE_KEY, state);
    } catch (e) {
        console.error("Failed to save visitor state", e);
    }
}

export async function updateToReadArticleAsync(articleId: string): Promise<void> {
    await ensureMigration();
    try {
        const state = await getVisitorState();
        if (!state.read) state.read = {};
        state.read[articleId] = true;
        await stateStore.setItem(VISITOR_STATE_KEY, state);
    } catch (e) {
        console.error("Failed to mark article as read", e);
    }
}

export async function toggleBookmarkedArticleAsync(articleId: string): Promise<boolean> {
    await ensureMigration();
    try {
        const state = await getVisitorState();
        if (!state.bookmarked) state.bookmarked = {};
        
        const isBookmarked = !!state.bookmarked[articleId];
        if (isBookmarked) {
            delete state.bookmarked[articleId];
        } else {
            state.bookmarked[articleId] = true;
        }
        
        await stateStore.setItem(VISITOR_STATE_KEY, state);
        return !isBookmarked; // Return new status
    } catch (e) {
        console.error("Failed to toggle bookmark", e);
        return false;
    }
}

// --- History API ---

export async function getReadHistoryAsync(): Promise<ReadEntry[]> {
    await ensureMigration();
    try {
        const history = await historyStore.getItem<ReadEntry[]>(HISTORY_KEY);
        return history || [];
    } catch {
        return [];
    }
}

export async function appendToReadHistoryAsync(articleId: string): Promise<void> {
    await ensureMigration();
    try {
        const history = await getReadHistoryAsync();
        // Remove existing entry if present to push it to the top
        const filtered = history.filter(h => h.id !== articleId);
        filtered.unshift({ id: articleId, timestamp: Date.now() });
        
        // Keep it reasonable (e.g. max 1000 items)
        const capped = filtered.slice(0, 1000);
        await historyStore.setItem(HISTORY_KEY, capped);
    } catch (e) {
        console.error("Failed to append to history", e);
    }
}

export async function removeFromReadHistoryAsync(articleId: string): Promise<void> {
    await ensureMigration();
    try {
        const history = await getReadHistoryAsync();
        const filtered = history.filter(h => h.id !== articleId);
        await historyStore.setItem(HISTORY_KEY, filtered);
    } catch (e) {
        console.error("Failed to remove from history", e);
    }
}

// --- Collections API ---
const COLLECTIONS_KEY = 'curation_collections';
export interface Collection {
    id: string;
    name: string;
    description: string;
    articleIds: string[];
    createdAt: number;
}
export async function getCollectionsAsync(): Promise<Collection[]> {
    try { return (await stateStore.getItem<Collection[]>(COLLECTIONS_KEY)) || []; }
    catch { return []; }
}
export async function saveCollectionsAsync(collections: Collection[]): Promise<void> {
    try { await stateStore.setItem(COLLECTIONS_KEY, collections); } catch { }
}

// --- Highlights API ---
export interface Highlight { text: string; ts: number; }
export async function getHighlightsAsync(articleId: string): Promise<Highlight[]> {
    try { return (await stateStore.getItem<Highlight[]>(`highlights_${articleId}`)) || []; }
    catch { return []; }
}
export async function saveHighlightsAsync(articleId: string, highlights: Highlight[]): Promise<void> {
    try { await stateStore.setItem(`highlights_${articleId}`, highlights); } catch { }
}

// --- Reader Settings API ---
export interface ReaderSettings {
    theme: "system" | "dark" | "sepia" | "light";
    fontSize: number;
    typography: "sans" | "serif" | "mono"; // Future-proofing for Phase 2
}
export async function getReaderSettingsAsync(): Promise<ReaderSettings | null> {
    try { return (await stateStore.getItem<ReaderSettings>('reader_settings')) || null; }
    catch { return null; }
}
export async function saveReaderSettingsAsync(settings: ReaderSettings): Promise<void> {
    try { await stateStore.setItem('reader_settings', settings); } catch { }
}
