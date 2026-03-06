const { Client } = require('pg');
require('dotenv').config();

async function main() {
    let directUrl = process.env.DIRECT_URL || "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";

    const client = new Client({
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected to Supabase.");

        await client.query(`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "summary" TEXT;`);
        console.log("Column summary added.");
    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}
main();
