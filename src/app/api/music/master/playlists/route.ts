import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Provision Milena only
        const provisionData = [
            {
                slug: 'milena',
                title: 'Milena',
                description: 'Mysteries and melodies.',
                coverImage: '/images/playlist/milena.jpg',
                coverColor: '#1E1B4B'
            }
        ];

        for (const p of provisionData) {
            await (prisma as any).playlist.upsert({
                where: { slug: p.slug },
                update: {},
                create: p
            });
        }

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
                coverImage: coverImage || null,
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
        const { id, title, slug, description, philosophy, schedule, vibes, coverColor, coverImage, songIds } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        // Sync songs if songIds provided
        if (songIds && Array.isArray(songIds)) {
            // Transaction to ensure atomicity
            await prisma.$transaction([
                // Remove existing
                (prisma as any).playlistSong.deleteMany({
                    where: { playlistId: id }
                }),
                // Add new ones
                (prisma as any).playlistSong.createMany({
                    data: songIds.map((sid: string, index: number) => ({
                        playlistId: id,
                        songId: sid,
                        order: index
                    }))
                })
            ]);
        }

        const playlist = await (prisma as any).playlist.update({
            where: { id },
            data: {
                title,
                slug,
                description,
                philosophy,
                schedule,
                vibes: vibes !== undefined ? (Array.isArray(vibes) ? vibes : (vibes ? vibes.split(',').map((v: string) => v.trim()) : [])) : undefined,
                coverColor,
                coverImage: coverImage || null
            }
        });

        // Trigger cache revalidation
        if (slug) revalidatePath(`/music/playlist/${slug}`);
        revalidatePath('/music/playlist');
        revalidatePath('/music');

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
