import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

const ADMIN_PASSWORD = "faza123";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const password = formData.get("adminPassword") as string;

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
        const relativePath = `/images/blog/${filename}`;
        const absolutePath = path.join(process.cwd(), "public/images/blog", filename);

        await writeFile(absolutePath, buffer);

        return NextResponse.json({ url: relativePath });
    } catch (e) {
        console.error("Upload error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
