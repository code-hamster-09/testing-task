import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { errors: { general: "Введите email и пароль" } },
        { status: 400 }
      );
    }

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user) {
      return NextResponse.json(
        { errors: { email: "Пользователь не найден" } },
        { status: 404 }
      );
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { errors: { password: "Неверный пароль" } },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Успешный вход",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bitrix_contact_id: user.bitrix_contact_id,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { errors: { general: "Ошибка сервера" } },
      { status: 500 }
    );
  }
}
