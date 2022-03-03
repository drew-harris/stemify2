import { PrismaClient } from "@prisma/client";
let prisma: any = null;

export function getPrismaPool(): PrismaClient {
  if (prisma != null) {
    return prisma;
  } else {
    prisma = new PrismaClient();
    return prisma;
  }
}
