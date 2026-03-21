import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const domain = searchParams.get("domain");
        const sortBy = searchParams.get("sortBy") || "date";
        const cursor = searchParams.get("cursor");
        const limit = parseInt(searchParams.get("limit") || "12");

        const where: any = {};
        if (category) where.category = category;
        if (domain) where.domain = domain;

        const orderBy: any = [{ createdAt: "desc" as const }, { id: "desc" as const }];

        const entries = await prisma.codex.findMany({
            where,
            orderBy,
            take: limit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
        });

        let nextCursor = null;
        if (entries.length > limit) {
            entries.pop();
            nextCursor = entries[entries.length - 1].id;
        }

        const totalCount = await prisma.codex.count({ where });

        return NextResponse.json({ items: entries, nextCursor, totalCount });
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
        if (!body.title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const entry = await prisma.codex.create({
            data: {
                title: body.title,
                domain: body.domain || null,
                content: body.content || null,
                conviction: body.conviction || null,
                status: body.status || "evolving",
                category: body.category || null,
            },
        });

        return NextResponse.json({ success: true, data: entry }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
