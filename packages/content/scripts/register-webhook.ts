import { createClient } from 'contentful-management';

async function main() {
  const client = createClient(
    { accessToken: process.env['CONTENTFUL_MANAGEMENT_TOKEN']! },
    { type: 'legacy' },
  );
  const space = await client.getSpace(process.env['CONTENTFUL_SPACE_ID']!);
  const webhookUrl = process.env['WEBHOOK_URL']!;
  const webhooks = await space.getWebhooks();
  if (webhooks.items.find((w) => w.url === webhookUrl)) {
    console.log('Already registered:', webhookUrl);
    return;
  }
  await space.createWebhook({
    name: 'mb-platform ISR',
    url: webhookUrl,
    httpBasicPassword: process.env['CONTENTFUL_WEBHOOK_SECRET']!,
    topics: ['Entry.publish', 'Entry.unpublish', 'Entry.archive'],
    filters: [],
    headers: [],
  });
  console.log('Registered:', webhookUrl);
}

main().catch(console.error);
