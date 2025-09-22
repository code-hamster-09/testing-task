const Database = require("better-sqlite3");

const db = new Database("db.sqlite");

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    bitrix_contact_id INTEGER
  )
`).run();

console.log("Таблица users готова");

db.close();
