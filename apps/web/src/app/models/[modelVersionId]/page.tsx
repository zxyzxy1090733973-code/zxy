import { RoutePlaceholder } from "../../../components/route-placeholder";

interface ModelReviewPageProps {
  readonly params: Promise<{
    readonly modelVersionId: string;
  }>;
}

export default async function ModelReviewPage({
  params,
}: ModelReviewPageProps) {
  const { modelVersionId } = await params;

  return (
    <RoutePlaceholder
      eyebrow="Model Review"
      title="Review generated model"
      description="The model review route is ready for the S09/S10 preview and decision workflow."
      details={[
        `Model version ID: ${modelVersionId}`,
        "Route: /models/[modelVersionId]",
      ]}
    />
  );
}
