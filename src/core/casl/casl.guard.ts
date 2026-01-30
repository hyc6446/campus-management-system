import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CHECK_PERMISSIONS_KEY } from '@app/common/decorators/permissions.decorator'
import { AppException } from '@app/common/exceptions/app.exception'
import { CaslService } from './casl.service'
import { Action, Subjects } from './casl.types'

interface RequiredPermission {
  action: Action
  subject: Subjects
}

/**
 * CASL权限守卫类
 * 实现NestJS的CanActivate接口，用于路由权限控制
 */
@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslService: CaslService
  ) {}

  /**
   * 检查请求是否可以被激活（是否有权限访问）
   * @param context 执行上下文，包含请求信息和路由处理函数
   * @returns 布尔值，表示是否允许请求通过
   * @throws ForbiddenException 当用户缺少必要权限时抛出
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 从路由处理函数的元数据中提取权限要求
    const permissions = this.reflector.get<RequiredPermission[]>(
      CHECK_PERMISSIONS_KEY,
      context.getHandler()
    )

    // 如果没有定义权限要求，直接放行
    if (!permissions || permissions.length === 0) return true

    // 获取HTTP请求对象和当前用户（由认证守卫设置）
    const request = context.switchToHttp().getRequest()
    const user = request.user
    console.log('user:', user)
    try {
      // 获取用户的能力对象，包含该用户的所有权限规则
      const ability = await this.caslService.getAbility(user)
      // 检查所有要求的权限，确保用户具有所有必要的权限
      const hasAllPermissions = permissions.every(permission => {
        return ability.can(permission.action, permission.subject)
      })
      // 如果用户缺少任一权限，抛出禁止访问异常
      if (!hasAllPermissions) {
        throw new AppException(`没有足够的权限执行操作`, 'PERMISSION_DENIED', HttpStatus.FORBIDDEN)
      }
    } catch (error) {
      throw new AppException(
        `权限检查失败`,
        'PERMISSION_CHECK_FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    // 用户具有所有必要权限，允许请求通过
    return true
  }
}
