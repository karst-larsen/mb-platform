import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';

const WebhookPayloadSchema = z.object({
  sys: z.object({
    id: z.string(),
    type: z.string(),
    contentType: z.object({ sys: z.object({ id: z.string() }) }).optional(),
  }),
});

function verifySignature(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  if (!auth) return false;
  const expected = Buffer.from(`:${process.env['CONTENTFUL_WEBHOOK_SECRET']}`).toString('base64');
  return auth === `Basic ${expected}`;
}

export async function POST(request: NextRequest) {
  if (!verifySignature(request)) {
    return new Response('Unauthorized', { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }
  const result = WebhookPayloadSchema.safeParse(body);
  if (!result.success) {
    Sentry.captureMessage('Webhook payload validation failed', {
      level: 'warning',
      extra: { errors: result.error.flatten() },
    });
    return new Response('Invalid payload', { status: 422 });
  }
  revalidatePath('/', 'layout');
  return new Response('OK', { status: 200 });
}
