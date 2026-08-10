import { z } from "zod";

export class ContractParseError extends Error {
  constructor(readonly issues: z.ZodIssue[]) {
    super("Contract validation failed.");
    this.name = "ContractParseError";
  }
}

export function parseContract<TSchema extends z.ZodType>(
  schema: TSchema,
  value: unknown,
): z.infer<TSchema> {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new ContractParseError(result.error.issues);
  }

  return result.data;
}
