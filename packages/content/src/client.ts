import { createClient } from 'contentful';
import type { Entry, EntryCollection, EntrySkeletonType } from 'contentful';
import { PageSchema, type Page } from './schemas.js';

type RawSkeleton = EntrySkeletonType<Record<string, unknown>, string>;

function extractFields(entry: Entry<RawSkeleton>): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(entry.fields)) {
    if (value && typeof value === 'object' && 'sys' in (value as object)) {
      const linked = (value as unknown) as Entry<RawSkeleton>;
      const sys = linked.sys as { contentType?: { sys: { id: string } } };
      fields[key] = {
        contentTypeId: sys.contentType?.sys.id,
        ...extractFields(linked),
      };
    } else if (Array.isArray(value)) {
      fields[key] = value.map((item: unknown) => {
        if (item && typeof item === 'object' && 'sys' in (item as object)) {
          const linked = (item as unknown) as Entry<RawSkeleton>;
          const sys = linked.sys as { contentType?: { sys: { id: string } } };
          return {
            contentTypeId: sys.contentType?.sys.id,
            ...extractFields(linked),
          };
        }
        return item;
      });
    } else {
      fields[key] = value;
    }
  }
  return fields;
}

function makeDeliveryClient(preview = false) {
  return createClient({
    space: process.env['CONTENTFUL_SPACE_ID'] ?? '',
    accessToken: preview
      ? (process.env['CONTENTFUL_PREVIEW_TOKEN'] ?? '')
      : (process.env['CONTENTFUL_DELIVERY_TOKEN'] ?? ''),
    host: preview ? 'preview.contentful.com' : 'cdn.contentful.com',
  });
}

export async function getPage(
  brandSlug: string,
  slugParts: string[],
  preview = false,
): Promise<Page | null> {
  const client = makeDeliveryClient(preview);
  const pageSlug = slugParts.join('/');

  const query = {
    content_type: 'page',
    'fields.slug': pageSlug,
    include: 3,
    limit: 1,
  } as Parameters<typeof client.getEntries>[0];

  const entries: EntryCollection<RawSkeleton, undefined, string> =
    await client.getEntries(query);

  const entry = entries.items[0];
  if (!entry) return null;

  const raw = extractFields(entry);
  const result = PageSchema.safeParse(raw);

  if (!result.success) {
    console.error('Page schema validation failed:', JSON.stringify(result.error.flatten()));
    return null;
  }

  if (result.data.brand.slug !== brandSlug) return null;

  return result.data;
}

export async function getAllPageSlugs(): Promise<Array<{ brand: string; slug: string[] }>> {
  const client = makeDeliveryClient();

  const query = {
    content_type: 'page',
    include: 1,
    limit: 1000,
  } as Parameters<typeof client.getEntries>[0];

  const entries: EntryCollection<RawSkeleton, undefined, string> =
    await client.getEntries(query);

  return entries.items.map((entry) => {
    const fields = extractFields(entry) as { slug: string; brand: { slug: string } };
    return {
      brand: fields.brand.slug,
      slug: fields.slug.split('/'),
    };
  });
}
