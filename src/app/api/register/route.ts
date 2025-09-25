// src/app/api/register/route.ts
import { createContact } from "@/lib/bitrix"; // предполагается серверный модуль, использующий process.env.BITRIX_WEBHOOK_URL
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { errors: { general: "Неверные данные" } },
        { status: 400 }
      );
    }

    const hashed = bcrypt.hashSync(password, 10);

    // создаём контакт в Bitrix (если модуль выбрасывает — ловим)
    let bitrixContactId: number | null = null;
    try {
      const resp = await createContact({ name, email });
      if (resp && typeof resp.result === "number")
        bitrixContactId = resp.result;
      else if (resp && resp.result) bitrixContactId = Number(resp.result);
    } catch (err) {
      console.error("Bitrix error:", err);
      return NextResponse.json(
        { errors: { bitrix: "Ошибка при создании контакта в Bitrix" } },
        { status: 500 }
      );
    }

    try {
      console.log("Попытка вставки в БД:", { name, email, hashed });
      const stmt = db.prepare(
        "INSERT INTO users (name, email, password, bitrix_contact_id) VALUES (?, ?, ?, ?)"
      );
      const info = stmt.run(name, email, hashed, bitrixContactId);
      console.log("DB insert info:", info);
      return NextResponse.json({
        message: "Пользователь создан",
        userId: info.lastInsertRowid,
      });
    } catch (dbErr: unknown) {
      console.error("DB insert error:", dbErr);
      const msg = dbErr instanceof Error ? dbErr.message : String(dbErr || "");
      if (
        msg.toLowerCase().includes("unique") ||
        msg.toLowerCase().includes("constraint") ||
        msg.toLowerCase().includes("already")
      ) {
        return NextResponse.json(
          { errors: { email: "Этот email уже занят" } },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { errors: { db: "Ошибка базы данных" } },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Register route error:", err);
    return NextResponse.json(
      { errors: { general: "Ошибка сервера" } },
      { status: 500 }
    );
  }
}
