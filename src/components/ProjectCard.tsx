"use client";

import { Project } from "@/lib/projects";
import Image from "next/image";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div
            className="group"
            style={{
                borderRadius: "20px",
                overflow: "visible", // Allow shadow to spill
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative"
            }}
        >
            {/* Image Container - Floating Effect */}
            <div style={{
                height: "260px", // Taller for impact
                borderRadius: "16px",
                backgroundColor: "var(--card-bg)",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)", // Soft Apple-like shadow
                marginBottom: "1.5rem",
                transition: "all 0.4s ease"
            }} className="group-hover:shadow-2xl group-hover:-translate-y-2">
                {project.imageUrl ? (
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div style={{
                        fontSize: "3rem",
                        opacity: 0.8,
                        color: "var(--foreground)"
                    }}>
                        {project.category === "Web" && "⚡"}
                        {project.category === "Mobile" && "📱"}
                        {project.category === "Design" && "🎨"}
                        {project.category === "Research" && "🔬"}
                        {project.category === "Other" && "📦"}
                    </div>
                )}

                {/* Subtle Overlay */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.0)",
                    transition: "background-color 0.3s"
                }} className="group-hover:bg-black/5 dark:group-hover:bg-white/5" />
            </div>

            {/* Content - Clean & Typographic */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "0.5rem"
                }}>
                    <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.5rem",
                        fontWeight: 500,
                        color: "var(--foreground)",
                        letterSpacing: "-0.01em"
                    }}>
                        {project.title}
                    </h3>
                </div>

                <p style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "1rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    marginBottom: "1.25rem",
                    maxWidth: "90%"
                }}>
                    {project.description}
                </p>

                {/* Minimalist Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "auto" }}>
                    {project.tags.map(tag => (
                        <span key={tag} style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            textTransform: "lowercase",
                            fontFamily: "var(--font-mono)"
                        }}>
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
