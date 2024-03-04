import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

const globalForPrisma = global as unknown as {
  _db: PrismaClient | undefined
}

if (!globalForPrisma._db) {
  globalForPrisma._db = new PrismaClient();
}

db = globalForPrisma._db;

export default db;
