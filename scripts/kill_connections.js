const { Client } = require('pg');

async function main() {
    const directUrl = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
    const client = new Client({
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected to Supabase. Terminating old connections...");
        const res = await client.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = 'postgres';`);
        console.log(`Terminated ${res.rowCount} connections.`);
    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}

main();
