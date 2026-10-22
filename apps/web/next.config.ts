import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs/config';

const config: NextConfig = {};

export default withSentryConfig(config, {
  project: process.env['SENTRY_PROJECT'],
  silent: !process.env['CI'],
  widenClientFileUpload: true,
});
