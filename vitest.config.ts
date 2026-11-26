import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
  },
});
