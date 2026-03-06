const { Client } = require('pg');

async function main() {
    const directUrl = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
    const client = new Client({
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // Find articles with null or empty category (excluding __SUGGESTED__)
        const res = await client.query(`SELECT id, title FROM "Article" WHERE category IS NULL OR category = '' AND category != '__SUGGESTED__'`);

        if (res.rows.length === 0) {
            console.log("No articles without a category found.");
            return;
        }

        console.log(`Found ${res.rows.length} uncategorized articles:`);
        for (const article of res.rows) {
            console.log(`- ${article.title}`);

            // We'll just assign a generic category "Uncategorized" or "Engineering"
            const defaultCategory = "Tech"; // Just an example, can be adjusted
            await client.query(`UPDATE "Article" SET category = $1 WHERE id = $2`, [defaultCategory, article.id]);
            console.log(`  Assigned category: ${defaultCategory}`);
        }
    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}

main();
