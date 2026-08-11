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
    <main className="page-shell">
      <section className="route-panel" aria-labelledby="route-title">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="route-title">{title}</h1>
        <p className="description">{description}</p>
        {details.length > 0 ? (
          <dl className="detail-list">
            {details.map((detail) => (
              <div key={detail}>
                <dt>Status</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>
    </main>
  );
}
