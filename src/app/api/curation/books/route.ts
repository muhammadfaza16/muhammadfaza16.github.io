import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const status = searchParams.get("status");
        const sortBy = searchParams.get("sortBy") || "date";
        const cursor = searchParams.get("cursor");
        const limit = parseInt(searchParams.get("limit") || "12");

        const where: any = {};
        if (category) where.category = category;
        if (status) where.status = status;

        const orderBy: any = sortBy === "rating"
            ? [{ rating: "desc" as const }, { id: "desc" as const }]
            : [{ createdAt: "desc" as const }, { id: "desc" as const }];

        const books = await prisma.book.findMany({ 
            where, 
            orderBy,
            take: limit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
        });

        let nextCursor = null;
        if (books.length > limit) {
            books.pop();
            nextCursor = books[books.length - 1].id;
        }

        const totalCount = await prisma.book.count({ where });

        return NextResponse.json({ items: books, nextCursor, totalCount });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session")?.value === process.env.ADMIN_SECRET;
    if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        if (!body.title || !body.author) {
            return NextResponse.json({ error: "Title and author required" }, { status: 400 });
        }

        const book = await prisma.book.create({
            data: {
                title: body.title,
                author: body.author,
                url: body.url || null,
                review: body.review || null,
                imageUrl: body.imageUrl || null,
                status: body.status || "want-to-read",
                verdict: body.verdict || null,
                takeaways: body.takeaways || null,
                category: body.category || null,
                rating: body.rating || 0,
                finishedAt: body.finishedAt ? new Date(body.finishedAt) : null,
            },
        });

        return NextResponse.json({ success: true, data: book }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
