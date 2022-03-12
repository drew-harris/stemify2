// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSongData } from "../../../server_helpers/spotify";
import { getInfo } from "../../../server_helpers/youtube";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ msg: "Method not allowed" });
  } else {
    try {
      const url = req.body.url;
      const limit = req.body?.limit || 1;
      if (!url) {
        res.status(400).json({ error: "No url provided" });
        return;
      }

      const songs: any[] = await getInfo(url, limit);
      res.json(songs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
