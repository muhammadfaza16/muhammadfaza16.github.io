"use client";

import { useState } from "react";
import { PostCard } from "./PostCard";

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readingTime?: string;
}

export function PostList({ allPosts }: { allPosts: Post[] }) {
    const [displayCount, setDisplayCount] = useState(5);
    const postsToShow = allPosts.slice(0, displayCount);
    const hasMore = displayCount < allPosts.length;

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 5);
    };

    return (
        <div className="flex flex-col space-y-2 stagger-children">
            {postsToShow.map((post) => (
                <PostCard
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.date}
                    readingTime={post.readingTime || ""}
                />
            ))}

            {hasMore && (
                <div className="mt-12 text-center animate-fade-in">
                    <button
                        onClick={handleLoadMore}
                        className="text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors text-sm font-medium tracking-wide"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        Load more stories ↓
                    </button>
                </div>
            )}
        </div>
    );
}
