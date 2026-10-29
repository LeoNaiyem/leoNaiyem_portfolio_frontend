export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const NAV_ITEMS = ["home", "about", "work", "skills", "testimonial", "contact"] as const;

export type SectionId = (typeof NAV_ITEMS)[number];

// Used when the matching settings field is empty in the admin panel.
export const FALLBACK_NAME = "Naiyem";
export const FALLBACK_EMAIL = "mdnaiyem.islam.10@gmail.com";
export const FALLBACK_RESUME = "/Resume.pdf";

// The API has no phone field yet.
export const PHONE = { href: "tel:+8801635663575", label: "+880 1635663575" };
