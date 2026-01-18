// Dynamic Lyrics Engine (Time & Day Sensitive)
// Themes: Genuine Care, Friendly Wit, Supportive Presence
// TARGET: A close connection (The one who supports you)
// TONE: Playful yet Respectful. "Bestie vibes". Genuine & Safe.
// DICTION: "Aku-Kamu", friendly teasing, sincere appreciation.

export type LyricItem = { start: number; end: number; text: string; expressive?: boolean };

// === LYRIC BANK (The "Soul" System) ===

// === WEEKDAY MORNING (05:00 - 10:00) ===
// Context: Waking her up with love and energy.
// Tone: Admiration, cheerful teasing.
const BANK_WEEKDAY_MORNING = [
    [ // Flow 1: Morning Check-in
        { start: 10, end: 15, text: "Selamat pagi." },
        { start: 16, end: 20, text: "Matahari udah bangun, yuk jangan kalah saing." },
        { start: 45, end: 50, text: "Siap menghadapi dunia?" },
        { start: 51, end: 55, text: "Kasur emang posesif, aku ngerti kok." },
        { start: 90, end: 95, text: "Semoga hari ini baik sama kamu." },
        { start: 130, end: 135, text: "Semangat ya." }
    ],
    [ // Flow 2: Gentle Motivation
        { start: 15, end: 20, text: "Nyawanya belum kumpul ya?" },
        { start: 21, end: 25, text: "Pelan-pelan aja, nggak usah buru-buru." },
        { start: 60, end: 65, text: "Hari ini berat? Nanti kita cerita." },
        { start: 100, end: 105, text: "Kamu pasti bisa handle." },
        { start: 140, end: 145, text: "Minum air dulu, biar fokus." }
    ],
    [ // Flow 3: Priority Check
        { start: 12, end: 17, text: "Pengingat pagi:" },
        { start: 18, end: 22, text: "1. Fokus sama tujuan." },
        { start: 23, end: 27, text: "2. Jangan lupa senyum." },
        { start: 50, end: 55, text: "3. Sarapan itu wajib." },
        { start: 110, end: 115, text: "Sisanya urusan nanti." }
    ],
    [ // Flow 4: Encouragement
        { start: 10, end: 15, text: "Udah siap beraksi?" },
        { start: 16, end: 20, text: "Dunia butuh energi kamu." },
        { start: 45, end: 50, text: "Hati-hati di jalan nanti." },
        { start: 51, end: 55, text: "Take care." },
        { start: 90, end: 95, text: "Jaga kesehatan ya." }
    ]
];

// === WEEKDAY DAY (10:00 - 18:00) ===
// Context: Supporting her through the chaos.
// Tone: Protective, Distraction/Safe Space, Battery Charger.
const BANK_WEEKDAY_DAY = [
    [ // Flow 1: Supportive Presence
        { start: 15, end: 18, text: "Lagi pusing ya?" },
        { start: 19, end: 22, text: "Tarik napas panjang, kamu pasti bisa." },
        { start: 60, end: 63, text: "Dunia boleh brisik." },
        { start: 64, end: 67, text: "Tapi jangan lupa istirahat sejenak." },
        { start: 100, end: 103, text: "Pelan-pelan aja." }
    ],
    [ // Flow 2: Perspective Shift
        { start: 20, end: 23, text: "Banyak orang rese?" },
        { start: 24, end: 28, text: "Anggap aja mereka NPC error." },
        { start: 70, end: 73, text: "Jangan diambil hati." },
        { start: 74, end: 78, text: "Fokus sama apa yang bisa kamu kontrol." },
        { start: 120, end: 123, text: "Senyum dong, biar lebih enteng." }
    ],
    [ // Flow 3: Lunch Reminder
        { start: 10, end: 15, text: "Jangan lupa makan." },
        { start: 16, end: 20, text: "Kesehatan kamu itu investasi." },
        { start: 50, end: 55, text: "Nanti kalau sakit, repot loh." },
        { start: 90, end: 95, text: "Isi tenaga, biar fokus lagi." },
        { start: 130, end: 135, text: "Enjoy your meal." }
    ],
    [ // Flow 4: Appreciation
        { start: 15, end: 20, text: "Kamu keren banget sih." },
        { start: 55, end: 60, text: "Capek ya jadi handal terus?" },
        { start: 95, end: 100, text: "Istirahat bentar, minum kopi/teh." },
        { start: 140, end: 145, text: "Proud of you." }
    ]
];

// === WEEKDAY EVENING (18:00 - 22:00) ===
// Context: Welcoming her home. Physical/Emotional intimacy.
// Tone: "Home", Pampering, Undivided Attention.
const BANK_WEEKDAY_EVENING = [
    [ // Flow 1: Welcoming
        { start: 10, end: 15, text: "Akhirnya pulang." },
        { start: 40, end: 45, text: "Capeknya ditinggal di depan pintu aja." },
        { start: 46, end: 50, text: "Welcome home." },
        { start: 80, end: 85, text: "Silakan mode santai diaktifkan." },
        { start: 120, end: 125, text: "Gimana hari ini?" }
    ],
    [ // Flow 2: Authenticity
        { start: 15, end: 20, text: "Lepas topengnya." },
        { start: 21, end: 25, text: "Sekarang waktunya jadi diri sendiri." },
        { start: 60, end: 65, text: "Gapapa kalau mau sambat." },
        { start: 100, end: 105, text: "Aku dengerin kok." },
        { start: 140, end: 145, text: "You are safe here." }
    ],
    [ // Flow 3: Self Care
        { start: 15, end: 20, text: "Mandi gih, biar seger." },
        { start: 50, end: 55, text: "Terus pake baju paling nyaman." },
        { start: 56, end: 60, text: "Rebahan, rileks." },
        { start: 90, end: 95, text: "Kamu pantes dapet istirahat enak." },
        { start: 96, end: 100, text: "Good job hari ini." }
    ],
    [ // Flow 4: Disconnect
        { start: 20, end: 25, text: "Jangan main HP terus." },
        { start: 26, end: 30, text: "Istirahatin mata juga." },
        { start: 60, end: 65, text: "Dunia luar udah cukup ngambil waktu kamu." },
        { start: 100, end: 105, text: "Malam ini buat kamu istirahat." },
        { start: 130, end: 135, text: "Matikan notif, nikmati tenang." }
    ]
];

// === LATE NIGHT (22:00 - 05:00) ===
// Context: Deep intimacy, vulnerability, spiritual connection.
// Tone: Soft, Whispering, Eternal.
const BANK_LATE_NIGHT = [
    [ // Flow 1: Reflection
        { start: 15, end: 20, text: "Masih melek?" },
        { start: 21, end: 25, text: "Mikirin apa? Semoga yang baik-baik aja." },
        { start: 60, end: 65, text: "Langit gelap, tapi besok terang lagi." },
        { start: 66, end: 70, text: "Istirahat ya." },
        { start: 110, end: 115, text: "Semoga mimpi indah." }
    ],
    [ // Flow 2: Calm Down
        { start: 20, end: 25, text: "Overthinking lagi?" },
        { start: 60, end: 65, text: "Kamu cukup. Kamu lebih dari cukup." },
        { start: 100, end: 105, text: "Tarik napas, hembuskan." },
        { start: 140, end: 145, text: "Nggak usah dengerin isi kepala yang jahat." },
        { start: 146, end: 150, text: "Dengerin heningnya malam, damai kan?" }
    ],
    [ // Flow 3: Wish
        { start: 10, end: 15, text: "Aku harap kamu bahagia." },
        { start: 50, end: 55, text: "Bahagia yang bikin hati tenang." },
        { start: 90, end: 95, text: "Kamu berhak buat itu." },
        { start: 130, end: 135, text: "Tidur yang nyenyak ya." }
    ],
    [ // Flow 4: Night Peace
        { start: 15, end: 20, text: "Sunyi ya." },
        { start: 55, end: 60, text: "Enak buat melamun sebentar." },
        { start: 95, end: 100, text: "Rehatkan pikiranmu." },
        { start: 135, end: 140, text: "Good night." }
    ]
];

// === WEEKEND ===
const BANK_WEEKEND_MORNING = [
    [ // Flow 1: Lazy Vibes
        { start: 15, end: 20, text: "Jangan buru-buru bangun." },
        { start: 21, end: 25, text: "Matikan alarm, nikmati kasur." },
        { start: 60, end: 65, text: "Rebahan itu hak asasi pas weekend." },
        { start: 100, end: 105, text: "Enak kan?" },
        { start: 140, end: 145, text: "Selamat santai." }
    ],
    [ // Flow 2: Recharge
        { start: 15, end: 20, text: "Isi energi ya hari ini." },
        { start: 50, end: 55, text: "Lakuin hal yang bikin kamu happy." },
        { start: 90, end: 95, text: "Kamu pantes dapet waktu luang." },
        { start: 96, end: 100, text: "Selamat libur." }
    ]
];

const BANK_WEEKEND_DAY = [
    [ // Flow 1: Quality Time
        { start: 15, end: 20, text: "Mau kemana hari ini?" },
        { start: 50, end: 55, text: "Kemana aja asal kamu seneng." },
        { start: 90, end: 95, text: "Hati-hati di jalan ya." },
        { start: 130, end: 135, text: "Have fun!" }
    ],
    [ // Flow 2: Doing Nothing
        { start: 15, end: 20, text: "Nggak ngapa-ngapain itu seni." },
        { start: 21, end: 25, text: "Dan kamu senimannya." },
        { start: 60, end: 65, text: "Nikmatin waktu bebasmu." },
        { start: 100, end: 105, text: "You deserved it." }
    ]
];

const BANK_WEEKEND_EVENING = [
    [ // Flow 1: Sunday Check
        { start: 15, end: 20, text: "Besok Senin?" },
        { start: 50, end: 55, text: "Tenang, kamu pasti bisa." },
        { start: 90, end: 95, text: "Hadapi satu-satu." },
        { start: 130, end: 135, text: "Semangat ya." }
    ],
    [ // Flow 2: Recap
        { start: 15, end: 20, text: "Gimana weekend-nya?" },
        { start: 50, end: 55, text: "Semoga cukup buat ngobatin capekmu." },
        { start: 90, end: 95, text: "Tidur awal ya, biar besok seger." },
        { start: 130, end: 135, text: "Good night." }
    ]
];

// === HELPER FUNCTIONS ===

// Fixed Lyrics for "Faded" - Keeping original logic as requested by structure
const FADED_LYRICS = [
    { start: 18, end: 21, text: "Nyanyi bareng skuy..." },
    { start: 24.75, end: 27.5, text: "Wanna see us" },
    { start: 28.5, end: 30, text: "Alive" },
    { start: 31, end: 34, text: "Where are you now?" },
    { start: 36.3, end: 39.5, text: "Where are you now?" },
    { start: 41.5, end: 44.5, text: "Where are you now?" },
    { start: 44.7, end: 46, text: "Fantasy?" },
    { start: 47, end: 50, text: "Where are you now?" },
    { start: 49, end: 53, text: "Were you only imaginary?" },
    { start: 53.6, end: 56.5, text: "WHERE ARE YOU NOW?", expressive: true },
    { start: 57, end: 60, text: "Atlantis" },
    { start: 58, end: 59, text: "Under the sea" },
    { start: 61.7, end: 64, text: "Under the sea" },
    { start: 64.4, end: 67, text: "Where are you now?" },
    { start: 67, end: 70, text: "Another dream" },
    { start: 70.3, end: 71.2, text: "The monster" },
    { start: 71.3, end: 72, text: "running wild" },
    { start: 72.1, end: 73.6, text: "inside of me" },
    { start: 74.8, end: 75, text: "I'm fadeed" },
    { start: 79.8, end: 86, text: "I'm fadeed" },
    { start: 84, end: 85, text: "So lost" },
    { start: 90.1, end: 92.5, text: "I'm faded" },
    { start: 117.7, end: 120.6, text: "where are you now?" },
    { start: 151, end: 155, text: "WHERE ARE YOU NOW?", expressive: true },
    { start: 156, end: 158, text: "Dah... Maap berisik" },
];

function getDayType(day: number): 'WEEKDAY' | 'WEEKEND' {
    return (day === 0 || day === 6) ? 'WEEKEND' : 'WEEKDAY';
}

function getTimeSlot(hour: number): 'MORNING' | 'DAY' | 'EVENING' | 'LATE' {
    if (hour >= 5 && hour < 10) return 'MORNING';
    if (hour >= 10 && hour < 18) return 'DAY';
    if (hour >= 18 && hour < 22) return 'EVENING';
    return 'LATE';
}

function selectFlow(bank: LyricItem[][], songTitle: string): LyricItem[] {
    if (!bank || bank.length === 0) return [];

    // Simple pseudo-random selection that stays stable per load/session 
    // We could use songTitle hash to make it consistent per song if desired, 
    // but random is good for variety.
    const index = Math.floor(Math.random() * bank.length);
    return bank[index];
}

export function getDynamicLyrics(songTitle: string): LyricItem[] {
    // 1. Check Exception
    if (songTitle === "Alan Walker — Faded") {
        return FADED_LYRICS;
    }

    // 2. Determine Context
    const now = new Date();
    const dayType = getDayType(now.getDay());
    const timeSlot = getTimeSlot(now.getHours());

    // 3. Select Bank
    let targetBank: LyricItem[][] = [];

    if (dayType === 'WEEKDAY') {
        if (timeSlot === 'MORNING') targetBank = BANK_WEEKDAY_MORNING;
        else if (timeSlot === 'DAY') targetBank = BANK_WEEKDAY_DAY;
        else if (timeSlot === 'EVENING') targetBank = BANK_WEEKDAY_EVENING;
        else targetBank = BANK_LATE_NIGHT;
    } else { // WEEKEND
        if (timeSlot === 'MORNING') targetBank = BANK_WEEKEND_MORNING;
        else if (timeSlot === 'DAY') targetBank = BANK_WEEKEND_DAY;
        else if (timeSlot === 'EVENING') targetBank = BANK_WEEKEND_EVENING;
        else targetBank = BANK_LATE_NIGHT;
    }

    // 4. Return Random Flow from Bank
    return selectFlow(targetBank, songTitle);
}
