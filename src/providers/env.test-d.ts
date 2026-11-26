import { describe, expectTypeOf, it } from 'vitest';
import { env } from './env.ts';

describe('env', () => {
  it('yields string', () => {
    expectTypeOf(env('A')).toEqualTypeOf<() => string>();
    expectTypeOf(env('A', { optional: false })).toEqualTypeOf<() => string>();
  });

  it('yields string | undefined when optional', () => {
    expectTypeOf(env('A', { optional: true })).toEqualTypeOf<() => string | undefined>();
  });
});
