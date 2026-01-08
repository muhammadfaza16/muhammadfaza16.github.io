import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost, updatePost, deletePost, generateSlug } from '@/lib/posts';

// GET /api/posts - Get all posts
export async function GET() {
    try {
        const posts = getAllPosts();
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, excerpt, content, date } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const slug = generateSlug(title);
        const newPost = createPost({
            slug,
            title,
            excerpt: excerpt || content.substring(0, 150) + '...',
            content,
            date: date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        });

        if (!newPost) {
            return NextResponse.json({ error: 'Failed to create post or slug already exists' }, { status: 400 });
        }

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}

// PUT /api/posts - Update post
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { slug, title, excerpt, content, date } = body;

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        const updatedPost = updatePost(slug, {
            title,
            excerpt,
            content,
            date,
            lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        });

        if (!updatedPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

// DELETE /api/posts - Delete post
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        const deleted = deletePost(slug);

        if (!deleted) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
