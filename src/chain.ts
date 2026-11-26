import { mapMaybePromise } from './internal/map-maybe-promise.ts';
import type { Combined, Provider, Value } from './provider.ts';

/**
 * Uses the value of `p` to make the next provider, and returns that provider's value.
 * The result is asynchronous if `p` or the provider made by `next` is.
 *
 * @example
 * const databaseSecret = chain(env('DATABASE_SECRET_ARN'), (arn) => secret(arn));
 */
export function chain<P extends Provider<unknown>, Q extends Provider<unknown>>(
  p: P,
  next: (value: Value<P>) => Q,
): Combined<P | Q, Value<Q>> {
  return (() => mapMaybePromise(p(), (value) => next(value as Value<P>)())) as Combined<
    P | Q,
    Value<Q>
  >;
}
