// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
import { getPrismaPool } from "../../../server_helpers/prismaPool";

type SortDirection = "asc" | "desc";
type SortField = "popularity" | "submittedAt" | "downloads";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ msg: "Method not allowed" });
  } else {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 60;

    const prisma: PrismaClient = await getPrismaPool();

    const songs = await prisma.song.findMany({
      where: {
        complete: true,
        title: {
          search: req.query.query as string,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        album: true,
        artist: true,
      },
    });

    res.status(200).json(songs);

    try {
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
}
