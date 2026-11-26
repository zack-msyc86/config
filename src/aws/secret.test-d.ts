import { describe, expectTypeOf, it } from 'vitest';
import { secret } from './secret.ts';

describe('secret', () => {
  it('is asynchronous', () => {
    expectTypeOf(secret('a')).toEqualTypeOf<() => Promise<string>>();
  });
});
