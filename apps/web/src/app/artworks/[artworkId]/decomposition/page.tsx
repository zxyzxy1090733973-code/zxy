import { RoutePlaceholder } from "../../../../components/route-placeholder";

interface DecompositionPageProps {
  readonly params: Promise<{
    readonly artworkId: string;
  }>;
}

export default async function DecompositionPage({
  params,
}: DecompositionPageProps) {
  const { artworkId } = await params;

  return (
    <RoutePlaceholder
      eyebrow="Decomposition Review"
      title="Review generated parts"
      description="The decomposition review route is ready for the S02/S03 workflow."
      details={[
        `Artwork ID: ${artworkId}`,
        "Route: /artworks/[artworkId]/decomposition",
      ]}
    />
  );
}
