import { EmptyState } from "./state";

interface RoutePlaceholderProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly details?: readonly string[];
}

export function RoutePlaceholder({
  eyebrow,
  title,
  description,
  details = [],
}: RoutePlaceholderProps) {
  return (
    <div className="page-shell">
      <section className="route-panel" aria-labelledby="route-title">
        <EmptyState
          eyebrow={eyebrow}
          title={title}
          titleId="route-title"
          description={description}
          details={details.map((detail, detailIndex) => ({
            id: `route-detail-${detailIndex}`,
            label: "Status",
            value: detail,
          }))}
        />
      </section>
    </div>
  );
}
