// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { sendDiscordDM } from "../../../../server_helpers/discordbot";
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
        include: {
          user: true,
        },
      });

      if (!result) {
        res.status(404).json({ error: "No song found" });
        return;
      }

      await notifyUser(songId);
      res.json(result);
      // Do stuff here
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
}

async function notifyUser(songId: any) {
  try {
    const client = await getPrismaPool();
    const song = await client.song.findFirst({
      where: {
        id: songId,
      },
      include: {
        user: {
          include: {
            accounts: true,
          },
        },

        album: true,
        artist: true,
      },
    });
    console.log(song);
    if (!song) {
      return;
    }
    console.log(song?.user?.accounts);
    if (!song?.user?.accounts[0]?.providerAccountId) {
      throw new Error("No provider account id");
    }

    const providerAccountId = song?.user?.accounts[0]?.providerAccountId;

    const embed = {
      title: `${song?.artist?.name} - ${song?.title}`,
      url: `https://stemify2.net/song/${song?.id}`,
      description: `${song?.album?.title}`,
      color: song.innerColor,
      thumbnail: {
        url: song?.album?.image,
      },
    };

    sendDiscordDM(providerAccountId, embed);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
