import { registerAs } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  synchronize: process.env.APP_ENV !== 'production',
  logging: process.env.APP_ENV === 'development',
}));

export const prisma = new PrismaClient({
  log: process.env.APP_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});