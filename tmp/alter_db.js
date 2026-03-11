require('dotenv').config();
const { Client } = require('pg');

async function alterDb() {
    const connString = process.env.DIRECT_URL.split('?')[0];

    const client = new Client({
        connectionString: connString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // Add summary column if it doesn't exist
        await client.query(`
        ALTER TABLE "Article" 
        ADD COLUMN IF NOT EXISTS "summary" TEXT,
        ADD COLUMN IF NOT EXISTS "toc" JSONB;
      `);

        console.log("DB ALTERED SUCCESSFULLY");
    } catch (error) {
        console.error("Failed to alter DB:", error);
    } finally {
        await client.end();
    }
}

alterDb();
