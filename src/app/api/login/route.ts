import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

// types
type DbUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  bitrix_contact_id?: number | null;
};

export async function POST(req: Request) {
  try {
    // reading and validation request body
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    // basic validation
    if (!email || !password) {
      return NextResponse.json(
        { errors: { general: "Введите email и пароль" } },
        { status: 400 }
      );
    }

    // result type from db
    const user = db
      .prepare(
        "SELECT id, name, email, password, bitrix_contact_id FROM users WHERE email = ?"
      )
      .get(email) as DbUser | undefined;

    if (!user) {
      return NextResponse.json(
        { errors: { email: "Пользователь не найден" } },
        { status: 404 }
      );
    }

    // comparing hashed password
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { errors: { password: "Неверный пароль" } },
        { status: 401 }
      );
    }

    // return minimal user info to the client
    return NextResponse.json({
      message: "Успешный вход",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bitrix_contact_id: user.bitrix_contact_id ?? null,
      },
    });
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { errors: { general: "Ошибка сервера" } },
      { status: 500 }
    );
  }
}
