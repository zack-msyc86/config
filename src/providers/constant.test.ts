import { describe, expect, it } from 'vitest';
import { constant } from './constant.ts';

describe('constant', () => {
  it('returns the value', () => {
    expect(constant('a')()).toBe('a');
  });
});
