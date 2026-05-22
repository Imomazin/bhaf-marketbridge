export interface ImpactMetric {
  id: string;
  label: string;
  value: string;
  caption: string;
  trend: string;
}

export const impactMetrics: ImpactMetric[] = [
  {
    id: "women-supported",
    label: "Women supported",
    value: "1,782",
    caption: "Across 6 strategic sectors and 11 countries",
    trend: "+28% vs last reporting cycle",
  },
  {
    id: "jobs-created",
    label: "Jobs created",
    value: "140",
    caption: "Direct and indirect employment recorded by entrepreneurs",
    trend: "+41% year-over-year",
  },
  {
    id: "funding-mobilised",
    label: "Funding mobilised",
    value: "$3.6M",
    caption: "Grants, equity and procurement contracts to date",
    trend: "Across 24 verified deals",
  },
  {
    id: "co2-avoided",
    label: "CO₂ avoided",
    value: "612 t",
    caption: "Annualised, reported by clean energy and circular businesses",
    trend: "Verified by 9 entrepreneurs",
  },
  {
    id: "waste-diverted",
    label: "Waste diverted",
    value: "84 t",
    caption: "Textile, organic and packaging waste diverted from landfill",
    trend: "Quarterly verified figures",
  },
  {
    id: "certifications-issued",
    label: "Certifications issued",
    value: "317",
    caption: "Funding, ESG, circular and market-access certificates",
    trend: "Across 5 certification pathways",
  },
];

export interface SectorImpact {
  sector: string;
  entrepreneurs: number;
  womenSupported: number;
  fundingMobilised: string;
}

export const sectorImpact: SectorImpact[] = [
  { sector: "Circular Economy", entrepreneurs: 38, womenSupported: 412, fundingMobilised: "$840k" },
  { sector: "Clean Energy", entrepreneurs: 21, womenSupported: 286, fundingMobilised: "$1.1M" },
  { sector: "Agri-Processing", entrepreneurs: 46, womenSupported: 524, fundingMobilised: "$780k" },
  { sector: "Health & Beauty", entrepreneurs: 29, womenSupported: 184, fundingMobilised: "$420k" },
  { sector: "Technology", entrepreneurs: 17, womenSupported: 96, fundingMobilised: "$310k" },
  { sector: "Education", entrepreneurs: 14, womenSupported: 280, fundingMobilised: "$150k" },
];
