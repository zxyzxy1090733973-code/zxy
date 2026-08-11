import { getRedisConnection } from "./config/redis-connection.js";
import { createWorkerRuntime } from "./worker-runtime.js";

const runtime = createWorkerRuntime({
  connection: getRedisConnection(),
});

const shutdown = async (): Promise<void> => {
  await runtime.close();
};

process.once("SIGINT", () => {
  void shutdown();
});

process.once("SIGTERM", () => {
  void shutdown();
});

await runtime.start();
