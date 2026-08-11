import type { Metadata } from "next";

import { AppShell } from "../components";

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
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
