import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Cache for 1 hour
export const revalidate = 3600;

const getTopArticles = unstable_cache(
    async (limit: number) => {
        return await prisma.article.findMany({
            take: limit,
            where: {
                OR: [
                    { category: null },
                    { category: { not: "__SUGGESTED__" } }
                ],
                score: {
                    isNot: null
                }
            },
            orderBy: {
                score: {
                    socialScore: 'desc'
                }
            },
            include: {
                score: {
                    select: {
                        socialScore: true,
                    }
                }
            }
        });
    },
    ['top-articles-cache'],
    { revalidate: 3600 }
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limitStr = searchParams.get("limit");
        const limit = limitStr ? parseInt(limitStr) : 5;

        const topArticles = await getTopArticles(limit);

        // Flatten the score into the object format the frontend expects
        const enriched = topArticles.map(a => ({
            id: a.id,
            title: a.title,
            content: a.content,
            url: a.url,
            imageUrl: a.imageUrl,
            category: a.category,
            createdAt: a.createdAt,
            socialScore: a.score?.socialScore || 0,
        }));

        return NextResponse.json({ success: true, articles: enriched });
    } catch (error) {
        console.error("Failed to fetch top articles:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
