import { defineConfig } from 'tsup';
export default defineConfig({
  entry: ['src/cli/index.ts', 'src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  splitting: false,
  target: 'node22',
});
