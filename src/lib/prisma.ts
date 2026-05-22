// src/lib/prisma.ts
// ---------------------------------------------------------------
// Prisma Client Singleton
// Next.js dev mode এ hot reload এর কারণে একাধিক instance তৈরি
// হওয়া রোধ করতে globalThis এ cache করা হয়।
// ---------------------------------------------------------------

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
