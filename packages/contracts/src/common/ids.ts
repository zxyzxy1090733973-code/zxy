import { z } from "zod";

export const NonEmptyIdSchema = z.string().min(1);

export const ProjectIdSchema = NonEmptyIdSchema;
export const ArtworkIdSchema = NonEmptyIdSchema;
export const DecompositionRunIdSchema = NonEmptyIdSchema;
export const PartIdSchema = NonEmptyIdSchema;
export const ReferenceImageVersionIdSchema = NonEmptyIdSchema;
export const MultiviewVersionIdSchema = NonEmptyIdSchema;
export const ModelVersionIdSchema = NonEmptyIdSchema;
export const ModelAnalysisIdSchema = NonEmptyIdSchema;
export const ModelReviewIdSchema = NonEmptyIdSchema;
export const ModelExportIdSchema = NonEmptyIdSchema;
export const JobIdSchema = NonEmptyIdSchema;
export const ProviderTaskIdSchema = NonEmptyIdSchema;
export const IdempotencyKeySchema = NonEmptyIdSchema;

export type ProjectIdValue = z.infer<typeof ProjectIdSchema>;
export type ArtworkIdValue = z.infer<typeof ArtworkIdSchema>;
export type DecompositionRunIdValue = z.infer<
  typeof DecompositionRunIdSchema
>;
export type PartIdValue = z.infer<typeof PartIdSchema>;
export type ReferenceImageVersionIdValue = z.infer<
  typeof ReferenceImageVersionIdSchema
>;
export type MultiviewVersionIdValue = z.infer<typeof MultiviewVersionIdSchema>;
export type ModelVersionIdValue = z.infer<typeof ModelVersionIdSchema>;
export type ModelAnalysisIdValue = z.infer<typeof ModelAnalysisIdSchema>;
export type ModelReviewIdValue = z.infer<typeof ModelReviewIdSchema>;
export type ModelExportIdValue = z.infer<typeof ModelExportIdSchema>;
export type JobIdValue = z.infer<typeof JobIdSchema>;
export type ProviderTaskIdValue = z.infer<typeof ProviderTaskIdSchema>;
export type IdempotencyKeyValue = z.infer<typeof IdempotencyKeySchema>;
