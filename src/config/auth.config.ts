import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.AUTH_JWT_SECRET || 'e$DYUH9wEy?rycNNC_oj3[XV|v%bUT>HoL!c<0@ryp[',
  jwtExpiresIn: parseInt(process.env.AUTH_JWT_EXPIRATION || '3600000', 10), // 确保添加时间单位
  jwtRefreshSecret: process.env.AUTH_JWT_REFRESH_SECRET || 'J[h2>OwU.+S3(-hYBG[lq89qw!k0]g=op_qv9w_=jB9',
  jwtRefreshExpiresIn: parseInt(process.env.AUTH_JWT_REFRESH_EXPIRES_IN || '604800000', 10), // 7 days in seconds
  bcryptSaltRounds: parseInt(process.env.AUTH_BCRYPT_SALT_ROUNDS || '10000', 10),
  resetTokenExpires: parseInt(process.env.AUTH_RESET_TOKEN_EXPIRES || '3600000', 10), // 1 hour
  maxLoginAttempts: parseInt(process.env.AUTH_MAX_LOGIN_ATTEMPTS || '5', 10),
  lockoutDuration: parseInt(process.env.AUTH_LOCKOUT_DURATION || '3600000', 10), // 1 hour
}));