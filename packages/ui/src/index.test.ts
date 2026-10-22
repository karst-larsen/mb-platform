import { describe, it, expect } from 'vitest';
import { Hero, CtaBanner } from './index.js';

describe('ui exports', () => {
  it('exports Hero', () => {
    expect(Hero).toBeDefined();
  });
  it('exports CtaBanner', () => {
    expect(CtaBanner).toBeDefined();
  });
});
