import os from 'os';

export const isProd = os.hostname().startsWith('ip-');
export const FRONTEND_ORIGIN = isProd
  ? 'http://65.0.95.115'
  : 'http://localhost:5173';
