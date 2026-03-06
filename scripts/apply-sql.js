const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres";

async function runRawSQL() {
    const client = new Client({ connectionString: DATABASE_URL });
    try {
        await client.connect();
        console.log("Connected to Supabase DB via pg.");

        // Add socialScore column if it doesn't exist
        await client.query(`
      ALTER TABLE "ArticleScore" 
      ADD COLUMN IF NOT EXISTS "socialScore" INTEGER NOT NULL DEFAULT 0;
    `);
        console.log("Column 'socialScore' added.");

        // Create Indexes
        await client.query(`CREATE INDEX IF NOT EXISTS "Article_category_idx" ON "Article"("category");`);
        await client.query(`CREATE INDEX IF NOT EXISTS "Article_createdAt_idx" ON "Article"("createdAt");`);
        await client.query(`CREATE INDEX IF NOT EXISTS "Comment_articleId_idx" ON "Comment"("articleId");`);
        await client.query(`CREATE INDEX IF NOT EXISTS "ArticleScore_socialScore_idx" ON "ArticleScore"("socialScore");`);
        await client.query(`CREATE INDEX IF NOT EXISTS "ArticleScore_total_idx" ON "ArticleScore"("total");`);
        console.log("Indexes created successfully.");

        process.exit(0);
    } catch (error) {
        console.error("Failed to run raw SQL:", error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runRawSQL();
