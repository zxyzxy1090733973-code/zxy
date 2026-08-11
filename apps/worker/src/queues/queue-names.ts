export const QUEUE_NAMES = [
  "artwork.decompose",
  "part.reference-image.generate",
  "part.multiview.generate",
  "model.generate",
  "model.download",
  "model.analyze",
  "model.export",
] as const;

export type QueueName = (typeof QUEUE_NAMES)[number];
