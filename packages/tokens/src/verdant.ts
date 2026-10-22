export const verdantTokens = {
  colorPrimary: 'oklch(58% 0.1 155)',
  colorPrimaryDark: 'oklch(42% 0.1 155)',
  colorBackground: 'oklch(98% 0.01 155)',
  colorText: 'oklch(20% 0.02 155)',
  fontFamilyBody: '"DM Sans", system-ui, sans-serif',
  fontFamilyHeading: '"DM Sans", system-ui, sans-serif',
} as const;

export type TokenKey = keyof typeof verdantTokens;

export function toCssVariables(tokens: Record<string, string>): string {
  return Object.entries(tokens)
    .map(([key, val]) => {
      const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `  ${cssVar}: ${val};`;
    })
    .join('\n');
}
