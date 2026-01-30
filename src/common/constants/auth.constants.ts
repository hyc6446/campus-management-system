/**
 * 认证缓存键常量
 * 定义了用于存储用户刷新令牌的缓存键格式
 */
export const AUTH_CACHE_KEY = (userId: number) => `refresh_token:${userId}`

