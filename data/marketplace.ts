export interface MarketplaceListing {
  id: string;
  title: string;
  category: string;
  business: string;
  entrepreneur: string;
  country: string;
  priceRange: string;
  minOrder: string;
  description: string;
  tags: string[];
  esgHighlight: string;
}

export const marketplaceListings: MarketplaceListing[] = [
  {
    id: "upcycled-apparel-collection",
    title: "Upcycled Heritage Apparel Collection",
    category: "Fashion & Textiles",
    business: "GreenWeave Textiles",
    entrepreneur: "Amara Okafor",
    country: "Nigeria",
    priceRange: "$18 – $64 per unit",
    minOrder: "200 units",
    description:
      "Limited-run apparel produced from reclaimed textiles with hand-finished detailing. Available for retail wholesale and corporate gifting programmes.",
    tags: ["Wholesale", "Export-ready", "Circular"],
    esgHighlight: "Diverts 1.2 tonnes of textile waste per order",
  },
  {
    id: "marula-oil-export",
    title: "Cold-Pressed Marula Oil — Export Grade",
    category: "Agri-Processing",
    business: "Khaya Harvest",
    entrepreneur: "Naledi Mokoena",
    country: "South Africa",
    priceRange: "$22 – $28 per litre",
    minOrder: "500 litres",
    description:
      "Single-origin marula oil sourced from 220 smallholder women farmers. Suitable for cosmetics formulators and premium food brands.",
    tags: ["Export", "Single-origin", "Women-sourced"],
    esgHighlight: "220 women farmers in supply chain",
  },
  {
    id: "solar-productive-use-kit",
    title: "Productive-Use Solar Kits for Cooperatives",
    category: "Clean Energy",
    business: "Solara Mini-Grids",
    entrepreneur: "Fatou Diop",
    country: "Senegal",
    priceRange: "$1,200 – $4,800 per kit",
    minOrder: "10 kits",
    description:
      "Turn-key solar productive-use kits for cold storage, milling and processing. Includes installation and operator training.",
    tags: ["Clean energy", "Turn-key", "Rural"],
    esgHighlight: "Avoids 4.5 tonnes CO2 per kit annually",
  },
  {
    id: "hospitality-amenity-kits",
    title: "Hospitality Amenity Kits — Botanical Line",
    category: "Beauty & Wellness",
    business: "Acacia Botanicals",
    entrepreneur: "Wanjiru Kamau",
    country: "Kenya",
    priceRange: "$3.40 – $6.20 per kit",
    minOrder: "1,000 kits",
    description:
      "Premium amenity kits with biodegradable packaging, designed for boutique hotels and lodge operators across East Africa.",
    tags: ["Hospitality", "Eco-packaging", "Premium"],
    esgHighlight: "100 percent biodegradable packaging",
  },
  {
    id: "logistics-saas-license",
    title: "Sira Logistics Cloud — SME Licence",
    category: "Technology Services",
    business: "Sira Logistics Cloud",
    entrepreneur: "Thandiwe Ncube",
    country: "Zimbabwe",
    priceRange: "$45 – $180 per month",
    minOrder: "Annual contract",
    description:
      "Full-stack logistics SaaS for women-owned SMEs with inventory, fulfilment and customs documentation built in.",
    tags: ["SaaS", "Cross-border", "SME"],
    esgHighlight: "Paperless customs documentation",
  },
  {
    id: "corporate-upskilling-cohort",
    title: "Corporate Upskilling Cohort — Digital Careers",
    category: "Training",
    business: "Lumina Skill Studios",
    entrepreneur: "Aisha Bello",
    country: "Ghana",
    priceRange: "$8,000 – $24,000 per cohort",
    minOrder: "1 cohort (20 learners)",
    description:
      "Custom upskilling cohorts for corporates investing in gender-balanced talent pipelines across digital and creative careers.",
    tags: ["Training", "Talent pipeline", "ESG"],
    esgHighlight: "71 percent placement of women learners",
  },
];
