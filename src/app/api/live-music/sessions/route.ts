import { NextResponse } from "next/server";
import { getEnrichedLiveSessions } from "@/utils/liveUtils";

export const dynamic = "force-dynamic";

// GET — Public endpoint: list all active live sessions for the Live Hub
export async function GET() {
    try {
        const enrichedSessions = await getEnrichedLiveSessions();
        return NextResponse.json({ sessions: enrichedSessions });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
