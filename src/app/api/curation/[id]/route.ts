import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 300; // Cache individual article fetching for 5 minutes

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
                score: {
                    select: {
                        engagement: true,
                        actionability: true,
                        specificity: true
                    }
                }
            }
        });

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        const response = {
            ...article,
            likes: article.score?.engagement || 0,
            reposts: article.score?.actionability || 0,
            replies: article.score?.specificity || 0,
        };
        delete (response as any).score;

        return NextResponse.json(response);
    } catch (error) {
        console.error("Failed to fetch article:", error);
        return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
    }
}
