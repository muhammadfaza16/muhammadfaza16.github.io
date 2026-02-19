import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const weatherLabel = searchParams.get("weather") || "Clear";
    const temp = searchParams.get("temp") || "28";
    const dayName = searchParams.get("day") || "Thursday";
    const hour = searchParams.get("hour") || "12";

    try {
        const timeOfDay = Number(hour) < 12 ? "morning" : Number(hour) < 17 ? "afternoon" : Number(hour) < 21 ? "evening" : "night";

        const prompt = `You are generating a short, personal daily greeting for a developer's personal website widget. The greeting should feel warm, human and poetic — like a message from a thoughtful friend.

Context:
- It's ${dayName} ${timeOfDay}
- Weather: ${weatherLabel}, ${temp}°C
- Location: Jakarta Selatan, Indonesia
- The person is a young developer/student

Rules:
- Maximum 15 words
- No emoji
- Be creative, vary tone: sometimes witty, sometimes gentle, sometimes inspiring
- Reference the weather or time naturally
- Don't start with "Good morning/afternoon" — be more creative
- Write in English
- Output ONLY the greeting, nothing else`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        const text = response.text?.trim().replace(/^["']|["']$/g, "") || "Another day to build something beautiful.";

        return NextResponse.json({ greeting: text });
    } catch (error) {
        console.error("Gemini API error:", error);
        // Fallback greetings
        const fallbacks = [
            "Another day to build something beautiful.",
            "The code awaits your creative touch.",
            "Let the rhythm of the rain inspire your next commit.",
            "Clear skies, clear mind — time to create.",
            "Every line of code tells a story.",
        ];
        const idx = new Date().getHours() % fallbacks.length;
        return NextResponse.json({ greeting: fallbacks[idx] });
    }
}
