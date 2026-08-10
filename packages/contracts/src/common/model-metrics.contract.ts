import { z } from "zod";

export const BoundingBoxSchema = z.object({
  width: z.number().finite().nonnegative(),
  height: z.number().finite().nonnegative(),
  depth: z.number().finite().nonnegative(),
});

export const ModelMetricsSchema = z.object({
  triangleCount: z.number().int().nonnegative(),
  vertexCount: z.number().int().nonnegative(),
  meshCount: z.number().int().nonnegative(),
  materialCount: z.number().int().nonnegative(),
  textureCount: z.number().int().nonnegative(),
  fileSizeBytes: z.number().int().nonnegative(),
  boundingBox: BoundingBoxSchema,
});

export type BoundingBoxContract = z.infer<typeof BoundingBoxSchema>;
export type ModelMetricsContract = z.infer<typeof ModelMetricsSchema>;
