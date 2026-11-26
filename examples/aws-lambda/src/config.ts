import { chain, constant, env, switchOn } from '@zack-msyc86/config';
import { parameter, secret } from '@zack-msyc86/config/aws';

const stages = ['local', 'staging', 'production'] as const;
type Stage = (typeof stages)[number];

export const stage = (): Stage => {
  const value = process.env['STAGE'] ?? 'local';
  if (!stages.includes(value as Stage)) {
    throw new Error(`Unknown STAGE: ${value}`);
  }
  return value as Stage;
};

// Read an ARN from an environment variable, then read the secret it points to,
// then take one field out of the secret's JSON.
// `() => Promise<string>`
const databaseUrlFromSecret = chain(env('DATABASE_SECRET_ARN'), (arn) =>
  chain(secret(arn), (json) => () => {
    const { url } = JSON.parse(json) as { url?: unknown };
    if (typeof url !== 'string') throw new Error('The database secret has no url');
    return url;
  }),
);

export const databaseUrl = switchOn(stage, {
  local: env('DATABASE_URL'),
  staging: databaseUrlFromSecret,
  production: databaseUrlFromSecret,
});

// Parameter Store. `() => Promise<string>`
export const featureFlag = switchOn(stage, {
  local: constant('on'),
  staging: parameter('/my-app/staging/feature-flag'),
  production: parameter('/my-app/production/feature-flag'),
});
