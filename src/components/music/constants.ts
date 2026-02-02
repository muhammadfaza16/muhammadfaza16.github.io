export const POKE_RESPONSES = [
    "Apa?", "Yo!", "Hadir!", "Sttt..",
    "Lagi asik", "Kenapa?", "Waduh", "Hehe",
    "Focus...", "Vibing~", "Ouch!", "Ticklish!"
];

export const WELCOME_MESSAGES = [
    "Hey... you made it.",
    "This isn't just a playlist.",
    "It's a collection of my thoughts.",
    "Ready to dive in?"
];

// Multi-Level Vibe Data (Song Title -> Timestamps with intensity levels)
// level 1 = build up (pre-chorus)
// level 2 = beat drop (main drop)
export const SONG_VIBES: Record<string, { start: number; end: number; level: 1 | 2 }[]> = {
    "Alan Walker — Faded": [
        { start: 31, end: 52, level: 1 },   // build up
        { start: 53, end: 92, level: 2 },  // beat drop
        // setelah 100, kembali normal
    ],
};

export function getCheckInMessages(hour: number): string[] {
    // 05:00 - 10:59 (Morning)
    if (hour >= 5 && hour < 11) {
        return [
            "Morning. Mimpi aku ga?",
            "Hope ur day is as pretty as u.",
            "Semangat hari ini, aku pantau dari jauh 👀",
            "Sending u good energy (and a kiss) ✨",
            "Jangan lupa sarapan, manis."
        ];
    }
    // 11:00 - 14:59 (Mid-day / Lunch)
    if (hour >= 11 && hour < 15) {
        return [
            "Makan siang gih, jangan telat.",
            "Hydrate! (Send pic?) 💧",
            "Thinking of u at lunch.",
            "Bored? Gabut? Chat aku.",
            "Coba senyum dikit dong :)"
        ];
    }
    // 15:00 - 18:59 (Afternoon)
    if (hour >= 15 && hour < 19) {
        return [
            "Capek ya? Semangat kerjanya.",
            "Udah sore, jangan lembur teuing.",
            "Counting down to seeing u.",
            "Need a break? Call me.",
            "Take a deep breath. You got this."
        ];
    }
    // 19:00 - 22:59 (Evening)
    if (hour >= 19 && hour < 23) {
        return [
            "Cerita dong hari ini ngapain aja.",
            "Proud of u today.",
            "Wish u were here.",
            "Rest well, you did great.",
            "Dunia lagi berisik? Sini peluk."
        ];
    }
    // 23:00 - 04:59 (Late Night)
    return [
        "Bobo yuk, udah malem.",
        "Dream of me? Jk... unless?",
        "Miss u. G'night.",
        "Matikan hp, mimpikan aku.",
        "Jangan begadang, ga baik buat rindu."
    ];
}

export function getMoods(hour: number): string[] {
    if (hour >= 5 && hour < 8) return ["lowkey missing u", "kangen dikit (banyak)", "woke up smiling"];
    if (hour >= 8 && hour < 11) return ["distracted by u", "nungguin chat kamu", "kerja rasa rindu"];
    if (hour >= 11 && hour < 14) return ["butuh asupan (kamu)", "halfway to seeing u", "makan siang bareng yuk?"];
    if (hour >= 14 && hour < 17) return ["daydreaming rn", "bengong mikirin kamu", "afternoon slump < u"];
    if (hour >= 17 && hour < 19) return ["golden hour < u", "pengen telponan", "finally free (for u)"];
    if (hour >= 19 && hour < 22) return ["lagi dengerin lagu kita", "scrolling tapi kangen", "winding down w/ u on my mind"];
    if (hour >= 22 || hour < 2) return ["up thinking about us", "belum bobo?", "moonchild missing sun"];
    return ["dreaming of u. shh.", "3am thoughts of u", "kenapa belum tidur? (mikirin u)"];
}
