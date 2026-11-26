const isPromiseLike = (x: unknown): x is PromiseLike<unknown> =>
  typeof (x as { then?: unknown } | null)?.then === 'function';

/**
 * Applies `f` to `x`, synchronously when `x` is not a promise.
 * Keeps synchronous providers synchronous after they are combined.
 */
export const mapMaybePromise = <T, U>(
  x: T | PromiseLike<T>,
  f: (v: T) => U,
): U | Promise<Awaited<U>> =>
  isPromiseLike(x) ? (Promise.resolve(x).then(f) as Promise<Awaited<U>>) : f(x);
