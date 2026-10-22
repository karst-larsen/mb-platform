import { createClient } from 'contentful-management';

async function main() {
  const client = createClient(
    { accessToken: process.env['CONTENTFUL_MANAGEMENT_TOKEN']! },
    { type: 'legacy' },
  );
  const space = await client.getSpace(process.env['CONTENTFUL_SPACE_ID']!);
  const env = await space.getEnvironment('master');
  const existing = await env.getLocales();
  if (existing.items.some((l) => l.code === 'fr-CA')) {
    console.log('fr-CA already exists');
    return;
  }
  await env.createLocale({
    name: 'French (Canada)',
    code: 'fr-CA',
    fallbackCode: 'en-CA',
    optional: true,
  });
  console.log('Created fr-CA locale');
}

main().catch(console.error);
