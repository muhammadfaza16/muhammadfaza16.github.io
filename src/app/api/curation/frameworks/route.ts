import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const type = searchParams.get("type");
        const sortBy = searchParams.get("sortBy") || "date";
        const cursor = searchParams.get("cursor");
        const limit = parseInt(searchParams.get("limit") || "12");

        const where: any = {};
        if (category) where.category = category;
        if (type) where.type = type;

        const orderBy: any = [{ createdAt: "desc" as const }, { id: "desc" as const }];

        const frameworks = await prisma.framework.findMany({
            where,
            orderBy,
            take: limit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
        });

        let nextCursor = null;
        if (frameworks.length > limit) {
            frameworks.pop();
            nextCursor = frameworks[frameworks.length - 1].id;
        }

        const totalCount = await prisma.framework.count({ where });

        return NextResponse.json({ items: frameworks, nextCursor, totalCount });
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
        if (!body.name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const framework = await prisma.framework.create({
            data: {
                name: body.name,
                type: body.type || "mental-model",
                summary: body.summary || null,
                content: body.content || null,
                source: body.source || null,
                whenToUse: body.whenToUse || null,
                category: body.category || null,
                imageUrl: body.imageUrl || null,
            },
        });

        return NextResponse.json({ success: true, data: framework }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
