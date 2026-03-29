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
        const { title, slug, description, philosophy, schedule, vibes, coverColor, coverImage, songIds } = await req.json();

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
                coverImage,
                // Add songs relation if songIds provided
                songs: songIds && Array.isArray(songIds) ? {
                    create: songIds.map((sid: string, index: number) => ({
                        songId: sid,
                        order: index
                    }))
                } : undefined
            }
        });

        return NextResponse.json({ success: true, playlist });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        // Sync songs if songIds provided
        if (body.songIds && Array.isArray(body.songIds)) {
            await prisma.$transaction([
                (prisma as any).playlistSong.deleteMany({
                    where: { playlistId: id }
                }),
                (prisma as any).playlistSong.createMany({
                    data: body.songIds.map((sid: string, index: number) => ({
                        playlistId: id,
                        songId: sid,
                        order: index
                    }))
                })
            ]);
        }

        // Only update metadata fields that were explicitly provided
        const updateData: Record<string, any> = {};
        if ('title' in body) updateData.title = body.title;
        if ('slug' in body) updateData.slug = body.slug;
        if ('description' in body) updateData.description = body.description;
        if ('philosophy' in body) updateData.philosophy = body.philosophy;
        if ('schedule' in body) updateData.schedule = body.schedule;
        if ('coverColor' in body) updateData.coverColor = body.coverColor;
        if ('coverImage' in body) updateData.coverImage = body.coverImage;
        if ('vibes' in body) {
            updateData.vibes = Array.isArray(body.vibes)
                ? body.vibes
                : body.vibes ? body.vibes.split(',').map((v: string) => v.trim()) : [];
        }

        // Only run update if there are fields to update
        let playlist;
        if (Object.keys(updateData).length > 0) {
            playlist = await (prisma as any).playlist.update({
                where: { id },
                data: updateData
            });
        } else {
            playlist = await (prisma as any).playlist.findUnique({ where: { id } });
        }

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
