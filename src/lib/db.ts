import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "db.sqlite"));

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    bitrix_contact_id INTEGER
  )
`
).run();

export default db;
