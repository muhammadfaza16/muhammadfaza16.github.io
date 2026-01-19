export interface ThemeColors {
    primary: string;
    secondary: string;
    tertiary: string;
}

export const SONG_THEMES: Record<string, ThemeColors> = {
    // 1. Heroes
    "Janji — Heroes Tonight": {
        primary: "rgba(34, 211, 238, 0.4)", // Cyan
        secondary: "rgba(16, 185, 129, 0.3)", // Emerald
        tertiary: "rgba(253, 224, 71, 0.2)", // Yellow
    },
    // 2. Play
    "Alan Walker, K-391, Tungevaag, Mangoo — Play": {
        primary: "rgba(16, 185, 129, 0.4)", // Green/Play
        secondary: "rgba(6, 182, 212, 0.3)", // Cyan
        tertiary: "rgba(244, 114, 182, 0.2)", // Pink
    },
    // 3. Save Your Tears
    "The Weeknd & Ariana Grande — Save Your Tears": {
        primary: "rgba(239, 68, 68, 0.4)", // Red
        secondary: "rgba(168, 85, 247, 0.3)", // Purple
        tertiary: "rgba(14, 165, 233, 0.2)", // Blue
    },

    // ==================== RANDOM MIX ====================
    "Alan Walker — The Spectre": {
        primary: "rgba(34, 211, 238, 0.4)", // Cyan
        secondary: "rgba(56, 189, 248, 0.3)", // Sky
        tertiary: "rgba(255, 255, 255, 0.15)", // White/Ghost
    },
    "Camila Cabello — Shameless": {
        primary: "rgba(220, 38, 38, 0.4)", // Red
        secondary: "rgba(190, 18, 60, 0.3)", // Dark Rose
        tertiary: "rgba(0, 0, 0, 0.2)", // Black
    },
    "Alan Walker — Darkside": {
        primary: "rgba(30, 41, 59, 0.5)", // Dark Slate
        secondary: "rgba(139, 92, 246, 0.3)", // Violet
        tertiary: "rgba(248, 113, 113, 0.2)", // Red
    },
    "Arash feat. Helena — Broken Angel": {
        primary: "rgba(245, 158, 11, 0.4)", // Amber
        secondary: "rgba(180, 83, 9, 0.3)", // Dark Amber
        tertiary: "rgba(0, 0, 0, 0.2)", // Black/Shadow
    },
    "John Newman — Love Me Again": {
        primary: "rgba(220, 38, 38, 0.4)", // Red
        secondary: "rgba(250, 204, 21, 0.3)", // Yellow
        tertiary: "rgba(0, 0, 0, 0.1)", // Black/Dark
    },
    "Alan Walker — Alone": {
        primary: "rgba(6, 182, 212, 0.4)", // Cyan
        secondary: "rgba(59, 130, 246, 0.3)", // Blue
        tertiary: "rgba(244, 63, 94, 0.2)", // Rose (Ava Max)
    },
    "Edward Maya — Stereo Love": {
        primary: "rgba(236, 72, 153, 0.4)", // Pink
        secondary: "rgba(244, 114, 182, 0.3)", // Light Pink
        tertiary: "rgba(139, 92, 246, 0.2)", // Violet
    },
    "Gym Class Heroes — Stereo Hearts": {
        primary: "rgba(239, 68, 68, 0.4)", // Red Heart
        secondary: "rgba(251, 146, 60, 0.3)", // Orange
        tertiary: "rgba(254, 215, 170, 0.2)", // Peach
    },
    "Martin Garrix & Bebe Rexha — In The Name Of Love": {
        primary: "rgba(59, 130, 246, 0.4)", // Blue
        secondary: "rgba(6, 182, 212, 0.3)", // Cyan
        tertiary: "rgba(255, 255, 255, 0.2)", // White/Light
    },
    "Alan Walker — Lily": {
        primary: "rgba(16, 185, 129, 0.4)", // Emerald
        secondary: "rgba(20, 184, 166, 0.3)", // Teal
        tertiary: "rgba(244, 114, 182, 0.2)", // Pink (Lily flower)
    },
    "Alan Walker — Sing Me To Sleep": {
        primary: "rgba(99, 102, 241, 0.4)", // Indigo
        secondary: "rgba(165, 180, 252, 0.3)", // Light Indigo
        tertiary: "rgba(30, 58, 138, 0.2)", // Dark Blue
    },
    "Arash feat. Helena — One Day": {
        primary: "rgba(234, 179, 8, 0.4)", // Yellow/Gold
        secondary: "rgba(249, 115, 22, 0.3)", // Orange
        tertiary: "rgba(120, 53, 15, 0.2)", // Brown
    },
    "Alan Walker — Faded": {
        primary: "rgba(99, 102, 241, 0.4)", // Indigo
        secondary: "rgba(56, 189, 248, 0.3)", // Sky Blue
        tertiary: "rgba(168, 85, 247, 0.2)", // Purple
    },
    "Avicii — The Nights": {
        primary: "rgba(251, 146, 60, 0.4)", // Orange
        secondary: "rgba(234, 179, 8, 0.3)", // Yellow
        tertiary: "rgba(30, 58, 138, 0.2)", // Dark Blue Night
    },
    "Alan Walker — On My Way": {
        primary: "rgba(34, 197, 94, 0.4)", // Green
        secondary: "rgba(74, 222, 128, 0.3)", // Light Green
        tertiary: "rgba(251, 191, 36, 0.2)", // Amber
    },
    "Fun. — We Are Young": {
        primary: "rgba(249, 115, 22, 0.4)", // Orange
        secondary: "rgba(234, 88, 12, 0.3)", // Dark Orange
        tertiary: "rgba(253, 224, 71, 0.2)", // Yellow
    },
    "Bruno Mars — Locked Out Of Heaven": {
        primary: "rgba(234, 179, 8, 0.4)", // Gold
        secondary: "rgba(249, 115, 22, 0.3)", // Orange
        tertiary: "rgba(220, 38, 38, 0.2)", // Red
    },
    "Bruno Mars — It Will Rain": {
        primary: "rgba(100, 116, 139, 0.4)", // Slate/Grey
        secondary: "rgba(59, 130, 246, 0.3)", // Blue
        tertiary: "rgba(30, 41, 59, 0.2)", // Dark
    },
    "Alan Walker — Alone Pt II": {
        primary: "rgba(6, 182, 212, 0.4)", // Cyan
        secondary: "rgba(59, 130, 246, 0.3)", // Blue
        tertiary: "rgba(139, 92, 246, 0.2)", // Violet
    },
    "Kygo & Selena Gomez — It Ain't Me": {
        primary: "rgba(236, 72, 153, 0.4)", // Pink
        secondary: "rgba(14, 165, 233, 0.3)", // Sky Blue
        tertiary: "rgba(245, 208, 254, 0.2)", // Pale Purple
    },
    "Mike Posner — I Took A Pill In Ibiza": {
        primary: "rgba(168, 85, 247, 0.4)", // Purple
        secondary: "rgba(236, 72, 153, 0.3)", // Pink
        tertiary: "rgba(14, 165, 233, 0.2)", // Sky Blue
    },
    "Loreen — Tattoo": {
        primary: "rgba(217, 70, 239, 0.4)", // Fuchsia
        secondary: "rgba(244, 63, 94, 0.3)", // Rose
        tertiary: "rgba(124, 58, 237, 0.2)", // Violet
    },

    // ==================== END SEQUENCE ====================
    "Ellie Goulding — Love Me Like You Do": {
        primary: "rgba(251, 207, 232, 0.4)", // Light Pink
        secondary: "rgba(244, 114, 182, 0.3)", // Pink
        tertiary: "rgba(253, 224, 71, 0.2)", // Yellow
    },
    "Lukas Graham — 7 Years": {
        primary: "rgba(251, 191, 36, 0.4)", // Amber/Gold
        secondary: "rgba(217, 119, 6, 0.3)", // Dark Amber
        tertiary: "rgba(120, 53, 15, 0.2)", // Brown
    },
    "Astrid S — Hurts So Good": {
        primary: "rgba(244, 63, 94, 0.4)", // Rose
        secondary: "rgba(251, 113, 133, 0.3)", // Pink
        tertiary: "rgba(253, 186, 116, 0.2)", // Orange
    },
    "Harry Styles — Sign of the Times": {
        primary: "rgba(139, 92, 246, 0.4)", // Violet
        secondary: "rgba(236, 72, 153, 0.3)", // Pink
        tertiary: "rgba(253, 186, 116, 0.2)", // Warm
    },
    "Lord Huron — The Night We Met": {
        primary: "rgba(30, 41, 59, 0.5)", // Dark Night
        secondary: "rgba(71, 85, 105, 0.3)", // Slate
        tertiary: "rgba(148, 163, 184, 0.2)", // Silver
    },
    "Peterpan — Ku Katakan Dengan Indah": {
        primary: "rgba(34, 197, 94, 0.4)", // Green
        secondary: "rgba(74, 222, 128, 0.3)", // Light Green
        tertiary: "rgba(253, 224, 71, 0.2)", // Yellow
    },
    "Keane — Somewhere Only We Know": {
        primary: "rgba(34, 197, 94, 0.4)", // Green
        secondary: "rgba(134, 239, 172, 0.3)", // Light Green
        tertiary: "rgba(253, 186, 116, 0.2)", // Warm
    },
    // Added specific requests here
    "Conan Gray — Memories": {
        primary: "rgba(251, 146, 60, 0.4)", // Orange (Nostalgia)
        secondary: "rgba(253, 186, 116, 0.3)", // Light Orange
        tertiary: "rgba(168, 162, 158, 0.2)", // Sepia/Grey
    },
    "Hoobastank — The Reason": {
        primary: "rgba(157, 23, 77, 0.4)", // Pink
        secondary: "rgba(124, 58, 237, 0.3)", // Violet
        tertiary: "rgba(75, 85, 99, 0.2)", // Grey
    },
    "Halsey — Without Me": {
        primary: "rgba(139, 92, 246, 0.4)", // Violet
        secondary: "rgba(236, 72, 153, 0.3)", // Pink
        tertiary: "rgba(79, 70, 229, 0.2)", // Indigo
    },
    "James Arthur — Impossible": {
        primary: "rgba(185, 28, 28, 0.4)", // Dark Red
        secondary: "rgba(153, 27, 27, 0.3)", // Crimson
        tertiary: "rgba(67, 56, 202, 0.2)", // Indigo
    },
    "The Script — The Man Who...": {
        primary: "rgba(71, 85, 105, 0.4)", // Slate
        secondary: "rgba(51, 65, 85, 0.3)", // Dark Blue
        tertiary: "rgba(148, 163, 184, 0.2)", // Blue Grey
    },
    "Bruno Mars — Talking To The Moon": {
        primary: "rgba(148, 163, 184, 0.4)", // Silver/Moon
        secondary: "rgba(30, 58, 138, 0.3)", // Night Blue
        tertiary: "rgba(251, 191, 36, 0.2)", // Gold Star
    },
    // End specific requests
    "Selena Gomez — Love You Like a Love Song": {
        primary: "rgba(192, 38, 211, 0.4)", // Fuchsia
        secondary: "rgba(232, 121, 249, 0.3)", // Light Purple
        tertiary: "rgba(76, 29, 149, 0.2)", // Dark Violet
    },
    "One Direction — Night Changes": {
        primary: "rgba(30, 58, 138, 0.4)", // Dark Blue
        secondary: "rgba(99, 102, 241, 0.3)", // Indigo
        tertiary: "rgba(251, 191, 36, 0.2)", // Gold
    },
    "One Direction — Story of My Life": {
        primary: "rgba(120, 113, 108, 0.4)", // Warm Grey
        secondary: "rgba(168, 162, 158, 0.3)", // Light Grey
        tertiary: "rgba(251, 146, 60, 0.2)", // Orange
    },
    // New Additions
    "Imagine Dragons — Believer": {
        primary: "rgba(249, 115, 22, 0.4)", // Organge/Pain
        secondary: "rgba(234, 179, 8, 0.3)", // Yellow
        tertiary: "rgba(30, 41, 59, 0.2)", // Dark
    },
    "twenty one pilots — Ride": {
        primary: "rgba(220, 38, 38, 0.4)", // Red
        secondary: "rgba(0, 0, 0, 0.3)", // Black
        tertiary: "rgba(255, 255, 255, 0.2)", // White
    },
    "The Script — Superheroes": {
        primary: "rgba(6, 182, 212, 0.4)", // Cyan
        secondary: "rgba(16, 185, 129, 0.3)", // Emerald
        tertiary: "rgba(251, 191, 36, 0.2)", // Amber
    },
    "The Script — Hall of Fame": {
        primary: "rgba(234, 179, 8, 0.4)", // Gold
        secondary: "rgba(251, 191, 36, 0.3)", // Amber
        tertiary: "rgba(0, 0, 0, 0.2)", // Black
    },
    "The Chainsmokers & Coldplay — Something Just Like This": {
        primary: "rgba(14, 165, 233, 0.4)", // Sky Blue
        secondary: "rgba(236, 72, 153, 0.3)", // Pink
        tertiary: "rgba(253, 224, 71, 0.2)", // Yellow
    },
    "Camila Cabello — Never Be the Same": {
        primary: "rgba(220, 38, 38, 0.4)", // Red
        secondary: "rgba(153, 27, 27, 0.3)", // Dark Red
        tertiary: "rgba(0, 0, 0, 0.2)", // Black
    },
    "Coldplay — Hymn For The Weekend": {
        primary: "rgba(234, 179, 8, 0.4)", // Gold
        secondary: "rgba(6, 182, 212, 0.3)", // Cyan
        tertiary: "rgba(217, 70, 239, 0.2)", // Magenta
    },
    "Demi Lovato — Heart Attack": {
        primary: "rgba(185, 28, 28, 0.4)", // Crimson
        secondary: "rgba(0, 0, 0, 0.3)", // Black
        tertiary: "rgba(255, 255, 255, 0.2)", // White
    },
    "Imagine Dragons — Bad Liar": {
        primary: "rgba(239, 68, 68, 0.4)", // Red
        secondary: "rgba(255, 255, 255, 0.3)", // White
        tertiary: "rgba(107, 114, 128, 0.2)", // Grey
    },
    "The Chainsmokers — Closer": {
        primary: "rgba(99, 102, 241, 0.4)", // Indigo
        secondary: "rgba(236, 72, 153, 0.3)", // Pink
        tertiary: "rgba(6, 182, 212, 0.2)", // Cyan
    },
    "The Chainsmokers — Don't Let Me Down": {
        primary: "rgba(251, 191, 36, 0.4)", // Yellow
        secondary: "rgba(79, 70, 229, 0.3)", // Indigo
        tertiary: "rgba(0, 0, 0, 0.2)", // Black
    },
};

export const DEFAULT_THEME: ThemeColors = {
    primary: "rgba(99,102,241,0.35)", // Original Indigo
    secondary: "rgba(244,114,182,0.3)", // Original Pink
    tertiary: "rgba(34,211,238,0.25)", // Original Cyan
};
