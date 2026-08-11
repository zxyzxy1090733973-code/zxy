export type ObjectMetadata = Readonly<Record<string, string>>;

export interface PutObjectInput {
  readonly objectKey: string;
  readonly body: Uint8Array;
  readonly contentType: string;
  readonly metadata?: ObjectMetadata;
}

export interface StoredObject {
  readonly objectKey: string;
  readonly contentType: string;
  readonly sizeBytes: number;
  readonly metadata?: ObjectMetadata;
}

export interface GetObjectResult extends StoredObject {
  readonly body: Uint8Array;
}

export interface CreateSignedDownloadUrlInput {
  readonly objectKey: string;
  readonly expiresInSeconds: number;
  readonly responseContentDisposition?: string;
}

export interface ObjectStoragePort {
  putObject(input: PutObjectInput): Promise<StoredObject>;
  getObject(objectKey: string): Promise<GetObjectResult>;
  deleteObject(objectKey: string): Promise<void>;
  createSignedDownloadUrl(
    input: CreateSignedDownloadUrlInput,
  ): Promise<string>;
}
