# BHAF MarketBridge — Handover Checklist

The single source of truth for everything **you** need to do that no
code can do for you. Updated each time a new integration ships.

Three buckets:

- 🚀 **Required for the platform to function at all**
- 🛡️ **Required for a credible public launch**
- 📈 **Nice-to-have for growth**

Tick items off as you go. PRs ship code; this file ships ops.

---

## 🚀 Required right now

### Environment variables (Vercel → Settings → Environment Variables)

| Variable | Status | Source | Notes |
|---|---|---|---|
| `DATABASE_URL` | ✅ done | https://neon.tech | Use the **pooled** connection string |
| `AUTH_SECRET` | ✅ done | `openssl rand -base64 32` | Rotate annually |
| `ANTHROPIC_API_KEY` *(or `ClaudeAPIKeyMarketBridge`)* | ✅ done | https://console.anthropic.com | Powers Asha AI assistant |
| `SETUP_TOKEN` | ⏳ rearm to push schema | `openssl rand -hex 32` | Disarm after every schema push |
| `CRON_SECRET` | ⏳ **set this now** | `openssl rand -hex 32` | Authorises Vercel cron jobs |
| `NEXT_PUBLIC_APP_URL` | ⏳ **set this now** | `https://bhaf-marketbridge.vercel.app` | Used for emails + payment callback URLs |

### One-off operations

- [ ] **Push the latest schema** — re-arm `SETUP_TOKEN`, hit `/api/setup?action=push&token=…`, disarm.
- [ ] **Rotate demo passwords** if not already done — `/api/setup?action=rotate&token=…&admin=NewPwd1!&entrepreneur=NewPwd1!&funder=NewPwd1!`.
- [ ] **Sign in as each demo account** and click through the workspace to confirm everything renders.

---

## 🛡️ Required for a credible public launch

### Email (transactional)

- [ ] **Sign up at https://resend.com** (free 3,000/month)
- [ ] Verify your sending domain (e.g. `noreply@bhaf-marketbridge.com`)
- [ ] Vercel env: `RESEND_API_KEY=re_…`
- [ ] Vercel env: `EMAIL_FROM="BHAF MarketBridge <noreply@your-domain.com>"`

Without this, every email (welcome, approval, password reset, application
updates, weekly digest) prints to the server log instead of being delivered.

### File storage (Vercel Blob)

- [ ] Vercel → Storage → Create Blob store
- [ ] `BLOB_READ_WRITE_TOKEN` will be auto-injected — confirm it's there
- [ ] Hit `/portal/entrepreneur` → Document vault → upload a test file → confirm it appears with a real SHA-256

Without this, file uploads only persist metadata; the bytes never reach storage.

### Rate limiting (Upstash Redis)

- [ ] **Sign up at https://upstash.com** (free 10k commands/day)
- [ ] Create a Redis database close to your Neon region
- [ ] Vercel env: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`

Without this the platform falls back to in-memory rate limiting (per-server,
useless on serverless). Critical before any public traffic.

### KYC (Smile ID)

- [ ] **Sign up at https://usesmileid.com** as a corporate customer (BHAF business KYC required)
- [ ] Get sandbox credentials first
- [ ] Vercel env: `SMILE_ID_PARTNER_ID`, `SMILE_ID_API_KEY`, `SMILE_ID_ENVIRONMENT=sandbox`
- [ ] Test the KYC flow from `/settings` → "Identity verification"
- [ ] Switch `SMILE_ID_ENVIRONMENT=production` once you're confident

**Alternative (no signup):** `SMILE_ID_MODE=stub` for deterministic demo
results. Not for real users.

### Antivirus (VirusTotal)

- [ ] **Sign up at https://virustotal.com** → Profile → API Key
- [ ] Vercel env: `VIRUSTOTAL_API_KEY` (free tier = 500/day)

Without this, the AV check on every artefact upload stays PENDING for manual review.

### Payments (pick one to start — recommend Paystack)

#### Paystack — best for Nigeria, Ghana, Kenya, ZA

- [ ] **Sign up at https://paystack.com** with BHAF business documents
- [ ] Get **test** keys first
- [ ] Vercel env: `PAYSTACK_SECRET_KEY=sk_test_…`
- [ ] Vercel env: `PAYSTACK_DEFAULT_CURRENCY=NGN` (or GHS, KES, ZAR)
- [ ] Paystack dashboard → Settings → API & Webhooks → set webhook URL to `https://bhaf-marketbridge.vercel.app/api/webhooks/paystack`
- [ ] Run a test transaction via `/billing` → confirm webhook lands and `/billing/dashboard` shows a PAID invoice
- [ ] Switch to `sk_live_…` once compliance approves your live account

#### Stripe — for global card payments

- [ ] **Sign up at https://stripe.com**
- [ ] Vercel env: `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY`
- [ ] *(Webhook handler not yet wired — Phase 8 only covers Paystack. Stripe is a 2-hour follow-up.)*

#### Flutterwave — for mobile money (M-Pesa, MTN MoMo)

- [ ] **Sign up at https://flutterwave.com**
- [ ] Vercel env: `FLUTTERWAVE_SECRET_KEY` + `FLUTTERWAVE_PUBLIC_KEY`
- [ ] *(Webhook handler not yet wired — same as Stripe.)*

### Cron authorisation

- [ ] Vercel env: `CRON_SECRET` (generate with `openssl rand -hex 32`)
- [ ] Confirm `vercel.json` cron entries appear under Vercel → Settings → Cron Jobs

Three crons run automatically:
- **07:00 UTC daily** — artefact expiry sweep (notifies owners 14 days before expiry, marks EXPIRED past the date)
- **08:00 UTC Mondays** — weekly digest email to every active user
- **09:00 UTC daily** — subscription renewal reminders + CANCELED/PAST_DUE transitions

### Domain & DNS

- [ ] Buy a domain (e.g. `marketbridge.bhaf.org` or `bhaf-marketbridge.com`)
- [ ] Vercel → Project → Settings → Domains → add the domain
- [ ] Update DNS A/CNAME records as Vercel instructs
- [ ] Update `NEXT_PUBLIC_APP_URL` to the real domain
- [ ] Re-issue Paystack webhook URL with the real domain

### Legal & compliance

- [ ] **Engage a lawyer** to review the draft Terms (`/legal/terms`), Privacy Policy (`/legal/privacy`), Cookie Policy (`/legal/cookies`)
- [ ] Set up a **Data Protection Officer** (DPO) — internal designation
- [ ] Register the platform with:
  - [ ] **NDPC** (Nigeria Data Protection Commission) — if processing Nigerian data
  - [ ] **ODPC** (Office of the Data Protection Commissioner, Kenya)
  - [ ] **Information Regulator** (South Africa POPIA)
- [ ] Sign **Data Processing Agreements** (DPAs) with: Resend, Neon, Vercel, Upstash, Smile ID, VirusTotal, Anthropic, payment providers
- [ ] **Privacy Impact Assessment** (PIA) for the platform — internal doc
- [ ] **Trademark filing** for "BHAF MarketBridge" + logo
- [ ] Decide on **business entity domicile** — where MarketBridge is legally registered

### Observability (recommended)

- [ ] **Sign up at https://sentry.io** (free 5,000 events/month)
- [ ] *(SDK to be wired in Phase 13.)*
- [ ] **Sign up at https://posthog.com** (free 1M events/month)
- [ ] *(SDK to be wired in Phase 13.)*

### Security (before public launch)

- [ ] **Penetration test** by a security firm (CREST-accredited if possible) — typically £3k–£10k
- [ ] **Bot protection** — sign up at https://cloudflare.com → Turnstile (free)
  - [ ] Get site key + secret
  - [ ] *(Integration to be wired in Phase 13.)*
- [ ] Sign up for **Snyk** or **Socket** for dependency scanning (free for open-source)

---

## 📈 Nice-to-have for growth

### Analytics & feature flags

- [ ] PostHog feature flags configured for A/B tests
- [ ] Add custom funnel tracking (registration → profile → first artefact → applied to opportunity)

### Photography

- [ ] Get **written consent** from real entrepreneurs to use their photos
- [ ] Replace mock avatar initials with real profile photos
- [ ] Hire a brand photographer for new BHAF events

### Outreach (your job, not the platform's)

- [ ] **First 50 entrepreneurs** — manually invited from existing BHAF cohorts (Abuja, DRC, NYC)
- [ ] **First 3 corporate partners** — relationship sales
- [ ] **First 5 funders** — relationship sales
- [ ] **AFAWA grant application** at AfDB — use the platform as your operating-asset evidence
- [ ] **Mastercard Foundation** — Africa Growth Initiative grant
- [ ] **Visa Foundation** — She's Next initiative

### Operational

- [ ] Customer support inbox (Intercom / Plain / shared email)
- [ ] Status page (Statuspage / Better Stack)
- [ ] On-call rotation if you grow past 10 users
- [ ] Decide BHAF's **moderation team** — who actually approves profiles?
- [ ] Document a **verification SLA** ("BHAF reviews within 48 hours") on the legal page

### Content

- [ ] Real entrepreneur profiles seeded from existing BHAF cohorts
- [ ] Case study repository populated
- [ ] Real opportunities curated weekly
- [ ] Brand voice / copy review by a professional editor

---

## 🟣 Updates from each phase

I add to this file every time a new dependency or integration ships.

- **Phase 1–7** (P0 + P1 items 1–10): listed above
- **Phase 8 (Paystack)**: added webhook URL + currency config
- **Phase 9 (Applications + RFPs)**: no new external dependencies
- **Phase 10 (Cron + this checklist)**: added `CRON_SECRET`, `NEXT_PUBLIC_APP_URL`

Coming up:

- **Phase 11 (SEO + i18n)**: no new external dependencies
- **Phase 12 (Tests + CI/CD)**: GitHub Actions only — no env vars needed unless you add Codecov/Chromatic
- **Phase 13 (Observability + security)**: Sentry, PostHog, Cloudflare Turnstile
- **Phase 14 (Impact reports + data rooms)**: no new external dependencies
- **Phase 15 (Final polish)**: no new external dependencies
