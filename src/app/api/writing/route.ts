import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { title, content, url } = data;

        if (!title || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

        const newPost = await prisma.post.create({
            data: {
                title,
                slug,
                content: content || "",
                url,
                published: true, // We assume posting from master console means it's published for now
            },
        });

        return NextResponse.json({ success: true, post: newPost }, { status: 201 });
    } catch (error) {
        console.error("Failed to create writing post:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                slug: true,
                url: true,
                published: true,
            }
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Failed to fetch writing posts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
