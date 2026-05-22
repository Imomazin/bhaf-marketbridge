export type ReadinessLevel = "Emerging" | "Developing" | "Market-Ready" | "Funding-Ready";

export interface Entrepreneur {
  id: string;
  name: string;
  country: string;
  sector: string;
  businessName: string;
  description: string;
  fundingNeed: string;
  esgActivity: string;
  readinessLevel: ReadinessLevel;
  products: string[];
  certifications: string[];
  womenSupported: number;
  jobsCreated: number;
  yearFounded: number;
  initials: string;
}

export const entrepreneurs: Entrepreneur[] = [
  {
    id: "amara-okafor",
    name: "Amara Okafor",
    country: "Nigeria",
    sector: "Circular Economy",
    businessName: "GreenWeave Textiles",
    description:
      "Transforms post-consumer textile waste into premium upcycled apparel and home goods, working with a cooperative of 84 women weavers across Lagos and Ibadan.",
    fundingNeed: "$120,000 working capital for export-grade dyeing facility",
    esgActivity:
      "Diverts 6 tonnes of textile waste per quarter; runs water-recycling dye process; trains rural women in textile artistry.",
    readinessLevel: "Funding-Ready",
    products: ["Upcycled apparel", "Handwoven home textiles", "Custom corporate gifting"],
    certifications: ["ESG Documentation Certificate", "Circular Economy Trader Certificate"],
    womenSupported: 84,
    jobsCreated: 31,
    yearFounded: 2019,
    initials: "AO",
  },
  {
    id: "naledi-mokoena",
    name: "Naledi Mokoena",
    country: "South Africa",
    sector: "Agri-Processing",
    businessName: "Khaya Harvest",
    description:
      "A women-led agri-processing enterprise turning surplus indigenous crops into shelf-stable foods sold to regional retailers and export buyers.",
    fundingNeed: "$240,000 expansion capital for processing line and cold storage",
    esgActivity:
      "Sources from 220 smallholder women farmers; reduces post-harvest loss by 38 percent; powered by 60 percent solar energy.",
    readinessLevel: "Market-Ready",
    products: ["Dried indigenous grains", "Cold-pressed marula oil", "Functional food blends"],
    certifications: ["Funding Readiness Certificate", "Market Access Readiness Certificate"],
    womenSupported: 220,
    jobsCreated: 47,
    yearFounded: 2017,
    initials: "NM",
  },
  {
    id: "fatou-diop",
    name: "Fatou Diop",
    country: "Senegal",
    sector: "Clean Energy",
    businessName: "Solara Mini-Grids",
    description:
      "Builds and operates community-owned solar mini-grids in rural Senegal, prioritising women-led cooperatives and clinics for productive-use electricity.",
    fundingNeed: "$500,000 blended finance for two new mini-grid sites",
    esgActivity:
      "Displaces 180 tonnes CO2 annually; powers 14 women cooperatives; clean cooking transition programme.",
    readinessLevel: "Funding-Ready",
    products: ["Community solar mini-grids", "Productive-use equipment financing", "Clean energy advisory"],
    certifications: [
      "ESG Documentation Certificate",
      "Funding Readiness Certificate",
      "Women Enterprise Growth Certificate",
    ],
    womenSupported: 142,
    jobsCreated: 19,
    yearFounded: 2018,
    initials: "FD",
  },
  {
    id: "wanjiru-kamau",
    name: "Wanjiru Kamau",
    country: "Kenya",
    sector: "Health & Beauty",
    businessName: "Acacia Botanicals",
    description:
      "Premium natural skincare brand using ethically sourced East African botanicals, with a women-led supply chain from farm to shelf.",
    fundingNeed: "$80,000 to fulfil first European retail purchase order",
    esgActivity:
      "Pays 28 percent above market rate to women growers; biodegradable packaging; zero-waste lab operations.",
    readinessLevel: "Market-Ready",
    products: ["Botanical skincare line", "Premium body oils", "Hospitality amenity kits"],
    certifications: ["Market Access Readiness Certificate"],
    womenSupported: 96,
    jobsCreated: 22,
    yearFounded: 2020,
    initials: "WK",
  },
  {
    id: "thandiwe-ncube",
    name: "Thandiwe Ncube",
    country: "Zimbabwe",
    sector: "Technology",
    businessName: "Sira Logistics Cloud",
    description:
      "SaaS logistics platform helping women-owned SMEs in Southern Africa manage inventory, fulfilment and cross-border shipping documentation.",
    fundingNeed: "$350,000 seed round for product and go-to-market expansion",
    esgActivity:
      "Digital onboarding reduces paper use by 90 percent; mentors 40 women in tech; remote-first team.",
    readinessLevel: "Funding-Ready",
    products: ["SaaS logistics platform", "Cross-border documentation", "SME fulfilment toolkit"],
    certifications: ["Funding Readiness Certificate", "Women Enterprise Growth Certificate"],
    womenSupported: 40,
    jobsCreated: 12,
    yearFounded: 2021,
    initials: "TN",
  },
  {
    id: "aisha-bello",
    name: "Aisha Bello",
    country: "Ghana",
    sector: "Education",
    businessName: "Lumina Skill Studios",
    description:
      "Vocational micro-academies preparing young women for digital and creative careers, with employer pipelines into BPO and design agencies.",
    fundingNeed: "$60,000 grant funding for two new studio locations",
    esgActivity:
      "1,200 young women trained; 71 percent employment rate; gender-responsive curriculum.",
    readinessLevel: "Developing",
    products: ["Vocational training cohorts", "Employer talent placement", "Corporate upskilling"],
    certifications: ["Women Enterprise Growth Certificate"],
    womenSupported: 1200,
    jobsCreated: 9,
    yearFounded: 2022,
    initials: "AB",
  },
];
