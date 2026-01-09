import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost, generateSlug } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const posts = getAllPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, excerpt, content, thumbnail } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const slug = generateSlug(title);
        const now = new Date();
        const date = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const newPost = createPost({
            slug,
            title,
            excerpt: excerpt || title,
            content,
            date,
            lastUpdated: date,
            thumbnail
        });

        if (!newPost) {
            return NextResponse.json(
                { error: 'Post with this title already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
