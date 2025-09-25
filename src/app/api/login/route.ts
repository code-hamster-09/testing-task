import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

type DbUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  bitrix_contact_id?: number | null;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ errors: { general: "Введите email и пароль" } }, { status: 400 });
    }

    const userRow = db
      .prepare("SELECT id, name, email, password, bitrix_contact_id FROM users WHERE email = ?")
      .get(email) as Record<string, unknown> | undefined;

    if (!userRow) {
      return NextResponse.json({ errors: { email: "Пользователь не найден" } }, { status: 404 });
    }

    const hashed = typeof userRow.password === "string" ? userRow.password : "";
    if (!hashed) {
      console.error("User row has no password field or it's not a string", userRow);
      return NextResponse.json({ errors: { general: "Ошибка сервера" } }, { status: 500 });
    }

    const isValid = bcrypt.compareSync(password, hashed);
    if (!isValid) {
      return NextResponse.json({ errors: { password: "Неверный пароль" } }, { status: 401 });
    }

    const responseUser = {
      id: Number(userRow.id),
      name: typeof userRow.name === "string" ? userRow.name : "",
      email: typeof userRow.email === "string" ? userRow.email : "",
      bitrix_contact_id:
        typeof userRow.bitrix_contact_id === "number"
          ? userRow.bitrix_contact_id
          : (typeof userRow.bitrix_contact_id === "string" && userRow.bitrix_contact_id !== "" ? Number(userRow.bitrix_contact_id) : null),
    };

    return NextResponse.json({ message: "Успешный вход", user: responseUser });
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json({ errors: { general: "Ошибка сервера" } }, { status: 500 });
  }
}
