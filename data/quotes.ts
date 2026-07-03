/**
 * Placeholder testimonial slots for the Use Cases quote carousel.
 * Real quotes and named attributions will be added once BHAF has
 * consent from named partners. Each entry is clearly labelled as
 * a placeholder role, not a specific individual.
 */

export interface QuoteSlot {
  body: string;
  role: string;
  region: string;
  stakeholder: "Entrepreneur" | "Buyer" | "Funder" | "Partner";
}

export const quoteSlots: QuoteSlot[] = [
  {
    body:
      "A structured, verified profile changed the way buyers took me seriously. Enquiries stopped getting lost — they arrived with context.",
    role: "Placeholder · Growth-stage entrepreneur",
    region: "DRC · Bukavu",
    stakeholder: "Entrepreneur",
  },
  {
    body:
      "The RFP flow gave us comparable responses from verified women-led suppliers we would never have found through our usual channels.",
    role: "Placeholder · Public-sector procurement lead",
    region: "Europe-facing",
    stakeholder: "Buyer",
  },
  {
    body:
      "Data rooms cut our diligence time meaningfully — evidence in one place, tamper-evident, with clear expiry.",
    role: "Placeholder · Investment officer",
    region: "Pan-African DFI",
    stakeholder: "Funder",
  },
  {
    body:
      "MarketBridge gave our cohort a shared spine — verification, listings, reporting, all in one platform BHAF can operate.",
    role: "Placeholder · Programme partner",
    region: "West Africa",
    stakeholder: "Partner",
  },
];
