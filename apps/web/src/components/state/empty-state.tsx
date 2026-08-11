import type { ReactNode } from "react";

export interface EmptyStateDetail {
  readonly id?: string;
  readonly label: string;
  readonly value: ReactNode;
}

interface EmptyStateProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly titleId?: string;
  readonly description?: string;
  readonly details?: readonly EmptyStateDetail[];
  readonly actions?: ReactNode;
  readonly children?: ReactNode;
  readonly align?: "start" | "center";
}

export function EmptyState({
  eyebrow,
  title,
  titleId,
  description,
  details = [],
  actions,
  children,
  align = "start",
}: EmptyStateProps) {
  return (
    <div className={`state-block state-block--${align}`}>
      <div className="state-copy">
        {eyebrow ? <p className="state-eyebrow">{eyebrow}</p> : null}
        <h1 className="state-heading" id={titleId}>
          {title}
        </h1>
        {description ? (
          <p className="state-description">{description}</p>
        ) : null}
      </div>
      {details.length > 0 ? (
        <dl className="state-detail-list">
          {details.map((detail, detailIndex) => (
            <div key={detail.id ?? `${detail.label}-${detailIndex}`}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {children}
      {actions ? <div className="state-actions">{actions}</div> : null}
    </div>
  );
}
