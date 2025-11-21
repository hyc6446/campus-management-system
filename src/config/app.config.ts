import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.APP_ENV || 'development',
  port: parseInt(process.env.APP_PORT as string, 10) || 3000,
  host: process.env.APP_HOST || '0.0.0.0',
  prefix: process.env.APP_PREFIX || 'api/v1',
  name: process.env.APP_NAME || 'Campus Management System',
  version: process.env.APP_VERSION || '1.0.0',
}));