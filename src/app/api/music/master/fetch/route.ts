import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";

const execFileAsync = promisify(execFile);

// Paths to binaries
const YT_DLP_PATH = path.join(process.cwd(), "bin", "yt-dlp.exe");
const FFMPEG_PATH = "C:\\Users\\ThinkPad\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.0.1-full_build\\bin";
const DENO_PATH = "C:\\Users\\ThinkPad\\.deno\\bin";
const TMP_DIR = path.join(process.cwd(), "tmp");
const PUBLIC_AUDIO_DIR = path.join(process.cwd(), "public", "audio");

export const maxDuration = 120; // Allow up to 2 minutes for download + conversion

import { parseSongTitle, formatSongTitle } from "@/lib/music-naming";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { url } = body;

        if (!url || (!url.includes("youtube.com") && !url.includes("youtu.be"))) {
            return NextResponse.json({ success: false, error: "Invalid YouTube URL" }, { status: 400 });
        }

        // Clean URL (strip playlist params)
        const cleanUrl = url.split("&")[0];
        console.log(`[MASTER] Initiating yt-dlp fetch for: ${cleanUrl}`);

        // Ensure tmp dir exists
        await fs.mkdir(TMP_DIR, { recursive: true });

        // Step 1: Get video info (title, duration) via yt-dlp --print
        const infoResult = await execFileAsync(YT_DLP_PATH, [
            "--no-playlist",
            "--print", "%(title)s|||%(duration)s",
            cleanUrl
        ], {
            env: { ...process.env, PATH: `${DENO_PATH};${process.env.PATH}` },
            timeout: 30000
        });

        const [rawTitle, durationStr] = infoResult.stdout.trim().split("|||");
        const duration = parseInt(durationStr) || 0;
        const { artist, title } = parseSongTitle(rawTitle);

        console.log(`[MASTER] Discovered: ${artist} — ${title} (${duration}s)`);

        // Step 2: Download + convert to MP3 via yt-dlp + ffmpeg
        const outputTemplate = path.join(TMP_DIR, `${Date.now()}-%(title)s.%(ext)s`);

        await execFileAsync(YT_DLP_PATH, [
            "-x",
            "--audio-format", "mp3",
            "--audio-quality", "5",
            "--ffmpeg-location", FFMPEG_PATH,
            "-o", outputTemplate,
            "--no-playlist",
            cleanUrl
        ], {
            env: { ...process.env, PATH: `${DENO_PATH};${process.env.PATH}` },
            timeout: 90000 // 90 second timeout for download + conversion
        });

        // Find the generated MP3 file
        const files = await fs.readdir(TMP_DIR);
        const mp3File = files.find(f => f.endsWith(".mp3") && f.startsWith(String(Date.now()).slice(0, 8)));

        if (!mp3File) {
            // Fallback: find any recent mp3
            const allMp3 = files.filter(f => f.endsWith(".mp3"));
            if (allMp3.length === 0) throw new Error("MP3 file not found after conversion");
            // Use the most recent one
            const mp3Path = path.join(TMP_DIR, allMp3[allMp3.length - 1]);
            return await saveToPublic(mp3Path, artist, title, duration);
        }

        const mp3Path = path.join(TMP_DIR, mp3File);
        return await saveToPublic(mp3Path, artist, title, duration);

    } catch (error: any) {
        console.error("[MASTER] Fetch Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to fetch audio"
        }, { status: 500 });
    }
}

async function saveToPublic(mp3Path: string, artist: string, title: string, duration: number) {
    // Ensure public/audio directory exists
    await fs.mkdir(PUBLIC_AUDIO_DIR, { recursive: true });

    // Build filename matching existing convention: "Artist - Title.mp3"
    const fullTitle = artist ? `${artist} - ${title}` : title;

    // Sanitize for filesystem — keep readable, strip dangerous chars
    const safeFileName = fullTitle
        .replace(/[<>:"/\\|?*]/g, "")  // Remove filesystem-unsafe chars
        .replace(/\s+/g, " ")          // Normalize whitespace
        .trim()
        .slice(0, 100);                // Cap length

    const finalFileName = `${safeFileName}.mp3`;
    const destPath = path.join(PUBLIC_AUDIO_DIR, finalFileName);

    // Check for name collision — append timestamp if needed
    let actualDest = destPath;
    try {
        await fs.access(destPath);
        // File exists — append timestamp
        actualDest = path.join(PUBLIC_AUDIO_DIR, `${safeFileName} (${Date.now()}).mp3`);
        console.log(`[MASTER] Name collision, saving as: ${path.basename(actualDest)}`);
    } catch {
        // File doesn't exist, use original name
    }

    // Move MP3 from tmp to public/audio
    await fs.rename(mp3Path, actualDest);
    const savedFileName = path.basename(actualDest);

    console.log(`[MASTER] Saved to public/audio/${savedFileName} (${(await fs.stat(actualDest)).size} bytes)`);

    // Public URL served by Next.js static file serving
    const audioUrl = `/audio/${encodeURIComponent(savedFileName)}`;

    // Return data WITHOUT saving to DB — let user edit title first
    return NextResponse.json({
        success: true,
        suggestedArtist: artist,
        suggestedTitle: title,
        audioUrl,
        duration
    });
}

