import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, error: "Song ID is required" }, { status: 400 });
        }

        // Cascade delete will remove all PlaylistSong and RadioSong relations
        await prisma.song.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ success: false, error: "Song not found" }, { status: 404 });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
