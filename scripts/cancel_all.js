const { Client } = require('pg');

async function main() {
    const directUrl = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
    const client = new Client({
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT pg_cancel_backend(pid) 
            FROM pg_stat_activity 
            WHERE datname = 'postgres' 
              AND pid <> pg_backend_pid();
        `);
        console.log(`Cancelled all ${res.rowCount} other backends.`);
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}
main();
