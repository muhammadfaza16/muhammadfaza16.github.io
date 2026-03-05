import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const article = await prisma.article.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                content: true,
                url: true,
                imageUrl: true,
                category: true,
                isRead: true,
                isBookmarked: true,
                createdAt: true,
            }
        });

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error("Failed to fetch article:", error);
        return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
    }
}
