import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { title, content, coverImage } = data;

        if (!title || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Auto-generate slug from title
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const post = await prisma.post.create({
            data: {
                slug,
                title,
                content,
                coverImage,
                published: true, // We assume posting from master console means it's published for now
            },
        });

        return NextResponse.json({ success: true, post }, { status: 201 });
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
                coverImage: true,
                createdAt: true,
            }
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Failed to fetch writing posts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
