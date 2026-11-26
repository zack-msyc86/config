# Example: AWS Lambda

Reads values from AWS Secrets Manager and Parameter Store with `@zack-msyc86/config/aws`.

- `local`: environment variables and constants only
- `staging` / `production`: a secret (whose ARN comes from an environment variable) and a parameter

This example is type-checked only. Deploy `src/handler.ts` with your tool of choice.

```sh
pnpm install
pnpm --dir ../.. build   # build @zack-msyc86/config
pnpm typecheck
```
