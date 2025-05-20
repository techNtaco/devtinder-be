import os from 'os';

export const isProd = os.hostname().startsWith('ip-');
export const FRONTEND_ORIGIN = isProd
  ? 'http://65.0.95.115'   // replace with your real domain/IP
  : 'http://localhost:5173';
