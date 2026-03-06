const { Client } = require('pg');
const fs = require('fs');

async function main() {
    const directUrl = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
    const client = new Client({
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`SELECT id, title FROM "Article" WHERE category != '__SUGGESTED__' OR category IS NULL`);

        fs.writeFileSync('articles_dump.json', JSON.stringify(res.rows, null, 2));
        console.log(`Dumped ${res.rows.length} articles to articles_dump.json`);
    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}

main();
