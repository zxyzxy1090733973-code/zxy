import { RoutePlaceholder } from "../../../components/route-placeholder";

interface PartDetailPageProps {
  readonly params: Promise<{
    readonly partId: string;
  }>;
}

export default async function PartDetailPage({ params }: PartDetailPageProps) {
  const { partId } = await params;

  return (
    <RoutePlaceholder
      eyebrow="Part Detail"
      title="Track part generation"
      description="The part detail route is ready for reference image, multiview, and model generation states."
      details={[`Part ID: ${partId}`, "Route: /parts/[partId]"]}
    />
  );
}
