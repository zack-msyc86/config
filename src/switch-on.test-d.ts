import { describe, expectTypeOf, it } from 'vitest';
import { constant } from './constant.ts';
import { switchOn } from './switch-on.ts';

const appEnv = (): 'local' | 'test' | 'production' => 'local';
const asyncAppEnv = async (): Promise<'local' | 'production'> => 'local';
const syncString = (): string | undefined => undefined;
const asyncString = async (): Promise<string> => '';

describe('switchOn', () => {
  it('stays synchronous when every provider is synchronous', () => {
    const p = switchOn(appEnv, {
      local: constant('https://localhost'),
      test: constant('https://example.test'),
      production: syncString,
    });
    expectTypeOf(p).toEqualTypeOf<() => string | undefined>();
  });

  it('becomes asynchronous when a case is asynchronous', () => {
    const p = switchOn(appEnv, {
      local: constant('a'),
      test: constant('dummy'),
      production: asyncString,
    });
    expectTypeOf(p).toEqualTypeOf<() => Promise<string>>();
  });

  it('becomes asynchronous when the selector is asynchronous', () => {
    const p = switchOn(asyncAppEnv, {
      local: constant(1),
      production: constant(2),
    });
    expectTypeOf(p).toEqualTypeOf<() => Promise<number>>();
  });

  it('takes its value type from the cases only', () => {
    const p = switchOn(appEnv, {
      local: constant(1),
      test: constant('a'),
      production: constant(true),
    });
    expectTypeOf(p).toEqualTypeOf<() => number | string | boolean>();
  });

  it('requires a case for every value of the selector', () => {
    switchOn(
      appEnv,
      // @ts-expect-error -- `production` is missing
      { local: constant(1), test: constant(2) },
    );
  });

  it('accepts an arbitrary selector', () => {
    const flag = (): 'hoge' | 'fuga' => 'hoge';
    const p = switchOn(flag, { hoge: constant(1), fuga: constant(2) });
    expectTypeOf(p).toEqualTypeOf<() => number>();
  });
});
