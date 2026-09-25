import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function getPrismaClient(): PrismaClient {
  if (global.__prisma) {
    const fields = (global.__prisma as any)?._runtimeDataModel?.models?.Country?.fields;
    const hasWhyVisitImg = Array.isArray(fields) && fields.some((f: any) => f.name === "whyVisitImageUrl");
    if (hasWhyVisitImg) {
      return global.__prisma;
    }
    // Outdated global client in memory — recreate with latest schema
    try {
      (global.__prisma as any).$disconnect();
    } catch {
      // Ignore disconnect errors on stale client
    }
    global.__prisma = undefined;
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
export { ensureEnvLoaded } from "./env-bootstrap";
