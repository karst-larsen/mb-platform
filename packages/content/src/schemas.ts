import { z } from 'zod';

export const BrandSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export const SeoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  noIndex: z.boolean().optional(),
});

export const SectionHeroSchema = z.object({
  contentTypeId: z.literal('sectionHero'),
  heading: z.string().min(1),
  subheading: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
});

export const SectionCtaSchema = z.object({
  contentTypeId: z.literal('sectionCta'),
  heading: z.string().min(1),
  body: z.string().optional(),
  ctaText: z.string().min(1),
  ctaUrl: z.string().min(1),
});

export const SectionSchema = z.discriminatedUnion('contentTypeId', [
  SectionHeroSchema,
  SectionCtaSchema,
]);

export const PageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  brand: BrandSchema,
  seo: SeoSchema.optional(),
  sections: z.array(SectionSchema).optional(),
});

export type Brand = z.infer<typeof BrandSchema>;
export type Seo = z.infer<typeof SeoSchema>;
export type SectionHero = z.infer<typeof SectionHeroSchema>;
export type SectionCta = z.infer<typeof SectionCtaSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Page = z.infer<typeof PageSchema>;
