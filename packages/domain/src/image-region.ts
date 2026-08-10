export interface ImageRegion {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export function createImageRegion(region: ImageRegion): ImageRegion {
  assertFiniteNumber(region.x, "Image region x");
  assertFiniteNumber(region.y, "Image region y");
  assertFiniteNumber(region.width, "Image region width");
  assertFiniteNumber(region.height, "Image region height");

  if (region.width <= 0) {
    throw new Error("Image region width must be positive.");
  }

  if (region.height <= 0) {
    throw new Error("Image region height must be positive.");
  }

  return region;
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be finite.`);
  }
}
