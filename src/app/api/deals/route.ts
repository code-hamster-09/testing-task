import { NextResponse } from "next/server";

const WEBHOOK = process.env.BITRIX_WEBHOOK_URL;

export async function GET(req: Request) {
  try {
    if (!WEBHOOK) {
      console.error("BITRIX_WEBHOOK_URL not set");
      return NextResponse.json({ error: "server_misconfigured", message: "BITRIX_WEBHOOK_URL not set on server" }, { status: 500 });
    }

    // optional contactId query param
    const urlObj = new URL(req.url);
    const contactId = urlObj.searchParams.get("contactId");

    // build url for bitrix api
    let url = `${WEBHOOK}/crm.deal.list.json?select[]=ID&select[]=TITLE&select[]=DATE_CREATE&select[]=STAGE_ID`;
    if (contactId) url += `&filter[CONTACT_ID]=${encodeURIComponent(contactId)}`;

    const res = await fetch(url, { method: "GET" });
    const text = await res.text();

    // trying to parse json if bitrix returned html error
    try {
      const data = JSON.parse(text);
      if (data?.error || res.status >= 400) {
        console.error("Bitrix returned error:", data);
        return NextResponse.json({ error: "bitrix_error", details: data }, { status: 502 });
      }
      // returning array or empty array if no deals
      const result = Array.isArray(data?.result) ? data.result : (data.result ?? []);
      return NextResponse.json(result);
    } catch (parseErr) {
      console.error("Bitrix response is not JSON:", text);
      return NextResponse.json({ error: "bitrix_non_json_response", body: text }, { status: 502 });
    }
  } catch (err) {
    console.error("GET /api/deals error:", err);
    return NextResponse.json({ error: "internal_error", message: String(err) }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    if (!WEBHOOK) {
      console.error("BITRIX_WEBHOOK_URL not set");
      return NextResponse.json({ error: "server_misconfigured", message: "BITRIX_WEBHOOK_URL not set on server" }, { status: 500 });
    }

    // parse body
    const body = await req.json().catch(() => ({}));
    const title = typeof body?.title === "string" ? body.title : "";
    const contactId = body?.contactId ? Number(body.contactId) : undefined;

    // validate request body params
    if (!title || !contactId) {
      return NextResponse.json({ error: "invalid_input", message: "Missing title or contactId" }, { status: 400 });
    }

    // sending request adding deal to bitrix
    const r = await fetch(`${WEBHOOK}/crm.deal.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: { TITLE: title, CONTACT_ID: contactId } }),
    });

    // read response text to log non-json errors
    const text = await r.text();
    try {
      const data = JSON.parse(text);
      if (data?.error || r.status >= 400) {
        console.error("Bitrix createDeal error:", data);
        return NextResponse.json({ error: "bitrix_error", details: data }, { status: 502 });
      }
      return NextResponse.json(data);
    } catch (parseErr) {
      console.error("Bitrix createDeal non-JSON:", text, parseErr);
      return NextResponse.json({ error: "bitrix_non_json_response", body: text }, { status: 502 });
    }
  } catch (err) {
    console.error("POST /api/deals error:", err);
    return NextResponse.json({ error: "internal_error", message: String(err) }, { status: 500 });
  }
}
