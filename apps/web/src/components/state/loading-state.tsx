interface LoadingStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly label?: string;
  readonly align?: "start" | "center";
}

export function LoadingState({
  title = "Loading",
  description,
  label = title,
  align = "center",
}: LoadingStateProps) {
  return (
    <div
      className={`state-block state-block--${align}`}
      role="status"
      aria-live="polite"
    >
      <span className="loading-spinner" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <div className="state-copy">
        <h2 className="state-title">{title}</h2>
        {description ? (
          <p className="state-description">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
