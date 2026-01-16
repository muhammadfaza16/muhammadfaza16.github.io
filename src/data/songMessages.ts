// Song-specific messages — Flamboyant, Masculine, Mature, English Only.
// Tone: Confident, charming, assertive but not needy. "Main character" energy.

export const SONG_MESSAGES: Record<string, { playing: string[]; paused: string[] }> = {
    "The Script — The Man Who Can't Be Moved": {
        playing: [
            "I know what I want. It's you.",
            "Unshakeable. That's how I feel.",
            "Not going anywhere. I'm solid.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Alan Walker & Ava Max — Alone, Pt. II": {
        playing: [
            "We're a power move together.",
            "Better when you're in the picture.",
            "Unstoppable duo energy.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Alan Walker — Faded": {
        playing: [
            "You linger on my mind.",
            "Unforgettable. That's you.",
            "Can't fade what's real.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Alan Walker, K-391 & Emelie Hollow — Lily": {
        playing: [
            "I've got you covered.",
            "Safe with me. Always.",
            "Don't worry. I handle it.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Bruno Mars — Locked Out Of Heaven": {
        playing: [
            "You're my kind of high.",
            "Addicted to your energy.",
            "You got that golden touch.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Conan Gray — Memories": {
        playing: [
            "We made history with that one.",
            "Classics never die.",
            "You're my favorite chapter.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Halsey — Without Me": {
        playing: [
            "You know I'm the upgrade.",
            "Irreplaceable. And you know it.",
            "I bring the value.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Hoobastank — The Reason": {
        playing: [
            "You inspire the best in me.",
            "Leveling up. Because of you.",
            "I'm better. You're the reason.",
        ],
        paused: ["dulu lagu aja"],
    },
    "James Arthur — Impossible": {
        playing: [
            "Challenge accepted.",
            "I don't do easy. I do worth it.",
            "Whatever it takes.",
        ],
        paused: ["dulu lagu aja"],
    },
    "John Newman — Love Me Again": {
        playing: [
            "Ready for round two?",
            "Undeniable connection.",
            "We're not done yet.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Loreen — Tattoo": {
        playing: [
            "I've left my mark.",
            "Inked in your mind.",
            "Permanent residence in my head.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Coldplay — A Sky Full Of Stars": {
        playing: [
            "You light everything up.",
            "My world looks better with you.",
            "Pure magic. That's you.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Coldplay — Viva La Vida": {
        playing: [
            "We rule our own world.",
            "Top of the world feeling.",
            "Legacy? We're making it.",
        ],
        paused: ["dulu lagu aja"],
    },
    "David Guetta & Sia — Titanium": {
        playing: [
            "Bulletproof. Nothing breaks us.",
            "Stronger than they know.",
            "We stand tall.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Eminem — Mockingbird": {
        playing: [
            "I'll do anything for my people.",
            "Protecting what's mine.",
            "Stay strong. I got you.",
        ],
        paused: ["dulu lagu aja"],
    },
    "James Arthur — Say You Won't Let Go": {
        playing: [
            "I'm in this for the long haul.",
            "You're the one. Simple as that.",
            "Growing old with you? Deal.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Maroon 5 — Payphone": {
        playing: [
            "Still here. Still trying.",
            "Not giving up easily.",
            "One more shot?",
        ],
        paused: ["dulu lagu aja"],
    },
    "One Direction — Night Changes": {
        playing: [
            "We're getting better with time.",
            "Just getting started.",
            "Change is good with you.",
        ],
        paused: ["dulu lagu aja"],
    },
    "One Direction — Story of My Life": {
        playing: [
            "Building something real.",
            "You're in my chapters.",
            "This story needs you.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Passenger — Let Her Go": {
        playing: [
            "I know what I have.",
            "Not letting this slip.",
            "Value you? Always.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Rachel Platten — Fight Song": {
        playing: [
            "Watch me make it happen.",
            "I've got plenty of fight left.",
            "Just watch me.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Sia — Chandelier": {
        playing: [
            "Living large tonight.",
            "All in. No regrets.",
            "Let's make a scene.",
        ],
        paused: ["dulu lagu aja"],
    },
    "Wiz Khalifa ft. Charlie Puth — See You Again": {
        playing: [
            "Bond like ours lasts forever.",
            "Family first. Always.",
            "See you at the top.",
        ],
        paused: ["dulu lagu aja"],
    },
};

// Helper function to get a message for a song by index (for rotation)
export function getSongMessage(songTitle: string, isPlaying: boolean, index: number = 0): string {
    // 1. Paused Logic: Return the song title itself
    if (!isPlaying) {
        return songTitle;
    }

    // 2. Play Logic
    const messages = SONG_MESSAGES[songTitle];
    if (messages) {
        return messages.playing[index % messages.playing.length];
    }

    // 3. Fallback Playing
    return isPlaying ? "This one's for you." : songTitle;
}
