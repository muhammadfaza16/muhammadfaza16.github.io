import { NextResponse } from "next/server";
import { getAllPosts, createPost, updatePost, deletePost, generateSlug } from "@/lib/posts";

const ADMIN_PASSWORD = "faza123"; // TO DO: Move to env variable in production

export async function GET() {
    const posts = getAllPosts();
    return NextResponse.json(posts);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { adminPassword, post } = body;

        if (adminPassword !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!post.title || !post.content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Auto-generate slug if not provided, or sanitize existing one
        const slug = post.slug ? generateSlug(post.slug) : generateSlug(post.title);

        // Ensure slug uniqueness (simple check, colliding slugs will fail in createPost)
        const date = new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        const newPost = createPost({
            ...post,
            slug,
            date: post.date || date
        });

        if (!newPost) {
            return NextResponse.json({ error: "Failed to create post (Slug might exist)" }, { status: 409 });
        }

        return NextResponse.json({ message: "Post created", post: newPost });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { adminPassword, slug, updates } = body;

        if (adminPassword !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        const updatedPost = updatePost(slug, {
            ...updates,
            lastUpdated: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            })
        });

        if (!updatedPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Post updated", post: updatedPost });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { adminPassword, slug } = body;

        if (adminPassword !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        const success = deletePost(slug);

        if (!success) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Post deleted" });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
