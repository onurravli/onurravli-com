import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// The adapter connects lazily, so importing this module (e.g. during
// `next build`) never needs a reachable database.
export const db =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
	});

// Reuse one client across dev hot reloads instead of leaking connection pools.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
