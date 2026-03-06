const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres";

async function backfillScores() {
    const client = new Client({ connectionString: DATABASE_URL });
    try {
        await client.connect();
        console.log("Connected to Supabase DB via pg.");

        const res = await client.query(`
      UPDATE "ArticleScore"
      SET "socialScore" = ("engagement" * 1) + ("actionability" * 2) + ("specificity" * 3);
    `);

        console.log(`Successfully backfilled socialScore for ${res.rowCount} rows.`);

        process.exit(0);
    } catch (error) {
        console.error("Backfill failed:", error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

backfillScores();
