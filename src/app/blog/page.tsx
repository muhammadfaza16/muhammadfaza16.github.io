import React from "react";
import { getAllPosts } from "@/lib/posts";
import { BlogClient } from "./BlogClient";

export const metadata = {
    title: "Writing",
    description: "Random thoughts, half-baked ideas, dan segala yang keburu diketik sebelum lupa.",
};

export default function BlogPage() {
    const posts = getAllPosts();
    return <BlogClient posts={posts} />;
}
