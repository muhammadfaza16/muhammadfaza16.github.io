export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    tags: string[];
    link?: string;
    category: "Web" | "Mobile" | "Design" | "Research" | "Other";
}

export const projects: Project[] = [
    // Web / Software
    {
        id: "agent-zero",
        title: "Agent-Zero",
        description: "Experimental autonomous agent capable of tool use and multi-step reasoning. The playground for my AI learning journey.",
        tags: ["Python", "LangChain", "LLMs"],
        category: "Research"
    },
    {
        id: "1",
        title: "The Almanack",
        description: "This personal digital garden you're on. A minimalist space for essays, curated reading, and random thoughts.",
        tags: ["Next.js", "TypeScript", "Tailwind"],
        link: "https://manifesto.dev",
        category: "Web"
    },
    {
        id: "2",
        title: "Cognitive Bias Index",
        description: "An interactive encyclopedia of 180+ cognitive biases, categorized by decision-making impact. Built to help people think better.",
        tags: ["React", "D3.js", "Psychology"],
        link: "#",
        category: "Web"
    },
    {
        id: "3",
        title: "Econ Simulator",
        description: "A toy model for simulating basic macroeconomic dynamics — inflation, interest rates, and GDP growth. Inspired by Poor Economics.",
        tags: ["Python", "Streamlit", "Economics"],
        category: "Research"
    },

    // Research / Experiments
    {
        id: "4",
        title: "Behavioral Nudge Lab",
        description: "A/B testing framework for behavioral interventions. Measuring the real-world impact of choice architecture.",
        tags: ["Python", "Statistics", "Behavioral Econ"],
        category: "Research"
    },
    {
        id: "5",
        title: "First Principles Notes",
        description: "An Obsidian vault of interconnected notes. My attempt at building a second brain from Feynman to Kahneman.",
        tags: ["Obsidian", "PKM", "Knowledge Management"],
        category: "Other"
    },
    {
        id: "6",
        title: "Quote Gacha Engine",
        description: "The random wisdom generator on this site. Pulling from stoics, scientists, and Indonesian thinkers.",
        tags: ["React", "TypeScript", "Philosophy"],
        category: "Web"
    },

    // Design / Creative
    {
        id: "7",
        title: "Polymath UI Kit",
        description: "A design system inspired by academic journals and editorial aesthetics. Clean, typography-first, and timeless.",
        tags: ["Figma", "Design System", "UI/UX"],
        category: "Design"
    },
    {
        id: "8",
        title: "Decision Journal",
        description: "A personal tool for tracking decisions, rationale, and outcomes. Inspired by Annie Duke and Kahneman.",
        tags: ["Notion", "Decision-Making", "Self-Improvement"],
        category: "Other"
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
