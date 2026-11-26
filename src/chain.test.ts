import { describe, expect, it } from 'vitest';
import { chain } from './chain.ts';
import { constant } from './constant.ts';

describe('chain', () => {
  it('passes the value to make the next provider', () => {
    const p = chain(constant('abc'), (v) => constant(v.length));
    expect(p()).toBe(3);
  });

  it('returns a plain value when everything is synchronous', () => {
    const p = chain(constant(1), (v) => constant(v + 1));
    expect(p()).not.toBeInstanceOf(Promise);
  });

  it('awaits an asynchronous first provider', async () => {
    const p = chain(
      async () => 1,
      (v) => constant(v + 1),
    );
    await expect(p()).resolves.toBe(2);
  });

  it('awaits an asynchronous next provider', async () => {
    const p = chain(constant(1), (v) => async () => v + 1);
    await expect(p()).resolves.toBe(2);
  });
});
