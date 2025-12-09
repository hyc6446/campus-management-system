import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  enabled: process.env.SWAGGER_ENABLED === 'true',
  path: process.env.SWAGGER_PATH || 'docs',
  title: process.env.APP_NAME || 'Campus Management System API',
  description: 'API documentation for Campus Management System',
  version: process.env.APP_VERSION || '1.0.0',
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Users', description: 'User management endpoints' },
    { name: 'Health', description: 'Health check endpoints' },
  ],
}));