import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foliora | Build a developer portfolio without designing one.",
  description:
    "Import projects from GitHub, customize your content, and publish a professional portfolio in minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-surface text-on-surface">{children}</body>
    </html>
  );
}
