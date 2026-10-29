import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiFillEye, AiFillGithub } from "react-icons/ai";
import Markdown from "react-markdown";

import JsonLd from "@/components/JsonLd";
import { getProject, getProjects, getSettings } from "@/lib/api";
import { FALLBACK_NAME, SITE_URL } from "@/lib/site";

import styles from "./page.module.scss";

// Blocks on params instead of streaming a shell, so crawlers always get the full page
// and a missing slug returns a real 404 status. The page is still static (ensureStatic).
export const instant = false;

// Cache Components needs at least one param to validate the route at build time.
const PLACEHOLDER_SLUG = "__placeholder__";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.length > 0 ? projects.map((project) => ({ slug: project.slug })) : [{ slug: PLACEHOLDER_SLUG }];
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {};
  }

  const path = `/projects/${project.slug}`;
  const description = project.description ?? undefined;
  const images = project.image ? [{ url: project.image, alt: project.title }] : undefined;

  return {
    title: project.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: project.title,
      description,
      url: path,
      images,
      publishedTime: project.published_at ?? undefined,
      modifiedTime: project.updated_at ?? undefined,
      tags: project.tags.map((tag) => tag.name),
    },
    twitter: { card: images ? "summary_large_image" : "summary", title: project.title, description },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProject(slug), getSettings()]);

  if (!project) {
    notFound();
  }

  const url = `${SITE_URL}/projects/${project.slug}`;

  return (
    <main className={`${styles.page} app__primaryBg`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.description ?? undefined,
          url,
          image: project.image ?? undefined,
          datePublished: project.published_at ?? undefined,
          dateModified: project.updated_at ?? undefined,
          keywords: project.tags.map((tag) => tag.name).join(", ") || undefined,
          author: { "@type": "Person", name: settings.name ?? FALLBACK_NAME, url: SITE_URL },
        }}
      />

      <article className={styles.article}>
        <Link href="/#work" className={`${styles.back} p-text`}>
          ← All projects
        </Link>

        <h1 className="head-text">{project.title}</h1>

        {project.tags.length > 0 && (
          <ul className={styles.tags}>
            {project.tags.map((tag) => (
              <li key={tag.id} className="p-text">
                {tag.name}
              </li>
            ))}
          </ul>
        )}

        {project.image && (
          <Image
            className={styles.cover}
            src={project.image}
            alt={project.title}
            width={1600}
            height={900}
            sizes="(max-width: 900px) 100vw, 860px"
            priority
          />
        )}

        {(project.project_url || project.code_url) && (
          <div className={styles.links}>
            {project.project_url && (
              <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                <AiFillEye /> Live site
              </a>
            )}
            {project.code_url && (
              <a href={project.code_url} target="_blank" rel="noopener noreferrer">
                <AiFillGithub /> Source code
              </a>
            )}
          </div>
        )}

        {project.body ? (
          <div className={styles.body}>
            {/* The page title is the only h1. */}
            <Markdown components={{ h1: "h2" }}>{project.body}</Markdown>
          </div>
        ) : (
          project.description && <p className={`${styles.body} p-text`}>{project.description}</p>
        )}
      </article>
    </main>
  );
}
