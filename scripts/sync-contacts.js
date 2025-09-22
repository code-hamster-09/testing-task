import Database from "better-sqlite3";
import path from "path";
import fetch from "node-fetch"; // если Node >=18, можно убрать и использовать глобальный fetch
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, "..", "db.sqlite"));
const WEBHOOK = process.env.BITRIX_WEBHOOK_URL;

if (!WEBHOOK) {
  console.error("BITRIX_WEBHOOK_URL not set");
  process.exit(1);
}

const rows = db
  .prepare(
    "SELECT id, name, email FROM users WHERE bitrix_contact_id IS NULL OR bitrix_contact_id = ''"
  )
  .all();

(async () => {
  for (const r of rows) {
    try {
      console.log("Создаём контакт для user", r.id, r.email);

      const res = await fetch(`${WEBHOOK}/crm.contact.add.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            NAME: r.name,
            EMAIL: [{ VALUE: r.email, VALUE_TYPE: "WORK" }],
          },
        }),
      });

      const data = await res.json();
      const contactId = data?.result ?? null;

      if (contactId) {
        db.prepare(
          "UPDATE users SET bitrix_contact_id = ? WHERE id = ?"
        ).run(contactId, r.id);
        console.log(`User ${r.id} -> contact ${contactId}`);
      } else {
        console.error("No contact created for", r.id, data);
      }

      await new Promise((res) => setTimeout(res, 300)); // чтобы не перегружать API
    } catch (e) {
      console.error("Error for user", r.id, e);
    }
  }

  db.close();
  console.log("Синхронизация завершена");
})();
