const WEBHOOK_URL = process.env.NEXT_PUBLIC_BITRIX_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  console.warn("BITRIX_WEBHOOK_URL not set");
}

export const createContact = async (user: { name: string; email: string }) => {
  if (!WEBHOOK_URL) throw new Error("BITRIX_WEBHOOK_URL не задан в .env.local");

  const res = await fetch(`${WEBHOOK_URL}/crm.contact.add.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        NAME: user.name,
        EMAIL: [{ VALUE: user.email, VALUE_TYPE: "WORK" }],
      },
      params: { REGISTER_SONET_EVENT: "Y" },
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data));
  return data;
};

export type Deal = {
  ID: number;
  TITLE: string;
  DATE_CREATE: string;
  STAGE_ID: string;
};

export async function getDeals(contactId?: number): Promise<Deal[]> {
  if (!WEBHOOK_URL) throw new Error("BITRIX_WEBHOOK_URL not set");

  let url = `${WEBHOOK_URL}/crm.deal.list.json?select[]=ID&select[]=TITLE&select[]=DATE_CREATE&select[]=STAGE_ID`;

  if (typeof contactId === "number") {
    url += `&filter[CONTACT_ID]=${contactId}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  return Array.isArray(data?.result) ? data.result : (data.result ?? []);
}

export async function createDeal(title: string, contactId: number) {
  if (!WEBHOOK_URL) throw new Error("BITRIX_WEBHOOK_URL not set");

  const res = await fetch(`${WEBHOOK_URL}/crm.deal.add.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        TITLE: title,
        CONTACT_ID: contactId,
      },
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data));

  return data.result ?? null;
}
