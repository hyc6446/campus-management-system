import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '@common/decorators/roles.decorator'
import { AppException } from '@app/common/exceptions/app.exception';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles || requiredRoles.length === 0) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user) {
      throw new AppException('用户未认证', 'USER_NOT_AUTHENTICATED', HttpStatus.UNAUTHORIZED)
    }

    if (!user.role) {
      throw new AppException('用户角色信息缺失', 'USER_ROLE_MISSING', HttpStatus.NOT_FOUND)
    }

    // 检查用户角色是否在允许的角色列表中
    const hasRole = requiredRoles.some(role => role === user.role.name)

    if (!hasRole) {
      throw new AppException('没有足够的角色权限', 'INSUFFICIENT_ROLES', HttpStatus.FORBIDDEN)
    }

    return true
  }
}
