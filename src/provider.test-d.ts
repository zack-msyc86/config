import { describe, expectTypeOf, it } from 'vitest';
import { parameter, secret } from './aws/index.ts';
import { chain, constant, env, type Provider, switchOn } from './index.ts';

const appEnv = (): 'local' | 'test' | 'production' => 'local';
const asyncAppEnv = async (): Promise<'local' | 'production'> => 'local';

describe('constant', () => {
  it('is synchronous', () => {
    expectTypeOf(constant(1)).toEqualTypeOf<() => number>();
  });
});

describe('env', () => {
  it('yields string', () => {
    expectTypeOf(env('A')).toEqualTypeOf<() => string>();
    expectTypeOf(env('A', { optional: false })).toEqualTypeOf<() => string>();
  });

  it('yields string | undefined when optional', () => {
    expectTypeOf(env('A', { optional: true })).toEqualTypeOf<() => string | undefined>();
  });
});

describe('aws', () => {
  it('is asynchronous', () => {
    expectTypeOf(secret('a')).toEqualTypeOf<() => Promise<string>>();
    expectTypeOf(parameter('a')).toEqualTypeOf<() => Promise<string>>();
  });
});

describe('switchOn', () => {
  it('stays synchronous when every provider is synchronous', () => {
    const p = switchOn(appEnv, {
      local: constant('https://localhost'),
      test: constant('https://example.test'),
      production: env('URL', { optional: true }),
    });
    expectTypeOf(p).toEqualTypeOf<() => string | undefined>();
  });

  it('becomes asynchronous when a case is asynchronous', () => {
    const p = switchOn(appEnv, {
      local: env('KEY'),
      test: constant('dummy'),
      production: secret('key'),
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

describe('chain', () => {
  it('stays synchronous when both are synchronous', () => {
    const p = chain(env('NAME'), (name) => constant(name.length));
    expectTypeOf(p).toEqualTypeOf<() => number>();
  });

  it('passes the value of the first provider', () => {
    chain(env('NAME', { optional: true }), (name) => {
      expectTypeOf(name).toEqualTypeOf<string | undefined>();
      return constant(name);
    });
  });

  it('becomes asynchronous when the next provider is asynchronous', () => {
    const p = chain(env('ARN'), (arn) => secret(arn));
    expectTypeOf(p).toEqualTypeOf<() => Promise<string>>();
  });

  it('becomes asynchronous when the first provider is asynchronous', () => {
    const p = chain(secret('a'), (v) => constant(v.length));
    expectTypeOf(p).toEqualTypeOf<() => Promise<number>>();
  });
});

describe('Provider', () => {
  it('is treated as asynchronous, since it may return a promise', () => {
    const p: Provider<string> = () => 'a';
    expectTypeOf(chain(p, constant)).toEqualTypeOf<() => Promise<string>>();
  });
});
