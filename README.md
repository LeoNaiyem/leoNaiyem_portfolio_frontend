# Leo Naiyem Portfolio

Next.js frontend for the portfolio site. Content comes from the Laravel API in
`leoNaiyem_portfolio_api`. Every page is prerendered and only rebuilt when content
changes in the admin panel.

## Requirements

- Node.js 20.9+
- The API running locally (see the API repo's README)

## Local setup

```bash
npm install
cp .env.example .env.local   # point API_URL / NEXT_PUBLIC_API_URL at your API
npm run dev                  # http://localhost:3000
```

`npm run build` fetches all content from the API, so the API must be reachable
during the build. The build fails if the API is down. This is deliberate: an empty
site never gets deployed.

## Environment

| Variable | Purpose |
|---|---|
| `API_URL` | API base URL for server-side fetches |
| `NEXT_PUBLIC_API_URL` | API base URL the browser posts the contact form to |
| `MEDIA_URL` | Optional image origin when the API stores media on S3 / R2 |
| `REVALIDATE_SECRET` | Must match `REVALIDATE_SECRET` in the API |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key; empty hides the widget |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (canonical links, sitemap, Open Graph) |

Image hosts for `next/image` are derived from `API_URL` and `MEDIA_URL` in
`next.config.ts`. In development, images from `localhost` are allowed. In
production, the API must be on a public host.

## How content stays fresh

- `src/lib/api.ts` wraps each endpoint in `'use cache'` with a cache tag named after
  its table (`settings`, `projects`, `skills`, ...).
- When content is saved in the admin, Laravel calls `POST /api/revalidate` with the
  `x-revalidate-secret` header and `{ "tag": "<table>" }`. That expires the tag, and
  the next visit renders fresh content.
- `ensureStatic = "navigation"` in the root layout keeps every page fully static. The
  build fails if a change would add per-request rendering.
- Projects published after a deploy are rendered fully on their first visit and then
  cached. Unknown slugs return a real 404.

## Structure

```
src/
  app/            routes, metadata, sitemap, robots, OG image, revalidate webhook
  components/     Navbar, Section layout, social links, navigation dots, JSON-LD
  sections/       home page sections; *Grid / *Slider / *Form / *Tooltip are client islands
  lib/api.ts      typed, cached API helpers
  types/api.ts    API response types
```
