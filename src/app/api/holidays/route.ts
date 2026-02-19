import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year") || new Date().getFullYear().toString();

    try {
        const res = await fetch(
            `https://date.nager.at/api/v3/PublicHolidays/${year}/ID`,
            { next: { revalidate: 86400 } } // cache 24 hours
        );
        if (!res.ok) throw new Error("Holidays API failed");
        const data = await res.json();

        // Return simplified format: { date: "YYYY-MM-DD", name: string, localName: string }
        const holidays = data.map((h: { date: string; name: string; localName: string }) => ({
            date: h.date,
            name: h.name,
            localName: h.localName,
        }));

        return NextResponse.json({ holidays });
    } catch {
        return NextResponse.json({ holidays: [] });
    }
}
