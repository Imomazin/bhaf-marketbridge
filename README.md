# BHAF MarketBridge

BHAF MarketBridge is a marketplace and impact infrastructure platform for Build Her A Future, BHAF. The platform is designed to help African women entrepreneurs become visible, fundable, market-ready and impact-reporting-ready.

The solution connects women entrepreneurs with markets, funders, corporate partners, certification pathways, ESG documentation support and impact reporting tools.

## Project Purpose

Many African women entrepreneurs are already building strong businesses and practising sustainability, ESG and circular economy principles. However, many struggle to access funding, procurement opportunities and international markets because they lack structured documentation, reporting frameworks, verified profiles and visibility.

BHAF MarketBridge solves this by creating a digital ecosystem where women entrepreneurs can:

- Create structured business profiles
- Showcase their products and services
- Document ESG and sustainability activities
- Build funding-ready profiles
- Access certification and training
- Connect with funders, buyers and corporate partners
- Generate impact evidence and case study material

## Core Product Vision

BHAF MarketBridge will operate as a hybrid social enterprise platform that supports charitable, donor-funded and commercial revenue streams.

The platform will support BHAF across five strategic sectors:

- Circular economy
- Enterprise industry
- Governance
- Funding readiness
- Generative solutions

## Key Platform Modules

### 1. Entrepreneur Directory

A searchable directory of women entrepreneurs across Africa. Each entrepreneur profile will include business information, sector, country, products or services, funding needs, ESG practices, certifications and impact indicators.

### 2. Marketplace

A marketplace where entrepreneurs can list products and services for visibility to buyers, corporates, partners and international market access stakeholders.

The first MVP will focus on listings and enquiries, not full e-commerce checkout.

### 3. Funding Readiness Hub

A structured area where entrepreneurs can complete funding-readiness assessments, upload relevant documents and prepare business profiles for grants, investors, donors and corporate procurement opportunities.

### 4. ESG and Impact Reporting Toolkit

A simple reporting toolkit that helps entrepreneurs capture and communicate sustainability, circular economy and social impact activities.

This will include fields such as:

- Environmental practices
- Waste reduction
- Community impact
- Women supported
- Jobs created
- Revenue growth
- Governance practices
- Funding outcomes

### 5. Training and Certification

A certification layer for entrepreneurs, delivered through SkillHubs. Certification pathways may include:

- Funding Readiness Certificate
- Circular Economy Trader Certificate
- ESG Documentation Certificate
- Market Access Readiness Certificate
- Women Enterprise Growth Certificate

### 6. Corporate and Donor Portal

A dedicated area for donors, funders and corporate partners to discover entrepreneurs, support programmes, request impact reports and identify procurement or partnership opportunities.

### 7. Case Study and Impact Repository

A research and storytelling area where BHAF can publish case studies, impact stories, reports, programme outcomes and donor-facing evidence.

### 8. Admin Dashboard

A management dashboard for BHAF administrators to review entrepreneurs, manage listings, approve profiles, track readiness levels, publish opportunities and monitor impact data.

## User Roles

The platform will support the following user types:

### Women Entrepreneurs

Entrepreneurs can register, create business profiles, list products and services, complete readiness assessments, document impact and apply for opportunities.

### BHAF Administrators

Administrators can manage users, approve listings, track platform activity, review impact data and publish opportunities.

### Funders and Donors

Funders can discover entrepreneurs, view impact evidence and support funding or donor-backed programmes.

### Corporate Partners

Corporate users can identify businesses for procurement, ESG partnerships, sponsorship or supply-chain inclusion.

### Training and Advisory Team

The training team can manage certification pathways, learning content and readiness support.

## MVP Scope

The first MVP should focus on proving the marketplace and funding-readiness concept clearly.

The MVP should include:

- Landing page
- Entrepreneur registration
- Entrepreneur profile creation
- Searchable entrepreneur directory
- Product and service listings
- Funding-readiness form
- ESG and impact self-reporting form
- Opportunity board
- Case study section
- Basic admin dashboard

## MVP User Journey

The first version should demonstrate the following journey:

```text
Register → Create Profile → Document Business and ESG Activity → List Products or Services → Complete Readiness Checklist → Become Visible to Funders, Buyers and Partners
```

## Tech Stack

This MVP is implemented as a modern web application:

- **Next.js 14** with the App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- Clean component-based architecture
- Mobile-responsive design
- Mock data only — no database connection yet

## Project Structure

```
app/                  Next.js App Router pages
  page.tsx            Landing page
  directory/          Entrepreneur directory
  marketplace/        Product and service listings
  opportunities/      Funding, procurement and certification board
  impact/             Impact and ESG reporting
  admin/              BHAF admin dashboard mockup
components/
  layout/             Navbar, Footer
  ui/                 Section header, readiness badge
  cards/              Entrepreneur, marketplace, opportunity, impact, dashboard cards
  forms/              (reserved for future form components)
lib/                  Shared utilities
data/                 Mock data for entrepreneurs, marketplace, opportunities, impact
```

## Running Locally

### Prerequisites

- Node.js 18.17+ (Node.js 20 LTS recommended)
- npm 9+ (or pnpm / yarn)

### Install and run

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Available scripts

| Script          | What it does                                         |
| --------------- | ---------------------------------------------------- |
| `npm run dev`   | Start the Next.js dev server on port 3000            |
| `npm run build` | Build the production bundle                          |
| `npm run start` | Run the production build locally                     |
| `npm run lint`  | Run Next.js / ESLint checks                          |

### Pages to visit

- `/` — Landing page (hero, problem, solution, modules, featured entrepreneurs, partners, impact, CTA)
- `/directory` — Entrepreneur directory with filters
- `/marketplace` — Product and service listings
- `/opportunities` — Grants, investment, procurement, programmes and certifications
- `/impact` — Impact metrics, ESG framework and sector breakdown
- `/admin` — Admin dashboard mockup for BHAF moderators

### Notes for contributors

- Sample data lives in `data/` — replace with real data sources when the database layer is added.
- Visual design uses a premium palette (deep forest green, warm gold, off-white cream and charcoal) defined in `tailwind.config.ts`.
- The MVP is intentionally minimal: no auth, no database, no payment flow. Forms and CTAs are interactive placeholders.
