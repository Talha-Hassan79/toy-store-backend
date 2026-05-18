const { Client } = require('pg');
require('dotenv').config();

async function listTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log("Tables in database:", result.rows.map(r => r.table_name).join(', '));
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.end();
  }
}

listTables().catch(console.error);
