import { describe, expectTypeOf, it } from 'vitest';
import { parameter } from './parameter.ts';

describe('parameter', () => {
  it('is asynchronous', () => {
    expectTypeOf(parameter('a')).toEqualTypeOf<() => Promise<string>>();
  });
});
