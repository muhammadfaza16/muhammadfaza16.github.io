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

        // Monthly Benchmark Metrics
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const currentMonthTotalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

        let currentMonthPushCount = 0;
        const currentMonthActiveDates = new Set<string>();

        const getWIBDate = (d: string | Date) => new Date(d).toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
        const pushDates = new Set<string>();

        for (const event of events) {
            if (event.type === "PushEvent") {
                const eventDate = new Date(event.created_at);
                const wibDateStr = getWIBDate(eventDate);
                pushDates.add(wibDateStr);

                // Track current month activity
                if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
                    currentMonthPushCount += event.payload?.size || 1; // Number of commits in the push
                    currentMonthActiveDates.add(wibDateStr);
                }
            }
        }

        const todayStr = getWIBDate(now);

        return NextResponse.json({
            username: USERNAME,
            repos: user.public_repos,
            followers: user.followers,
            avatar: user.avatar_url,
            todayActive: pushDates.has(todayStr),
            pushDates: Array.from(pushDates),
            currentMonthActiveDays: currentMonthActiveDates.size,
            currentMonthTotalDays,
            currentMonthPushCount,
        });
    } catch {
        return NextResponse.json({
            username: USERNAME,
            repos: 0,
            followers: 0,
            avatar: "",
            todayActive: false,
            pushDates: [],
            currentMonthActiveDays: 0,
            currentMonthTotalDays: 30,
            currentMonthPushCount: 0,
        });
    }
}
