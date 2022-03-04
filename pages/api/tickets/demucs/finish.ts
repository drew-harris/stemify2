// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getPrismaPool } from "../../../../server_helpers/prismaPool";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ msg: "Method not allowed" });
  } else {
    try {
      const prisma = getPrismaPool();
      if (
        !req.body.songId ||
        !req.body.kanoKey ||
        !req.body.drums ||
        !req.body.bass ||
        !req.body.vocals ||
        !req.body.other
      ) {
        res.status(400).json({ error: "No data provided" });
        return;
      }
      const songId = req.body.songId;
      const result = await prisma.song.update({
        where: {
          id: songId,
        },
        data: {
          complete: true,
          ticket: {
            update: {
              complete: true,
            },
          },
          download: {
            create: {
              kanoKey: req.body.kanoKey,
              drums: req.body.drums,
              bass: req.body.bass,
              other: req.body.other,
              vocals: req.body.vocals,
            },
          },
        },
      });
      if (!result) {
        res.status(404).json({ error: "No song found" });
        return;
      }
      res.json(result);
      // Do stuff here
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
