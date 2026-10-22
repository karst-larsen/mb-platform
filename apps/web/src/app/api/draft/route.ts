import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const brand = searchParams.get('brand');
  const slug = searchParams.get('slug');

  if (secret !== process.env['CONTENTFUL_WEBHOOK_SECRET']) {
    return new Response('Invalid token', { status: 401 });
  }
  if (!brand || !slug) {
    return new Response('Missing parameters', { status: 400 });
  }
  const draft = await draftMode();
  draft.enable();
  redirect(`/${brand}/${slug}`);
}
