import type { MetadataRoute } from "next";

import { getProjects } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const latest = projects
    .map((project) => project.updated_at)
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);

  return [
    { url: SITE_URL, lastModified: latest, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: project.updated_at ?? undefined,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
