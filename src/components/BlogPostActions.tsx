"use client";

import { useEffect, useState } from "react";

interface BlogPostActionsProps {
    slug: string;
    title: string;
}

export function BlogPostActions({ slug, title }: BlogPostActionsProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Check bookmark status on mount
    useEffect(() => {
        const bookmarks = JSON.parse(localStorage.getItem("readingList") || "[]");
        setIsBookmarked(bookmarks.some((b: any) => b.slug === slug));
    }, [slug]);

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem("readingList") || "[]");
        let newBookmarks;

        if (isBookmarked) {
            newBookmarks = bookmarks.filter((b: any) => b.slug !== slug);
        } else {
            newBookmarks = [...bookmarks, { slug, title, dateAdded: new Date().toISOString() }];
        }

        localStorage.setItem("readingList", JSON.stringify(newBookmarks));
        setIsBookmarked(!isBookmarked);

        // Dispatch event for other components to listen
        window.dispatchEvent(new Event("readingListUpdated"));
    };

    return (
        <button
            onClick={toggleBookmark}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "100px",
                border: "1px solid var(--border)",
                fontSize: "0.875rem",
                color: isBookmarked ? "var(--background)" : "var(--foreground)",
                backgroundColor: isBookmarked ? "var(--foreground)" : "transparent",
                transition: "all 0.3s ease",
                cursor: "pointer",
                marginTop: "1rem"
            }}
            aria-label={isBookmarked ? "Remove from reading list" : "Add to reading list"}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isBookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            {isBookmarked ? "Saved" : "Save"}
        </button>
    );
}
