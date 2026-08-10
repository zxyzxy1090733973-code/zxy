import { z } from "zod";

import { IdempotencyKeySchema, JobIdSchema } from "../common/ids.js";

export const BaseJobPayloadSchema = z.object({
  jobId: JobIdSchema,
  idempotencyKey: IdempotencyKeySchema,
});

export type BaseJobPayload = z.infer<typeof BaseJobPayloadSchema>;
