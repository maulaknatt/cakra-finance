import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const DEFAULT_SUPABASE_URL =
  "postgresql://postgres.jrkowhxqkakdyrhvrazy:Cakrafinance%40@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";

function createPrismaClient() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.DIRECT_URL ||
    DEFAULT_SUPABASE_URL;

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
