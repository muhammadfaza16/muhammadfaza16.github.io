import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const framework = await prisma.framework.findUnique({ where: { id } });
        if (!framework) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: framework });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session")?.value === process.env.ADMIN_SECRET;
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const framework = await prisma.framework.update({ where: { id }, data: body });
        return NextResponse.json({ success: true, data: framework });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session")?.value === process.env.ADMIN_SECRET;
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        await prisma.framework.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
