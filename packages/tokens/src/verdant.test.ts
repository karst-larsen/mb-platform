import { describe, it, expect } from 'vitest';
import { toCssVariables, verdantTokens } from './verdant.js';

describe('toCssVariables', () => {
  it('converts camelCase keys to CSS variable names', () => {
    const result = toCssVariables({ colorPrimary: 'red' });
    expect(result).toContain('--color-primary: red');
  });

  it('all verdant tokens compile without throwing', () => {
    expect(() => toCssVariables(verdantTokens)).not.toThrow();
  });
});
