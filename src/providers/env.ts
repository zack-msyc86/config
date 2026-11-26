export type EnvOptions = {
  /** When `true`, the provider returns `undefined` instead of throwing if the variable is not set. */
  readonly optional?: boolean;
};

/**
 * A provider that reads the environment variable `name` when called.
 *
 * Throws if the variable is not set, unless `optional: true` is given.
 */
export function env(name: string, options?: { readonly optional?: false }): () => string;
export function env(name: string, options: { readonly optional: true }): () => string | undefined;
export function env(name: string, options?: EnvOptions): () => string | undefined;
export function env(name: string, options?: EnvOptions): () => string | undefined {
  return () => {
    const value = process.env[name];
    if (value === undefined && options?.optional !== true) {
      throw new Error(`Environment variable ${name} is not set`);
    }
    return value;
  };
}
