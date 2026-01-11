"use client";

import { useState, useRef, useEffect } from "react";
import { PostCard } from "./PostCard";

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readingTime?: string;
    thumbnail?: string;
}

export function PostList({ allPosts }: { allPosts: Post[] }) {
    const [displayCount, setDisplayCount] = useState(5);
    const [animatingFrom, setAnimatingFrom] = useState(0);
    const postsToShow = allPosts.slice(0, displayCount);
    const hasMore = displayCount < allPosts.length;

    const handleLoadMore = () => {
        setAnimatingFrom(displayCount);
        setDisplayCount(prev => prev + 5);
    };

    return (
        <div className="flex flex-col space-y-2">
            {postsToShow.map((post, index) => {
                // Calculate animation delay only for newly loaded posts
                const isNewPost = index >= animatingFrom;
                const delayIndex = isNewPost ? index - animatingFrom : index;
                const delay = isNewPost ? delayIndex * 0.08 : 0;

                return (
                    <div
                        key={post.slug}
                        className="animate-fade-in-up"
                        style={{
                            animationDelay: `${delay}s`,
                            animationFillMode: "both"
                        }}
                    >
                        <PostCard
                            slug={post.slug}
                            title={post.title}
                            excerpt={post.excerpt}
                            date={post.date}
                            readingTime={post.readingTime || ""}
                            thumbnail={post.thumbnail}
                            hideBorderTop={index === 0}
                        />
                    </div>
                );
            })}

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
