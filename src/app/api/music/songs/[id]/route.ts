import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Note: Prisma will handle deletion of related PlaylistSong entries if set to Cascade,
        // otherwise we might need to delete them manually if they are NOT set to Cascade.
        // Let's check or just try to delete the song.
        
        await prisma.song.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
