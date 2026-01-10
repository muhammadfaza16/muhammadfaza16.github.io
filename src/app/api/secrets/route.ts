import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ADMIN_PASSWORD = "faza123";
const SECRETS_FILE = path.join(process.cwd(), "src/data/secrets.json");

interface SecretMessage {
    id: string;
    title: string;
    encryptedContent: string;
    hint?: string;
    createdAt: string;
    emoji?: string;
}

// GET - Read all secrets
export async function GET() {
    try {
        const data = fs.readFileSync(SECRETS_FILE, "utf-8");
        const secrets = JSON.parse(data);
        return NextResponse.json(secrets);
    } catch {
        return NextResponse.json([]);
    }
}

// POST - Add new secret
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { adminPassword, secret } = body as { adminPassword: string; secret: SecretMessage };

        // Verify admin password
        if (adminPassword !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Read existing secrets
        let secrets: SecretMessage[] = [];
        try {
            const data = fs.readFileSync(SECRETS_FILE, "utf-8");
            secrets = JSON.parse(data);
        } catch {
            // File doesn't exist, start with empty array
        }

        // Add new secret
        secrets.push(secret);

        // Write back to file
        fs.writeFileSync(SECRETS_FILE, JSON.stringify(secrets, null, 4), "utf-8");

        return NextResponse.json({ success: true, message: "Secret added!" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save secret" }, { status: 500 });
    }
}

// DELETE - Remove a secret
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { adminPassword, id } = body as { adminPassword: string; id: string };

        // Verify admin password
        if (adminPassword !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Read existing secrets
        const data = fs.readFileSync(SECRETS_FILE, "utf-8");
        let secrets: SecretMessage[] = JSON.parse(data);

        // Filter out the secret to delete
        secrets = secrets.filter(s => s.id !== id);

        // Write back
        fs.writeFileSync(SECRETS_FILE, JSON.stringify(secrets, null, 4), "utf-8");

        return NextResponse.json({ success: true, message: "Secret deleted!" });
    } catch {
        return NextResponse.json({ error: "Failed to delete secret" }, { status: 500 });
    }
}
