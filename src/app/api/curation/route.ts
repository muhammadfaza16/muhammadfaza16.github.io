import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
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
        const limitStr = searchParams.get("limit");
        const limit = limitStr ? parseInt(limitStr) : 10;

        const where: any = {};
        if (filter === "unread") where.isRead = false;
        if (filter === "read") where.isRead = true;

        const query: any = {
            take: limit + 1, // Fetch one extra to determine if there is a next page
            where,
            orderBy: { createdAt: "desc" },
        };

        if (cursor) {
            query.cursor = { id: cursor };
            query.skip = 1; // Skip the cursor itself
        }

        const articles = await prisma.article.findMany(query);

        let nextCursor = null;
        if (articles.length > limit) {
            articles.pop(); // Remove the extra item
            nextCursor = articles[articles.length - 1].id; // The last valid item on this page
        }

        return NextResponse.json({ articles, nextCursor });
    } catch (error) {
        console.error("Failed to fetch curation articles:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
