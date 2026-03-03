import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
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
            return await uploadOnly(mp3Path, artist, title, duration);
        }

        const mp3Path = path.join(TMP_DIR, mp3File);
        return await uploadOnly(mp3Path, artist, title, duration);

    } catch (error: any) {
        console.error("[MASTER] Fetch Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to fetch audio"
        }, { status: 500 });
    }
}

async function uploadOnly(mp3Path: string, artist: string, title: string, duration: number) {
    // Read the MP3 buffer
    const audioBuffer = await fs.readFile(mp3Path);
    console.log(`[MASTER] MP3 ready. Size: ${audioBuffer.length} bytes. Uploading to Supabase...`);

    // Setup Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase credentials");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Final full title for filename
    const fullTitle = artist ? `${artist} — ${title}` : title;

    // Sanitize filename for Supabase Storage
    const safeFileName = fullTitle
        .replace(/\s*—\s*/g, "-")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_")
        .slice(0, 60);
    const fileName = `audio/${Date.now()}-${safeFileName}.mp3`;
    const bucketName = "images";

    const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, audioBuffer, { contentType: "audio/mpeg", upsert: true });

    if (uploadError) {
        console.error("[MASTER] Upload Error:", uploadError);
        throw new Error(`Upload Failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;
    console.log(`[MASTER] Upload success: ${publicUrl}`);

    // Cleanup temp file
    await fs.unlink(mp3Path).catch(() => { });

    // Return data WITHOUT saving to DB — let user edit title first
    return NextResponse.json({
        success: true,
        suggestedArtist: artist,
        suggestedTitle: title,
        audioUrl: publicUrl,
        duration
    });
}

