const { Client } = require('pg');

async function main() {
    // using direct IPv4 aws-0 on port 5432 to forcefully bypass pgbouncer for admin operations
    const directUrl = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
    const client = new Client({
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        console.log("Canceling blocked queries...");
        const res = await client.query(`
            SELECT pg_cancel_backend(pid) 
            FROM pg_stat_activity 
            WHERE state IN ('idle in transaction', 'active') 
              AND datname = 'postgres' 
              AND pid <> pg_backend_pid();
        `);
        console.log(`Cancelled ${res.rowCount} backend queries.`);

    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}

main();
