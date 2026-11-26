import { getSecret } from '@aws-lambda-powertools/parameters/secrets';
import { describe, expect, it, vi } from 'vitest';
import { secret } from './secret.ts';

vi.mock('@aws-lambda-powertools/parameters/secrets', () => ({
  getSecret: vi.fn<() => Promise<unknown>>(),
}));

describe('secret', () => {
  it('returns the secret string', async () => {
    vi.mocked(getSecret).mockResolvedValue('s3cret');
    await expect(secret('name')()).resolves.toBe('s3cret');
    expect(getSecret).toHaveBeenCalledWith('name');
  });

  it('throws when the secret is not a string', async () => {
    vi.mocked(getSecret).mockResolvedValue(new Uint8Array());
    await expect(secret('name')()).rejects.toThrow('name');
  });
});
