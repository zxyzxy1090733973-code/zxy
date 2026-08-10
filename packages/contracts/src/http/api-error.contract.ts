import { z } from "zod";

export const ApiErrorResponseSchema = z.object({
  errorCode: z.string().min(1),
  message: z.string().min(1),
  requestId: z.string().min(1).optional(),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
