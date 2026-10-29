// Shapes returned by the Laravel API (`/api/v1`). See the API repo's README.

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "twitter"
  | "facebook"
  | "instagram"
  | "youtube"
  | "website";

export interface Social {
  platform: SocialPlatform;
  url: string;
}

export interface Settings {
  name: string | null;
  title: string | null;
  bio: string | null;
  email: string | null;
  avatar: string | null;
  resume: string | null;
  socials: Social[];
  seo: {
    title: string | null;
    description: string | null;
  };
}

export interface About {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  /** Markdown; only present on `GET /projects/{slug}`. */
  body?: string | null;
  image: string | null;
  project_url: string | null;
  code_url: string | null;
  is_featured: boolean;
  tags: Tag[];
  published_at: string | null;
  updated_at: string | null;
}

export interface Skill {
  id: number;
  name: string;
  icon: string | null;
  bg_color: string | null;
}

export interface Experience {
  id: number;
  role: string;
  company: string | null;
  description: string | null;
}

export interface ExperienceGroup {
  year: string;
  items: Experience[];
}

export interface Testimonial {
  id: number;
  name: string;
  company: string | null;
  feedback: string;
  image: string | null;
}

export interface Brand {
  id: number;
  name: string;
  image: string | null;
  url: string | null;
}

/** Cache tags; each matches the table name Laravel sends to `/api/revalidate`. */
export const CACHE_TAGS = [
  "settings",
  "abouts",
  "projects",
  "tags",
  "skills",
  "experiences",
  "testimonials",
  "brands",
] as const;

export type CacheTag = (typeof CACHE_TAGS)[number];
