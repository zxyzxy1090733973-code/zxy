import { RoutePlaceholder } from "../../../../components/route-placeholder";

interface ModelExportsPageProps {
  readonly params: Promise<{
    readonly modelVersionId: string;
  }>;
}

export default async function ModelExportsPage({
  params,
}: ModelExportsPageProps) {
  const { modelVersionId } = await params;

  return (
    <RoutePlaceholder
      eyebrow="Model Exports"
      title="Download validated exports"
      description="The model export route is ready for OBJ and FBX workflow states."
      details={[
        `Model version ID: ${modelVersionId}`,
        "Route: /models/[modelVersionId]/exports",
      ]}
    />
  );
}
