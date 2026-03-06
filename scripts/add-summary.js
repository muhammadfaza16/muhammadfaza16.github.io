const { Client } = require('pg');

const connectionString = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres";

async function main() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log("Connected to Supabase via raw pg client.");

        // Add summary column
        await client.query(`
      ALTER TABLE "Article" 
      ADD COLUMN IF NOT EXISTS "summary" TEXT;
    `);
        console.log("Successfully added summary column to Article table.");

    } catch (error) {
        console.error("Error applying SQL:", error);
    } finally {
        await client.end();
    }
}

main();
