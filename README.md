<div align="center">

# BHAF MarketBridge

**Marketplace and impact infrastructure for African women-led enterprises.**
Verified profiles, structured procurement, controlled data rooms and donor-grade impact reporting — in one platform BHAF and its ecosystem partners can operate.

_A product of BHAF Circular Academy & Consulting Firm._

</div>

---

## Table of contents

1. [What MarketBridge is today](#what-marketbridge-is-today)
2. [Product surfaces](#product-surfaces)
3. [The Use Cases pitch surface](#the-use-cases-pitch-surface)
4. [Tech stack](#tech-stack)
5. [Data model](#data-model)
6. [Trust infrastructure](#trust-infrastructure)
7. [User roles & demo accounts](#user-roles--demo-accounts)
8. [Running locally](#running-locally)
9. [Environment variables](#environment-variables)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Project journey](#project-journey)
13. [Repository structure](#repository-structure)
14. [Contributing](#contributing)

---

## What MarketBridge is today

MarketBridge is a **live web application**, not a prototype. It ships with real authentication, a real Postgres database, real payments, real file storage, a tamper-evident audit log, a working AI assistant, transactional email, three scheduled cron jobs and 37 passing tests.

The platform serves four sides of one ecosystem:

- **Entrepreneurs** — women-led ventures across Africa (with a launch focus on Nigeria, Kenya, Ghana, DRC, Senegal, South Africa and Zimbabwe).
- **Corporate buyers** — post RFPs, discover verified women-led suppliers, run structured procurement.
- **Funders** — DFIs, foundations, donors and impact investors — review controlled data rooms with tamper-evident evidence.
- **BHAF administrators & auditors** — verify artefacts, publish opportunities, run cohorts, and export donor-grade impact reports.

It ships with a dedicated **Use Cases** section (`/use-cases`) that acts as the primary sales/pitch surface — three interactive demonstrator journeys, three detail pages, a live-data ribbon, an interactive impact projector, and a print-friendly one-pager for each use case.

---

## Product surfaces

### Public
| Route | What it does |
|---|---|
| `/` | Landing page — hero, trust partners, role picker, journeys, government-funding pillar, featured entrepreneurs carousel |
| `/directory` | Verified entrepreneur directory · filter by sector, country, readiness |
| `/marketplace` | Product & service listings · category and text search |
| `/marketplace/rfps` | Open corporate RFPs · public browsing |
| `/marketplace/rfps/[id]` | RFP detail · entrepreneur response form |
| `/opportunities` | Grants · investments · procurement · programmes · certifications · **government funding** |
| `/use-cases` | **The pitch surface — see [next section](#the-use-cases-pitch-surface)** |
| `/use-cases/[slug]` | Three static detail pages, one per use case, print-friendly |
| `/impact` | ESG framework, three-pillar model, sector breakdown |
| `/impact/report` | **Donor-grade printable impact report** — real DB aggregation over a date range |
| `/legal/{terms,privacy,cookies}` | Legal copy (working drafts) |

### Authentication
Sign in · sign up (3-step wizard, role-aware) · forgot password · reset password · email verification (24h token) · sign-out.

### Role portals (auth-gated)
| Route | Role |
|---|---|
| `/portal/entrepreneur` | Entrepreneur workspace — readiness, artefacts, listings, applications, recommended opportunities |
| `/portal/entrepreneur/listings/new` | Publish a new listing |
| `/portal/entrepreneur/applications` | Track opportunity applications |
| `/portal/funder` | Funder desk — pipeline, shortlists, portfolio impact, compliance vault |
| `/portal/corporate` | Corporate desk — supplier diversity, active RFPs, ESG supplier scorecard |
| `/portal/corporate/rfps/new` | Post a new RFP |
| `/portal/corporate/rfps/[id]` | Review & shortlist RFP responses |
| `/admin` | BHAF admin dashboard — pending profiles, verification queue, audit log, readiness pipeline |
| `/admin/applications` | Review opportunity applications with status transitions |
| `/admin/cohorts` | Create & manage cohorts (Abuja Accelerator, FEMEC, etc.) with invitations |
| `/admin/opportunities/new` | Publish grant / investment / procurement / government opportunities |

### Deal-room features (auth-gated)
| Route | What it does |
|---|---|
| `/data-rooms` | Owned rooms + rooms shared with you |
| `/data-rooms/[id]` | Grant / revoke access (VIEW / DOWNLOAD / EDIT), time-bound expiry |
| `/messages`, `/messages/[id]` | DB-backed conversations with contextual pinning to opportunities, RFPs, data rooms |
| `/inbox` | In-app notifications feed |

### Billing
| Route | What it does |
|---|---|
| `/billing` | Pricing tiers (corporate + funder; entrepreneurs free during launch) |
| `/billing/dashboard` | Subscription management + invoice history |
| `/billing/checkout/[ref]` | Sandbox stub · or Paystack handoff when configured |
| `/billing/return` | Paystack `verifyTransaction` → local DB mirror |

### Settings, setup, misc
`/settings` (role-aware profile · KYC · password · account delete) · `/setup` (one-shot token-protected schema push + seed) · `/api/health` · branded `not-found` + `global-error` pages.

### Cron jobs (Vercel scheduled)
| Job | When | What it does |
|---|---|---|
| `/api/cron/artefact-expiry` | Daily 07:00 UTC | Flips `VALIDATED` → `EXPIRES_SOON` (14 days out) → `EXPIRED`; emails owner |
| `/api/cron/weekly-digest` | Mondays 08:00 UTC | Aggregates the last 7 days' activity; emails ACTIVE users |
| `/api/cron/subscription-renewal` | Daily 09:00 UTC | Sends renewal reminders; flips `ACTIVE` → `PAST_DUE` / `CANCELED` |

All cron endpoints are authenticated via `CRON_SECRET` with `crypto.timingSafeEqual`.

---

## The Use Cases pitch surface

`/use-cases` is the platform's primary demo/pitch surface. It was designed for BHAF to walk investors, DFIs, corporate procurement leads and programme partners through the value proposition in under 10 minutes.

**The page ships with 26 dedicated components** (`components/use-cases/*`) orchestrated into a single narrative:

1. **Scroll progress bar** — thin gold indicator under the navbar
2. **Animated ecosystem-diagram hero** — SVG with traveling dots (Entrepreneur → Marketplace/RFP → Data Room → Funder/Buyer + return loop for impact evidence)
3. **"I'm a ___" stakeholder switcher** — pill selector, auto-scrolls to the relevant journey
4. **Prototype disclaimer strip** — long-form, then repeated as a badge on every card and section
5. **Live metric ribbon** — real Prisma counts (verified entrepreneurs, artefacts, listings, RFPs, cohorts)
6. **Trust markers strip** — six institutional-grade trust rails (hash-chained audit, SHA-256 artefact validation, VirusTotal AV, timing-safe cron, Auth.js v5 + bcrypt, time-bound data rooms)
7. **Programme partner category rail** — placeholder categories until real partners consent
8. **Sticky scroll-spy nav** — seven anchors, IntersectionObserver-driven
9. **Three use-case overview cards** — each linking to a detail page
10. **Full journey per use case** with:
    - Challenge · scenario · numbered journey timeline
    - Platform features used (linked to real routes)
    - Expected value + prototype metric tiles
    - Without-vs-With MarketBridge comparison
    - Inline mock UI peek (entrepreneur profile detail · RFP supplier table · data room with audit log)
    - Use-case-specific extra (entrepreneur profile card · supplier comparison table · evidence readiness panel)
11. **Interactive Impact Projector** — three sliders (verified entrepreneurs · cohorts · RFPs) drive eight projected outputs; coefficients live in `data/use-cases.ts` and are clearly labelled as illustrative
12. **Rotating quote carousel** — four placeholder testimonials, pauses on hover, respects `prefers-reduced-motion`
13. **Feature → value map** — eight platform capabilities mapped to stakeholder value, all linked
14. **Demo flow** — the four-step narrative arc (entrepreneur → buyer → funder → continuous partnership)
15. **FAQ block** — six anticipated pitch objections, defused
16. **Closing CTA** — dark gradient, continuous-partnership framing
17. **Sticky "Start a conversation" bar** — fades in after 1200px of scroll, dismissable per session

The three detail pages (`/use-cases/entrepreneur-market-access`, `/use-cases/corporate-rfp-supplier-discovery`, `/use-cases/funder-due-diligence-impact`) each ship with a dedicated dark hero, three-move story (World today · MarketBridge moment · Projected outcome), full journey, comparison block, related-use-cases footer, and a **Save one-pager (PDF)** button that produces a clean printable one-pager.

**Wording discipline is enforced throughout.** Every metric is a prototype label; no delivery is claimed; the term _"Swedish Government"_ is deliberately replaced with _"European public-sector renewable-energy buyer (fictional buyer profile)"_; _"investment received"_ is replaced with _"investment interest simulated"_. See `data/use-cases.ts` and the audit report for the complete style rules.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, Server Components, Server Actions) |
| Language | TypeScript 5 |
| UI | React 19 (with React Compiler compatibility), Tailwind CSS 3, custom design tokens |
| Auth | **Auth.js v5** (NextAuth) — credentials + optional Google + optional Resend magic link; split-config for Edge-safe middleware; bcrypt password hashing |
| Database | **Prisma 6** on Postgres (Neon works out of the box) |
| File storage | **Vercel Blob** with SHA-256 hashing, MIME/magic-byte validation, 25 MB cap, VirusTotal AV lookup |
| Payments | **Paystack** (Africa-aware) — real webhook + `verifyTransaction`; Stripe/Flutterwave sketched |
| Email | **Resend** transactional (with graceful `console.log` fallback in dev) |
| AI | **Anthropic Claude Haiku 4.5** — streaming Asha assistant, rate-limited via Upstash Redis |
| KYC | Smile ID (currently a deterministic stub; real seam sketched) |
| Bot protection | Cloudflare Turnstile (bypass when secret missing) |
| Observability | Sentry (optional; DSN-gated) |
| Testing | Vitest 4, 37 tests across audit chain, payments, storage, schemas, i18n, env |
| Lint | **ESLint 9** flat config (`eslint.config.mjs`) + `eslint-config-next` 16 |
| CI | GitHub Actions — lint · test · build on every push and PR |
| Deployment | Vercel with 3 scheduled cron jobs |

**Security headers** (set in `next.config.mjs`): `X-Content-Type-Options`, `X-Frame-Options=SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`, HSTS preload; `X-Powered-By` disabled.

---

## Data model

The Prisma schema (`prisma/schema.prisma`) defines **23 models** grouped into four layers:

**Identity & profile.** `User`, `EntrepreneurProfile`, `FunderProfile`, `CorporateProfile`, `Account`, `Session`, `VerificationToken`.

**Validation & evidence.** `Artefact` (with 8-state lifecycle + dual-sign-off flag), `ArtefactCheck`, `ArtefactReview`, `AuditEntry` (hash-chained with `prevHash` + `selfHash`).

**Marketplace & opportunity flow.** `Listing`, `Opportunity` (types: GRANT · INVESTMENT · PROCUREMENT · PROGRAMME · CERTIFICATION · **GOVERNMENT**), `Application` (6-state pipeline), `Rfp`, `RfpResponse`, `Cohort`, `CohortMembership`, `DataRoom`, `DataRoomAccess` (VIEW / DOWNLOAD / EDIT with expiry).

**Communication & commerce.** `Conversation`, `ConversationParticipant`, `Message`, `Notification`, `Subscription`, `Invoice`.

Entrepreneur readiness progresses through `EMERGING → DEVELOPING → MARKET_READY → FUNDING_READY`. Users are soft-deleted via `deletedAt`.

---

## Trust infrastructure

Institutional funders trust platforms with visible security and verification rails. MarketBridge ships six that correspond to real modules in the codebase — surfaced in the Use Cases page's `TrustMarkers` strip:

| Marker | Where it lives |
|---|---|
| **Hash-chained audit log** — SHA-256 `selfHash` + `prevHash`; `verifyAuditChain()` recomputes the chain to detect tampering | `lib/audit.ts`, `AuditEntry` model |
| **Artefact validation pipeline** — MIME/magic-byte check → SHA-256 hash → AV scan → BHAF administrator sign-off (optional dual sign-off) | `lib/storage.ts`, `app/actions/artefacts.ts` |
| **VirusTotal AV** — hash-lookup with graceful `NOT_CONFIGURED` fallback | `lib/integrations/virusTotal.ts` |
| **Timing-safe cron auth** — `crypto.timingSafeEqual` on `CRON_SECRET` | `lib/cron.ts` |
| **Auth.js v5 + bcrypt** — credentials + optional OAuth; JWT strategy; split-config for Edge middleware | `auth.ts`, `auth.config.ts`, `middleware.ts` |
| **Time-bound data rooms** — VIEW / DOWNLOAD / EDIT access grants with `expiresAt`; revocation is immediate | `app/actions/dataRooms.ts` |

Payment webhooks additionally verify HMAC-SHA512 signatures with idempotent charge processing (`app/api/webhooks/paystack/route.ts`).

---

## User roles & demo accounts

Roles: `ENTREPRENEUR` · `FUNDER` · `CORPORATE` · `ADMIN` · `AUDITOR`.

After running `npm run db:seed` you can sign in with:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@bhaf.example` | `ChangeMe!123` |
| Entrepreneur | `amara@greenweave.example` | `Founder!123` |
| Funder | `fund@mosaic.example` | `Funder!123` |

**Rotate these before any real deployment.** The seed is idempotent — running it again overwrites the password hashes with the values above.

---

## Running locally

**Prerequisites** — Node.js 20 LTS, npm 10+.

```bash
git clone https://github.com/imomazin/bhaf-marketbridge.git
cd bhaf-marketbridge

npm install

# Optional: run against a real DB
cp .env.example .env.local     # then fill in DATABASE_URL, AUTH_SECRET, etc.
npm run db:push
npm run db:seed

npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). Without a DB it falls back to mock data on the public surfaces and displays a "Sample data" badge on `/directory`, `/marketplace` and `/opportunities`.

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production bundle (runs `prisma generate` first) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint 9 flat config |
| `npm test` | Vitest run |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run db:push` | Push Prisma schema to the DB |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | Seed demo accounts + profiles |

---

## Environment variables

The full contract is defined and validated in `lib/env.ts`. Missing keys fail fast in production and log a warning in development.

### Core

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (Neon, Supabase, RDS, etc.) |
| `AUTH_SECRET` | Session encryption (`openssl rand -base64 32`) |
| `AUTH_URL` | Canonical auth URL (production) |
| `NEXT_PUBLIC_APP_URL` | Absolute base URL for metadata & sitemap |

### Auth

| Variable | Purpose |
|---|---|
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth (optional) |
| `AUTH_RESEND_KEY` | Magic-link sign-in via Resend (optional) |

### Email

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Transactional email (welcome, verification, resets, receipts, digests) |
| `EMAIL_FROM` | e.g. `"BHAF MarketBridge <noreply@your-domain.com>"` |

### Storage & anti-abuse

| Variable | Purpose |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token |
| `VIRUSTOTAL_API_KEY` | AV hash lookup (optional; graceful NOT_CONFIGURED without it) |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare bot protection |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Distributed rate limiting for Asha AI |

### Payments

| Variable | Purpose |
|---|---|
| `PAYSTACK_SECRET_KEY` | Real Paystack integration |
| Stripe / Flutterwave keys | Sketched · not wired in production |

### AI & KYC

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` (or `CLAUDE_API_KEY`) | Asha streaming assistant |
| `SMILE_ID_PARTNER_ID` / `SMILE_ID_API_KEY` | KYC integration (currently stubbed, real seam sketched) |
| `SMILE_ID_MODE` | `stub` (default) or `real` |

### Ops

| Variable | Purpose |
|---|---|
| `CRON_SECRET` | Timing-safe auth for scheduled jobs |
| `SETUP_TOKEN` | Token-protected one-shot schema push + seed via `/api/setup` |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | Observability (optional) |

---

## Testing

`npm test` runs the full Vitest suite — **37 tests across six files** covering:

- `tests/audit.test.ts` — hash-chain integrity, tamper detection
- `tests/payments.test.ts` — Africa-aware provider routing, currency conversion
- `tests/storage.test.ts` — SHA-256 hashing, MIME sniffing, filename sanitising
- `tests/schemas.test.ts` — Zod contracts (auth, profiles, listings, RFPs, etc.)
- `tests/i18n.test.ts` — locale detection and fallback
- `tests/env.test.ts` — env validation (dev warns, prod fails)

GitHub Actions runs lint · test · build on every push and pull request.

---

## Deployment

**Vercel** is the reference deployment target. Push to `main` and Vercel builds automatically. Points to remember:

- Add all env vars in `Project Settings → Environment Variables`.
- `vercel.json` defines the three cron jobs (see [Cron jobs](#cron-jobs-vercel-scheduled)); Vercel's cron parser requires **numeric** day-of-week (not `MON`).
- `next.config.mjs` sends security headers on all responses.
- The `/impact/report` page uses `force-dynamic` so the numbers stay fresh; `/use-cases` is also dynamic so its live-metric ribbon reflects the DB.

**Dependabot** groups weekly npm updates by ecosystem (Next, Prisma, Auth, Anthropic SDK) and blocks major bumps on packages with known-breaking migrations (Prisma, Tailwind).

---

## Project journey

A brief history of what shipped, so new contributors and reviewers can see the shape of the work.

### Phase 0 — MVP scaffold
Next.js App Router · Tailwind · role picker landing · public directory · marketplace listings · opportunities board · impact overview · admin dashboard mock. **All static, mock-data.**

### Phases 1–15 — production build
- Real auth (Auth.js v5 credentials + optional OAuth; email verification; password reset)
- Prisma 6 on Postgres, seed with demo accounts, idempotent
- Split-config auth so middleware runs on Edge without Prisma
- Server actions for every mutation
- Vercel Blob file storage + SHA-256 hashing + MIME validation + 25 MB cap + VirusTotal AV
- Hash-chained audit log with `verifyAuditChain()`
- Paystack payments (real webhook, HMAC-SHA512 verify, idempotent, subscription create, receipt email)
- Resend transactional email (welcome, verification, resets, receipts, digests, artefact-expiry, subscription-renewal, message notifications, data-room-access notifications)
- Anthropic Claude Haiku 4.5 streaming Asha assistant, Upstash rate-limited
- DB-backed messaging with contextual pinning to opportunities/RFPs/data rooms
- Data rooms with access grants (VIEW/DOWNLOAD/EDIT + expiry)
- Corporate RFP flow (create → respond → review → award)
- Opportunity applications (SUBMITTED → UNDER_REVIEW → SHORTLISTED → REJECTED → WITHDRAWN → AWARDED)
- Cohorts + memberships (Abuja Accelerator, FEMEC pattern)
- Notifications (in-app + email)
- Three Vercel crons with timing-safe secret auth
- Sentry, Turnstile, Smile ID (stubbed), i18n (EN/FR toggle)
- Government funding pillar — 24 curated grants/schemes in `data/opportunities.ts` including AfDB AFAWA, BoI, DBN, WEF, NEIP, MASLOC, FEMEC, DER/FJ, SEFA, BDF, ECOWAS

### Upgrades
- Next 16 + React 19 + ESLint 9 flat config
- Prisma 6 pinned; Dependabot blocks Prisma-7 breaking bumps
- Zero lint warnings after React 19 rules ratchet
- Security headers, branded `not-found` + `global-error`, four `loading.tsx` skeletons, JSON-LD Organization schema
- Env validation module (`lib/env.ts`) with `hasIntegration()` helper
- Donor-grade printable impact report at `/impact/report` (real DB aggregation with `?from=`/`?to=`)

### Use Cases pitch surface
- Three demonstrator journeys (Entrepreneur · Buyer · Funder) with full storyboard
- 26 dedicated components (see [The Use Cases pitch surface](#the-use-cases-pitch-surface))
- Live-metric ribbon, animated ecosystem SVG, sticky scroll-spy nav, without-vs-with comparison, mock UI peeks, **interactive impact projector**, quote carousel, feature-value map, six-question FAQ, dark closing CTA, sticky partnership CTA bar
- Three static detail pages with print-friendly Save-one-pager (PDF) button

### Product audit
A complete 10-section product audit (executive summary through use-case readiness, gaps, and client data request list) captures every route, model, integration, and stakeholder journey with evidence references to file paths and line numbers.

---

## Repository structure

```
app/
  actions/                 Server actions (auth, profile, artefacts, listings,
                           RFPs, cohorts, dataRooms, messages, billing, KYC…)
  admin/                   BHAF admin surfaces
  api/                     REST/RPC endpoints (auth, chat, cron, webhooks, setup, health)
  auth/                    Sign-in, sign-up wizard, forgot / reset password, verify email
  billing/                 Pricing, checkout, subscriptions, return handler
  data-rooms/              Owned + shared data rooms
  directory/               Verified entrepreneur directory
  impact/                  ESG framework + donor-grade printable report
  inbox/                   Notifications
  legal/                   Terms / privacy / cookies (working drafts)
  marketplace/             Listings + RFP board
  messages/                DB-backed conversations
  opportunities/           Grants · investments · procurement · programmes · gov
  portal/                  Role-aware entrepreneur / funder / corporate portals
  settings/                Role-aware profile · KYC · password · account delete
  setup/                   One-shot schema push + seed (SETUP_TOKEN protected)
  use-cases/               The pitch surface — index + 3 detail pages
  layout.tsx               Root layout with metadata & JSON-LD
  not-found.tsx            Branded 404
  global-error.tsx         Branded 500 boundary
  sitemap.ts               Static + dynamic sitemap
  robots.ts                robots.txt

components/
  auth/                    Sign-up wizard, sign-out
  data-rooms/              Grant / revoke access forms
  hooks/                   usePrefersReducedMotion, etc.
  impact/                  PrintButton, report visuals
  layout/                  Navbar, Footer
  onboarding/              OnboardingCard for each role
  ui/                      Reveal, AnimatedCounter, AnimatedBars, Skeleton,
                           AiChatWidget, CookieConsent, LanguageToggle, …
  use-cases/               26 components for the pitch surface

data/                      Mock content, fallback data, use-case content
lib/
  audit.ts                 Hash-chained audit log
  cron.ts                  Cron secret verification
  db.ts                    Prisma client + DB_ENABLED flag
  email.ts + emailTemplate Resend integration + templates
  env.ts                   Zod-validated env contract
  i18n.ts                  Locale detection
  integrations/            payments · paystack · virusTotal · turnstile · smileId
  queries/                 Reusable Prisma query helpers
  ratelimit.ts             Upstash-based rate limiting
  schemas/                 Zod schemas per surface
  seed.ts                  Idempotent seed
  storage.ts               Vercel Blob + SHA-256 + MIME sniffing

prisma/schema.prisma       23-model schema
tests/                     Vitest suite (37 tests, 6 files)
.github/                   dependabot.yml, workflows/ci.yml
vercel.json                Cron schedules
```

---

## Contributing

Small, scoped PRs. Please:

- Run `npm run lint`, `npm test`, and `npm run build` before pushing.
- Add tests for new business logic (see `tests/` for the pattern).
- Preserve wording discipline in the Use Cases section: never claim outcomes the platform hasn't delivered.
- Update this README when you add a major surface, integration or role.

**Handover** — a comprehensive operator checklist lives in [`HANDOVER_CHECKLIST.md`](./HANDOVER_CHECKLIST.md).

---

<div align="center">

_BHAF Circular Academy & Consulting Firm · MarketBridge_

</div>
