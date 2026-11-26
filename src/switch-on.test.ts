import { describe, expect, it, vi } from 'vitest';
import { constant } from './providers/constant.ts';
import { switchOn } from './switch-on.ts';

describe('switchOn', () => {
  it('uses the provider chosen by the selector', () => {
    const p = switchOn(() => 'b' as 'a' | 'b', { a: constant(1), b: constant(2) });
    expect(p()).toBe(2);
  });

  it('returns a plain value when everything is synchronous', () => {
    const p = switchOn(() => 'a' as const, { a: constant(1) });
    expect(p()).not.toBeInstanceOf(Promise);
  });

  it('calls only the chosen provider', () => {
    const other = vi.fn<() => number>(() => 2);
    switchOn(() => 'a' as 'a' | 'b', { a: constant(1), b: other })();
    expect(other).not.toHaveBeenCalled();
  });

  it('awaits an asynchronous selector', async () => {
    const p = switchOn(async () => 'b' as 'a' | 'b', { a: constant(1), b: constant(2) });
    await expect(p()).resolves.toBe(2);
  });

  it('awaits an asynchronous case', async () => {
    const p = switchOn(() => 'a' as const, { a: async () => 1 });
    await expect(p()).resolves.toBe(1);
  });

  it('reads the selector on every call', () => {
    let key: 'a' | 'b' = 'a';
    const p = switchOn(() => key, { a: constant(1), b: constant(2) });
    expect(p()).toBe(1);
    key = 'b';
    expect(p()).toBe(2);
  });
});
