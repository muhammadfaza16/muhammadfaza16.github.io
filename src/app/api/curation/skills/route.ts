import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const difficulty = searchParams.get("difficulty");
        const sortBy = searchParams.get("sortBy") || "date";
        const cursor = searchParams.get("cursor");
        const limit = parseInt(searchParams.get("limit") || "12");

        const where: any = {};
        if (category) where.category = category;
        if (difficulty) where.difficulty = difficulty;

        const orderBy: any = [{ createdAt: "desc" as const }, { id: "desc" as const }];

        const courses = await prisma.course.findMany({
            where,
            orderBy,
            take: limit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
        });

        let nextCursor = null;
        if (courses.length > limit) {
            courses.pop();
            nextCursor = courses[courses.length - 1].id;
        }

        const totalCount = await prisma.course.count({ where });

        return NextResponse.json({ items: courses, nextCursor, totalCount });
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

        const course = await prisma.course.create({
            data: {
                title: body.title,
                content: body.content || null,
                source: body.source || null,
                sourceType: body.sourceType || null,
                category: body.category || null,
                difficulty: body.difficulty || null,
                imageUrl: body.imageUrl || null,
                url: body.url || null,
            },
        });

        return NextResponse.json({ success: true, data: course }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
