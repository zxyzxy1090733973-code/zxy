import Link from "next/link";
import type { ReactNode } from "react";

import { AppNavigation } from "./app-navigation";

interface AppShellProps {
  readonly children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-lockup" href="/">
            <span className="brand-mark" aria-hidden="true">
              CM
            </span>
            <span>
              <span className="brand-name">Concept Art Parts</span>
              <span className="brand-caption">Local workspace</span>
            </span>
          </Link>
          <AppNavigation />
        </div>
      </header>
      <main id="main-content" className="app-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
