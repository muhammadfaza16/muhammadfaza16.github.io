export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    tags: string[];
    link?: string;
    category: "Web" | "Mobile" | "Design" | "Other";
}

export const projects: Project[] = [
    {
        id: "1",
        title: "Personal Manifesto",
        description: "A minimalistic personal website focusing on digital gardening and thoughtful essays. Built with Next.js and Tailwind CSS.",
        tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        link: "https://manifesto.dev",
        category: "Web"
    },
    {
        id: "2",
        title: "Zen Focus App",
        description: "A productivity application designed to help users enter a flow state through ambient sounds and pomodoro techniques.",
        tags: ["React Native", "TypeScript", "Redux"],
        category: "Mobile"
    },
    {
        id: "3",
        title: "Botanical UI Kit",
        description: "A comprehensive UI kit for plant care applications, featuring over 100+ components and organic color palettes.",
        tags: ["Figma", "Design System", "UI/UX"],
        category: "Design"
    }
];

export function getAllTags(): string[] {
    const tags = new Set<string>();
    projects.forEach(project => {
        project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}

export function getAllCategories(): string[] {
    const categories = new Set<string>();
    projects.forEach(project => {
        if (project.category) categories.add(project.category);
    });
    return Array.from(categories).sort();
}
