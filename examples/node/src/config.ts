import { readFile } from 'node:fs/promises';
import { chain, constant, env, switchOn } from '@zack-msyc86/config';

// The selector for switchOn is just a provider that returns a key.
// Checking that the key is valid is up to you.
const appEnvs = ['local', 'test', 'production'] as const;
type AppEnv = (typeof appEnvs)[number];

export const appEnv = (): AppEnv => {
  const value = process.env['APP_ENV'] ?? 'local';
  if (!appEnvs.includes(value as AppEnv)) {
    throw new Error(`Unknown APP_ENV: ${value}`);
  }
  return value as AppEnv;
};

// Every case is synchronous, so this is `() => string`.
// It can be read where you cannot await, such as a config file or the top level of a module.
export const baseUrl = switchOn(appEnv, {
  local: constant('http://localhost:3000'),
  test: constant('http://example.test'),
  production: env('BASE_URL'),
});

// Validation and conversion happen inside a provider.
// `() => number`
export const port = chain(env('PORT', { optional: true }), (value) => () => {
  if (value === undefined) return 3000;
  const n = Number(value);
  if (!Number.isInteger(n)) throw new Error(`PORT is not an integer: ${value}`);
  return n;
});

// Any function that returns a value is a provider. This one reads a file.
const fileContent =
  (path: URL): (() => Promise<string>) =>
  async () =>
    (await readFile(path, 'utf8')).trim();

// One case is asynchronous, so this is `() => Promise<string>`.
export const apiKey = switchOn(appEnv, {
  local: fileContent(new URL('../api-key.local.txt', import.meta.url)),
  test: constant('dummy'),
  production: env('API_KEY'),
});
