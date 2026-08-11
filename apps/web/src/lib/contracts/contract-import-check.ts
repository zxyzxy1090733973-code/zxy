import { ApiErrorResponseSchema } from "./index";
import type { ApiErrorResponse } from "./index";

export function createContractImportCheck(): ApiErrorResponse {
  return ApiErrorResponseSchema.parse({
    errorCode: "CONTRACT_IMPORT_CHECK",
    message: "Contract imports are available to the web app.",
  });
}
