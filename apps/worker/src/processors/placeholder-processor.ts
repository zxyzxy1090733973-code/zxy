import { BaseJobPayloadSchema } from "@concept-to-model/contracts";
import type { BaseJobPayload } from "@concept-to-model/contracts";
import type { Job } from "bullmq";

import type { QueueName } from "../queues/queue-names.js";

export type WorkerJob = Job<BaseJobPayload, never, string>;

export function createPlaceholderProcessor(queueName: QueueName) {
  return async (job: WorkerJob): Promise<never> => {
    BaseJobPayloadSchema.parse(job.data);

    throw new Error(
      `Processor for queue "${queueName}" is not implemented yet.`,
    );
  };
}
