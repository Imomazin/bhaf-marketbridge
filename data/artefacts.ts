import type { RoleId } from "./roles";

export type ArtefactStatus =
  | "pending_upload"
  | "pending_review"
  | "under_review"
  | "validated"
  | "rejected"
  | "expires_soon"
  | "expired"
  | "flagged";

export interface ArtefactCheck {
  name: string;
  status: "pass" | "fail" | "warn" | "pending";
  detail?: string;
}

export interface Artefact {
  id: string;
  name: string;
  description: string;
  category: string;
  required: boolean;
  status: ArtefactStatus;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  validatedAt?: string;
  expiresAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  hash?: string;
  checks: ArtefactCheck[];
  requiresDualSignOff?: boolean;
  signOffs?: { admin: string; at: string }[];
}

const HASH_A = "8f4e6b21c2a9d5e3b80f1c4d7a6b91ac3e1f5d62";
const HASH_B = "7a2d09c1b3f4e8d6a5c2b1d8e9f3a0c2b4d6e1f5";
const HASH_C = "3c1e9d7b6a4f5c2e8b1a4d9f7c3e2b1a0d6f8c4e";

// ---------- ENTREPRENEUR ARTEFACTS ----------
export const entrepreneurArtefacts: Artefact[] = [
  {
    id: "biz-reg",
    name: "Business registration certificate",
    description: "Government-issued certificate of incorporation or business registration.",
    category: "Business identity",
    required: true,
    status: "validated",
    fileName: "GreenWeave-RC1284928.pdf",
    fileSize: "1.4 MB",
    uploadedAt: "2026-04-12",
    validatedAt: "2026-04-13",
    expiresAt: "2027-04-12",
    reviewedBy: "BHAF Admin (J. Diop)",
    hash: HASH_A,
    checks: [
      { name: "File integrity", status: "pass" },
      { name: "Format & metadata", status: "pass" },
      { name: "Name matches profile", status: "pass" },
      { name: "Issuing authority verified", status: "pass" },
    ],
  },
  {
    id: "tax-comp",
    name: "Tax compliance certificate",
    description: "Most recent tax compliance certificate from the relevant authority.",
    category: "Business identity",
    required: true,
    status: "under_review",
    fileName: "TaxCompliance-2026Q1.pdf",
    fileSize: "612 KB",
    uploadedAt: "2 hours ago",
    hash: HASH_B,
    checks: [
      { name: "File integrity", status: "pass" },
      { name: "Format & metadata", status: "pass" },
      { name: "Name matches profile", status: "warn", detail: "Trading name variant — confirm" },
      { name: "Issuing authority verified", status: "pending" },
    ],
  },
  {
    id: "dir-kyc",
    name: "Director KYC documents",
    description: "Government-issued ID for all listed company directors.",
    category: "Business identity",
    required: true,
    status: "pending_review",
    fileName: "Directors-KYC-pack.zip",
    fileSize: "4.2 MB",
    uploadedAt: "Yesterday",
    requiresDualSignOff: true,
    hash: HASH_C,
    checks: [
      { name: "File integrity", status: "pass" },
      { name: "Format & metadata", status: "pass" },
      { name: "Liveness check", status: "pending" },
      { name: "Sanctions screening", status: "pending" },
    ],
  },
  {
    id: "esg-evidence",
    name: "ESG evidence pack",
    description: "Environmental, social and governance evidence documenting your practice.",
    category: "ESG & impact",
    required: true,
    status: "rejected",
    fileName: "ESG-evidence-v2.pdf",
    fileSize: "8.7 MB",
    uploadedAt: "3 days ago",
    reviewedBy: "BHAF Admin (F. Mensah)",
    rejectionReason: "Missing quantified outcomes for waste diversion and community impact. Please re-submit with metrics matching the BHAF ESG template.",
    checks: [
      { name: "File integrity", status: "pass" },
      { name: "Required sections present", status: "fail", detail: "2 of 7 sections missing" },
      { name: "Quantified outcomes", status: "fail", detail: "No measurable metrics found" },
    ],
  },
  {
    id: "circular-cert",
    name: "Circular Economy Trader certificate",
    description: "BHAF-issued certification for documented circular practice.",
    category: "ESG & impact",
    required: false,
    status: "validated",
    fileName: "BHAF-CE-Cert-2026-08841.pdf",
    fileSize: "284 KB",
    uploadedAt: "2026-03-04",
    validatedAt: "2026-03-04",
    expiresAt: "2028-03-04",
    reviewedBy: "BHAF SkillHubs",
    checks: [
      { name: "Issued by BHAF", status: "pass" },
      { name: "Holder identity match", status: "pass" },
    ],
  },
  {
    id: "audited-fin",
    name: "Audited financial statements (2 years)",
    description: "Most recent two years of audited financials.",
    category: "Financials",
    required: false,
    status: "validated",
    fileName: "Financials-2024-2025-audited.pdf",
    fileSize: "3.1 MB",
    uploadedAt: "2026-02-18",
    validatedAt: "2026-02-21",
    reviewedBy: "BHAF Admin (J. Diop)",
    checks: [
      { name: "Auditor signature verified", status: "pass" },
      { name: "Period coverage complete", status: "pass" },
      { name: "Cross-checks vs profile", status: "pass" },
    ],
  },
  {
    id: "bank-state",
    name: "Bank statements (last 6 months)",
    description: "Operating account statements for the last six months.",
    category: "Financials",
    required: true,
    status: "pending_upload",
    checks: [],
  },
  {
    id: "insurance",
    name: "Public liability insurance",
    description: "Current public liability insurance certificate.",
    category: "Operations",
    required: false,
    status: "expires_soon",
    fileName: "PLI-2025-renewal.pdf",
    fileSize: "194 KB",
    uploadedAt: "2025-06-10",
    validatedAt: "2025-06-11",
    expiresAt: "2026-06-10",
    reviewedBy: "BHAF Admin (J. Diop)",
    checks: [
      { name: "Issuer verified", status: "pass" },
      { name: "Cover amount adequate", status: "pass" },
      { name: "Expiry warning (14 days)", status: "warn" },
    ],
  },
  {
    id: "prod-cert",
    name: "Product certifications",
    description: "Quality, safety or origin certifications for listed products.",
    category: "Products",
    required: false,
    status: "pending_upload",
    checks: [],
  },
];

// ---------- FUNDER ARTEFACTS ----------
export const funderArtefacts: Artefact[] = [
  {
    id: "fund-kyc",
    name: "Fund KYC pack",
    description: "Beneficial ownership, AML and sanctions screening documents.",
    category: "Compliance",
    required: true,
    status: "validated",
    fileName: "MosaicImpact-KYC-2026.zip",
    fileSize: "6.4 MB",
    uploadedAt: "2026-01-08",
    validatedAt: "2026-01-12",
    expiresAt: "2027-01-08",
    reviewedBy: "BHAF Compliance (M. Adeyemi)",
    hash: HASH_A,
    checks: [
      { name: "Beneficial ownership disclosed", status: "pass" },
      { name: "AML screening", status: "pass" },
      { name: "Sanctions screening", status: "pass" },
      { name: "Regulator standing verified", status: "pass" },
    ],
  },
  {
    id: "mandate",
    name: "Investment mandate document",
    description: "Signed mandate covering sectors, geographies and instrument types.",
    category: "Compliance",
    required: true,
    status: "validated",
    fileName: "Mosaic-Mandate-2026.pdf",
    fileSize: "812 KB",
    uploadedAt: "2026-01-08",
    validatedAt: "2026-01-09",
    reviewedBy: "BHAF Compliance (M. Adeyemi)",
    checks: [
      { name: "Authorised signatory verified", status: "pass" },
      { name: "Sector & geo scope captured", status: "pass" },
    ],
  },
  {
    id: "impact-thesis",
    name: "Impact thesis & reporting framework",
    description: "Documented impact thesis aligned to SDGs and reporting cadence.",
    category: "Impact",
    required: true,
    status: "under_review",
    fileName: "ImpactThesis-2026.pdf",
    fileSize: "1.2 MB",
    uploadedAt: "5 days ago",
    checks: [
      { name: "SDG mapping present", status: "pass" },
      { name: "Reporting cadence defined", status: "pass" },
      { name: "Baseline metrics", status: "pending" },
    ],
  },
  {
    id: "anti-bribery",
    name: "Anti-bribery & corruption policy",
    description: "Board-adopted policy with annual attestation.",
    category: "Governance",
    required: true,
    status: "expires_soon",
    fileName: "ABC-Policy-2025.pdf",
    fileSize: "456 KB",
    uploadedAt: "2025-06-01",
    validatedAt: "2025-06-02",
    expiresAt: "2026-06-01",
    reviewedBy: "BHAF Compliance (M. Adeyemi)",
    checks: [
      { name: "Board adoption recorded", status: "pass" },
      { name: "Annual attestation due", status: "warn" },
    ],
  },
];

// ---------- CORPORATE ARTEFACTS ----------
export const corporateArtefacts: Artefact[] = [
  {
    id: "corp-kyc",
    name: "Corporate KYC pack",
    description: "Beneficial ownership, registration and signatory documents.",
    category: "Compliance",
    required: true,
    status: "validated",
    fileName: "CGA-Corporate-KYC.zip",
    fileSize: "4.8 MB",
    uploadedAt: "2026-02-04",
    validatedAt: "2026-02-06",
    expiresAt: "2027-02-04",
    reviewedBy: "BHAF Compliance (M. Adeyemi)",
    hash: HASH_B,
    checks: [
      { name: "Beneficial ownership disclosed", status: "pass" },
      { name: "Signatories verified", status: "pass" },
      { name: "Sanctions screening", status: "pass" },
    ],
  },
  {
    id: "proc-policy",
    name: "Supplier diversity & procurement policy",
    description: "Current policy covering supplier inclusion and procurement standards.",
    category: "Procurement",
    required: true,
    status: "validated",
    fileName: "CGA-SupplierDiversity-Policy.pdf",
    fileSize: "1.1 MB",
    uploadedAt: "2026-02-04",
    validatedAt: "2026-02-05",
    reviewedBy: "BHAF Procurement",
    checks: [
      { name: "Policy current (≤ 2 years)", status: "pass" },
      { name: "Diversity targets disclosed", status: "pass" },
    ],
  },
  {
    id: "esg-disclosure",
    name: "ESG disclosure framework",
    description: "Disclosure framework (GRI, ISSB, SASB or equivalent).",
    category: "ESG",
    required: true,
    status: "under_review",
    fileName: "ESG-Disclosure-2026.pdf",
    fileSize: "2.3 MB",
    uploadedAt: "Yesterday",
    checks: [
      { name: "Framework recognised", status: "pass" },
      { name: "Materiality assessment", status: "pending" },
      { name: "Assurance provider listed", status: "pending" },
    ],
  },
  {
    id: "buyer-codes",
    name: "Buyer code of conduct",
    description: "Code of conduct covering payment terms, fair dealing and grievance routes.",
    category: "Procurement",
    required: false,
    status: "pending_upload",
    checks: [],
  },
];

// ---------- VERIFICATION QUEUE (ADMIN VIEW) ----------
export interface QueueItem {
  id: string;
  entrepreneur: string;
  business: string;
  artefact: string;
  uploadedAt: string;
  priority: "high" | "medium" | "low";
  autoChecks: { passed: number; total: number; warnings: number };
  requiresDualSignOff: boolean;
  signOffs?: { admin: string; at: string }[];
}

export const verificationQueue: QueueItem[] = [
  {
    id: "q-001",
    entrepreneur: "Amara Okafor",
    business: "GreenWeave Textiles",
    artefact: "Tax compliance certificate",
    uploadedAt: "2 hours ago",
    priority: "high",
    autoChecks: { passed: 2, total: 4, warnings: 1 },
    requiresDualSignOff: false,
  },
  {
    id: "q-002",
    entrepreneur: "Naledi Mokoena",
    business: "Khaya Harvest",
    artefact: "Business registration (re-upload)",
    uploadedAt: "4 hours ago",
    priority: "high",
    autoChecks: { passed: 4, total: 4, warnings: 0 },
    requiresDualSignOff: true,
    signOffs: [{ admin: "J. Diop", at: "1 hour ago" }],
  },
  {
    id: "q-003",
    entrepreneur: "Fatou Diop",
    business: "Solara Mini-Grids",
    artefact: "Director KYC documents",
    uploadedAt: "Yesterday",
    priority: "medium",
    autoChecks: { passed: 3, total: 4, warnings: 0 },
    requiresDualSignOff: true,
    signOffs: [],
  },
  {
    id: "q-004",
    entrepreneur: "Wanjiru Kamau",
    business: "Acacia Botanicals",
    artefact: "ESG evidence pack v3",
    uploadedAt: "Yesterday",
    priority: "medium",
    autoChecks: { passed: 4, total: 4, warnings: 0 },
    requiresDualSignOff: false,
  },
  {
    id: "q-005",
    entrepreneur: "Thandiwe Ncube",
    business: "Sira Logistics Cloud",
    artefact: "Audited financials FY24",
    uploadedAt: "2 days ago",
    priority: "low",
    autoChecks: { passed: 3, total: 3, warnings: 0 },
    requiresDualSignOff: false,
  },
];

// ---------- AUDIT TRAIL ENTRIES ----------
export interface AuditEntry {
  ts: string;
  actor: string;
  action: string;
  artefact?: string;
  hash?: string;
  resultHash?: string;
}

export const auditTrail: AuditEntry[] = [
  {
    ts: "2026-05-24 09:14:22",
    actor: "BHAF Admin (J. Diop)",
    action: "Validated · Business registration · Khaya Harvest (re-upload)",
    artefact: "biz-reg-khaya-v2",
    hash: HASH_B,
    resultHash: HASH_C,
  },
  {
    ts: "2026-05-24 08:42:11",
    actor: "Amara Okafor",
    action: "Uploaded · Tax compliance certificate v3",
    artefact: "tax-comp-greenweave",
    hash: HASH_B,
  },
  {
    ts: "2026-05-23 17:08:54",
    actor: "BHAF Compliance (M. Adeyemi)",
    action: "Re-screened · Anti-bribery policy · Mosaic Impact Partners",
    artefact: "abc-mosaic",
    hash: HASH_A,
  },
  {
    ts: "2026-05-23 16:18:42",
    actor: "BHAF Admin (F. Mensah)",
    action: "Rejected · ESG evidence pack · GreenWeave Textiles · Missing quantified outcomes",
    artefact: "esg-greenweave",
    hash: HASH_C,
  },
  {
    ts: "2026-05-23 14:32:11",
    actor: "Naledi Mokoena",
    action: "Uploaded · Director KYC pack",
    artefact: "kyc-khaya",
    hash: HASH_B,
  },
  {
    ts: "2026-05-23 11:02:30",
    actor: "BHAF System",
    action: "Auto-validation · Insurance certificate · Solara Mini-Grids",
    artefact: "ins-solara",
    hash: HASH_A,
  },
];

// ---------- HELPERS ----------
export const statusLabel: Record<ArtefactStatus, string> = {
  pending_upload: "Not uploaded",
  pending_review: "Awaiting review",
  under_review: "Under review",
  validated: "Validated",
  rejected: "Rejected",
  expires_soon: "Expires soon",
  expired: "Expired",
  flagged: "Flagged",
};

export const statusTone: Record<ArtefactStatus, "neutral" | "info" | "warn" | "ok" | "bad"> = {
  pending_upload: "neutral",
  pending_review: "info",
  under_review: "info",
  validated: "ok",
  rejected: "bad",
  expires_soon: "warn",
  expired: "bad",
  flagged: "warn",
};

export function artefactsForRole(role: RoleId): Artefact[] {
  if (role === "entrepreneur") return entrepreneurArtefacts;
  if (role === "funder") return funderArtefacts;
  if (role === "corporate") return corporateArtefacts;
  return [];
}
