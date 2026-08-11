"use client";

import type { MouseEvent } from "react";

type RetryActionProps = {
  readonly label?: string;
  readonly disabled?: boolean;
  readonly className?: string;
} & (
  | {
      readonly href: string;
      readonly onRetry?: never;
    }
  | {
      readonly href?: never;
      readonly onRetry: () => void;
    }
);

export function RetryAction({
  label = "Retry",
  disabled = false,
  className,
  href,
  onRetry,
}: RetryActionProps) {
  const actionClassName = ["retry-action", className].filter(Boolean).join(" ");

  if (href) {
    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      if (disabled) {
        event.preventDefault();
      }
    }

    return (
      <a
        className={actionClassName}
        href={href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={handleClick}
      >
        <span className="retry-action-icon" aria-hidden="true" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <button
      className={actionClassName}
      type="button"
      disabled={disabled}
      onClick={onRetry}
    >
      <span className="retry-action-icon" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
