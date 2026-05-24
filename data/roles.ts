export type RoleId = "entrepreneur" | "funder" | "corporate" | "admin";

export interface Role {
  id: RoleId;
  label: string;
  shortLabel: string;
  tagline: string;
  description: string;
  href: string;
  accent: "forest" | "gold" | "navy" | "charcoal";
  primaryActions: string[];
  signInLabel: string;
}

export const roles: Role[] = [
  {
    id: "entrepreneur",
    label: "Women Entrepreneurs",
    shortLabel: "Entrepreneur",
    tagline: "Become visible, fundable and market-ready.",
    description:
      "Build a verified profile, list products, document ESG activity and unlock readiness tiers that attract funders, buyers and corporate partners.",
    href: "/portal/entrepreneur",
    accent: "gold",
    primaryActions: [
      "Create or update your business profile",
      "Document ESG and impact activity",
      "List products and services",
      "Apply to grants and procurement opportunities",
    ],
    signInLabel: "Continue as entrepreneur",
  },
  {
    id: "funder",
    label: "Funders & Donors",
    shortLabel: "Funder",
    tagline: "A trusted pipeline of investable women-led businesses.",
    description:
      "Discover verified entrepreneurs by readiness tier, shortlist for cohorts and deals, and pull donor-grade impact reports straight from live platform data.",
    href: "/portal/funder",
    accent: "forest",
    primaryActions: [
      "Discover entrepreneurs by readiness tier",
      "Build shortlists and pipelines",
      "Track committed and deployed capital",
      "Pull donor-grade impact reports",
    ],
    signInLabel: "Continue as funder",
  },
  {
    id: "corporate",
    label: "Corporate Partners",
    shortLabel: "Corporate",
    tagline: "Source ESG-aligned suppliers and partners.",
    description:
      "Procurement, supplier diversity and ESG teams can surface verified women-led suppliers, run RFPs and document supplier inclusion outcomes.",
    href: "/portal/corporate",
    accent: "navy",
    primaryActions: [
      "Source verified women-led suppliers",
      "Run sponsored cohorts and challenges",
      "Track supplier diversity metrics",
      "Document ESG and impact outcomes",
    ],
    signInLabel: "Continue as corporate",
  },
  {
    id: "admin",
    label: "BHAF Administrators",
    shortLabel: "Admin",
    tagline: "Moderate, publish and report on the network.",
    description:
      "BHAF staff approve profiles, publish opportunities, manage cohorts and oversee network-wide impact reporting.",
    href: "/admin",
    accent: "charcoal",
    primaryActions: [
      "Approve entrepreneur profiles and listings",
      "Publish opportunities and cohorts",
      "Monitor readiness pipeline",
      "Compile programme and impact reports",
    ],
    signInLabel: "BHAF administrator sign-in",
  },
];

export const roleById = Object.fromEntries(roles.map((r) => [r.id, r])) as Record<RoleId, Role>;

export const accentClasses: Record<
  Role["accent"],
  { bg: string; text: string; ring: string; chip: string; gradient: string }
> = {
  forest: {
    bg: "bg-forest-800",
    text: "text-forest-900",
    ring: "ring-forest-200",
    chip: "bg-forest-50 text-forest-800 border border-forest-200",
    gradient: "from-forest-800 to-forest-900",
  },
  gold: {
    bg: "bg-gold-500",
    text: "text-gold-800",
    ring: "ring-gold-200",
    chip: "bg-gold-50 text-gold-800 border border-gold-200",
    gradient: "from-gold-500 to-gold-700",
  },
  navy: {
    bg: "bg-[#0d2840]",
    text: "text-[#0d2840]",
    ring: "ring-blue-200",
    chip: "bg-blue-50 text-[#0d2840] border border-blue-200",
    gradient: "from-[#102d4a] to-[#071a2c]",
  },
  charcoal: {
    bg: "bg-charcoal-800",
    text: "text-charcoal-800",
    ring: "ring-charcoal-200",
    chip: "bg-charcoal-50 text-charcoal-700 border border-charcoal-200",
    gradient: "from-charcoal-700 to-charcoal-900",
  },
};
