export interface ThemeColors {
    primary: string;
    secondary: string;
    tertiary: string;
}

export const SONG_THEMES: Record<string, ThemeColors> = {
    "Alan Walker — Faded": {
        primary: "rgba(99, 102, 241, 0.4)", // Indigo
        secondary: "rgba(56, 189, 248, 0.3)", // Sky Blue
        tertiary: "rgba(168, 85, 247, 0.2)", // Purple
    },
    "Alan Walker — Lily": {
        primary: "rgba(16, 185, 129, 0.4)", // Emerald
        secondary: "rgba(20, 184, 166, 0.3)", // Teal
        tertiary: "rgba(244, 114, 182, 0.2)", // Pink (Lily flower)
    },
    "Loreen — Tattoo": {
        primary: "rgba(217, 70, 239, 0.4)", // Fuchsia
        secondary: "rgba(244, 63, 94, 0.3)", // Rose
        tertiary: "rgba(124, 58, 237, 0.2)", // Violet
    },
    "Bruno Mars — Locked Out": {
        primary: "rgba(234, 179, 8, 0.4)", // Gold
        secondary: "rgba(249, 115, 22, 0.3)", // Orange
        tertiary: "rgba(220, 38, 38, 0.2)", // Red
    },
    "Halsey — Without Me": {
        primary: "rgba(139, 92, 246, 0.4)", // Violet
        secondary: "rgba(236, 72, 153, 0.3)", // Pink
        tertiary: "rgba(79, 70, 229, 0.2)", // Indigo
    },
    "The Script — The Man Who": {
        primary: "rgba(71, 85, 105, 0.4)", // Slate
        secondary: "rgba(51, 65, 85, 0.3)", // Dark Blue
        tertiary: "rgba(148, 163, 184, 0.2)", // Blue Grey
    },
    "James Arthur — Impossible": {
        primary: "rgba(185, 28, 28, 0.4)", // Dark Red
        secondary: "rgba(153, 27, 27, 0.3)", // Crimson
        tertiary: "rgba(67, 56, 202, 0.2)", // Indigo
    },
    "John Newman — Love Me": {
        primary: "rgba(220, 38, 38, 0.4)", // Red
        secondary: "rgba(250, 204, 21, 0.3)", // Yellow
        tertiary: "rgba(0, 0, 0, 0.1)", // Black/Dark
    },
    "Hoobastank — The Reason": {
        primary: "rgba(157, 23, 77, 0.4)", // Pink
        secondary: "rgba(124, 58, 237, 0.3)", // Violet
        tertiary: "rgba(75, 85, 99, 0.2)", // Grey
    },
    "Conan Gray — Memories": {
        primary: "rgba(251, 146, 60, 0.4)", // Orange (Nostalgia)
        secondary: "rgba(253, 186, 116, 0.3)", // Light Orange
        tertiary: "rgba(168, 162, 158, 0.2)", // Sepia/Grey
    },
    "Alan Walker — Alone": {
        primary: "rgba(6, 182, 212, 0.4)", // Cyan
        secondary: "rgba(59, 130, 246, 0.3)", // Blue
        tertiary: "rgba(244, 63, 94, 0.2)", // Rose (Ava Max)
    },
    "Arash feat. Helena — One Day": {
        primary: "rgba(234, 179, 8, 0.4)", // Yellow/Gold
        secondary: "rgba(249, 115, 22, 0.3)", // Orange
        tertiary: "rgba(120, 53, 15, 0.2)", // Brown
    },
    "Arash feat. Helena — Broken Angel": {
        primary: "rgba(245, 158, 11, 0.4)", // Amber
        secondary: "rgba(180, 83, 9, 0.3)", // Dark Amber
        tertiary: "rgba(0, 0, 0, 0.2)", // Black/Shadow
    },
    "Kygo & Selena Gomez — It Ain't Me": {
        primary: "rgba(236, 72, 153, 0.4)", // Pink
        secondary: "rgba(14, 165, 233, 0.3)", // Sky Blue
        tertiary: "rgba(245, 208, 254, 0.2)", // Pale Purple
    },
    "Martin Garrix & Bebe Rexha — In The Name Of Love": {
        primary: "rgba(59, 130, 246, 0.4)", // Blue
        secondary: "rgba(6, 182, 212, 0.3)", // Cyan
        tertiary: "rgba(255, 255, 255, 0.2)", // White/Light
    },
    "Prateek Kuhad — Co2": {
        primary: "rgba(253, 186, 116, 0.4)", // Orange/Peach
        secondary: "rgba(252, 165, 165, 0.3)", // Red/Pink
        tertiary: "rgba(120, 113, 108, 0.2)", // Warm Grey
    },
    "Selena Gomez — Love You Like a Love Song": {
        primary: "rgba(192, 38, 211, 0.4)", // Fuchsia
        secondary: "rgba(232, 121, 249, 0.3)", // Light Purple
        tertiary: "rgba(76, 29, 149, 0.2)", // Dark Violet
    },
};

export const DEFAULT_THEME: ThemeColors = {
    primary: "rgba(99,102,241,0.35)", // Original Indigo
    secondary: "rgba(244,114,182,0.3)", // Original Pink
    tertiary: "rgba(34,211,238,0.25)", // Original Cyan
};
