const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function resetAdmin() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const email = "admin@toystore.com";
  const password = "AdminPassword123!";

  try {
    await client.connect();
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      'UPDATE "user" SET "password" = $1, "isVerified" = true, "verificationToken" = NULL WHERE "email" = $2',
      [hashedPassword, email]
    );

    if (result.rowCount > 0) {
      console.log(`Password for ${email} has been reset to: ${password}`);
    } else {
      console.log(`No user found with email: ${email}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.end();
  }
}

resetAdmin().catch(console.error);
