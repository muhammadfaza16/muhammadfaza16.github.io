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
        title: "Teman Sunyi",
        description: "Melodi pelan buat nemenin malam-malam tanpa tidur di bawah bintang.",
        philosophy: "Dalam sunyinya malam, kadang kita ktemu jawaban yang nggak bisa didengar pas siangnya lagi berisik.",
        schedule: "11 PM - 3 AM",
        vibes: ["Melancholic", "Space", "Introspective"],
        coverColor: "#1e3a8a", // Deep Blue
        coverImage: "/images/playlists/playlist_teman_sunyi_final.webp",
        songTitles: [
            "Cigarettes After Sex — Apocalypse",
            "Cigarettes After Sex — Cry",
            "Beach House — Space Song",
            "Coldplay — Hymn For The Weekend",
            "Lord Huron — The Night We Met",
            "Joji — Glimpse of Us",
            "Mac DeMarco — Chamber Of Reflection",
            "Sombr — Back to Friends",
            "d4vd — Romantic Homicide",
            "Yot Club — YKWIM?",
            "Arctic Monkeys — I Wanna Be Yours"
        ]
    },
    {
        id: "line-up-inti",
        title: "Line Up Inti",
        description: "Campuran lagu-lagu epik yang bakal naikin adrenalin dan ngisi energi jiwa.",
        philosophy: "Soundtrack buat momen-momen main character kamu. Energi yang bikin bintang tetep bersinar.",
        schedule: "Anytime",
        vibes: ["Epic", "Main Character", "Energy"],
        coverColor: "#7c3aed", // Violet
        coverImage: "/images/playlists/playlist_line_up_inti_final.webp",
        songTitles: [
            "Alan Walker — Faded",
            "Alan Walker — Darkside",
            "Imagine Dragons — Believer",
            "The Chainsmokers — Closer",
            "Martin Garrix & Bebe Rexha — In The Name Of Love",
            "One Direction — Story of My Life",
            "Bruno Mars — Locked Out Of Heaven",
            "Justin Bieber — Ghost",
            "Ed Sheeran — Perfect",
            "James Arthur — Rewrite The Stars",
            "The Script — Hall Of Fame"
        ]
    },
    {
        id: "menunggu-pagi",
        title: "Menunggu Pagi",
        description: "Mulai harimu ditemenin sama lagu-lagu hangat layaknya matahari terbit.",
        philosophy: "Setiap sunrise itu kayak undangan buatikin harinya seseorang jadi lebih cerah.",
        schedule: "5 AM - 9 AM",
        vibes: ["Hopeful", "Morning", "Pop"],
        coverColor: "#f59e0b", // Amber/Gold
        coverImage: "/images/playlists/playlist_menunggu_pagi_final.webp",
        songTitles: [
            "Surfaces — Sunday Best",
            "Harry Styles — As It Was",
            "Lauv — I Like Me Better",
            "Pamungkas — To The Bone",
            "Tulus — Hati-Hati di Jalan",
            "Bruno Mars — The Lazy Song",
            "Maroon 5 — Sugar",
            "Pharrell Williams — Happy",
            "American Authors — Best Day of My Life",
            "Coldplay — Viva La Vida"
        ]
    },
    {
        id: "tentang-dia",
        title: "Tentang Dia",
        description: "Gema kenangan lama sama perasaan kangen pengen pulang.",
        philosophy: "Kenangan itu cara kita megang erat hal-hal yang kita cinta, tentang siapa kita, dan hal yang nggak pengen kita lepasin.",
        schedule: "Late Night / Rainy",
        vibes: ["Nostalgic", "Love", "Acoustic"],
        coverColor: "#be185d", // Pink/Rose
        coverImage: "/images/playlists/playlist_tentang_dia_final.webp",
        songTitles: [
            "Lewis Capaldi — Someone You Loved",
            "Olivia Rodrigo — Happier",
            "Conan Gray — Memories",
            "James Arthur — Impossible",
            "NaFF — Terendap Laraku",
            "Sheila On 7 — Dan",
            "Kerispatih — Tapi Bukan Aku",
            "The Script — The Man Who...",
            "Lewis Capaldi — Before You Go",
            "Harry Styles — Sign of the Times"
        ]
    }
];
