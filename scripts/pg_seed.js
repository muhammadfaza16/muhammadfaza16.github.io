const { Client } = require('pg');

async function main() {
    const uri = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres";
    // The port 5432 usually needs the IPv4 address or db. Supabase pooler aws-0 works for direct IPv4 mostly,
    // We'll try the exact env var first:
    let directUrl = process.env.DIRECT_URL || "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

    const client = new Client({
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected to Supabase Postgres directly via pg driver.");

        console.log("Adding likes, reposts, replies columns...");
        await client.query(`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "likes" INTEGER NOT NULL DEFAULT 0;`);
        await client.query(`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "reposts" INTEGER NOT NULL DEFAULT 0;`);
        await client.query(`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "replies" INTEGER NOT NULL DEFAULT 0;`);
        console.log("Columns added or already exist.");

        // Seed data
        const res = await client.query(`SELECT id FROM "Article" WHERE "likes" = 0`);
        const articles = res.rows;
        console.log(`Found ${articles.length} articles to seed.`);

        let updatedCount = 0;
        for (const article of articles) {
            const likes = Math.floor(Math.random() * (1500 - 150)) + 150;
            const repostMultiplier = 0.10 + Math.random() * 0.15;
            const reposts = Math.floor(likes * repostMultiplier);
            const replyMultiplier = 0.02 + Math.random() * 0.06;
            const replies = Math.floor(likes * replyMultiplier);

            await client.query(
                `UPDATE "Article" SET "likes" = $1, "reposts" = $2, "replies" = $3 WHERE id = $4`,
                [likes, reposts, replies, article.id]
            );
            updatedCount++;
        }
        console.log(`Successfully seeded ${updatedCount} articles.`);
    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}

main();
