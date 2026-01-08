"use client";

import { useState, useMemo } from "react";
import { Project, projects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid() {
    const [filter, setFilter] = useState<string>("All");

    const categories = ["All", "Web", "Mobile", "Design"];

    const filteredProjects = useMemo(() => {
        if (filter === "All") return projects;
        return projects.filter(p => p.category === filter);
    }, [filter]);

    return (
        <div className="animate-fade-in animation-delay-300">
            {/* Section Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
                <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.75rem",
                    fontWeight: 600
                }}>
                    Works
                </h2>

                {/* Filter */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            style={{
                                fontSize: "0.8rem",
                                padding: "0.4rem 1rem",
                                borderRadius: "100px",
                                border: filter === cat ? "1px solid var(--foreground)" : "1px solid transparent",
                                backgroundColor: filter === cat ? "var(--foreground)" : "transparent",
                                color: filter === cat ? "var(--background)" : "var(--secondary)",
                                transition: "all 0.3s ease",
                                cursor: "pointer"
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
