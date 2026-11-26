import { getSecret } from '@aws-lambda-powertools/parameters/secrets';
import { getParameter } from '@aws-lambda-powertools/parameters/ssm';
import { describe, expect, it, vi } from 'vitest';
import { parameter, secret } from './index.ts';

vi.mock('@aws-lambda-powertools/parameters/secrets', () => ({
  getSecret: vi.fn<() => Promise<unknown>>(),
}));
vi.mock('@aws-lambda-powertools/parameters/ssm', () => ({
  getParameter: vi.fn<() => Promise<unknown>>(),
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

describe('parameter', () => {
  it('returns the decrypted parameter', async () => {
    vi.mocked(getParameter).mockResolvedValue('value');
    await expect(parameter('/name')()).resolves.toBe('value');
    expect(getParameter).toHaveBeenCalledWith('/name', { decrypt: true });
  });

  it('throws when the parameter is not found', async () => {
    vi.mocked(getParameter).mockResolvedValue(undefined);
    await expect(parameter('/name')()).rejects.toThrow('/name');
  });
});
