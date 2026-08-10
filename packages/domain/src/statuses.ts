export const PROJECT_STATUSES = [
  "DRAFT",
  "ARTWORK_UPLOADED",
  "DECOMPOSING",
  "DECOMPOSITION_REVIEW",
  "PROCESSING_PARTS",
  "PARTIALLY_COMPLETED",
  "COMPLETED",
  "FAILED",
  "CANCELED",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PART_STATUSES = [
  "PENDING",
  "REFERENCE_GENERATING",
  "REFERENCE_REVIEW",
  "MULTIVIEW_GENERATING",
  "MULTIVIEW_REVIEW",
  "MODEL_SUBMITTING",
  "MODEL_GENERATING",
  "MODEL_DOWNLOADING",
  "MODEL_ANALYZING",
  "REVIEW_REQUIRED",
  "APPROVED",
  "REJECTED",
  "EXPORTING",
  "DOWNLOAD_READY",
  "FAILED",
  "CANCELED",
] as const;

export type PartStatus = (typeof PART_STATUSES)[number];

export const DECOMPOSITION_RUN_STATUSES = [
  "QUEUED",
  "RUNNING",
  "SUCCEEDED",
  "FAILED",
  "CANCELED",
] as const;

export type DecompositionRunStatus =
  (typeof DECOMPOSITION_RUN_STATUSES)[number];

export const ASSET_VERSION_STATUSES = [
  "GENERATING",
  "REVIEW_REQUIRED",
  "APPROVED",
  "REJECTED",
  "FAILED",
] as const;

export type AssetVersionStatus = (typeof ASSET_VERSION_STATUSES)[number];

export const MODEL_VERSION_STATUSES = [
  "QUEUED",
  "SUBMITTING",
  "GENERATING",
  "DOWNLOADING",
  "ANALYZING",
  "REVIEW_REQUIRED",
  "APPROVED",
  "REJECTED",
  "FAILED",
  "CANCELED",
] as const;

export type ModelVersionStatus = (typeof MODEL_VERSION_STATUSES)[number];

export const MODEL_EXPORT_STATUSES = [
  "QUEUED",
  "EXPORTING",
  "VALIDATING",
  "DOWNLOAD_READY",
  "FAILED",
  "CANCELED",
] as const;

export type ModelExportStatus = (typeof MODEL_EXPORT_STATUSES)[number];

export const MULTIVIEW_DIRECTIONS = ["FRONT", "LEFT", "BACK"] as const;

export type MultiviewDirection = (typeof MULTIVIEW_DIRECTIONS)[number];

export const REVIEW_DECISIONS = ["APPROVED", "REJECTED"] as const;

export type ReviewDecision = (typeof REVIEW_DECISIONS)[number];

export const EXPORT_FORMATS = ["OBJ", "FBX"] as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export const VALIDATION_RESULTS = ["PASSED", "WARNING", "FAILED"] as const;

export type ValidationResult = (typeof VALIDATION_RESULTS)[number];
