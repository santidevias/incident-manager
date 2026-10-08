import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: (typeof process !== 'undefined' && process.env)
    ? (process.env["API_URL"] || 'http://localhost:3000/api/v1')
    : 'http://localhost:3000/api/v1',
  version: '1.0.1',
  year: '2026',
};
