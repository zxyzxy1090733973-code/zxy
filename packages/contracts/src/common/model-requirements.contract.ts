import { z } from "zod";

export const ModelRequirementsSchema = z
  .object({
    targetTriangleCount: z.number().int().positive(),
    maximumTriangleCount: z.number().int().positive(),
    texturesRequired: z.boolean(),
    pbrMaterialsRequired: z.boolean(),
    maximumFileSizeBytes: z.number().int().positive(),
  })
  .refine(
    (requirements) =>
      requirements.maximumTriangleCount >= requirements.targetTriangleCount,
    {
      message:
        "Maximum triangle count must be greater than or equal to target triangle count.",
      path: ["maximumTriangleCount"],
    },
  );

export type ModelRequirementsContract = z.infer<
  typeof ModelRequirementsSchema
>;
