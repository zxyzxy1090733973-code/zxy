import type { AppPrismaClient } from "../prisma/index.js";

export interface PrismaRepositoryAdapters {
  readonly prisma: AppPrismaClient;
}

export function createPrismaRepositoryAdapters(
  prisma: AppPrismaClient,
): PrismaRepositoryAdapters {
  return {
    prisma,
  };
}
