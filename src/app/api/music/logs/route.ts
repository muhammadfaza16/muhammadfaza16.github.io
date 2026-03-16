import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const ADMIN_PASSWORD = "faza123";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const password = searchParams.get("password");

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const logs = await prisma.musicAccessLog.findMany({
            orderBy: {
                timestamp: "desc",
            },
            take: 100, // Limit to last 100 logs
        });

        return NextResponse.json({ success: true, logs });
    } catch (error: any) {
        console.error("Failed to fetch access logs:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || "Internal Server Error",
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
