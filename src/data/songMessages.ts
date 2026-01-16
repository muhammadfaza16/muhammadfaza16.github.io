// Song-specific messages — Flamboyant, Masculine, Mature, English Only.
// Tone: Confident, charming, assertive but not needy. "Main character" energy.

export const SONG_MESSAGES: Record<string, { playing: string[]; paused: string[] }> = {
    "The Script — The Man Who Can't Be Moved": {
        playing: [
            "I know what I want. It's you.",
            "Unshakeable. That's how I feel.",
            "Not going anywhere. I'm solid.",
        ],
        paused: [
            "Persistence is key.",
            "You know where to find me.",
        ],
    },
    "Alan Walker & Ava Max — Alone, Pt. II": {
        playing: [
            "We're a power move together.",
            "Better when you're in the picture.",
            "Unstoppable duo energy.",
        ],
        paused: [
            "Solo is good. We are better.",
            "Let's elevate this.",
        ],
    },
    "Alan Walker — Faded": {
        playing: [
            "You linger on my mind.",
            "Unforgettable. That's you.",
            "Can't fade what's real.",
        ],
        paused: [
            "You made an impression.",
            "Thinking of you.",
        ],
    },
    "Alan Walker, K-391 & Emelie Hollow — Lily": {
        playing: [
            "I've got you covered.",
            "Safe with me. Always.",
            "Don't worry. I handle it.",
        ],
        paused: [
            "I'm your sanctuary.",
            "Lean on me.",
        ],
    },
    "Bruno Mars — Locked Out Of Heaven": {
        playing: [
            "You're my kind of high.",
            "Addicted to your energy.",
            "You got that golden touch.",
        ],
        paused: [
            "Pure ecstasy.",
            "You're a whole vibe.",
        ],
    },
    "Conan Gray — Memories": {
        playing: [
            "We made history with that one.",
            "Classics never die.",
            "You're my favorite chapter.",
        ],
        paused: [
            "Timeless.",
            "For the books.",
        ],
    },
    "Halsey — Without Me": {
        playing: [
            "You know I'm the upgrade.",
            "Irreplaceable. And you know it.",
            "I bring the value.",
        ],
        paused: [
            "Know your worth.",
            "I'm the one.",
        ],
    },
    "Hoobastank — The Reason": {
        playing: [
            "You inspire the best in me.",
            "Leveling up. Because of you.",
            "I'm better. You're the reason.",
        ],
        paused: [
            "Growth mindset.",
            "My motivation.",
        ],
    },
    "James Arthur — Impossible": {
        playing: [
            "Challenge accepted.",
            "I don't do easy. I do worth it.",
            "Whatever it takes.",
        ],
        paused: [
            "Watch me make it happen.",
            "All in.",
        ],
    },
    "John Newman — Love Me Again": {
        playing: [
            "Ready for round two?",
            "Undeniable connection.",
            "We're not done yet.",
        ],
        paused: [
            "Let's run it back.",
            "You know you want to.",
        ],
    },
    "Loreen — Tattoo": {
        playing: [
            "I've left my mark.",
            "Inked in your mind.",
            "Permanent residence in my head.",
        ],
        paused: [
            "Unforgettable.",
            "I'm staying.",
        ],
    },
};

// Helper function to get a message for a song by index (for rotation)
export function getSongMessage(songTitle: string, isPlaying: boolean, index: number = 0): string {
    const messages = SONG_MESSAGES[songTitle];
    if (!messages) {
        return isPlaying ? "This one's for you." : "Play this.";
    }
    const pool = isPlaying ? messages.playing : messages.paused;
    return pool[index % pool.length];
}
