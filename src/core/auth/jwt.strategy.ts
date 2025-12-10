/**
 * JWT认证策略模块
 * 
 * 该模块实现了基于JSON Web Token的认证策略，负责从请求中提取JWT令牌，
 * 验证令牌的有效性，并将验证成功的用户信息附加到请求对象中。
 * 作为NestJS认证系统的核心组件，它确保只有携带有效JWT令牌的请求才能访问受保护的资源。
 */

// 导入passport-jwt相关组件，用于JWT令牌的提取和验证
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
// 导入NestJS Passport模块的PassportStrategy装饰器，用于扩展Passport策略
import { PassportStrategy } from '@nestjs/passport';
// 导入NestJS核心组件
import { Injectable, UnauthorizedException } from '@nestjs/common';
// 导入配置服务，用于获取应用配置
import { ConfigService } from '@nestjs/config';
// 导入用户服务，用于验证用户信息
import { UserService } from '@modules/user/user.service';
// 导入Express请求接口类型
import { Request } from 'express';

/**
 * JWT令牌载荷接口定义
 * 
 * 描述JWT令牌中包含的用户信息和元数据字段。
 * 在JWT验证过程中，令牌会被解码为此接口定义的结构。
 */
export interface TokenPayload {
  sub: string;    // 用户ID，JWT标准声明，表示主题
  email: string;  // 用户邮箱，用于标识用户
  role: string;   // 用户角色，用于权限控制
  iat?: number;   // 签发时间，可选字段
  exp?: number;   // 过期时间，可选字段
}

/**
 * JWT认证策略类
 * 
 * 继承自PassportStrategy并配置为使用JWT策略，
 * 通过装饰器指定策略名称为'jwt'，可在@UseGuards(AuthGuard('jwt'))中引用。
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * 构造函数
   * @param configService 配置服务，用于获取JWT密钥等配置信息
   * @param userService 用户服务，用于验证用户存在性和状态
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    // 配置JWT策略选项
    const options: StrategyOptionsWithRequest = {
      // 指定JWT令牌的提取方式：从请求头的Authorization字段中提取Bearer令牌
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 设置是否忽略过期时间：false表示令牌过期后将拒绝验证
      ignoreExpiration: false,
      // 设置JWT签名密钥，从配置服务中获取，确保类型为字符串并提供默认空字符串
      secretOrKey: configService.get<string>('auth.jwtSecret') || '',
      // 设置是否将请求对象传递给validate回调函数：true表示传递请求对象
      passReqToCallback: true,
    };
    
    // 调用父类构造函数，传递配置选项
    super(options);
  }

  /**
   * 验证JWT载荷
   * 
   * 在JWT令牌被成功解码后调用此方法，用于验证用户身份和权限。
   * 如果验证失败，抛出UnauthorizedException；
   * 如果验证成功，返回用户对象，此对象将被附加到请求对象的user属性上。
   * 
   * @param req 请求对象，通过passReqToCallback配置传入
   * @param payload 解码后的JWT令牌载荷，包含用户ID、邮箱、角色等信息
   * @returns 验证成功的用户对象
   * @throws UnauthorizedException 当用户不存在或已被禁用时抛出
   */
  async validate(req: Request, payload: TokenPayload) {
    // 根据JWT载荷中的用户ID查找用户，将字符串转换为数字
    const user = await this.userService.findById(Number(payload.sub));
    // 验证用户是否存在且未被删除
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    // 将验证通过的用户信息附加到请求对象，便于后续中间件和控制器访问
    req.user = user;
    // 返回用户对象，Passport会将此对象添加到请求对象的user属性（与上一行作用相同）
    return user;
  }
}