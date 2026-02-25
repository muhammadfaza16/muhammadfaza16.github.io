import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// ESPN public API — free, no key required
const LEAGUES = [
    { id: "eng.1", name: "Premier League", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { id: "esp.1", name: "La Liga", emoji: "🇪🇸" },
    { id: "uefa.champions", name: "Champions League", emoji: "🇪🇺" },
];

// Big teams only
const BIG_TEAMS = new Set([
    // EPL
    "Manchester City", "Man City",
    "Manchester United", "Man United",
    "Chelsea", "Liverpool", "Arsenal", "Tottenham", "Aston Villa",
    // La Liga
    "Real Madrid", "Barcelona", "Atletico Madrid", "Atlético Madrid",
    // Serie A
    "Juventus", "Inter Milan", "Inter", "AC Milan", "Napoli", "AS Roma",
    // Bundesliga
    "Bayern Munich", "Bayern", "Borussia Dortmund", "Dortmund", "Bayer Leverkusen",
    // Ligue 1
    "Paris Saint-Germain", "PSG",
]);

interface ESPNEvent {
    name: string;
    date: string;
    status: { type: { description: string; state: string; shortDetail?: string } };
    competitions: {
        competitors: {
            team: { id: string; shortDisplayName: string; abbreviation: string; logo: string };
            homeAway: string;
            score?: string;
        }[];
        details?: {
            type: { text: string };
            clock: { displayValue: string };
            team: { id: string };
            athletesInvolved?: { shortName: string }[];
        }[];
    }[];
}

export async function GET() {
    try {
        const allMatches: {
            home: string;
            homeAbbr: string;
            homeLogo: string;
            away: string;
            awayAbbr: string;
            awayLogo: string;
            date: string;
            time: string;
            league: string;
            leagueEmoji: string;
            status: string;
            state: string;
            liveMinute?: string;
            homeScore?: string;
            awayScore?: string;
            homeScorers: { name: string; time: string }[];
            awayScorers: { name: string; time: string }[];
            isBigMatch: boolean;
        }[] = [];

        await Promise.all(
            LEAGUES.map(async (league) => {
                try {
                    // Fetch past 7 days up to next 10 days of fixtures
                    const now = new Date();
                    const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    const end = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
                    const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");
                    const dateRange = `${fmt(start)}-${fmt(end)}`;

                    const res = await fetch(
                        `https://site.api.espn.com/apis/site/v2/sports/soccer/${league.id}/scoreboard?dates=${dateRange}`,
                        { next: { revalidate: 60 } } // Aggressive cache: 60 seconds for live matches
                    );
                    if (!res.ok) return;
                    const data = await res.json();

                    for (const event of (data.events || []) as ESPNEvent[]) {
                        const comp = event.competitions[0];
                        const home = comp.competitors.find((c) => c.homeAway === "home");
                        const away = comp.competitors.find((c) => c.homeAway === "away");
                        if (!home || !away) continue;

                        const isBig =
                            BIG_TEAMS.has(home.team.shortDisplayName) ||
                            BIG_TEAMS.has(away.team.shortDisplayName);

                        const d = new Date(event.date);

                        const homeScorers: { name: string; time: string }[] = [];
                        const awayScorers: { name: string; time: string }[] = [];

                        if (comp.details) {
                            for (const detail of comp.details) {
                                if (detail.type.text.includes("Goal") && detail.athletesInvolved && detail.athletesInvolved.length > 0) {
                                    const scorer = {
                                        name: detail.athletesInvolved[0].shortName,
                                        time: detail.clock.displayValue
                                    };
                                    if (detail.team.id === home.team.id) {
                                        homeScorers.push(scorer);
                                    } else if (detail.team.id === away.team.id) {
                                        awayScorers.push(scorer);
                                    }
                                }
                            }
                        }

                        allMatches.push({
                            home: home.team.shortDisplayName,
                            homeAbbr: home.team.abbreviation,
                            homeLogo: home.team.logo,
                            away: away.team.shortDisplayName,
                            awayAbbr: away.team.abbreviation,
                            awayLogo: away.team.logo,
                            date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" }),
                            time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }),
                            league: league.name,
                            leagueEmoji: league.emoji,
                            status: event.status.type.description,
                            state: event.status.type.state,
                            liveMinute: event.status.type.state === "in" ? event.status.type.shortDetail : undefined,
                            homeScore: home.score,
                            awayScore: away.score,
                            homeScorers,
                            awayScorers,
                            isBigMatch: isBig,
                        });
                    }
                } catch {
                    // skip failed league
                }
            })
        );

        // Sort by date, big matches first within same day
        allMatches.sort((a, b) => {
            const da = new Date(`${a.date} ${a.time}`).getTime();
            const db = new Date(`${b.date} ${b.time}`).getTime();
            if (da !== db) return da - db;
            if (a.isBigMatch && !b.isBigMatch) return -1;
            if (!a.isBigMatch && b.isBigMatch) return 1;
            return 0;
        });

        return NextResponse.json({ matches: allMatches });
    } catch {
        return NextResponse.json({ matches: [] });
    }
}
