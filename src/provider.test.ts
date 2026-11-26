import { describe, expect, it, vi } from 'vitest';
import { chain, constant, env, switchOn } from './index.ts';

describe('constant', () => {
  it('returns the value', () => {
    expect(constant('a')()).toBe('a');
  });
});

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
