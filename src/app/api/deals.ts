import { NextApiRequest, NextApiResponse } from "next";
import { getDeals, createDeal } from "@/lib/bitrix";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const contactId = req.query.contactId ? Number(req.query.contactId) : undefined;
      const deals = await getDeals(contactId);
      res.status(200).json(deals);
    } else if (req.method === "POST") {
      const { title, contactId } = req.body;
      if (!title || !contactId) return res.status(400).json({ error: "Missing title or contactId" });

      const newDealId = await createDeal(title, contactId);
      res.status(200).json({ id: newDealId });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : err });
  }
}