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
      const prisma = getPrismaPool();
      // Find where started more than 20 minutes ago
      const oldPending = await prisma.ticket.findFirst({
        where: {
          complete: false,
          started: { lt: new Date(Date.now() - 2 * 60 * 1000) },
        },
      });
      if (oldPending) {
        await prisma.ticket.update({
          where: { id: oldPending.id },
          data: { started: new Date() },
        });
        res.json({
          ticket: oldPending,
        });
        return;
      }

      const ticket = await prisma.ticket.findFirst({
        where: { complete: false, started: null },
        orderBy: { createdAt: "desc" },
      });

      if (ticket) {
        const updatedTicket = await prisma.ticket.update({
          where: { id: ticket.id },
          data: { started: new Date() },
        });
        res.json({
          updatedTicket,
        });
        return;
      }

      res.status(404).json({ ticket: null });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
