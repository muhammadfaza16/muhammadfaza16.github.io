import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { scoreArticle } from "@/lib/scoring";

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
        const filter = searchParams.get("filter") || "all";
        const queryText = searchParams.get("q");
        const category = searchParams.get("category");
        const sort = searchParams.get("sort") || "date"; // "date" or "quality"
        const limitStr = searchParams.get("limit");
        const limit = limitStr ? parseInt(limitStr) : 10;

        const where: any = {};
        if (filter === "unread") where.isRead = false;
        if (filter === "read") where.isRead = true;
        if (filter === "bookmarked") where.isBookmarked = true;

        if (queryText) {
            where.title = { contains: queryText, mode: "insensitive" };
        }

        if (category) {
            const categoriesContent = decodeURIComponent(category).split(",");
            // Filter by selected categories AND exclude __SUGGESTED__
            where.AND = [
                { category: categoriesContent.length === 1 ? categoriesContent[0] : { in: categoriesContent } },
                { category: { not: "__SUGGESTED__" } }
            ];
        } else {
            // No category selected: exclude __SUGGESTED__ but include null & all others
            where.OR = [
                { category: null },
                { category: { not: "__SUGGESTED__" } }
            ];
        }

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
                `SELECT "articleId", "total", "substance" FROM "ArticleScore" WHERE "articleId" = ANY($1::text[])`,
                articleIds
            );
            scoreMap = new Map(scores.map((s: any) => [s.articleId, s]));
        }

        const enriched = articles.map((a: any) => {
            const score = scoreMap.get(a.id);
            return {
                ...a,
                qualityScore: score?.total || null,
                substanceScore: score?.substance || null,
            };
        });

        return NextResponse.json({ articles: enriched, nextCursor });
    } catch (error) {
        console.error("Failed to fetch curation articles:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

