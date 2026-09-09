import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function getPrismaClient(): PrismaClient {
  if (global.__prisma) {
    return global.__prisma;
  }
  try {
    const client = new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
      global.__prisma = client;
    }
    return client;
  } catch {
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error(
          "Prisma client is not connected to a database. Please set DATABASE_URL and run migrations."
        );
      },
    });
  }
}

// Lazy proxy so module evaluation never fails at startup before Prisma is configured
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export * from "@prisma/client";

