const { Client } = require('pg');

async function main() {
    const directUrl = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
    const client = new Client({
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`SELECT category, COUNT(*) FROM "Article" GROUP BY category`);
        console.log("Current Categories:");
        res.rows.forEach(r => console.log(`- ${r.category}: ${r.count}`));
    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}

main();
