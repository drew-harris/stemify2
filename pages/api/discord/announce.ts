// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSongData } from "../../../server_helpers/spotify";
import {
  getClient,
  sendAnnouncement,
  sendDiscordDM,
} from "../../../server_helpers/discordbot";
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
    console.log("trying to send announcement", req.body);

    await sendAnnouncement(req.body.message);

    res.json({ msg: "Message sent" });
  }
}
