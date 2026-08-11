import { ApiClientError } from "./api-error";

export type JsonBody =
  | null
  | boolean
  | number
  | string
  | readonly JsonBody[]
  | { readonly [key: string]: JsonBody };

export interface ApiClientOptions {
  readonly baseUrl?: string;
  readonly fetchImpl?: typeof fetch;
}

export interface ApiRequestOptions<TBody extends JsonBody | FormData = JsonBody> {
  readonly body?: TBody;
  readonly headers?: HeadersInit;
  readonly signal?: AbortSignal;
}

export interface ApiClient {
  get<TResponse>(
    path: string,
    options?: ApiRequestOptions<never>,
  ): Promise<TResponse>;
  post<TBody extends JsonBody | FormData, TResponse>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse>;
  patch<TBody extends JsonBody, TResponse>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse>;
  delete<TResponse>(
    path: string,
    options?: ApiRequestOptions<never>,
  ): Promise<TResponse>;
}

const DEFAULT_API_BASE_URL = "";

export function createApiClient(
  options: ApiClientOptions = {},
): ApiClient {
  const fetchImpl = options.fetchImpl ?? fetch;
  const baseUrl = options.baseUrl ?? DEFAULT_API_BASE_URL;

  return {
    get: <TResponse>(
      path: string,
      requestOptions?: ApiRequestOptions<never>,
    ) =>
      request<TResponse, never>(
        fetchImpl,
        baseUrl,
        "GET",
        path,
        requestOptions,
      ),
    post: <TBody extends JsonBody | FormData, TResponse>(
      path: string,
      requestOptions?: ApiRequestOptions<TBody>,
    ) =>
      request<TResponse, TBody>(
        fetchImpl,
        baseUrl,
        "POST",
        path,
        requestOptions,
      ),
    patch: <TBody extends JsonBody, TResponse>(
      path: string,
      requestOptions?: ApiRequestOptions<TBody>,
    ) =>
      request<TResponse, TBody>(
        fetchImpl,
        baseUrl,
        "PATCH",
        path,
        requestOptions,
      ),
    delete: <TResponse>(
      path: string,
      requestOptions?: ApiRequestOptions<never>,
    ) =>
      request<TResponse, never>(
        fetchImpl,
        baseUrl,
        "DELETE",
        path,
        requestOptions,
      ),
  };
}

async function request<TResponse, TBody extends JsonBody | FormData = JsonBody>(
  fetchImpl: typeof fetch,
  baseUrl: string,
  method: string,
  path: string,
  options: ApiRequestOptions<TBody> = {},
): Promise<TResponse> {
  const response = await fetchImpl(createApiUrl(baseUrl, path), {
    body: createRequestBody(options.body),
    headers: createHeaders(options),
    method,
    signal: options.signal,
  });

  if (!response.ok) {
    throw await ApiClientError.fromResponse(response);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

function createApiUrl(baseUrl: string, path: string): string {
  if (!path.startsWith("/api/")) {
    throw new Error(`API paths must start with "/api/": ${path}`);
  }

  return `${baseUrl}${path}`;
}

function createHeaders<TBody extends JsonBody | FormData>(
  options: ApiRequestOptions<TBody>,
): HeadersInit {
  if (options.body instanceof FormData) {
    return options.headers ?? {};
  }

  return {
    "content-type": "application/json",
    ...options.headers,
  };
}

function createRequestBody<TBody extends JsonBody | FormData>(
  body: TBody | undefined,
): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}
