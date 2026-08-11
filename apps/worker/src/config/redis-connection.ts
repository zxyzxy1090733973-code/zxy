import type { WorkerOptions } from "bullmq";

type RedisConnection = NonNullable<WorkerOptions["connection"]>;

const DEFAULT_REDIS_URL = "redis://localhost:6379";

export function getRedisConnection(
  env: NodeJS.ProcessEnv = process.env,
): RedisConnection {
  const redisUrl = env.REDIS_URL ?? DEFAULT_REDIS_URL;
  const parsedUrl = new URL(redisUrl);

  if (parsedUrl.protocol !== "redis:") {
    throw new Error("REDIS_URL must use the redis:// protocol.");
  }

  const port = parsedUrl.port ? Number.parseInt(parsedUrl.port, 10) : 6379;

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("REDIS_URL must include a positive integer port.");
  }

  return {
    host: parsedUrl.hostname || "localhost",
    port,
    username: parsedUrl.username
      ? decodeURIComponent(parsedUrl.username)
      : undefined,
    password: parsedUrl.password
      ? decodeURIComponent(parsedUrl.password)
      : undefined,
    db: getRedisDatabase(parsedUrl),
  };
}

function getRedisDatabase(parsedUrl: URL): number | undefined {
  const databasePath = parsedUrl.pathname.replace("/", "");

  if (!databasePath) {
    return undefined;
  }

  const database = Number.parseInt(databasePath, 10);

  if (!Number.isInteger(database) || database < 0) {
    throw new Error("REDIS_URL database must be a non-negative integer.");
  }

  return database;
}
