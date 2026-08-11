import { RoutePlaceholder } from "../components/route-placeholder";

export default function ArtworkWorkbenchPage() {
  return (
    <RoutePlaceholder
      eyebrow="Artwork Workbench"
      title="Upload artwork"
      description="The artwork entry route is ready for the S01 upload workflow."
      details={["Route: /", "No project list or project creation route is exposed."]}
    />
  );
}
