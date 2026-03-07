import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { scoreArticle } from "@/lib/scoring";
import { unstable_cache } from "next/cache";

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
        const sort = searchParams.get("sort") || "latest";
        const limitStr = searchParams.get("limit");
        const limit = limitStr ? parseInt(limitStr) : 10;

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

        const where = conditions.length === 1 ? conditions[0] : { AND: conditions };

        const getArticlesCacheKey = `curation-feed-v2-${sort}-${limit}-${category || 'none'}-${queryText || 'none'}-${cursor || 'none'}`;

        const getCachedArticles = unstable_cache(
            async () => {
                const query: any = {
                    take: limit + 1,
                    where,
                    orderBy: sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" },
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
                                engagement: true, // likes
                                actionability: true, // reposts
                                specificity: true // replies
                            }
                        }
                    },
                };

                if (cursor) {
                    query.cursor = { id: cursor };
                    query.skip = 1;
                }

                let articles = await prisma.article.findMany(query);

                let nextCursor = null;
                if (articles.length > limit) {
                    articles.pop();
                    nextCursor = articles[articles.length - 1].id;
                }

                // Enrich with quality scores (raw SQL to avoid Prisma client cache issues)
                const articleIds = articles.map((a: any) => a.id);
                let scoreMap = new Map();
                if (articleIds.length > 0) {
                    const scores: any[] = await prisma.$queryRawUnsafe(
                        `SELECT "articleId", "total", "substance", "engagement", "actionability", "specificity" FROM "ArticleScore" WHERE "articleId" = ANY($1::text[])`,
                        articleIds
                    );
                    scoreMap = new Map(scores.map((s: any) => [s.articleId, s]));
                }

                const enriched = articles.map((a: any) => {
                    const score = scoreMap.get(a.id);
                    const likes = score?.engagement || 0;
                    const reposts = score?.actionability || 0;
                    const replies = score?.specificity || 0;
                    const socialScore = (likes * 1) + (reposts * 2) + (replies * 3);

                    return {
                        ...a,
                        qualityScore: score?.total || null,
                        substanceScore: score?.substance || null,
                        likes,
                        reposts,
                        replies,
                        socialScore
                    };
                });

                return { articles: enriched, nextCursor };
            },
            [getArticlesCacheKey],
            { revalidate: 60 } // Cache DB result for 1 minute
        );

        const { articles, nextCursor } = await getCachedArticles();

        return NextResponse.json({ articles, nextCursor });
    } catch (error) {
        console.error("Failed to fetch curation articles:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

