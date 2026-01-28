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
        description: "Melodies for the sleepless nights under the stars.",
        philosophy: "In the silence of the night, we find the answers we were too loud to hear during the day.",
        schedule: "11 PM - 3 AM",
        vibes: ["Melancholic", "Space", "Introspective"],
        coverColor: "#1e3a8a", // Deep Blue
        coverImage: "/images/playlists/playlist_teman_sunyi_final.png",
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
        description: "A cosmic mix of everything that moves the soul.",
        philosophy: "The soundtracks of our main character moments; the energy that drives the stars.",
        schedule: "Anytime",
        vibes: ["Epic", "Main Character", "Energy"],
        coverColor: "#7c3aed", // Violet
        coverImage: "/images/playlists/playlist_line_up_inti_final.png",
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
        description: "Start your day with a sunrise of sound.",
        philosophy: "Every sunrise is an invitation to brighten someone's day.",
        schedule: "5 AM - 9 AM",
        vibes: ["Hopeful", "Morning", "Pop"],
        coverColor: "#f59e0b", // Amber/Gold
        coverImage: "/images/playlists/playlist_menunggu_pagi_final.png",
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
        description: "Echoes of memory and the feeling of home.",
        philosophy: "Memory is a way of holding on to the things you love, the things you are, the things you never want to lose.",
        schedule: "Late Night / Rainy",
        vibes: ["Nostalgic", "Love", "Acoustic"],
        coverColor: "#be185d", // Pink/Rose
        coverImage: "/images/playlists/playlist_tentang_dia_final.png",
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
