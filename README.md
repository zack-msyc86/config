# @zack-msyc86/config

Read values given from outside your application in one uniform way, wherever they come from: environment variables, AWS Secrets Manager, Parameter Store, or anything else.

## Install

```sh
pnpm add @zack-msyc86/config
```

To use the AWS providers (`@zack-msyc86/config/aws`), also install [Powertools for AWS Lambda Parameters](https://docs.aws.amazon.com/powertools/typescript/latest/features/parameters/) and the AWS SDK client you need:

```sh
pnpm add @aws-lambda-powertools/parameters @aws-sdk/client-secrets-manager # for secret()
pnpm add @aws-lambda-powertools/parameters @aws-sdk/client-ssm             # for parameter()
```

## Provider

Everything in this library is built on one type:

```ts
type Provider<T> = () => T | Promise<T>;
```

A provider is a function that returns a value. This library gives you:

1. some providers: `constant`, `env`, `secret`, `parameter`
2. functions that combine providers into one provider: `switchOn`, `chain`

Any function of this shape is a provider, so you can write your own and mix it with the ones here.

```ts
import { chain, constant, env, switchOn } from '@zack-msyc86/config';
import { secret } from '@zack-msyc86/config/aws';

const appEnv = (): 'local' | 'test' | 'production' => {
  const value = process.env['APP_ENV'] ?? 'local';
  if (value !== 'local' && value !== 'test' && value !== 'production') {
    throw new Error(`Unknown APP_ENV: ${value}`);
  }
  return value;
};

export const apiKey = switchOn(appEnv, {
  local: env('API_KEY'),
  test: constant('dummy'),
  production: secret('api-key'),
});

const key = await apiKey();
```

## Synchronous and asynchronous

Some places cannot `await`, such as `next.config` or the top level of a module. So a combined provider stays synchronous when every provider in it is synchronous, and becomes asynchronous as soon as one of them is. The types follow this:

```ts
const baseUrl = switchOn(appEnv, {
  local: constant('https://localhost'),
  test: constant('https://example.test'),
  production: env('BASE_URL'),
});
// () => string

const apiKey = switchOn(appEnv, {
  local: env('API_KEY'),
  test: constant('dummy'),
  production: secret('api-key'),
});
// () => Promise<string>
```

A value typed as `Provider<T>` itself is treated as asynchronous, since it may return a promise.

## API

### `constant(value)`

A provider that always returns `value`.

### `env(name, options?)`

A provider that reads the environment variable `name` each time it is called. It throws if the variable is not set.

With `{ optional: true }`, it returns `undefined` instead of throwing.

```ts
env('PORT'); // () => string
env('PORT', { optional: true }); // () => string | undefined
```

### `switchOn(selector, cases)`

Chooses which provider in `cases` to use by the value of `selector`. `cases` must have a provider for every value `selector` can yield. The selector can yield any value, not only environment names:

```ts
const region = (): 'tokyo' | 'osaka' => 'tokyo';

const endpoint = switchOn(region, {
  tokyo: constant('https://tokyo.example.com'),
  osaka: constant('https://osaka.example.com'),
});
```

The value type of the result comes from the providers in `cases` only.

### `chain(p, next)`

Uses the value of `p` to make the next provider:

```ts
const databaseSecret = chain(env('DATABASE_SECRET_ARN'), (arn) => secret(arn));
// () => Promise<string>
```

### `secret(name)` — `@zack-msyc86/config/aws`

Reads a string secret from AWS Secrets Manager by name or ARN, using Powertools' `getSecret` (cached for 5 seconds by default). Throws if the secret is not a string.

### `parameter(name)` — `@zack-msyc86/config/aws`

Reads a parameter from AWS Systems Manager Parameter Store, using Powertools' `getParameter` (cached for 5 seconds by default). SecureString parameters are decrypted. Throws if the parameter is not found.

## Validation

Validation and transformation are not part of this library. If a value needs them, do it inside a provider:

```ts
const port = chain(env('PORT'), (value) => () => {
  const n = Number(value);
  if (!Number.isInteger(n)) throw new Error(`PORT is not an integer: ${value}`);
  return n;
});
// () => number
```

## Examples

- [Node.js](./examples/node): synchronous and asynchronous providers, `switchOn`, `chain`, and a provider you write yourself
- [AWS Lambda](./examples/aws-lambda): Secrets Manager and Parameter Store

## License

MIT
