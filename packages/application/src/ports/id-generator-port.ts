import type {
  ArtworkId,
  DecompositionRunId,
  IdempotencyKey,
  JobId,
  ModelAnalysisId,
  ModelExportId,
  ModelReviewId,
  ModelVersionId,
  MultiviewVersionId,
  PartId,
  ProjectId,
  ReferenceImageVersionId,
} from "@concept-to-model/domain";

export interface IdGeneratorPort {
  createProjectId(): ProjectId;
  createArtworkId(): ArtworkId;
  createDecompositionRunId(): DecompositionRunId;
  createPartId(): PartId;
  createReferenceImageVersionId(): ReferenceImageVersionId;
  createMultiviewVersionId(): MultiviewVersionId;
  createModelVersionId(): ModelVersionId;
  createModelAnalysisId(): ModelAnalysisId;
  createModelReviewId(): ModelReviewId;
  createModelExportId(): ModelExportId;
  createJobId(): JobId;
  createIdempotencyKey(): IdempotencyKey;
}
