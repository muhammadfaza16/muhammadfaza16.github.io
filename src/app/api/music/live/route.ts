import { NextResponse } from "next/server";
import { getLiveRadioStatus } from "@/lib/liveRadio";

export async function GET() {
    try {
        const status = await getLiveRadioStatus();
        return NextResponse.json({ success: true, ...status });
    } catch (error: any) {
        console.error("Live API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
