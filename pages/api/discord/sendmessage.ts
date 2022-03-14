// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSongData } from "../../../server_helpers/spotify";
import { getClient, sendDiscordDM } from "../../../server_helpers/discordbot";
import { Client, TextChannel } from "discord.js";
import { channel } from "diagnostics_channel";
import { getPrismaPool } from "../../../server_helpers/prismaPool";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ msg: "Method not allowed" });
  } else {
    const songId = req.body.songId;
    notifyUser(songId);

    res.json({ msg: "Message sent" });
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

    if (!song) {
      return;
    }
  } catch (error) {
    throw error;
  }
}
