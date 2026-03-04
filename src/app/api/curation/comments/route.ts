import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { articleId, authorName, content } = data;

        if (!articleId || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newComment = await prisma.comment.create({
            data: {
                articleId,
                authorName: authorName || "Anonymous",
                content,
            },
        });

        return NextResponse.json({ success: true, comment: newComment }, { status: 201 });
    } catch (error) {
        console.error("Failed to create comment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const articleId = searchParams.get("articleId");

        if (!articleId) {
            return NextResponse.json({ error: "articleId is required" }, { status: 400 });
        }

        const comments = await prisma.comment.findMany({
            where: { articleId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: comments });
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


