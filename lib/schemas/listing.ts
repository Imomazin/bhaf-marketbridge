import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters.").max(160),
  category: z.string().min(2, "Pick a category.").max(60),
  description: z.string().min(20, "Tell buyers what they're buying — at least 20 characters.").max(4000),
  priceRange: z.string().max(80).optional(),
  minOrder: z.string().max(80).optional(),
  esgHighlight: z.string().max(160).optional(),
  tags: z.string().max(400).optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;
