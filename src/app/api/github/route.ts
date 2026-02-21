import { NextResponse } from "next/server";

const USERNAME = "muhammadfaza16";

export async function GET() {
    try {
        // Get user profile
        const userRes = await fetch(`https://api.github.com/users/${USERNAME}`, {
            next: { revalidate: 3600 },
            headers: { "Accept": "application/vnd.github.v3+json" },
        });
        if (!userRes.ok) throw new Error("GitHub API failed");
        const user = await userRes.json();

        // Get recent events for streak calculation
        const eventsRes = await fetch(`https://api.github.com/users/${USERNAME}/events?per_page=100`, {
            next: { revalidate: 1800 },
            headers: { "Accept": "application/vnd.github.v3+json" },
        });
        const events = eventsRes.ok ? await eventsRes.json() : [];

        // Calculate streak from push events using WIB timezone strictly
        const getWIBDate = (d: string | Date) => new Date(d).toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
        const pushDates = new Set<string>();

        for (const event of events) {
            if (event.type === "PushEvent") {
                pushDates.add(getWIBDate(event.created_at));
            }
        }

        // Count consecutive days from "today" (in WIB) backwards
        let streak = 0;
        const todayStr = getWIBDate(new Date());

        for (let i = 0; i < 60; i++) {
            // Subtract exactly i days in UTC to get the rolling date, then format it to a WIB string
            const checkDate = new Date();
            checkDate.setUTCDate(checkDate.getUTCDate() - i);
            const checkStr = getWIBDate(checkDate);

            if (pushDates.has(checkStr)) {
                streak++;
            } else if (i > 0) {
                break; // Allow today (i=0) to not have a push yet
            }
        }

        return NextResponse.json({
            username: USERNAME,
            repos: user.public_repos,
            followers: user.followers,
            streak,
            avatar: user.avatar_url,
            todayActive: pushDates.has(todayStr),
            pushDates: Array.from(pushDates),
        });
    } catch {
        return NextResponse.json({
            username: USERNAME,
            repos: 0,
            followers: 0,
            streak: 0,
            avatar: "",
            todayActive: false,
            pushDates: [],
        });
    }
}
