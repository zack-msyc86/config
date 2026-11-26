/** A provider that always returns `value`. */
export const constant =
  <T>(value: T): (() => T) =>
  () =>
    value;
