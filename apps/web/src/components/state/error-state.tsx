"use client";

import type { ReactNode } from "react";

import { RetryAction } from "./retry-action";

type ErrorStateRetryProps =
  | {
      readonly retryHref: string;
      readonly onRetry?: never;
    }
  | {
      readonly retryHref?: never;
      readonly onRetry: () => void;
    }
  | {
      readonly retryHref?: never;
      readonly onRetry?: never;
    };

type ErrorStateProps = {
  readonly title?: string;
  readonly description?: string;
  readonly retryLabel?: string;
  readonly children?: ReactNode;
  readonly align?: "start" | "center";
} & ErrorStateRetryProps;

export function ErrorState({
  title = "Something went wrong",
  description,
  retryLabel = "Retry",
  retryHref,
  onRetry,
  children,
  align = "start",
}: ErrorStateProps) {
  return (
    <div className={`state-block state-block--${align}`} role="alert">
      <div className="state-copy">
        <p className="state-eyebrow state-eyebrow--danger">Error</p>
        <h2 className="state-title">{title}</h2>
        {description ? (
          <p className="state-description">{description}</p>
        ) : null}
      </div>
      {children}
      {retryHref ? (
        <div className="state-actions">
          <RetryAction href={retryHref} label={retryLabel} />
        </div>
      ) : null}
      {onRetry ? (
        <div className="state-actions">
          <RetryAction onRetry={onRetry} label={retryLabel} />
        </div>
      ) : null}
    </div>
  );
}
