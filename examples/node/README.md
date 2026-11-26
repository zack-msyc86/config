# Example: Node.js

Shows synchronous and asynchronous providers, `switchOn`, `chain`, and a provider you write yourself.

```sh
pnpm install
pnpm --dir ../.. build   # build @zack-msyc86/config

pnpm start                                  # APP_ENV=local
APP_ENV=test pnpm start
APP_ENV=production BASE_URL=https://example.com API_KEY=xxx pnpm start
```
