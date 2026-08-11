import { Worker } from "bullmq";
import type { WorkerOptions } from "bullmq";
import type { BaseJobPayload } from "@concept-to-model/contracts";

import { createPlaceholderProcessor } from "./processors/placeholder-processor.js";
import { QUEUE_NAMES } from "./queues/queue-names.js";

export interface WorkerRuntimeOptions {
  readonly connection: WorkerOptions["connection"];
}

export interface WorkerRuntime {
  readonly workers: readonly Worker<BaseJobPayload, never, string>[];
  start(): Promise<void>;
  close(): Promise<void>;
}

export function createWorkerRuntime(
  options: WorkerRuntimeOptions,
): WorkerRuntime {
  const workers = QUEUE_NAMES.map(
    (queueName) =>
      new Worker(queueName, createPlaceholderProcessor(queueName), {
        connection: options.connection,
        autorun: false,
      }),
  );

  return {
    workers,
    async start(): Promise<void> {
      await Promise.all(workers.map((worker) => worker.run()));
    },
    async close(): Promise<void> {
      await Promise.all(workers.map((worker) => worker.close()));
    },
  };
}
