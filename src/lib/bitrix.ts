import fetch from "node-fetch"

const WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL

export const createContact = async (user: { name: string; email: string }) => {
  if (!WEBHOOK_URL) throw new Error("BITRIX_WEBHOOK_URL не задан в .env")
  
  const res = await fetch(`${WEBHOOK_URL}/crm.contact.add.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        NAME: user.name,
        EMAIL: [{ VALUE: user.email, VALUE_TYPE: "WORK" }],
      },
    }),
  })

  return res.json()
}
