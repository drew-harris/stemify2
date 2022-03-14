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
          started: { lt: new Date(Date.now() - 20 * 60 * 1000) },
        },
        include: {
          song: true,
        },
      });
      if (ticket) {
        console.log("Found old");
        // Include parent songId
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { started: new Date() },
          include: { song: true },
        });
        res.json({
          ticket: ticket,
          song: ticket.song,
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
          include: { song: true },
        });
        res.json({ ticket: updatedTicket, song: updatedTicket.song });
        return;
      }

      res.status(404).json({ ticket: null, song: null });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}
