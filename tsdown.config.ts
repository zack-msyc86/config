import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/providers/aws/index.ts'],
  format: 'esm',
  dts: true,
  unbundle: true,
});
