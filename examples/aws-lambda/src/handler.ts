import { databaseUrl, featureFlag } from './config.ts';

// Values are read on each invocation. Powertools caches Secrets Manager and
// Parameter Store values for 5 seconds by default.
export const handler = async (): Promise<{ statusCode: number; body: string }> => {
  const [url, flag] = await Promise.all([databaseUrl(), featureFlag()]);
  return {
    statusCode: 200,
    body: JSON.stringify({ databaseHost: new URL(url).host, featureFlag: flag }),
  };
};
