// Song-specific messages - mature, implicit, confident tone
// Speaking to crush but not needy - subtle flirting

export const SONG_MESSAGES: Record<string, { playing: string[]; paused: string[] }> = {
    "The Script — The Man Who Can't Be Moved": {
        playing: [
            "Still here. You know where to find me.",
            "Aku tau kamu balik.",
            "Same spot. Same me.",
        ],
        paused: [
            "Play this when you're ready.",
            "You know this one.",
        ],
    },
    "Alan Walker & Ava Max — Alone, Pt. II": {
        playing: [
            "Better with you around.",
            "Lebih seru kalau ada kamu.",
            "We're not meant to be solo.",
        ],
        paused: [
            "This one hits different together.",
            "Ada vibe buat kita.",
        ],
    },
    "Alan Walker — Faded": {
        playing: [
            "Thinking about you. Again.",
            "Kamu di pikiran terus.",
            "Can't shake this feeling.",
        ],
        paused: [
            "Mood: missing someone.",
            "You already know who.",
        ],
    },
    "Alan Walker, K-391 & Emelie Hollow — Lily": {
        playing: [
            "I got you.",
            "Aman sama aku.",
            "Nothing to worry about.",
        ],
        paused: [
            "The protective type beat.",
            "Main kalau butuh tenang.",
        ],
    },
    "Bruno Mars — Locked Out Of Heaven": {
        playing: [
            "You do something to me.",
            "Efek kamu tuh beda.",
            "Heaven looks like you.",
        ],
        paused: [
            "This one's about that feeling.",
            "Play kalau mau melayang.",
        ],
    },
    "Conan Gray — Memories": {
        playing: [
            "Some things don't fade.",
            "Masih inget semuanya.",
            "Good times stay with us.",
        ],
        paused: [
            "Throwback energy.",
            "Buat kenang-kenangan.",
        ],
    },
    "Halsey — Without Me": {
        playing: [
            "You'll figure it out.",
            "Take your time.",
            "I know my worth.",
        ],
        paused: [
            "The confident one.",
            "Play kalau kamu mikir.",
        ],
    },
    "Hoobastank — The Reason": {
        playing: [
            "You make me want to be better.",
            "Karena kamu, aku usaha.",
            "Changed for the right reasons.",
        ],
        paused: [
            "Growth era type beat.",
            "Play kalau kamu percaya.",
        ],
    },
    "James Arthur — Impossible": {
        playing: [
            "Worth the effort.",
            "Susah bukan berarti mustahil.",
            "I don't give up easy.",
        ],
        paused: [
            "The persistent type.",
            "Play kalau butuh semangat.",
        ],
    },
    "John Newman — Love Me Again": {
        playing: [
            "Second chances exist.",
            "Masih bisa diperbaiki.",
            "Ready when you are.",
        ],
        paused: [
            "Fresh start energy.",
            "Kalau mau coba lagi.",
        ],
    },
    "Loreen — Tattoo": {
        playing: [
            "Stuck with me.",
            "Susah dilupain.",
            "Permanent in the best way.",
        ],
        paused: [
            "The unforgettable one.",
            "You wouldn't forget anyway.",
        ],
    },
};

// Helper function to get a random message for a song
export function getSongMessage(songTitle: string, isPlaying: boolean): string {
    const messages = SONG_MESSAGES[songTitle];
    if (!messages) {
        return isPlaying ? "This one's for you." : "Play this.";
    }
    const pool = isPlaying ? messages.playing : messages.paused;
    return pool[Math.floor(Math.random() * pool.length)];
}
