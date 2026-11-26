import { describe, expect, it, vi } from 'vitest';
import { env } from './env.ts';

describe('env', () => {
  it('reads the variable when called', () => {
    const p = env('CONFIG_TEST');
    vi.stubEnv('CONFIG_TEST', 'a');
    expect(p()).toBe('a');
  });

  it('throws when the variable is not set', () => {
    vi.stubEnv('CONFIG_TEST', undefined);
    expect(() => env('CONFIG_TEST')()).toThrow('CONFIG_TEST');
  });

  it('returns undefined when optional and not set', () => {
    vi.stubEnv('CONFIG_TEST', undefined);
    expect(env('CONFIG_TEST', { optional: true })()).toBeUndefined();
  });
});
