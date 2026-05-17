const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

async function seedAdmin() {
  const dbPath = path.resolve(__dirname, '../database.sqlite');
  const db = new sqlite3.Database(dbPath);

  const email = "admin@toystore.com";
  const password = "AdminPassword123!";
  const name = "Super Admin";
  const role = "admin";

  const hashedPassword = await bcrypt.hash(password, 10);

  db.serialize(() => {
    // Create user table if it doesn't exist (matching TypeORM schema)
    db.run(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
      )
    `);

    // Insert admin user
    const stmt = db.prepare("INSERT OR IGNORE INTO user (name, email, password, role) VALUES (?, ?, ?, ?)");
    stmt.run(name, email, hashedPassword, role, function(err) {
      if (err) {
        console.error("Error creating admin:", err.message);
      } else if (this.changes > 0) {
        console.log("------------------------------------------");
        console.log("Admin account created successfully!");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log("------------------------------------------");
        console.log("NOTE: Push your 'database.sqlite' file to GitHub to use this account online.");
      } else {
        console.log("Admin account already exists.");
      }
    });
    stmt.finalize();
  });

  db.close();
}

seedAdmin().catch(console.error);
