import { apiKey, appEnv, baseUrl, port } from './config.ts';

// Synchronous values: no await.
console.log('APP_ENV :', appEnv());
console.log('baseUrl :', baseUrl());
console.log('port    :', port());

// Asynchronous value: await.
console.log('apiKey  :', await apiKey());
