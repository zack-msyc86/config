import { getParameter } from '@aws-lambda-powertools/parameters/ssm';
import { describe, expect, it, vi } from 'vitest';
import { parameter } from './parameter.ts';

vi.mock('@aws-lambda-powertools/parameters/ssm', () => ({
  getParameter: vi.fn<() => Promise<unknown>>(),
}));

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
