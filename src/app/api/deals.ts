import { NextApiRequest, NextApiResponse } from "next";
import { getDeals, createDeal } from "@/lib/bitrix";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const contactId = req.query.contactId ? Number(req.query.contactId) : undefined;
    const deals = await getDeals(contactId);
    return res.status(200).json(deals);
  }

  if (req.method === "POST") {
    const { title, contactId } = req.body;
    if (!title || typeof contactId !== "number") {
      return res.status(400).json({ error: "Missing title or contactId" });
    }
    const id = await createDeal(title, contactId);
    return res.status(201).json({ id });
  }

  res.setHeader("Allow", "GET, POST");
  res.status(405).end();
}