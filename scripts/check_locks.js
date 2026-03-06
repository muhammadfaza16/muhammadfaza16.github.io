const { Client } = require('pg');

async function main() {
    const directUrl = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";
    const client = new Client({ connectionString: directUrl });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT pid, state, query 
            FROM pg_stat_activity 
            WHERE datname = 'postgres' AND pid <> pg_backend_pid();
        `);
        console.table(res.rows);
    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}

main();
