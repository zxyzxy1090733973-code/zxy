import type { IdempotencyKey, JobId } from "@concept-to-model/domain";

export const QUEUE_NAMES = [
  "artwork.decompose",
  "part.reference-image.generate",
  "part.multiview.generate",
  "model.generate",
  "model.download",
  "model.analyze",
  "model.export",
] as const;

export type QueueName = (typeof QUEUE_NAMES)[number];

export interface QueueJobPayload extends Readonly<Record<string, unknown>> {
  readonly jobId: JobId;
  readonly idempotencyKey: IdempotencyKey;
}

export interface EnqueueJobInput<TPayload extends QueueJobPayload> {
  readonly queueName: QueueName;
  readonly jobName?: string;
  readonly payload: TPayload;
  readonly delayMs?: number;
  readonly attempts?: number;
}

export interface EnqueuedJob {
  readonly queueName: QueueName;
  readonly jobId: JobId;
  readonly queueJobId: string;
}

export interface QueuePort {
  enqueue<TPayload extends QueueJobPayload>(
    input: EnqueueJobInput<TPayload>,
  ): Promise<EnqueuedJob>;
}
