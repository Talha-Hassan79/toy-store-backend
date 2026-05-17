const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

async function resetAdmin() {
  const dbPath = path.resolve(__dirname, '../database.sqlite');
  const db = new sqlite3.Database(dbPath);

  const email = "admin@toystore.com";
  const password = "AdminPassword123!";
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run("UPDATE user SET password = ? WHERE email = ?", [hashedPassword, email], function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Password for ${email} has been reset to: ${password}`);
    }
    db.close();
  });
}

resetAdmin().catch(console.error);
