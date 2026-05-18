const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function seedAdmin() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const email = "admin@toystore.com";
  const password = "AdminPassword123!";
  const name = "Super Admin";
  const role = "admin";

  try {
    await client.connect();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const existing = await client.query('SELECT id FROM "user" WHERE email = $1', [email]);

    if (existing.rows.length > 0) {
      console.log("Admin account already exists.");
    } else {
      await client.query(
        'INSERT INTO "user" ("name", "email", "password", "role", "isVerified") VALUES ($1, $2, $3, $4, $5)',
        [name, email, hashedPassword, role, true]
      );
      console.log("------------------------------------------");
      console.log("Admin account created successfully!");
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log("------------------------------------------");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.end();
  }
}

seedAdmin().catch(console.error);
