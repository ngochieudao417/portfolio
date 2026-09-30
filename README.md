# Đào Ngọc Hiếu — Portfolio

Interactive personal portfolio — a small "digital lab" for an AI / R&D / Automation Engineer.

**Stack:** Next.js (App Router) · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · Three.js

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

Requires Node.js 20.9+.

---

## Editing content

All content lives in `content/` — UI components never hard-code copy or facts.

| File | What it holds |
|---|---|
| `content/profile.ts` | Name, role, email, phone, socials, portrait & CV paths, selected GitHub repos |
| `content/projects.ts` | Featured projects + "More projects" (template at the bottom) |
| `content/research.ts` | Research Lab overview fields + notebook cells |
| `content/journey.ts` | Career Journey milestones |
| `content/education.ts` | Education & academic achievements |
| `content/certifications.ts` | Credentials |
| `content/skills.ts` | Grouped skills (no ratings) |
| `content/focus.ts` | The five "Current focus" cards |
| `content/beyond-tech.ts` | Beyond Tech items |
| `content/translations/en.ts`, `vi.ts` | All UI copy, English and Vietnamese |

**Missing information is never invented.** Empty strings / `null` mean "not provided yet":
production hides them; `npm run dev` shows a dashed `// TODO … → file` marker so you can see
exactly what is left to fill in. (Set `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true` to see them in a build.)

### Assets (drop-in — no code changes)

The layout checks `/public` at build time and swaps placeholders for real files automatically.

| Put this file | And this appears |
|---|---|
| `public/images/profile.jpg` | Hero portrait (4:5 works best) |
| `public/resume/Dao-Ngoc-Hieu-CV.pdf` | Every "Request CV" button becomes "Download CV" |
| `public/projects/<slug>/…` | Project covers / screenshots — reference them in `projects.ts` (`cover`, `screenshots`) |
| `public/certificates/…` | Credential badges — reference them in `certifications.ts` (`badge`) |

---

## Contact form

The form is provider-agnostic (`lib/contact/providers.ts`) and configured only through environment
variables — see `.env.example`.

- `CONTACT_PROVIDER=resend` + `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM_EMAIL`
- `CONTACT_PROVIDER=webhook` + `CONTACT_WEBHOOK_URL` (n8n, Make, Zapier, Slack…)

If nothing is configured, the form is replaced by a direct-contact card — the site never shows a
broken form. The API route validates input, has a honeypot and a basic rate limit.

Set `NEXT_PUBLIC_SITE_URL` in production for canonical URLs, the sitemap and Open Graph.

---

## Features

- **Dark / light themes** — separate token sets in `app/globals.css`, circular reveal via the View Transitions API.
- **EN / VI** — typed dictionaries; `vi.ts` must match the shape of `en.ts` at compile time.
- **Recruiter mode** (navbar switch) — disables particles and decorative motion, adds an
  "At a glance" summary, turns projects into a scannable list, expands the timeline and pins CV / Contact.
- **Particle field** — Three.js, lazy-loaded after idle, skipped on low-power/handheld devices and
  save-data, paused off-screen, adaptive quality, static frame under `prefers-reduced-motion`.
- **Case studies** — modal on the home page plus a full page at `/projects/[slug]`;
  research notebooks at `/research/[slug]`.
- **Easter eggs** — `⌘K` / `Ctrl+K` command palette, `` ` `` hidden terminal (`help`), and
  double-click the `|ĐNH⟩` logo to "measure" the lab.
- **SEO** — metadata, Open Graph image, sitemap, robots, JSON-LD `Person`.
- **Accessibility** — semantic landmarks, skip link, focus-trapped dialogs with Escape, visible focus,
  reduced-motion support, accessible form errors.

## Structure

```
app/            routes, metadata, sitemap/robots, OG image, contact API
components/     one folder per section + ui/, layout/, effects/, content/
content/        everything that is text or data
lib/            i18n, contact providers, UI state, utils
public/         images, projects, certificates, resume
```
