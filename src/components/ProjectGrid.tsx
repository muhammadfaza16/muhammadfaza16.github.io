"use client";

import { useState, useMemo } from "react";
import { Project, projects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid() {
    const [filter, setFilter] = useState<string>("All");

    const categories = ["All", "Web", "Research", "Design", "Other"];

    const filteredProjects = useMemo(() => {
        if (filter === "All") return projects;
        return projects.filter(p => p.category === filter);
    }, [filter]);

    return (
        <div className="animate-fade-in animation-delay-300">
            {/* Section Header */}
            <div style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "4rem", /* More whitespace */
                flexWrap: "wrap",
                gap: "2rem",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "1rem"
            }}>
                <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2rem",
                    fontWeight: 400,
                    color: "var(--foreground)"
                }}>
                    All Projects
                </h2>

                {/* Filter - Minimalist Tab Style */}
                <div style={{ display: "flex", gap: "2rem" }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            style={{
                                fontSize: "0.9rem",
                                padding: "0.5rem 0",
                                border: "none",
                                borderBottom: filter === cat ? "1px solid var(--foreground)" : "1px solid transparent",
                                backgroundColor: "transparent",
                                color: filter === cat ? "var(--foreground)" : "var(--text-secondary)",
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                fontFamily: "var(--font-sans)",
                                letterSpacing: "0.05em"
                            }}
                            className="hover:text-[var(--foreground)]"
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "2rem"
                }}
                className="stagger-children"
            >
                {filteredProjects.map((project) => (
                    <div key={project.id}>
                        <ProjectCard project={project} />
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--secondary)" }}>
                    <p>No works in this category yet.</p>
                </div>
            )}
        </div>
    );
}
