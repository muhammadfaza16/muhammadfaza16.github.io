"use client";

import { Project } from "@/lib/projects";
import Image from "next/image";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div
            className="group card-hover"
            style={{
                border: "1px solid var(--border)",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "var(--card-bg)",
                display: "flex",
                flexDirection: "column",
                height: "100%"
            }}
        >
            {/* Image Placeholder */}
            <div style={{
                height: "200px",
                backgroundColor: "var(--border)",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
            }}>
                {project.imageUrl ? (
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="text-[var(--secondary)] opacity-50 text-4xl">
                        {/* Simple geometric pattern or icon based on category */}
                        {project.category === "Web" && "⚡"}
                        {project.category === "Mobile" && "📱"}
                        {project.category === "Design" && "🎨"}
                        {project.category === "Other" && "📦"}
                    </div>
                )}

                {/* Overlay on hover */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    transition: "background-color 0.3s"
                }} className="group-hover:bg-black/5 dark:group-hover:bg-white/5" />
            </div>

            {/* Content */}
            <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: "auto" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "0.75rem"
                    }}>
                        <h3 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.25rem",
                            fontWeight: 600,
                            lineHeight: 1.3
                        }}>
                            {project.title}
                        </h3>
                        <span style={{
                            fontSize: "0.65rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "100px",
                            border: "1px solid var(--border)",
                            color: "var(--secondary)"
                        }}>
                            {project.category}
                        </span>
                    </div>

                    <p style={{
                        fontSize: "0.875rem",
                        color: "var(--secondary)",
                        lineHeight: 1.6,
                        marginBottom: "1.25rem"
                    }}>
                        {project.description}
                    </p>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
                    {project.tags.map(tag => (
                        <span key={tag} style={{
                            fontSize: "0.75rem",
                            color: "var(--text-secondary)",
                            backgroundColor: "var(--background)",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px"
                        }}>
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
