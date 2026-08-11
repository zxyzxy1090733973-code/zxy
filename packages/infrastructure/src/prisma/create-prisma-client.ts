import { PrismaClient } from "@prisma/client";

export type AppPrismaClient = PrismaClient;

export interface CreatePrismaClientOptions {
  readonly databaseUrl?: string;
}

export function createPrismaClient(
  options: CreatePrismaClientOptions = {},
): AppPrismaClient {
  return new PrismaClient({
    datasources: options.databaseUrl
      ? {
          db: {
            url: options.databaseUrl,
          },
        }
      : undefined,
  });
}
