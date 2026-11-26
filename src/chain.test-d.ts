import { describe, expectTypeOf, it } from 'vitest';
import { chain } from './chain.ts';
import { constant } from './constant.ts';
import type { Provider } from './provider.ts';

const syncString = (): string => '';
const optionalString = (): string | undefined => undefined;
const asyncString = async (): Promise<string> => '';

describe('chain', () => {
  it('stays synchronous when both are synchronous', () => {
    const p = chain(syncString, (v) => constant(v.length));
    expectTypeOf(p).toEqualTypeOf<() => number>();
  });

  it('passes the value of the first provider', () => {
    chain(optionalString, (v) => {
      expectTypeOf(v).toEqualTypeOf<string | undefined>();
      return constant(v);
    });
  });

  it('becomes asynchronous when the next provider is asynchronous', () => {
    const p = chain(syncString, () => asyncString);
    expectTypeOf(p).toEqualTypeOf<() => Promise<string>>();
  });

  it('becomes asynchronous when the first provider is asynchronous', () => {
    const p = chain(asyncString, (v) => constant(v.length));
    expectTypeOf(p).toEqualTypeOf<() => Promise<number>>();
  });

  it('treats a Provider<T> as asynchronous, since it may return a promise', () => {
    const p: Provider<string> = () => 'a';
    expectTypeOf(chain(p, constant)).toEqualTypeOf<() => Promise<string>>();
  });
});
