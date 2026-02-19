import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("https://zenquotes.io/api/today", {
            next: { revalidate: 3600 }, // cache 1 hour
        });
        if (!res.ok) throw new Error("Quote API failed");
        const data = await res.json();

        if (data && data[0]) {
            return NextResponse.json({
                text: data[0].q,
                author: data[0].a,
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
        const today = new Date().getDate();
        return NextResponse.json(fallbacks[today % fallbacks.length]);
    }
}
