import { registerAs } from '@nestjs/config';

// 1. 注册数据库配置 - 用于NestJS Config模块
export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  synchronize: process.env.APP_ENV !== 'production',
  logging: process.env.APP_ENV === 'development',
}));
