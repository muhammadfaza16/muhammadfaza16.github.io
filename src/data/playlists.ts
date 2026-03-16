export interface Playlist {
    id: string;
    title: string;
    description: string;
    philosophy: string; // Deep quote or meaning
    schedule: string; // e.g. "Late Night", "Early Morning"
    vibes: string[]; // Tags
    coverColor: string; // Hex for accent
    coverImage: string;
    songTitles: string[]; // Map by title to avoid index issues if master list changes
}

export const PLAYLIST_CATEGORIES: Playlist[] = [
    {
        id: "teman-sunyi",
        title: "Western Classic",
        description: "Melodi pelan buat nemenin malam-malam tanpa tidur di bawah bintang.",
        philosophy: "Dalam sunyinya malam, kadang kita ktemu jawaban yang nggak bisa didengar pas siangnya lagi berisik.",
        schedule: "11 PM - 3 AM",
        vibes: ["Melancholic", "Space", "Introspective"],
        coverColor: "#1e3a8a", // Deep Blue
        coverImage: "/images/playlists/playlist_teman_sunyi_final.webp",
        songTitles: []
    },
    {
        id: "line-up-inti",
        title: "Alexandria",
        description: "Campuran lagu-lagu epik yang bakal naikin adrenalin dan ngisi energi jiwa.",
        philosophy: "Soundtrack buat momen-momen main character kamu. Energi yang bikin bintang tetep bersinar.",
        schedule: "Anytime",
        vibes: ["Epic", "Main Character", "Energy"],
        coverColor: "#7c3aed", // Violet
        coverImage: "/images/playlists/playlist_line_up_inti_final.webp",
        songTitles: []
    },
    {
        id: "menunggu-pagi",
        title: "Malay Josjis",
        description: "Mulai harimu ditemenin sama lagu-lagu hangat layaknya matahari terbit.",
        philosophy: "Setiap sunrise itu kayak undangan buatikin harinya seseorang jadi lebih cerah.",
        schedule: "5 AM - 9 AM",
        vibes: ["Hopeful", "Morning", "Pop"],
        coverColor: "#f59e0b", // Amber/Gold
        coverImage: "/images/playlists/playlist_menunggu_pagi_final.webp",
        songTitles: []
    },
    {
        id: "tentang-dia",
        title: "Nanteska",
        description: "Gema kenangan lama sama perasaan kangen pengen pulang.",
        philosophy: "Kenangan itu cara kita megang erat hal-hal yang kita cinta, tentang siapa kita, dan hal yang nggak pengen kita lepasin.",
        schedule: "Late Night / Rainy",
        vibes: ["Nostalgic", "Love", "Acoustic"],
        coverColor: "#be185d", // Pink/Rose
        coverImage: "/images/playlists/playlist_tentang_dia_final.webp",
        songTitles: []
    },
    {
        id: "indo-hits",
        title: "Indo Hits",
        description: "Koleksi lagu-lagu terbaik dari tanah air dan sekitarnya.",
        philosophy: "Nada-nada yang kental sama rasa bangga dan memori lokal.",
        schedule: "Relaxing",
        vibes: ["Indo", "Pop", "Local"],
        coverColor: "#991b1b", // Red
        coverImage: "/images/playlists/playlist_indo_hits.webp",
        songTitles: []
    },
    {
        id: "international-favorites",
        title: "International Favorites",
        description: "Top global tracks that define the current era.",
        philosophy: "Music is a universal language, connecting us across borders.",
        schedule: "Anytime",
        vibes: ["International", "Global", "Hits"],
        coverColor: "#1d4ed8", // Blue
        coverImage: "/images/playlists/playlist_international.webp",
        songTitles: []
    }
];

