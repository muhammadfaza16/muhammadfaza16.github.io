import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const headerList = await headers();
        let ip = headerList.get("x-forwarded-for") || "unknown";
        
        // Handle multiple IPs in x-forwarded-for
        if (ip.includes(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        const userAgent = headerList.get("user-agent") || "unknown";

        // Parse body for songTitle, sessionId, and liveSessionId
        let songTitle = null;
        let sessionId = null;
        let liveSessionId = null;
        try {
            const body = await request.json();
            songTitle = body.songTitle || null;
            sessionId = body.sessionId || null;
            liveSessionId = body.liveSessionId || null;
        } catch (e) {}

        // 1. If sessionId is provided, try to find an existing session from the last 30 minutes
        if (sessionId) {
            const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
            const existingSession = await prisma.musicAccessLog.findFirst({
                where: {
                    sessionId,
                    timestamp: { gte: thirtyMinsAgo }
                } as any,
                orderBy: { timestamp: 'desc' }
            });

            if (existingSession) {
                // Update existing session
                const now = new Date();
                const durationSeconds = Math.floor((now.getTime() - existingSession.timestamp.getTime()) / 1000);
                
                await prisma.musicAccessLog.update({
                    where: { id: existingSession.id },
                    data: {
                        lastActive: now,
                        duration: durationSeconds,
                        // Update fields only if provided
                        ...(songTitle && { songTitle }),
                        // Safety: only update liveSessionId if the client supports it
                        ...(liveSessionId && { liveSessionId })
                    }
                });
                
                return NextResponse.json({ success: true, updated: true });
            }
        }

        // 2. Create new log entry if no session found or provided
        let geoData: any = {};
        if (ip !== "unknown" && ip !== "::1" && ip !== "127.0.0.1") {
            try {
                // Fetch in background-like manner (Next.js will wait for this before closing the route)
                const geoPromise = fetch(`https://ipapi.co/${ip}/json/`, { 
                    next: { revalidate: 86400 } 
                }).then(res => res.ok ? res.json() : {});
                
                geoData = await geoPromise;
            } catch (err) {
                console.error("Geo lookup failed:", err);
            }
        }

        try {
            await (prisma.musicAccessLog as any).create({
                data: {
                    ip,
                    userAgent,
                    songTitle,
                    sessionId,
                    liveSessionId,
                    city: geoData.city || null,
                    region: geoData.region || null,
                    country: geoData.country_name || null,
                    isp: geoData.org || null,
                    latitude: geoData.latitude || null,
                    longitude: geoData.longitude || null,
                    timezone: geoData.timezone || null,
                    postal: geoData.postal || null,
                    duration: 0
                },
            });
        } catch (createError: any) {
            console.error("Prisma primary log failed (schema desync?), attempting fallback:", createError.message);
            // Fallback: log without liveSessionId if the schema hasn't updated yet
            await (prisma.musicAccessLog as any).create({
                data: {
                    ip,
                    userAgent,
                    songTitle,
                    sessionId,
                    city: geoData.city || null,
                    region: geoData.region || null,
                    country: geoData.country_name || null,
                    isp: geoData.org || null,
                    latitude: geoData.latitude || null,
                    longitude: geoData.longitude || null,
                    timezone: geoData.timezone || null,
                    postal: geoData.postal || null,
                    duration: 0
                },
            });
        }

        return NextResponse.json({ success: true, created: true });
    } catch (error: any) {
        console.error("Critical logging error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || "Internal server error" 
        }, { status: 500 });
    }
}
