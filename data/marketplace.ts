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

export const marketplaceListings: MarketplaceListing[]  = [];
