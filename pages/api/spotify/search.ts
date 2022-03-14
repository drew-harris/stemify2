// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSongData } from "../../../server_helpers/spotify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ msg: "Method not allowed" });
  } else {
    const query = req.body.query;
    const limit = req.body?.limit || 1;
    if (!query) {
      res.status(400).json({ error: "No query provided" });
      return;
    }

    const useFilter = req.body?.filter || false;

    const metadata: any = await getSongData(query, useFilter, limit);
    res.json(metadata);
  }
}
