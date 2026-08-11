import { createApiClient } from "./api-client";
import type { ApiClient, JsonBody } from "./api-client";

export interface BusinessApiClientOptions {
  readonly apiClient?: ApiClient;
}

export interface BusinessApiClient {
  uploadArtwork(formData: FormData): Promise<unknown>;
  startArtworkDecomposition(request: JsonBody): Promise<unknown>;
  getDecomposition(decompositionRunId: string): Promise<unknown>;
  updatePart(partId: string, request: JsonBody): Promise<unknown>;
  approveDecomposition(decompositionRunId: string): Promise<unknown>;
  startReferenceImageGeneration(partId: string): Promise<unknown>;
  setActiveReferenceImageVersion(
    referenceImageVersionId: string,
  ): Promise<unknown>;
  startMultiviewGeneration(partId: string): Promise<unknown>;
  approveMultiview(multiviewVersionId: string): Promise<unknown>;
  startModelGeneration(partId: string): Promise<unknown>;
  getModelVersion(modelVersionId: string): Promise<unknown>;
  reviewModel(modelVersionId: string, request: JsonBody): Promise<unknown>;
  startModelRegeneration(
    modelVersionId: string,
    request: JsonBody,
  ): Promise<unknown>;
  startModelExport(modelVersionId: string, request: JsonBody): Promise<unknown>;
  createDownloadUrl(modelExportId: string): Promise<unknown>;
}

export function createBusinessApiClient(
  options: BusinessApiClientOptions = {},
): BusinessApiClient {
  const apiClient = options.apiClient ?? createApiClient();

  return {
    uploadArtwork: (formData) =>
      apiClient.post("/api/artworks", { body: formData }),
    startArtworkDecomposition: (request) =>
      apiClient.post("/api/decompositions", { body: request }),
    getDecomposition: (decompositionRunId) =>
      apiClient.get(`/api/decompositions/${decompositionRunId}`),
    updatePart: (partId, request) =>
      apiClient.patch(`/api/parts/${partId}`, { body: request }),
    approveDecomposition: (decompositionRunId) =>
      apiClient.post(`/api/decompositions/${decompositionRunId}/approve`),
    startReferenceImageGeneration: (partId) =>
      apiClient.post(`/api/parts/${partId}/reference-images`),
    setActiveReferenceImageVersion: (referenceImageVersionId) =>
      apiClient.post(
        `/api/reference-image-versions/${referenceImageVersionId}/active`,
      ),
    startMultiviewGeneration: (partId) =>
      apiClient.post(`/api/parts/${partId}/multiviews`),
    approveMultiview: (multiviewVersionId) =>
      apiClient.post(`/api/multiviews/${multiviewVersionId}/approve`),
    startModelGeneration: (partId) =>
      apiClient.post(`/api/parts/${partId}/models`),
    getModelVersion: (modelVersionId) =>
      apiClient.get(`/api/models/${modelVersionId}`),
    reviewModel: (modelVersionId, request) =>
      apiClient.post(`/api/models/${modelVersionId}/reviews`, {
        body: request,
      }),
    startModelRegeneration: (modelVersionId, request) =>
      apiClient.post(`/api/models/${modelVersionId}/regenerations`, {
        body: request,
      }),
    startModelExport: (modelVersionId, request) =>
      apiClient.post(`/api/models/${modelVersionId}/exports`, {
        body: request,
      }),
    createDownloadUrl: (modelExportId) =>
      apiClient.post(`/api/exports/${modelExportId}/download-url`),
  };
}
