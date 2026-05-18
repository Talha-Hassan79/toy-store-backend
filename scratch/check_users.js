const { Client } = require('pg');
require('dotenv').config();

async function checkUsers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query('SELECT "id", "name", "email", "role", "isVerified" FROM "user"');

    if (result.rows.length === 0) {
      console.log("No users found in the database.");
    } else {
      console.log("Users in database:");
      console.table(result.rows);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.end();
  }
}

checkUsers().catch(console.error);
