# Portfolio Migration Plan

Move the portfolio from **Create React App + Sanity** to **Next.js (frontend)** + **Laravel 13 / MySQL (backend API + admin)**.

## Why

- **SEO:** every section fetches content in the browser (`useEffect` + `client.fetch`), so search engines get an almost empty page. Next.js renders the content on the server.
- **Outdated tooling:** `react-scripts` (CRA) is deprecated. `node-sass` is deprecated and breaks on current Node versions.
- **Security:** `.env` is committed to git, and `REACT_APP_SANITY_TOKEN` ships in the public JS bundle. The contact form writes to Sanity from the browser using that token.
- **Ownership:** your own API and admin panel instead of a third-party CMS. You can also update the resume without committing a new PDF.

## Repository layout

There are two separate repositories:

| Repo | Contents | Hosting |
|---|---|---|
| `leoNaiyem_portfolio_frontend` (this repo) | Next.js app | Vercel (old CRA site: Render) |
| `leoNaiyem_portfolio_api` (new) | Laravel 13 API + Filament admin | Not decided yet |

The only contract between them is the REST API (`/api/v1`) plus a revalidation webhook.

## Architecture

```
┌──────────────────────┐   REST (JSON)    ┌──────────────────────────┐
│ Next.js (App Router) │ ───────────────► │ Laravel 13 API           │
│ SSG + ISR, TS        │                  │ + Filament admin panel   │
│ Vercel               │ ◄─────────────── │ MySQL 8, queues, mail    │
└──────────────────────┘  revalidate hook └──────────────────────────┘
```

- Pages are built ahead of time (SSG). When you save content in Filament, Laravel calls `POST /api/revalidate` on the Next.js app, and the page updates within seconds.
- Visitors never call Laravel directly, except for the contact form. The browser posts it straight to `POST /api/v1/contact` (CORS-restricted), so the per-IP rate limit and Turnstile see the real visitor and not Vercel's servers.

---

## Phase 0: Cleanup (about half a day)

- [ ] **(You)** Rotate the Sanity token in the Sanity dashboard. The old one is in git history.
- [x] `git rm --cached .env` and add `.env*` to `.gitignore`.
- [x] ~~Export content with the Sanity CLI~~. No longer needed: `php artisan import:sanity` reads the live dataset over HTTP.
- [x] Create the API project at `F:\WebDevelopment\Projects\leoNaiyem_portfolio_api` (git initialized, nothing committed yet).
- [x] **(You)** Create the GitHub repo for the API and push (`LeoNaiyem/LeoNaiyem-portfolio-api`).

## Phase 1: Laravel 13 backend ✅ done

### Setup
- [x] Laravel 13.39 (PHP 8.4, MySQL 8). Tests use PHPUnit, the Laravel default, instead of Pest.
- [x] Filament v5.11 admin panel at `/admin`.
- [x] CORS (only the frontend origin) and media disk (`MEDIA_DISK=public` or `s3`).

### Database schema

Two changes from the original draft: `experiences` is one row per role (grouped by year in the API), and `settings.socials` is a list of `{platform, url}`.

| Table | Columns |
|---|---|
| `users` | admin login |
| `settings` | name, title, bio, avatar, resume_path, social links (json), seo_title, seo_description |
| `abouts` | title, description, image, sort_order |
| `projects` | title, slug (unique), excerpt, body, image, project_url, code_url, is_featured, sort_order, published_at |
| `tags` | name, slug |
| `project_tag` | project_id, tag_id |
| `skills` | name, icon, bg_color, sort_order |
| `experiences` | year, role, company, description, sort_order |
| `testimonials` | name, company, feedback, image, sort_order |
| `brands` | name, image, url, sort_order |
| `contact_messages` | name, email, message, ip, user_agent, read_at |

The full API reference is in the API repo's `README.md`.

### Public API (`/api/v1`, read-only, `Cache-Control` + ETag)
- [x] `GET /settings`
- [x] `GET /abouts`
- [x] `GET /projects?tag=` and `GET /projects/{slug}` (published only, `body` only on the detail endpoint)
- [x] `GET /tags` (only tags used by published projects)
- [x] `GET /skills`
- [x] `GET /experiences` (grouped by year)
- [x] `GET /testimonials`
- [x] `GET /brands`
- [x] Eloquent API Resources for every response.

### Contact
- [x] `POST /api/v1/contact`: FormRequest validation, rate limit (3/min, 20/day per IP), honeypot (`website`), Cloudflare Turnstile (skipped when no secret is set).
- [x] Stores the message and sends a queued mail notification to `ADMIN_EMAIL`.

### Admin (Filament)
- [x] Resources for every table, with image uploads and drag-to-reorder.
- [x] Inbox with unread badge. Opening a message marks it read. Includes a reply-by-email button.
- [x] "Profile & SEO" settings page (single record), with resume PDF upload and social links.

### Revalidation
- [x] `RevalidatesFrontend` model trait queues `RevalidateFrontend` (debounced 5s per tag) on save and delete. Drag-reordering also triggers it.

### Data migration
- [x] `php artisan import:sanity <project-id> --token=<token>`: idempotent, downloads images.

### Tests
- [x] 34 PHPUnit feature tests: all endpoints, contact validation, honeypot, Turnstile, rate limit, revalidation, import, and an admin page smoke test.

### Still to do on the backend
- [ ] **(You)** Start MySQL (XAMPP), create the `leonaiyem_portfolio` database, and switch the local `.env` from SQLite to MySQL (see `.env.example`).
- [ ] **(You)** `php artisan make:filament-user`, then run `import:sanity` with your project ID.

## Phase 2: Next.js frontend ✅ done (branch `next-migration`, uncommitted)

Built on Next.js 16.4 (React 19.3) with Cache Components and Partial Prefetching. Differences from the original plan:

- Caching uses `'use cache'` + `cacheTag(table)` + `cacheLife('max')` in `lib/api.ts`, not `fetch(..., { next: { tags } })`. The webhook calls `revalidateTag(tag, { expire: 0 })`, since the one-argument form is deprecated in v16.
- `ensureStatic = "navigation"` on the root layout keeps the whole site static. The project page also sets `instant = false`, so projects added after a deploy render fully on the first visit and unknown slugs return a real 404 (not a streamed soft 404).
- SCSS became `.module.scss` files (with `sass`), not plain CSS Modules. Shared utility classes (`head-text`, `p-text`, `app__flex`, ...) live in `globals.scss`.
- Projects use the API's `description` field (the plan said `excerpt`). The resume comes from `settings.resume`, falling back to `public/Resume.pdf`.
- The project filter uses `GET /tags`, not the old hardcoded list.
- The phone number is still hardcoded (`lib/site.ts`) because the API has no phone field.
- Tested against a mock API with populated data: all sections render server-side, there is one `h1` per page, and the revalidate webhook, sitemap, robots, OG image and 404s work. Lighthouse has not been run yet.

### Setup
- [x] Scaffold with `create-next-app`: latest Next.js, App Router, TypeScript, ESLint, `src/` dir.
- [x] Replace `node-sass` with `sass`, `framer-motion` with `motion`, and keep `react-icons`.
- [x] Remove `@sanity/client`, `@sanity/image-url` and `react-scripts`.
- [x] Environment variables: `API_URL` (server-side fetches), `NEXT_PUBLIC_API_URL` (contact form), `REVALIDATE_SECRET`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_SITE_URL`, plus optional `MEDIA_URL`.
- [x] `/api/revalidate` route: check the `x-revalidate-secret` header, then `revalidateTag(body.tag, { expire: 0 })`.

### Structure
```
src/
  app/
    layout.tsx              # fonts, global styles, default metadata, JSON-LD
    page.tsx                # home: all sections
    projects/[slug]/page.tsx
    api/revalidate/route.ts
    sitemap.ts
    robots.ts
    opengraph-image.tsx
  components/               # Navbar, SocialMedia, NavigationDots, Section
  sections/                 # Header, About, Work, Skills, Testimonial, Contact
  lib/api.ts                # typed fetch helpers with cache tags
  types/
```

### Porting
- [x] Sections become Server Components that fetch from `lib/api.ts` (`'use cache'` + `cacheTag`).
- [x] Only the interactive parts become client components: Navbar menu, project filter, testimonial slider, contact form, experience tooltips.
- [x] Replace the `AppWrap` / `MotionWrap` HOCs with a `<Section>` layout component.
- [x] Convert the SCSS files to SCSS Modules (same design).
- [x] Replace `<img>` with `next/image` and add the API domain to `images.remotePatterns`.
- [x] Contact form: client component posts to `{NEXT_PUBLIC_API_URL}/api/v1/contact` with a Turnstile widget and the hidden `website` honeypot. No secrets in the browser.
- [x] Project page body: render Markdown (`react-markdown`).
- [x] Load the resume link from `settings.resume` (falls back to `public/Resume.pdf`).

### SEO
- [x] Metadata API: title template, description, canonical, Open Graph and Twitter cards.
- [x] `generateMetadata` on each project page.
- [x] `sitemap.ts` (home + every project) and `robots.ts`.
- [x] JSON-LD `Person` schema on home and `CreativeWork` on project pages.
- [x] Semantic headings (one `h1` per page) and alt text everywhere.
- [ ] Lighthouse: aim for 90+ in every category. Local run with mock data (2026-10-29):
  - Home: mobile perf ~88 (83–90), desktop 99. Project page: mobile 95, desktop 100. SEO 100 everywhere.
  - Accessibility 96: brand orange `#ec3600` on white is 4.12:1 contrast, and small text needs 4.5:1 (Resume button, copyright name, active filter). Needs a design decision.
  - Best Practices 96 on home: `react.png` is 64×64 but displayed at 90px. Needs a larger asset.
  - **(You)** Re-run on the deployed site (CDN/HTTP2 change the mobile numbers).

### Verified end to end (2026-10-30)
- Contact form in Chrome against the real API (on a copy of the dev database):
  - The browser check blocks empty fields, and the API rejects short messages and a filled honeypot (422, error shown to the visitor).
  - A valid message returns 201: it is stored, and the queued admin email has the right To, Reply-To, body and admin link.
  - CORS allows only the site's origin, including on 429 responses, so the rate-limit message reaches the visitor.
  - Turnstile and real mail delivery still need production keys.
- Visual check of every section at desktop and phone width, with content (mock) and without (real, empty API). No horizontal overflow.
- Production `.env` for the API: set `APP_NAME` (emails are currently branded "Laravel") and `ADMIN_EMAIL` (unset means no notification is sent).

## Phase 3: Deployment (about 1 day)

Decided (2026-10-30): frontend on **Vercel** (Hobby). There is no custom domain; the old site is `leonaiyem.onrender.com` (Render, auto-deploys `main`). The API host is not decided yet.

Why not Render for the new frontend: Render's disk is ephemeral and free instances sleep after ~15 idle minutes. Each wake-up would drop the pages refreshed by `/api/revalidate`, so admin edits would revert to build-time content.

**Do not merge `next-migration` into `main` while Render is still connected.** Render would try to deploy the Next app with the old CRA settings and break the live site.

Order matters: the frontend build fetches from the API, so the API goes first.

1. [ ] **Backend:** deploy Laravel, provision MySQL 8, run migrations and the import, start the queue worker and scheduler, and configure mail.
   - Production `.env`: `APP_NAME`, `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, `ADMIN_EMAIL`, `MAIL_*`, `TURNSTILE_SECRET_KEY`, `REVALIDATE_SECRET` (a new random value), and `MEDIA_DISK` (`s3` if the host's disk is ephemeral).
   - Set `FRONTEND_URL` once the Vercel URL is known (step 2).
2. [ ] **Frontend:** import the GitHub repo in Vercel with the production branch set to `next-migration` for now. Framework, build and output settings are auto-detected. Environment variables:
   - `API_URL` and `NEXT_PUBLIC_API_URL`: the public API URL.
   - `MEDIA_URL`: only when the API uses S3/R2.
   - `REVALIDATE_SECRET`: the same value as the API.
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
   - `NEXT_PUBLIC_SITE_URL`: the `https://<project>.vercel.app` URL.
3. [ ] Set the API's `FRONTEND_URL` to the Vercel URL (CORS + revalidation target).
4. [ ] Test on the live site: the contact form (with Turnstile and real mail), then an edit in Filament showing up on the site (revalidate webhook).
5. [ ] Merge `next-migration` into `main` and switch Vercel's production branch to `main`. Before merging, disconnect or suspend the Render service so it doesn't deploy the Next app.
6. [ ] Retire `leonaiyem.onrender.com`: add a Render redirect rule (`/*` → the Vercel URL, 301) so old links and search results carry over, then shut it down later.
7. [ ] Submit the sitemap to Google Search Console (the vercel.app URL; a custom domain would be easier to keep long term).
8. [ ] Shut down the Sanity project.

## Open decisions

- [x] Keep the current design (decided at the start of Phase 2).
- [ ] Backend hosting: Laravel Cloud, Forge + VPS, or shared cPanel?
- [x] Admin panel: Filament.
