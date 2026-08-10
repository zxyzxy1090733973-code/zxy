export interface ModelRequirements {
  readonly targetTriangleCount: number;
  readonly maximumTriangleCount: number;
  readonly texturesRequired: boolean;
  readonly pbrMaterialsRequired: boolean;
  readonly maximumFileSizeBytes: number;
}

export function createModelRequirements(
  requirements: ModelRequirements,
): ModelRequirements {
  if (!Number.isInteger(requirements.targetTriangleCount)) {
    throw new Error("Target triangle count must be an integer.");
  }

  if (!Number.isInteger(requirements.maximumTriangleCount)) {
    throw new Error("Maximum triangle count must be an integer.");
  }

  if (!Number.isInteger(requirements.maximumFileSizeBytes)) {
    throw new Error("Maximum file size must be an integer.");
  }

  if (requirements.targetTriangleCount <= 0) {
    throw new Error("Target triangle count must be positive.");
  }

  if (requirements.maximumTriangleCount < requirements.targetTriangleCount) {
    throw new Error(
      "Maximum triangle count must be greater than or equal to target triangle count.",
    );
  }

  if (requirements.maximumFileSizeBytes <= 0) {
    throw new Error("Maximum file size must be positive.");
  }

  return requirements;
}
