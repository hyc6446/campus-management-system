
// 导入passport-local策略，用于用户名密码验证
import { Strategy } from 'passport-local';
// 导入NestJS Passport装饰器，用于扩展Passport策略
import { PassportStrategy } from '@nestjs/passport';
// 导入NestJS核心组件
import { Injectable, UnauthorizedException } from '@nestjs/common';
// 导入认证服务，提供用户验证功能
import { AuthService } from './auth.service';
// 导入用户实体类型
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * 构造函数
   * @param authService 认证服务，用于实际的用户凭据验证
   */
  constructor(private authService: AuthService) {
    // 调用父类构造函数，配置本地策略选项
    super({
      // 自定义用户名字段为'email'，默认为'username'
      // 这意味着请求体中应包含'email'字段作为用户标识
      usernameField: 'email',
      // 自定义密码字段为'password'，这是默认值
      // 明确指定以增强代码可读性
      passwordField: 'password',
    });
  }

  /**
   * 验证用户凭据
   * 
   * 这是Passport策略的核心方法，当使用@UseGuards(AuthGuard('local'))时，
   * Passport会自动调用此方法来验证请求中的凭据。
   * 
   * @param email 从请求体中提取的邮箱地址（对应usernameField配置）
   * @param password 从请求体中提取的密码（对应passwordField配置）
   * @returns 验证成功返回用户对象，Passport会将此对象附加到请求的user属性上
   * @throws UnauthorizedException 当凭据验证失败时抛出
   */
  // TODO 优化异常处理，返回自定义错误信息
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('无效的邮箱或密码');
    }
    
    return user;
  }
}