import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import db from "@/lib/db"
import { createContact } from "@/lib/bitrix"

export async function POST(req: Request) {
  try {
    const { login, email, password } = await req.json()

    // Хешируем пароль
    const hashed = bcrypt.hashSync(password, 10)

    // Добавляем в SQLite
    db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
      .run(login, email, hashed)

    // Добавляем контакт в Bitrix
    await createContact({ name: login, email })

    return NextResponse.json({ message: "Пользователь создан" })
  } catch (err: unknown) {
    console.error(err)
    return NextResponse.json(
      { errors: { email: "Этот email уже занят или ошибка сервера" } },
      { status: 400 }
    )
  }
}
