// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getPrismaPool } from "../../server_helpers/prismaPool";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const id: any = req.query.id as string;
    if (!id) {
      res.status(400).json({ error: "id is required" });
    }
    const client: PrismaClient = await getPrismaPool();
    const download = await client.download.findFirst({
      where: {
        song: {
          id: id,
        },
      },
      select: {
        drums: true,
        bass: true,
        vocals: true,
        other: true,
      },
    });

    if (!download) {
      res.status(404).json({ error: "download not found" });
    }
    res.status(200).json(download);
  } else {
    res.status(405).end();
  }
}
