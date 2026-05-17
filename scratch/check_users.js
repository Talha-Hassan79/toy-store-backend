const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, email, role FROM user", [], (err, rows) => {
  if (err) {
    console.error(err.message);
    return;
  }
  if (rows.length === 0) {
    console.log("No users found in the database.");
  } else {
    console.log("Users in database:");
    console.table(rows);
  }
  db.close();
});
