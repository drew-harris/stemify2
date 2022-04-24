// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
import { getPrismaPool } from "../../../server_helpers/prismaPool";

type SortDirection = "asc" | "desc";
type SortField = "popularity" | "createdAt" | "downloads";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ msg: "Method not allowed" });
  } else {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 60;
    let sort: SortField;

    if ((req.query.sort as string) === "popularity") {
      sort = "popularity";
    } else if ((req.query.sort as string) === "date") {
      sort = "createdAt";
    } else if ((req.query.sort as string) === "downloads") {
      sort = "downloads";
    } else {
      sort = "createdAt";
    }

    let order: SortDirection;
    if ((req.query.order as string) == "asc") {
      order = "asc";
    } else {
      order = "desc";
    }

    try {
      const prisma: PrismaClient = await getPrismaPool();

      const songs = await prisma.album.findMany({
        where: {
          songs: {
            some: {
              complete: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sort]: order,
        },
        include: {
          artist: true,
          songs: {
            select: {
              id: true,
            },
          },
        },
      });

      // Filter albums with less than 5 songs

      const filteredSongs = songs.filter((album) => {
        return album.songs.length >= 5;
      });

      res.status(200).json(filteredSongs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
}
