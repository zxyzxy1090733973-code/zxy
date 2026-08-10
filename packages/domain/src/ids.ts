export type Brand<TValue, TBrand extends string> = TValue & {
  readonly __brand: TBrand;
};

export type ProjectId = Brand<string, "ProjectId">;
export type ArtworkId = Brand<string, "ArtworkId">;
export type DecompositionRunId = Brand<string, "DecompositionRunId">;
export type PartId = Brand<string, "PartId">;
export type ReferenceImageVersionId = Brand<
  string,
  "ReferenceImageVersionId"
>;
export type MultiviewVersionId = Brand<string, "MultiviewVersionId">;
export type ModelVersionId = Brand<string, "ModelVersionId">;
export type ModelAnalysisId = Brand<string, "ModelAnalysisId">;
export type ModelReviewId = Brand<string, "ModelReviewId">;
export type ModelExportId = Brand<string, "ModelExportId">;
export type JobId = Brand<string, "JobId">;
export type ProviderTaskId = Brand<string, "ProviderTaskId">;
export type IdempotencyKey = Brand<string, "IdempotencyKey">;

export function toProjectId(value: string): ProjectId {
  return value as ProjectId;
}

export function toArtworkId(value: string): ArtworkId {
  return value as ArtworkId;
}

export function toDecompositionRunId(value: string): DecompositionRunId {
  return value as DecompositionRunId;
}

export function toPartId(value: string): PartId {
  return value as PartId;
}

export function toReferenceImageVersionId(
  value: string,
): ReferenceImageVersionId {
  return value as ReferenceImageVersionId;
}

export function toMultiviewVersionId(value: string): MultiviewVersionId {
  return value as MultiviewVersionId;
}

export function toModelVersionId(value: string): ModelVersionId {
  return value as ModelVersionId;
}

export function toModelAnalysisId(value: string): ModelAnalysisId {
  return value as ModelAnalysisId;
}

export function toModelReviewId(value: string): ModelReviewId {
  return value as ModelReviewId;
}

export function toModelExportId(value: string): ModelExportId {
  return value as ModelExportId;
}

export function toJobId(value: string): JobId {
  return value as JobId;
}

export function toProviderTaskId(value: string): ProviderTaskId {
  return value as ProviderTaskId;
}

export function toIdempotencyKey(value: string): IdempotencyKey {
  return value as IdempotencyKey;
}
