import { cacheLife, cacheTag } from "next/cache";

import type {
  About,
  Brand,
  ExperienceGroup,
  Project,
  Settings,
  Skill,
  Tag,
  Testimonial,
} from "@/types/api";

const API_URL = (process.env.API_URL ?? "http://localhost:8000").replace(/\/$/, "");

async function request(path: string): Promise<Response> {
  return fetch(`${API_URL}/api/v1${path}`, {
    headers: { Accept: "application/json" },
  });
}

async function get<T>(path: string): Promise<T> {
  const res = await request(path);

  if (!res.ok) {
    throw new Error(`API GET ${path} failed with ${res.status}`);
  }

  return ((await res.json()) as { data: T }).data;
}

// Every helper is cached until Laravel calls /api/revalidate with its tag.

export async function getSettings() {
  "use cache";
  cacheTag("settings");
  cacheLife("max");
  return get<Settings>("/settings");
}

export async function getAbouts() {
  "use cache";
  cacheTag("abouts");
  cacheLife("max");
  return get<About[]>("/abouts");
}

export async function getProjects() {
  "use cache";
  cacheTag("projects", "tags");
  cacheLife("max");
  return get<Project[]>("/projects");
}

/** Returns null when the project doesn't exist or isn't published. */
export async function getProject(slug: string) {
  "use cache";
  cacheTag("projects", "tags");
  cacheLife("max");

  const path = `/projects/${encodeURIComponent(slug)}`;
  const res = await request(path);

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`API GET ${path} failed with ${res.status}`);
  }

  return ((await res.json()) as { data: Project }).data;
}

export async function getTags() {
  "use cache";
  cacheTag("tags", "projects");
  cacheLife("max");
  return get<Tag[]>("/tags");
}

export async function getSkills() {
  "use cache";
  cacheTag("skills");
  cacheLife("max");
  return get<Skill[]>("/skills");
}

export async function getExperiences() {
  "use cache";
  cacheTag("experiences");
  cacheLife("max");
  return get<ExperienceGroup[]>("/experiences");
}

export async function getTestimonials() {
  "use cache";
  cacheTag("testimonials");
  cacheLife("max");
  return get<Testimonial[]>("/testimonials");
}

export async function getBrands() {
  "use cache";
  cacheTag("brands");
  cacheLife("max");
  return get<Brand[]>("/brands");
}
