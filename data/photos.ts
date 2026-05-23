export interface BhafPhoto {
  src: string;
  alt: string;
  caption: string;
  event: BhafEvent;
  width: number;
  height: number;
}

export type BhafEvent =
  | "Abuja Accelerator"
  | "BHAF Launch NYC"
  | "DRC Training"
  | "InvestHer Summit"
  | "Baloni Farm Visit";

const base = "/media/bhaf";

export const eventDescriptions: Record<BhafEvent, string> = {
  "Abuja Accelerator":
    "Abuja Accelerator Cohort 1 — readiness training for women-led circular and trade-ready businesses in Nigeria.",
  "BHAF Launch NYC":
    "BHAF Build Her A Future global launch — convened with IPWRA and partners in New York.",
  "DRC Training":
    "Femmes Entrepreneures dans l'Économie Circulaire en RDC — launch and training, Kinshasa.",
  "InvestHer Summit":
    "InvestHer Summit, Dublin Royal Convention Centre — BHAF on the networking and marketplace stage.",
  "Baloni Farm Visit":
    "Entrepreneurs on a live site visit to Baloni Farm — circular economy and agri-processing in practice.",
};

export const photos = {
  // Abuja Accelerator (Nigeria)
  abuja1: photo("abuja-accelerator-1.jpg", "Abuja Accelerator", "Women entrepreneurs taking notes during the Abuja Accelerator Cohort 1 training."),
  abuja2: photo("abuja-accelerator-2.jpg", "Abuja Accelerator", "Cohort 1 in session — readiness training in Abuja."),
  abuja3: photo("abuja-accelerator-3.jpg", "Abuja Accelerator", "Working session at the Abuja Accelerator."),
  abuja4: photo("abuja-accelerator-4.jpg", "Abuja Accelerator", "Panel of entrepreneurs at the Abuja Accelerator launch."),
  abuja5: photo("abuja-accelerator-5.jpg", "Abuja Accelerator", "Speakers addressing the Abuja Accelerator cohort."),
  abuja6: photo("abuja-accelerator-6.jpg", "Abuja Accelerator", "Engagement during the Abuja Accelerator programme."),
  abuja7: photo("abuja-accelerator-7.jpg", "Abuja Accelerator", "Abuja Accelerator Cohort 1 — group portrait."),
  abuja8: photo("abuja-accelerator-8.jpg", "Abuja Accelerator", "Networking moment at the Abuja Accelerator."),
  abuja10: photo("abuja-accelerator-10.jpg", "Abuja Accelerator", "Working session at the Abuja Accelerator."),
  abuja11: photo("abuja-accelerator-11.jpg", "Abuja Accelerator", "Discussion circle at the Abuja Accelerator."),
  abuja12: photo("abuja-accelerator-12.jpg", "Abuja Accelerator", "Keynote at the Abuja Accelerator launch."),
  abuja13: photo("abuja-accelerator-13.jpg", "Abuja Accelerator", "Open Q&A at the Abuja Accelerator."),
  abuja14: photo("abuja-accelerator-14.jpg", "Abuja Accelerator", "Cohort engagement at the Abuja Accelerator."),
  abuja15: photo("abuja-accelerator-15.jpg", "Abuja Accelerator", "Abuja Accelerator delegates."),

  // BHAF Launch NYC
  nyc1: photo("bhaf-launch-nyc-1.jpg", "BHAF Launch NYC", "BHAF global launch — group photo at the United Nations, New York."),
  nyc2: photo("bhaf-launch-nyc-2.jpg", "BHAF Launch NYC", "BHAF Launch NYC — convening women leaders across continents."),
  nyc3: photo("bhaf-launch-nyc-3.jpg", "BHAF Launch NYC", "Panel discussion at the BHAF NYC Launch."),
  nyc4: photo("bhaf-launch-nyc-4.jpg", "BHAF Launch NYC", "Leadership conversation at the BHAF NYC Launch."),
  nyc5: photo("bhaf-launch-nyc-5.jpg", "BHAF Launch NYC", "BHAF Launch NYC — networking with global stakeholders."),

  // DRC Training
  drc1: photo("drc-training-1.jpg", "DRC Training", "Working groups at the DRC FEMEC circular economy training, Kinshasa."),
  drc2: photo("drc-training-2.jpg", "DRC Training", "DRC training — collaborative session."),
  drc3: photo("drc-training-3.jpg", "DRC Training", "DRC training — engaged learning."),
  drc4: photo("drc-training-4.jpg", "DRC Training", "DRC training — peer-to-peer work."),
  drc5: photo("drc-training-5.jpg", "DRC Training", "Certificate ceremony — DRC training cohort with completion certificates."),

  // InvestHer Summit (Dublin)
  ihs1: photo("investher-summit-1.jpg", "InvestHer Summit", "InvestHer Summit, Dublin — BHAF on the networking and marketplace stage."),
  ihs2: photo("investher-summit-2.jpg", "InvestHer Summit", "InvestHer Summit, Dublin — global investor connections."),
  ihs3: photo("investher-summit-3.jpg", "InvestHer Summit", "InvestHer Summit, Dublin — community moment."),

  // Baloni Farm Visit
  baloni1: photo("entrepreneurs-field-visit-to-baloni-farm-1.jpg", "Baloni Farm Visit", "Entrepreneurs touring Baloni Farm — circular economy site visit."),
  baloni2: photo("entrepreneurs-field-visit-to-baloni-farm-2.jpg", "Baloni Farm Visit", "On-site walkthrough at Baloni Farm."),
  baloni3: photo("entrepreneurs-field-visit-to-baloni-farm-3.jpg", "Baloni Farm Visit", "Product showcase at the Baloni Farm visit."),
  baloni4: photo("entrepreneurs-field-visit-to-baloni-farm-4.jpg", "Baloni Farm Visit", "Field activity at Baloni Farm."),
  baloni5: photo("entrepreneurs-field-visit-to-baloni-farm-5.jpg", "Baloni Farm Visit", "Entrepreneurs in conversation at Baloni Farm."),
  baloni6: photo("entrepreneurs-field-visit-to-baloni-farm-6.jpg", "Baloni Farm Visit", "Learning moments at Baloni Farm."),
  baloni7: photo("entrepreneurs-field-visit-to-baloni-farm-7.jpg", "Baloni Farm Visit", "Group photo at Baloni Farm."),
  baloni8: photo("entrepreneurs-field-visit-to-baloni-farm-8.jpg", "Baloni Farm Visit", "Operations tour at Baloni Farm."),
  baloni9: photo("entrepreneurs-field-visit-to-baloni-farm-9.jpg", "Baloni Farm Visit", "Closing moment at the Baloni Farm visit."),
} satisfies Record<string, BhafPhoto>;

export const bhafLogo = {
  src: `${base}/bhaf-logo.jpg`,
  alt: "BHAF Circular Academy & Consulting Firm",
};

export const bhafPartners = {
  src: `${base}/bhaf-partners.jpg`,
  alt: "Growth through partnerships — BHAF partner network including UN Global Compact, Pour Elles, Plastic Odyssey, Global Invest Her, Abuja Accelerator, Congo Circulaire, Baloni, AgriFlex, Livingstones Ecovillage, AALI, UTrader, Level Up Makutano, Eco Nudge DRC, Africa Circular, ACERD, Kuvuna Foundation and the Federal Ministry of Women Affairs.",
};

// Curated photo selections for use across the site
export const galleryHighlights: BhafPhoto[] = [
  photos.nyc1,
  photos.abuja1,
  photos.drc1,
  photos.ihs1,
  photos.baloni1,
  photos.abuja4,
];

function photo(file: string, event: BhafEvent, caption: string): BhafPhoto {
  return {
    src: `${base}/${file}`,
    alt: caption,
    caption,
    event,
    width: 1600,
    height: 1067,
  };
}
