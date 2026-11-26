import { getSecret } from '@aws-lambda-powertools/parameters/secrets';

/**
 * A provider that reads the secret `name` (a name or ARN) from AWS Secrets Manager as a string.
 *
 * Uses `getSecret` from `@aws-lambda-powertools/parameters`, which caches values for 5 seconds by default.
 * Throws if the secret is not a string.
 */
export const secret =
  (name: string): (() => Promise<string>) =>
  async () => {
    const value = await getSecret(name);
    if (typeof value !== 'string') {
      throw new TypeError(`Secret ${name} is not a string`);
    }
    return value;
  };
