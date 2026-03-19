import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const domain = searchParams.get("domain");

        const where: any = {};
        if (category) where.category = category;
        if (domain) where.domain = domain;

        const entries = await prisma.codex.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ items: entries, totalCount: entries.length });
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
