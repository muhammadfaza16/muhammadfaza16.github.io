import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const weatherLabel = searchParams.get("weather") || "Clear";
    const temp = searchParams.get("temp") || "28";
    const dayName = searchParams.get("day") || "Thursday";
    const hour = searchParams.get("hour") || "12";
    const minute = searchParams.get("minute") || "0";

    const hNum = Number(hour);
    const mNum = Number(minute);

    // Natural Time Abstraction (12h format, conversational English)
    const hour12 = hNum % 12 === 0 ? 12 : hNum % 12;
    const nextHour12 = (hNum + 1) % 12 === 0 ? 12 : (hNum + 1) % 12;
    const amPm = hNum >= 12 ? "PM" : "AM";
    const nextAmPm = (hNum + 1) % 24 >= 12 ? "PM" : "AM";
    let naturalTime = `${hour12} ${amPm}`;

    if (mNum > 50) {
        naturalTime = `almost ${nextHour12} ${nextAmPm}`;
    } else if (mNum > 15) {
        naturalTime = `past ${hour12} ${amPm}`;
    }

    try {
        if (!process.env.GEMINI_API_KEY) throw new Error("No API key");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const timeOfDay = Number(hour) < 12 ? "morning" : Number(hour) < 17 ? "afternoon" : Number(hour) < 21 ? "evening" : "night";

        const prompt = `You are generating a short, highly concrete "time-smart" daily greeting for a personal website widget. Speak like a blunt but caring friend making a direct observation.

Context:
- Current Natural Time: ${naturalTime} (${timeOfDay})
- Weather: ${weatherLabel}, ${temp}°C
- Location: Jakarta Selatan, Indonesia

Rules:
- Maximum 15 words.
- No emoji.
- Make it a "time-smart quote". You MUST explicitly reference the tangible reality of the current natural time (e.g., "${naturalTime}", "Late at night", "This afternoon") AND/OR the exact weather/temperature.
- Be EXTREMELY substantive and relatable. Talk about what people actually do at this specific hour/weather (e.g., getting coffee, stuck in traffic, taking a nap, resting eyes from screens, finding food).
- AVOID ALL abstract, poetic, or generic philosophical platitudes (e.g., DO NOT say "time flows", "breathe deep", "everything works out").
- Start directly with the observation without generic hellos.
- Output ONLY the greeting in conversational, casual English.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        const text = response.text?.trim().replace(/^["']|["']$/g, "") || "Stay hydrated, the weather is pretty unpredictable.";

        return NextResponse.json({ greeting: text });
    } catch (error) {
        console.error("Gemini API error:", error);

        // Manual "Time-Smart" Fallbacks when Gemini API is rate-limited
        let fallbackText = "";
        const tNum = Number(temp);
        const isRaining = weatherLabel.toLowerCase().includes("rain") || weatherLabel.toLowerCase().includes("shower") || weatherLabel.toLowerCase().includes("pouring");

        if (hNum >= 22 || hNum < 4) {
            fallbackText = `It's already ${naturalTime}, give your eyes a rest from the screen.`;
        } else if (isRaining) {
            fallbackText = `It's ${tNum}°C and raining. Perfect time to stay in or take a nap.`;
        } else if (tNum > 30) {
            fallbackText = `It's ${naturalTime} and blistering at ${tNum} degrees. Stay hydrated.`;
        } else if (hNum >= 4 && hNum < 11) {
            fallbackText = `It's ${naturalTime}, ${tNum}°C outside. Great weather to grab some breakfast.`;
        } else if (hNum >= 11 && hNum < 15) {
            fallbackText = `It's ${naturalTime}, prime time to feel sleepy. Brew a quick coffee.`;
        } else if (hNum >= 15 && hNum < 19) {
            fallbackText = `It's ${naturalTime}, ${tNum}°C and ${weatherLabel.toLowerCase()}. Time to wind down for the day.`;
        } else {
            // Nighttime relax (19-22)
            fallbackText = `It's ${naturalTime}, take it easy and don't push yourself too hard tonight.`;
        }

        return NextResponse.json({ greeting: fallbackText });
    }
}
