export type ConcertItem =
    | { type: 'song'; songTitle: string; customMessage?: string } // songTitle matches PLAYLIST title
    | { type: 'mc'; text: string[]; duration: number }; // Text interlude with duration in seconds

export type ConcertEvent = {
    id: string;
    title: string;
    description: string;
    posterUrl: string; // Path to image/component to render
    date: string; // YYYY-MM-DD
    window: {
        start: string; // HH:mm (24h)
        end: string;   // HH:mm (24h)
    };
    theme: {
        primary: string;
        secondary: string;
        accent: string;
    };
    setlist: ConcertItem[];
};

export const CONCERT_SCHEDULE: ConcertEvent[] = [
    {
        id: "concert-001",
        title: "Time Capsule: Warnet 2000an",
        description: "Sebuah perjalanan kembali ke masa di mana lirik lagu adalah status YM dan cinta terasa lebih sederhana.",
        posterUrl: "/images/concerts/warnet-2000s.jpg", // Placeholder
        date: "2026-01-24", // Tomorrow/Testing
        window: {
            start: "20:00",
            end: "23:59"
        },
        theme: {
            primary: "#1e293b", // Slate 800
            secondary: "#f59e0b", // Amber 500 (Warnet billing text color vibes)
            accent: "#10b981" // Emerald 500
        },
        setlist: [
            {
                type: 'mc',
                text: [
                    "Selamat datang di Time Capsule.",
                    "Malam ini kita mundur sedikit ke belakang.",
                    "Ke masa di mana galau itu dinikmati sambil nunggu billing habis."
                ],
                duration: 8
            },
            { type: 'song', songTitle: "Peterpan — Ku Katakan Dengan Indah" },
            {
                type: 'mc',
                text: [
                    "Energi yang sama, rasa yang beda.",
                    "Inget gak lagu ini sering diputer di radio?",
                    "Sekarang, lagu ini buat kamu."
                ],
                duration: 6
            },
            { type: 'song', songTitle: "Element — Rahasia Hati" },
            { type: 'song', songTitle: "Seventeen — Hal Terindah" },
            {
                type: 'mc',
                text: [
                    "Kadang yang terindah itu bukan yang dimiliki.",
                    "Tapi yang disyukuri keberadaannya.",
                    "Ya, kayak kamu."
                ],
                duration: 6
            },
            { type: 'song', songTitle: "Sheila On 7 — Sephia" },
            {
                type: 'mc',
                text: [
                    "Dan akhirnya...",
                    "Lagu pamungkas buat semua perasaan yang belum selesai.",
                    "Atau mungkin, yang sudah harus dilepaskan."
                ],
                duration: 7
            },
            { type: 'song', songTitle: "Sheila On 7 — Dan..." }
        ]
    },
    {
        id: "concert-002",
        title: "3 AM: Ceiling Staring Club",
        description: "Untuk pikiran-pikiran yang cuma berani keluar saat dunia tidur. Mode hening, hati bising.",
        posterUrl: "/images/concerts/void-purple.jpg",
        date: "2026-01-23", // Today
        window: {
            start: "00:00",
            end: "23:59" // All day "Live" for testing
        },
        theme: {
            primary: "#0f172a", // Slate 900
            secondary: "#312e81", // Indigo 900
            accent: "#818cf8" // Indigo 400
        },
        setlist: [
            {
                type: 'mc',
                text: [
                    "Selamat datang di jam-jam kecil.",
                    "Tempat di mana logika tidur, dan perasaan ambil alih.",
                    "Cuma kita dan langit-langit kamar."
                ],
                duration: 8
            },
            { type: 'song', songTitle: "Beach House — Space Song" },
            {
                type: 'mc',
                text: [
                    "Pernah ngerasa kangen sama sesuatu...",
                    "Tapi nggak tau itu apa?",
                    "Mungkin lagu ini jawabannya."
                ],
                duration: 7
            },
            { type: 'song', songTitle: "Cigarettes After Sex — Apocalypse" },
            { type: 'song', songTitle: "Joji — Glimpse of Us" },
            { type: 'song', songTitle: "Phoebe Bridgers — Scott Street" }
        ]
    },
    {
        id: "concert-003",
        title: "The 'Almost' Lovers",
        description: "Playlist untuk kita yang hampir jadi 'kita'. Perayaan kecil untuk rasa sayang yang tak punya judul.",
        posterUrl: "/images/concerts/coffee.jpg",
        date: "2026-01-22", // Yesterday (Ended)
        window: {
            start: "18:00",
            end: "21:00"
        },
        theme: {
            primary: "#451a03", // Amber 950
            secondary: "#78350f", // Amber 900
            accent: "#f59e0b" // Amber 500
        },
        setlist: [
            {
                type: 'mc',
                text: [
                    "Hampir.",
                    "Satu kata, ribuan skenario di kepala.",
                    "Malam ini kita rayain 'hampir' itu."
                ],
                duration: 6
            },
            { type: 'song', songTitle: "sombr — back to friends" },
            { type: 'song', songTitle: "NaFF — Terendap Laraku" },
            {
                type: 'mc',
                text: [
                    "Kalau bisa milih...",
                    "Mending jadi temen selamanya,",
                    "Atau pacar tapi ada tanggal kadaluarsanya?"
                ],
                duration: 7
            },
            { type: 'song', songTitle: "Gigi Perez — Sailor Song" }
        ]
    }
];
