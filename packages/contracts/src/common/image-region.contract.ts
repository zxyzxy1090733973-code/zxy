import { z } from "zod";

export const ImageRegionSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().finite().positive(),
  height: z.number().finite().positive(),
});

export type ImageRegionContract = z.infer<typeof ImageRegionSchema>;
