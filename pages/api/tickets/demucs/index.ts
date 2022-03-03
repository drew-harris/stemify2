// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getPrismaPool } from "../../../../server_helpers/prismaPool";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ msg: "Method not allowed" });
  } else {
    try {
      let ticket = null;
      const prisma = getPrismaPool();
      // Find where started more than 20 minutes ago
      ticket = await prisma.ticket.findFirst({
        where: {
          complete: false,
          started: { lt: new Date(Date.now() - 2 * 60 * 1000) },
        },
      });
      if (ticket) {
        console.log("Found old");
        // Include parent songId
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { started: new Date() },
        });
        const song = await prisma.song.findFirst({
          where: { id: ticket.songId },
          select: {
            title: true,
            artist: true,
            bpm: true,
            innerColor: true,
            outerColor: true,
          },
        });
        res.json({
          ticket: ticket,
          song: song,
        });
        return;
      }

      ticket = await prisma.ticket.findFirst({
        where: { complete: false, started: null },
        orderBy: { createdAt: "desc" },
      });

      if (ticket) {
        const updatedTicket = await prisma.ticket.update({
          where: { id: ticket.id },
          data: { started: new Date() },
        });
        const song = await prisma.song.findFirst({
          where: { id: ticket.songId },
          select: {
            title: true,
            artist: true,
            bpm: true,
            innerColor: true,
            outerColor: true,
          },
        });
        res.json({ ticket: updatedTicket, song });
        return;
      }

      res.status(404).json({ ticket: null, song: null });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
