import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tsconfig from './tsconfig.json';

const SRC_PATH = path.resolve(__dirname, 'src');

const parseTsConfigPaths = (paths: Record<string, string[]>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(paths).map(([alias, paths]) => [alias, path.join(SRC_PATH, paths[0].replace(/[^A-Za-z]/g, ''))]),
  );

// https://vitejs.dev/config/
export default () =>
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: parseTsConfigPaths(tsconfig.compilerOptions.paths),
    },
    server: {
      port: 3000,
    },
  });
