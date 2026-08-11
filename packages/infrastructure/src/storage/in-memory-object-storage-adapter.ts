import type {
  CreateSignedDownloadUrlInput,
  GetObjectResult,
  ObjectStoragePort,
  PutObjectInput,
  StoredObject,
} from "@concept-to-model/application";

export class InMemoryObjectStorageAdapter implements ObjectStoragePort {
  private readonly objects = new Map<string, GetObjectResult>();

  async putObject(input: PutObjectInput): Promise<StoredObject> {
    const storedObject: GetObjectResult = {
      objectKey: input.objectKey,
      body: new Uint8Array(input.body),
      contentType: input.contentType,
      sizeBytes: input.body.byteLength,
      metadata: input.metadata,
    };

    this.objects.set(input.objectKey, storedObject);

    return {
      objectKey: storedObject.objectKey,
      contentType: storedObject.contentType,
      sizeBytes: storedObject.sizeBytes,
      metadata: storedObject.metadata,
    };
  }

  async getObject(objectKey: string): Promise<GetObjectResult> {
    const storedObject = this.objects.get(objectKey);

    if (!storedObject) {
      throw new Error(`Object "${objectKey}" was not found.`);
    }

    return {
      ...storedObject,
      body: new Uint8Array(storedObject.body),
    };
  }

  async deleteObject(objectKey: string): Promise<void> {
    this.objects.delete(objectKey);
  }

  async createSignedDownloadUrl(
    input: CreateSignedDownloadUrlInput,
  ): Promise<string> {
    if (!this.objects.has(input.objectKey)) {
      throw new Error(`Object "${input.objectKey}" was not found.`);
    }

    const expiresAt = Date.now() + input.expiresInSeconds * 1000;
    const encodedObjectKey = encodeURIComponent(input.objectKey);

    return `memory://${encodedObjectKey}?expiresAt=${expiresAt}`;
  }
}
