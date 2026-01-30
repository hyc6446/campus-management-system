
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@app/common/decorators/public-auth.decorator';
import { lastValueFrom } from 'rxjs';

/**
 * JWT认证守卫
 * 继承自Passport的JWT认证守卫，用于保护需要认证的路由
 */
@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(
    private reflector: Reflector
  ) {
    super();
  }
  /**
   * 自定义认证逻辑
   * @param context 执行上下文
   * @returns 是否允许请求通过
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 可以在这里添加额外的自定义逻辑
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 如果路由被标记为公共路由，则直接返回 true
    if(isPublic){
      return true;
    }

    // 调用Passport的JWT认证（会自动使用JwtStrategy）
    // 注意：super.canActivate 会执行完整的认证流程，包括调用 JwtStrategy.validate
    // 认证成功后，用户信息会被设置到 request.user
    const result = await super.canActivate(context) as boolean;
    
    return result;
  }
}