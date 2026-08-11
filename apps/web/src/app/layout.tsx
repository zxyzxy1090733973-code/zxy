import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Concept Art Parts",
  description: "Local workflow for generating separate 3D model parts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-frame">
          <header className="top-bar">
            <Link className="brand" href="/">
              Concept Art Parts
            </Link>
            <nav className="route-nav" aria-label="Foundation routes">
              <Link href="/">Artwork</Link>
              <Link href="/artworks/example-artwork/decomposition">
                Decomposition
              </Link>
              <Link href="/parts/example-part">Part</Link>
              <Link href="/models/example-model">Model</Link>
              <Link href="/models/example-model/exports">Exports</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
