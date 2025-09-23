// src/app/api/login/route.ts
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
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { errors: { general: "Введите email и пароль" } },
        { status: 400 }
      );
    }

    const user = db
      .prepare("SELECT id, name, email, password, bitrix_contact_id FROM users WHERE email = ?")
      .get(email) as DbUser | undefined;

    if (!user) {
      return NextResponse.json(
        { errors: { email: "Пользователь не найден" } },
        { status: 404 }
      );
    }

    // typescript knows user is defined here
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { errors: { password: "Неверный пароль" } },
        { status: 401 }
      );
    }

    // returning minimal user info
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
    console.error("Login error:", err);
    return NextResponse.json(
      { errors: { general: "Ошибка сервера" } },
      { status: 500 }
    );
  }
}
