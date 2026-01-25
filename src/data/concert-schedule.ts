export interface Concert {
    id: string;
    title: string;
    description: string;
    date: string;
    url?: string;
}

export const CONCERT_SCHEDULE: Concert[] = [
    {
        id: "midnight-jazz",
        title: "Midnight Jazz Session",
        description: "Smooth jazz for deep reflection and late-night calm.",
        date: "Once a week",
    },
    {
        id: "lofi-study",
        title: "Lo-Fi Study Beats",
        description: "Menenangkan riuh kepalamu saat sedang fokus.",
        date: "Daily",
    },
    {
        id: "ambient-space",
        title: "Ambient Space Journey",
        description: "Floating through the nebula with synth pads.",
        date: "Atmospheric",
    },
];
