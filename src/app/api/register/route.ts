import { createContact } from "@/lib/bitrix";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { login, email, password } = await req.json();

    // basic validation
    if (!login || !email || !password) {
      return NextResponse.json(
        { errors: { general: "Неверные данные" } },
        { status: 400 }
      );
    }

    // hashing password
    const hashed = bcrypt.hashSync(password, 10);

    // create contact in bitrix and get contact id
    let bitrixContactId: number | null = null;
    try {
      const createResp = await createContact({ name: login, email });
      bitrixContactId = createResp?.result ?? null;
    } catch (err) {
      console.error("Bitrix error:", err);
      return NextResponse.json(
        { errors: { bitrix: "Ошибка при создании контакта в Bitrix" } },
        { status: 500 }
      );
    }

    // save user to DB
    try {
      const stmt = db.prepare(
        "INSERT INTO users (name, email, password, bitrix_contact_id) VALUES (?, ?, ?, ?)"
      );
      const info = stmt.run(login, email, hashed, bitrixContactId);
      // return success with new user id 
      return NextResponse.json({
        message: "Пользователь создан",
        userId: info.lastInsertRowid,
      });
    } catch (dbErr: unknown) {
      console.error("DB insert error:", dbErr);

      // handling unique error for email
      const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);

      // crude check for unique error
      if (
        msg.includes("UNIQUE") ||
        msg.includes("constraint") ||
        msg.includes("already")
      ) {
        return NextResponse.json(
          { errors: { email: "Этот email уже занят" } },
          { status: 400 }
        );
      }

      // server error for other db errors
      return NextResponse.json(
        { errors: { db: "Ошибка базы данных" } },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error(err);
    // generic server error
    return NextResponse.json(
      { errors: { general: "Ошибка сервера" } },
      { status: 500 }
    );
  }
}
