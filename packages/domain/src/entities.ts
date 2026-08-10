import type {
  ArtworkId,
  DecompositionRunId,
  ModelAnalysisId,
  ModelExportId,
  ModelReviewId,
  ModelVersionId,
  MultiviewVersionId,
  PartId,
  ProviderTaskId,
  ProjectId,
  ReferenceImageVersionId,
} from "./ids.js";
import type { ImageRegion } from "./image-region.js";
import type { ModelRequirements } from "./model-requirements.js";
import type {
  AssetVersionStatus,
  DecompositionRunStatus,
  ExportFormat,
  ModelExportStatus,
  ModelVersionStatus,
  MultiviewDirection,
  PartStatus,
  ProjectStatus,
  ReviewDecision,
  ValidationResult,
} from "./statuses.js";

export interface Project {
  readonly id: ProjectId;
  readonly name: string;
  readonly status: ProjectStatus;
  readonly defaultModelRequirements: ModelRequirements;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Artwork {
  readonly id: ArtworkId;
  readonly projectId: ProjectId;
  readonly objectKey: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly width: number;
  readonly height: number;
  readonly createdAt: Date;
}

export interface DecompositionRun {
  readonly id: DecompositionRunId;
  readonly projectId: ProjectId;
  readonly artworkId: ArtworkId;
  readonly status: DecompositionRunStatus;
  readonly version: number;
  readonly errorCode?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Part {
  readonly id: PartId;
  readonly projectId: ProjectId;
  readonly decompositionRunId: DecompositionRunId;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly imageRegion: ImageRegion;
  readonly occlusionLevel: number;
  readonly confidence: number;
  readonly referenceImagePrompt: string;
  readonly multiviewPrompt: string;
  readonly modelRequirements: ModelRequirements;
  readonly reviewRequired: boolean;
  readonly status: PartStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ReferenceImageVersion {
  readonly id: ReferenceImageVersionId;
  readonly partId: PartId;
  readonly version: number;
  readonly status: AssetVersionStatus;
  readonly objectKey?: string;
  readonly prompt: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface MultiviewImage {
  readonly direction: MultiviewDirection;
  readonly objectKey: string;
}

export interface MultiviewVersion {
  readonly id: MultiviewVersionId;
  readonly partId: PartId;
  readonly version: number;
  readonly status: AssetVersionStatus;
  readonly prompt: string;
  readonly images: readonly MultiviewImage[];
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ModelVersion {
  readonly id: ModelVersionId;
  readonly partId: PartId;
  readonly multiviewVersionId: MultiviewVersionId;
  readonly version: number;
  readonly status: ModelVersionStatus;
  readonly glbObjectKey?: string;
  readonly providerTaskId?: ProviderTaskId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface BoundingBox {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
}

export interface ModelMetrics {
  readonly triangleCount: number;
  readonly vertexCount: number;
  readonly meshCount: number;
  readonly materialCount: number;
  readonly textureCount: number;
  readonly fileSizeBytes: number;
  readonly boundingBox: BoundingBox;
}

export interface ModelAnalysis {
  readonly id: ModelAnalysisId;
  readonly modelVersionId: ModelVersionId;
  readonly analyzerVersion: string;
  readonly metrics: ModelMetrics;
  readonly result: ValidationResult;
  readonly createdAt: Date;
}

export interface ModelReview {
  readonly id: ModelReviewId;
  readonly modelVersionId: ModelVersionId;
  readonly decision: ReviewDecision;
  readonly comment?: string;
  readonly metricSnapshot: ModelMetrics;
  readonly createdAt: Date;
}

export interface ModelExport {
  readonly id: ModelExportId;
  readonly modelVersionId: ModelVersionId;
  readonly format: ExportFormat;
  readonly status: ModelExportStatus;
  readonly objectKey?: string;
  readonly validationResult?: ValidationResult;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
