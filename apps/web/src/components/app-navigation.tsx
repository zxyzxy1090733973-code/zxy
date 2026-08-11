"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  readonly href: string;
  readonly label: string;
  readonly match: "exact" | "prefix";
}

const navigationItems: readonly NavigationItem[] = [
  {
    href: "/",
    label: "Artwork",
    match: "exact",
  },
  {
    href: "/artworks/example-artwork/decomposition",
    label: "Decomposition",
    match: "prefix",
  },
  {
    href: "/parts/example-part",
    label: "Part",
    match: "prefix",
  },
  {
    href: "/models/example-model",
    label: "Model",
    match: "exact",
  },
  {
    href: "/models/example-model/exports",
    label: "Exports",
    match: "prefix",
  },
];

function isActivePath(pathname: string, item: NavigationItem) {
  if (item.match === "exact") {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="app-nav" aria-label="Primary routes">
      {navigationItems.map((item) => {
        const isActive = isActivePath(pathname, item);

        return (
          <Link
            key={item.href}
            className="app-nav__link"
            href={item.href}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
