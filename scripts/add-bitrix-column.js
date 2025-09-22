import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "db.sqlite");
const db = new Database(dbPath);

try {
  db.prepare("ALTER TABLE users ADD COLUMN bitrix_contact_id INTEGER").run();
  console.log("Колонка bitrix_contact_id добавлена");
} catch (e) {
  console.error("Ошибка:", e.message);
} finally {
  db.close();
}
