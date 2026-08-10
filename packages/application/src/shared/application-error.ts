export class ApplicationError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly originalCause?: unknown,
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class NotFoundApplicationError extends ApplicationError {
  constructor(resourceName: string, resourceId: string) {
    super(`${resourceName} was not found.`, "NOT_FOUND");
    this.name = "NotFoundApplicationError";
    this.resourceName = resourceName;
    this.resourceId = resourceId;
  }

  readonly resourceName: string;
  readonly resourceId: string;
}

export class InvalidStateApplicationError extends ApplicationError {
  constructor(message: string) {
    super(message, "INVALID_STATE");
    this.name = "InvalidStateApplicationError";
  }
}
