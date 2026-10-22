import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs/config';

const config: NextConfig = {
  webpack(webpackConfig) {
    webpackConfig.resolve ??= {};
    webpackConfig.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };
    return webpackConfig;
  },
};

export default withSentryConfig(config, {
  project: process.env['SENTRY_PROJECT'],
  silent: !process.env['CI'],
  widenClientFileUpload: true,
});
