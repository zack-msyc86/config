import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/aws/index.ts'],
  format: 'esm',
  dts: true,
  unbundle: true,
});
