import { describe, expectTypeOf, it } from 'vitest';
import { constant } from './constant.ts';

describe('constant', () => {
  it('is synchronous', () => {
    expectTypeOf(constant(1)).toEqualTypeOf<() => number>();
  });
});
