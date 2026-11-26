import { mapMaybePromise } from './internal/map-maybe-promise.ts';
import type { Combined, Provider, Value } from './provider.ts';

/**
 * Chooses which provider to use by the value of `selector`.
 *
 * `cases` must have a provider for every value `selector` can yield.
 * The resulting value type comes from the providers in `cases` only.
 * The result is asynchronous if `selector` or any provider in `cases` is.
 *
 * @example
 * const apiKey = switchOn(appEnv, {
 *   local: env('API_KEY'),
 *   test: constant('dummy'),
 *   production: secret('api-key'),
 * });
 */
export function switchOn<
  S extends Provider<PropertyKey>,
  C extends { readonly [K in Value<S>]: Provider<unknown> },
>(selector: S, cases: C): Combined<S | C[keyof C], Value<C[keyof C]>> {
  return (() => mapMaybePromise(selector(), (key) => cases[key as Value<S>]())) as Combined<
    S | C[keyof C],
    Value<C[keyof C]>
  >;
}
