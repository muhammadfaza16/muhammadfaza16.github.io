import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { scoreArticle } from "@/lib/scoring";
import { unstable_cache } from "next/cache";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        // Admin-only: direct article creation
        const admin = await isAdminRequest();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        const { title, content, url, category } = data;

        if (!title || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newArticle = await prisma.article.create({
            data: {
                title,
                content: content || "No content provided",
                url,
                category: category || null,
                isRead: false,
            } as any,
            select: { id: true, title: true, url: true }
        });

        // Auto-score the new article
        try {
            const scores = scoreArticle(title, content);
            await prisma.articleScore.upsert({
                where: { articleId: newArticle.id },
                create: {
                    articleId: newArticle.id,
                    substance: scores.substance,
                    depth: scores.depth,
                    structure: scores.structure,
                    vocabulary: scores.vocabulary,
                    readability: scores.readability,
                    specificity: scores.specificity,
                    actionability: scores.actionability,
                    engagement: scores.engagement,
                    total: scores.composite,
                },
                update: {
                    substance: scores.substance,
                    depth: scores.depth,
                    structure: scores.structure,
                    vocabulary: scores.vocabulary,
                    readability: scores.readability,
                    specificity: scores.specificity,
                    actionability: scores.actionability,
                    engagement: scores.engagement,
                    total: scores.composite,
                },
            });
        } catch (scoreError) {
            console.error("Auto-scoring failed (non-blocking):", scoreError);
        }

        return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
    } catch (error) {
        console.error("Failed to create curation article:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const cursor = searchParams.get("cursor");
        const queryText = searchParams.get("q");
        const category = searchParams.get("category");
        const sortBy = searchParams.get("sortBy") || "date";
        const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
        const limitStr = searchParams.get("limit");
        const limit = limitStr ? parseInt(limitStr) : 10;
        const offsetStr = searchParams.get("offset");
        const offset = offsetStr ? parseInt(offsetStr) : 0;

        // Build WHERE with a single explicit AND array — all conditions go here
        const conditions: any[] = [];

        // Always exclude __SUGGESTED__ articles, but include null categories
        conditions.push({
            OR: [
                { category: null },
                { category: { not: "__SUGGESTED__" } }
            ]
        });

        // Category filter
        if (category) {
            const cats = decodeURIComponent(category).split(",");
            conditions.push({
                category: cats.length === 1 ? cats[0] : { in: cats }
            });
        }

        // Search by title
        if (queryText) {
            conditions.push({
                title: { contains: queryText, mode: "insensitive" }
            });
        }

        // Filter by IDs (for Continue Reading hydration)
        const ids = searchParams.get("ids");
        if (ids) {
            const idList = ids.split(",");
            conditions.push({ id: { in: idList } });
        }

        const where = conditions.length === 0 ? {} : (conditions.length === 1 ? conditions[0] : { AND: conditions });

        const getArticlesCacheKey = `feed4-${sortBy}-${sortOrder}-${limit}-${offset}-${category?.slice(0, 10)}-${queryText?.slice(0, 10)}`;

        const getCachedArticles = unstable_cache(
            async () => {
                const query: any = {
                    take: limit + 1,
                    where,
                    orderBy: sortBy === "popularity"
                        ? [
                            { score: { socialScore: sortOrder } },
                            { createdAt: 'desc' }
                          ]
                        : [
                            { createdAt: sortOrder },
                            { id: sortOrder }
                          ],
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
                                total: true,
                                substance: true,
                                engagement: true,
                                actionability: true,
                                specificity: true,
                                socialScore: true,
                            }
                        }
                    },
                };

                if (cursor) {
                    query.cursor = { id: cursor };
                    query.skip = 1;
                } else if (offset > 0) {
                    query.skip = offset;
                }

                try {
                    const articles = await prisma.article.findMany(query);
                    let nextCursor = null;
                    if (articles.length > limit) {
                        const lastItem = articles.pop();
                        nextCursor = articles[articles.length - 1].id;
                    }

                    const enriched = articles.map((a: any) => {
                        const s = a.score;
                        return {
                            id: a.id,
                            title: a.title,
                            content: a.content,
                            url: a.url,
                            imageUrl: a.imageUrl,
                            category: a.category,
                            isRead: a.isRead,
                            isBookmarked: a.isBookmarked,
                            createdAt: a.createdAt,
                            qualityScore: s?.total || null,
                            substanceScore: s?.substance || null,
                            likes: s?.engagement || 0,
                            reposts: s?.actionability || 0,
                            replies: s?.specificity || 0,
                            socialScore: s?.socialScore || 0
                        };
                    });
                    return { articles: enriched, nextCursor };
                } catch (dbError) {
                    console.error("Prisma error in getCachedArticles:", dbError);
                    throw dbError;
                }
            },
            [getArticlesCacheKey],
            { revalidate: 60 }
        );

        const [{ articles, nextCursor }, totalCount] = await Promise.all([
            getCachedArticles(),
            prisma.article.count({ where }),
        ]);

        return NextResponse.json({ articles, nextCursor, totalCount });
    } catch (error: any) {
        console.error("CURATION API ERROR - FULL DETAILS:", {
            message: error?.message,
            stack: error?.stack,
            query: request.url
        });
        return NextResponse.json({ 
            error: "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? error?.message : undefined
        }, { status: 500 });
    }
}

