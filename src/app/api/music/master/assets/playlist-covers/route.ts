
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const COVERS_DIR = path.join(process.cwd(), "public", "images", "playlist");

export async function GET() {
    try {
        if (!fs.existsSync(COVERS_DIR)) {
            return NextResponse.json({ success: true, covers: [] });
        }

        const files = fs.readdirSync(COVERS_DIR);
        const images = files.filter(file => 
            /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file) && 
            !file.startsWith(".")
        );

        return NextResponse.json({ success: true, covers: images });
    } catch (error) {
        console.error("Failed to list covers:", error);
        return NextResponse.json({ success: false, error: "Failed to list covers" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ success: false, error: "Invalid file type. Use JPG, PNG, or WebP." }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ success: false, error: "File too large. Max 5MB." }, { status: 400 });
        }

        // Ensure directory exists
        if (!fs.existsSync(COVERS_DIR)) {
            fs.mkdirSync(COVERS_DIR, { recursive: true });
        }

        // Sanitize filename: lowercase, replace spaces with underscores
        const ext = path.extname(file.name).toLowerCase();
        const baseName = path.basename(file.name, path.extname(file.name))
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '_')
            .replace(/_+/g, '_');
        
        let finalName = `${baseName}${ext}`;
        
        // Avoid overwriting: append suffix if file exists
        let counter = 1;
        while (fs.existsSync(path.join(COVERS_DIR, finalName))) {
            finalName = `${baseName}_${counter}${ext}`;
            counter++;
        }

        // Write file
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(COVERS_DIR, finalName), buffer);

        return NextResponse.json({ 
            success: true, 
            filename: finalName,
            url: `/images/playlist/${finalName}`
        });
    } catch (error: any) {
        console.error("Upload failed:", error);
        return NextResponse.json({ success: false, error: error.message || "Upload failed" }, { status: 500 });
    }
}
