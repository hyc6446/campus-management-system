import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * 角色装饰器，定义访问资源所需的角色
 * @param roles 允许的角色列表
 * @example
 * @Roles('ADMIN', 'TEACHER')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);