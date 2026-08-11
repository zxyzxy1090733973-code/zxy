import type {
  EnqueueJobInput,
  EnqueuedJob,
  QueueJobPayload,
  QueueName,
  QueuePort,
} from "@concept-to-model/application";
import { Queue } from "bullmq";
import type { QueueOptions } from "bullmq";

export interface BullMqQueueAdapterOptions {
  readonly connection: QueueOptions["connection"];
}

export class BullMqQueueAdapter implements QueuePort {
  private readonly queues = new Map<QueueName, Queue<QueueJobPayload>>();

  constructor(private readonly options: BullMqQueueAdapterOptions) {}

  async enqueue<TPayload extends QueueJobPayload>(
    input: EnqueueJobInput<TPayload>,
  ): Promise<EnqueuedJob> {
    const queue = this.getQueue(input.queueName);
    const queueJob = await queue.add(
      input.jobName ?? input.queueName,
      input.payload,
      {
        attempts: input.attempts,
        delay: input.delayMs,
        jobId: input.payload.jobId,
      },
    );

    return {
      queueName: input.queueName,
      jobId: input.payload.jobId,
      queueJobId: queueJob.id ?? input.payload.jobId,
    };
  }

  async close(): Promise<void> {
    await Promise.all([...this.queues.values()].map((queue) => queue.close()));
  }

  private getQueue(queueName: QueueName): Queue<QueueJobPayload> {
    const existingQueue = this.queues.get(queueName);

    if (existingQueue) {
      return existingQueue;
    }

    const queue = new Queue<QueueJobPayload>(queueName, {
      connection: this.options.connection,
    });

    this.queues.set(queueName, queue);
    return queue;
  }
}
