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

        // Fetch multiple pages of events for better coverage
        const allEvents: any[] = [];
        for (let page = 1; page <= 3; page++) {
            const eventsRes = await fetch(
                `https://api.github.com/users/${USERNAME}/events?per_page=100&page=${page}`,
                {
                    next: { revalidate: 1800 },
                    headers: { "Accept": "application/vnd.github.v3+json" },
                }
            );
            if (!eventsRes.ok) break;
            const pageEvents = await eventsRes.json();
            if (pageEvents.length === 0) break;
            allEvents.push(...pageEvents);
        }

        // Monthly Benchmark Metrics
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const currentMonthTotalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

        let currentMonthPushCount = 0;
        const currentMonthActiveDates = new Set<string>();
        let recentRepo: string | null = null;

        const getWIBDate = (d: string | Date) => new Date(d).toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
        const pushDates = new Set<string>();

        // Track more event types for accurate activity data
        const ACTIVE_EVENTS = [
            "PushEvent",
            "CreateEvent",
            "PullRequestEvent",
            "IssueCommentEvent",
            "IssuesEvent",
            "CommitCommentEvent",
            "DeleteEvent",
            "ForkEvent",
            "ReleaseEvent",
            "PullRequestReviewEvent",
        ];

        for (const event of allEvents) {
            if (ACTIVE_EVENTS.includes(event.type)) {
                if (!recentRepo && event.repo?.name) {
                    recentRepo = event.repo.name.replace(`${USERNAME}/`, "");
                }
                const eventDate = new Date(event.created_at);
                const wibDateStr = getWIBDate(eventDate);
                pushDates.add(wibDateStr);

                // Track current month activity
                const eventMonth = new Date(wibDateStr).getMonth();
                const eventYear = new Date(wibDateStr).getFullYear();
                if (eventMonth === currentMonth && eventYear === currentYear) {
                    if (event.type === "PushEvent") {
                        currentMonthPushCount += event.payload?.size || 1;
                    }
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
            recentRepo,
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
