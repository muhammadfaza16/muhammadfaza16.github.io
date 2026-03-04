import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "create_table";

    try {
        if (action === "create_table") {
            await prisma.$executeRawUnsafe(`
                CREATE TABLE IF NOT EXISTS "ArticleScore" (
                    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
                    "articleId" TEXT NOT NULL UNIQUE,
                    "substance" INTEGER NOT NULL DEFAULT 0,
                    "depth" INTEGER NOT NULL DEFAULT 0,
                    "structure" INTEGER NOT NULL DEFAULT 0,
                    "vocabulary" INTEGER NOT NULL DEFAULT 0,
                    "readability" INTEGER NOT NULL DEFAULT 0,
                    "specificity" INTEGER NOT NULL DEFAULT 0,
                    "actionability" INTEGER NOT NULL DEFAULT 0,
                    "engagement" INTEGER NOT NULL DEFAULT 0,
                    "total" INTEGER NOT NULL DEFAULT 0,
                    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    CONSTRAINT "ArticleScore_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE
                )
            `);
            return NextResponse.json({ success: true, message: "ArticleScore table created!" });
        }

        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { articleId, substance, depth, structure, vocabulary, readability, specificity, actionability, engagement, total } = data;

        if (!articleId) {
            return NextResponse.json({ error: "Missing articleId" }, { status: 400 });
        }

        // Upsert using raw SQL since Prisma client may cache
        await prisma.$executeRawUnsafe(`
            INSERT INTO "ArticleScore" ("id", "articleId", "substance", "depth", "structure", "vocabulary", "readability", "specificity", "actionability", "engagement", "total", "updatedAt")
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
            ON CONFLICT ("articleId") DO UPDATE SET
                "substance" = $2, "depth" = $3, "structure" = $4, "vocabulary" = $5,
                "readability" = $6, "specificity" = $7, "actionability" = $8, "engagement" = $9,
                "total" = $10, "updatedAt" = NOW()
        `, articleId, substance, depth, structure, vocabulary, readability, specificity, actionability, engagement, total);

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}
