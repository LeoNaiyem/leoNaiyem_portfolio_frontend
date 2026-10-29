import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";

import { CACHE_TAGS, type CacheTag } from "@/types/api";

/**
 * Called by Laravel after content changes:
 * POST /api/revalidate, header `x-revalidate-secret`, body `{ "tag": "projects" }`.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || !safeEqual(request.headers.get("x-revalidate-secret") ?? "", secret)) {
    return Response.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tag?: unknown } | null;
  const tag = body?.tag;

  if (typeof tag !== "string" || !CACHE_TAGS.includes(tag as CacheTag)) {
    return Response.json({ message: "Unknown tag" }, { status: 422 });
  }

  // Expire immediately so the next visit renders fresh content instead of a stale copy.
  revalidateTag(tag, { expire: 0 });

  return Response.json({ revalidated: true, tag });
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
