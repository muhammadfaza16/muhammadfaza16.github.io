import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const playlists = await (prisma as any).playlist.findMany({
            include: {
                _count: {
                    select: { songs: true }
                }
            },
            orderBy: { title: 'asc' }
        });
        return NextResponse.json({ success: true, playlists });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { title, slug, description, philosophy, schedule, vibes, coverColor, coverImage } = await req.json();

        if (!title || !slug) {
            return NextResponse.json({ success: false, error: "Title and Slug are required" }, { status: 400 });
        }

        const playlist = await (prisma as any).playlist.create({
            data: {
                title,
                slug,
                description,
                philosophy,
                schedule,
                vibes: Array.isArray(vibes) ? vibes : vibes ? vibes.split(',').map((v: string) => v.trim()) : [],
                coverColor,
                coverImage
            }
        });

        return NextResponse.json({ success: true, playlist });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, title, slug, description, philosophy, schedule, vibes, coverColor, coverImage } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        const playlist = await (prisma as any).playlist.update({
            where: { id },
            data: {
                title,
                slug,
                description,
                philosophy,
                schedule,
                vibes: Array.isArray(vibes) ? vibes : vibes ? vibes.split(',').map((v: string) => v.trim()) : [],
                coverColor,
                coverImage
            }
        });

        return NextResponse.json({ success: true, playlist });
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

        await (prisma as any).playlist.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
