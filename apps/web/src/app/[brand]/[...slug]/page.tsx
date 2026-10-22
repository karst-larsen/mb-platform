import { notFound } from 'next/navigation';
import { getPage, getAllPageSlugs } from '@mb/content';
import { toCssVariables, verdantTokens } from '@mb/tokens';
import { Hero, CtaBanner } from '@mb/ui';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ brand: string; slug: string[] }>;
}

function getBrandTokenCss(brandSlug: string): string {
  if (brandSlug === 'verdant') {
    return toCssVariables(verdantTokens);
  }
  return '';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand, slug } = await params;
  const page = await getPage(brand, slug);
  if (!page) return {};
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description,
    robots: page.seo?.noIndex ? 'noindex' : undefined,
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllPageSlugs();
    return slugs.map(({ brand, slug }) => ({ brand, slug }));
  } catch {
    return [];
  }
}

export default async function BrandPage({ params }: PageProps) {
  const { brand, slug } = await params;
  const page = await getPage(brand, slug);
  if (!page) notFound();
  const cssVars = getBrandTokenCss(brand);
  return (
    <>
      {cssVars && <style>{`:root {\n${cssVars}\n}`}</style>}
      <main>
        {page.sections?.map((section, i) => {
          if (section.contentTypeId === 'sectionHero') {
            return (
              <Hero
                key={i}
                heading={section.heading}
                subheading={section.subheading}
                ctaText={section.ctaText}
                ctaUrl={section.ctaUrl}
              />
            );
          }
          if (section.contentTypeId === 'sectionCta') {
            return (
              <CtaBanner
                key={i}
                heading={section.heading}
                body={section.body}
                ctaText={section.ctaText}
                ctaUrl={section.ctaUrl}
              />
            );
          }
          return null;
        })}
      </main>
    </>
  );
}
