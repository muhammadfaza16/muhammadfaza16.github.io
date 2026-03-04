import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const radios = await (prisma as any).radio.findMany({
            include: {
                _count: {
                    select: { songs: true }
                }
            },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json({ success: true, radios });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { name, slug, description, themeColor } = await req.json();

        if (!name || !slug) {
            return NextResponse.json({ success: false, error: "Name and Slug are required" }, { status: 400 });
        }

        const radio = await (prisma as any).radio.create({
            data: { name, slug, description, themeColor }
        });

        return NextResponse.json({ success: true, radio });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, name, slug, description, themeColor } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        const radio = await (prisma as any).radio.update({
            where: { id },
            data: { name, slug, description, themeColor }
        });

        return NextResponse.json({ success: true, radio });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        await (prisma as any).radio.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
