// src/app/api/deals/route.ts
import { NextResponse } from "next/server";

const WEBHOOK = process.env.BITRIX_WEBHOOK_URL; // server-only

if (!WEBHOOK) {
  console.error("BITRIX_WEBHOOK_URL not set on server");
}

type Deal = {
  ID: number;
  TITLE: string;
  DATE_CREATE: string;
  STAGE_ID: string;
};

export async function GET(req: Request) {
  if (!WEBHOOK) return NextResponse.json({ error: "BITRIX_WEBHOOK_URL not set" }, { status: 500 });

  // optional contactId query param
  const urlObj = new URL(req.url);
  const contactId = urlObj.searchParams.get("contactId");

  let url = `${WEBHOOK}/crm.deal.list.json?select[]=ID&select[]=TITLE&select[]=DATE_CREATE&select[]=STAGE_ID`;
  if (contactId) {
    url += `&filter[CONTACT_ID]=${encodeURIComponent(contactId)}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  const result: Deal[] = Array.isArray(data?.result) ? data.result : (data.result ?? []);
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  if (!WEBHOOK) return NextResponse.json({ error: "BITRIX_WEBHOOK_URL not set" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const title = typeof body?.title === "string" ? body.title : "";
  const contactId = typeof body?.contactId === "number" ? body.contactId : Number(body?.contactId);

  if (!title || !contactId) {
    return NextResponse.json({ error: "Missing title or contactId" }, { status: 400 });
  }

  const r = await fetch(`${WEBHOOK}/crm.deal.add.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        TITLE: title,
        CONTACT_ID: contactId,
      },
    }),
  });

  const data = await r.json();
  return NextResponse.json(data);
}
