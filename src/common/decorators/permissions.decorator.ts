import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from '@core/casl/casl.types';

export interface RequiredPermission {
  action: Action;
  subject: Subjects;
}

export const CHECK_PERMISSIONS_KEY = 'check_permissions';

/**
 * 权限装饰器，定义访问资源所需的权限
 * @param permissions 权限列表
 * @example
 * @Permissions([{ action: Action.Read, subject: 'User' }])
 */
export const Permissions = (...permissions: RequiredPermission[]) => 
  SetMetadata(CHECK_PERMISSIONS_KEY, permissions);