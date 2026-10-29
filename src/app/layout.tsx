import type { Metadata } from "next";
import { DM_Sans, Tangerine } from "next/font/google";

import Navbar from "@/components/Navbar";
import { getSettings } from "@/lib/api";
import { FALLBACK_NAME, FALLBACK_RESUME, SITE_URL } from "@/lib/site";

import "./globals.scss";

// Every page must be fully static. Also makes a project added after deploy render
// completely on its first request, so unknown slugs get a real 404 status.
export const ensureStatic = "navigation";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-base",
});

const tangerine = Tangerine({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-script",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const name = settings.name ?? FALLBACK_NAME;
  const title = settings.seo.title ?? [name, settings.title].filter(Boolean).join(" | ");
  const description = settings.seo.description ?? settings.bio ?? undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${name}` },
    description,
    applicationName: name,
    authors: [{ name, url: SITE_URL }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: name,
      title,
      description,
      url: "/",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

  return (
    <html lang="en" className={`${dmSans.variable} ${tangerine.variable}`}>
      <body>
        <Navbar resumeUrl={settings.resume ?? FALLBACK_RESUME} />
        {children}
      </body>
    </html>
  );
}
