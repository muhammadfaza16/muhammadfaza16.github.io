import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — Check current live session status (admin)
export async function GET() {
    try {
        const session = await prisma.liveSession.findFirst({
            where: { isActive: true },
            include: {
                playlist: {
                    select: { id: true, title: true, slug: true, coverImage: true, coverColor: true }
                }
            }
        });

        return NextResponse.json({ success: true, session });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST — Start or stop a live session (admin)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, playlistId } = body;

        if (action === "start") {
            if (!playlistId) {
                return NextResponse.json({ success: false, error: "playlistId is required" }, { status: 400 });
            }

            // Deactivate any existing live session
            await prisma.liveSession.updateMany({
                where: { isActive: true },
                data: { isActive: false }
            });

            // Create new live session
            const session = await prisma.liveSession.create({
                data: {
                    playlistId,
                    startedAt: new Date(),
                    isActive: true
                },
                include: {
                    playlist: {
                        select: { id: true, title: true, slug: true }
                    }
                }
            });

            return NextResponse.json({ success: true, session });
        }

        if (action === "stop") {
            await prisma.liveSession.updateMany({
                where: { isActive: true },
                data: { isActive: false }
            });

            return NextResponse.json({ success: true, message: "Live session stopped" });
        }

        return NextResponse.json({ success: false, error: "Invalid action. Use 'start' or 'stop'." }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
