/**
 * A function that returns a value.
 *
 * Anything that follows this shape can be used as a provider: the providers this
 * library ships, the results of combining them, and functions you write yourself.
 */
export type Provider<T> = () => T | Promise<T>;

/** The value a provider yields, after awaiting. */
export type Value<P extends Provider<unknown>> = Awaited<ReturnType<P>>;

/** `true` when any of the providers in `P` may return a promise. */
export type IsAsync<P extends Provider<unknown>> = [
  Extract<ReturnType<P>, PromiseLike<unknown>>,
] extends [never]
  ? false
  : true;

/**
 * The provider made by combining the providers in `P` into one that yields `T`.
 * It is asynchronous if any of them is, and synchronous otherwise.
 */
export type Combined<P extends Provider<unknown>, T> =
  IsAsync<P> extends true ? () => Promise<T> : () => T;
