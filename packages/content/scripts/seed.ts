import { createClient } from 'contentful-management';

async function main() {
  const mgmt = createClient(
    { accessToken: process.env['CONTENTFUL_MANAGEMENT_TOKEN']! },
    { type: 'legacy' },
  );
  const space = await mgmt.getSpace(process.env['CONTENTFUL_SPACE_ID']!);
  const env = await space.getEnvironment('master');

  const brand = await env.createEntry('brand', {
    fields: {
      name: { 'en-CA': 'Verdant' },
      slug: { 'en-CA': 'verdant' },
    },
  });
  await brand.publish();

  const hero = await env.createEntry('sectionHero', {
    fields: {
      heading: { 'en-CA': 'Find Your Place in the City' },
      subheading: { 'en-CA': 'Modern rental apartments in the neighbourhoods you love.' },
      ctaText: { 'en-CA': 'Explore Properties' },
      ctaUrl: { 'en-CA': '/verdant/properties' },
    },
  });
  await hero.publish();

  const cta = await env.createEntry('sectionCta', {
    fields: {
      heading: { 'en-CA': 'Ready to See It in Person?' },
      body: { 'en-CA': 'Book a tour with one of our leasing specialists.' },
      ctaText: { 'en-CA': 'Book a Tour' },
      ctaUrl: { 'en-CA': '/verdant/contact' },
    },
  });
  await cta.publish();

  const seo = await env.createEntry('seo', {
    fields: {
      title: { 'en-CA': 'Verdant — Find Your Place in the City' },
      description: { 'en-CA': 'Modern rental apartments in Canadian cities.' },
    },
  });
  await seo.publish();

  const page = await env.createEntry('page', {
    fields: {
      title: { 'en-CA': 'Home' },
      slug: { 'en-CA': 'home' },
      brand: { 'en-CA': { sys: { type: 'Link', linkType: 'Entry', id: brand.sys.id } } },
      seo: { 'en-CA': { sys: { type: 'Link', linkType: 'Entry', id: seo.sys.id } } },
      sections: {
        'en-CA': [
          { sys: { type: 'Link', linkType: 'Entry', id: hero.sys.id } },
          { sys: { type: 'Link', linkType: 'Entry', id: cta.sys.id } },
        ],
      },
    },
  });
  await page.publish();
  console.log('Seed complete');
}

main().catch(console.error);
