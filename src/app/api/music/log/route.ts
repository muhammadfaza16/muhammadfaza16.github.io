import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST() {
    try {
        const headerList = await headers();
        let ip = headerList.get("x-forwarded-for") || "unknown";
        
        // Handle multiple IPs in x-forwarded-for
        if (ip.includes(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        const userAgent = headerList.get("user-agent") || "unknown";

        let geoData: any = {
            city: null,
            region: null,
            country_name: null,
            org: null
        };

        // Skip lookup for local IP
        if (ip !== "unknown" && ip !== "::1" && ip !== "127.0.0.1") {
            try {
                // Using ipapi.co as it was in the user's provided list
                const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, { 
                    next: { revalidate: 86400 } // Cache for 24 hours
                });
                if (geoRes.ok) {
                    geoData = await geoRes.json();
                }
            } catch (err) {
                console.error("Geo lookup failed:", err);
            }
        }

        await prisma.musicAccessLog.create({
            data: {
                ip,
                userAgent,
                city: geoData.city || null,
                region: geoData.region || null,
                country: geoData.country_name || null,
                isp: geoData.org || null
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to log music access:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
