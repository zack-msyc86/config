import { getParameter } from '@aws-lambda-powertools/parameters/ssm';

/**
 * A provider that reads the parameter `name` from AWS Systems Manager Parameter Store as a string.
 *
 * SecureString parameters are decrypted. Uses `getParameter` from `@aws-lambda-powertools/parameters`,
 * which caches values for 5 seconds by default.
 * Throws if the parameter is not found.
 */
export const parameter =
  (name: string): (() => Promise<string>) =>
  async () => {
    const value = await getParameter(name, { decrypt: true });
    if (value === undefined) {
      throw new Error(`Parameter ${name} is not found`);
    }
    return value;
  };
