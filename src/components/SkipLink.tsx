"use client";

export function SkipLink() {
    return (
        <a
            href="#main-content"
            style={{
                position: "absolute",
                top: "-100%",
                left: "1rem",
                zIndex: 100,
                padding: "1rem",
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
                textDecoration: "none",
                fontWeight: 600,
                borderRadius: "0 0 8px 8px",
                transition: "top 0.3s ease"
            }}
            className="focus:top-0"
        >
            Skip to content
        </a>
    );
}
