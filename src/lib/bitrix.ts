const WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  console.warn("BITRIX_WEBHOOK_URL not set");
}

export const createContact = async (user: { name: string; email: string }) => {
  if (!WEBHOOK_URL) throw new Error("BITRIX_WEBHOOK_URL не задан в .env.local");

  // create contact in bitrix calling crm.contact.add.json
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


// deal type
export type Deal = {
  ID: number;
  TITLE: string;
  DATE_CREATE: string;
  STAGE_ID: string;
};


// fetch deals from bitrix, optionally filtering by contactId
export async function getDeals(contactId?: number): Promise<Deal[]> {
  if (!WEBHOOK_URL) throw new Error("BITRIX_WEBHOOK_URL not set");

  let url = `${WEBHOOK_URL}/crm.deal.list.json?select[]=ID&select[]=TITLE&select[]=DATE_CREATE&select[]=STAGE_ID`;

  // if contactId provided, add filter
  if (typeof contactId === "number") {
    url += `&filter[CONTACT_ID]=${contactId}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  // return array of deals, else empty array
  // "??" - nullish coalescing operator, it is for cases when result may be null/undefined
  return Array.isArray(data?.result) ? data.result : (data.result ?? []);
}

export async function createDeal(title: string, contactId: number) {
  if (!WEBHOOK_URL) throw new Error("BITRIX_WEBHOOK_URL not set");

  // create deal in bitrix calling crm.deal.add.json
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
