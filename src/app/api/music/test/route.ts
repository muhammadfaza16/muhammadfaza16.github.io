import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const playlistId = "3fa48762-4194-49d8-bdac-954667f3c14b";
        const songId = "d0046a6f-fd74-4b53-bafa-f2bfdd753b0e";

        // Verify song exists
        const song = await prisma.song.findUnique({ where: { id: songId } });
        if (!song) return NextResponse.json({ success: false, error: "Song not found" });

        const link = await (prisma as any).playlistSong.upsert({
            where: {
                playlistId_songId: {
                    playlistId,
                    songId
                }
            },
            update: {},
            create: {
                playlistId,
                songId
            }
        });

        return NextResponse.json({ success: true, link });
    } catch (error: any) {
        return NextResponse.json({ success: false, errorMessage: error.message, errorStack: error.stack });
    }
}
