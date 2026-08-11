export interface ApiClientErrorDetails {
  readonly status: number;
  readonly code?: string;
  readonly message: string;
  readonly requestId?: string;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly requestId?: string;

  constructor(details: ApiClientErrorDetails) {
    super(details.message);
    this.name = "ApiClientError";
    this.status = details.status;
    this.code = details.code;
    this.requestId = details.requestId;
  }

  static async fromResponse(response: Response): Promise<ApiClientError> {
    const body = await readErrorBody(response);

    return new ApiClientError({
      status: response.status,
      code: getStringField(body, "code"),
      message:
        getStringField(body, "message") ??
        response.statusText ??
        "Request failed.",
      requestId:
        response.headers.get("x-request-id") ??
        getStringField(body, "requestId"),
    });
  }
}

async function readErrorBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return undefined;
  }

  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function getStringField(value: unknown, field: string): string | undefined {
  if (!value || typeof value !== "object" || !(field in value)) {
    return undefined;
  }

  const fieldValue = (value as Record<string, unknown>)[field];

  return typeof fieldValue === "string" ? fieldValue : undefined;
}
