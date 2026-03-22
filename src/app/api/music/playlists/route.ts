import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const playlists = await prisma.playlist.findMany({
            orderBy: {
                createdAt: "asc"
            },
            include: {
                _count: {
                    select: { songs: true }
                }
            }
        });

        return NextResponse.json({ success: true, playlists });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
