import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const radios = await prisma.radio.findMany({
            include: {
                songs: {
                    include: {
                        song: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        // Format beautifully for the frontend RadioContext
        const formattedRadios = radios.map((r: any) => ({
            id: r.id,
            slug: r.slug,
            name: r.name,
            description: r.description || "",
            themeColor: r.themeColor,
            playlist: r.songs.map((rs: any) => ({
                title: rs.song.title,
                audioUrl: rs.song.audioUrl,
                duration: rs.song.duration || 180 // Fallback to 3m
            }))
        }));

        return NextResponse.json({ success: true, radios: formattedRadios });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
