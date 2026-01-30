export type MoodCategory = "grateful" | "peaceful" | "energetic" | "melancholy" | "tired" | "mixed";

export interface JournalEntry {
    date: string;       // ISO Date "YYYY-MM-DD"
    note: string;       // User's reflection
    category: MoodCategory;
    timestamp: number;  // Last updated
    isTemplate?: boolean; // Demo data flag
}

export const MOOD_CONFIG: Record<MoodCategory, { label: string, color: string, desc: string }> = {
    grateful: { label: "Bersyukur", color: "#eda184", desc: "Hangat, penuh terima kasih" },
    peaceful: { label: "Tenang", color: "#9cafb7", desc: "Damai, seimbang" },
    energetic: { label: "Bersemangat", color: "#d2691e", desc: "Hidup, menyala" },
    melancholy: { label: "Sendu", color: "#b5a8b9", desc: "Rindu, hujan, diam" },
    tired: { label: "Lelah", color: "#cdc5bd", desc: "Butuh jeda" },
    mixed: { label: "Campur Aduk", color: "#e0c097", desc: "Tak terdefinisi" }
};
