const { Client } = require('pg');

async function main() {
    const directUrl = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
    const client = new Client({
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // Let's see how many articles have category = 'Tech'
        const res = await client.query(`SELECT id, title, "createdAt", "updatedAt" FROM "Article" WHERE category = 'Tech'`);
        console.log(`There are ${res.rows.length} articles with category 'Tech'.`);

        // Revert all 155 articles back to NULL
        const updateRes = await client.query(`UPDATE "Article" SET category = NULL WHERE category = 'Tech'`);
        console.log(`Successfully reverted ${updateRes.rowCount} articles back to NULL category.`);

    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}

main();
