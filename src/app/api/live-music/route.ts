import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — Check current live session status (admin) — returns ALL active sessions
export async function GET() {
    try {
        const sessions = await prisma.liveSession.findMany({
            where: { isActive: true },
            include: {
                playlist: {
                    select: { id: true, title: true, slug: true, coverImage: true, coverColor: true }
                }
            },
            orderBy: { startedAt: "desc" }
        });

        return NextResponse.json({ success: true, sessions });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST — Start or stop a live session (admin)
// Now supports multiple concurrent sessions
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, playlistId, sessionId, title, description } = body;

        if (action === "start") {
            if (!playlistId) {
                return NextResponse.json({ success: false, error: "playlistId is required" }, { status: 400 });
            }

            // Create new live session (no longer deactivates existing ones)
            const session = await prisma.liveSession.create({
                data: {
                    playlistId,
                    title: title || null,
                    description: description || null,
                    startedAt: new Date(),
                    isActive: true
                },
                include: {
                    playlist: {
                        select: { id: true, title: true, slug: true, coverImage: true, coverColor: true }
                    }
                }
            });

            revalidatePath("/music");
            revalidatePath("/music/live-hub");

            return NextResponse.json({ success: true, session });
        }

        if (action === "stop") {
            if (sessionId) {
                // Stop a specific session
                await prisma.liveSession.update({
                    where: { id: sessionId },
                    data: { isActive: false }
                });
                revalidatePath("/music");
                revalidatePath("/music/live-hub");
                return NextResponse.json({ success: true, message: `Session ${sessionId} stopped` });
            } else {
                // Stop all sessions (backward compatible)
                await prisma.liveSession.updateMany({
                    where: { isActive: true },
                    data: { isActive: false }
                });
                revalidatePath("/music");
                revalidatePath("/music/live-hub");
                return NextResponse.json({ success: true, message: "All live sessions stopped" });
            }
        }

        return NextResponse.json({ success: false, error: "Invalid action. Use 'start' or 'stop'." }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
