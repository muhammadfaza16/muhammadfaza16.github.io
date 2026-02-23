import { NextResponse } from "next/server";

export async function GET() {
    // Determine the current day of the month in Jakarta time
    const wibDateString = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
    const wibDay = parseInt(wibDateString.split("-")[2], 10);
    try {
        // Fetch a batch of 50 random quotes and cache for 24 hours
        // This ensures we always have quotes available without hitting limits
        const res = await fetch("https://zenquotes.io/api/quotes", {
            next: { revalidate: 86400 }, // cache 24 hours
        });
        if (!res.ok) throw new Error("Quote API failed");
        const data = await res.json();

        // Index the quotes array based on the current WIB day and the hour of the day (changes every 6 hours)
        const now = new Date();
        const hour = parseInt(now.toLocaleTimeString("en-US", { hour: "numeric", hour12: false, timeZone: "Asia/Jakarta" }), 10);
        const quoteIndex = (wibDay * 4 + Math.floor(hour / 6));

        if (data && data.length > 0) {
            const quote = data[quoteIndex % data.length];
            return NextResponse.json({
                text: quote.q,
                author: quote.a,
            });
        }
        throw new Error("No quote");
    } catch {
        // Fallback personal quotes
        const fallbacks = [
            { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
            { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
            { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
            { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
            { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
        ];
        const now = new Date();
        const hour = parseInt(now.toLocaleTimeString("en-US", { hour: "numeric", hour12: false, timeZone: "Asia/Jakarta" }), 10);
        const fallbackIndex = (wibDay * 4 + Math.floor(hour / 6)) % fallbacks.length;
        return NextResponse.json(fallbacks[fallbackIndex]);
    }
}
