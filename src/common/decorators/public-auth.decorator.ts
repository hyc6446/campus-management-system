import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'is_public';

/**
 * 公共路由装饰器，定义无需权限验证的路由
 * @param isPublic 是否为公共路由，默认值为 true
 * @example
 * @Permissions([{ action: Action.Read, subject: 'User' }])
 */
export const PublicAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
