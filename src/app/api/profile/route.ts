// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  bitrix_contact_id?: number | null;
};

function getColumnNames(): string[] {
  try {
    const rows = db.prepare("PRAGMA table_info('users')").all() as Array<Record<string, unknown>>;
    return rows.map((r) => String(r.name));
  } catch (e) {
    console.error("PRAGMA table_info error:", e);
    return [];
  }
}

function safeGetString(obj: Record<string, unknown>, key: string): string | undefined {
  const v = obj[key];
  return typeof v === "string" ? v : undefined;
}

function safeGetNumberOrNull(obj: Record<string, unknown>, key: string): number | null {
  const v = obj[key];
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return null;
}

function mapRowToApiUser(row: Record<string, unknown>, colNames: string[]): ApiUser {
  const name =
    safeGetString(row, "name") ??
    safeGetString(row, "name") ??
    safeGetString(row, "username") ??
    safeGetString(row, "user_name") ??
    "";
  const idVal = row.id;
  const id =
    typeof idVal === "number" ? idVal : typeof idVal === "string" && idVal.trim() !== "" ? Number(idVal) : 0;

  return {
    id: Number(id),
    name: name ?? "",
    email: safeGetString(row, "email") ?? "",
    phone: safeGetString(row, "phone") ?? null,
    address: safeGetString(row, "address") ?? null,
    bitrix_contact_id: safeGetNumberOrNull(row, "bitrix_contact_id"),
  };
}

// GET /api/profile?id=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    if (!idParam) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });

    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "ID должен быть числом" }, { status: 400 });

    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!row) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });

    const cols = getColumnNames();
    const user = mapRowToApiUser(row, cols);
    return NextResponse.json({ data: user });
  } catch (err) {
    console.error("Ошибка API /profile GET:", err);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

// PUT /api/profile
export async function PUT(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const id = Number(body?.id);
    if (!id || Number.isNaN(id)) return NextResponse.json({ error: "Неверный id" }, { status: 400 });

    const cols = getColumnNames();
    const updates: string[] = [];
    const values: unknown[] = [];

    if (typeof body.name === "string") {
      if (cols.includes("name")) {
        updates.push("name = ?");
        values.push(body.name);
      } else if (cols.includes("name")) {
        updates.push("name = ?");
        values.push(body.name);
      }
    }

    if (typeof body.email === "string" && cols.includes("email")) {
      updates.push("email = ?");
      values.push(body.email);
    }

    if (typeof body.phone !== "undefined" && cols.includes("phone")) {
      updates.push("phone = ?");
      values.push(body.phone ?? null);
    }

    if (typeof body.address !== "undefined" && cols.includes("address")) {
      updates.push("address = ?");
      values.push(body.address ?? null);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "Нет полей для обновления или таблица не содержит нужных колонок" },
        { status: 400 }
      );
    }

    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    values.push(id);
    db.prepare(sql).run(...values);

    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!row) return NextResponse.json({ error: "Пользователь не найден после обновления" }, { status: 404 });

    const user = mapRowToApiUser(row, cols);
    return NextResponse.json({ data: user });
  } catch (err) {
    console.error("Ошибка API /profile PUT:", err);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
