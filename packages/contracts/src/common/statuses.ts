import {
  ASSET_VERSION_STATUSES,
  DECOMPOSITION_RUN_STATUSES,
  EXPORT_FORMATS,
  MODEL_EXPORT_STATUSES,
  MODEL_VERSION_STATUSES,
  MULTIVIEW_DIRECTIONS,
  PART_STATUSES,
  PROJECT_STATUSES,
  REVIEW_DECISIONS,
  VALIDATION_RESULTS,
} from "@concept-to-model/domain";
import { z } from "zod";

export const ProjectStatusSchema = z.enum(PROJECT_STATUSES);
export const PartStatusSchema = z.enum(PART_STATUSES);
export const DecompositionRunStatusSchema = z.enum(
  DECOMPOSITION_RUN_STATUSES,
);
export const AssetVersionStatusSchema = z.enum(ASSET_VERSION_STATUSES);
export const ModelVersionStatusSchema = z.enum(MODEL_VERSION_STATUSES);
export const ModelExportStatusSchema = z.enum(MODEL_EXPORT_STATUSES);
export const MultiviewDirectionSchema = z.enum(MULTIVIEW_DIRECTIONS);
export const ReviewDecisionSchema = z.enum(REVIEW_DECISIONS);
export const ExportFormatSchema = z.enum(EXPORT_FORMATS);
export const ValidationResultSchema = z.enum(VALIDATION_RESULTS);

export type ProjectStatusValue = z.infer<typeof ProjectStatusSchema>;
export type PartStatusValue = z.infer<typeof PartStatusSchema>;
export type DecompositionRunStatusValue = z.infer<
  typeof DecompositionRunStatusSchema
>;
export type AssetVersionStatusValue = z.infer<
  typeof AssetVersionStatusSchema
>;
export type ModelVersionStatusValue = z.infer<typeof ModelVersionStatusSchema>;
export type ModelExportStatusValue = z.infer<typeof ModelExportStatusSchema>;
export type MultiviewDirectionValue = z.infer<typeof MultiviewDirectionSchema>;
export type ReviewDecisionValue = z.infer<typeof ReviewDecisionSchema>;
export type ExportFormatValue = z.infer<typeof ExportFormatSchema>;
export type ValidationResultValue = z.infer<typeof ValidationResultSchema>;
