import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SearchOps — The Field Manual",
  description:
    "SearchOps Field Manual: Automated discoverability CI/CD for search crawlers and AI answer engines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bone-100 text-ink-900 font-sans antialiased selection:bg-ember-600/20 selection:text-ember-600 min-h-screen">
        {children}
      </body>
    </html>
  );
}
